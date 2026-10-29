import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRepo } from '../../context/RepoContext';
import { api } from '../../services/api';
import {
  ArrowLeft,
  Folder,
  FileCode,
  FileText,
  FileJson,
  FileImage,
  Upload,
  Plus,
  GitBranch,
  Star,
  GitFork,
  ExternalLink,
  Copy,
  Check,
  Edit3,
  Trash2,
  Save,
  Eye,
  Terminal,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import ImageViewer from './ImageViewer';

export default function RepoExplorer({ repo, onBack }) {
  const { isDemo, user } = useAuth();
  const { fileTrees, setFileTrees } = useRepo();

  const [currentPath, setCurrentPath] = useState('');
  const [items, setItems] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editedCode, setEditedCode] = useState('');
  const [commitMessage, setCommitMessage] = useState('');
  const [commitDescription, setCommitDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [notification, setNotification] = useState(null);

  // Modals inside explorer
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateFileModal, setShowCreateFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileContent, setNewFileContent] = useState('');
  const [newFileCommitMsg, setNewFileCommitMsg] = useState('Create file');
  const [uploadFilesList, setUploadFilesList] = useState([]);
  const [uploadCommitMsg, setUploadCommitMsg] = useState('Upload files via GitStore');

  // Load directory contents when currentPath changes
  useEffect(() => {
    loadContents(currentPath);
  }, [repo.name, currentPath, isDemo]);

  const loadContents = async (path = '') => {
    try {
      setLoading(true);
      if (isDemo) {
        // Look up in mock file tree
        const treeKey = path ? `${repo.name}/${path}` : repo.name;
        const mockItems = fileTrees[treeKey] || fileTrees[repo.name] || [
          { name: 'README.md', path: 'README.md', type: 'file', size: 450, content: `# ${repo.name}\n\n${repo.description || 'Repository content'}` }
        ];
        setItems(mockItems);
        return;
      }

      // Live mode via GitHub REST API
      const data = await api.getContents(repo.owner.login, repo.name, path);
      if (Array.isArray(data)) {
        setItems(data);
      } else if (data && data.type === 'file') {
        // Opened a file directly
        setSelectedFile(data);
        setFileContent(data.content || '');
      }
    } catch (err) {
      console.error('Failed to load repo contents:', err);
      showNotice('Could not load repository files: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = async (item) => {
    if (item.type === 'dir') {
      setSelectedFile(null);
      setCurrentPath(item.path);
    } else {
      // File clicked: open viewer
      try {
        setLoading(true);
        if (isDemo) {
          setSelectedFile(item);
          setFileContent(item.content || `// Content of ${item.name}\nconsole.log("GitStore active");`);
          setEditedCode(item.content || `// Content of ${item.name}\nconsole.log("GitStore active");`);
          setCommitMessage(`Update ${item.name}`);
          setEditMode(false);
        } else {
          const fileData = await api.getContents(repo.owner.login, repo.name, item.path);
          setSelectedFile(fileData);
          setFileContent(fileData.content || '');
          setEditedCode(fileData.content || '');
          setCommitMessage(`Update ${item.name}`);
          setEditMode(false);
        }
      } catch (err) {
        showNotice('Failed to open file: ' + err.message, 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBreadcrumbClick = (targetPath) => {
    setSelectedFile(null);
    setCurrentPath(targetPath);
  };

  const showNotice = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCommitFile = async () => {
    if (!commitMessage.trim()) {
      showNotice('Please enter a commit message', 'error');
      return;
    }

    try {
      setSaving(true);
      if (isDemo) {
        // Update local mock file
        const updatedFile = { ...selectedFile, content: editedCode };
        setSelectedFile(updatedFile);
        setFileContent(editedCode);
        setEditMode(false);

        // Update in fileTrees
        const treeKey = currentPath ? `${repo.name}/${currentPath}` : repo.name;
        setFileTrees(prev => {
          const currentList = prev[treeKey] || [];
          return {
            ...prev,
            [treeKey]: currentList.map(item => item.path === selectedFile.path ? updatedFile : item)
          };
        });

        confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
        showNotice(`Committed changes to ${selectedFile.name} successfully!`);
        return;
      }

      // Live mode via GitHub REST API PUT /repos/{owner}/{repo}/contents/{path}
      await api.saveFile(repo.owner.login, repo.name, selectedFile.path, {
        message: commitMessage.trim(),
        content: editedCode,
        sha: selectedFile.sha
      });

      confetti({ particleCount: 45, spread: 60, origin: { y: 0.8 } });
      showNotice(`Committed changes to ${selectedFile.name} directly to GitHub!`);
      setFileContent(editedCode);
      setEditMode(false);
      // Reload contents to refresh sha
      await loadContents(currentPath);
    } catch (err) {
      showNotice('Commit failed: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFile = async (item) => {
    if (!window.confirm(`Are you sure you want to delete ${item.name} from ${repo.name}?`)) {
      return;
    }

    try {
      setLoading(true);
      if (isDemo) {
        const treeKey = currentPath ? `${repo.name}/${currentPath}` : repo.name;
        setFileTrees(prev => ({
          ...prev,
          [treeKey]: (prev[treeKey] || []).filter(i => i.path !== item.path)
        }));
        setItems(prev => prev.filter(i => i.path !== item.path));
        if (selectedFile && selectedFile.path === item.path) {
          setSelectedFile(null);
        }
        showNotice(`Deleted ${item.name}`);
        return;
      }

      // Live mode
      await api.deleteFile(repo.owner.login, repo.name, item.path, {
        message: `Delete ${item.name} via GitStore`,
        sha: item.sha
      });
      showNotice(`Deleted ${item.name} from repository`);
      if (selectedFile && selectedFile.path === item.path) {
        setSelectedFile(null);
      }
      await loadContents(currentPath);
    } catch (err) {
      showNotice('Failed to delete file: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFileOrFolder = async (e) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    try {
      setSaving(true);
      const isFolder = newFileName.endsWith('/') || !newFileName.includes('.');
      const finalPath = currentPath
        ? `${currentPath}/${newFileName.replace(/^\//, '')}`
        : newFileName.replace(/^\//, '');

      // For folders in Git, place a .gitkeep
      const commitPath = isFolder ? `${finalPath.replace(/\/$/, '')}/.gitkeep` : finalPath;
      const content = isFolder ? '' : (newFileContent || '');

      if (isDemo) {
        const treeKey = currentPath ? `${repo.name}/${currentPath}` : repo.name;
        const newItem = {
          name: newFileName.split('/').filter(Boolean).pop(),
          path: finalPath,
          type: isFolder ? 'dir' : 'file',
          size: content.length,
          content: content
        };

        setFileTrees(prev => ({
          ...prev,
          [treeKey]: [...(prev[treeKey] || []), newItem]
        }));
        setItems(prev => [...prev, newItem]);
        setShowCreateFileModal(false);
        setNewFileName('');
        setNewFileContent('');
        confetti({ particleCount: 30, spread: 50 });
        showNotice(`Created ${isFolder ? 'folder' : 'file'} ${newItem.name}`);
        return;
      }

      // Live API
      await api.saveFile(repo.owner.login, repo.name, commitPath, {
        message: newFileCommitMsg.trim() || `Create ${newFileName}`,
        content
      });

      setShowCreateFileModal(false);
      setNewFileName('');
      setNewFileContent('');
      confetti({ particleCount: 40, spread: 60 });
      showNotice(`Created ${isFolder ? 'folder' : 'file'} successfully!`);
      await loadContents(currentPath);
    } catch (err) {
      showNotice('Failed to create: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (uploadFilesList.length === 0) return;

    try {
      setSaving(true);
      if (isDemo) {
        const treeKey = currentPath ? `${repo.name}/${currentPath}` : repo.name;
        const newUploaded = uploadFilesList.map(f => ({
          name: f.name,
          path: currentPath ? `${currentPath}/${f.name}` : f.name,
          type: 'file',
          size: f.size,
          content: `// Uploaded file: ${f.name}\n`
        }));

        setFileTrees(prev => ({
          ...prev,
          [treeKey]: [...(prev[treeKey] || []), ...newUploaded]
        }));
        setItems(prev => [...prev, ...newUploaded]);
        setShowUploadModal(false);
        setUploadFilesList([]);
        confetti({ particleCount: 40, spread: 60 });
        showNotice(`Uploaded ${uploadFilesList.length} files successfully!`);
        return;
      }

      // Live mode upload
      await api.uploadFiles(repo.owner.login, repo.name, uploadFilesList, currentPath, uploadCommitMsg);
      setShowUploadModal(false);
      setUploadFilesList([]);
      confetti({ particleCount: 45, spread: 70 });
      showNotice('Files uploaded and committed directly to GitHub!');
      await loadContents(currentPath);
    } catch (err) {
      showNotice('Upload failed: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const isImageFile = (filename) => {
    if (!filename) return false;
    const ext = filename.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico'].includes(ext);
  };

  const isPdfFile = (filename) => {
    if (!filename) return false;
    return filename.split('.').pop()?.toLowerCase() === 'pdf';
  };

  const handleReplaceImage = async (newFile, customCommitMsg) => {
    if (!selectedFile) return;
    try {
      setSaving(true);
      if (isDemo) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target.result;
          const updatedItem = {
            ...selectedFile,
            data_url: dataUrl,
            size: newFile.size
          };
          setSelectedFile(updatedItem);
          const treeKey = currentPath ? `${repo.name}/${currentPath}` : repo.name;
          setFileTrees(prev => ({
            ...prev,
            [treeKey]: (prev[treeKey] || []).map(i => i.path === selectedFile.path ? updatedItem : i)
          }));
        };
        reader.readAsDataURL(newFile);
        showNotice(`Replaced ${selectedFile.name} successfully!`);
        return;
      }

      // Live mode via upload
      const targetFolder = currentPath || '';
      await api.uploadFiles(
        repo.owner.login,
        repo.name,
        [newFile],
        targetFolder,
        customCommitMsg || `Update image: ${selectedFile.name}`
      );
      showNotice(`Replaced ${selectedFile.name} directly on GitHub!`);
      const fileData = await api.getContents(repo.owner.login, repo.name, selectedFile.path);
      setSelectedFile(fileData);
    } catch (err) {
      showNotice('Failed to replace image: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const getFileIcon = (filename, type) => {
    if (type === 'dir') return <Folder className="w-4 h-4 text-[#FF5A00] fill-current" />;
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'c', 'cpp', 'html', 'css'].includes(ext)) {
      return <FileCode className="w-4 h-4 text-sky-500" />;
    }
    if (['md', 'txt', 'markdown'].includes(ext)) {
      return <FileText className="w-4 h-4 text-emerald-500" />;
    }
    if (['json', 'yaml', 'yml'].includes(ext)) {
      return <FileJson className="w-4 h-4 text-amber-500" />;
    }
    if (['png', 'jpg', 'jpeg', 'svg', 'webp'].includes(ext)) {
      return <FileImage className="w-4 h-4 text-purple-500" />;
    }
    return <FileText className="w-4 h-4 text-slate-400" />;
  };

  const copyCloneUrl = () => {
    navigator.clipboard.writeText(repo.html_url || `https://github.com/${repo.owner.login}/${repo.name}.git`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Breadcrumbs array
  const pathParts = currentPath.split('/').filter(Boolean);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl border text-sm font-semibold flex items-center gap-2.5 animate-fade-in ${
            notification.type === 'error'
              ? 'bg-red-50 text-red-700 border-red-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}
        >
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Top Bar with Back Button & Repo Meta */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2.5 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 transition-colors focus:outline-none"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
                  {repo.name}
                </h2>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                    repo.private
                      ? 'bg-[#FFF1EB] text-[#E04F00] border-orange-100'
                      : 'bg-[#ECFDF5] text-[#059669] border-emerald-100'
                  }`}
                >
                  {repo.private ? 'Private' : 'Public'}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  <GitBranch className="w-3 h-3 text-[#FF5A00]" />
                  <span>{repo.default_branch || 'main'}</span>
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 line-clamp-1">
                {repo.description || 'No description provided.'}
              </p>
            </div>
          </div>

          {/* Action buttons (Responsive grid on mobile, flex row on tablet/desktop) */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowCreateFileModal(true)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 rounded-xl transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-[#FF5A00] flex-shrink-0" />
              <span className="truncate">Add File</span>
            </button>

            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 rounded-xl transition-all shadow-xs"
            >
              <Upload className="w-3.5 h-3.5 text-[#FF5A00] flex-shrink-0" />
              <span className="truncate">Upload</span>
            </button>

            <button
              onClick={copyCloneUrl}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200/80 text-xs font-semibold text-slate-700 rounded-xl transition-colors"
              title="Copy Git Clone URL"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /> : <Copy className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />}
              <span>{copied ? 'Copied' : 'Clone'}</span>
            </button>

            {repo.html_url && (
              <a
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-[#FF5A00] hover:bg-orange-50 transition-colors text-xs font-semibold"
                title="View on GitHub"
              >
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                <span>GitHub</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Breadcrumbs Navigation Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 px-4 py-3 flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-600 shadow-sm overflow-x-auto">
        <button
          onClick={() => handleBreadcrumbClick('')}
          className="text-[#FF5A00] font-bold hover:underline flex items-center gap-1 flex-shrink-0"
        >
          {repo.name}
        </button>
        {pathParts.map((part, index) => {
          const subPath = pathParts.slice(0, index + 1).join('/');
          const isLast = index === pathParts.length - 1 && !selectedFile;
          return (
            <React.Fragment key={subPath}>
              <span className="text-slate-300">/</span>
              <button
                onClick={() => handleBreadcrumbClick(subPath)}
                disabled={isLast}
                className={`flex-shrink-0 ${
                  isLast ? 'text-slate-900 font-bold' : 'text-slate-600 hover:text-[#FF5A00]'
                }`}
              >
                {part}
              </button>
            </React.Fragment>
          );
        })}
        {selectedFile && (
          <>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-bold flex-shrink-0">{selectedFile.name}</span>
          </>
        )}
      </div>

      {/* Main Content: File Viewer / Editor OR Directory Table */}
      {selectedFile ? (
        isImageFile(selectedFile.name) || selectedFile.is_image ? (
          <ImageViewer
            file={selectedFile}
            repo={repo}
            onReplaceImage={handleReplaceImage}
            showNotice={showNotice}
          />
        ) : isPdfFile(selectedFile.name) || selectedFile.is_pdf ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-500" />
                <span className="font-bold text-slate-900">{selectedFile.name}</span>
                <span className="text-xs text-slate-400">({selectedFile.size} bytes)</span>
              </div>
              {selectedFile.download_url && (
                <a
                  href={selectedFile.download_url}
                  target="_blank"
                  rel="noreferrer"
                  download={selectedFile.name}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF5A00] text-white text-xs font-bold"
                >
                  Download PDF
                </a>
              )}
            </div>
            {selectedFile.data_url || selectedFile.download_url ? (
              <iframe
                src={selectedFile.data_url || selectedFile.download_url}
                className="w-full h-[620px] rounded-2xl border border-slate-200"
                title={selectedFile.name}
              />
            ) : (
              <div className="p-12 text-center text-slate-400">
                <p>PDF preview not available for this document.</p>
              </div>
            )}
          </div>
        ) : (
          /* File Viewer & Editor Panel */
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          {/* Editor Header Bar */}
          <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              {getFileIcon(selectedFile.name, 'file')}
              <span className="text-sm font-bold text-slate-900">{selectedFile.name}</span>
              <span className="text-xs text-slate-400">({selectedFile.size || fileContent.length} bytes)</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditMode(!editMode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  editMode
                    ? 'bg-[#FFF3EC] text-[#FF5A00] border-orange-200'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {editMode ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                <span>{editMode ? 'Preview' : 'Edit File'}</span>
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(editMode ? editedCode : fileContent);
                  showNotice('Content copied to clipboard!');
                }}
                className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
                title="Copy file content"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Editor / Viewer Body */}
          <div className="p-0">
            {editMode ? (
              <div className="p-4 bg-slate-900">
                <textarea
                  value={editedCode}
                  onChange={(e) => setEditedCode(e.target.value)}
                  rows={18}
                  className="w-full bg-transparent text-slate-100 font-mono text-xs sm:text-sm p-2 rounded-lg border border-slate-700 focus:outline-none focus:border-[#FF5A00] leading-relaxed resize-y"
                  placeholder="Enter code here..."
                />
              </div>
            ) : (
              <div className="p-5 overflow-x-auto bg-slate-900 text-slate-200 font-mono text-xs sm:text-sm leading-relaxed max-h-[550px] overflow-y-auto">
                <pre className="whitespace-pre-wrap">{fileContent || '(Empty file)'}</pre>
              </div>
            )}
          </div>

          {/* Commit Changes Section (shown when editing) */}
          {editMode && (
            <div className="p-5 border-t border-slate-200 bg-orange-50/40">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                Commit changes to GitHub
              </h4>
              <div className="space-y-3">
                <input
                  type="text"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  placeholder="Commit message (e.g. Update App.jsx)"
                  className="w-full px-3.5 py-2 bg-white rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF5A00] focus:ring-2 focus:ring-[#FF5A00]/15"
                />
                <textarea
                  value={commitDescription}
                  onChange={(e) => setCommitDescription(e.target.value)}
                  rows={2}
                  placeholder="Add an optional extended description..."
                  className="w-full px-3.5 py-2 bg-white rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF5A00] focus:ring-2 focus:ring-[#FF5A00]/15 resize-none"
                />
                <div className="flex items-center justify-end gap-2.5 pt-1">
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCommitFile}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-5 py-2 bg-[#FF5A00] hover:bg-[#E04F00] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all disabled:opacity-60"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>{saving ? 'Committing...' : 'Commit changes'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        )
      ) : (
        /* Directory Table */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#FF5A00] mb-2" />
              <p className="text-xs">Loading directory contents...</p>
            </div>
          ) : items.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {items.map((item) => (
                <div
                  key={item.path}
                  className="group flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors"
                >
                  <button
                    onClick={() => handleItemClick(item)}
                    className="flex items-center gap-3 text-left flex-1 min-w-0 focus:outline-none"
                  >
                    {getFileIcon(item.name, item.type)}
                    <span
                      className={`text-xs sm:text-sm truncate ${
                        item.type === 'dir'
                          ? 'font-bold text-slate-900 group-hover:text-[#FF5A00]'
                          : 'font-medium text-slate-700 group-hover:text-[#FF5A00]'
                      }`}
                    >
                      {item.name}
                    </span>
                  </button>

                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="hidden sm:inline-block">
                      {item.type === 'dir' ? '-' : `${item.size || 0} bytes`}
                    </span>
                    <button
                      onClick={() => handleDeleteFile(item)}
                      className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                      title="Delete item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">
              <Folder className="w-8 h-8 text-orange-200 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800">This directory is empty</p>
              <p className="text-xs text-slate-400 mt-1">Upload files or create a new file to get started.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal: Create File / Folder */}
      {showCreateFileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 w-full max-w-lg shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Create File or Folder</h3>
            <p className="text-xs text-slate-500 mb-4">
              Tip: Add a trailing slash (e.g. <code className="bg-slate-100 px-1 py-0.5 rounded text-[#FF5A00]">docs/</code>) to create a folder.
            </p>
            <form onSubmit={handleCreateFileOrFolder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Name / Path</label>
                <input
                  type="text"
                  required
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="e.g. utils.js or docs/"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#FF5A00] focus:ring-2 focus:ring-[#FF5A00]/15"
                />
              </div>

              {!newFileName.endsWith('/') && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Initial Content</label>
                  <textarea
                    rows={4}
                    value={newFileContent}
                    onChange={(e) => setNewFileContent(e.target.value)}
                    placeholder="// Add optional starter content..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono focus:outline-none focus:border-[#FF5A00] focus:ring-2 focus:ring-[#FF5A00]/15"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Commit Message</label>
                <input
                  type="text"
                  value={newFileCommitMsg}
                  onChange={(e) => setNewFileCommitMsg(e.target.value)}
                  placeholder="Create file via GitStore"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#FF5A00] focus:ring-2 focus:ring-[#FF5A00]/15"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateFileModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#FF5A00] hover:bg-[#E04F00] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all disabled:opacity-60"
                >
                  {saving ? 'Creating...' : 'Create & Commit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Upload Files */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 w-full max-w-lg shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Upload Files to {repo.name}</h3>
            <p className="text-xs text-slate-500 mb-4">
              Files will be committed directly to branch <span className="font-semibold text-slate-800">{repo.default_branch || 'main'}</span>
            </p>
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="border-2 border-dashed border-slate-200 hover:border-orange-300 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50">
                <input
                  type="file"
                  multiple
                  id="fileUploadInput"
                  className="hidden"
                  onChange={(e) => setUploadFilesList(Array.from(e.target.files))}
                />
                <label htmlFor="fileUploadInput" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-[#FF5A00] mx-auto mb-2" />
                  <p className="text-xs sm:text-sm font-semibold text-slate-800">
                    Click to select files or drag them here
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Upload multiple files simultaneously
                  </p>
                </label>
              </div>

              {uploadFilesList.length > 0 && (
                <div className="max-h-32 overflow-y-auto space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                  {uploadFilesList.map((f, i) => (
                    <div key={i} className="flex justify-between items-center text-slate-700">
                      <span className="truncate">{f.name}</span>
                      <span className="text-slate-400">{(f.size / 1024).toFixed(1)} KB</span>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Commit Message</label>
                <input
                  type="text"
                  value={uploadCommitMsg}
                  onChange={(e) => setUploadCommitMsg(e.target.value)}
                  placeholder="Upload files via GitStore"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#FF5A00] focus:ring-2 focus:ring-[#FF5A00]/15"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadFilesList.length === 0 || saving}
                  className="px-5 py-2 bg-[#FF5A00] hover:bg-[#E04F00] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all disabled:opacity-50"
                >
                  {saving ? 'Uploading...' : `Upload & Commit (${uploadFilesList.length})`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
