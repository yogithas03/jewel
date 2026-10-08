import { useState } from "react";

const STORE_ADDRESS =
  "No.80 & 81, Velachery Main Rd, Devi Karumariamman Nagar, Pallikaranai, Chennai, Tamil Nadu 600100, India";

const CONTACT_INFO = [
  { icon: "📍", label: "Visit Us", value: STORE_ADDRESS },
  { icon: "📞", label: "Call Us", value: "+91 78945 67880\n+91 99934 56689" },
  { icon: "✉️", label: "Email Us", value: "hello@dikshijewellery.com\nsupport@dikshijewellery.com" },
  { icon: "🕐", label: "Business Hours", value: "Mon–Sat: 10:00 AM – 8:00 PM\nSunday: 11:00 AM – 6:00 PM" },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.message.trim()) e.message = "Message is required";
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  return (
    <div className="pt-20 lg:pt-24">
      {/* Hero */}
      <div className="py-16 px-4 text-center" style={{ backgroundColor: "#064E3B" }}>
        <p className="text-xs tracking-[0.35em] mb-3" style={{ color: "#D79B01" }}>DIKSHI JEWELLERY</p>
        <h1
          className="text-3xl sm:text-5xl font-semibold"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#FCF1D0" }}
        >
          Contact Us
        </h1>
        <p className="mt-3 text-sm max-w-lg mx-auto" style={{ color: "rgba(252,241,208,0.70)" }}>
          We'd love to hear from you. Reach out for enquiries, bookings, or just to say hello.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <h2
              className="text-2xl font-semibold mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#064E3B" }}
            >
              Send Us a Message
            </h2>

            {submitted ? (
              <div
                className="rounded-2xl p-8 text-center"
                style={{ backgroundcolor: "#FCF1D0", border: "1px solid rgba(245,223,146,0.3)" }}
              >
                <div className="text-4xl mb-4" style={{ color: "#F5DF92" }}>✓</div>
                <h3
                  className="text-xl font-semibold mb-2"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#064E3B" }}
                >
                  Message Received!
                </h3>
                <p className="text-sm text-gray-600">
                  Thank you for reaching out. Our team will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}
                  className="mt-6 px-6 py-3 rounded-full text-sm font-semibold transition-all hover:opacity-90"
                  style={{ backgroundColor: "#064E3B", color: "#FCF1D0" }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Full Name *" error={errors.name}>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      className={inputClass(errors.name)}
                    />
                  </Field>
                  <Field label="Email Address *" error={errors.email}>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      className={inputClass(errors.email)}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Phone Number">
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      className={inputClass()}
                    />
                  </Field>
                  <Field label="Subject">
                    <select
                      value={form.subject}
                      onChange={(e) => update("subject", e.target.value)}
                      className={inputClass()}
                    >
                      <option value="">Select subject</option>
                      <option>Product Enquiry</option>
                      <option>Customisation</option>
                      <option>Repair Service</option>
                      <option>Gold Exchange</option>
                      <option>Other</option>
                    </select>
                  </Field>
                </div>

                <Field label="Message *" error={errors.message}>
                  <textarea
                    rows={5}
                    placeholder="Tell us how we can help..."
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    className={`${inputClass(errors.message)} resize-none`}
                  />
                </Field>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full font-semibold text-sm tracking-wider transition-all hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: "#064E3B", color: "#FCF1D0" }}
                >
                  SEND MESSAGE
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <div>
            <h2
              className="text-2xl font-semibold mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#064E3B" }}
            >
              Find Us
            </h2>

            <div className="space-y-5 mb-8">
              {CONTACT_INFO.map((c) => (
                <div key={c.label} className="flex items-start gap-4 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <span className="text-2xl mt-0.5">{c.icon}</span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#F5DF92" }}>
                      {c.label}
                    </p>
                    {c.value.split("\n").map((line, i) => (
                      <p key={i} className="text-sm text-gray-600">{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div
              className="rounded-2xl overflow-hidden border border-gray-100 h-64 flex items-center justify-center"
              style={{ backgroundcolor: "#FCF1D0" }}
            >
              <div className="text-center">
                <span className="text-4xl block mb-2">📍</span>
                <p className="text-sm font-medium" style={{ color: "#064E3B" }}>Dikshi Jewellery Store</p>
                <p className="max-w-xs mx-auto text-xs text-gray-500">{STORE_ADDRESS}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE_ADDRESS)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-xs px-4 py-2 rounded-full transition-all hover:opacity-80"
                  style={{ backgroundColor: "#064E3B", color: "#FCF1D0" }}
                >
                  Open in Maps
                </a>
              </div>
            </div>

            {/* Social */}
            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "#F5DF92" }}>
                Follow Us
              </p>
              <div className="flex gap-3">
                {["Facebook", "Instagram", "Pinterest", "YouTube"].map((s) => (
                  <a
                    key={s}
                    href="#"
                    aria-label={s}
                    className="px-4 py-2 rounded-full text-xs font-medium border transition-all hover:bg-[#064E3B] hover:text-[#FCF1D0] hover:border-[#064E3B]"
                    style={{ borderColor: "#e5e7eb", color: "#064E3B" }}
                  >
                    {s}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#064E3B" }}>
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function inputClass(error) {
  return `w-full px-4 py-3 rounded-lg border text-sm outline-none transition-colors ${
    error ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-[#F5DF92]"
  }`;
}
