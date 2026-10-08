import { Link } from "react-router-dom";
import { useState } from "react";

const footerLinks = {
  company: [
    { label: "About Us", to: "/about" },
    { label: "Our Story", to: "/about#story" },
    { label: "Services", to: "/services" },
    { label: "Contact Us", to: "/contact" },
  ],
  shop: [
    { label: "Gold Jewellery", to: "/shop/gold" },
    { label: "Diamond Jewellery", to: "/shop/diamond" },
    { label: "Silver Jewellery", to: "/shop/silver" },
    { label: "Platinum Jewellery", to: "/shop/platinum" },
    { label: "Bridal Collection", to: "/jewellery/bridal" },
  ],
  customer: [
    { label: "Shipping Policy", to: "/shipping" },
    { label: "Returns & Exchanges", to: "/returns" },
    { label: "Jewellery Care", to: "/care" },
    { label: "FAQs", to: "/faqs" },
    { label: "Today's Gold Rate", to: "/gold-rate" },
  ],
  legal: [
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms & Conditions", to: "/terms" },
    { label: "Refund Policy", to: "/refund" },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.includes("@")) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer style={{ backgroundColor: "#064E3B" }}>
      {/* Newsletter strip */}
      <div
        className="py-10 px-4"
        style={{ backgroundColor: "rgba(245,223,146,0.1)", borderTop: "1px solid rgba(245,223,146,0.2)", borderBottom: "1px solid rgba(245,223,146,0.2)" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-semibold" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#FCF1D0" }}>
              Stay in the Loop
            </h3>
            <p className="text-sm mt-1" style={{ color: "rgba(252,241,208,0.65)" }}>
              Get exclusive offers, new arrivals and jewellery insights.
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="flex w-full max-w-md gap-0">
            {subscribed ? (
              <p className="text-sm py-3" style={{ color: "#F5DF92" }}>Thank you for subscribing! ✓</p>
            ) : (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 px-4 py-3 text-sm outline-none rounded-l-lg"
                  style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "#FCF1D0", border: "1px solid rgba(245,223,146,0.3)" }}
                />
                <button
                  type="submit"
                  className="px-6 py-3 text-sm font-semibold tracking-wider rounded-r-lg transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#F5DF92", color: "#064E3B" }}
                >
                  SUBSCRIBE
                </button>
              </>
            )}
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-14 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <div>
                <span
                  className="text-2xl font-bold tracking-wider block"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#FCF1D0" }}
                >
                  DIKSHI
                </span>
                <span className="gold-shimmer text-xs tracking-[0.35em] font-light" style={{ color: "#D79B01" }}>
                  JEWELLERY
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs mt-3" style={{ color: "rgba(252,241,208,0.65)" }}>
              Crafting timeless jewellery since 1992. Every piece tells a story of elegance, craftsmanship, and enduring beauty.
            </p>
            <div className="flex gap-3 mt-6">
              {[
                { label: "Facebook", icon: "f" },
                { label: "Instagram", icon: "ig" },
                { label: "Pinterest", icon: "p" },
                { label: "YouTube", icon: "yt" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all hover:scale-110"
                  style={{ border: "1px solid rgba(245,223,146,0.4)", color: "#F5DF92" }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
            {/* Trust badges */}
            <div className="mt-6 flex flex-wrap gap-3">
              {["BIS Hallmarked", "GIA Certified", "IGI Certified"].map((b) => (
                <span
                  key={b}
                  className="text-xs px-3 py-1 rounded-full"
                  style={{ border: "1px solid rgba(245,223,146,0.4)", color: "#F5DF92" }}
                >
                  ✓ {b}
                </span>
              ))}
            </div>
          </div>

          {/* Links columns */}
          {[
            { heading: "Company", links: footerLinks.company },
            { heading: "Shop", links: footerLinks.shop },
            { heading: "Customer Service", links: footerLinks.customer },
          ].map((col) => (
            <div key={col.heading}>
              <h4
                className="text-xs font-semibold tracking-widest mb-5 uppercase"
                style={{ color: "#F5DF92" }}
              >
                {col.heading}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm transition-colors hover:text-[#F5DF92]"
                      style={{ color: "rgba(252,241,208,0.70)" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact info */}
        <div
          className="mt-12 pt-8 border-t grid grid-cols-1 sm:grid-cols-3 gap-6"
          style={{ borderColor: "rgba(245,223,146,0.2)" }}
        >
          {[
            { icon: "📍", label: "No.80 & 81, Velachery Main Rd, Devi Karumariamman Nagar, Pallikaranai, Chennai, Tamil Nadu 600100, India" },
            { icon: "📞", label: "+91 78945 67880" },
            { icon: "✉️", label: "hello@dikshijewellery.com" },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <span className="text-base mt-0.5">{item.icon}</span>
              <p className="text-sm" style={{ color: "rgba(252,241,208,0.70)" }}>{item.label}</p>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: "rgba(245,223,146,0.15)" }}
        >
          <p className="text-xs" style={{ color: "rgba(252,241,208,0.45)" }}>
            © {new Date().getFullYear()} Dikshi Jewellery. All rights reserved.
          </p>
          <div className="flex gap-4">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-xs hover:text-[#F5DF92] transition-colors"
                style={{ color: "rgba(252,241,208,0.45)" }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
