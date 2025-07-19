import { Link } from 'react-router';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';
import { getProductImageUrl, FALLBACK_IMAGE } from '../utils/imageUtils';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(product);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-fit">
      <Link to={`/lojinha/produto/${product._id}`} className="block">
        <div className="aspect-[4/3] sm:aspect-square bg-gray-50 p-2 sm:p-3 flex items-center justify-center overflow-hidden">
          <img 
            src={getProductImageUrl(product)} 
            alt={product.name} 
            className="w-full h-full object-cover sm:object-contain rounded-lg"
            onError={(e) => {
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
          />
        </div>
        <div className="p-2 sm:p-3">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
          <p className="text-gray-600 text-xs mb-1 sm:mb-2 line-clamp-2 hidden sm:block">{product.description}</p>
        </div>
      </Link>
      <div className="p-2 sm:p-3 pt-0 flex items-center justify-between">
        <p className="text-base sm:text-lg font-bold text-[#03B04B]">R$ {product.price.toFixed(2)}</p>
        <button 
          onClick={handleAddToCart} 
          className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 hidden sm:block ${
            !product.isAvailable || product.stock === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#03B04B] text-white hover:bg-green-600'
          }`}
          disabled={!product.isAvailable || product.stock === 0}
        >
          {product.stock === 0 ? 'Esgotado' : 'Adicionar'}
        </button>
      </div>
      {product.stock < 5 && product.stock > 0 && (
        <div className="px-2 sm:px-3 pb-2 sm:pb-3">
          <p className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
            Restam apenas {product.stock} unidades
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
