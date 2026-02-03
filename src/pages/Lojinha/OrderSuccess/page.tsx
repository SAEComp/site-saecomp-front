import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import { getPendingPayments } from '../services/api';
import { GenericButton } from '../componentes';
import { SuccessIcon, OrderDetails, NextSteps } from './components';

const OrderSuccess = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [earnedPoints, setEarnedPoints] = useState<number | undefined>(undefined);

  useEffect(() => {
    // Verificar se temos orderId na URL ou no state
    const hasOrderId = orderId || location.state?.orderId;

    if (!hasOrderId) {
      navigate('/lojinha');
      return;
    }

    // Se os pontos foram passados pelo state, usar eles
    if (location.state?.earnedPoints !== undefined) {
      setEarnedPoints(location.state.earnedPoints);
    } else {
      // Buscar informações do pedido para calcular pontos
      fetchOrderPoints(hasOrderId);
    }
  }, [orderId, location.state, navigate]);

  const fetchOrderPoints = async (orderIdParam: string) => {
    try {
      // Usar o service ao invés de chamada direta
      const response = await getPendingPayments();

      if (response.success && response.data) {
        // Buscar o pedido específico
        const order = response.data.find((o: any) => String(o.id) === String(orderIdParam));

        if (order?.totalValue) {
          // Calcular pontos: R$ 1,00 = 100 pontos
          const points = Math.floor(order.totalValue * 100);
          setEarnedPoints(points);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar informações do pedido:', error);
      // Não mostrar erro, apenas não mostrar pontos
    }
  };

  const handleBackToStore = () => {
    navigate('/lojinha');
  };

  const handleGoHome = () => {
    navigate('/lojinha');
  };

  // Verificar se temos orderId na URL ou no state
  const currentOrderId = orderId || location.state?.orderId;

  if (!currentOrderId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center -mt-20">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <SuccessIcon />

          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Pedido Realizado com Sucesso!
          </h1>

          <p className="text-gray-600 mb-4">
            Seu pedido foi processado com sucesso.
          </p>

          <OrderDetails orderId={currentOrderId} earnedPoints={earnedPoints} />
          <NextSteps />
          <div className="space-y-2">
            <GenericButton
              onClick={handleBackToStore}
              variant="primary"
              fullWidth
            >
              Fazer Novo Pedido
            </GenericButton>
            <GenericButton
              onClick={handleGoHome}
              variant="secondary"
              fullWidth
            >
              Voltar ao Início
            </GenericButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
