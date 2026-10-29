import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRepo } from '../context/RepoContext';
import RepoCard from '../components/dashboard/RepoCard';
import {
  FolderGit2,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
  RefreshCw,
  FolderSearch,
  Star,
  GitFork,
  ArrowRight,
  MoreVertical,
  ExternalLink,
  Trash2
} from 'lucide-react';

export default function RepositoriesPage({ onOpenCreateModal, onDeleteRepo }) {
  const { repos, loading, refreshRepos, deleteRepository } = useRepo();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'public' | 'private'
  const [sortBy, setSortBy] = useState('updated'); // 'updated' | 'name' | 'stars' | 'forks'
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'

  // Filter & Sort
  const filteredRepos = repos
    .filter((repo) => {
      const matchFilter =
        filter === 'all' ? true :
        filter === 'private' ? repo.private === true :
        repo.private === false;

      const matchSearch =
        !search.trim() ||
        repo.name.toLowerCase().includes(search.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(search.toLowerCase())) ||
        (repo.language && repo.language.toLowerCase().includes(search.toLowerCase()));

      return matchFilter && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'stars') return (b.stargazers_count || 0) - (a.stargazers_count || 0);
      if (sortBy === 'forks') return (b.forks_count || 0) - (a.forks_count || 0);
      return 0; // default updated order
    });

  const handleSelectRepo = (repo) => {
    navigate(`/repo/${repo.owner?.login || 'user'}/${repo.name}`);
  };

  const handleDelete = async (repo) => {
    if (window.confirm(`Are you sure you want to delete repository "${repo.name}"?`)) {
      if (onDeleteRepo) {
        onDeleteRepo(repo);
      } else {
        await deleteRepository(repo.owner?.login, repo.name);
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-[#FF5A00] flex-shrink-0">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
                Repositories
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-50 text-[#FF5A00] border border-orange-100">
                {repos.length} Total
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Browse, manage, edit code, and inspect all your connected GitHub projects.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refreshRepos}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-[#FF5A00] hover:bg-orange-50 transition-colors"
            title="Refresh repositories"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#FF5A00]' : ''}`} />
          </button>
          <button
            onClick={() => navigate('/create-repository')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#FF5A00] hover:bg-[#E04F00] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Repository</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Controls Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter repositories by name or language..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 focus:bg-white text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF5A00] focus:ring-2 focus:ring-[#FF5A00]/15 transition-all"
          />
        </div>

        {/* Filter Pills, Sort & View Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Visibility Tabs */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl">
            {['all', 'public', 'private'].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                  filter === t
                    ? 'bg-white text-[#FF5A00] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-slate-700 font-semibold cursor-pointer"
            >
              <option value="updated">Recently Updated</option>
              <option value="name">Name (A-Z)</option>
              <option value="stars">Most Stars</option>
              <option value="forks">Most Forks</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-[#FF5A00] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-[#FF5A00] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Repositories Display */}
      {filteredRepos.length > 0 ? (
        viewMode === 'list' ? (
          <div className="space-y-3">
            {filteredRepos.map((repo) => (
              <RepoCard
                key={repo.id || repo.name}
                repo={repo}
                onSelectRepo={handleSelectRepo}
                onDeleteRepo={handleDelete}
              />
            ))}
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRepos.map((repo) => (
              <div
                key={repo.id || repo.name}
                className="bg-white rounded-3xl border border-slate-200/80 hover:border-slate-300 p-5 shadow-sm hover:shadow-card-hover transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF5A00]">
                      <FolderGit2 className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        repo.private
                          ? 'bg-[#FFF1EB] text-[#E04F00] border-orange-100'
                          : 'bg-[#ECFDF5] text-[#059669] border-emerald-100'
                      }`}
                    >
                      {repo.private ? 'Private' : 'Public'}
                    </span>
                  </div>

                  <h3
                    onClick={() => handleSelectRepo(repo)}
                    className="text-base font-bold text-slate-900 hover:text-[#FF5A00] cursor-pointer transition-colors"
                  >
                    {repo.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {repo.description || 'No description provided.'}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-slate-600">
                      <Star className="w-3.5 h-3.5" />
                      <span>{repo.stargazers_count ?? 0}</span>
                    </span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <GitFork className="w-3.5 h-3.5" />
                      <span>{repo.forks_count ?? 0}</span>
                    </span>
                  </div>
                  <button
                    onClick={() => handleSelectRepo(repo)}
                    className="flex items-center gap-1 text-xs font-bold text-[#FF5A00] hover:underline"
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#FF5A00] flex items-center justify-center mx-auto mb-3">
            <FolderSearch className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No repositories found</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1">
            {search
              ? `No repositories match "${search}". Try resetting the search.`
              : 'You have not created any repositories matching this filter yet.'}
          </p>
          <button
            onClick={() => { setSearch(''); setFilter('all'); }}
            className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
