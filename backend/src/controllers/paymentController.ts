import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import * as QRCode from 'qrcode';
import { IOrder } from '../models/Order';
import Order from '../models/Order';
import { ApiResponse } from '../types/api';

interface PixPaymentRequest {
  orderId: string;
  amount: number;
  customerName?: string;
}

interface PixPaymentResponse {
  qrCode: string;
  pixCode: string;
  paymentId: string;
  expiresAt: Date;
}

// Generate PIX payment QR Code
export const generatePix = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Dados inválidos',
        errors: errors.array().map(error => ({
          field: error.type === 'field' ? (error as any).path : undefined,
          message: (error as any).msg || 'Erro de validação'
        }))
      };
      return res.status(400).json(response);
    }

    const { orderId, amount } = req.body;

    // Verify order exists and is valid
    const order = await Order.findById(orderId);
    if (!order) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Pedido não encontrado'
      };
      return res.status(404).json(response);
    }

    if (order.status !== 'pending') {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Pedido não pode ser pago (status inválido)'
      };
      return res.status(400).json(response);
    }

    // Use customer data from the order
    const customerName = order.customerName;
    const customerEmail = order.customerEmail || 'cliente@saecomp.com';

    // Generate PIX code (simplified - in production, integrate with payment provider)
    const pixCode = generatePixCode({
      orderId,
      amount,
      customerName,
      customerEmail
    });

    // Generate QR Code
    const qrCodeUrl = await QRCode.toDataURL(pixCode);

    // Create payment record (simplified)
    const paymentId = `pix_${orderId}_${Date.now()}`;
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    // Update order with payment info
    await Order.findByIdAndUpdate(orderId, {
      paymentId,
      paymentStatus: 'pending'
    });

    const paymentData: PixPaymentResponse = {
      qrCode: qrCodeUrl,
      pixCode,
      paymentId,
      expiresAt
    };

    const response: ApiResponse<PixPaymentResponse> = {
      success: true,
      message: 'QR Code PIX gerado com sucesso',
      data: paymentData
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Error generating PIX QR code:', error);
    const response: ApiResponse<null> = {
      success: false,
      message: 'Erro interno do servidor'
    };
    res.status(500).json(response);
  }
};

// Confirm payment (webhook simulation)
export const confirmPayment = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Dados inválidos',
        errors: errors.array().map(error => ({
          field: error.type === 'field' ? (error as any).path : undefined,
          message: (error as any).msg || 'Erro de validação'
        }))
      };
      return res.status(400).json(response);
    }

    const { paymentId, status } = req.body;

    // Find order by payment ID
    const order = await Order.findOne({ paymentId });
    if (!order) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Pagamento não encontrado'
      };
      return res.status(404).json(response);
    }

    // Update payment status
    const updates: any = { paymentStatus: status };
    
    if (status === 'completed') {
      updates.status = 'confirmed';
      updates.confirmedAt = new Date().toISOString();
    } else if (status === 'failed') {
      updates.status = 'cancelled';
    }

    const updatedOrder = await Order.findByIdAndUpdate(order._id, updates);

    const response: ApiResponse<{ order: typeof updatedOrder }> = {
      success: true,
      message: 'Status do pagamento atualizado',
      data: { order: updatedOrder }
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Error confirming payment:', error);
    const response: ApiResponse<null> = {
      success: false,
      message: 'Erro interno do servidor'
    };
    res.status(500).json(response);
  }
};

// Get payment status
export const getPaymentStatus = async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;

    const order = await Order.findOne({ paymentId });
    if (!order) {
      const response: ApiResponse<null> = {
        success: false,
        message: 'Pagamento não encontrado'
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<{ 
      paymentStatus: string;
      orderStatus: string;
      orderId: string;
    }> = {
      success: true,
      message: 'Status do pagamento obtido com sucesso',
      data: {
        paymentStatus: order.paymentStatus,
        orderStatus: order.status,
        orderId: order._id.toString()
      }
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Error getting payment status:', error);
    const response: ApiResponse<null> = {
      success: false,
      message: 'Erro interno do servidor'
    };
    res.status(500).json(response);
  }
};

// Helper function to generate PIX code (simplified)
function generatePixCode({
  orderId,
  amount,
  customerName,
  customerEmail
}: {
  orderId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
}): string {
  // This is a simplified PIX code generation
  // In production, you should integrate with a real payment provider
  const pixData = {
    version: '01',
    initiation: '11', // Static QR Code
    merchant: {
      name: 'SAEComp Lojinha',
      city: 'Sao Paulo',
      key: process.env.PIX_KEY || 'contato@saecomp.com'
    },
    amount: amount.toFixed(2),
    additionalInfo: `Pedido: ${orderId}`,
    txid: orderId.slice(-25) // Transaction ID (max 25 chars)
  };

  // Generate a mock PIX code string
  return `00020126830014BR.GOV.BCB.PIX0136${pixData.merchant.key}520400005303986540${pixData.amount}5802BR5913${pixData.merchant.name}6009${pixData.merchant.city}62070503***6304`;
}