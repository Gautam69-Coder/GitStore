import {
  getUserRepos,
  createRepo,
  getRepoDetails,
  deleteRepo,
  getRepoCommits,
  getUserActivity,
  getUserProfile
} from '../services/githubService.js';

export async function listRepos(req, res) {
  try {
    const { visibility = 'all', sort = 'updated', direction = 'desc', search = '' } = req.query;
    let repos = await getUserRepos(req.githubToken, { visibility, sort, direction });

    if (search) {
      const q = search.toLowerCase();
      repos = repos.filter(
        r => r.name.toLowerCase().includes(q) || (r.description && r.description.toLowerCase().includes(q))
      );
    }

    res.json({ repos });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch repositories', message: err.message });
  }
}

export async function createRepoHandler(req, res) {
  try {
    const { name, description, isPrivate, autoInit, gitignoreTemplate, licenseTemplate } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Repository name is required' });
    }

    const created = await createRepo(req.githubToken, {
      name: name.trim(),
      description,
      isPrivate,
      autoInit: autoInit !== undefined ? autoInit : true,
      gitignoreTemplate,
      licenseTemplate
    });

    res.status(201).json({ success: true, repo: created });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create repository', message: err.message });
  }
}

export async function getRepoHandler(req, res) {
  try {
    const { owner, repo } = req.params;
    const data = await getRepoDetails(req.githubToken, owner, repo);
    res.json({ repo: data });
  } catch (err) {
    res.status(404).json({ error: 'Repository not found', message: err.message });
  }
}

export async function deleteRepoHandler(req, res) {
  try {
    const { owner, repo } = req.params;
    const result = await deleteRepo(req.githubToken, owner, repo);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete repository', message: err.message });
  }
}

export async function getRepoCommitsHandler(req, res) {
  try {
    const { owner, repo } = req.params;
    const { per_page, page, ref } = req.query;
    const commits = await getRepoCommits(req.githubToken, owner, repo, { per_page, page, ref });
    res.json({ commits });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch commits', message: err.message });
  }
}

export async function getUserActivityHandler(req, res) {
  try {
    const user = await getUserProfile(req.githubToken);
    const activity = await getUserActivity(req.githubToken, user.login);
    res.json({ activity });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user activity', message: err.message });
  }
}

export async function getUserStatsHandler(req, res) {
  try {
    const user = await getUserProfile(req.githubToken);
    const repos = await getUserRepos(req.githubToken, { visibility: 'all' });

    const totalRepos = repos.length;
    const privateRepos = repos.filter(r => r.private).length;
    const publicRepos = totalRepos - privateRepos;
    const totalStars = repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
    const totalForks = repos.reduce((acc, r) => acc + (r.forks_count || 0), 0);

    res.json({
      stats: {
        totalRepos,
        privateRepos,
        publicRepos,
        totalStars,
        totalForks,
        user
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user stats', message: err.message });
  }
}
