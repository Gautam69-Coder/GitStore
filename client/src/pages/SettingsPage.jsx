import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRepo } from '../context/RepoContext';
import { Settings, Shield, Key, RefreshCw, Check, Info } from 'lucide-react';

export default function SettingsPage({ onOpenAuthModal }) {
  const { authMode, isDemo, logout } = useAuth();
  const { refreshRepos } = useRepo();
  const [cacheCleared, setCacheCleared] = useState(false);

  const handleClearCache = () => {
    refreshRepos();
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-6 lg:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-[#FF5A00]">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Application Settings</h2>
            <p className="text-xs text-slate-500">
              Manage your connection to GitHub and local GitStore preferences.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 space-y-6">
          {/* Connection Status */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">GitHub Connection Mode</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Current status: <span className="font-semibold text-slate-800">{authMode.toUpperCase()}</span>
                {isDemo ? ' (Interactive Demo Data)' : ' (Live GitHub API)'}
              </p>
              {authMode === 'pat' && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Token store in localstorage</span>
                </div>
              )}
            </div>
            <button
              onClick={onOpenAuthModal}
              className="w-full sm:w-auto text-center px-4 py-2.5 bg-[#FFF3EC] hover:bg-[#FFE4D6] text-[#FF5A00] text-xs font-bold rounded-xl border border-orange-200 transition-colors"
            >
              Change Connection
            </button>
          </div>

          {/* GitHub OAuth Setup Instructions */}
          <div className="pt-6">
            <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Key className="w-4 h-4 text-[#FF5A00]" />
              GitHub OAuth App Credentials
            </h3>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              To enable 1-click GitHub OAuth logins for multiple users, register a GitHub OAuth application at <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">github.com/settings/developers</code> and populate your server credentials:
            </p>
            <div className="p-3.5 bg-slate-900 text-slate-200 rounded-2xl font-mono text-xs overflow-x-auto">
              <p className="text-slate-400"># server/.env</p>
              <p className="text-orange-400">GITHUB_CLIENT_ID=<span className="text-slate-300">your_github_client_id</span></p>
              <p className="text-orange-400">GITHUB_CLIENT_SECRET=<span className="text-slate-300">your_github_client_secret</span></p>
              <p className="text-emerald-400">CLIENT_URL=<span className="text-slate-300">http://localhost:5173</span></p>
            </div>
          </div>

          {/* Cache Management */}
          <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Refresh & Sync Cache</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Force refresh your repositories and stats directly from GitHub.
              </p>
            </div>
            <button
              onClick={handleClearCache}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
            >
              {cacheCleared ? <Check className="w-4 h-4 text-emerald-600" /> : <RefreshCw className="w-4 h-4" />}
              <span>{cacheCleared ? 'Refreshed!' : 'Sync Now'}</span>
            </button>
          </div>

          {/* Security & Token Info */}
          <div className="pt-6">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
              <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 leading-relaxed">
                <span className="font-bold text-slate-900 block mb-0.5">Security Guarantee</span>
                Your GitHub tokens are transmitted exclusively over encrypted HTTPS/local loopback directly to the GitHub REST API. GitStore never logs, stores, or sells your source code or credentials.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
