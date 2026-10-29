import React from 'react';
import { useRepo } from '../../context/RepoContext';
import RepoCard from './RepoCard';
import { Plus, ChevronDown, FolderSearch, RefreshCw } from 'lucide-react';

export default function RepoList({ onOpenCreateModal, onSelectRepo, onDeleteRepo }) {
  const { filteredRepos, filter, setFilter, searchQuery, loading, refreshRepos } = useRepo();

  return (
    <div className="space-y-4">
      {/* Header bar matching screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
            Your repositories
          </h2>
          <button
            onClick={refreshRepos}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Refresh repositories"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#FF5A00]' : ''}`} />
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Filter Dropdown */}
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none bg-white border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 py-2 pl-3.5 pr-8 rounded-xl focus:outline-none focus:border-[#FF5A00] focus:ring-2 focus:ring-[#FF5A00]/15 cursor-pointer shadow-sm"
            >
              <option value="all">All</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* + New Repository Orange Button matching screenshot */}
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#FF5A00] hover:bg-[#E04F00] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 transition-all focus:outline-none"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Repository</span>
          </button>
        </div>
      </div>

      {/* Repositories List */}
      {filteredRepos.length > 0 ? (
        <div className="space-y-3">
          {filteredRepos.map((repo) => (
            <RepoCard
              key={repo.id || repo.name}
              repo={repo}
              onSelectRepo={onSelectRepo}
              onDeleteRepo={onDeleteRepo}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF5A00] flex items-center justify-center mx-auto mb-3">
            <FolderSearch className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No repositories found</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1">
            {searchQuery
              ? `No repositories match "${searchQuery}". Try a different keyword.`
              : `No ${filter !== 'all' ? filter : ''} repositories found.`}
          </p>
          <button
            onClick={onOpenCreateModal}
            className="mt-4 px-4 py-2 bg-[#FF5A00] hover:bg-[#E04F00] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            Create Your First Repository
          </button>
        </div>
      )}
    </div>
  );
}
