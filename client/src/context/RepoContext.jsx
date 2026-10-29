import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';
import {
  mockRepositories,
  mockStats,
  mockActivities,
  mockRepoFileTree
} from '../services/mockData';

const RepoContext = createContext();

export function RepoProvider({ children }) {
  const { isDemo, user, token } = useAuth();

  const [repos, setRepos] = useState(mockRepositories);
  const [stats, setStats] = useState(mockStats);
  const [activities, setActivities] = useState(mockActivities);
  const [fileTrees, setFileTrees] = useState(mockRepoFileTree);
  const [activeRepo, setActiveRepo] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'public' | 'private'
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isDemo && token) {
      loadRealData();
    } else {
      // Demo mode defaults
      setRepos(mockRepositories);
      setStats(mockStats);
      setActivities(mockActivities);
      setFileTrees(mockRepoFileTree);
    }
  }, [isDemo, token]);

  const loadRealData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [reposRes, statsRes, actRes] = await Promise.allSettled([
        api.getRepos({ visibility: 'all' }),
        api.getUserStats(),
        api.getUserActivity()
      ]);

      if (reposRes.status === 'fulfilled' && reposRes.value.repos) {
        setRepos(reposRes.value.repos);
      }
      if (statsRes.status === 'fulfilled' && statsRes.value.stats) {
        setStats(statsRes.value.stats);
      }
      if (actRes.status === 'fulfilled' && actRes.value.activity) {
        // Map GitHub events to activity items
        const acts = actRes.value.activity.map(a => {
          let iconColor = 'blue';
          let title = 'Activity on';
          if (a.type === 'PushEvent') {
            iconColor = 'green';
            title = 'You pushed to';
          } else if (a.type === 'CreateEvent') {
            iconColor = 'orange';
            title = 'Created in';
          } else if (a.type === 'WatchEvent') {
            iconColor = 'yellow';
            title = 'You starred';
          }
          return {
            id: a.id,
            type: a.type,
            iconColor,
            title,
            target: a.repo,
            time: new Date(a.created_at).toLocaleDateString()
          };
        });
        if (acts.length > 0) setActivities(acts);
      }
    } catch (err) {
      console.error('Error loading real GitHub data:', err);
      setError('Could not fetch live GitHub repositories. Falling back to cached view.');
    } finally {
      setLoading(false);
    }
  };

  // Filtered repositories based on search and visibility
  const filteredRepos = repos.filter(repo => {
    const matchesFilter =
      filter === 'all' ? true :
      filter === 'private' ? repo.private === true :
      repo.private === false;

    const matchesSearch =
      searchQuery.trim() === '' ||
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const createRepository = async (repoData) => {
    if (isDemo) {
      const newRepo = {
        id: Date.now(),
        name: repoData.name,
        full_name: `${user.login}/${repoData.name}`,
        owner: { login: user.login, avatar_url: user.avatar_url },
        private: Boolean(repoData.isPrivate),
        html_url: `https://github.com/${user.login}/${repoData.name}`,
        description: repoData.description || '',
        fork: false,
        created_at: new Date().toISOString(),
        updated_at: 'Just now',
        pushed_at: new Date().toISOString(),
        stargazers_count: 0,
        forks_count: 0,
        default_branch: 'main',
        language: 'Markdown',
        size: 12
      };

      setRepos(prev => [newRepo, ...prev]);
      setStats(prev => ({
        ...prev,
        totalRepos: prev.totalRepos + 1,
        privateRepos: newRepo.private ? prev.privateRepos + 1 : prev.privateRepos,
        publicRepos: !newRepo.private ? prev.publicRepos + 1 : prev.publicRepos
      }));

      // Initialize file tree for new repo
      setFileTrees(prev => ({
        ...prev,
        [newRepo.name]: [
          {
            name: 'README.md',
            path: 'README.md',
            type: 'file',
            size: 180,
            sha: 'init-readme',
            content: `# ${newRepo.name}\n\n${repoData.description || 'Welcome to your new repository.'}\n`
          }
        ]
      }));

      setActivities(prev => [
        {
          id: `act-${Date.now()}`,
          type: 'create',
          iconColor: 'orange',
          title: 'Repository created',
          target: newRepo.name,
          time: 'Just now',
          details: 'Repository initialized with README'
        },
        ...prev
      ]);

      return { success: true, repo: newRepo };
    }

    // Live mode
    const res = await api.createRepo(repoData);
    await loadRealData();
    return res;
  };

  const deleteRepository = async (owner, repoName) => {
    if (isDemo) {
      setRepos(prev => prev.filter(r => r.name !== repoName));
      return { success: true };
    }
    const res = await api.deleteRepo(owner, repoName);
    await loadRealData();
    return res;
  };

  return (
    <RepoContext.Provider
      value={{
        repos,
        filteredRepos,
        stats,
        activities,
        fileTrees,
        setFileTrees,
        activeRepo,
        setActiveRepo,
        filter,
        setFilter,
        searchQuery,
        setSearchQuery,
        loading,
        error,
        refreshRepos: loadRealData,
        createRepository,
        deleteRepository
      }}
    >
      {children}
    </RepoContext.Provider>
  );
}

export function useRepo() {
  return useContext(RepoContext);
}
