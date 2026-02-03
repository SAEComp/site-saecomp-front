// Tipos baseados no backend (site-saecomp-back-lojinha)
// Sem camada de adapter - frontend usa tipos do backend diretamente

export interface Product {
  id: number;
  name: string;
  description: string;
  value: number;
  imgUrl: string | null;
  category: 'sweet' | 'salty' | 'drink';
  quantity: number;
  barCode?: string | null;
  isActive: boolean;
}

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productStock: number;
  quantity: number;
  value: number;
}

export interface Cart {
  id: number;
  changed: boolean;
  totalValue: number;
  items: CartItem[];
}

export interface OrderItem {
  productName: string;
  quantity: number;
  value: number;
}

export interface Order {
  id: number;
  userName: string;
  date: Date;
  status: 'cart' | 'pendingPayment' | 'canceled' | 'finishedPayment';
  totalValue: number;
  item: OrderItem[];
}

// Tipo específico para pedidos do admin (vem do backend)
export interface AdminOrder {
  _id?: string;
  id: number;
  customerName?: string;
  items?: Array<{
    name?: string;
    productName?: string;
    quantity?: number;
    value?: number;
    price?: number;
    subtotal?: number;
  }>;
  totalAmount?: number;
  status: 'cart' | 'pendingPayment' | 'canceled' | 'finishedPayment';
  paymentStatus?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  confirmedAt?: string | Date;
}

export type PaymentMethod = 'pix';

export interface Payment {
  paymentId: number;
  qrCodeBase64: string;
  pixCopiaECola: string;
}

export interface PendingOrderItem {
  id: number;
  productName: string;
  quantity: number;
  value: number;
}

export interface PendingOrder {
  id: number;
  totalValue: number;
  paymentId: number;
  qrCodeBase64: string;
  pixCopiaECola: string;
  item: PendingOrderItem[];
  date: string | Date;
}

export interface PendingPaymentsResponse {
  buyOrder: PendingOrder[];
}

export interface PixPaymentRequest {
  orderId: string;
  amount: number;
  customerName?: string;
}

export interface PixPaymentResponse {
  totalValue: number;
  paymentData: Payment;
}

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
  [key: string]: any;
}

export interface ProductFilters {
  category?: 'sweet' | 'salty' | 'drink' | 'all';
  name?: string;
  page?: number;
  pageSize?: number;
  includeInactive?: boolean; // Para admin ver produtos inativos
}

export interface PixSettings {
  id: number;
  pixKey: string;
  nameAccount: string;
  cityAccount: string;
  tokenAccount: string;
}

export interface ProductStatistics {
  id: number;
  name: string;
  soldQuantity: number;
  revenueValue: number;
}

export interface Statistics {
  totalRevenueValue: number;
  totalOrders: number;
  finishedOrders: number;
  canceledOrders: number;
  stockProducts: number;
  stockItems: number;
  soldItems: number;
  maxPotentialRevenue?: number; // Valor total do estoque
  productsWithMoreSoldQuantity: ProductStatistics[];
  productsWithMoreRevenueValue: ProductStatistics[];
}

export interface HistoryEntry {
  id: number;
  productId: number;
  productName: string;
  value: number;
  quantity: number;
  date: string | Date;
}

export interface HistoryStats {
  totalEntries: number;
  entriesByType: { [key: string]: number };
  entriesByAction: { [key: string]: number };
  recentActivity: HistoryEntry[];
}
