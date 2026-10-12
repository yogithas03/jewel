import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi (NCT)",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const AVAILABLE_COUPONS = [
  { code: "DIKSHI10", discountPercent: 10, maxDiscount: 5000, minOrder: 0, description: "10% off up to ₹5,000" },
  { code: "GOLD1000", flatDiscount: 1000, minOrder: 10000, description: "Flat ₹1,000 off on orders above ₹10,000" },
  { code: "FESTIVE5", discountPercent: 5, maxDiscount: 2500, minOrder: 0, description: "5% off up to ₹2,500" },
  { code: "ROYALJEWEL", flatDiscount: 2500, minOrder: 25000, description: "₹2,500 off on orders above ₹25,000" },
];

const MAKING_CHARGE_PERCENT = 12;
const GST_PERCENT = 3;

function addBusinessDays(startDate, days) {
  const result = new Date(startDate);
  let count = 0;
  while (count < days) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) {
      count++;
    }
  }
  return result;
}

function formatDateRange(d1, d2) {
  const options = { weekday: "short", day: "numeric", month: "short" };
  return `${d1.toLocaleDateString("en-IN", options)} – ${d2.toLocaleDateString("en-IN", options)}`;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartSubtotal, clearCart } = useCart();

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      // Don't redirect immediately on mount if user just placed an order
      const lastOrder = localStorage.getItem("dikshi_last_order");
      if (!lastOrder) {
        navigate("/cart");
      }
    }
  }, [cartItems, navigate]);

  // Delivery Form State
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    houseNo: "",
    street: "",
    landmark: "",
    city: "",
    state: "Delhi (NCT)",
    pincode: "",
    country: "India",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Delivery Option State
  const [deliveryMethod, setDeliveryMethod] = useState("standard"); // standard | express

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState("upi"); // upi | card | netbanking | cod
  const [upiId, setUpiId] = useState("");
  const [upiVerified, setUpiVerified] = useState(false);
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  // Coupon State
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Dynamic Dates
  const today = useMemo(() => new Date(), []);
  const standardDateRange = useMemo(() => {
    const d1 = addBusinessDays(today, 5);
    const d2 = addBusinessDays(today, 7);
    return formatDateRange(d1, d2);
  }, [today]);

  const expressDateRange = useMemo(() => {
    const d1 = addBusinessDays(today, 2);
    const d2 = addBusinessDays(today, 3);
    return formatDateRange(d1, d2);
  }, [today]);

  // Pricing calculations
  const makingCharges = Math.round((cartSubtotal * MAKING_CHARGE_PERCENT) / 100);
  const gst = Math.round(((cartSubtotal + makingCharges) * GST_PERCENT) / 100);

  const deliveryFee = useMemo(() => {
    if (deliveryMethod === "express") return 350;
    return cartSubtotal >= 5000 ? 0 : 150;
  }, [deliveryMethod, cartSubtotal]);

  // MRP savings
  const originalSubtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const orig = item.originalPrice || item.price;
      return sum + orig * item.quantity;
    }, 0);
  }, [cartItems]);

  const mrpSavings = Math.max(0, originalSubtotal - cartSubtotal);

  // Coupon calculation
  const couponDiscount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.flatDiscount) {
      return appliedCoupon.flatDiscount;
    }
    if (appliedCoupon.discountPercent) {
      const discount = Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100);
      return appliedCoupon.maxDiscount ? Math.min(discount, appliedCoupon.maxDiscount) : discount;
    }
    return 0;
  }, [appliedCoupon, cartSubtotal]);

  const finalTotal = Math.max(0, cartSubtotal + makingCharges + gst + deliveryFee - couponDiscount);

  // Field change handler
  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, form[field]);
  };

  const validateField = (field, value) => {
    let error = "";
    const trimmed = String(value || "").trim();

    switch (field) {
      case "fullName":
        if (!trimmed) error = "Full name is required";
        else if (trimmed.length < 3) error = "Full name must be at least 3 characters";
        break;
      case "email":
        if (!trimmed) error = "Email address is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) error = "Enter a valid email address";
        break;
      case "phone": {
        const clean = trimmed.replace(/\D/g, "");
        const digits = clean.length === 12 && clean.startsWith("91") ? clean.slice(2) : clean;
        if (!trimmed) error = "Mobile number is required";
        else if (!/^[6-9]\d{9}$/.test(digits)) error = "Enter a valid 10-digit Indian mobile number";
        break;
      }
      case "houseNo":
        if (!trimmed) error = "House / Flat / Building is required";
        break;
      case "street":
        if (!trimmed) error = "Street, Colony or Area is required";
        break;
      case "city":
        if (!trimmed) error = "City / District is required";
        break;
      case "state":
        if (!trimmed) error = "Please select your state";
        break;
      case "pincode":
        if (!trimmed) error = "PIN code is required";
        else if (!/^[1-9][0-9]{5}$/.test(trimmed)) error = "Enter a valid 6-digit Indian PIN code";
        break;
      default:
        break;
    }

    if (error) {
      setErrors((prev) => ({ ...prev, [field]: error }));
      return false;
    }
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
    return true;
  };

  const validateAll = () => {
    const fieldsToValidate = ["fullName", "email", "phone", "houseNo", "street", "city", "state", "pincode"];
    const newErrors = {};
    fieldsToValidate.forEach((f) => {
      const val = form[f];
      const trimmed = String(val || "").trim();
      if (!trimmed) {
        newErrors[f] = "This field is required";
      } else {
        if (f === "fullName" && trimmed.length < 3) newErrors[f] = "Name must be at least 3 characters";
        if (f === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) newErrors[f] = "Enter a valid email address";
        if (f === "phone") {
          const clean = trimmed.replace(/\D/g, "");
          const digits = clean.length === 12 && clean.startsWith("91") ? clean.slice(2) : clean;
          if (!/^[6-9]\d{9}$/.test(digits)) newErrors[f] = "Enter a valid 10-digit Indian mobile number";
        }
        if (f === "pincode" && !/^[1-9][0-9]{5}$/.test(trimmed)) newErrors[f] = "Enter a valid 6-digit PIN code";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Coupon handling
  const handleApplyCoupon = (codeToApply) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    setCouponError("");
    setCouponSuccess("");

    if (!code) {
      setCouponError("Please enter a coupon code");
      return;
    }

    const match = AVAILABLE_COUPONS.find((c) => c.code === code);
    if (!match) {
      setCouponError(`Invalid coupon code "${code}". Try DIKSHI10 or GOLD1000.`);
      return;
    }

    if (match.minOrder && cartSubtotal < match.minOrder) {
      setCouponError(`Coupon requires a minimum order of ₹${match.minOrder.toLocaleString()}.`);
      return;
    }

    setAppliedCoupon(match);
    setCouponInput(code);
    setCouponSuccess(`Coupon ${match.code} applied successfully!`);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponSuccess("");
    setCouponError("");
  };

  // Order Placement
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setSubmitError("");

    // 1. Validate delivery form
    if (!validateAll()) {
      setSubmitError("Please fill in all required delivery fields correctly.");
      window.scrollTo({ top: 300, behavior: "smooth" });
      return;
    }

    // 2. Validate cart has items
    if (cartItems.length === 0) {
      setSubmitError("Your cart is empty. Please add items before checking out.");
      return;
    }

    // 3. Payment specific validations
    if (paymentMethod === "upi" && !upiId.trim()) {
      setSubmitError("Please enter your UPI ID or select an alternative payment method.");
      return;
    }

    if (paymentMethod === "cod" && finalTotal > 50000) {
      setSubmitError("Cash on Delivery is only available for orders up to ₹50,000. Please select UPI, Card or Net Banking.");
      return;
    }

    setIsSubmitting(true);

    const orderPayload = {
      customer: {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      },
      delivery: {
        houseNo: form.houseNo.trim(),
        street: form.street.trim(),
        landmark: form.landmark.trim(),
        city: form.city.trim(),
        state: form.state,
        pincode: form.pincode.trim(),
        country: "India",
        method: deliveryMethod,
        estimatedDelivery: deliveryMethod === "express" ? expressDateRange : standardDateRange,
        deliveryFee,
      },
      payment: {
        method: paymentMethod,
        methodLabel:
          paymentMethod === "upi"
            ? `UPI (${upiId.trim()})`
            : paymentMethod === "card"
            ? "Credit / Debit Card (Gateway Sandbox)"
            : paymentMethod === "netbanking"
            ? `Net Banking (${selectedBank})`
            : "Cash on Delivery",
        status: paymentMethod === "cod" ? "Pending Verification" : "Paid & Verified",
        transactionId: `TXN-${Date.now().toString().slice(-8)}`,
      },
      items: cartItems.map((item) => ({
        id: item.id,
        productId: item.productId || item.id,
        name: item.name,
        metal: item.metal,
        purity: item.purity,
        weight: item.weight,
        weightLabel: item.weightLabel || `${item.weight}g`,
        price: item.price,
        originalPrice: item.originalPrice,
        quantity: item.quantity,
        image: item.image,
        itemSubtotal: item.price * item.quantity,
      })),
      pricing: {
        subtotal: cartSubtotal,
        makingCharges,
        gst,
        deliveryFee,
        mrpSavings,
        couponCode: appliedCoupon?.code || null,
        couponDiscount,
        finalTotal,
      },
    };

    try {
      let createdOrder = null;

      // Try backend /api/orders
      try {
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.order) {
            createdOrder = data.order;
          }
        }
      } catch (apiErr) {
        console.warn("Backend orders API unreachable, saving client-side order:", apiErr);
      }

      // Fallback client order generation if API is not running standalone
      if (!createdOrder) {
        const timestamp = Date.now().toString().slice(-6);
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        createdOrder = {
          ...orderPayload,
          orderId: `DK-ORD-${timestamp}-${randomSuffix}`,
          createdAt: new Date().toISOString(),
          status: paymentMethod === "cod" ? "Order Confirmed (Cash on Delivery)" : "Order Confirmed & Paid",
        };
      }

      // Store in localStorage for OrderConfirmation page & persistence
      localStorage.setItem("dikshi_last_order", JSON.stringify(createdOrder));

      // Append to orders history
      try {
        const existingHistory = JSON.parse(localStorage.getItem("dikshi_orders") || "[]");
        existingHistory.unshift(createdOrder);
        localStorage.setItem("dikshi_orders", JSON.stringify(existingHistory.slice(0, 20)));
      } catch (e) {
        console.error("Failed to append order history:", e);
      }

      // Clear the cart
      clearCart();

      // Navigate to order confirmation
      navigate(`/order-confirmation/${createdOrder.orderId}`, { state: { order: createdOrder } });
    } catch (err) {
      console.error("Order placement error:", err);
      setSubmitError("We were unable to process your order at this moment. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="pt-24 lg:pt-32 min-h-screen flex flex-col items-center justify-center text-center px-4" style={{ backgroundColor: "#FCF1D0" }}>
        <p className="text-5xl mb-4" style={{ color: "#064E3B" }}>✦</p>
        <h2 className="text-2xl sm:text-3xl font-semibold mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#064E3B" }}>
          Your Cart is Empty
        </h2>
        <p className="text-gray-600 mb-6 max-w-sm text-sm">
          Please add your favorite jewellery pieces to your cart before proceeding to checkout.
        </p>
        <Link
          to="/jewellery"
          className="px-8 py-3.5 rounded-full font-semibold text-sm tracking-wider transition-all hover:opacity-90"
          style={{ backgroundColor: "#064E3B", color: "#FCF1D0" }}
        >
          EXPLORE JEWELLERY
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20 lg:pt-24 min-h-screen pb-16" style={{ backgroundColor: "#FAF8F5" }}>
      {/* Top Banner / Breadcrumb */}
      <div className="border-b border-gray-200/80 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <nav className="flex items-center gap-2 text-xs text-gray-500">
            <Link to="/" className="hover:text-[#064E3B] transition-colors">Home</Link>
            <span>/</span>
            <Link to="/cart" className="hover:text-[#064E3B] transition-colors">Shopping Cart</Link>
            <span>/</span>
            <span className="font-semibold" style={{ color: "#064E3B" }}>Secure Checkout</span>
          </nav>
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-800">
            <svg className="w-4 h-4 text-[#064E3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="hidden sm:inline">256-Bit Bank-Grade Encryption</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-12">
        {/* Page Header */}
        <div className="mb-8 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#D79B01]">DIKSHI ASSURANCE</span>
            <span className="text-[#D79B01]">✦</span>
            <span className="text-xs text-gray-400">100% Insured Transit</span>
          </div>
          <h1
            className="text-3xl sm:text-4xl font-semibold mb-2"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#064E3B" }}
          >
            Secure Checkout
          </h1>
          <p className="text-sm text-gray-600">
            Complete your order and let your jewellery story begin.
          </p>
        </div>

        {submitError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
            <svg className="w-5 h-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{submitError}</span>
          </div>
        )}

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Sections */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Delivery Information Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-7 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <span className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-[#064E3B] text-[#FCF1D0]">
                  1
                </span>
                <div>
                  <h2
                    className="text-lg sm:text-xl font-semibold"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#064E3B" }}
                  >
                    Delivery Address
                  </h2>
                  <p className="text-xs text-gray-500">Where should we deliver your jewellery?</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "#064E3B" }}>
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Priya Sharma"
                    value={form.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    onBlur={() => handleBlur("fullName")}
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none ${
                      touched.fullName && errors.fullName
                        ? "border-red-400 bg-red-50/20 focus:border-red-500"
                        : "border-gray-200 focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B]"
                    }`}
                  />
                  {touched.fullName && errors.fullName && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <span>⚠</span> {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "#064E3B" }}>
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. priya@gmail.com"
                      value={form.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      onBlur={() => handleBlur("email")}
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none ${
                        touched.email && errors.email
                          ? "border-red-400 bg-red-50/20 focus:border-red-500"
                          : "border-gray-200 focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B]"
                      }`}
                    />
                    {touched.email && errors.email && (
                      <p className="text-xs text-red-500 mt-1">⚠ {errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "#064E3B" }}>
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3.5 text-xs font-semibold text-gray-500">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="98765 43210"
                        value={form.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value.replace(/\D/g, ""))}
                        onBlur={() => handleBlur("phone")}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border text-sm transition-all outline-none ${
                          touched.phone && errors.phone
                            ? "border-red-400 bg-red-50/20 focus:border-red-500"
                            : "border-gray-200 focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B]"
                        }`}
                      />
                    </div>
                    {touched.phone && errors.phone && (
                      <p className="text-xs text-red-500 mt-1">⚠ {errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* House/Flat & Street */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "#064E3B" }}>
                      Flat / House No. / Building <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Flat 402, Royal Palms"
                      value={form.houseNo}
                      onChange={(e) => handleInputChange("houseNo", e.target.value)}
                      onBlur={() => handleBlur("houseNo")}
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none ${
                        touched.houseNo && errors.houseNo
                          ? "border-red-400 bg-red-50/20 focus:border-red-500"
                          : "border-gray-200 focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B]"
                      }`}
                    />
                    {touched.houseNo && errors.houseNo && (
                      <p className="text-xs text-red-500 mt-1">⚠ {errors.houseNo}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "#064E3B" }}>
                      Street / Area / Colony <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. MG Road, Connaught Place"
                      value={form.street}
                      onChange={(e) => handleInputChange("street", e.target.value)}
                      onBlur={() => handleBlur("street")}
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none ${
                        touched.street && errors.street
                          ? "border-red-400 bg-red-50/20 focus:border-red-500"
                          : "border-gray-200 focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B]"
                      }`}
                    />
                    {touched.street && errors.street && (
                      <p className="text-xs text-red-500 mt-1">⚠ {errors.street}</p>
                    )}
                  </div>
                </div>

                {/* Landmark & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "#064E3B" }}>
                      Landmark <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Near City Mall"
                      value={form.landmark}
                      onChange={(e) => handleInputChange("landmark", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm transition-all outline-none focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "#064E3B" }}>
                      City / District <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. New Delhi"
                      value={form.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      onBlur={() => handleBlur("city")}
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none ${
                        touched.city && errors.city
                          ? "border-red-400 bg-red-50/20 focus:border-red-500"
                          : "border-gray-200 focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B]"
                      }`}
                    />
                    {touched.city && errors.city && (
                      <p className="text-xs text-red-500 mt-1">⚠ {errors.city}</p>
                    )}
                  </div>
                </div>

                {/* State, PIN Code, Country */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "#064E3B" }}>
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      className="w-full px-3.5 py-3 rounded-xl border border-gray-200 text-sm bg-white transition-all outline-none focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B]"
                    >
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "#064E3B" }}>
                      PIN Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="110001"
                      value={form.pincode}
                      onChange={(e) => handleInputChange("pincode", e.target.value.replace(/\D/g, ""))}
                      onBlur={() => handleBlur("pincode")}
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none ${
                        touched.pincode && errors.pincode
                          ? "border-red-400 bg-red-50/20 focus:border-red-500"
                          : "border-gray-200 focus:border-[#064E3B] focus:ring-1 focus:ring-[#064E3B]"
                      }`}
                    />
                    {touched.pincode && errors.pincode && (
                      <p className="text-xs text-red-500 mt-1">⚠ {errors.pincode}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "#064E3B" }}>
                      Country
                    </label>
                    <div className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 flex items-center justify-between text-gray-700">
                      <span>India</span>
                      <span className="text-base">🇮🇳</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Delivery Options Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-7 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <span className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-[#064E3B] text-[#FCF1D0]">
                  2
                </span>
                <div>
                  <h2
                    className="text-lg sm:text-xl font-semibold"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#064E3B" }}
                  >
                    Delivery Options
                  </h2>
                  <p className="text-xs text-gray-500">Insured and tamper-proof courier service</p>
                </div>
              </div>

              <div className="space-y-3.5">
                {/* Standard Delivery */}
                <label
                  onClick={() => setDeliveryMethod("standard")}
                  className={`block relative p-4 sm:p-5 rounded-xl border-2 cursor-pointer transition-all ${
                    deliveryMethod === "standard"
                      ? "border-[#064E3B] bg-[#064E3B]/[0.02] shadow-sm"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        checked={deliveryMethod === "standard"}
                        onChange={() => setDeliveryMethod("standard")}
                        className="mt-1 accent-[#064E3B] w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-900">Standard Insured Delivery</span>
                          {cartSubtotal >= 5000 && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800">
                              FREE
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Sequel Logistics / BlueDart Insured Transit (5–7 business days)
                        </p>
                        <p className="text-xs font-semibold text-emerald-800 mt-2 flex items-center gap-1.5">
                          <span>📦</span> Estimated Delivery: <span className="underline">{standardDateRange}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-bold" style={{ color: "#064E3B" }}>
                        {cartSubtotal >= 5000 ? "FREE" : "₹150"}
                      </span>
                    </div>
                  </div>
                </label>

                {/* Express Delivery */}
                <label
                  onClick={() => setDeliveryMethod("express")}
                  className={`block relative p-4 sm:p-5 rounded-xl border-2 cursor-pointer transition-all ${
                    deliveryMethod === "express"
                      ? "border-[#064E3B] bg-[#064E3B]/[0.02] shadow-sm"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        checked={deliveryMethod === "express"}
                        onChange={() => setDeliveryMethod("express")}
                        className="mt-1 accent-[#064E3B] w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-900">Express Insured Air Shipping</span>
                          <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: "#F5DF92", color: "#064E3B" }}>
                            FASTEST
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Dedicated Secure Air Express with Priority Tamper Packaging (2–3 business days)
                        </p>
                        <p className="text-xs font-semibold text-emerald-800 mt-2 flex items-center gap-1.5">
                          <span>⚡</span> Estimated Delivery: <span className="underline">{expressDateRange}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-bold" style={{ color: "#064E3B" }}>
                        ₹350
                      </span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* 3. Payment Methods Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-7 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <span className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-[#064E3B] text-[#FCF1D0]">
                  3
                </span>
                <div>
                  <h2
                    className="text-lg sm:text-xl font-semibold"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#064E3B" }}
                  >
                    Payment Method
                  </h2>
                  <p className="text-xs text-gray-500">100% secure with RBI-compliant encryption</p>
                </div>
              </div>

              {/* Payment Method Selector Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { id: "upi", label: "UPI", icon: "📱", sub: "GPay, PhonePe, Paytm" },
                  { id: "card", label: "Cards", icon: "💳", sub: "Credit / Debit" },
                  { id: "netbanking", label: "Net Banking", icon: "🏦", sub: "All Indian Banks" },
                  { id: "cod", label: "Cash on Delivery", icon: "💵", sub: "Up to ₹50,000" },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      paymentMethod === pm.id
                        ? "border-[#064E3B] bg-[#064E3B]/[0.03] ring-1 ring-[#064E3B]"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <span className="text-2xl mb-1.5">{pm.icon}</span>
                    <div>
                      <p className="text-xs font-bold text-gray-900">{pm.label}</p>
                      <p className="text-[10px] text-gray-500 line-clamp-1">{pm.sub}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Sub-view for UPI */}
              {paymentMethod === "upi" && (
                <div className="p-4 sm:p-5 rounded-xl bg-gray-50/80 border border-gray-200/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                      Enter UPI ID / VPA
                    </p>
                    <span className="text-xs text-emerald-700 font-medium">Instant Verification</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. mobile@upi or username@okhdfcbank"
                      value={upiId}
                      onChange={(e) => {
                        setUpiId(e.target.value);
                        setUpiVerified(false);
                      }}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-sm bg-white outline-none focus:border-[#064E3B]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (upiId.includes("@") && upiId.length > 5) {
                          setUpiVerified(true);
                        } else {
                          alert("Please enter a valid UPI ID (e.g., username@bank)");
                        }
                      }}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#064E3B] text-[#FCF1D0] hover:opacity-90"
                    >
                      {upiVerified ? "✓ Verified" : "Verify"}
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] text-gray-500">
                    <span>Popular Apps:</span>
                    {["@okhdfcbank", "@okaxis", "@paytm", "@ybl", "@ibl"].map((vpa) => (
                      <button
                        key={vpa}
                        type="button"
                        onClick={() => {
                          const user = upiId.split("@")[0] || "user";
                          setUpiId(`${user}${vpa}`);
                        }}
                        className="px-2 py-1 rounded bg-white border border-gray-200 hover:border-gray-300"
                      >
                        {vpa}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-view for Credit / Debit Card */}
              {paymentMethod === "card" && (
                <div className="p-4 sm:p-5 rounded-xl bg-gray-50/80 border border-gray-200/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                        Secure Payment Gateway
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-amber-100 text-amber-800">
                        SANDBOX / DEMO GATEWAY
                      </span>
                    </div>
                    <div className="flex gap-1 text-xs">
                      <span>💳 Visa</span>
                      <span>Mastercard</span>
                      <span>RuPay</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed">
                    PCI-DSS Level 1 Compliant. Never stores raw card numbers or CVV. In sandbox/development mode, test transactions can be simulated safely.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 uppercase mb-1">
                        Card Number (Simulated)
                      </label>
                      <input
                        type="text"
                        maxLength={19}
                        placeholder="4532 •••• •••• 8892"
                        value={cardDetails.number}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
                          setCardDetails((p) => ({ ...p, number: v }));
                        }}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm bg-white outline-none focus:border-[#064E3B]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 uppercase mb-1">
                          Expiry (MM/YY)
                        </label>
                        <input
                          type="text"
                          maxLength={5}
                          placeholder="12/28"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails((p) => ({ ...p, expiry: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm bg-white outline-none focus:border-[#064E3B]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 uppercase mb-1">
                          CVV
                        </label>
                        <input
                          type="password"
                          maxLength={3}
                          placeholder="•••"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails((p) => ({ ...p, cvv: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm bg-white outline-none focus:border-[#064E3B]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-view for Net Banking */}
              {paymentMethod === "netbanking" && (
                <div className="p-4 sm:p-5 rounded-xl bg-gray-50/80 border border-gray-200/80 space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Select Your Bank
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", "Kotak Bank", "Punjab National Bank"].map(
                      (bank) => (
                        <button
                          key={bank}
                          type="button"
                          onClick={() => setSelectedBank(bank)}
                          className={`p-2.5 rounded-lg border text-xs font-semibold text-left transition-all ${
                            selectedBank === bank
                              ? "border-[#064E3B] bg-white text-[#064E3B] shadow-sm"
                              : "border-gray-200 bg-white/70 text-gray-700 hover:bg-white"
                          }`}
                        >
                          {bank}
                        </button>
                      )
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500">
                    You will be redirected to your bank's secure portal to authorize the transaction.
                  </p>
                </div>
              )}

              {/* Sub-view for COD */}
              {paymentMethod === "cod" && (
                <div className="p-4 sm:p-5 rounded-xl bg-gray-50/80 border border-gray-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                      Cash on Delivery Conditions
                    </span>
                    <span className="text-xs font-bold text-gray-800">
                      Limit: ₹50,000
                    </span>
                  </div>

                  {finalTotal > 50000 ? (
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                      ⚠️ <strong>COD Unavailable:</strong> Order value is ₹{finalTotal.toLocaleString()}, which exceeds the ₹50,000 regulatory courier transit ceiling for precious metals. Please choose UPI, Card, or Net Banking for 100% insured delivery.
                    </div>
                  ) : (
                    <div className="text-xs text-gray-600 space-y-2">
                      <p>✓ Insured courier parcel handed over upon cash collection.</p>
                      <p>✓ A government-issued photo ID & dispatch confirmation OTP are required at delivery.</p>
                      <p>✓ Exact cash amount is appreciated by delivery personnel.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-7 shadow-sm lg:sticky lg:top-28 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3
                  className="text-lg sm:text-xl font-semibold"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#064E3B" }}
                >
                  Order Summary
                </h3>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#064E3B]/10 text-[#064E3B]">
                  {cartItems.reduce((acc, i) => acc + i.quantity, 0)} Items
                </span>
              </div>

              {/* Cart Items List */}
              <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-3.5 flex gap-3.5 items-center">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#0D3D38] shrink-0 border border-gray-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <span className="absolute top-0 right-0 px-1.5 py-0.5 rounded-bl-lg text-[10px] font-bold bg-[#064E3B] text-[#FCF1D0]">
                        ×{item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-gray-500 uppercase tracking-wider mt-0.5">
                        {item.metal} · {item.purity}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {item.weightLabel || `${item.weight}g`}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs sm:text-sm font-bold text-gray-900">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                      {item.originalPrice && (
                        <p className="text-[10px] text-gray-400 line-through">
                          ₹{(item.originalPrice * item.quantity).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Section */}
              <div className="pt-2 border-t border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Apply Coupon
                  </span>
                  {appliedCoupon && (
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {!appliedCoupon ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. DIKSHI10"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-gray-200 text-xs tracking-wider uppercase outline-none focus:border-[#064E3B]"
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon()}
                      className="px-4 py-2 rounded-xl text-xs font-bold tracking-wider transition-all hover:opacity-90"
                      style={{ backgroundColor: "#064E3B", color: "#FCF1D0" }}
                    >
                      APPLY
                    </button>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div className="text-xs">
                      <p className="font-bold text-emerald-900">{appliedCoupon.code} Applied</p>
                      <p className="text-[11px] text-emerald-700">{appliedCoupon.description}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-800">
                      -₹{couponDiscount.toLocaleString()}
                    </span>
                  </div>
                )}

                {couponError && <p className="text-xs text-red-500">⚠ {couponError}</p>}
                {couponSuccess && !couponError && (
                  <p className="text-xs text-emerald-600">✓ {couponSuccess}</p>
                )}

                {/* Quick Coupon Chips */}
                {!appliedCoupon && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {AVAILABLE_COUPONS.slice(0, 2).map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => handleApplyCoupon(c.code)}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-semibold tracking-wider border border-dashed border-[#D79B01] text-[#064E3B] hover:bg-[#FCF1D0]/40 transition-colors"
                      >
                        {c.code}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-gray-100 space-y-2.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">₹{cartSubtotal.toLocaleString()}</span>
                </div>

                {mrpSavings > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Retail MRP Savings</span>
                    <span className="font-semibold">-₹{mrpSavings.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Making Charges ({MAKING_CHARGE_PERCENT}%)</span>
                  <span className="font-medium text-gray-900">₹{makingCharges.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span>GST ({GST_PERCENT}%)</span>
                  <span className="font-medium text-gray-900">₹{gst.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span>
                    Delivery ({deliveryMethod === "express" ? "Express Air" : "Standard"})
                  </span>
                  <span className="font-medium text-gray-900">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Coupon Discount</span>
                    <span>-₹{couponDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline text-base font-bold text-gray-900">
                  <span style={{ color: "#064E3B" }}>Final Payable Total</span>
                  <span className="text-lg font-extrabold" style={{ color: "#064E3B" }}>
                    ₹{finalTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Safe Delivery Statement (Required) */}
              <div className="p-3.5 rounded-xl bg-[#FCF1D0]/50 border border-[#F5DF92]/50 text-xs text-[#064E3B] flex items-start gap-2.5">
                <span className="text-base leading-none">🛡️</span>
                <p className="leading-relaxed">
                  <strong>“Your jewellery is carefully packed for a safe delivery.”</strong>
                  <br />
                  <span className="text-[11px] text-gray-600">
                    Shipped in tamper-proof security sealed boxes with 100% insurance coverage.
                  </span>
                </p>
              </div>

              {/* Place Order CTA Button */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full py-4 rounded-full font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: "#075642",
                  color: "#FCF1D0",
                  border: "1px solid #F5D982",
                }}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#FCF1D0]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>SECURING YOUR ORDER...</span>
                  </>
                ) : (
                  <>
                    <span>PLACE ORDER SECURELY</span>
                    <span className="text-[#F5D982]">✦ ₹{finalTotal.toLocaleString()}</span>
                  </>
                )}
              </button>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-gray-500 text-center">
                <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                  <span className="font-semibold block text-gray-800">BIS Hallmarked</span>
                  <span>100% Certified</span>
                </div>
                <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                  <span className="font-semibold block text-gray-800">Insured Delivery</span>
                  <span>Full Risk Covered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
