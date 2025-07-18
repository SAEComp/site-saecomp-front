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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/lojinha/produto/${product._id}`} className="block">
        <img 
          src={getProductImageUrl(product)} 
          alt={product.name} 
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        </div>
      </Link>
      <div className="p-4 pt-0 flex items-center justify-between">
        <p className="text-xl font-bold text-[#03B04B]">R$ {product.price.toFixed(2)}</p>
        <button 
          onClick={handleAddToCart} 
          className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
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
        <div className="px-4 pb-4">
          <p className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
            Restam apenas {product.stock} unidades
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
