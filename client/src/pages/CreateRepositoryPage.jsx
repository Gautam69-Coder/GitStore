import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRepo } from '../context/RepoContext';
import { useAuth } from '../context/AuthContext';
import { Plus, Globe, Lock, ArrowLeft, Loader2, Sparkles, FileText, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CreateRepositoryPage() {
  const { createRepository } = useRepo();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [autoInit, setAutoInit] = useState(true);
  const [gitignoreTemplate, setGitignoreTemplate] = useState('');
  const [licenseTemplate, setLicenseTemplate] = useState('mit');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a repository name');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const cleanName = name.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');
      const res = await createRepository({
        name: cleanName,
        description: description.trim(),
        isPrivate,
        autoInit,
        gitignoreTemplate: gitignoreTemplate || undefined,
        licenseTemplate: licenseTemplate || undefined
      });

      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.6 }
      });

      // Navigate to the newly created repository
      navigate(`/repo/${user.login}/${cleanName}`);
    } catch (err) {
      setError(err.message || 'Failed to create repository');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-[#FF5A00] flex-shrink-0">
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
              Create a new repository
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              A repository contains all your project files, revision history, and branch versions.
            </p>
          </div>
        </div>
      </div>

      {/* Main Creation Form */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-xs sm:text-sm font-semibold text-red-600 flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Repository Name */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-2">
              Repository name <span className="text-[#FF5A00]">*</span>
            </label>
            <div className="flex items-center">
              <span className="px-4 py-2.5 bg-slate-50 border border-r-0 border-slate-200 rounded-l-2xl text-xs sm:text-sm font-semibold text-slate-500">
                {user.login} /
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. quantum-react-app"
                className="w-full px-4 py-2.5 rounded-r-2xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF5A00] focus:ring-2 focus:ring-[#FF5A00]/15"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Great repository names are short and memorable. Spaces will be converted to hyphens.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-2">
              Description <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this repository about?"
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF5A00] focus:ring-2 focus:ring-[#FF5A00]/15"
            />
          </div>

          {/* Visibility Section */}
          <div className="pt-2">
            <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-3">
              Visibility
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Public */}
              <div
                onClick={() => setIsPrivate(false)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                  !isPrivate
                    ? 'border-[#FF5A00] bg-orange-50/50 ring-2 ring-[#FF5A00]/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Public</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Anyone on the internet can see this repository. You choose who can commit.
                  </p>
                </div>
              </div>

              {/* Private */}
              <div
                onClick={() => setIsPrivate(true)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                  isPrivate
                    ? 'border-[#FF5A00] bg-orange-50/50 ring-2 ring-[#FF5A00]/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FF5A00] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Private</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    You choose who can see and commit to this repository.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Initializers */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h4 className="text-xs sm:text-sm font-bold text-slate-800">
              Initialize this repository with:
            </h4>

            <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 cursor-pointer">
              <input
                type="checkbox"
                checked={autoInit}
                onChange={(e) => setAutoInit(e.target.checked)}
                className="w-4 h-4 rounded text-[#FF5A00] focus:ring-[#FF5A00] accent-[#FF5A00]"
              />
              <div>
                <p className="text-xs font-bold text-slate-800">Add a README file</p>
                <p className="text-[11px] text-slate-500">
                  This is where you can write a long description for your project.
                </p>
              </div>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Add .gitignore
                </label>
                <select
                  value={gitignoreTemplate}
                  onChange={(e) => setGitignoreTemplate(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#FF5A00]"
                >
                  <option value="">None</option>
                  <option value="Node">Node</option>
                  <option value="Python">Python</option>
                  <option value="React">React</option>
                  <option value="Go">Go</option>
                  <option value="Java">Java</option>
                  <option value="Rust">Rust</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Choose a license
                </label>
                <select
                  value={licenseTemplate}
                  onChange={(e) => setLicenseTemplate(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-700 focus:outline-none focus:border-[#FF5A00]"
                >
                  <option value="">None</option>
                  <option value="mit">MIT License</option>
                  <option value="apache-2.0">Apache License 2.0</option>
                  <option value="gpl-3.0">GNU General Public License v3.0</option>
                  <option value="bsd-3-clause">BSD 3-Clause License</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate('/repositories')}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#FF5A00] hover:bg-[#E04F00] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-orange-500/25 transition-all disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 stroke-[2.5]" />
              )}
              <span>{loading ? 'Creating Repository...' : 'Create Repository'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
