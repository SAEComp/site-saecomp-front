import React, { useState } from 'react';
import { orderService, paymentService } from '../services/api';

const CheckoutDebugger: React.FC = () => {
    const [result, setResult] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const testOrder = async () => {
        setLoading(true);
        setResult('');
        
        try {
            console.log('🔄 Testing order creation...');
            
            const orderData = {
                customerName: 'Test User',
                customerCourse: 'Test Course',
                items: [
                    {
                        productId: '1', // Coca-Cola
                        quantity: 1,
                        price: 4.50
                    }
                ],
                paymentMethod: 'pix' as const,
                totalAmount: 4.50
            };

            console.log('📦 Order data:', orderData);
            const orderResponse = await orderService.create(orderData);
            console.log('✅ Order response:', orderResponse);
            
            if (orderResponse.data?._id) {
                const orderId = orderResponse.data._id;
                console.log('💳 Testing PIX generation for order:', orderId);
                
                const pixResponse = await paymentService.generatePix({
                    orderId,
                    amount: 4.50,
                    customerName: 'Test User'
                });
                console.log('✅ PIX response:', pixResponse);
                
                setResult('✅ Success: Order and PIX created successfully');
            } else {
                setResult('❌ Error: No order ID returned');
            }
        } catch (error: any) {
            console.error('❌ Error:', error);
            setResult(`❌ Error: ${error.message || JSON.stringify(error)}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed top-4 right-4 bg-white border-2 border-gray-300 rounded-lg p-4 shadow-lg z-50 max-w-sm">
            <h3 className="font-bold mb-2">Checkout Debugger</h3>
            <button 
                onClick={testOrder} 
                disabled={loading}
                className="bg-[#03B04B] text-white px-3 py-1 rounded mb-2 disabled:opacity-50"
            >
                {loading ? 'Testing...' : 'Test Order & PIX'}
            </button>
            {result && (
                <div className="text-xs bg-gray-100 p-2 rounded">
                    {result}
                </div>
            )}
        </div>
    );
};

export default CheckoutDebugger;
