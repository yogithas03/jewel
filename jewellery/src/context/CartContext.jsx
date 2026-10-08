import { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "dikshi_cart";

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
    case "INCREASE_QTY":
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    case "DECREASE_QTY":
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload
            ? { ...i, quantity: Math.max(1, i.quantity - 1) }
            : i
        ),
      };
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "LOAD":
      return { ...state, items: action.payload };
    default:
      return state;
  }
}

const initialState = { items: [] };

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState, (init) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { items: JSON.parse(stored) } : init;
    } catch {
      return init;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (product) => dispatch({ type: "ADD_ITEM", payload: product });
  const removeFromCart = (id) => dispatch({ type: "REMOVE_ITEM", payload: id });
  const increaseQty = (id) => dispatch({ type: "INCREASE_QTY", payload: id });
  const decreaseQty = (id) => dispatch({ type: "DECREASE_QTY", payload: id });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const cartCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const cartSubtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems: state.items,
        cartCount,
        cartSubtotal,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
