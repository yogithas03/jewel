import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useState } from "react";
import Toast from "./Toast";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [toast, setToast] = useState(null);

  const wishlisted = isWishlisted(product.id);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    showToast(`${product.name} added to cart`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
    showToast(wishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Image container */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden aspect-square bg-[#0D3D38]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-[#064E3B] text-[#FCF1D0]">NEW</span>
          )}
          {discount && (
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full" style={{ backgroundColor: "#F5DF92", color: "#064E3B" }}>
              -{discount}%
            </span>
          )}
          {product.isBestSeller && (
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-white text-[#064E3B]">BESTSELLER</span>
          )}
        </div>
        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 bg-white shadow-md"
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg
            className="w-4 h-4"
            fill={wishlisted ? "#F5DF92" : "none"}
            viewBox="0 0 24 24"
            stroke={wishlisted ? "#F5DF92" : "#064E3B"}
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <span className="text-xs uppercase tracking-wider font-medium" style={{ color: "#F5DF92" }}>
            {product.metal} · {product.purity}
          </span>
          {/* Rating */}
          <div className="flex items-center gap-1 shrink-0">
            <svg className="w-3 h-3 fill-[#F5DF92]" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs text-gray-500">{product.rating}</span>
          </div>
        </div>

        <Link to={`/product/${product.id}`}>
          <h3
            className="text-sm font-semibold leading-snug mb-2 hover:text-[#F5DF92] transition-colors line-clamp-2"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#064E3B" }}
          >
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
          <span>{product.weight}g</span>
          <span>·</span>
          <span className="capitalize">{product.category}</span>
        </div>

        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base font-bold" style={{ color: "#064E3B" }}>
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xs line-through text-gray-400">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 py-2 text-xs font-semibold tracking-wider rounded-lg transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "#064E3B", color: "#FCF1D0" }}
            >
              ADD TO CART
            </button>
            <Link
              to={`/product/${product.id}`}
              className="px-3 py-2 text-xs font-semibold tracking-wider rounded-lg border transition-all duration-200 hover:bg-[#064E3B] hover:text-[#FCF1D0]"
              style={{ borderColor: "#064E3B", color: "#064E3B" }}
            >
              VIEW
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
