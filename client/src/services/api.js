import axiosInstance, { API_BASE_URL } from './axiosInstance';
export { axiosInstance, API_BASE_URL };

export const api = {
  // Authentication
  async getOAuthUrl() {
    const { data } = await axiosInstance.get('/auth/github/url');
    return data;
  },

  async handleOAuthCallback(code) {
    const { data } = await axiosInstance.post('/auth/github/callback', { code });
    return data;
  },

  async loginWithPAT(token) {
    const { data } = await axiosInstance.post('/auth/pat', { token });
    return data;
  },

  async getMe() {
    const { data } = await axiosInstance.get('/auth/me');
    return data;
  },

  async logout() {
    const { data } = await axiosInstance.post('/auth/logout');
    return data;
  },

  // Repositories
  async getRepos(params = {}) {
    const { data } = await axiosInstance.get('/repos', { params });
    return data;
  },

  async createRepo(repoData) {
    const { data } = await axiosInstance.post('/repos', repoData);
    return data;
  },

  async getRepo(owner, repo) {
    const { data } = await axiosInstance.get(`/repos/${owner}/${repo}`);
    return data;
  },

  async deleteRepo(owner, repo) {
    const { data } = await axiosInstance.delete(`/repos/${owner}/${repo}`);
    return data;
  },

  async getRepoCommits(owner, repo, params = {}) {
    const { data } = await axiosInstance.get(`/repos/${owner}/${repo}/commits`, { params });
    return data;
  },

  async getUserStats() {
    const { data } = await axiosInstance.get('/repos/user/stats');
    return data;
  },

  async getUserActivity() {
    const { data } = await axiosInstance.get('/repos/user/activity');
    return data;
  },

  // Content & Files
  async getContents(owner, repo, path = '', ref = '') {
    const cleanPath = path ? `/${path.replace(/^\//, '')}` : '';
    const { data } = await axiosInstance.get(`/repos/${owner}/${repo}/contents${cleanPath}`, {
      params: ref ? { ref } : undefined
    });
    return data;
  },

  async saveFile(owner, repo, path, { message, content, sha, branch }) {
    const cleanPath = `/${path.replace(/^\//, '')}`;
    const { data } = await axiosInstance.put(`/repos/${owner}/${repo}/contents${cleanPath}`, {
      message,
      content,
      sha,
      branch
    });
    return data;
  },

  async deleteFile(owner, repo, path, { message, sha, branch }) {
    const cleanPath = `/${path.replace(/^\//, '')}`;
    const { data } = await axiosInstance.delete(`/repos/${owner}/${repo}/contents${cleanPath}`, {
      data: { message, sha, branch }
    });
    return data;
  },

  async uploadFiles(owner, repo, files, targetDir = '', message = '') {
    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file);
    }
    if (message) formData.append('message', message);

    const { data } = await axiosInstance.post(
      `/repos/${owner}/${repo}/contents/upload`,
      formData,
      {
        params: targetDir ? { dir: targetDir } : undefined,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return data;
  }
};

export default api;
