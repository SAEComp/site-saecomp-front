export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: 'doces' | 'salgados' | 'bebidas';
  stock: number;
  isActive: boolean;
  isAvailable?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: 'doces' | 'salgados' | 'bebidas';
  stock: number;
  isActive: boolean;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  _id: string;
  customerName?: string;
  customerCourse?: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'cancelled';
  paymentMethod?: PaymentMethod;
  paymentId?: string;
  qrCodeData?: string;
  notes?: string;
  confirmedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type PaymentMethod = 'pix';

export interface Payment {
  orderId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: 'pending' | 'completed' | 'failed';
  qrCode?: string;
}

export interface PixPaymentRequest {
  orderId: string;
  amount: number;
  customerName?: string;
}

export interface PixPaymentResponse {
  qrCode: string;
  pixCode: string;
  paymentId: string;
  expiresAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ProductFilters {
  category?: 'doces' | 'salgados' | 'bebidas' | 'all';
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'price' | 'createdAt' | 'stock';
  order?: 'asc' | 'desc';
}
