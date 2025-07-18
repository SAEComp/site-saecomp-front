import { Router } from 'express';
import { 
  getAllProducts, 
  getProductById, 
  getProductsByCategory,
  createProduct, 
  updateProduct, 
  deleteProduct,
  updateStock 
} from '../controllers/productController';
import {
  validateCreateProduct,
  validateUpdateProduct,
  validateProductId,
  validateProductQuery,
  validateUpdateStock
} from '../validators/productValidators';

const router = Router();

// Route to get all products with filters and pagination
router.get('/', validateProductQuery, getAllProducts);

// Route to get products by category
router.get('/category/:category', getProductsByCategory);

// Route to get a product by ID
router.get('/:id', validateProductId, getProductById);

// Route to create a new product
router.post('/', validateCreateProduct, createProduct);

// Route to update a product by ID
router.put('/:id', validateUpdateProduct, updateProduct);

// Route to update product stock
router.patch('/:id/stock', validateUpdateStock, updateStock);

// Route to delete a product by ID (soft delete)
router.delete('/:id', validateProductId, deleteProduct);

export default router;