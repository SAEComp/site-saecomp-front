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

const API_BASE_URL = import.meta.env.VITE_LOJINHA_API_URL || 'http://localhost:5000/api';

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
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error.response?.data || { message: 'Erro de conexão' });
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
  
  const response = await api.get(`/products?${params.toString()}`);
  return response.data;
};

export const getProductById = async (id: string): Promise<ApiResponse<Product>> => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const getProductsByCategory = async (category: 'doces' | 'salgados' | 'bebidas'): Promise<ApiResponse<Product[]>> => {
  const response = await api.get(`/products/category/${category}`);
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

export const updateOrderStatus = async (id: string, status: string): Promise<ApiResponse<Order>> => {
  const response = await api.patch(`/orders/${id}/status`, { status });
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
  fetchData: fetchProducts
};

export const orderService = {
  create: createOrder,
  getById: getOrderById,
  updateStatus: updateOrderStatus
};

export const paymentService = {
  generatePix: generatePix,
  confirm: confirmPayment,
  getStatus: getPaymentStatus
};

export default api;
