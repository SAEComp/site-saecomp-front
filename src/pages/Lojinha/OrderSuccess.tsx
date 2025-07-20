import { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import festaIcon from '../../assets/lojinha-icons/perrys/festa.png';

const OrderSuccess = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Verificar se temos orderId na URL ou no state
    const hasOrderId = orderId || location.state?.orderId;
    
    if (!hasOrderId) {
      navigate('/lojinha');
    }
  }, [orderId, location.state, navigate]);

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
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Perry Festa Icon */}
          <div className="mx-auto flex items-center justify-center mb-4">
            <img 
              src={festaIcon} 
              alt="Perry Festa" 
              className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-lg"
            />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Pedido Realizado com Sucesso!
          </h1>
          
          <p className="text-gray-600 mb-4">
            Seu pedido foi processado com sucesso.
          </p>
          
          {/* Order Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
            <h3 className="font-semibold text-gray-900 mb-3">Detalhes do Pedido</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Número do Pedido:</span>
                <span className="font-medium">#{currentOrderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-yellow-600">Aguardando Confirmação</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Método de Pagamento:</span>
                <span className="font-medium">PIX</span>
              </div>
            </div>
          </div>
          
          {/* Next Steps */}
          <div className="bg-green-50 border border-green-500 rounded-lg p-4 mb-4 text-left">
            <div className="flex items-center mb-2">
              <p className="font-medium text-gray-900">Próximos Passos</p>
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              <p>• Você pode retirar seu pedido na lojinha SAEComp</p>
              <p>• Aguarde a confirmação do pagamento</p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-2">
            <button 
              onClick={handleBackToStore}
              className="w-full bg-[#03B04B] text-white py-3 px-6 rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              Fazer Novo Pedido
            </button>
            <button 
              onClick={handleGoHome}
              className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
