import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { X, Github, Key, Sparkles, ExternalLink, Loader2, Check, ShieldCheck } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const { loginWithPAT, enableDemoMode, isDemo, authMode } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('pat'); // 'oauth' | 'pat' | 'demo'
  const [patInput, setPatInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [oauthNotice, setOauthNotice] = useState(null);

  if (!isOpen) return null;

  const handleOAuthConnect = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getOAuthUrl();
      if (res.configured && res.url) {
        window.location.href = res.url;
      } else {
        setOauthNotice(
          res.message ||
            'OAuth Client ID not set in server/.env. You can use a Personal Access Token below for instant live connection!'
        );
        setActiveSubTab('pat');
      }
    } catch (err) {
      setError(err.message || 'Could not initiate OAuth');
    } finally {
      setLoading(false);
    }
  };

  const handlePATSubmit = async (e) => {
    e.preventDefault();
    if (!patInput.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const result = await loginWithPAT(patInput.trim());
      if (result.success) {
        setSuccessMessage('Token store in localstorage');
        setTimeout(() => {
          onClose();
          setSuccessMessage(null);
        }, 1200);
      } else {
        setError(result.error || 'Failed to authenticate with token');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemo = () => {
    enableDemoMode();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-100 p-5 sm:p-8 w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 sm:top-6 sm:right-6 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2 pr-10 sm:pr-0">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-[#FF5A00] flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">Connect to GitHub</h3>
            <p className="text-xs text-slate-500">
              Choose your preferred method to authenticate with GitStore.
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
            {error}
          </div>
        )}

        {oauthNotice && (
          <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-800">
            {oauthNotice}
          </div>
        )}

        {successMessage && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 flex items-center gap-2 animate-fade-in">
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Tab switchers */}
        <div className="mt-6 grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveSubTab('pat')}
            className={`py-2 px-1 text-[11px] sm:text-xs font-bold rounded-xl transition-all truncate text-center ${
              activeSubTab === 'pat'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Access Token
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('oauth')}
            className={`py-2 px-1 text-[11px] sm:text-xs font-bold rounded-xl transition-all truncate text-center ${
              activeSubTab === 'oauth'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            GitHub OAuth
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('demo')}
            className={`py-2 px-1 text-[11px] sm:text-xs font-bold rounded-xl transition-all truncate text-center ${
              activeSubTab === 'demo'
                ? 'bg-white text-[#FF5A00] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Demo Mode
          </button>
        </div>

        {/* Tab Content: PAT */}
        {activeSubTab === 'pat' && (
          <form onSubmit={handlePATSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                GitHub Personal Access Token
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={patInput}
                  onChange={(e) => setPatInput(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#FF5A00] focus:ring-2 focus:ring-[#FF5A00]/15"
                />
              </div>

              {/* Message if user adds personal github token */}
              {patInput.trim().length > 0 && (
                <div className="mt-2.5 flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold animate-fade-in">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Token store in localstorage</span>
                </div>
              )}

              <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                Tokens must include the <code className="bg-slate-100 px-1 py-0.5 rounded text-[#FF5A00]">repo</code> and <code className="bg-slate-100 px-1 py-0.5 rounded text-[#FF5A00]">user</code> scopes.{' '}
                <a
                  href="https://github.com/settings/tokens/new?scopes=repo,user,read:org&description=GitStore%20Access"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#FF5A00] font-semibold hover:underline inline-flex items-center gap-0.5"
                >
                  Generate Token on GitHub <ExternalLink className="w-3 h-3 inline" />
                </a>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !patInput.trim()}
              className="w-full py-2.5 bg-[#FF5A00] hover:bg-[#E04F00] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
              <span>{loading ? 'Verifying Token...' : 'Connect with Token'}</span>
            </button>
          </form>
        )}

        {/* Tab Content: OAuth */}
        {activeSubTab === 'oauth' && (
          <div className="mt-6 space-y-4 text-center">
            <p className="text-xs text-slate-600 leading-relaxed">
              Authenticate via GitHub's official OAuth authorization screen. Tokens are securely exchanged on the backend.
            </p>
            <button
              type="button"
              onClick={handleOAuthConnect}
              disabled={loading}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Github className="w-4 h-4" />
              <span>Continue with GitHub OAuth</span>
            </button>
          </div>
        )}

        {/* Tab Content: Demo Mode */}
        {activeSubTab === 'demo' && (
          <div className="mt-6 space-y-4 text-center">
            <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-100 text-left">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1">
                <Sparkles className="w-4 h-4 text-[#FF5A00]" />
                <span>Zero-Config Demonstration</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Interact with the exact mockup data (Gautam Doliya, 12 repositories, recent activities, code editor, and file creator) without needing any GitHub credentials.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSelectDemo}
              className="w-full py-2.5 bg-[#FF5A00] hover:bg-[#E04F00] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Use Interactive Demo Mode</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
