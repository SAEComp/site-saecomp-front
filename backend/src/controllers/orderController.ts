import { Request, Response } from 'express';
import { Order, IOrder } from '../models/Order';
import { Product, IProduct } from '../models/Product';
import { validationResult } from 'express-validator';

// Get all orders with pagination
export const getOrders = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    let orders = await Order.find();
    
    // Sort by createdAt descending
    orders.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Apply pagination
    const paginatedOrders = orders.slice(skip, skip + limit);
    const total = orders.length;

    res.json({
      success: true,
      data: paginatedOrders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar pedidos'
    });
  }
};

// Get order by ID
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar pedido'
    });
  }
};

// Create new order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
      return;
    }

    const { items, notes, customerName: requestCustomerName } = req.body;

    // Get customer name from request body first, then from authenticated user, or set as anonymous
    const customerName = requestCustomerName || (req as any).user?.name || 'Cliente Anônimo';
    
    // Debug log
    console.log('Creating order with customer info:', {
      hasUser: !!(req as any).user,
      userName: (req as any).user?.name,
      userEmail: (req as any).user?.email,
      requestCustomerName: requestCustomerName,
      finalCustomerName: customerName
    });

    // Validate items and check stock (with double-check to prevent race conditions)
    const products = await Product.find();
    const validatedItems = [];
    let totalAmount = 0;

    // First pass: validate all items and check stock
    for (const item of items) {
      const product = products.find((p: IProduct) => p._id === item.productId);
      
      if (!product) {
        res.status(404).json({
          success: false,
          message: `Produto não encontrado: ${item.productId}`
        });
        return;
      }

      // Re-check current stock to prevent race conditions
      const currentProduct = await Product.findById(item.productId);
      if (!currentProduct || currentProduct.stock < item.quantity) {
        res.status(400).json({
          success: false,
          message: `Estoque insuficiente para ${product.name}. Disponível: ${currentProduct?.stock || 0}`
        });
        return;
      }

      const subtotal = product.price * item.quantity;
      validatedItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        subtotal
      });
      totalAmount += subtotal;
    }

    // Create order
    const orderData = {
      customerName,
      items: validatedItems,
      totalAmount,
      status: 'pendente' as const,
      paymentStatus: 'pendente' as const,
      notes
    };

    const order = await Order.create(orderData);

    // Update product stock (reserve inventory immediately when order is created)
    try {
      console.log('Reserving stock for order:', order._id);
      for (const item of validatedItems) {
        console.log(`Reserving ${item.quantity} units of ${item.name} (ID: ${item.productId})`);
        await Product.updateStock(item.productId, item.quantity);
      }
      console.log('✅ Stock reserved successfully for order:', order._id);
    } catch (stockError) {
      // If stock update fails, we need to delete the created order
      console.error('❌ Error updating stock after order creation:', stockError);
      await Order.findByIdAndDelete(order._id);
      res.status(400).json({
        success: false,
        message: 'Erro ao reservar estoque. Pedido cancelado.'
      });
      return;
    }

    res.status(201).json({
      success: true,
      data: order,
      message: 'Pedido criado com sucesso'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar pedido'
    });
  }
};

// Update order status with stock management
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pendente', 'concluído', 'cancelado'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status inválido'
      });
    }

    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    const oldStatus = order.status;
    const newStatus = status;

    console.log(`🔄 Updating order ${id} status: ${oldStatus} → ${newStatus}`);

    // Handle stock changes based on status transitions
    await handleStatusTransition(order, oldStatus, newStatus);

    // Update order status
    const updatedOrder = await Order.findByIdAndUpdate(id, { 
      status: newStatus,
      updatedAt: new Date().toISOString()
    });

    console.log(`✅ Order ${id} status updated successfully`);

    res.json({
      success: true,
      data: updatedOrder,
      message: 'Status do pedido atualizado'
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar status do pedido'
    });
  }
};

// Handle stock changes based on status transitions
async function handleStatusTransition(order: any, oldStatus: string, newStatus: string) {
  // Status transition matrix:
  // pendente → concluído: No stock change (already reserved)
  // pendente → cancelado: Restore stock (cancel reservation)
  // concluído → cancelado: Restore stock (return items)
  // cancelado → pendente: Reserve stock (re-reserve)
  // cancelado → concluído: Reserve stock (re-reserve)
  // concluído → pendente: No change (keep reservation)

  if (oldStatus === newStatus) {
    return; // No change needed
  }

  console.log(`📦 Processing stock changes for status transition: ${oldStatus} → ${newStatus}`);

  try {
    if (oldStatus === 'pendente' && newStatus === 'cancelado') {
      // Cancel pending order - restore stock
      console.log('📤 Restoring stock (pending → cancelled)');
      for (const item of order.items) {
        await Product.restoreStock(item.productId, item.quantity);
        console.log(`✅ Restored ${item.quantity} units of ${item.name}`);
      }
    } 
    else if (oldStatus === 'concluído' && newStatus === 'cancelado') {
      // Cancel completed order - restore stock
      console.log('📤 Restoring stock (completed → cancelled)');
      for (const item of order.items) {
        await Product.restoreStock(item.productId, item.quantity);
        console.log(`✅ Restored ${item.quantity} units of ${item.name}`);
      }
    }
    else if (oldStatus === 'cancelado' && (newStatus === 'pendente' || newStatus === 'concluído')) {
      // Reactivate cancelled order - reserve stock
      console.log('📥 Reserving stock (cancelled → active)');
      for (const item of order.items) {
        await Product.updateStock(item.productId, item.quantity);
        console.log(`✅ Reserved ${item.quantity} units of ${item.name}`);
      }
    }
    // pendente → concluído and concluído → pendente don't require stock changes
    // since stock is already properly reserved/managed

    console.log('✅ Stock transition completed successfully');
  } catch (stockError: any) {
    console.error('❌ Error in stock transition:', stockError);
    throw new Error(`Erro ao gerenciar estoque: ${stockError.message || 'Erro desconhecido'}`);
  }
}

// Cancel order (restores stock automatically)
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    if (order.status === 'concluído') {
      return res.status(400).json({
        success: false,
        message: 'Não é possível cancelar um pedido já concluído'
      });
    }

    // Only restore stock if order was pending (hadn't been completed)
    if (order.status === 'pendente') {
      console.log('Restoring stock for cancelled order:', id);
      // Restore product stock
      for (const item of order.items) {
        try {
          console.log(`Restoring ${item.quantity} units of ${item.name} (ID: ${item.productId})`);
          await Product.restoreStock(item.productId, item.quantity);
        } catch (restoreError) {
          console.error(`Failed to restore stock for product ${item.productId}:`, restoreError);
          // Continue with other items even if one fails
        }
      }
      console.log('✅ Stock restored successfully for order:', id);
    }

    // Update order status
    await Order.findByIdAndUpdate(id, { 
      status: 'cancelado',
      paymentStatus: 'cancelado'
    });

    res.json({
      success: true,
      message: 'Pedido cancelado com sucesso'
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao cancelar pedido'
    });
  }
};

// Get orders by status
export const getOrdersByStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.params;
    
    let orders = await Order.find({ status });
    
    // Sort by createdAt descending
    orders.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching orders by status:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar pedidos por status'
    });
  }
};

// Cancel order by timeout (specifically for PIX payment expiration)
export const cancelOrderByTimeout = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }

    // Only cancel if order is still pending
    if (order.status !== 'pendente') {
      return res.status(400).json({
        success: false,
        message: 'Pedido não pode ser cancelado (status inválido)'
      });
    }

    // Restore product stock
    console.log('Restoring stock due to PIX timeout for order:', id);
    for (const item of order.items) {
      try {
        console.log(`Restoring ${item.quantity} units of ${item.name} (ID: ${item.productId})`);
        await Product.restoreStock(item.productId, item.quantity);
      } catch (restoreError) {
        console.error(`Failed to restore stock for product ${item.productId}:`, restoreError);
        // Continue with other items even if one fails
      }
    }
    console.log('✅ Stock restored successfully due to timeout for order:', id);

    // Update order status to cancelled due to timeout
    await Order.findByIdAndUpdate(id, { 
      status: 'cancelado',
      paymentStatus: 'cancelado',
      notes: (order.notes || '') + ' [Cancelado por timeout do PIX]'
    });

    res.json({
      success: true,
      message: 'Pedido cancelado por timeout - estoque restaurado'
    });
  } catch (error) {
    console.error('Error cancelling order by timeout:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao cancelar pedido por timeout'
    });
  }
};
