import { createContext, useContext, useReducer, ReactNode, useEffect, useState } from 'react';
import { Cart, CartItem, Product } from '../types';
import { cartService } from '../services/api';

interface CartState {
  items: CartItem[];
  totalValue: number;
  isOpen: boolean;
  isLoading: boolean;
}

type CartAction =
  | { type: 'SET_CART'; payload: Cart }
  | { type: 'SET_ITEMS'; payload: CartItem[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'CLEAR_CART' };

const initialState: CartState = {
  items: [],
  totalValue: 0,
  isOpen: false,
  isLoading: false,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items,
        totalValue: action.payload.totalValue,
      };
    
    case 'SET_ITEMS':
      return {
        ...state,
        items: action.payload,
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    
    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    
    case 'OPEN_CART':
      return {
        ...state,
        isOpen: true,
      };
    
    case 'CLOSE_CART':
      return {
        ...state,
        isOpen: false,
      };
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalValue: 0,
      };
    
    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addItem: (product: Product) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  syncCart: () => Promise<void>;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Sincronizar carrinho com o servidor na inicialização
  const syncCart = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await cartService.get();
      if (response.success && response.data) {
        dispatch({ type: 'SET_CART', payload: response.data });
      }
    } catch (error) {
      console.error('Erro ao sincronizar carrinho:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  useEffect(() => {
    if (!hasInitialized) {
      syncCart();
      setHasInitialized(true);
    }
  }, [hasInitialized]);

  // Adicionar item ao carrinho (servidor)
  const addItem = async (product: Product) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await cartService.add(product.id, 1);
      if (response.success && response.data) {
        dispatch({ type: 'SET_CART', payload: response.data });
      }
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Remover item do carrinho (servidor)
  const removeItem = async (itemId: number) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await cartService.remove(itemId);
      await syncCart(); // Atualizar carrinho após remover
    } catch (error) {
      console.error('Erro ao remover item:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Limpar carrinho (servidor)
  const clearCart = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await cartService.clear();
      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const toggleCart = () => dispatch({ type: 'TOGGLE_CART' });
  const openCart = () => dispatch({ type: 'OPEN_CART' });
  const closeCart = () => dispatch({ type: 'CLOSE_CART' });

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return state.totalValue;
  };

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    clearCart,
    syncCart,
    toggleCart,
    openCart,
    closeCart,
    getTotalItems,
    getTotalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
