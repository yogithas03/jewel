import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const MAKING_CHARGE_PERCENT = 12;
const GST_PERCENT = 3;

export default function Cart() {
  const { cartItems, cartSubtotal, increaseQty, decreaseQty, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const makingCharges = Math.round(cartSubtotal * MAKING_CHARGE_PERCENT / 100);
  const gst = Math.round((cartSubtotal + makingCharges) * GST_PERCENT / 100);
  const total = cartSubtotal + makingCharges + gst;

  if (cartItems.length === 0) {
    return (
      <div className="pt-20 lg:pt-24 min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-6" style={{ color: "#F5DF92" }}>🛍</div>
        <h2
          className="text-2xl sm:text-3xl font-semibold mb-3"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#064E3B" }}
        >
          Your Cart is Empty
        </h2>
        <p className="text-gray-500 mb-8 max-w-sm">
          You haven't added any jewellery yet. Start exploring our collections.
        </p>
        <Link
          to="/jewellery"
          className="px-8 py-4 rounded-full font-semibold text-sm tracking-wider transition-all hover:opacity-90"
          style={{ backgroundColor: "#064E3B", color: "#FCF1D0" }}
        >
          SHOP NOW
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20 lg:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1
            className="text-2xl sm:text-3xl font-semibold"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#064E3B" }}
          >
            Shopping Cart
          </h1>
          <button
            onClick={clearCart}
            className="text-sm text-gray-400 hover:text-red-500 transition-colors"
          >
            Clear cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm"
              >
                <Link to={`/product/${item.id}`} className="shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl bg-[#0D3D38]"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "#F5DF92" }}>
                        {item.metal} · {item.purity}
                      </p>
                      <Link to={`/product/${item.id}`}>
                        <h3
                          className="text-sm sm:text-base font-semibold leading-snug hover:text-[#F5DF92] transition-colors"
                          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#064E3B" }}
                        >
                          {item.name}
                        </h3>
                      </Link>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-300 hover:text-red-400 transition-colors shrink-0 text-xl leading-none"
                      aria-label="Remove"
                    >
                      ×
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Qty */}
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => decreaseQty(item.id)}
                        className="px-3 py-1.5 text-sm hover:bg-gray-50 transition-colors"
                        style={{ color: "#064E3B" }}
                      >
                        −
                      </button>
                      <span className="px-4 py-1.5 text-sm font-semibold" style={{ color: "#064E3B" }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => increaseQty(item.id)}
                        className="px-3 py-1.5 text-sm hover:bg-gray-50 transition-colors"
                        style={{ color: "#064E3B" }}
                      >
                        +
                      </button>
                    </div>
                    {/* Price */}
                    <div className="text-right">
                      <p className="font-bold" style={{ color: "#064E3B" }}>
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-gray-400">₹{item.price.toLocaleString()} each</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-28">
              <h3
                className="text-lg font-semibold mb-6"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#064E3B" }}
              >
                Order Summary
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal ({cartItems.length} item{cartItems.length > 1 ? "s" : ""})</span>
                  <span>₹{cartSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Making Charges ({MAKING_CHARGE_PERCENT}%)</span>
                  <span>₹{makingCharges.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>GST ({GST_PERCENT}%)</span>
                  <span>₹{gst.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">
                    {cartSubtotal >= 5000 ? "FREE" : "₹150"}
                  </span>
                </div>

                <div
                  className="flex justify-between font-bold text-base pt-4 border-t"
                  style={{ color: "#064E3B", borderColor: "rgba(245,223,146,0.3)" }}
                >
                  <span>Total</span>
                  <span>₹{(total + (cartSubtotal >= 5000 ? 0 : 150)).toLocaleString()}</span>
                </div>
              </div>

              {cartSubtotal < 5000 && (
                <div
                  className="mt-4 p-3 rounded-lg text-xs"
                  style={{ backgroundcolor: "#FCF1D0", color: "#064E3B" }}
                >
                  Add ₹{(5000 - cartSubtotal).toLocaleString()} more for FREE shipping!
                </div>
              )}

              <button
                className="w-full mt-6 py-4 rounded-full font-semibold text-sm tracking-wider transition-all hover:opacity-90 active:scale-95"
                style={{ backgroundColor: "#064E3B", color: "#FCF1D0" }}
                onClick={() => navigate("/checkout")}
              >
                PROCEED TO CHECKOUT
              </button>

              <Link
                to="/jewellery"
                className="block text-center mt-4 text-sm underline"
                style={{ color: "#F5DF92" }}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
