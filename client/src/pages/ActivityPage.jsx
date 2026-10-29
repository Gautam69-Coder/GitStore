import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRepo } from '../context/RepoContext';
import { Clock, GitBranch, Plus, Upload, Star, Search, RefreshCw, ArrowRight } from 'lucide-react';

export default function ActivityPage() {
  const { activities, repos, refreshRepos, loading } = useRepo();
  const navigate = useNavigate();

  const [filterType, setFilterType] = useState('all'); // 'all' | 'push' | 'create' | 'upload' | 'star'
  const [search, setSearch] = useState('');

  const filteredActivities = activities.filter((act) => {
    const matchType = filterType === 'all' ? true : act.type === filterType;
    const matchSearch =
      !search.trim() ||
      act.target.toLowerCase().includes(search.toLowerCase()) ||
      act.title.toLowerCase().includes(search.toLowerCase()) ||
      (act.details && act.details.toLowerCase().includes(search.toLowerCase()));

    return matchType && matchSearch;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'push':
        return <GitBranch className="w-4 h-4" />;
      case 'create':
        return <Plus className="w-4 h-4 stroke-[2.5]" />;
      case 'upload':
        return <Upload className="w-4 h-4" />;
      case 'star':
        return <Star className="w-4 h-4 fill-current" />;
      default:
        return <GitBranch className="w-4 h-4" />;
    }
  };

  const getColorClasses = (color) => {
    switch (color) {
      case 'green':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'orange':
        return 'bg-orange-50 text-[#FF5A00] border-orange-100';
      case 'blue':
        return 'bg-sky-50 text-sky-600 border-sky-100';
      case 'purple':
        return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'yellow':
        return 'bg-amber-50 text-amber-500 border-amber-100';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const handleTargetClick = (targetName) => {
    const cleanRepoName = targetName.split(' ')[0].replace(/[^a-zA-Z0-9-_]/g, '');
    const found = repos.find(r => r.name.toLowerCase() === cleanRepoName.toLowerCase());
    if (found) {
      navigate(`/repo/${found.owner?.login || 'user'}/${found.name}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-[#FF5A00] flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
              Activity History
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Chronological log of pushes, file uploads, repository events, and contributions.
            </p>
          </div>
        </div>

        <button
          onClick={refreshRepos}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#FF5A00]' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search activity by repo or commit..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 focus:bg-white text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#FF5A00]"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center p-1 bg-slate-100 rounded-xl">
          {[
            { id: 'all', label: 'All' },
            { id: 'push', label: 'Pushes' },
            { id: 'create', label: 'Created' },
            { id: 'upload', label: 'Uploads' },
            { id: 'star', label: 'Starred' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterType(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterType === item.id
                  ? 'bg-white text-[#FF5A00] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        {filteredActivities.length > 0 ? (
          <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-100">
            {filteredActivities.map((act) => (
              <div key={act.id} className="relative flex items-start gap-4 text-sm">
                {/* Marker icon */}
                <div
                  className={`-ml-6 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border bg-white ring-4 ring-white ${getColorClasses(
                    act.iconColor
                  )}`}
                >
                  {getIcon(act.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 bg-slate-50/70 hover:bg-slate-50 p-4 rounded-2xl border border-slate-100 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <p className="text-slate-800 text-xs sm:text-sm font-medium">
                      <span>{act.title} </span>
                      <button
                        onClick={() => handleTargetClick(act.target)}
                        className="font-bold text-slate-900 hover:text-[#FF5A00] transition-colors focus:outline-none"
                      >
                        {act.target}
                      </button>
                    </p>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {act.time}
                    </span>
                  </div>
                  {act.details && (
                    <p className="text-xs text-slate-500 mt-1 font-mono bg-white px-2.5 py-1 rounded-lg border border-slate-200/60 inline-block">
                      {act.details}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No activity found</p>
            <p className="text-xs mt-1">Try resetting the filters or making a new commit.</p>
          </div>
        )}
      </div>
    </div>
  );
}
