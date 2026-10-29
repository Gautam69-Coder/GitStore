import React from 'react';
import { useRepo } from '../../context/RepoContext';
import { Clock, ArrowRight, GitBranch, Plus, Upload, Star } from 'lucide-react';

export default function RecentActivity({ onViewAll, onSelectRepoByName }) {
  const { activities } = useRepo();

  const getIcon = (type, color) => {
    switch (type) {
      case 'push':
        return <GitBranch className="w-3.5 h-3.5" />;
      case 'create':
        return <Plus className="w-3.5 h-3.5 stroke-[2.5]" />;
      case 'upload':
        return <Upload className="w-3.5 h-3.5" />;
      case 'star':
        return <Star className="w-3.5 h-3.5 fill-current" />;
      default:
        return <GitBranch className="w-3.5 h-3.5" />;
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

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between">
      <div>
        {/* Header bar matching screenshot */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#FF5A00]" />
            <h3 className="text-base font-bold text-[#0F172A] tracking-tight">
              Recent Activity
            </h3>
          </div>
          <button
            onClick={onViewAll}
            className="flex items-center gap-1 text-xs font-semibold text-[#FF5A00] hover:text-[#E04F00] transition-colors"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Activity feed list */}
        <div className="space-y-3.5">
          {activities.slice(0, 5).map((act) => (
            <div key={act.id} className="flex items-start gap-3 text-xs">
              {/* Colored Circular Icon */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border mt-0.5 ${getColorClasses(
                  act.iconColor
                )}`}
              >
                {getIcon(act.type, act.iconColor)}
              </div>

              {/* Activity description */}
              <div className="flex-1 min-w-0">
                <p className="text-slate-700 leading-snug">
                  <span>{act.title} </span>
                  <button
                    onClick={() => onSelectRepoByName && onSelectRepoByName(act.target)}
                    className="font-bold text-slate-900 hover:text-[#FF5A00] transition-colors focus:outline-none"
                  >
                    {act.target}
                  </button>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">{act.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Powered by GitHub Footer matching screenshot */}
      <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col items-center text-center">
        <svg className="w-6 h-6 fill-slate-800 mb-1.5" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
        </svg>
        <p className="text-xs font-semibold text-slate-700">
          Powered by <span className="font-extrabold text-slate-900">GitHub</span>
        </p>
        <p className="text-[10px] text-slate-400 mt-0.5 tracking-wider">
          Build. Store. Grow.
        </p>
      </div>
    </div>
  );
}
