/**
 * Extracts and validates the GitHub access token from request
 */
export function requireAuth(req, res, next) {
  let token = null;

  // Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader) {
    if (authHeader.startsWith('Bearer ') || authHeader.startsWith('token ')) {
      token = authHeader.split(' ')[1].trim();
    } else {
      token = authHeader.trim();
    }
  }

  // Check cookie as fallback
  if (!token && req.cookies && req.cookies.github_token) {
    token = req.cookies.github_token;
  }

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'GitHub access token is required. Please sign in or provide a token.'
    });
  }

  req.githubToken = token;
  next();
}
