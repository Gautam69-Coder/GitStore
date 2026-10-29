import express from 'express';
import multer from 'multer';
import { getContents, saveFile, removeFile, uploadFiles } from '../controllers/contentController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB max
});

// mergeParams: true allows accessing :owner and :repo from parent router
const router = express.Router({ mergeParams: true });

router.use(requireAuth);

// Upload files route
router.post('/upload', upload.array('files', 20), uploadFiles);

// Wildcard routes for content at path
router.get('/*', getContents);
router.put('/*', saveFile);
router.delete('/*', removeFile);

export default router;
