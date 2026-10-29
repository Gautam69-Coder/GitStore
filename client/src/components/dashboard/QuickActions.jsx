import React from 'react';
import { Zap, Plus, Upload, FolderGit2, ChevronRight } from 'lucide-react';

export default function QuickActions({ onOpenCreateModal, onOpenUploadModal, onBrowseRepos }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm">
      {/* Header with Orange Flash Icon */}
      <div className="flex items-center gap-2 mb-4 text-[#0F172A]">
        <Zap className="w-5 h-5 text-[#FF5A00] fill-[#FF5A00]" />
        <h3 className="text-base font-bold tracking-tight">Quick Actions</h3>
      </div>

      <div className="space-y-2.5">
        {/* Create New Repository Action Card */}
        <button
          onClick={onOpenCreateModal}
          className="w-full group p-3 rounded-2xl bg-gradient-to-r from-orange-50/70 to-amber-50/40 hover:from-orange-100/70 hover:to-amber-100/60 border border-orange-100 flex items-center justify-between text-left transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF5A00] text-white flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-[#FF5A00] transition-colors">
                Create New Repository
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Start a new project on GitHub
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-orange-400 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Upload Files Action Card */}
        <button
          onClick={onOpenUploadModal}
          className="w-full group p-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 flex items-center justify-between text-left transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-[#FF5A00] transition-colors">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-[#FF5A00] transition-colors">
                Upload Files
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Add files to your repository
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Browse Repositories Action Card */}
        <button
          onClick={onBrowseRepos}
          className="w-full group p-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 flex items-center justify-between text-left transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#FF5A00] flex items-center justify-center group-hover:scale-105 transition-transform">
              <FolderGit2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-[#FF5A00] transition-colors">
                Browse Repositories
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                View all your GitHub repos
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
