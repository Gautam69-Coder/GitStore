import React, { useState, useRef, useEffect } from 'react';
import { Folder, Star, GitFork, ArrowRight, MoreVertical, ExternalLink, Trash2, Code2 } from 'lucide-react';

export default function RepoCard({ repo, onSelectRepo, onDeleteRepo }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 p-4 sm:p-5 shadow-sm hover:shadow-card-hover transition-all duration-200">
      <div className="flex items-start justify-between gap-4">
        {/* Left: Folder Icon & Details */}
        <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
          {/* Orange folder icon container */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#FFF3EC] border border-[#FFE4D6] flex items-center justify-center text-[#FF5A00] flex-shrink-0 group-hover:scale-105 transition-transform">
            <Folder className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
          </div>

          <div className="flex-1 min-w-0">
            {/* Repo Name & Badge */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onSelectRepo(repo)}
                className="text-sm sm:text-base font-bold text-[#0F172A] hover:text-[#FF5A00] transition-colors truncate max-w-[200px] sm:max-w-none text-left focus:outline-none"
              >
                {repo.name}
              </button>
              <span
                className={`text-[10px] sm:text-[11px] font-semibold px-2 sm:px-2.5 py-0.5 rounded-full border ${
                  repo.private
                    ? 'bg-[#FFF1EB] text-[#E04F00] border-orange-100'
                    : 'bg-[#ECFDF5] text-[#059669] border-emerald-100'
                }`}
              >
                {repo.private ? 'Private' : 'Public'}
              </span>
            </div>

            {/* Description */}
            <p className="mt-1 text-xs sm:text-sm text-slate-500 line-clamp-1 leading-relaxed">
              {repo.description || 'No description provided.'}
            </p>

            {/* Metrics & Timestamp */}
            <div className="mt-2.5 flex flex-wrap items-center gap-x-3.5 gap-y-1 text-xs font-medium text-slate-400">
              <span className="flex items-center gap-1 text-slate-600 hover:text-amber-500 transition-colors">
                <Star className="w-3.5 h-3.5" />
                <span>{repo.stargazers_count ?? 0}</span>
              </span>
              <span className="flex items-center gap-1 text-slate-600 hover:text-slate-800 transition-colors">
                <GitFork className="w-3.5 h-3.5" />
                <span>{repo.forks_count ?? 0}</span>
              </span>
              <span className="text-[11px] sm:text-xs text-slate-400">
                Updated {repo.updated_at || 'recently'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Navigate Arrow & 3-dots Menu */}
        <div className="flex items-center gap-1 self-center">
          <button
            onClick={() => onSelectRepo(repo)}
            className="p-2 rounded-xl text-slate-400 hover:text-[#FF5A00] hover:bg-orange-50 focus:outline-none transition-colors"
            title="Explore repository"
          >
            <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 focus:outline-none transition-colors"
              title="More options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-40 animate-fade-in text-xs font-medium">
                <button
                  onClick={() => { onSelectRepo(repo); setMenuOpen(false); }}
                  className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Code2 className="w-3.5 h-3.5 text-slate-500" />
                  Explore Files
                </button>
                {repo.html_url && (
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    Open in GitHub
                  </a>
                )}
                <div className="my-1 border-t border-slate-100"></div>
                <button
                  onClick={() => { onDeleteRepo(repo); setMenuOpen(false); }}
                  className="w-full text-left px-3.5 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Repository
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
