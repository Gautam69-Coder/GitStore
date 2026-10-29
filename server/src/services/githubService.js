import { Octokit } from '@octokit/rest';

/**
 * Creates an authenticated Octokit client instance
 */
export function getOctokit(token) {
  if (!token) {
    throw new Error('GitHub access token is required');
  }
  return new Octokit({
    auth: token,
    userAgent: 'GitStore-App-v1.0'
  });
}

/**
 * Get authenticated user profile
 */
export async function getUserProfile(token) {
  const octokit = getOctokit(token);
  const { data } = await octokit.rest.users.getAuthenticated();
  return {
    id: data.id,
    login: data.login,
    name: data.name || data.login,
    avatar_url: data.avatar_url,
    bio: data.bio || '',
    html_url: data.html_url,
    public_repos: data.public_repos,
    total_private_repos: data.total_private_repos ?? 0,
    followers: data.followers,
    following: data.following,
    created_at: data.created_at
  };
}

/**
 * Get authenticated user repositories
 */
export async function getUserRepos(token, options = {}) {
  const octokit = getOctokit(token);
  const { visibility = 'all', sort = 'updated', direction = 'desc', per_page = 100, page = 1 } = options;
  
  const { data } = await octokit.rest.repos.listForAuthenticatedUser({
    visibility,
    sort,
    direction,
    per_page,
    page,
    affiliation: 'owner,collaborator'
  });

  return data.map(repo => ({
    id: repo.id,
    name: repo.name,
    full_name: repo.full_name,
    owner: {
      login: repo.owner.login,
      avatar_url: repo.owner.avatar_url
    },
    private: repo.private,
    html_url: repo.html_url,
    description: repo.description,
    fork: repo.fork,
    created_at: repo.created_at,
    updated_at: repo.updated_at,
    pushed_at: repo.pushed_at,
    stargazers_count: repo.stargazers_count,
    watchers_count: repo.watchers_count,
    forks_count: repo.forks_count,
    open_issues_count: repo.open_issues_count,
    default_branch: repo.default_branch,
    language: repo.language,
    size: repo.size
  }));
}

/**
 * Create a new repository for the authenticated user
 */
export async function createRepo(token, repoData) {
  const octokit = getOctokit(token);
  const { name, description = '', isPrivate = false, autoInit = true, gitignoreTemplate = '', licenseTemplate = '' } = repoData;

  const payload = {
    name,
    description,
    private: Boolean(isPrivate),
    auto_init: Boolean(autoInit)
  };

  if (gitignoreTemplate) payload.gitignore_template = gitignoreTemplate;
  if (licenseTemplate) payload.license_template = licenseTemplate;

  const { data } = await octokit.rest.repos.createForAuthenticatedUser(payload);
  return data;
}

/**
 * Get single repository details
 */
export async function getRepoDetails(token, owner, repo) {
  const octokit = getOctokit(token);
  const { data } = await octokit.rest.repos.get({ owner, repo });
  return data;
}

/**
 * Delete a repository
 */
export async function deleteRepo(token, owner, repo) {
  const octokit = getOctokit(token);
  await octokit.rest.repos.delete({ owner, repo });
  return { success: true, message: `Repository ${owner}/${repo} deleted successfully` };
}

/**
 * Get contents of a file or directory in a repository
 */
export async function getRepoContents(token, owner, repo, path = '', ref) {
  const octokit = getOctokit(token);
  const params = {
    owner,
    repo,
    path: path.replace(/^\//, '')
  };
  if (ref) params.ref = ref;

  const { data } = await octokit.rest.repos.getContent(params);

  // If directory, array of items
  if (Array.isArray(data)) {
    return data.map(item => ({
      name: item.name,
      path: item.path,
      sha: item.sha,
      size: item.size,
      url: item.url,
      html_url: item.html_url,
      type: item.type, // 'dir' | 'file'
      download_url: item.download_url
    }));
  }

  // If single file
  const ext = (data.name.split('.').pop() || '').toLowerCase();
  const imageMimes = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    webp: 'image/webp',
    bmp: 'image/bmp',
    ico: 'image/x-icon'
  };

  const isImage = Boolean(imageMimes[ext]);
  const isPdf = ext === 'pdf';
  const isBinary = isImage || isPdf;

  let contentText = null;
  let dataUrl = null;

  if (data.encoding === 'base64' && data.content) {
    const cleanBase64 = data.content.replace(/\r?\n/g, '');
    if (isImage) {
      dataUrl = `data:${imageMimes[ext]};base64,${cleanBase64}`;
    } else if (isPdf) {
      dataUrl = `data:application/pdf;base64,${cleanBase64}`;
    } else {
      try {
        contentText = Buffer.from(cleanBase64, 'base64').toString('utf-8');
      } catch {
        contentText = null;
      }
    }
  }

  return {
    name: data.name,
    path: data.path,
    sha: data.sha,
    size: data.size,
    type: data.type,
    content: contentText,
    data_url: dataUrl,
    is_image: isImage,
    is_pdf: isPdf,
    is_binary: isBinary,
    mime_type: imageMimes[ext] || (isPdf ? 'application/pdf' : 'text/plain'),
    encoding: data.encoding,
    raw_content: data.content,
    download_url: data.download_url,
    html_url: data.html_url
  };
}

/**
 * Create or update a file in the repository with a commit message
 */
export async function createOrUpdateFile(token, owner, repo, path, options) {
  const octokit = getOctokit(token);
  const { message, content, sha, branch } = options;

  if (!message) throw new Error('Commit message is required');
  if (content === undefined) throw new Error('File content is required');

  const cleanPath = path.replace(/^\//, '');
  const base64Content = Buffer.isBuffer(content)
    ? content.toString('base64')
    : Buffer.from(content).toString('base64');

  const params = {
    owner,
    repo,
    path: cleanPath,
    message,
    content: base64Content
  };

  if (sha) params.sha = sha;
  if (branch) params.branch = branch;

  const { data } = await octokit.rest.repos.createOrUpdateFileContents(params);
  return data;
}

/**
 * Delete a file from the repository with a commit message
 */
export async function deleteFile(token, owner, repo, path, options) {
  const octokit = getOctokit(token);
  const { message, sha, branch } = options;

  if (!message) throw new Error('Commit message is required');
  if (!sha) throw new Error('File SHA is required to delete');

  const cleanPath = path.replace(/^\//, '');
  const params = {
    owner,
    repo,
    path: cleanPath,
    message,
    sha
  };
  if (branch) params.branch = branch;

  const { data } = await octokit.rest.repos.deleteFile(params);
  return data;
}

/**
 * Get recent commits for a repository
 */
export async function getRepoCommits(token, owner, repo, options = {}) {
  const octokit = getOctokit(token);
  const { per_page = 30, page = 1, sha } = options;

  const params = { owner, repo, per_page, page };
  if (sha) params.sha = sha;

  const { data } = await octokit.rest.repos.listCommits(params);
  return data.map(commit => ({
    sha: commit.sha,
    message: commit.commit.message,
    author: {
      name: commit.commit.author.name,
      email: commit.commit.author.email,
      date: commit.commit.author.date,
      avatar_url: commit.author?.avatar_url
    },
    html_url: commit.html_url
  }));
}

/**
 * Get authenticated user's activity/events feed
 */
export async function getUserActivity(token, username) {
  const octokit = getOctokit(token);
  const { data } = await octokit.rest.activity.listEventsForAuthenticatedUser({
    username,
    per_page: 20
  });

  return data.map(event => ({
    id: event.id,
    type: event.type,
    repo: event.repo.name,
    created_at: event.created_at,
    actor: {
      login: event.actor.login,
      avatar_url: event.actor.avatar_url
    },
    payload: event.payload
  }));
}
