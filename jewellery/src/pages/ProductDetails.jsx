import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById, products } from "../data/products";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import HeartConfetti from "../components/HeartConfetti";
import ProductCard from "../components/ProductCard";
import Toast from "../components/Toast";

const TAB_CONTENT = {
  details: (p) => (
    <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
      <p><span className="font-semibold text-[#064E3B]">Metal:</span> {p.metal?.charAt(0).toUpperCase() + p.metal?.slice(1)}</p>
      <p><span className="font-semibold text-[#064E3B]">Product ID:</span> {p.productId || p.id}</p>
      <p><span className="font-semibold text-[#064E3B]">Purity:</span> {p.purity}</p>
      <p><span className="font-semibold text-[#064E3B]">Weight:</span> {p.weightLabel || `${p.weight}g`}</p>
      <p><span className="font-semibold text-[#064E3B]">Category:</span> {p.category}</p>
      {p.diamond && (
        <>
          <p><span className="font-semibold text-[#064E3B]">Diamond Carat:</span> {p.diamond.carat} ct</p>
          <p><span className="font-semibold text-[#064E3B]">Diamond Shape:</span> {p.diamond.shape}</p>
          <p><span className="font-semibold text-[#064E3B]">Clarity:</span> {p.diamond.clarity}</p>
          <p><span className="font-semibold text-[#064E3B]">Colour:</span> {p.diamond.color}</p>
        </>
      )}
      <p><span className="font-semibold text-[#064E3B]">Occasions:</span> {[...(Array.isArray(p.occasions) ? p.occasions : [p.occasions]), ...(Array.isArray(p.occasion) ? p.occasion : [p.occasion])].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join(", ")}</p>
      <p><span className="font-semibold text-[#064E3B]">For:</span> {Array.isArray(p.for) ? p.for.join(", ") : Array.isArray(p.gender) ? p.gender.join(", ") : (p.for || p.gender)}</p>
    </div>
  ),
  delivery: () => (
    <div className="space-y-3 text-sm text-gray-600">
      <p>✓ Free shipping on orders above ₹5,000</p>
      <p>✓ Standard delivery: 5–7 business days</p>
      <p>✓ Express delivery available at checkout</p>
      <p>✓ Insured packaging for all jewellery orders</p>
      <p>✓ PAN India delivery available</p>
    </div>
  ),
  returns: () => (
    <div className="space-y-3 text-sm text-gray-600">
      <p>✓ 15-day hassle-free return policy</p>
      <p>✓ Jewellery must be unworn and in original packaging</p>
      <p>✓ Exchange or full store credit issued within 3 business days</p>
      <p>✓ Custom-made pieces are non-returnable</p>
    </div>
  ),
  care: () => (
    <div className="space-y-3 text-sm text-gray-600">
      <p>✓ Store in the velvet pouch or box provided</p>
      <p>✓ Avoid contact with perfume, lotions and chemicals</p>
      <p>✓ Clean gently with a soft dry cloth</p>
      <p>✓ Bring to us for annual professional cleaning</p>
      <p>✓ Remove before swimming, bathing or exercising</p>
    </div>
  ),
};

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = getProductById(id);
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("details");
  const [toast, setToast] = useState(null);
  const [heartBurst, setHeartBurst] = useState(0);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  if (!product) {
    return (
      <div className="pt-20 lg:pt-24 min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="text-5xl mb-4">✦</div>
        <h2
          className="text-2xl font-semibold mb-3"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#064E3B" }}
        >
          Product Not Found
        </h2>
        <p className="text-gray-500 mb-8">This product may no longer be available.</p>
        <Link
          to="/jewellery"
          className="px-8 py-3 rounded-full text-sm font-semibold"
          style={{ backgroundColor: "#064E3B", color: "#FCF1D0" }}
        >
          CONTINUE SHOPPING
        </Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  // Related products
  const related = products
    .filter((p) => p.id !== product.id && (p.category?.toLowerCase() === product.category?.toLowerCase() || p.metal === product.metal))
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    showToast(`${product.name} added to cart`);
  };

  const handleWishlist = () => {
    toggleWishlist(product);
    if (!wishlisted) setHeartBurst((burst) => burst + 1);
    showToast(wishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate("/cart");
  };

  return (
    <div className="pt-20 lg:pt-24">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8">
          <Link to="/" className="hover:text-[#F5DF92]">Home</Link>
          <span>/</span>
          <Link to="/jewellery" className="hover:text-[#F5DF92]">Jewellery</Link>
          <span>/</span>
          <Link to={`/category/${product.category}`} className="hover:text-[#F5DF92] capitalize">{product.category}</Link>
          <span>/</span>
          <span className="text-gray-600">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-[#0D3D38]">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === i ? "border-[#F5DF92]" : "border-gray-200"
                    }`}
                  >
                    <img src={img} alt={`view ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs uppercase tracking-widest font-medium" style={{ color: "#F5DF92" }}>
                {product.metal} · {product.purity}
              </span>
              {product.isNew && (
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: "#064E3B", color: "#FCF1D0" }}>NEW</span>
              )}
            </div>

            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-4 leading-snug"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#064E3B" }}
            >
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4"
                    fill={i < Math.floor(product.rating) ? "#F5DF92" : "#e5e7eb"}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500">{product.rating} ({product.reviews} reviews)</span>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold" style={{ color: "#064E3B" }}>
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-base line-through text-gray-400">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-sm font-semibold text-green-600">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Meta chips */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { label: `${product.weight}g` },
                { label: product.purity },
                { label: product.metal?.charAt(0).toUpperCase() + product.metal?.slice(1) },
                product.occasion && { label: product.occasion },
              ]
                .filter(Boolean)
                .map((c) => (
                  <span
                    key={c.label}
                    className="px-3 py-1.5 text-xs rounded-full"
                    style={{ backgroundcolor: "#FCF1D0", color: "#064E3B", border: "1px solid rgba(245,223,146,0.3)" }}
                  >
                    {c.label}
                  </span>
                ))}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium" style={{ color: "#064E3B" }}>Qty:</span>
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
                  style={{ color: "#064E3B" }}
                >
                  −
                </button>
                <span className="px-4 py-2 text-sm font-semibold" style={{ color: "#064E3B" }}>{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
                  style={{ color: "#064E3B" }}
                >
                  +
                </button>
              </div>
              <span className="text-xs text-gray-400">{product.stock} available</span>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 rounded-full font-semibold text-sm tracking-wider transition-all hover:opacity-90 active:scale-95"
                style={{ backgroundColor: "#064E3B", color: "#FCF1D0" }}
              >
                ADD TO CART
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 py-4 rounded-full font-semibold text-sm tracking-wider border transition-all hover:bg-[#F5DF92] hover:border-[#F5DF92] hover:text-[#064E3B]"
                style={{ borderColor: "#F5DF92", color: "#F5DF92" }}
              >
                BUY NOW
              </button>
              <button
                onClick={handleWishlist}
                className="relative w-14 flex items-center justify-center rounded-full border transition-all hover:bg-[#0D3D38]"
                style={{ borderColor: wishlisted ? "#F5DF92" : "#e5e7eb" }}
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                aria-pressed={wishlisted}
              >
                <HeartConfetti trigger={heartBurst} />
                <svg
                  className="w-5 h-5"
                  fill={wishlisted ? "#E11D48" : "none"}
                  viewBox="0 0 24 24"
                  stroke={wishlisted ? "#E11D48" : "#064E3B"}
                  strokeWidth={1.5}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 py-5 border-t border-gray-100">
              {["BIS Hallmarked", "GIA Certified", "Free Shipping", "15-day Return"].map((b) => (
                <span key={b} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="text-green-500">✓</span> {b}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex gap-0 border-b border-gray-200 mb-8 overflow-x-auto">
            {[
              { key: "details", label: "Product Details" },
              { key: "delivery", label: "Delivery" },
              { key: "returns", label: "Returns" },
              { key: "care", label: "Jewellery Care" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-px ${
                  activeTab === tab.key
                    ? "border-[#F5DF92] text-[#064E3B]"
                    : "border-transparent text-gray-400 hover:text-[#064E3B]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="max-w-2xl">
            {TAB_CONTENT[activeTab]?.(product)}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h3
              className="text-2xl font-semibold mb-8"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#064E3B" }}
            >
              You May Also Like
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
