import React, { useState, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Download,
  ExternalLink,
  Upload,
  Image as ImageIcon,
  Check,
  Loader2,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ImageViewer({
  file,
  repo,
  onReplaceImage,
  showNotice
}) {
  const [zoom, setZoom] = useState(1);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [loadingImg, setLoadingImg] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [bgStyle, setBgStyle] = useState('checker'); // 'checker' | 'dark' | 'light'

  // Modal to replace image
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [replacementFile, setReplacementFile] = useState(null);
  const [commitMsg, setCommitMsg] = useState(`Update image: ${file.name}`);
  const [replacing, setReplacing] = useState(false);

  const imgRef = useRef(null);

  // Compute image source URL: data_url first, then download_url, then fallback
  const imgSrc = file.data_url || file.download_url || (
    file.raw_content && file.raw_content.startsWith('data:image')
      ? file.raw_content
      : file.content && file.content.startsWith('data:image')
      ? file.content
      : file.download_url
  );

  useEffect(() => {
    setZoom(1);
    setLoadingImg(true);
    setImgError(false);
  }, [file.path, file.sha]);

  const handleImageLoaded = (e) => {
    setLoadingImg(false);
    setDimensions({
      width: e.target.naturalWidth || 0,
      height: e.target.naturalHeight || 0
    });
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.25));
  const handleZoomReset = () => setZoom(1);

  const handleDownload = () => {
    if (!imgSrc) return;
    const a = document.createElement('a');
    a.href = imgSrc;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (showNotice) showNotice(`Downloading ${file.name}...`);
  };

  const handleOpenRaw = () => {
    if (file.download_url) {
      window.open(file.download_url, '_blank');
    } else if (imgSrc) {
      const w = window.open('');
      w.document.write(`<img src="${imgSrc}" style="max-width:100%;" />`);
    }
  };

  const handleReplaceSubmit = async (e) => {
    e.preventDefault();
    if (!replacementFile) return;

    try {
      setReplacing(true);
      if (onReplaceImage) {
        await onReplaceImage(replacementFile, commitMsg);
        setShowReplaceModal(false);
        setReplacementFile(null);
        confetti({ particleCount: 45, spread: 60 });
      }
    } catch (err) {
      if (showNotice) showNotice('Failed to replace image: ' + err.message, 'error');
    } finally {
      setReplacing(false);
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const ext = file.name.split('.').pop()?.toUpperCase() || 'IMAGE';

  return (
    <div className="flex flex-col bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-slate-800">
      {/* Top Floating Control Bar */}
      <div className="px-5 py-3 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300 z-10">
        <div className="flex items-center gap-3">
          <span className="font-bold text-white px-2 py-0.5 rounded bg-orange-500/20 text-[#FF5A00] border border-orange-500/30">
            {ext}
          </span>
          <span className="text-slate-400">
            {dimensions.width > 0 ? `${dimensions.width} × ${dimensions.height} px` : ''}
          </span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">{formatBytes(file.size)}</span>
        </div>

        {/* Zoom & Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Zoom controls */}
          <div className="flex items-center bg-slate-800/80 rounded-xl p-1 border border-slate-700/60">
            <button
              onClick={handleZoomOut}
              className="p-1 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-[11px] font-mono text-slate-300 min-w-[42px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomReset}
              className="p-1 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors ml-1 border-l border-slate-700 pl-1.5"
              title="Reset Zoom (100%)"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Background toggle */}
          <div className="hidden sm:flex items-center bg-slate-800/80 rounded-xl p-1 border border-slate-700/60 text-[10px] font-semibold">
            <button
              onClick={() => setBgStyle('checker')}
              className={`px-2 py-0.5 rounded-lg transition-colors ${
                bgStyle === 'checker' ? 'bg-[#FF5A00] text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Checkerboard pattern (reveals transparency)"
            >
              Grid
            </button>
            <button
              onClick={() => setBgStyle('dark')}
              className={`px-2 py-0.5 rounded-lg transition-colors ${
                bgStyle === 'dark' ? 'bg-[#FF5A00] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Dark
            </button>
            <button
              onClick={() => setBgStyle('light')}
              className={`px-2 py-0.5 rounded-lg transition-colors ${
                bgStyle === 'light' ? 'bg-[#FF5A00] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Light
            </button>
          </div>

          {/* Action buttons */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors border border-slate-700"
            title="Download image file"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </button>

          {file.download_url && (
            <button
              onClick={handleOpenRaw}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
              title="Open raw image in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}

          {onReplaceImage && (
            <button
              onClick={() => setShowReplaceModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF5A00] hover:bg-[#E04F00] text-white font-bold transition-all shadow-md shadow-orange-500/20"
              title="Commit a replacement image"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Replace Image</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Image Stage Canvas */}
      <div
        className={`relative w-full min-h-[420px] max-h-[640px] flex items-center justify-center p-6 overflow-auto transition-colors ${
          bgStyle === 'checker'
            ? 'bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] bg-slate-900'
            : bgStyle === 'dark'
            ? 'bg-slate-950'
            : 'bg-white'
        }`}
      >
        {loadingImg && !imgError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-900/40 backdrop-blur-sm z-10">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF5A00] mb-2" />
            <p className="text-xs font-semibold">Loading image preview...</p>
          </div>
        )}

        {imgError ? (
          <div className="text-center p-8 text-slate-400">
            <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-200">Unable to preview image directly</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              The image source could not be decoded. You can download or view the raw image on GitHub.
            </p>
            {file.download_url && (
              <a
                href={file.download_url}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF5A00] hover:bg-[#E04F00] text-white text-xs font-bold rounded-xl"
              >
                <span>Open Raw on GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        ) : (
          <div
            className="transition-transform duration-150 ease-out flex items-center justify-center max-w-full"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
          >
            <img
              ref={imgRef}
              src={imgSrc}
              alt={file.name}
              onLoad={handleImageLoaded}
              onError={() => {
                setLoadingImg(false);
                setImgError(true);
              }}
              className="max-h-[520px] max-w-full object-contain rounded-lg shadow-2xl ring-1 ring-white/10 select-none"
            />
          </div>
        )}
      </div>

      {/* Modal: Replace Image */}
      {showReplaceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 w-full max-w-md shadow-2xl text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Replace {file.name}</h3>
              <button
                onClick={() => setShowReplaceModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReplaceSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select New Image File
                </label>
                <input
                  type="file"
                  required
                  accept="image/*"
                  onChange={(e) => setReplacementFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-orange-50 file:text-[#FF5A00] hover:file:bg-orange-100 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Commit Message
                </label>
                <input
                  type="text"
                  required
                  value={commitMsg}
                  onChange={(e) => setCommitMsg(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#FF5A00] focus:ring-2 focus:ring-[#FF5A00]/15"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReplaceModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={replacing || !replacementFile}
                  className="flex items-center gap-1.5 px-5 py-2 bg-[#FF5A00] hover:bg-[#E04F00] text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all disabled:opacity-50"
                >
                  {replacing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  <span>{replacing ? 'Committing...' : 'Commit New Image'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
