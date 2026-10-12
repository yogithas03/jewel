import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

export default function OrderConfirmation() {
  const location = useLocation();
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check location state
    if (location.state?.order) {
      setOrder(location.state.order);
      setLoading(false);
      return;
    }

    // 2. Check localStorage last order
    const saved = localStorage.getItem("dikshi_last_order");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!orderId || parsed.orderId === orderId) {
          setOrder(parsed);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }

    // 3. Try fetching from backend if orderId is provided in URL
    if (orderId) {
      fetch(`/api/orders/${orderId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.order) {
            setOrder(data.order);
          }
        })
        .catch((err) => console.error("Error fetching order:", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [location.state, orderId]);

  if (loading) {
    return (
      <div className="pt-24 lg:pt-32 min-h-screen flex flex-col items-center justify-center text-center px-4" style={{ backgroundColor: "#FAF8F5" }}>
        <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-[#064E3B] animate-spin mb-4" />
        <p className="text-sm font-semibold text-gray-700">Retrieving your order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-24 lg:pt-32 min-h-screen flex flex-col items-center justify-center text-center px-4" style={{ backgroundColor: "#FAF8F5" }}>
        <p className="text-5xl mb-4" style={{ color: "#D79B01" }}>✦</p>
        <h1 className="text-2xl sm:text-3xl font-semibold mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#064E3B" }}>
          No Order Found
        </h1>
        <p className="text-sm text-gray-500 mb-6 max-w-sm">
          We could not locate this order. It may have expired from your current session or already been fulfilled.
        </p>
        <Link
          to="/"
          className="px-8 py-3.5 rounded-full text-xs font-bold tracking-wider transition-all hover:opacity-90"
          style={{ backgroundColor: "#064E3B", color: "#FCF1D0" }}
        >
          BACK TO HOMEPAGE
        </Link>
      </div>
    );
  }

  const { customer, delivery, payment, items, pricing } = order;

  return (
    <div className="pt-20 lg:pt-24 min-h-screen pb-16" style={{ backgroundColor: "#FAF8F5" }}>
      {/* Top Breadcrumb */}
      <div className="border-b border-gray-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <nav className="flex items-center gap-2 text-xs text-gray-500">
            <Link to="/" className="hover:text-[#064E3B] transition-colors">Home</Link>
            <span>/</span>
            <span className="font-semibold" style={{ color: "#064E3B" }}>Order Confirmation</span>
          </nav>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span>🖨️</span> Print Invoice
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-16">
        {/* Celebration Banner */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-10 shadow-sm text-center mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#064E3B] via-[#D79B01] to-[#064E3B]" />

          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto flex items-center justify-center text-3xl sm:text-4xl shadow-inner mb-5" style={{ backgroundColor: "#064E3B", color: "#FCF1D0" }}>
            ✓
          </div>

          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#D79B01]">DIKSHI JEWELLERY</span>
            <span className="text-[#D79B01]">✦</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {order.status || "Order Confirmed"}
            </span>
          </div>

          <h1
            className="text-2xl sm:text-4xl font-semibold mb-3 leading-snug"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#064E3B" }}
          >
            Thank You, {customer?.fullName}!
          </h1>

          <p className="text-sm text-gray-600 max-w-lg mx-auto mb-6">
            Your jewellery order has been placed securely. We have sent your order confirmation and invoice to <strong className="text-gray-900">{customer?.email}</strong>.
          </p>

          <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6 p-4 rounded-2xl bg-[#FAF8F5] border border-gray-200 text-xs">
            <div>
              <span className="text-gray-400 block uppercase tracking-wider text-[10px]">Order Number</span>
              <span className="font-bold text-gray-900 text-sm tracking-wide">{order.orderId}</span>
            </div>
            <div className="h-6 w-px bg-gray-200 hidden sm:block" />
            <div>
              <span className="text-gray-400 block uppercase tracking-wider text-[10px]">Estimated Delivery</span>
              <span className="font-bold text-emerald-800 text-sm">{delivery?.estimatedDelivery}</span>
            </div>
            <div className="h-6 w-px bg-gray-200 hidden sm:block" />
            <div>
              <span className="text-gray-400 block uppercase tracking-wider text-[10px]">Amount Paid</span>
              <span className="font-bold text-gray-900 text-sm">₹{pricing?.finalTotal?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Shipping Details */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <span className="text-base">📍</span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#064E3B]">
                Shipping Address
              </h3>
            </div>
            <div className="text-xs text-gray-600 space-y-1.5 leading-relaxed">
              <p className="text-sm font-bold text-gray-900">{customer?.fullName}</p>
              <p>{delivery?.houseNo}, {delivery?.street}</p>
              {delivery?.landmark && <p>Landmark: {delivery?.landmark}</p>}
              <p>{delivery?.city}, {delivery?.state} – <span className="font-semibold text-gray-900">{delivery?.pincode}</span></p>
              <p>Country: {delivery?.country || "India"}</p>
              <p className="pt-2 text-gray-500">Phone: <span className="font-medium text-gray-800">+91 {customer?.phone}</span></p>
            </div>
          </div>

          {/* Payment & Delivery Method */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <span className="text-base">💳</span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#064E3B]">
                Payment & Shipping
              </h3>
            </div>
            <div className="text-xs text-gray-600 space-y-2 leading-relaxed">
              <div>
                <span className="text-gray-400 block text-[11px]">Payment Mode:</span>
                <span className="font-semibold text-gray-900">{payment?.methodLabel}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">Transaction Reference:</span>
                <span className="font-mono text-gray-800">{payment?.transactionId}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">Courier Partner:</span>
                <span className="font-semibold text-gray-900">
                  {delivery?.method === "express" ? "Dedicated Express Air Courier (High Security)" : "Sequel Logistics / BlueDart Insured Ground"}
                </span>
              </div>
              <div className="pt-2">
                <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  🛡️ 100% Insured Transit Guarantee
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Itemized Order Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-7 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <h3
              className="text-base font-semibold"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#064E3B" }}
            >
              Order Items ({items?.length || 0})
            </h3>
            <span className="text-xs text-gray-400">BIS Hallmarked ✦ Certified Quality</span>
          </div>

          <div className="divide-y divide-gray-100">
            {items?.map((item) => (
              <div key={item.id} className="py-4 flex gap-4 items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#0D3D38] shrink-0 border border-gray-100">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 leading-snug">{item.name}</h4>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">
                    {item.metal} · {item.purity}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Weight: {item.weightLabel || `${item.weight}g`} · Qty: {item.quantity}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm sm:text-base font-bold text-gray-900">
                    ₹{item.itemSubtotal?.toLocaleString()}
                  </p>
                  <p className="text-[11px] text-gray-400">₹{item.price?.toLocaleString()} each</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Calculations */}
          <div className="pt-6 border-t border-gray-100 space-y-2 text-xs text-gray-600 max-w-sm ml-auto">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-medium text-gray-900">₹{pricing?.subtotal?.toLocaleString()}</span>
            </div>
            {pricing?.mrpSavings > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>MRP Retail Savings</span>
                <span className="font-semibold">-₹{pricing?.mrpSavings?.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Making Charges (12%)</span>
              <span className="font-medium text-gray-900">₹{pricing?.makingCharges?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (3%)</span>
              <span className="font-medium text-gray-900">₹{pricing?.gst?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="font-medium text-gray-900">
                {pricing?.deliveryFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${pricing?.deliveryFee}`}
              </span>
            </div>
            {pricing?.couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Coupon ({pricing?.couponCode})</span>
                <span>-₹{pricing?.couponDiscount?.toLocaleString()}</span>
              </div>
            )}
            <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline text-base font-bold text-gray-900">
              <span style={{ color: "#064E3B" }}>Total Amount</span>
              <span className="text-lg font-extrabold" style={{ color: "#064E3B" }}>
                ₹{pricing?.finalTotal?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Safety & Packaging Note */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FCF1D0]/60 border border-[#F5DF92] text-xs text-[#064E3B] mb-8 flex items-start gap-3">
          <span className="text-xl">🎁</span>
          <div className="leading-relaxed">
            <p className="font-bold text-sm mb-1">“Your jewellery is carefully packed for a safe delivery.”</p>
            <p className="text-gray-700">
              Every creation is inspected by our master gemologists, packed in an authentic velvet Dikshi Jewellery presentation box, and sealed in a tamper-evident security bag before handover to armed logistics escorts.
            </p>
          </div>
        </div>

        {/* Actions & Support */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <Link
            to="/jewellery"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-xs tracking-wider uppercase text-center transition-all hover:opacity-90 shadow-sm"
            style={{ backgroundColor: "#064E3B", color: "#FCF1D0" }}
          >
            CONTINUE SHOPPING
          </Link>

          <div className="text-center sm:text-right text-xs text-gray-500">
            <p>Need assistance with your order?</p>
            <p className="mt-0.5">
              Call <strong className="text-[#064E3B]">+91 98765 43210</strong> or email <strong className="text-[#064E3B]">support@dikshijewellery.com</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
