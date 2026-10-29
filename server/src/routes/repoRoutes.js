import express from 'express';
import {
  listRepos,
  createRepoHandler,
  getRepoHandler,
  deleteRepoHandler,
  getRepoCommitsHandler,
  getUserActivityHandler,
  getUserStatsHandler
} from '../controllers/repoController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', listRepos);
router.post('/', createRepoHandler);
router.get('/user/stats', getUserStatsHandler);
router.get('/user/activity', getUserActivityHandler);
router.get('/:owner/:repo', getRepoHandler);
router.delete('/:owner/:repo', deleteRepoHandler);
router.get('/:owner/:repo/commits', getRepoCommitsHandler);

export default router;
