/**
 * Utility functions for handling image URLs and other assets
 */

const API_BASE_URL = import.meta.env.VITE_LOJINHA_API_URL || 'http://localhost:3000/api/lojinha';
const BACKEND_BASE_URL = API_BASE_URL.replace('/api/lojinha', '');

/**
 * Converts a relative image URL to a complete URL pointing to the backend
 * @param imageUrl - Relative image URL from the API (e.g., "/images/coca.png")
 * @returns Complete URL to the backend image server
 */
export const getImageUrl = (imageUrl: string): string => {
  if (!imageUrl) {
    return `https://via.placeholder.com/400x300/e0e0e0/666666?text=Sem+Imagem`;
  }
  
  // If already a complete URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Convert relative URL to complete backend URL
  return `${BACKEND_BASE_URL}${imageUrl}`;
};

/**
 * Fallback image URL for when product images fail to load
 */
export const FALLBACK_IMAGE = `https://via.placeholder.com/400x300/cccccc/666666?text=Erro+ao+Carregar`;

/**
 * Get product image with fallback
 * @param product - Product object with imgUrl (backend field name)
 * @returns Image URL with fallback handling
 */
export const getProductImageUrl = (product: { imgUrl?: string; name?: string }): string => {
  if (!product.imgUrl) {
    return `https://via.placeholder.com/400x300/e0e0e0/666666?text=${encodeURIComponent(product.name || 'Produto')}`;
  }
  return getImageUrl(product.imgUrl);
};
