import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "motion/react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { products } from "../data/products";

const navLinks = [
  { label: "Home", to: "/" },
  {
    label: "Jewellery",
    to: "/jewellery",
    dropdown: [
      { label: "All Jewellery", to: "/jewellery" },
      { label: "Gold", to: "/jewellery/gold" },
      { label: "Diamond", to: "/jewellery/diamond" },
      { label: "Silver", to: "/jewellery/silver" },
      { label: "Platinum", to: "/jewellery/platinum" },
      { label: "Bridal", to: "/jewellery/bridal" },
    ],
  },
  {
    label: "Shop",
    to: "/shop/gold",
    dropdown: [
      { label: "Shop Gold", to: "/shop/gold" },
      { label: "Shop Diamond", to: "/shop/diamond" },
      { label: "Shop Silver", to: "/shop/silver" },
      { label: "Shop Platinum", to: "/shop/platinum" },
    ],
  },
  { label: "Today's Gold Rate", to: "/gold-rate" },
  { label: "Services", to: "/services" },
  { label: "Contact", to: "/contact" },
];

// ── Inline Dock for Navbar ────────────────────────────────────
const SPRING = { mass: 0.1, stiffness: 150, damping: 12 };
const BASE = 36;
const MAG = 52;
const DIST = 100;

function NavDockItem({ icon, label, badge, onClick, mouseX }) {
  const ref = useRef(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? { x: 0, width: BASE };
    return val - rect.x - BASE / 2;
  });

  const targetSize = useTransform(mouseDistance, [-DIST, 0, DIST], [BASE, MAG, BASE]);
  const size = useSpring(targetSize, SPRING);

  return (
    <div className="relative flex flex-col items-center">
      {/* Tooltip */}
      <AnimatePresence>
        <motion.div
          style={{
            opacity: useTransform(isHovered, [0, 1], [0, 1]),
            y: useTransform(isHovered, [0, 1], [4, 0]),
            backgroundColor: "#F5DF92",
            color: "#064E3B",
            transform: "translateX(-50%)",
          }}
          className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-md text-xs font-semibold pointer-events-none"
        >
          {label}
        </motion.div>
      </AnimatePresence>

      <motion.button
        ref={ref}
        onHoverStart={() => isHovered.set(1)}
        onHoverEnd={() => isHovered.set(0)}
        onClick={onClick}
        className="relative flex items-center justify-center rounded-full border-2 transition-colors"
        style={{
          width: size,
          height: size,
          backgroundColor: "rgba(255,255,255,0.07)",
          borderColor: "rgba(245,223,146,0.35)",
        }}
        aria-label={label}
      >
        {icon}
        {badge > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold"
            style={{ backgroundColor: "#F5DF92", color: "#064E3B" }}
          >
            {badge}
          </span>
        )}
      </motion.button>
    </div>
  );
}

function NavDock({ onSearchClick, cartCount, wishlistCount }) {
  const navigate = useNavigate();
  const mouseX = useMotionValue(Infinity);

  const dockItems = [
    {
      label: "Search",
      badge: 0,
      onClick: onSearchClick,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#F5DF92" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      label: "Wishlist",
      badge: wishlistCount,
      onClick: () => navigate("/wishlist"),
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#F5DF92" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      label: "Cart",
      badge: cartCount,
      onClick: () => navigate("/cart"),
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#F5DF92" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      label: "Account",
      badge: 0,
      onClick: () => navigate("/login"),
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#F5DF92" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  return (
    <div
      className="hidden sm:flex items-end gap-2 px-3 pb-1 pt-2 rounded-2xl"
      style={{
        backgroundColor: "rgba(6,78,59,0.6)",
        border: "1px solid rgba(245,223,146,0.2)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      {dockItems.map((item) => (
        <NavDockItem
          key={item.label}
          icon={item.icon}
          label={item.label}
          badge={item.badge}
          onClick={item.onClick}
          mouseX={mouseX}
        />
      ))}
    </div>
  );
}
// ─────────────────────────────────────────────────────────────

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const q = searchQuery.toLowerCase();
      const results = products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.metal.toLowerCase().includes(q) ||
            p.tags?.some((t) => t.toLowerCase().includes(q))
        )
        .slice(0, 6);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const handleSearchResultClick = (id) => {
    navigate(`/product/${id}`);
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "shadow-lg" : ""}`}
      style={{ backgroundColor: "#064E3B" }}
    >
      {/* Top announcement bar */}
      <div
        className="text-center py-2 text-sm tracking-widest font-semibold"
        style={{ backgroundColor: "#F5DF92", color: "#064E3B" }}
      >
        FREE SHIPPING ON ORDERS ABOVE ₹5,000 &nbsp;&nbsp;✦&nbsp;&nbsp; CERTIFIED JEWELLERY &nbsp;&nbsp;✦&nbsp;&nbsp; BIS HALLMARKED
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link to="/" className="flex flex-col items-start shrink-0">
            <span
              className="text-xl lg:text-2xl font-bold tracking-wider leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#FCF1D0" }}
            >
              DIKSHI
            </span>
            <span className="gold-shimmer text-xs tracking-[0.3em] font-light" style={{ color: "#D79B01" }}>
              JEWELLERY
            </span>
          </Link>

          {/* Desktop Nav links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative group"
                onMouseEnter={() => link.dropdown && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm font-medium tracking-wide transition-colors duration-200 flex items-center gap-1 ${
                      isActive ? "text-[#F5DF92]" : "text-[#FCF1D0] hover:text-[#F5DF92]"
                    }`
                  }
                >
                  {link.label}
                  {link.dropdown && (
                    <svg className="w-3 h-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </NavLink>

                {link.dropdown && activeDropdown === link.label && (
                  <div
                    className="absolute top-full left-0 w-52 py-2 rounded-b-lg shadow-2xl z-50"
                    style={{ backgroundColor: "#064E3B", border: "1px solid rgba(245,223,146,0.3)" }}
                  >
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="block px-4 py-2 text-sm transition-colors duration-150"
                        style={{ color: "#FCF1D0" }}
                        onMouseEnter={(e) => (e.target.style.color = "#F5DF92")}
                        onMouseLeave={(e) => (e.target.style.color = "#FCF1D0")}
                        onClick={() => setActiveDropdown(null)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right side — Dock + search dropdown + mobile hamburger */}
          <div className="flex items-center gap-3">

            {/* Search dropdown (shared for both mobile & desktop) */}
            <div ref={searchRef} className="relative">
              {searchOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-80 rounded-xl shadow-2xl overflow-hidden z-50"
                  style={{ backgroundColor: "#064E3B", border: "1px solid rgba(245,223,146,0.4)" }}
                >
                  <form
                    onSubmit={handleSearchSubmit}
                    className="flex items-center px-3 py-2 border-b"
                    style={{ borderColor: "rgba(245,223,146,0.3)" }}
                  >
                    <svg className="w-4 h-4 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="#F5DF92">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search jewellery..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent text-sm outline-none"
                      style={{ color: "#FCF1D0" }}
                    />
                    {searchQuery && (
                      <button type="button" onClick={() => setSearchQuery("")} style={{ color: "#F5DF92" }}>✕</button>
                    )}
                  </form>
                  {searchResults.length > 0 && (
                    <div>
                      {searchResults.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => handleSearchResultClick(p.id)}
                          className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-white/5 transition-colors"
                        >
                          <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded" />
                          <div>
                            <p className="text-sm font-medium" style={{ color: "#FCF1D0" }}>{p.name}</p>
                            <p className="text-xs" style={{ color: "#F5DF92" }}>₹{p.price.toLocaleString()}</p>
                          </div>
                        </button>
                      ))}
                      <button
                        onClick={handleSearchSubmit}
                        className="w-full text-center py-2 text-xs tracking-wider hover:bg-white/5"
                        style={{ color: "#F5DF92" }}
                      >
                        VIEW ALL RESULTS →
                      </button>
                    </div>
                  )}
                  {searchQuery.length > 1 && searchResults.length === 0 && (
                    <p className="text-center py-4 text-sm" style={{ color: "#FCF1D0" }}>No results found</p>
                  )}
                </div>
              )}
            </div>

            {/* ── Dock replaces individual icon buttons ── */}
            <NavDock
              onSearchClick={() => setSearchOpen((o) => !o)}
              cartCount={cartCount}
              wishlistCount={wishlistCount}
            />

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-full hover:bg-white/10 transition-colors"
              style={{ color: "#FCF1D0" }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}`}
        style={{ backgroundColor: "#064E3B", borderTop: "1px solid rgba(245,223,146,0.2)" }}
      >
        <nav className="px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <div key={link.label}>
              <NavLink
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive ? "text-[#F5DF92] bg-white/5" : "text-[#FCF1D0] hover:text-[#F5DF92] hover:bg-white/5"
                  }`
                }
                onClick={() => !link.dropdown && setMobileOpen(false)}
              >
                {link.label}
              </NavLink>
              {link.dropdown && (
                <div className="ml-4 mt-1 space-y-1">
                  {link.dropdown.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className="block px-3 py-2 text-xs rounded-lg transition-colors"
                      style={{ color: "rgba(252,241,208,0.75)" }}
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
          {/* Mobile quick links */}
          <div className="pt-3 border-t flex gap-3" style={{ borderColor: "rgba(245,223,146,0.2)" }}>
            {[
              { label: "Wishlist", to: "/wishlist", count: wishlistCount },
              { label: "Cart", to: "/cart", count: cartCount },
              { label: "Login", to: "/login", count: 0 },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="relative flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg"
                style={{ color: "#FCF1D0" }}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
                {item.count > 0 && (
                  <span
                    className="w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold"
                    style={{ backgroundColor: "#F5DF92", color: "#064E3B" }}
                  >
                    {item.count}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
