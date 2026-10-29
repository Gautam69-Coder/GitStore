import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRepo } from '../../context/RepoContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  UploadCloud,
  FileText,
  FileCode,
  FileUp,
  FolderGit2,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
  Loader2,
  Folder,
  PenTool,
  Lock,
  Globe
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DirectNotesUploader() {
  const { repos, isDemo, setFileTrees, setActivities } = useRepo();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mode: 'upload' (files) | 'quicknote' (write inline)
  const [mode, setMode] = useState('upload');

  // Selected Repository
  const [selectedRepoName, setSelectedRepoName] = useState(() => {
    const preferred = repos.find(r => r.name === 'notes-app' || r.name === 'student-hub');
    return preferred ? preferred.name : (repos[0]?.name || '');
  });

  // Target directory inside repo
  const [targetDir, setTargetDir] = useState('notes');
  const [commitMessage, setCommitMessage] = useState('docs: upload notes via GitStore');

  // Upload files state
  const [stagedFiles, setStagedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [error, setError] = useState(null);

  // Quick note state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  const fileInputRef = useRef(null);

  // Selected repo object
  const activeRepo = repos.find(r => r.name === selectedRepoName) || repos[0];

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (newFiles) => {
    setStagedFiles((prev) => {
      const existingNames = new Set(prev.map(f => f.name));
      const filtered = newFiles.filter(f => !existingNames.has(f.name));
      return [...prev, ...filtered];
    });
    setUploadSuccess(null);
    setError(null);
  };

  const removeStagedFile = (filename) => {
    setStagedFiles(prev => prev.filter(f => f.name !== filename));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Submit Upload
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!activeRepo) {
      setError('Please select a target repository.');
      return;
    }

    if (mode === 'upload' && stagedFiles.length === 0) {
      setError('Please select or drag at least one note/file to upload.');
      return;
    }

    if (mode === 'quicknote' && (!noteTitle.trim() || !noteContent.trim())) {
      setError('Please provide both a note title and content.');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const cleanDir = targetDir.trim().replace(/^\/|\/$/g, '');

      if (isDemo) {
        // Mock Commit Execution
        const committedItems = [];

        if (mode === 'upload') {
          for (const file of stagedFiles) {
            const filePath = cleanDir ? `${cleanDir}/${file.name}` : file.name;
            const newItem = {
              name: file.name,
              path: filePath,
              type: 'file',
              size: file.size,
              content: `// Uploaded file content: ${file.name}\n`
            };
            committedItems.push(newItem);
          }
        } else {
          // Quick Note
          const cleanFilename = noteTitle.endsWith('.md') ? noteTitle : `${noteTitle}.md`;
          const filePath = cleanDir ? `${cleanDir}/${cleanFilename}` : cleanFilename;
          committedItems.push({
            name: cleanFilename,
            path: filePath,
            type: 'file',
            size: noteContent.length,
            content: noteContent
          });
        }

        // Update in-memory file trees
        setFileTrees((prev) => {
          const treeKey = cleanDir ? `${activeRepo.name}/${cleanDir}` : activeRepo.name;
          const currentList = prev[treeKey] || [];
          return {
            ...prev,
            [treeKey]: [...currentList, ...committedItems]
          };
        });

        // Add to activities
        const summaryText = mode === 'upload'
          ? `${stagedFiles.length} file(s) in ${activeRepo.name}`
          : `${noteTitle} in ${activeRepo.name}`;

        setActivities((prev) => [
          {
            id: `act-${Date.now()}`,
            type: 'upload',
            iconColor: 'purple',
            title: 'File uploaded',
            target: summaryText,
            time: 'Just now',
            details: commitMessage || 'Notes uploaded via GitStore'
          },
          ...prev
        ]);

        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });

        setUploadSuccess({
          repo: activeRepo,
          count: committedItems.length,
          files: committedItems
        });
        setStagedFiles([]);
        setNoteTitle('');
        setNoteContent('');
        return;
      }

      // Live GitHub API Upload
      if (mode === 'upload') {
        const res = await api.uploadFiles(
          activeRepo.owner.login,
          activeRepo.name,
          stagedFiles,
          cleanDir,
          commitMessage
        );

        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
        setUploadSuccess({
          repo: activeRepo,
          count: stagedFiles.length,
          files: res.uploaded || stagedFiles
        });
        setStagedFiles([]);
      } else {
        // Quick note single file save
        const cleanFilename = noteTitle.endsWith('.md') ? noteTitle : `${noteTitle}.md`;
        const filePath = cleanDir ? `${cleanDir}/${cleanFilename}` : cleanFilename;

        await api.saveFile(activeRepo.owner.login, activeRepo.name, filePath, {
          message: commitMessage || `Create note: ${cleanFilename}`,
          content: noteContent
        });

        confetti({ particleCount: 65, spread: 75, origin: { y: 0.6 } });
        setUploadSuccess({
          repo: activeRepo,
          count: 1,
          files: [{ name: cleanFilename, path: filePath }]
        });
        setNoteTitle('');
        setNoteContent('');
      }
    } catch (err) {
      setError(err.message || 'Failed to upload notes');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-sm transition-all hover:shadow-card">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-5 border-b border-slate-100">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#FF5A00] to-[#FF8A3D] text-white flex items-center justify-center shadow-md shadow-orange-500/20 flex-shrink-0">
            <UploadCloud className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
                Direct Notes & Docs Uploader
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-[#FF5A00] border border-orange-100 uppercase tracking-wide">
                Instant Git Push
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Upload course notes, practicals, PDFs, or code directly to any GitHub repository.
            </p>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center p-1 bg-slate-100 rounded-2xl self-start sm:self-center">
          <button
            type="button"
            onClick={() => { setMode('upload'); setError(null); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'upload'
                ? 'bg-white text-[#FF5A00] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileUp className="w-3.5 h-3.5" />
            <span>Upload Files</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('quicknote'); setError(null); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'quicknote'
                ? 'bg-white text-[#FF5A00] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Write Quick Note</span>
          </button>
        </div>
      </div>

      {/* Target Repo & Folder Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 mb-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
        {/* Repo Selector */}
        <div className="sm:col-span-5">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1">
            <FolderGit2 className="w-3.5 h-3.5 text-[#FF5A00]" />
            <span>Target Repository</span>
          </label>
          <select
            value={selectedRepoName}
            onChange={(e) => setSelectedRepoName(e.target.value)}
            className="w-full bg-white border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-[#FF5A00] shadow-sm cursor-pointer"
          >
            {repos.map(r => (
              <option key={r.id || r.name} value={r.name}>
                {r.name} ({r.private ? 'Private' : 'Public'})
              </option>
            ))}
          </select>
        </div>

        {/* Target Folder / Subdirectory */}
        <div className="sm:col-span-4">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1">
            <Folder className="w-3.5 h-3.5 text-slate-400" />
            <span>Target Folder</span>
          </label>
          <input
            type="text"
            value={targetDir}
            onChange={(e) => setTargetDir(e.target.value)}
            placeholder="e.g. notes or docs (or leave blank)"
            className="w-full bg-white border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-[#FF5A00] shadow-sm"
          />
        </div>

        {/* Quick Suggestions */}
        <div className="sm:col-span-3 flex flex-col justify-end">
          <div className="flex flex-wrap gap-1.5 pt-1">
            {['notes', 'practicals', 'cheatsheets', ''].map((tag) => (
              <button
                key={tag || 'root'}
                type="button"
                onClick={() => setTargetDir(tag)}
                className={`text-[10px] font-semibold px-2 py-1 rounded-lg border transition-colors ${
                  targetDir === tag
                    ? 'bg-[#FF5A00] text-white border-[#FF5A00]'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300'
                }`}
              >
                {tag ? `${tag}/` : 'root /'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600 flex items-center gap-2">
          <X className="w-4 h-4 cursor-pointer" onClick={() => setError(null)} />
          <span>{error}</span>
        </div>
      )}

      {/* Success Notification Banner */}
      {uploadSuccess && (
        <div className="mb-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="text-xs sm:text-sm font-bold">
                Successfully uploaded {uploadSuccess.count} item(s) to {uploadSuccess.repo.name}!
              </p>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                Committed to branch <code className="font-mono bg-emerald-100/70 px-1 py-0.2 rounded font-semibold">{uploadSuccess.repo.default_branch || 'main'}</code>
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate(`/repo/${uploadSuccess.repo.owner?.login || 'user'}/${uploadSuccess.repo.name}`)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors self-start sm:self-center"
          >
            <span>View in Repository</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Mode View: Upload Files or Write Quick Note */}
      <form onSubmit={handleUploadSubmit}>
        {mode === 'upload' ? (
          <div>
            {/* Big Drag and Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? 'border-[#FF5A00] bg-orange-50/70 scale-[1.01] ring-4 ring-orange-500/10'
                  : 'border-slate-200 hover:border-orange-300 hover:bg-slate-50/70'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileInputChange}
                className="hidden"
              />

              <div className="w-14 h-14 rounded-2xl bg-orange-100/70 text-[#FF5A00] flex items-center justify-center mx-auto mb-3.5 group-hover:scale-105 transition-transform">
                <FileUp className="w-7 h-7" />
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-800">
                Drag & drop your notes here, or <span className="text-[#FF5A00] underline font-extrabold">browse files</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Supports Markdown (<code className="text-[#FF5A00] font-mono">.md</code>), PDF (<code className="text-[#FF5A00] font-mono">.pdf</code>), Text (<code className="text-[#FF5A00] font-mono">.txt</code>), Code, Practicals, and Images.
              </p>
            </div>

            {/* Staged Files Preview */}
            {stagedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                  <span className="font-bold text-slate-700">
                    Staged Files ({stagedFiles.length})
                  </span>
                  <span>
                    Total: {formatFileSize(stagedFiles.reduce((acc, f) => acc + f.size, 0))}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                  {stagedFiles.map((file) => (
                    <div
                      key={file.name}
                      className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-[#FF5A00] flex-shrink-0" />
                        <span className="font-semibold text-slate-800 truncate">{file.name}</span>
                        <span className="text-[11px] text-slate-400 flex-shrink-0">({formatFileSize(file.size)})</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeStagedFile(file.name); }}
                        className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Quick Note Editor */
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Note Title / Filename <span className="text-[#FF5A00]">*</span>
              </label>
              <input
                type="text"
                required
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="e.g. Machine-Learning-CheatSheet.md"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF5A00] focus:ring-2 focus:ring-[#FF5A00]/15"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Note Content (Markdown supported) <span className="text-[#FF5A00]">*</span>
              </label>
              <textarea
                rows={5}
                required
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="# Unit 1: Introduction&#10;&#10;- Key definitions&#10;- Important formulas&#10;```python&#10;# code snippet&#10;```"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF5A00] focus:ring-2 focus:ring-[#FF5A00]/15 leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* Commit Message & Action Button */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="Commit message (e.g. docs: add lecture notes)"
              className="w-full px-3.5 py-2 bg-slate-50 focus:bg-white text-xs text-slate-700 rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF5A00]"
            />
          </div>

          <button
            type="submit"
            disabled={uploading || (mode === 'upload' && stagedFiles.length === 0) || (mode === 'quicknote' && !noteTitle.trim())}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#FF5A00] hover:bg-[#E04F00] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-orange-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <UploadCloud className="w-4 h-4 stroke-[2.5]" />
            )}
            <span>
              {uploading
                ? 'Committing to GitHub...'
                : mode === 'upload'
                ? `Upload & Commit Notes (${stagedFiles.length})`
                : 'Commit Note to Repo'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
