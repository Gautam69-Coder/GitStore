import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRepo } from '../context/RepoContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import RepoExplorer from '../components/repository/RepoExplorer';
import { Loader2, ArrowLeft, AlertCircle } from 'lucide-react';

export default function RepoDetailsPage() {
  const { owner, repo: repoName } = useParams();
  const { repos } = useRepo();
  const { isDemo, token } = useAuth();
  const navigate = useNavigate();

  const [currentRepo, setCurrentRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Try finding in existing context list
    const found = repos.find(
      r => r.name.toLowerCase() === repoName?.toLowerCase() &&
           (!owner || (r.owner && r.owner.login?.toLowerCase() === owner?.toLowerCase()))
    );

    if (found) {
      setCurrentRepo(found);
      setLoading(false);
      return;
    }

    // 2. If not found and in live mode, fetch from API
    if (!isDemo && token && owner && repoName) {
      fetchLiveRepo();
    } else {
      // Create a fallback repo object for demo/preview
      setCurrentRepo({
        name: repoName,
        full_name: `${owner}/${repoName}`,
        owner: { login: owner || 'user' },
        private: false,
        description: `Repository ${repoName}`,
        default_branch: 'main',
        stargazers_count: 0,
        forks_count: 0
      });
      setLoading(false);
    }
  }, [owner, repoName, repos, isDemo, token]);

  const fetchLiveRepo = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getRepo(owner, repoName);
      if (res && res.repo) {
        setCurrentRepo(res.repo);
      } else {
        throw new Error('Repository details not found');
      }
    } catch (err) {
      setError(err.message || 'Could not load repository');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center shadow-sm">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF5A00] mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-700">Loading {repoName}...</p>
      </div>
    );
  }

  if (error || !currentRepo) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-sm max-w-lg mx-auto">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800">Repository Not Found</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          {error || `Could not locate repository "${owner}/${repoName}".`}
        </p>
        <button
          onClick={() => navigate('/repositories')}
          className="px-4 py-2 bg-[#FF5A00] text-white text-xs font-bold rounded-xl"
        >
          Back to Repositories
        </button>
      </div>
    );
  }

  return (
    <RepoExplorer
      repo={currentRepo}
      onBack={() => navigate('/repositories')}
    />
  );
}
