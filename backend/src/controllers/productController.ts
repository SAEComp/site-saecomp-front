import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import Product, { IProduct } from '../models/Product';

// Fetch all products with filters
export const getAllProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, search, page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;

    // Build filter object
    const filter: any = { isActive: true };
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (search) {
      filter.name = search as string;
    }

    // Get all products with filter
    let products = await Product.find(filter);
    const total = products.length;

    // Add isAvailable field to each product
    products = products.map((product: IProduct) => ({
      ...product,
      isAvailable: product.isActive && product.stock > 0
    }));

    // Sort
    const sortField = sortBy as string;
    const sortOrder = order === 'desc' ? -1 : 1;
    products.sort((a: any, b: any) => {
      if (a[sortField] < b[sortField]) return -sortOrder;
      if (a[sortField] > b[sortField]) return sortOrder;
      return 0;
    });

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;
    const paginatedProducts = products.slice(skip, skip + limitNum);

    res.status(200).json({
      success: true,
      data: paginatedProducts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Fetch products by category
export const getProductsByCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category } = req.params;
    
    if (!['doces', 'salgados', 'bebidas'].includes(category)) {
      res.status(400).json({
        success: false,
        error: 'Categoria inválida. Use: doces, salgados ou bebidas'
      });
      return;
    }

    let products = await Product.find({ 
      category, 
      isActive: true
    });

    // Filter products with stock > 0
    products = products.filter((product: IProduct) => product.stock > 0);

    // Add isAvailable field to each product
    products = products.map((product: IProduct) => ({
      ...product,
      isAvailable: product.isActive && product.stock > 0
    }));

    // Sort by createdAt descending
    products.sort((a: IProduct, b: IProduct) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// Fetch a single product by ID
export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);
    
    if (!product) {
      res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
      return;
    }

    // Add isAvailable field
    const productWithAvailability = {
      ...product,
      isAvailable: product.isActive && product.stock > 0
    };

    res.status(200).json({
      success: true,
      data: productWithAvailability
    });
  } catch (error) {
    next(error);
  }
};

// Create a new product
export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: errors.array()
      });
      return;
    }

    const savedProduct = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: savedProduct,
      message: 'Produto criado com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

// Update a product
export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: 'Dados inválidos',
        details: errors.array()
      });
      return;
    }

    const { id } = req.params;
    
    const updatedProduct = await Product.findByIdAndUpdate(
      id, 
      { ...req.body, updatedAt: new Date().toISOString() }
    );
    
    if (!updatedProduct) {
      res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: updatedProduct,
      message: 'Produto atualizado com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

// Delete a product (soft delete)
export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByIdAndUpdate(
      id,
      { isActive: false }
    );
    
    if (!product) {
      res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Produto removido com sucesso'
    });
  } catch (error) {
    next(error);
  }
};

// Update product stock
export const updateStock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { quantity, operation } = req.body;

    if (!quantity || !operation || !['add', 'subtract'].includes(operation)) {
      res.status(400).json({
        success: false,
        error: 'Quantidade e operação (add/subtract) são obrigatórios'
      });
      return;
    }

    const product = await Product.findById(id);
    
    if (!product) {
      res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
      return;
    }

    const newStock = operation === 'add' 
      ? product.stock + quantity 
      : product.stock - quantity;

    if (newStock < 0) {
      res.status(400).json({
        success: false,
        error: 'Estoque não pode ser negativo'
      });
      return;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, { stock: newStock });

    res.status(200).json({
      success: true,
      data: updatedProduct,
      message: 'Estoque atualizado com sucesso'
    });
  } catch (error) {
    next(error);
  }
};