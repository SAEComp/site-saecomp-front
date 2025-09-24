import { Router } from 'express';
import {
  getHistory,
  createHistoryEntry,
  getHistoryStats
} from '../controllers/historyController';

const router = Router();

// GET /api/history - Listar histórico
router.get('/', getHistory);

// POST /api/history - Criar entrada no histórico
router.post('/', createHistoryEntry);

// GET /api/history/stats - Estatísticas do histórico
router.get('/stats', getHistoryStats);

export default router;