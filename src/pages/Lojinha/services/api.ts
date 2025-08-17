import axios, { AxiosResponse } from 'axios';
import { 
  Product, 
  Order, 
  Payment, 
  PaymentMethod,
  PixPaymentRequest,
  PixPaymentResponse,
  ApiResponse, 
  ProductFilters 
} from '../types';

const API_BASE_URL = import.meta.env.VITE_LOJINHA_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Interceptors para tratamento de erros
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({ message: 'Timeout: Verifique sua conexão e tente novamente' });
    }
    
    if (error.code === 'ERR_NETWORK') {
      return Promise.reject({ message: 'Erro de rede: Verifique sua conexão' });
    }
    
    if (error.response?.data) {
      return Promise.reject(error.response.data);
    }
    
    return Promise.reject({ message: error.message || 'Erro de conexão' });
  }
);

// Produtos
export const getProducts = async (filters?: ProductFilters): Promise<ApiResponse<Product[]>> => {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
  }
  
  params.append('_t', Date.now().toString());
  
  const url = `/products?${params.toString()}`;
  
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('❌ API error:', error);
    throw error;
  }
};

export const getProductById = async (id: string): Promise<ApiResponse<Product>> => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const getProductsByCategory = async (category: 'doces' | 'salgados' | 'bebidas'): Promise<ApiResponse<Product[]>> => {
  const response = await api.get(`/products/category/${category}`);
  return response.data;
};

// Admin Product Functions
export const createProduct = async (productData: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Product>> => {
  const response = await api.post('/products', productData);
  return response.data;
};

export const updateProduct = async (id: string, productData: Partial<Product>): Promise<ApiResponse<Product>> => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id: string): Promise<ApiResponse<any>> => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

export const updateStock = async (id: string, stock: number): Promise<ApiResponse<Product>> => {
  const response = await api.patch(`/products/${id}/stock`, { stock });
  return response.data;
};

// Legacy function for backward compatibility
export const fetchProducts = async (filters?: ProductFilters): Promise<Product[]> => {
  const response = await getProducts(filters);
  return response.data || [];
};

// Pedidos
export const createOrder = async (orderData: {
  customerName?: string;
  customerCourse?: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  paymentMethod?: PaymentMethod;
  totalAmount: number;
  notes?: string;
}): Promise<ApiResponse<Order>> => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const getOrderById = async (id: string): Promise<ApiResponse<Order>> => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const getAllOrders = async (filters?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<Order[]>> => {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
  }
  
  const url = `/orders?${params.toString()}`;
  const response = await api.get(url);
  return response.data;
};

export const getOrdersByStatus = async (status: string): Promise<ApiResponse<Order[]>> => {
  const response = await api.get(`/orders/status/${status}`);
  return response.data;
};

export const updateOrderStatus = async (id: string, status: string): Promise<ApiResponse<Order>> => {
  const response = await api.put(`/orders/${id}/status`, { status });
  return response.data;
};

// Pagamentos
export const generatePix = async (paymentData: PixPaymentRequest): Promise<ApiResponse<PixPaymentResponse>> => {
  const response = await api.post('/payments/pix/generate', paymentData);
  return response.data;
};

export const confirmPayment = async (paymentId: string, status: string): Promise<ApiResponse<any>> => {
  const response = await api.post('/payments/confirm', { paymentId, status });
  return response.data;
};

export const getPaymentStatus = async (paymentId: string): Promise<ApiResponse<{
  paymentStatus: string;
  orderStatus: string;
  orderId: string;
}>> => {
  const response = await api.get(`/payments/status/${paymentId}`);
  return response.data;
};

// Health check
export const healthCheck = async (): Promise<{ status: string; message: string }> => {
  const response = await api.get('/../health');
  return response.data;
};

// Organized API services
export const productService = {
  getAll: getProducts,
  getById: getProductById,
  getByCategory: getProductsByCategory,
  fetchData: fetchProducts,
  create: createProduct,
  update: updateProduct,
  delete: deleteProduct,
  updateStock: updateStock
};

export const orderService = {
  create: createOrder,
  getById: getOrderById,
  getAll: getAllOrders,
  getByStatus: getOrdersByStatus,
  updateStatus: updateOrderStatus
};

export const paymentService = {
  generatePix: generatePix,
  confirm: confirmPayment,
  getStatus: getPaymentStatus
};

// Admin/Statistics API
export const getAdminStats = async (): Promise<ApiResponse<{
  totalOrders: number;
  totalRevenue: number;
  completedOrders: number;
  pendingOrders: number;
  totalProductsInStock: number;
  totalItemsInStock: number;
  topProducts: Array<{
    product: Product;
    totalSold: number;
    revenue: number;
  }>;
  recentOrders: Order[];
}>> => {
  // Para agora, vamos simular os dados até que o backend implemente estas estatísticas
  const ordersResponse = await getAllOrders({ limit: 100 });
  const orders = ordersResponse.data || [];
  
  const completedOrders = orders.filter(order => 
    order.status === 'delivered' || order.paymentStatus === 'completed'
  );
  
  const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  
  // Calcular produtos mais vendidos
  const productStats: { [key: string]: { quantity: number; revenue: number; product?: Product } } = {};
  
  completedOrders.forEach(order => {
    order.items.forEach(item => {
      if (!productStats[item.productId]) {
        productStats[item.productId] = { quantity: 0, revenue: 0 };
      }
      productStats[item.productId].quantity += item.quantity;
      productStats[item.productId].revenue += item.subtotal;
    });
  });
  
  // Buscar dados dos produtos mais vendidos
  const productsResponse = await getProducts();
  const products = productsResponse.data || [];
  
  const topProducts = Object.entries(productStats)
    .map(([productId, stats]) => {
      const product = products.find(p => p._id === productId);
      return {
        product: product!,
        totalSold: stats.quantity,
        revenue: stats.revenue
      };
    })
    .filter(item => item.product)
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, 3); // Limitado a 3 produtos mais vendidos
  
  // Calcular total de produtos em estoque (quantidade de produtos diferentes)
  const totalProductsInStock = products.length;
  
  // Calcular total de itens em estoque (soma de todas as quantidades)
  const totalItemsInStock = products.reduce((total, product) => total + product.stock, 0);
  
  return {
    success: true,
    data: {
      totalOrders: orders.length,
      totalRevenue,
      completedOrders: completedOrders.length,
      pendingOrders: orders.filter(order => order.status === 'pending').length,
      totalProductsInStock,
      totalItemsInStock,
      topProducts,
      recentOrders: orders.slice(0, 5)
    }
  };
};

export const adminService = {
  getStats: getAdminStats
};

export default api;
