import { body, param } from 'express-validator';

export const generatePixValidation = [
  body('orderId')
    .notEmpty()
    .withMessage('ID do pedido é obrigatório')
    .isString()
    .withMessage('ID do pedido deve ser uma string'),
  
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Valor deve ser maior que 0')
];

export const confirmPaymentValidation = [
  body('paymentId')
    .notEmpty()
    .withMessage('ID do pagamento é obrigatório'),
  
  body('status')
    .isIn(['completed', 'failed', 'pending'])
    .withMessage('Status deve ser: completed, failed ou pending')
];

export const getPaymentStatusValidation = [
  param('paymentId')
    .notEmpty()
    .withMessage('ID do pagamento é obrigatório')
];
