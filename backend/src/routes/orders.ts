import { Router } from 'express';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  getOrdersByStatus,
  cancelOrder,
  cancelOrderByTimeout
} from '../controllers/orderController';
import {
  createOrderValidation,
  updateOrderStatusValidation,
  getOrderByIdValidation,
  getOrdersValidation,
  getOrdersByStatusValidation
} from '../validators/orderValidators';
import { authenticateToken } from '../middleware/auth';
import { IProduct } from '../models/Product';

const router = Router();

// Test endpoints (must come before parameterized routes)
router.post('/test', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Test endpoint working',
      received: req.body
    });
  } catch (error) {
    console.error('Error in test endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/test-stock', async (req, res) => {
  try {
    const { Product } = await import('../models/Product');
    const products = await Product.find();
    
    res.status(200).json({
      success: true,
      message: 'Current stock levels',
      data: products.map((p: IProduct) => ({
        id: p._id,
        name: p.name,
        stock: p.stock,
        category: p.category
      }))
    });
  } catch (error) {
    console.error('Error in stock test endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/orders - Get all orders with pagination
router.get('/', getOrdersValidation, getOrders);

// GET /api/orders/status/:status - Get orders by status
router.get('/status/:status', getOrdersByStatusValidation, getOrdersByStatus);

// GET /api/orders/:id - Get order by ID
router.get('/:id', getOrderByIdValidation, getOrderById);

// POST /api/orders - Create new order with authentication middleware
router.post('/', authenticateToken, createOrder);

// PUT /api/orders/:id/status - Update order status
router.put('/:id/status', updateOrderStatusValidation, updateOrderStatus);

// PUT /api/orders/:id/cancel - Cancel order (manual)
router.put('/:id/cancel', getOrderByIdValidation, cancelOrder);

// PUT /api/orders/:id/timeout - Cancel order due to PIX timeout
router.put('/:id/timeout', getOrderByIdValidation, cancelOrderByTimeout);

export default router;