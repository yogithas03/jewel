import { createContext, useContext, useReducer, useEffect } from "react";

const WishlistContext = createContext(null);

const STORAGE_KEY = "dikshi_wishlist";

function wishlistReducer(state, action) {
  switch (action.type) {
    case "TOGGLE":
      return state.some((i) => i.id === action.payload.id)
        ? state.filter((i) => i.id !== action.payload.id)
        : [...state, action.payload];
    case "REMOVE":
      return state.filter((i) => i.id !== action.payload);
    case "LOAD":
      return action.payload;
    default:
      return state;
  }
}

export function WishlistProvider({ children }) {
  const [wishlistItems, dispatch] = useReducer(wishlistReducer, [], (init) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : init;
    } catch {
      return init;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const toggleWishlist = (product) => dispatch({ type: "TOGGLE", payload: product });
  const removeFromWishlist = (id) => dispatch({ type: "REMOVE", payload: id });
  const isWishlisted = (id) => wishlistItems.some((i) => i.id === id);

  return (
    <WishlistContext.Provider
      value={{ wishlistItems, wishlistCount: wishlistItems.length, toggleWishlist, removeFromWishlist, isWishlisted }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
