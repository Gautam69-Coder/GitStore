import axios from 'axios';
import { getUserProfile } from '../services/githubService.js';

export async function getAuthUrl(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return res.status(200).json({
      configured: false,
      message: 'GitHub OAuth Client ID is not configured in backend .env. You can still use Personal Access Token or Demo Mode!'
    });
  }

  const redirectUri = `${process.env.CLIENT_URL || 'http://localhost:5173'}/auth/callback`;
  const scope = 'repo,user,read:org';
  const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;

  res.json({ configured: true, url });
}

export async function handleCallback(req, res) {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'OAuth client credentials missing in server .env' });
  }

  try {
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: clientId,
        client_secret: clientSecret,
        code
      },
      {
        headers: { Accept: 'application/json' }
      }
    );

    const { access_token, error, error_description } = tokenResponse.data;
    if (error || !access_token) {
      return res.status(400).json({ error: error || 'Failed to exchange code', description: error_description });
    }

    const userProfile = await getUserProfile(access_token);

    // Set HTTP-only cookie
    res.cookie('github_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      success: true,
      token: access_token,
      user: userProfile
    });
  } catch (err) {
    res.status(500).json({ error: 'OAuth authentication failed', message: err.message });
  }
}

export async function loginWithPAT(req, res) {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: 'Personal Access Token is required' });
  }

  try {
    const userProfile = await getUserProfile(token);

    res.cookie('github_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      token,
      user: userProfile
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid GitHub token or insufficient scopes', message: err.message });
  }
}

export async function getMe(req, res) {
  try {
    const userProfile = await getUserProfile(req.githubToken);
    res.json({ user: userProfile });
  } catch (err) {
    res.status(401).json({ error: 'Failed to fetch user profile', message: err.message });
  }
}

export async function logout(req, res) {
  res.clearCookie('github_token');
  res.json({ success: true, message: 'Logged out successfully' });
}
