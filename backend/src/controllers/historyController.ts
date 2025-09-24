import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { HistoryEntry, CreateHistoryEntryRequest } from '../models/History';

const HISTORY_FILE = path.join(__dirname, '../../data/history.json');

// Função auxiliar para ler dados do arquivo
const readHistory = async (): Promise<HistoryEntry[]> => {
  try {
    const data = await fs.readFile(HISTORY_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler arquivo de histórico:', error);
    return [];
  }
};

// Função auxiliar para salvar dados no arquivo
const writeHistory = async (history: HistoryEntry[]): Promise<void> => {
  try {
    await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2));
  } catch (error) {
    console.error('Erro ao salvar arquivo de histórico:', error);
    throw error;
  }
};

// Função auxiliar para gerar ID único
const generateId = (): string => {
  return `hist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// GET /api/history - Listar histórico com paginação
export const getHistory = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 50, entityType, action } = req.query;
    
    let history = await readHistory();
    
    // Filtros
    if (entityType) {
      history = history.filter(entry => entry.entityType === entityType);
    }
    
    if (action) {
      history = history.filter(entry => entry.action === action);
    }
    
    // Ordenar por timestamp (mais recente primeiro)
    history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    // Paginação
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    
    const paginatedHistory = history.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedHistory,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: history.length,
        pages: Math.ceil(history.length / limitNum)
      },
      message: `${paginatedHistory.length} entrada${paginatedHistory.length !== 1 ? 's' : ''} de histórico encontrada${paginatedHistory.length !== 1 ? 's' : ''}`
    });
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: 'Erro ao buscar histórico'
    });
  }
};

// POST /api/history - Criar entrada no histórico
export const createHistoryEntry = async (req: Request, res: Response) => {
  try {
    const { action, entityType, entityId, entityName, changes, details, timestamp }: CreateHistoryEntryRequest & { timestamp?: string } = req.body;
    
    // Validação
    if (!action || !entityType || !entityId || !entityName || !changes || !Array.isArray(changes)) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        message: 'Ação, tipo de entidade, ID, nome e mudanças são obrigatórios'
      });
    }
    
    const history = await readHistory();
    
    const newHistoryEntry: HistoryEntry = {
      _id: generateId(),
      action,
      entityType,
      entityId,
      entityName,
      changes,
      timestamp: timestamp || new Date().toISOString(),
      details
    };
    
    history.push(newHistoryEntry);
    await writeHistory(history);
    
    res.status(201).json({
      success: true,
      data: newHistoryEntry,
      message: 'Entrada de histórico criada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao criar entrada de histórico:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: 'Erro ao criar entrada de histórico'
    });
  }
};

// GET /api/history/stats - Estatísticas do histórico
export const getHistoryStats = async (req: Request, res: Response) => {
  try {
    const history = await readHistory();
    
    const stats = {
      totalEntries: history.length,
      actionCounts: {
        CREATE: history.filter(h => h.action === 'CREATE').length,
        UPDATE: history.filter(h => h.action === 'UPDATE').length,
        DELETE: history.filter(h => h.action === 'DELETE').length
      },
      recentActivity: history
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10),
      entityTypeCounts: {
        PRODUCT: history.filter(h => h.entityType === 'PRODUCT').length
      }
    };
    
    res.json({
      success: true,
      data: stats,
      message: 'Estatísticas de histórico obtidas com sucesso'
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas do histórico:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: 'Erro ao buscar estatísticas do histórico'
    });
  }
};