export interface HistoryEntry {
  _id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  entityType: 'PRODUCT';
  entityId: string;
  entityName: string;
  changes: {
    field: string;
    oldValue?: any;
    newValue?: any;
  }[];
  timestamp: string;
  details?: {
    stockChange?: number;
    previousStock?: number;
    newStock?: number;
  };
}

export interface CreateHistoryEntryRequest {
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  entityType: 'PRODUCT';
  entityId: string;
  entityName: string;
  changes: {
    field: string;
    oldValue?: any;
    newValue?: any;
  }[];
  details?: {
    stockChange?: number;
    previousStock?: number;
    newStock?: number;
  };
}