import express from 'express';
import { getAuthUrl, handleCallback, loginWithPAT, getMe, logout } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/github/url', getAuthUrl);
router.post('/github/callback', handleCallback);
router.post('/pat', loginWithPAT);
router.get('/me', requireAuth, getMe);
router.post('/logout', logout);

export default router;
