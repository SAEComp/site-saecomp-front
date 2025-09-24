import { Router } from 'express';
import {
  getAllPixSettings,
  getPixSettingsById,
  createPixSettings,
  updatePixSettings,
  deletePixSettings
} from '../controllers/pixController';

const router = Router();

// GET /api/pix-settings - Listar todas as chaves PIX
router.get('/', getAllPixSettings);

// GET /api/pix-settings/:id - Buscar chave PIX por ID
router.get('/:id', getPixSettingsById);

// POST /api/pix-settings - Criar nova chave PIX
router.post('/', createPixSettings);

// PUT /api/pix-settings/:id - Atualizar chave PIX
router.put('/:id', updatePixSettings);

// DELETE /api/pix-settings/:id - Deletar chave PIX
router.delete('/:id', deletePixSettings);

export default router;
