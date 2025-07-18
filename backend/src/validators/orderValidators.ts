import { body, param, query } from 'express-validator';

export const createOrderValidation = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Items deve ser um array com pelo menos 1 item'),
  
  body('items.*.productId')
    .isString()
    .notEmpty()
    .withMessage('ID do produto deve ser uma string válida'),
  
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantidade deve ser um número inteiro maior que 0'),
  
  body('customerName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome do cliente deve ter entre 2 e 100 caracteres'),
  
  body('customerCourse')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Curso deve ter entre 2 e 100 caracteres'),
  
  body('paymentMethod')
    .optional()
    .equals('pix')
    .withMessage('Método de pagamento deve ser pix')
];

export const updateOrderStatusValidation = [
  param('id')
    .isString()
    .notEmpty()
    .withMessage('ID do pedido deve ser válido'),
  
  body('status')
    .isIn(['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'])
    .withMessage('Status deve ser válido')
];

export const getOrderByIdValidation = [
  param('id')
    .isString()
    .notEmpty()
    .withMessage('ID do pedido deve ser válido')
];

export const getOrdersValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Página deve ser um número inteiro maior que 0'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limite deve ser um número inteiro entre 1 e 100')
];

export const getOrdersByStatusValidation = [
  param('status')
    .isIn(['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'])
    .withMessage('Status deve ser válido'),
  
  ...getOrdersValidation
];
