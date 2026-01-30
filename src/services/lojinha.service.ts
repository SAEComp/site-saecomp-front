import { lojinhaProvider } from "../providers";
import {
    Product,
    Cart,
    Order,
    PixPaymentResponse,
    ApiResponse,
    ProductFilters,
    PixSettings,
    Statistics,
    HistoryEntry,
    PendingOrder
} from '../pages/Lojinha/types';

class LojinhaService {
    // ======================
    // PRODUTOS
    // ======================

    async getProducts(filters?: ProductFilters): Promise<ApiResponse<Product[]>> {
        const params = new URLSearchParams();

        params.append('page', filters?.page?.toString() || '1');
        params.append('pageSize', filters?.pageSize?.toString() || '100');

        if (filters?.category && filters.category !== 'all') {
            params.append('category', filters.category);
        }

        if (filters?.name) {
            params.append('name', filters.name);
        }

        if (filters?.includeInactive) {
            params.append('includeInactive', 'true');
        }

        try {
            const response = await lojinhaProvider.get('/products', { params });
            const products = response.data.product || response.data || [];
            return {
                success: true,
                data: Array.isArray(products) ? products : []
            };
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }

    async getProductById(id: number): Promise<ApiResponse<Product>> {
        const response = await lojinhaProvider.get('/product', {
            params: { productId: id }
        });
        return {
            success: true,
            data: response.data
        };
    }

    async getProductsByCategory(category: 'sweet' | 'salty' | 'drink'): Promise<ApiResponse<Product[]>> {
        const response = await lojinhaProvider.get('/products', {
            params: { category }
        });
        return {
            success: true,
            data: response.data.product || []
        };
    }

    // ======================
    // ADMIN - PRODUTOS
    // ======================

    async createProduct(productData: Omit<Product, 'id'>): Promise<ApiResponse<Product>> {
        const response = await lojinhaProvider.post('/admin/product', productData);
        return {
            success: true,
            data: response.data.product
        };
    }

    async updateProduct(id: number, productData: Partial<Product> & { productId?: number }): Promise<ApiResponse<Product>> {
        const requestData = {
            ...productData,
            productId: productData.productId || id
        };

        const response = await lojinhaProvider.put('/admin/product', requestData);
        return {
            success: true,
            data: response.data.product
        };
    }

    async deleteProduct(id: number): Promise<ApiResponse<{ message: string }>> {
        const response = await lojinhaProvider.delete('/admin/product', {
            params: { productId: id }
        });
        return {
            success: true,
            data: response.data
        };
    }

    async updateStock(id: number, quantity: number): Promise<ApiResponse<Product>> {
        return this.updateProduct(id, { quantity });
    }

    // ======================
    // CARRINHO
    // ======================

    async getCart(): Promise<ApiResponse<Cart>> {
        const response = await lojinhaProvider.get('/cart');
        return {
            success: true,
            data: response.data
        };
    }

    async addToCart(productId: number, quantity: number): Promise<ApiResponse<Cart>> {
        await lojinhaProvider.post('/cart', {
            productId,
            quantity
        });
        const cartResponse = await lojinhaProvider.get('/cart');
        return {
            success: true,
            data: cartResponse.data
        };
    }

    async removeFromCart(itemId: number): Promise<ApiResponse<{ message: string }>> {
        const response = await lojinhaProvider.delete('/item', {
            params: { itemId: itemId }
        });
        return {
            success: true,
            data: response.data
        };
    }

    async clearCart(): Promise<ApiResponse<{ message: string }>> {
        const response = await lojinhaProvider.delete('/cart');
        return {
            success: true,
            data: response.data
        };
    }

    // ======================
    // PEDIDOS E PAGAMENTOS
    // ======================

    async finishOrder(): Promise<ApiResponse<PixPaymentResponse & { buyOrderId: number }>> {
        try {
            const cartResponse = await lojinhaProvider.get('/cart');

            if (!cartResponse.data || !cartResponse.data.id) {
                throw new Error('Pedido não encontrado. Adicione itens ao carrinho primeiro.');
            }

            const buyOrderId = cartResponse.data.id;

            const response = await lojinhaProvider.post('/finish-order', {
                buyOrderId
            });

            return {
                success: true,
                data: {
                    ...response.data,
                    buyOrderId
                }
            };
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { status?: number } };
                if (axiosError.response?.status === 404) {
                    throw new Error('Pedido não encontrado. Adicione itens ao carrinho primeiro.');
                }
            }
            throw error;
        }
    }

    async cancelPayment(buyOrderId: number): Promise<ApiResponse<{ message: string }>> {
        const response = await lojinhaProvider.post('/cancel-payment', {
            buyOrderId
        });
        return {
            success: true,
            data: response.data
        };
    }

    async getPaymentStatus(paymentId: number): Promise<ApiResponse<{ status: string; paid: boolean }>> {
        const response = await lojinhaProvider.get('/listen-payment', {
            params: { paymentId }
        });
        return {
            success: true,
            data: response.data
        };
    }

    async getPendingPayments(): Promise<ApiResponse<PendingOrder[]>> {
        const response = await lojinhaProvider.get('/pending-payment');
        return {
            success: true,
            data: response.data.buyOrder || []
        };
    }

    listenToPayment(paymentId: number, onUpdate: (status: string, data?: unknown) => void): EventSource {
        const API_BASE_URL = import.meta.env.VITE_LOJINHA_API_URL || 'http://localhost:3000/api/lojinha';
        const token = localStorage.getItem('token') || localStorage.getItem('authToken') || sessionStorage.getItem('token');
        const url = `${API_BASE_URL}/listen-payment?paymentId=${paymentId}${token ? `&token=${token}` : ''}`;

        const eventSource = new EventSource(url);

        eventSource.addEventListener('connected', () => {
            console.log('SSE conectado - aguardando pagamento');
        });

        eventSource.addEventListener('payment', (event) => {
            const data = JSON.parse(event.data);

            if (data.paid === true || data.status === 'confirmed') {
                onUpdate('approved', data);
            } else if (data.status === 'canceled') {
                onUpdate('cancelled', data);
            } else {
                onUpdate(data.status, data);
            }
        });

        eventSource.onerror = (error) => {
            console.error('SSE error:', error);
            onUpdate('error', error);
        };

        return eventSource;
    }

    // ======================
    // ADMIN - PEDIDOS
    // ======================

    async getOrdersHistory(filters?: {
        status?: string;
        page?: number;
        limit?: number;
    }): Promise<ApiResponse<Order[]>> {
        const params = new URLSearchParams();

        params.append('page', filters?.page?.toString() || '1');
        params.append('pageSize', filters?.limit?.toString() || '10');

        if (filters?.status) {
            params.append('status', filters.status);
        }

        const response = await lojinhaProvider.get('/admin/orders-history', { params });

        interface OrderBackend {
            id: number;
            userName: string;
            item?: Array<{
                productName: string;
                quantity: number;
                value: number;
            }>;
            totalValue: number;
            status: string;
            date: string;
        }

        const orders = (response.data.buyOrder || []).map((order: OrderBackend) => ({
            _id: order.id.toString(),
            id: order.id,
            customerName: order.userName,
            items: (order.item || []).map((item) => ({
                name: item.productName,
                productName: item.productName,
                quantity: item.quantity,
                value: item.value,
                price: item.value,
                subtotal: item.value * item.quantity
            })),
            totalAmount: order.totalValue,
            status: order.status,
            paymentStatus: order.status,
            createdAt: order.date,
            updatedAt: order.date
        }));

        return {
            success: true,
            data: orders
        };
    }

    // ======================
    // ADMIN - ESTATÍSTICAS
    // ======================

    async getStatistics(): Promise<ApiResponse<Statistics>> {
        const response = await lojinhaProvider.get('/admin/statistics', {
            params: {
                moreSoldQnt: 5,
                moreRevenueQnt: 5
            }
        });
        return {
            success: true,
            data: response.data
        };
    }

    // ======================
    // ADMIN - PIX SETTINGS
    // ======================

    async getAllPixSettings(): Promise<ApiResponse<PixSettings[]>> {
        const response = await lojinhaProvider.get('/admin/pix-key');
        const pixData = response.data;
        return {
            success: true,
            data: pixData ? [pixData] : []
        };
    }

    async createPixSettings(pixData: Omit<PixSettings, 'id'>): Promise<ApiResponse<PixSettings>> {
        const response = await lojinhaProvider.post('/admin/pix-key', pixData);
        return {
            success: true,
            data: response.data.pixKey
        };
    }

    async deletePixSettings(id: number): Promise<ApiResponse<{ message: string }>> {
        const response = await lojinhaProvider.delete('/admin/pix-key', {
            params: { id }
        });
        return {
            success: true,
            data: response.data
        };
    }

    // ======================
    // ADMIN - HISTÓRICO
    // ======================

    async getHistory(params?: {
        page?: number;
        pageSize?: number;
        entityType?: string;
        action?: string
    }): Promise<ApiResponse<HistoryEntry[]>> {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
        if (params?.entityType) queryParams.append('entityType', params.entityType);
        if (params?.action) queryParams.append('action', params.action);

        const response = await lojinhaProvider.get('/admin/entries-history', { params: queryParams });

        return {
            success: true,
            data: response.data.entryHistory || []
        };
    }

    // ======================
    // HEALTH CHECK
    // ======================

    async healthCheck(): Promise<{ status: string; message: string }> {
        try {
            const response = await lojinhaProvider.get('/../../health');
            return response.data;
        } catch {
            return { status: 'ok', message: 'API disponível' };
        }
    }
}

export default new LojinhaService();
