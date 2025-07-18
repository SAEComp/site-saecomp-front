import { Router } from 'express';
import { 
  generatePix, 
  confirmPayment, 
  getPaymentStatus 
} from '../controllers/paymentController';
import { 
  generatePixValidation, 
  confirmPaymentValidation, 
  getPaymentStatusValidation 
} from '../validators/paymentValidators';

const router = Router();

// Generate PIX QR Code
router.post('/pix/generate', generatePixValidation, generatePix);

// Confirm payment (webhook endpoint)
router.post('/confirm', confirmPaymentValidation, confirmPayment);

// Get payment status
router.get('/status/:paymentId', getPaymentStatusValidation, getPaymentStatus);

export default router;