import React, { useState } from 'react';
import { useRepo } from '../../context/RepoContext';
import { useAuth } from '../../context/AuthContext';
import { X, Lock, Globe, Plus, Check, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CreateRepoModal({ isOpen, onClose, onCreated }) {
  const { createRepository } = useRepo();
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [autoInit, setAutoInit] = useState(true);
  const [gitignoreTemplate, setGitignoreTemplate] = useState('');
  const [licenseTemplate, setLicenseTemplate] = useState('mit');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a repository name');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await createRepository({
        name: name.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-'),
        description: description.trim(),
        isPrivate,
        autoInit,
        gitignoreTemplate: gitignoreTemplate || undefined,
        licenseTemplate: licenseTemplate || undefined
      });

      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });

      setName('');
      setDescription('');
      onClose();
      if (onCreated && res.repo) {
        onCreated(res.repo);
      }
    } catch (err) {
      setError(err.message || 'Failed to create repository');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 w-full max-w-xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-[#FF5A00]">
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Create a new repository</h3>
            <p className="text-xs text-slate-500">
              A repository contains all project files, including the revision history.
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Repository Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Repository name <span className="text-[#FF5A00]">*</span>
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center">
              <span className="px-3.5 py-2 sm:py-2.5 bg-slate-50 border border-b-0 sm:border-b sm:border-r-0 border-slate-200 rounded-t-xl sm:rounded-tr-none sm:rounded-l-xl text-xs sm:text-sm font-semibold text-slate-500 whitespace-nowrap">
                {user.login} /
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. cloud-storage-app"
                className="w-full px-3.5 py-2 sm:py-2.5 rounded-b-xl sm:rounded-bl-none sm:rounded-r-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF5A00] focus:ring-2 focus:ring-[#FF5A00]/15"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Great repository names are short and memorable.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Description <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of your project"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF5A00] focus:ring-2 focus:ring-[#FF5A00]/15"
            />
          </div>

          {/* Visibility Options (Public vs Private) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Visibility</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Public option */}
              <div
                onClick={() => setIsPrivate(false)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                  !isPrivate
                    ? 'border-[#FF5A00] bg-orange-50/50 ring-2 ring-[#FF5A00]/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="mt-0.5 w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Public</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Anyone on the internet can see this repository.
                  </p>
                </div>
              </div>

              {/* Private option */}
              <div
                onClick={() => setIsPrivate(true)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                  isPrivate
                    ? 'border-[#FF5A00] bg-orange-50/50 ring-2 ring-[#FF5A00]/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="mt-0.5 w-7 h-7 rounded-lg bg-orange-50 text-[#FF5A00] flex items-center justify-center flex-shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Private</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    You choose who can see and commit to this repository.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Initialization options */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-bold text-slate-800">Initialize this repository with:</h4>
            
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                checked={autoInit}
                onChange={(e) => setAutoInit(e.target.checked)}
                className="w-4 h-4 rounded text-[#FF5A00] focus:ring-[#FF5A00] border-slate-300 accent-[#FF5A00]"
              />
              <span>Add a README file</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Add .gitignore
                </label>
                <select
                  value={gitignoreTemplate}
                  onChange={(e) => setGitignoreTemplate(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-700 focus:outline-none focus:border-[#FF5A00]"
                >
                  <option value="">None</option>
                  <option value="Node">Node</option>
                  <option value="Python">Python</option>
                  <option value="React">React</option>
                  <option value="Go">Go</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Choose a license
                </label>
                <select
                  value={licenseTemplate}
                  onChange={(e) => setLicenseTemplate(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-700 focus:outline-none focus:border-[#FF5A00]"
                >
                  <option value="">None</option>
                  <option value="mit">MIT License</option>
                  <option value="apache-2.0">Apache 2.0</option>
                  <option value="gpl-3.0">GNU GPLv3</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#FF5A00] hover:bg-[#E04F00] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-orange-500/25 transition-all disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 stroke-[2.5]" />}
              <span>{loading ? 'Creating...' : 'Create Repository'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
