/**
 * Utility functions for handling image URLs and other assets
 */

const API_BASE_URL = import.meta.env.VITE_LOJINHA_API_URL || 'http://localhost:5001/api';
const BACKEND_BASE_URL = API_BASE_URL.replace('/api', '');

/**
 * Converts a relative image URL to a complete URL pointing to the backend
 * @param imageUrl - Relative image URL from the API (e.g., "/images/coca.png")
 * @returns Complete URL to the backend image server
 */
export const getImageUrl = (imageUrl: string): string => {
  if (!imageUrl) {
    return '/placeholder-product.svg';
  }
  
  // If already a complete URL, return as is
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // Convert relative URL to complete backend URL
  return `${BACKEND_BASE_URL}${imageUrl}`;
};

/**
 * Fallback image URL for when product images fail to load
 */
export const FALLBACK_IMAGE = '/placeholder-product.svg';

/**
 * Get product image with fallback
 * @param product - Product object with imageUrl
 * @returns Image URL with fallback handling
 */
export const getProductImageUrl = (product: { imageUrl?: string }): string => {
  return getImageUrl(product.imageUrl || '');
};
