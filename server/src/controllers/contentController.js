import {
  getRepoContents,
  createOrUpdateFile,
  deleteFile
} from '../services/githubService.js';

export async function getContents(req, res) {
  try {
    const { owner, repo } = req.params;
    // req.params[0] captures wildcard after /contents/
    const filePath = req.params[0] || '';
    const { ref } = req.query;

    const data = await getRepoContents(req.githubToken, owner, repo, filePath, ref);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: 'Failed to get contents', message: err.message });
  }
}

export async function saveFile(req, res) {
  try {
    const { owner, repo } = req.params;
    const filePath = req.params[0] || '';
    const { message, content, sha, branch } = req.body;

    if (!filePath) {
      return res.status(400).json({ error: 'File path is required' });
    }
    if (!message) {
      return res.status(400).json({ error: 'Commit message is required' });
    }

    const result = await createOrUpdateFile(req.githubToken, owner, repo, filePath, {
      message,
      content: content ?? '',
      sha,
      branch
    });

    res.json({ success: true, commit: result.commit, content: result.content });
  } catch (err) {
    res.status(err.status || 500).json({ error: 'Failed to save file', message: err.message });
  }
}

export async function removeFile(req, res) {
  try {
    const { owner, repo } = req.params;
    const filePath = req.params[0] || '';
    const { message, sha, branch } = req.body;

    if (!filePath) {
      return res.status(400).json({ error: 'File path is required' });
    }
    if (!sha) {
      return res.status(400).json({ error: 'File SHA is required' });
    }

    const result = await deleteFile(req.githubToken, owner, repo, filePath, {
      message: message || `Delete ${filePath}`,
      sha,
      branch
    });

    res.json({ success: true, commit: result.commit });
  } catch (err) {
    res.status(err.status || 500).json({ error: 'Failed to delete file', message: err.message });
  }
}

export async function uploadFiles(req, res) {
  try {
    const { owner, repo } = req.params;
    const targetDir = req.query.dir || '';
    const commitMessage = req.body.message || 'Upload files via GitStore';
    const branch = req.body.branch;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    const results = [];
    for (const file of req.files) {
      const filePath = targetDir ? `${targetDir.replace(/^\/|\/$/g, '')}/${file.originalname}` : file.originalname;

      // Check if file already exists to obtain SHA
      let existingSha = null;
      try {
        const existing = await getRepoContents(req.githubToken, owner, repo, filePath, branch);
        if (existing && existing.sha) {
          existingSha = existing.sha;
        }
      } catch {
        // File doesn't exist yet, which is normal for new files
      }

      const result = await createOrUpdateFile(req.githubToken, owner, repo, filePath, {
        message: `${commitMessage}: ${file.originalname}`,
        content: file.buffer,
        sha: existingSha,
        branch
      });

      results.push({
        filename: file.originalname,
        path: filePath,
        commit: result.commit
      });
    }

    res.json({ success: true, uploaded: results });
  } catch (err) {
    res.status(err.status || 500).json({ error: 'Failed to upload files', message: err.message });
  }
}
