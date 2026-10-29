import { mockUser, mockStats, mockRepositories, mockActivities, mockRepoFileTree } from './mockData';

const BASE_URL = '/api';

/**
 * Helper to execute API requests with Authorization header if token present
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('gitstore_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || data?.error || `HTTP error! status: ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth
  async getOAuthUrl() {
    return request('/auth/github/url');
  },

  async handleOAuthCallback(code) {
    return request('/auth/github/callback', {
      method: 'POST',
      body: JSON.stringify({ code })
    });
  },

  async loginWithPAT(token) {
    return request('/auth/pat', {
      method: 'POST',
      body: JSON.stringify({ token })
    });
  },

  async getMe() {
    return request('/auth/me');
  },

  async logout() {
    return request('/auth/logout', { method: 'POST' });
  },

  // Repositories
  async getRepos(params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`/repos${query ? `?${query}` : ''}`);
  },

  async createRepo(data) {
    return request('/repos', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async getRepo(owner, repo) {
    return request(`/repos/${owner}/${repo}`);
  },

  async deleteRepo(owner, repo) {
    return request(`/repos/${owner}/${repo}`, { method: 'DELETE' });
  },

  async getRepoCommits(owner, repo, params = {}) {
    const query = new URLSearchParams(params).toString();
    return request(`/repos/${owner}/${repo}/commits${query ? `?${query}` : ''}`);
  },

  async getUserStats() {
    return request('/repos/user/stats');
  },

  async getUserActivity() {
    return request('/repos/user/activity');
  },

  // Content & Files
  async getContents(owner, repo, path = '', ref = '') {
    const query = ref ? `?ref=${encodeURIComponent(ref)}` : '';
    const cleanPath = path ? `/${path.replace(/^\//, '')}` : '';
    return request(`/repos/${owner}/${repo}/contents${cleanPath}${query}`);
  },

  async saveFile(owner, repo, path, { message, content, sha, branch }) {
    const cleanPath = `/${path.replace(/^\//, '')}`;
    return request(`/repos/${owner}/${repo}/contents${cleanPath}`, {
      method: 'PUT',
      body: JSON.stringify({ message, content, sha, branch })
    });
  },

  async deleteFile(owner, repo, path, { message, sha, branch }) {
    const cleanPath = `/${path.replace(/^\//, '')}`;
    return request(`/repos/${owner}/${repo}/contents${cleanPath}`, {
      method: 'DELETE',
      body: JSON.stringify({ message, sha, branch })
    });
  },

  async uploadFiles(owner, repo, files, targetDir = '', message = '') {
    const token = localStorage.getItem('gitstore_token');
    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file);
    }
    if (message) formData.append('message', message);

    const query = targetDir ? `?dir=${encodeURIComponent(targetDir)}` : '';
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${BASE_URL}/repos/${owner}/${repo}/contents/upload${query}`, {
      method: 'POST',
      headers,
      body: formData
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || data?.error || 'Upload failed');
    }
    return data;
  }
};
