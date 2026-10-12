import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import Toast from "../components/Toast";

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast({ msg });
    setTimeout(() => setToast(null), 2500);
  };

  const handleMoveToCart = (item) => {
    addToCart(item);
    removeFromWishlist(item.id);
    showToast(`${item.name} moved to cart`);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="pt-20 lg:pt-24 min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-6" style={{ color: "#E11D48" }}>♡</div>
        <h2
          className="text-2xl sm:text-3xl font-semibold mb-3"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#064E3B" }}
        >
          Your Wishlist is Empty
        </h2>
        <p className="text-gray-500 mb-8 max-w-sm">
          Save the pieces you love and come back to them anytime.
        </p>
        <Link
          to="/jewellery"
          className="px-8 py-4 rounded-full font-semibold text-sm tracking-wider transition-all hover:opacity-90"
          style={{ backgroundColor: "#064E3B", color: "#FCF1D0" }}
        >
          EXPLORE JEWELLERY
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20 lg:pt-24">
      {toast && <Toast message={toast.msg} onClose={() => setToast(null)} />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <h1
          className="text-2xl sm:text-3xl font-semibold mb-2"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#064E3B" }}
        >
          My Wishlist
        </h1>
        <p className="text-sm text-gray-500 mb-8">{wishlistItems.length} saved item{wishlistItems.length > 1 ? "s" : ""}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all group"
            >
              <Link to={`/product/${item.id}`} className="block relative overflow-hidden aspect-square bg-[#0D3D38]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button
                  onClick={(e) => { e.preventDefault(); removeFromWishlist(item.id); showToast("Removed from wishlist"); }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-all"
                  aria-label="Remove from wishlist"
                >
                  <svg className="w-4 h-4 fill-[#E11D48]" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </Link>

              <div className="p-4">
                <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "#F5DF92" }}>
                  {item.metal} · {item.purity}
                </p>
                <Link to={`/product/${item.id}`}>
                  <h3
                    className="text-sm font-semibold leading-snug mb-3 hover:text-[#F5DF92] transition-colors"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#064E3B" }}
                  >
                    {item.name}
                  </h3>
                </Link>
                <p className="font-bold mb-3" style={{ color: "#064E3B" }}>
                  ₹{item.price.toLocaleString()}
                </p>
                <button
                  onClick={() => handleMoveToCart(item)}
                  className="w-full py-2.5 rounded-lg text-xs font-semibold tracking-wider transition-all hover:opacity-90"
                  style={{ backgroundColor: "#064E3B", color: "#FCF1D0" }}
                >
                  MOVE TO CART
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
