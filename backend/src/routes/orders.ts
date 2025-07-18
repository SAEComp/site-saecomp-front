import { Router } from 'express';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  getOrdersByStatus
} from '../controllers/orderController';
import {
  createOrderValidation,
  updateOrderStatusValidation,
  getOrderByIdValidation,
  getOrdersValidation,
  getOrdersByStatusValidation
} from '../validators/orderValidators';

const router = Router();

// GET /api/orders - Get all orders with pagination
router.get('/', getOrdersValidation, getOrders);

// GET /api/orders/status/:status - Get orders by status
router.get('/status/:status', getOrdersByStatusValidation, getOrdersByStatus);

// GET /api/orders/:id - Get order by ID
router.get('/:id', getOrderByIdValidation, getOrderById);

// Test endpoint for debugging
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

// POST /api/orders - Create new order (temporarily without validation)
router.post('/', createOrder);

// PUT /api/orders/:id/status - Update order status
router.put('/:id/status', updateOrderStatusValidation, updateOrderStatus);

export default router;