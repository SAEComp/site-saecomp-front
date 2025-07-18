// Order interfaces for JSON database
export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface IOrder {
  _id: string;
  customerName?: string;
  customerCourse?: string;
  items: IOrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'cancelled';
  paymentMethod?: 'pix';
  paymentId?: string;
  qrCodeData?: string;
  notes?: string;
  confirmedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Order model using JSON database
import { db } from '../config/database';

export class Order {
  static async find(filter: any = {}) {
    const orders = db.getOrders();
    let filtered = orders;

    // Apply filters
    if (filter.status) {
      filtered = filtered.filter((o: IOrder) => o.status === filter.status);
    }

    if (filter.paymentStatus) {
      filtered = filtered.filter((o: IOrder) => o.paymentStatus === filter.paymentStatus);
    }

    if (filter.customerName) {
      const searchTerm = filter.customerName.toLowerCase();
      filtered = filtered.filter((o: IOrder) => 
        o.customerName?.toLowerCase().includes(searchTerm)
      );
    }

    if (filter.paymentId) {
      filtered = filtered.filter((o: IOrder) => o.paymentId === filter.paymentId);
    }

    return filtered;
  }

  static async findById(id: string) {
    return db.getOrderById(id);
  }

  static async findOne(filter: any) {
    const orders = await this.find(filter);
    return orders.length > 0 ? orders[0] : null;
  }

  static async create(orderData: Partial<IOrder>) {
    // Calculate total amount and subtotals
    if (orderData.items) {
      orderData.items = orderData.items.map(item => ({
        ...item,
        subtotal: item.price * item.quantity
      }));
      orderData.totalAmount = orderData.items.reduce((total, item) => total + item.subtotal, 0);
    }

    return db.addOrder(orderData);
  }

  static async findByIdAndUpdate(id: string, updates: Partial<IOrder>) {
    return db.updateOrder(id, updates);
  }

  static async countDocuments(filter: any = {}) {
    const orders = await this.find(filter);
    return orders.length;
  }

  // Helper method to update order status
  static async updateStatus(id: string, status: IOrder['status']) {
    const updates: Partial<IOrder> = { status };
    
    if (status === 'confirmed') {
      updates.confirmedAt = new Date().toISOString();
    }
    
    return db.updateOrder(id, updates);
  }

  // Helper method to update payment status
  static async updatePaymentStatus(id: string, paymentStatus: IOrder['paymentStatus']) {
    return db.updateOrder(id, { paymentStatus });
  }

  // Save method for instances (to mimic Mongoose behavior)
  async save() {
    if ((this as any)._id) {
      return db.updateOrder((this as any)._id, this);
    } else {
      return db.addOrder(this);
    }
  }
}

export default Order;
