// Product interface for JSON database
export interface IProduct {
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

// Product model using JSON database
import { db } from '../config/database';

export class Product {
  static async find(filter: any = {}) {
    const products = db.getProducts();
    let filtered = products;

    // Apply filters
    if (filter.category && filter.category !== 'all') {
      filtered = filtered.filter((p: IProduct) => p.category === filter.category);
    }

    if (filter.isActive !== undefined) {
      filtered = filtered.filter((p: IProduct) => p.isActive === filter.isActive);
    }

    if (filter.name) {
      const searchTerm = filter.name.toLowerCase();
      filtered = filtered.filter((p: IProduct) => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
      );
    }

    return filtered;
  }

  static async findById(id: string) {
    return db.getProductById(id);
  }

  static async create(productData: Partial<IProduct>) {
    return db.addProduct(productData);
  }

  static async findByIdAndUpdate(id: string, updates: Partial<IProduct>) {
    return db.updateProduct(id, updates);
  }

  static async findByIdAndDelete(id: string) {
    return db.deleteProduct(id);
  }

  static async countDocuments(filter: any = {}) {
    const products = await this.find(filter);
    return products.length;
  }

  // Helper method to check availability
  static isAvailable(product: IProduct): boolean {
    return product.isActive && product.stock > 0;
  }

  // Helper method to update stock
  static async updateStock(id: string, quantity: number) {
    const product = db.getProductById(id);
    if (!product) return null;
    
    const newStock = product.stock - quantity;
    if (newStock < 0) {
      throw new Error('Estoque insuficiente');
    }
    
    return db.updateProduct(id, { stock: newStock });
  }
}

export default Product;
