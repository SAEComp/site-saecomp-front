// Este arquivo agora é apenas um wrapper para o service global
// Todas as funções foram movidas para src/services/lojinha.service.ts
// que utiliza o lojinhaProvider com suporte a refresh token automático

import lojinhaService from '../../../services/lojinha.service';

// Re-exportar todas as funções do service global
export const getProducts = lojinhaService.getProducts.bind(lojinhaService);
export const getProductById = lojinhaService.getProductById.bind(lojinhaService);
export const getProductsByCategory = lojinhaService.getProductsByCategory.bind(lojinhaService);

export const createProduct = lojinhaService.createProduct.bind(lojinhaService);
export const updateProduct = lojinhaService.updateProduct.bind(lojinhaService);
export const deleteProduct = lojinhaService.deleteProduct.bind(lojinhaService);
export const updateStock = lojinhaService.updateStock.bind(lojinhaService);

export const getCart = lojinhaService.getCart.bind(lojinhaService);
export const addToCart = lojinhaService.addToCart.bind(lojinhaService);
export const removeFromCart = lojinhaService.removeFromCart.bind(lojinhaService);
export const clearCart = lojinhaService.clearCart.bind(lojinhaService);

export const finishOrder = lojinhaService.finishOrder.bind(lojinhaService);
export const cancelPayment = lojinhaService.cancelPayment.bind(lojinhaService);
export const getPaymentStatus = lojinhaService.getPaymentStatus.bind(lojinhaService);
export const getPendingPayments = lojinhaService.getPendingPayments.bind(lojinhaService);
export const listenToPayment = lojinhaService.listenToPayment.bind(lojinhaService);

export const getOrdersHistory = lojinhaService.getOrdersHistory.bind(lojinhaService);
export const getStatistics = lojinhaService.getStatistics.bind(lojinhaService);

export const getAllPixSettings = lojinhaService.getAllPixSettings.bind(lojinhaService);
export const createPixSettings = lojinhaService.createPixSettings.bind(lojinhaService);
export const deletePixSettings = lojinhaService.deletePixSettings.bind(lojinhaService);

export const getHistory = lojinhaService.getHistory.bind(lojinhaService);
export const healthCheck = lojinhaService.healthCheck.bind(lojinhaService);

// Serviços organizados (mantidos para compatibilidade)
export const productService = {
  getAll: getProducts,
  getById: getProductById,
  getByCategory: getProductsByCategory,
  create: createProduct,
  update: updateProduct,
  delete: deleteProduct,
  updateStock: updateStock
};

export const cartService = {
  get: getCart,
  add: addToCart,
  remove: removeFromCart,
  clear: clearCart
};

export const orderService = {
  finish: finishOrder,
  getHistory: getOrdersHistory,
  getAll: getOrdersHistory,
  getByStatus: async (status: string) => {
    const allOrders = await getOrdersHistory();
    if (!allOrders.data) return allOrders;

    const filtered = allOrders.data.filter(order => order.status === status);
    return {
      ...allOrders,
      data: filtered
    };
  }
};

export const paymentService = {
  cancel: cancelPayment,
  getStatus: getPaymentStatus,
  getPending: getPendingPayments
};

export const adminService = {
  getStats: getStatistics
};

export const pixService = {
  getAll: getAllPixSettings,
  create: createPixSettings,
  delete: deletePixSettings
};

export const historyService = {
  getHistory
};

// Exportar o service completo como default
export default lojinhaService;
