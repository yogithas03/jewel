import { useRef, useState } from "react";
import { products } from "../data/products";

export default function InvoiceForm() {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const addressRef = useRef(null);
  const productRef = useRef(null);
  const priceRef = useRef(null);
  const qtyRef = useRef(null);
  const invoicePreviewRef = useRef(null);

  const [items, setItems] = useState([]);
  const [invoice, setInvoice] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Auto-fill price if customer selects a catalog product
  const handleProductNameChange = (e) => {
    const val = e.target.value.trim();
    if (!val) return;
    const match = products.find(
      (p) => p.name.toLowerCase() === val.toLowerCase()
    );
    if (match && priceRef.current) {
      priceRef.current.value = match.price;
    }
  };

  const addProduct = () => {
    setErrorMsg("");
    setSuccessMsg("");

    const name = productRef.current?.value.trim();
    const price = Number(priceRef.current?.value);
    const qty = Number(qtyRef.current?.value);

    if (!name) {
      setErrorMsg("Please enter a product name.");
      productRef.current?.focus();
      return;
    }

    if (!price || price <= 0 || isNaN(price)) {
      setErrorMsg("Please enter a valid price greater than 0.");
      priceRef.current?.focus();
      return;
    }

    if (!qty || qty <= 0 || isNaN(qty)) {
      setErrorMsg("Quantity must be at least 1.");
      qtyRef.current?.focus();
      return;
    }

    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
        name,
        price,
        qty,
      },
    ]);

    productRef.current.value = "";
    priceRef.current.value = "";
    qtyRef.current.value = "1";
    setSuccessMsg(`"${name}" added to items list.`);
    productRef.current.focus();
  };

  const removeProduct = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const gstRate = 3; // 3% GST on jewellery in India
  const gstAmount = Math.round((subtotal * gstRate) / 100);
  const total = subtotal + gstAmount;

  const money = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  const generateInvoice = () => {
    setErrorMsg("");
    setSuccessMsg("");

    const customer = {
      name: nameRef.current?.value.trim(),
      email: emailRef.current?.value.trim(),
      phone: phoneRef.current?.value.trim(),
      address: addressRef.current?.value.trim(),
    };

    if (!customer.name || !customer.email || !customer.phone || !customer.address) {
      setErrorMsg("Please fill in all customer details (Name, Email, Phone, Address).");
      if (!customer.name) nameRef.current?.focus();
      else if (!customer.email) emailRef.current?.focus();
      else if (!customer.phone) phoneRef.current?.focus();
      else addressRef.current?.focus();
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(customer.email)) {
      setErrorMsg("Please enter a valid email address.");
      emailRef.current?.focus();
      return;
    }

    const cleanPhone = customer.phone.replace(/\D/g, "");
    if (!/^\d{10}$/.test(cleanPhone)) {
      setErrorMsg("Please enter a valid 10-digit phone number.");
      phoneRef.current?.focus();
      return;
    }

    if (items.length === 0) {
      setErrorMsg("Please add at least one product before generating an invoice.");
      productRef.current?.focus();
      return;
    }

    const newInvoice = {
      number: `DK-INV-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      customer: {
        ...customer,
        phone: cleanPhone,
      },
      items: items.map((item) => ({ ...item })),
      subtotal,
      gstAmount,
      total,
    };

    setInvoice(newInvoice);
    setSuccessMsg("Invoice generated successfully! Scroll down to preview and print.");

    setTimeout(() => {
      invoicePreviewRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  const clearForm = () => {
    [nameRef, emailRef, phoneRef, addressRef, productRef, priceRef, qtyRef].forEach((ref) => {
      if (ref.current) ref.current.value = "";
    });

    if (qtyRef.current) qtyRef.current.value = "1";
    setItems([]);
    setInvoice(null);
    setErrorMsg("");
    setSuccessMsg("");
    nameRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-gray-800 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans">
      {/* ── Main Container ── */}
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* ── Top Header (Hidden on Print) ── */}
        <header className="text-center print:hidden">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FCF1D0] border border-[#F5DF92] text-[#064E3B] text-xs font-semibold uppercase tracking-widest mb-3">
            <span>✦</span>
            <span>Billing & Invoice Portal</span>
            <span>✦</span>
          </div>

          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#064E3B]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            DIKSHI JEWELLERY
          </h1>

          <p className="mt-2 text-sm sm:text-base text-gray-600 font-medium">
            Invoice Management & Customer Receipt Generator
          </p>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D79B01] to-transparent mx-auto mt-4" />
        </header>

        {/* ── Feedback Messages (Hidden on Print) ── */}
        {(errorMsg || successMsg) && (
          <div className="print:hidden space-y-2">
            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3 shadow-sm animate-fade-in">
                <span className="text-lg">⚠</span>
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3 shadow-sm animate-fade-in">
                <span className="text-lg">✓</span>
                <span>{successMsg}</span>
              </div>
            )}
          </div>
        )}

        {/* ── Invoice Builder Form Card (Hidden on Print) ── */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 lg:p-10 shadow-sm print:hidden space-y-8">
          
          {/* Section 1: Customer Details */}
          <div>
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-gray-100">
              <span className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm bg-[#064E3B] text-[#FCF1D0] shadow-sm">
                1
              </span>
              <div>
                <h2
                  className="text-lg sm:text-xl font-semibold text-[#064E3B]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Customer Details
                </h2>
                <p className="text-xs text-gray-500">
                  Enter buyer information for the GST tax invoice
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Customer Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#064E3B] mb-1.5">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    ref={nameRef}
                    type="text"
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50/50 outline-none transition-all focus:bg-white focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#064E3B] mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  ref={emailRef}
                  type="email"
                  placeholder="e.g. priya@gmail.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50/50 outline-none transition-all focus:bg-white focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#064E3B] mb-1.5">
                  10-Digit Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-xs font-semibold text-gray-400">
                    +91
                  </span>
                  <input
                    ref={phoneRef}
                    type="tel"
                    maxLength={10}
                    placeholder="98765 43210"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50/50 outline-none transition-all focus:bg-white focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#064E3B] mb-1.5">
                  Delivery Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  ref={addressRef}
                  rows={2}
                  placeholder="Complete postal address with city, state & pin code..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50/50 outline-none transition-all focus:bg-white focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Add Product */}
          <div>
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-gray-100">
              <span className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm bg-[#064E3B] text-[#FCF1D0] shadow-sm">
                2
              </span>
              <div>
                <h2
                  className="text-lg sm:text-xl font-semibold text-[#064E3B]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Add Product
                </h2>
                <p className="text-xs text-gray-500">
                  Select from Dikshi catalog or enter custom jewellery items
                </p>
              </div>
            </div>

            {/* Datalist for fast catalog auto-complete */}
            <datalist id="dikshi-catalog-products">
              {products.map((p) => (
                <option key={p.id} value={p.name}>
                  ₹{p.price.toLocaleString()} ({p.metal} · {p.purity})
                </option>
              ))}
            </datalist>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end bg-[#FAF8F5] p-4 sm:p-5 rounded-2xl border border-gray-200/80">
              {/* Product Name */}
              <div className="sm:col-span-5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                  Product Name
                </label>
                <input
                  ref={productRef}
                  type="text"
                  list="dikshi-catalog-products"
                  placeholder="e.g. Classic Solitaire Gold Ring"
                  onChange={handleProductNameChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all"
                />
              </div>

              {/* Price */}
              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                  Price (₹)
                </label>
                <input
                  ref={priceRef}
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="e.g. 48000"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all"
                />
              </div>

              {/* Qty */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                  Qty
                </label>
                <input
                  ref={qtyRef}
                  type="number"
                  min="1"
                  step="1"
                  defaultValue="1"
                  placeholder="1"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#064E3B]/10 transition-all text-center"
                />
              </div>

              {/* Add Button */}
              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={addProduct}
                  className="w-full py-3 rounded-xl font-bold text-sm tracking-wider uppercase transition-all duration-200 hover:opacity-90 active:scale-[0.98] shadow-sm flex items-center justify-center gap-1.5"
                  style={{ backgroundColor: "#064E3B", color: "#FCF1D0" }}
                >
                  <span>+</span>
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Items Table */}
          <div>
            <div className="flex items-center justify-between pb-3 mb-4">
              <h3
                className="text-base sm:text-lg font-semibold text-[#064E3B]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Line Items ({items.length})
              </h3>
              {items.length > 0 && (
                <span className="text-xs text-gray-500">
                  {items.reduce((sum, i) => sum + i.qty, 0)} total units
                </span>
              )}
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-200/80 bg-white">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#064E3B]/[0.04] border-b border-gray-200 text-[11px] font-bold uppercase tracking-wider text-[#064E3B]">
                    <th className="py-3.5 px-4 sm:px-6">Product</th>
                    <th className="py-3.5 px-4 text-right">Price</th>
                    <th className="py-3.5 px-4 text-center">Qty</th>
                    <th className="py-3.5 px-4 text-right">Total</th>
                    <th className="py-3.5 px-4 text-center">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-gray-400">
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-3xl mb-2 opacity-50">💎</span>
                          <p className="text-sm font-medium text-gray-500">No items added to this invoice yet.</p>
                          <p className="text-xs text-gray-400 mt-0.5">Use the form above to add jewellery products.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    items.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-400 w-5">{index + 1}.</span>
                            <span className="font-semibold text-gray-900">{item.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right font-medium text-gray-700">
                          {money(item.price)}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAF8F5] border border-gray-200 text-gray-800">
                            {item.qty}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-[#064E3B]">
                          {money(item.price * item.qty)}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => removeProduct(item.id)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1 rounded-lg transition-all"
                            title="Remove item"
                          >
                            <span>✕</span>
                            <span className="hidden sm:inline">Remove</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Total Bar */}
            <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-[#FCF1D0]/60 to-[#FAF8F5] border border-[#F5DF92] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-gray-600 flex items-center gap-2">
                <span className="text-base">✦</span>
                <span>Includes 3% GST on Fine Jewellery. BIS Hallmarking guaranteed.</span>
              </div>
              <div className="text-right">
                <span className="text-xs uppercase tracking-widest text-gray-500 font-semibold block">Grand Total</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#064E3B]">
                  {money(total)}
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: Action Buttons */}
          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-end gap-3.5">
            <button
              type="button"
              onClick={clearForm}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider border border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all active:scale-[0.98]"
            >
              Clear Form
            </button>

            <button
              type="button"
              onClick={generateInvoice}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#FCF1D0] transition-all duration-300 hover:opacity-90 active:scale-[0.98] shadow-md hover:shadow-lg border border-[#F5D982] flex items-center justify-center gap-2"
              style={{ backgroundColor: "#064E3B" }}
            >
              <span>Generate Official Invoice</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* ── Generated Invoice Section (Print Ready) ── */}
        {invoice && (
          <div ref={invoicePreviewRef} className="pt-4">
            <div className="bg-white rounded-3xl border-2 border-[#D79B01]/30 p-8 sm:p-12 shadow-xl print:shadow-none print:border-none print:p-0 print:m-0 print:rounded-none relative overflow-hidden">
              
              {/* Gold Ribbon / Header Accent */}
              <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#064E3B] via-[#D79B01] to-[#064E3B]" />

              {/* Invoice Header */}
              <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pb-8 border-b border-gray-200">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#D79B01]">CERTIFIED JEWELLERS</span>
                  </div>
                  <h2
                    className="text-3xl sm:text-4xl font-bold tracking-tight text-[#064E3B]"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    DIKSHI JEWELLERY
                  </h2>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm leading-relaxed">
                    Flagship Store: Connaught Place, New Delhi - 110001
                    <br />
                    Phone: +91 98765 43210 • Email: billing@dikshijewellery.com
                    <br />
                    GSTIN: 07AAAAA0000A1Z5 • BIS Hallmark Certified
                  </p>
                </div>

                <div className="sm:text-right shrink-0">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-[#064E3B] text-[#FCF1D0] mb-2">
                    TAX INVOICE
                  </span>
                  <p className="text-sm font-bold text-gray-900 tracking-wide">
                    {invoice.number}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Date: {invoice.date}</p>
                </div>
              </div>

              {/* Bill To Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-gray-200 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                    BILL TO (CUSTOMER)
                  </span>
                  <p className="text-base font-bold text-[#064E3B]">{invoice.customer.name}</p>
                  <p className="text-gray-600 mt-0.5">{invoice.customer.email}</p>
                  <p className="text-gray-600">+91 {invoice.customer.phone}</p>
                </div>

                <div className="sm:text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                    DISPATCH & DELIVERY ADDRESS
                  </span>
                  <p className="text-gray-700 leading-relaxed font-medium">
                    {invoice.customer.address}
                  </p>
                </div>
              </div>

              {/* Invoice Line Items */}
              <div className="py-6">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b-2 border-[#064E3B] text-[#064E3B] uppercase tracking-wider text-[11px] font-bold">
                      <th className="py-3 px-2">#</th>
                      <th className="py-3 px-2">Item Description</th>
                      <th className="py-3 px-2 text-right">Rate</th>
                      <th className="py-3 px-2 text-center">Qty</th>
                      <th className="py-3 px-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {invoice.items.map((item, index) => (
                      <tr key={item.id} className="text-gray-800">
                        <td className="py-3 px-2 font-mono text-gray-400">{index + 1}</td>
                        <td className="py-3 px-2 font-semibold text-gray-900">{item.name}</td>
                        <td className="py-3 px-2 text-right text-gray-600">{money(item.price)}</td>
                        <td className="py-3 px-2 text-center font-bold">{item.qty}</td>
                        <td className="py-3 px-2 text-right font-bold text-gray-900">
                          {money(item.price * item.qty)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Invoice Total Calculation */}
              <div className="pt-4 border-t border-gray-200">
                <div className="max-w-xs ml-auto space-y-2 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Taxable Value (Subtotal)</span>
                    <span className="font-semibold text-gray-900">{money(invoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>CGST (1.5%)</span>
                    <span className="font-medium text-gray-900">{money(Math.round(invoice.gstAmount / 2))}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>SGST (1.5%)</span>
                    <span className="font-medium text-gray-900">{money(Math.round(invoice.gstAmount / 2))}</span>
                  </div>
                  <div className="pt-2 border-t-2 border-[#064E3B] flex justify-between items-baseline text-base sm:text-lg font-bold text-[#064E3B]">
                    <span>Grand Total</span>
                    <span>{money(invoice.total)}</span>
                  </div>
                </div>
              </div>

              {/* Terms & Footer Note */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-gray-500">
                <div className="space-y-1">
                  <p className="font-semibold text-gray-700">Terms & Conditions:</p>
                  <p>1. Certified 100% BIS Hallmarked Jewellery & Certified Diamonds.</p>
                  <p>2. Subject to Delhi jurisdiction only.</p>
                </div>

                <div className="text-right sm:text-right shrink-0">
                  <div className="h-10 w-32 border-b border-gray-400 mb-1 ml-auto" />
                  <p className="font-bold text-[#064E3B]">Authorized Signatory</p>
                  <p className="text-[10px] text-gray-400">For Dikshi Jewellery</p>
                </div>
              </div>

              {/* Print / Save CTA (Hidden on print) */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 print:hidden">
                <p className="text-xs text-gray-500">
                  Thank you for trusting Dikshi Jewellery!
                </p>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-[#FCF1D0] shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center gap-2"
                    style={{ backgroundColor: "#064E3B", border: "1px solid #F5D982" }}
                  >
                    <span>🖨️</span>
                    <span>Print / Save as PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
