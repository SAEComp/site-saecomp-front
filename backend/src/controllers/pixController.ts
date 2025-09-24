import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { PixSettings, CreatePixSettingsRequest, UpdatePixSettingsRequest } from '../models/PixSettings';

const PIX_SETTINGS_FILE = path.join(__dirname, '../../data/pix-settings.json');

// Função auxiliar para ler dados do arquivo
const readPixSettings = async (): Promise<PixSettings[]> => {
  try {
    const data = await fs.readFile(PIX_SETTINGS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler arquivo de configurações PIX:', error);
    return [];
  }
};

// Função auxiliar para salvar dados no arquivo
const writePixSettings = async (pixSettings: PixSettings[]): Promise<void> => {
  try {
    await fs.writeFile(PIX_SETTINGS_FILE, JSON.stringify(pixSettings, null, 2));
  } catch (error) {
    console.error('Erro ao salvar arquivo de configurações PIX:', error);
    throw error;
  }
};

// Função auxiliar para gerar ID único
const generateId = (): string => {
  return `pix_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// GET /api/pix-settings - Listar todas as chaves PIX
export const getAllPixSettings = async (req: Request, res: Response) => {
  try {
    const pixSettings = await readPixSettings();
    
    res.json({
      success: true,
      data: pixSettings,
      message: `${pixSettings.length} chave${pixSettings.length !== 1 ? 's' : ''} PIX encontrada${pixSettings.length !== 1 ? 's' : ''}`
    });
  } catch (error) {
    console.error('Erro ao buscar configurações PIX:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: 'Erro ao buscar configurações PIX'
    });
  }
};

// GET /api/pix-settings/:id - Buscar chave PIX por ID
export const getPixSettingsById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pixSettings = await readPixSettings();
    const pixSetting = pixSettings.find(p => p._id === id);
    
    if (!pixSetting) {
      return res.status(404).json({
        success: false,
        error: 'Não encontrado',
        message: 'Chave PIX não encontrada'
      });
    }
    
    res.json({
      success: true,
      data: pixSetting
    });
  } catch (error) {
    console.error('Erro ao buscar configuração PIX:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: 'Erro ao buscar configuração PIX'
    });
  }
};

// POST /api/pix-settings - Criar nova chave PIX
export const createPixSettings = async (req: Request, res: Response) => {
  try {
    const { pixKey, ownerName, city, isActive }: CreatePixSettingsRequest = req.body;
    
    // Validação
    if (!pixKey || !ownerName || !city) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        message: 'Chave PIX, nome completo e cidade são obrigatórios'
      });
    }
    
    const pixSettings = await readPixSettings();
    
    // Verificar se a chave PIX já existe
    const existingKey = pixSettings.find(p => p.pixKey === pixKey);
    if (existingKey) {
      return res.status(400).json({
        success: false,
        error: 'Chave já existe',
        message: 'Esta chave PIX já está cadastrada'
      });
    }
    
    const newPixSettings: PixSettings = {
      _id: generateId(),
      pixKey: pixKey.trim(),
      ownerName: ownerName.trim(),
      city: city.trim(),
      isActive: isActive !== undefined ? isActive : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    pixSettings.push(newPixSettings);
    await writePixSettings(pixSettings);
    
    res.status(201).json({
      success: true,
      data: newPixSettings,
      message: 'Chave PIX criada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao criar configuração PIX:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: 'Erro ao criar configuração PIX'
    });
  }
};

// PUT /api/pix-settings/:id - Atualizar chave PIX
export const updatePixSettings = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates: UpdatePixSettingsRequest = req.body;
    
    const pixSettings = await readPixSettings();
    const pixIndex = pixSettings.findIndex(p => p._id === id);
    
    if (pixIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Não encontrado',
        message: 'Chave PIX não encontrada'
      });
    }
    
    // Verificar se a nova chave PIX já existe (se estiver sendo alterada)
    if (updates.pixKey && updates.pixKey !== pixSettings[pixIndex].pixKey) {
      const existingKey = pixSettings.find(p => p.pixKey === updates.pixKey && p._id !== id);
      if (existingKey) {
        return res.status(400).json({
          success: false,
          error: 'Chave já existe',
          message: 'Esta chave PIX já está cadastrada'
        });
      }
    }
    
    // Atualizar campos
    const updatedPixSettings = {
      ...pixSettings[pixIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    pixSettings[pixIndex] = updatedPixSettings;
    await writePixSettings(pixSettings);
    
    res.json({
      success: true,
      data: updatedPixSettings,
      message: 'Chave PIX atualizada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar configuração PIX:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: 'Erro ao atualizar configuração PIX'
    });
  }
};

// DELETE /api/pix-settings/:id - Deletar chave PIX
export const deletePixSettings = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const pixSettings = await readPixSettings();
    const pixIndex = pixSettings.findIndex(p => p._id === id);
    
    if (pixIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Não encontrado',
        message: 'Chave PIX não encontrada'
      });
    }
    
    const deletedPixSettings = pixSettings.splice(pixIndex, 1)[0];
    await writePixSettings(pixSettings);
    
    res.json({
      success: true,
      data: deletedPixSettings,
      message: 'Chave PIX removida com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar configuração PIX:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      message: 'Erro ao deletar configuração PIX'
    });
  }
};
