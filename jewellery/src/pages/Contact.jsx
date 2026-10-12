import { useState } from "react";
import contactBackground from "../assets/contact-background.png";

const STORE_ADDRESS =
  "No.80 & 81, Velachery Main Rd, Devi Karumariamman Nagar, Pallikaranai, Chennai, Tamil Nadu 600100, India";

const CONTACT_INFO = [
  { icon: "📍", label: "Visit Us", value: STORE_ADDRESS },
  { icon: "📞", label: "Call Us", value: "+91 78945 67880\n+91 99934 56689" },
  { icon: "✉️", label: "Email Us", value: "hello@dikshijewellery.com\nsupport@dikshijewellery.com" },
  { icon: "🕐", label: "Business Hours", value: "Mon–Sat: 10:00 AM – 8:00 PM\nSunday: 11:00 AM – 6:00 PM" },
];

const MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE_ADDRESS)}`;
const CONTACT_ACTIONS = [
  { label: "Visit Us", icon: "📍", href: MAP_URL },
  { label: "Call Us", icon: "📞", href: "tel:+917894567880" },
  { label: "Email Us", icon: "✉️", href: "mailto:hello@dikshijewellery.com" },
  { label: "Book Appointment", icon: "✦", href: "#contact-form" },
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
    <div
      className="min-h-screen bg-cover bg-center bg-fixed px-3 py-6 md:px-6 lg:px-8"
      style={{
        backgroundImage: `linear-gradient(rgba(5,30,25,0.16), rgba(5,30,25,0.24)), url(${contactBackground})`,
        backgroundPosition: "center 58%",
      }}
    >
      <div className="mx-auto max-w-[1180px] overflow-hidden rounded-[26px] border border-[#d7c8a4]/50 shadow-[0_30px_80px_rgba(11,24,22,0.18)]">
        <header className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[#0b3f37]/20" />

          <div className="relative z-10 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-[#f7e8b5]">
                <div className="flex items-center justify-center rounded-full border border-[#E8C96C] bg-[#0b1f1b]/70 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#E8C96C]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  DIKSHI
                </div>
              </div>

              <nav className="hidden items-center gap-6 text-[11px] font-medium text-[#f3f0e7] lg:flex">
                <a href="#" className="opacity-90 hover:opacity-100">Home</a>
                <a href="#" className="opacity-90 hover:opacity-100">Jewellery</a>
                <a href="#" className="opacity-90 hover:opacity-100">Shop</a>
                <a href="#" className="opacity-90 hover:opacity-100">Services</a>
                <a href="#" className="opacity-90 hover:opacity-100">Contact</a>
              </nav>

              <div className="flex items-center gap-3 text-xs text-[#f7f2e9]">
                <button type="button" className="rounded-full border border-[#E8C96C]/50 bg-[#0f1b18]/70 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-[#E8C96C]">
                  Search
                </button>
                <button type="button" className="rounded-full border border-[#E8C96C]/50 bg-[#0f1b18]/70 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-[#E8C96C]">
                  Cart
                </button>
              </div>
            </div>
          </div>

          <div className="relative z-10 px-4 pb-8 pt-4 sm:px-6 lg:px-8 lg:pb-10">
            <div className="relative flex justify-center gap-6 pt-4">
              <div className="max-w-[540px] text-center text-[#f7f2e8]">
                <h1 className="mt-3 text-4xl font-semibold leading-none md:text-6xl" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  Contact Us
                </h1>
                <p className="mx-auto mt-3 max-w-[420px] text-sm text-[#f3ecdf]/90 md:text-[15px]">
                  Your perfect jewelry experience begins here. Let&apos;s connect.
                </p>

                <div className="mt-6 flex items-center justify-center gap-3">
                  {CONTACT_ACTIONS.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      aria-label={item.label}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E8C96C]/50 bg-[#0f1b18]/60 text-lg text-[#E8C96C] shadow-sm backdrop-blur-sm transition hover:scale-105 hover:bg-[#0f1b18]/80"
                    >
                      <span>{item.icon}</span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 rounded-full border border-[#E8C96C]/50 bg-[#0c1714]/80 px-4 py-2 text-right text-[#E8C96C] shadow-lg sm:block">
                <div className="text-[10px] uppercase tracking-[0.3em]">Save</div>
                <div className="text-2xl font-semibold">61%</div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-6 px-4 pb-5 pt-5 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:pb-8 lg:pt-6">
          <section className="rounded-[24px] bg-white/5 p-5 shadow-[0_10px_25px_rgba(16,29,25,0.04)] ring-1 ring-[#e5d7ba]/30 backdrop-blur-sm sm:p-6 lg:p-7">
            <h2 className="mb-6 text-3xl font-semibold text-[#F2DEAA]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Send Us a Message
            </h2>

            {submitted ? (
              <div className="rounded-[20px] border border-[#e3d3a1]/50 bg-[#0b3f37]/30 p-8 text-center backdrop-blur-sm">
                <div className="mb-4 text-5xl text-[#d7a933]">✓</div>
                <h3 className="mb-2 text-2xl font-semibold text-[#F2DEAA]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  Message Received!
                </h3>
                <p className="text-sm text-white/80">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
                  }}
                  className="mt-6 rounded-full px-6 py-3 text-sm font-semibold text-[#f8f1de] transition hover:opacity-90"
                  style={{ backgroundColor: "#0b3f37" }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form id="contact-form" onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
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

                <div className="grid gap-5 sm:grid-cols-2">
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
                    <SubjectSelect
                      value={form.subject}
                      onChange={(subject) => update("subject", subject)}
                    />
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
                  className="w-full rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#f7f2e8] transition hover:opacity-90"
                  style={{ backgroundColor: "#0b3f37" }}
                >
                  Send Message
                </button>
              </form>
            )}
          </section>

          <aside className="rounded-[24px] bg-white/5 p-5 shadow-[0_10px_25px_rgba(16,29,25,0.04)] ring-1 ring-[#e5d7ba]/30 backdrop-blur-sm sm:p-6 lg:p-7">
            <h2 className="mb-6 text-3xl font-semibold text-[#F2DEAA]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Our Location
            </h2>

            <div className="space-y-4">
              {CONTACT_INFO.map((item) => (
                <div key={item.label} className="flex items-start gap-3 rounded-[16px] border border-[#e5d7ba]/25 bg-white/5 p-3.5">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E8C96C]/30 bg-[#0b3f37]/70 text-sm text-[#E8C96C]">
                    {item.icon}
                  </div>
                  <div>
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d7a933]">{item.label}</p>
                    {item.value.split("\n").map((line, index) => (
                      <p key={index} className="text-sm leading-6 text-[#f4eee0]/90">{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F2DEAA]">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-300">{error}</p>}
    </div>
  );
}

const SUBJECT_OPTIONS = [
  "Product Enquiry",
  "Customisation",
  "Repair Service",
  "Gold Exchange",
  "Other",
];

function SubjectSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const selectedIndex = SUBJECT_OPTIONS.indexOf(value);

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      const direction = event.key === "ArrowDown" ? 1 : -1;
      const currentIndex = activeIndex >= 0 ? activeIndex : selectedIndex;
      setActiveIndex((currentIndex + direction + SUBJECT_OPTIONS.length) % SUBJECT_OPTIONS.length);
      return;
    }

    if (event.key === "Enter" && open && activeIndex >= 0) {
      event.preventDefault();
      onChange(SUBJECT_OPTIONS[activeIndex]);
      setOpen(false);
    }
  };

  return (
    <div
      className="relative"
      onKeyDown={handleKeyDown}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select subject"
        onClick={() => setOpen((current) => !current)}
        className={`${inputClass()} flex items-center justify-between text-left`}
      >
        <span className={value ? "text-white" : "text-white/50"}>{value || "Select subject"}</span>
        <svg className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.22 7.22a.75.75 0 011.06 0L10 10.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 8.28a.75.75 0 010-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Subject options"
          className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-white/20 bg-[#0b3f37]/20 py-1 shadow-lg backdrop-blur-md"
        >
          {SUBJECT_OPTIONS.map((option, index) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={value === option}
              onClick={() => {
                onChange(option);
                setOpen(false);
                setActiveIndex(index);
              }}
              className={`block w-full px-4 py-2.5 text-left text-sm text-white transition-colors ${
                activeIndex === index ? "bg-white/20" : "hover:bg-white/10"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function inputClass(error) {
  return `w-full rounded-xl border bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/50 outline-none transition ${
    error ? "border-red-400 focus:border-red-300" : "border-white/20 focus:border-[#E8C96C]"
  }`;
}
