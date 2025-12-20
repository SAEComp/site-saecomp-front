import axios, { AxiosResponse } from 'axios';
import { 
  Product, 
  Cart,
  Order, 
  PixPaymentResponse,
  ApiResponse, 
  ProductFilters,
  PixSettings,
  Statistics,
  HistoryEntry
} from '../types';
import authInterceptor from '../../../providers/authInterceptor';

const API_BASE_URL = import.meta.env.VITE_LOJINHA_API_URL || 'http://localhost:3000/api/lojinha';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// 🔑 Interceptor de autenticação - Adiciona token JWT automaticamente
api.interceptors.request.use(
  (config) => {
    // Tenta pegar token de múltiplas fontes
    const token = 
      localStorage.getItem('token') || 
      localStorage.getItem('authToken') ||
      sessionStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('⚠️ Token não encontrado. Requisição pode falhar se rota exigir autenticação.');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🚨 Interceptor para tratamento de erros
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // Não logar erros 404 de carrinho (são esperados após finalizar pedido)
    const isCartNotFound = error.response?.status === 404 && 
                          error.config?.url?.includes('/cart') &&
                          (error.response?.data?.message?.includes('Carrinho inexistente') || 
                           error.response?.data?.message?.includes('Cart not found'));
    
    if (!isCartNotFound) {
      console.error('API Error:', error);
    }
    
    // Erro de autenticação (apenas loga, não redireciona)
    if (error.response?.status === 401) {
      console.warn('⚠️ Requisição não autenticada. Algumas funcionalidades podem estar limitadas.');
      return Promise.reject({ message: 'Esta ação requer autenticação.' });
    }
    
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({ message: 'Timeout: Verifique sua conexão e tente novamente' });
    }
    
    if (error.code === 'ERR_NETWORK') {
      return Promise.reject({ message: 'Erro de rede: Verifique sua conexão com o backend' });
    }
    
    if (error.response?.data) {
      return Promise.reject(error.response.data);
    }
    
    return Promise.reject({ message: error.message || 'Erro de conexão' });
  }
);

// ======================
// PRODUTOS
// ======================

export const getProducts = async (filters?: ProductFilters): Promise<ApiResponse<Product[]>> => {
  const params = new URLSearchParams();
  
  if (filters?.category && filters.category !== 'all') {
    params.append('category', filters.category);
  }
  
  if (filters?.search) {
    params.append('search', filters.search);
  }
  
  if (filters?.includeInactive) {
    params.append('includeInactive', 'true');
  }
  
  try {
    const response = await api.get('/products', { params });
    // Backend retorna { product: [...] }
    const products = response.data.product || response.data || [];
    return {
      success: true,
      data: Array.isArray(products) ? products : []
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductById = async (id: number): Promise<ApiResponse<Product>> => {
  const response = await api.get('/product', {
    params: { productId: id }
  });
  return {
    success: true,
    data: response.data
  };
};

export const getProductsByCategory = async (category: 'sweet' | 'salty' | 'drink'): Promise<ApiResponse<Product[]>> => {
  const response = await api.get('/products', {
    params: { category }
  });
  return {
    success: true,
    data: response.data.product || []
  };
};

// ======================
// ADMIN - PRODUTOS
// ======================

export const createProduct = async (productData: Omit<Product, 'id'>): Promise<ApiResponse<Product>> => {
  const response = await api.post('/admin/product', productData);
  return {
    success: true,
    data: response.data.product
  };
};

export const updateProduct = async (id: number, productData: Partial<Product> & { productId?: number }): Promise<ApiResponse<Product>> => {
  // Garante que productId está no corpo da requisição
  const requestData = {
    ...productData,
    productId: productData.productId || id
  };
  
  const response = await api.put('/admin/product', requestData);
  return {
    success: true,
    data: response.data.product
  };
};

export const deleteProduct = async (id: number): Promise<ApiResponse<any>> => {
  const response = await api.delete('/admin/product', {
    params: { productId: id }
  });
  return {
    success: true,
    data: response.data
  };
};

export const updateStock = async (id: number, quantity: number): Promise<ApiResponse<Product>> => {
  return updateProduct(id, { quantity });
};

// ======================
// CARRINHO
// ======================

export const getCart = async (): Promise<ApiResponse<Cart>> => {
  const response = await api.get('/cart');
  return {
    success: true,
    data: response.data
  };
};

export const addToCart = async (productId: number, quantity: number): Promise<ApiResponse<Cart>> => {
  await api.post('/cart', {
    productId,
    quantity
  });
  // Após adicionar, buscar o carrinho atualizado
  const cartResponse = await api.get('/cart');
  return {
    success: true,
    data: cartResponse.data
  };
};

export const updateCartItem = async (itemId: number, quantity: number): Promise<ApiResponse<Cart>> => {
  await api.put('/item', {
    id: itemId,
    quantity
  });
  // Após atualizar, buscar o carrinho atualizado
  const cartResponse = await api.get('/cart');
  return {
    success: true,
    data: cartResponse.data
  };
};

export const removeFromCart = async (itemId: number): Promise<ApiResponse<any>> => {
  const response = await api.delete('/item', {
    params: { itemId: itemId }
  });
  return {
    success: true,
    data: response.data
  };
};

export const clearCart = async (): Promise<ApiResponse<any>> => {
  const response = await api.delete('/cart');
  return {
    success: true,
    data: response.data
  };
};

// ======================
// PEDIDOS E PAGAMENTOS
// ======================

export const finishOrder = async (): Promise<ApiResponse<PixPaymentResponse & { buyOrderId: number }>> => {
  // Primeiro busca o carrinho para pegar o buyOrderId
  const cartResponse = await api.get('/cart');
  const buyOrderId = cartResponse.data.id;
  
  const response = await api.post('/finish-order', {
    buyOrderId
  });
  return {
    success: true,
    data: {
      ...response.data,
      buyOrderId // Retorna o buyOrderId para uso futuro
    }
  };
};

export const cancelPayment = async (buyOrderId: number): Promise<ApiResponse<any>> => {
  const response = await api.post('/cancel-payment', {
    buyOrderId
  });
  return {
    success: true,
    data: response.data
  };
};

export const getPaymentStatus = async (paymentId: number): Promise<ApiResponse<any>> => {
  const response = await api.get('/listen-payment', {
    params: { paymentId }
  });
  return {
    success: true,
    data: response.data
  };
};

export const getPendingPayments = async (): Promise<ApiResponse<any[]>> => {
  const response = await api.get('/pending-payment');
  return {
    success: true,
    data: response.data.pendingPayments || []
  };
};

// ======================
// ADMIN - PEDIDOS
// ======================

export const getOrdersHistory = async (filters?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<Order[]>> => {
  const params = new URLSearchParams();
  
  // Parâmetros obrigatórios
  params.append('page', filters?.page?.toString() || '1');
  params.append('pageSize', filters?.limit?.toString() || '10');
  
  // Parâmetros opcionais
  if (filters?.status) {
    params.append('status', filters.status);
  }
  
  const response = await api.get('/admin/orders-history', { params });
  
  // Mapear dados do backend para formato esperado pelo frontend
  const orders = (response.data.buyOrder || []).map((order: any) => ({
    _id: order.id.toString(),
    id: order.id,
    customerName: order.userName,
    items: (order.item || []).map((item: any) => ({
      name: item.productName,
      productName: item.productName,
      quantity: item.quantity,
      value: item.value,
      price: item.value,
      subtotal: item.value * item.quantity
    })),
    totalAmount: order.totalValue,
    status: order.status,
    paymentStatus: order.status,
    createdAt: order.date,
    updatedAt: order.date
  }));
  
  return {
    success: true,
    data: orders
  };
};

// ======================
// ADMIN - ESTATÍSTICAS
// ======================

export const getStatistics = async (): Promise<ApiResponse<Statistics>> => {
  const response = await api.get('/admin/statistics', {
    params: {
      moreSoldQnt: 5,
      moreRevenueQnt: 5
    }
  });
  return {
    success: true,
    data: response.data
  };
};

// ======================
// ADMIN - PIX SETTINGS
// ======================

export const getAllPixSettings = async (): Promise<ApiResponse<PixSettings[]>> => {
  const response = await api.get('/admin/pix-key');
  // Backend retorna um objeto único, não um array
  // Convertemos para array para manter compatibilidade com o componente
  const pixData = response.data;
  return {
    success: true,
    data: pixData ? [pixData] : []
  };
};

export const createPixSettings = async (pixData: Omit<PixSettings, 'id'>): Promise<ApiResponse<PixSettings>> => {
  const response = await api.post('/admin/pix-key', pixData);
  return {
    success: true,
    data: response.data.pixKey
  };
};

export const deletePixSettings = async (id: number): Promise<ApiResponse<any>> => {
  const response = await api.delete('/admin/pix-key', {
    params: { id }
  });
  return {
    success: true,
    data: response.data
  };
};

// ======================
// ADMIN - HISTÓRICO
// ======================

export const getHistory = async (params?: { 
  page?: number; 
  pageSize?: number; 
  entityType?: string; 
  action?: string 
}): Promise<ApiResponse<HistoryEntry[]>> => {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
  if (params?.entityType) queryParams.append('entityType', params.entityType);
  if (params?.action) queryParams.append('action', params.action);
  
  const response = await api.get('/admin/entries-history', { params: queryParams });
  
  return {
    success: true,
    data: response.data.entryHistory || []
  };
};

// ======================
// HEALTH CHECK
// ======================

export const healthCheck = async (): Promise<{ status: string; message: string }> => {
  try {
    const response = await api.get('/../../health');
    return response.data;
  } catch {
    return { status: 'ok', message: 'API disponível' };
  }
};

// ======================
// SERVIÇOS ORGANIZADOS
// ======================

export const productService = {
  getAll: getProducts,
  getById: getProductById,
  getByCategory: getProductsByCategory,
  create: createProduct,
  update: updateProduct,
  delete: deleteProduct,
  updateStock: updateStock
};

export const cartService = {
  get: getCart,
  add: addToCart,
  update: updateCartItem,
  remove: removeFromCart,
  clear: clearCart
};

export const orderService = {
  finish: finishOrder,
  getHistory: getOrdersHistory,
  getAll: getOrdersHistory, // Alias para compatibilidade
  getByStatus: async (status: string) => {
    // Implementa filtro por status localmente já que backend não tem endpoint específico
    const allOrders = await getOrdersHistory();
    if (!allOrders.data) return allOrders;
    
    const filtered = allOrders.data.filter(order => order.status === status);
    return {
      ...allOrders,
      data: filtered
    };
  }
};

export const paymentService = {
  cancel: cancelPayment,
  getStatus: getPaymentStatus,
  getPending: getPendingPayments
};

export const adminService = {
  getStats: getStatistics
};

export const pixService = {
  getAll: getAllPixSettings,
  create: createPixSettings,
  delete: deletePixSettings
};

export const historyService = {
  getHistory
};

export default api;
