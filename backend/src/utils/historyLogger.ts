import fs from 'fs/promises';
import path from 'path';
import { HistoryEntry, CreateHistoryEntryRequest } from '../models/History';

const HISTORY_FILE = path.join(__dirname, '../../data/history.json');

// Função auxiliar para gerar ID único
const generateId = (): string => {
  return `hist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

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

// Função para registrar entrada no histórico
export const logHistoryEntry = async (entry: CreateHistoryEntryRequest): Promise<void> => {
  try {
    const history = await readHistory();
    
    const newHistoryEntry: HistoryEntry = {
      _id: generateId(),
      action: entry.action,
      entityType: entry.entityType,
      entityId: entry.entityId,
      entityName: entry.entityName,
      changes: entry.changes,
      timestamp: new Date().toISOString(),
      details: entry.details
    };
    
    history.push(newHistoryEntry);
    await writeHistory(history);
    
    console.log(`✅ Histórico registrado: ${entry.action} ${entry.entityType} "${entry.entityName}"`);
  } catch (error) {
    console.error('❌ Erro ao registrar no histórico:', error);
    // Não queremos que erros de histórico quebrem as operações principais
  }
};

// Função para comparar objetos e gerar lista de mudanças
export const generateChanges = (oldObj: any, newObj: any, excludeFields: string[] = ['_id', 'createdAt', 'updatedAt']): Array<{field: string, oldValue: any, newValue: any}> => {
  const changes: Array<{field: string, oldValue: any, newValue: any}> = [];
  
  // Verificar campos que mudaram
  for (const key in newObj) {
    if (excludeFields.includes(key)) continue;
    
    if (oldObj[key] !== newObj[key]) {
      changes.push({
        field: key,
        oldValue: oldObj[key],
        newValue: newObj[key]
      });
    }
  }
  
  return changes;
};