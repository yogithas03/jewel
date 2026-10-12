import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import TextLoop from "../components/TextLoop";
import { categories } from "../data/categories";
import { getBestSellers, getNewArrivals, getTrendingProducts, getBridalProducts } from "../data/products";
import bridalCard from "../assets/bridalcard.jpg";

const SectionHeader = ({ eyebrow, title, subtitle, center = false }) => (
  <div className={`mb-10 ${center ? "text-center" : ""}`}>
    {eyebrow && (
      <div className={`flex items-center gap-3 mb-3 ${center ? "justify-center" : ""}`}>
        <div className="h-px w-8" style={{ backgroundColor: "#E8C96C" }} />
        <span className="text-xs tracking-[0.3em] font-medium uppercase" style={{ color: "#E8C96C" }}>
          {eyebrow}
        </span>
        <div className="h-px w-8" style={{ backgroundColor: "#E8C96C" }} />
      </div>
    )}
    <h2
      className="text-3xl sm:text-4xl font-semibold"
      style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#064E3B" }}
    >
      {title}
    </h2>
    {subtitle && (
      <p className="mt-3 text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">{subtitle}</p>
    )}
  </div>
);

export default function Home() {
  const bestSellers = getBestSellers().slice(0, 4);
  const newArrivals = getNewArrivals().slice(0, 4);
  const trending = getTrendingProducts().slice(0, 4);
  const bridal = getBridalProducts().slice(0, 4);

  return (
    <div>
      <Hero />

      {/* ── Marquee strip — fully outside Hero, no z-index conflict ── */}
      <div
        style={{
          backgroundColor: "#E8C96C",
          overflow: "hidden",
          position: "relative",
          zIndex: 1,
        }}
      >
        <TextLoop
          text="Gold Jewellery ✦ Diamond Rings ✦ Silver Collections ✦ Platinum Bands ✦ Bridal Sets ✦ BIS Hallmarked ✦ Free Shipping"
          shape="line"
          speed={90}
          direction="left-to-right"
          separator="✦"
          curviness={0}
          fontSize={12}
          fontWeight={700}
          letterSpacing={3}
          uppercase
          color="#064E3B"
          ribbon={false}
          ribbonWidth={0}
          pauseOnHover
          compact
          compactHeight={40}
        />
      </div>

      {/* ── Categories ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Explore"
          title="Shop by Category"
          subtitle="From timeless gold to sparkling diamonds — discover jewellery crafted for every moment."
          center
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {categories.slice(0, 6).map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            to="/jewellery"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold tracking-wider border transition-all hover:bg-[#064E3B] hover:text-[#F2DEAA]"
            style={{ borderColor: "#064E3B", color: "#064E3B" }}
          >
            VIEW ALL CATEGORIES
          </Link>
        </div>
      </section>

      {/* ── Gold Rate Banner ── */}
      <section style={{ backgroundColor: "#064E3B" }} className="py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs tracking-widest mb-1" style={{ color: "#E8C96C" }}>LIVE RATES</p>
            <h3
              className="text-2xl font-semibold"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#F2DEAA" }}
            >
              Today's Gold Rate
            </h3>
          </div>
          <div className="flex flex-wrap gap-8">
            {[
              { label: "24K Gold", rate: "₹7,250/g" },
              { label: "22K Gold", rate: "₹6,645/g" },
              { label: "18K Gold", rate: "₹5,437/g" },
            ].map((r) => (
              <div key={r.label} className="text-center">
                <p className="text-xs tracking-wider mb-1" style={{ color: "rgba(242, 222, 170,0.65)" }}>{r.label}</p>
                <p className="text-xl font-bold" style={{ color: "#E8C96C" }}>{r.rate}</p>
              </div>
            ))}
          </div>
          <Link
            to="/gold-rate"
            className="shrink-0 px-6 py-3 rounded-full text-sm font-semibold tracking-wider transition-all hover:opacity-90"
            style={{ backgroundColor: "#E8C96C", color: "#064E3B" }}
          >
            CHECK FULL RATES
          </Link>
        </div>
      </section>

      {/* ── Best Sellers ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <SectionHeader eyebrow="Top Picks" title="Best Sellers" />
          <Link to="/shop/gold" className="text-sm font-medium underline" style={{ color: "#E8C96C" }}>
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ── Premium Feature Banner ── */}
      <section className="py-16 px-4 sm:px-6" style={{ backgroundColor: "#F2DEAA" }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8" style={{ backgroundColor: "#E8C96C" }} />
              <span className="text-xs tracking-[0.3em] font-medium uppercase" style={{ color: "#E8C96C" }}>
                Bridal 2024
              </span>
            </div>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-5 leading-snug"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#064E3B" }}
            >
              Your Dream <br /> Bridal Collection
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-md">
              Curated bridal jewellery sets for the modern Indian bride. From grand Kundan necklaces to lightweight daily-wear pieces, every design celebrates your unique story.
            </p>
            <Link
              to="/jewellery/bridal"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm tracking-wider transition-all hover:scale-105"
              style={{ backgroundColor: "#064E3B", color: "#F2DEAA" }}
            >
              EXPLORE BRIDAL
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden">
              <img
                src={bridalCard}
                alt="Bridal jewellery collection"
                className="w-full h-full object-cover object-[center_25%]"
              />
            </div>
            <div
              className="absolute -bottom-5 -left-5 bg-white rounded-2xl p-4 shadow-xl"
            >
              <p className="text-xs text-gray-500 mb-0.5">Bridal Collection</p>
              <p className="font-semibold text-sm" style={{ color: "#064E3B" }}>Starting from ₹85,000</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── New Arrivals ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <SectionHeader eyebrow="Just In" title="New Arrivals" />
          <Link to="/shop/gold" className="text-sm font-medium underline" style={{ color: "#E8C96C" }}>
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ── Services Strip ── */}
      <section className="py-12 px-4 sm:px-6 border-y border-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { icon: "✦", label: "BIS Hallmarked", desc: "100% certified purity" },
            { icon: "⚒", label: "Master Crafted", desc: "30+ years of expertise" },
            { icon: "↩", label: "Easy Returns", desc: "15-day return policy" },
            { icon: "✧", label: "Free Cleaning", desc: "Annual cleaning service" },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <span className="text-xl mt-0.5" style={{ color: "#E8C96C" }}>{item.icon}</span>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#064E3B" }}>{item.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trending ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <SectionHeader eyebrow="What's Hot" title="Trending Now" />
          <Link to="/shop/gold" className="text-sm font-medium underline" style={{ color: "#E8C96C" }}>
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trending.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ── About teaser ── */}
      <section style={{ backgroundColor: "#064E3B" }} className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-3xl mb-6" style={{ color: "#E8C96C" }}>✦</div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#F2DEAA" }}
          >
            The Art of Timeless Jewellery
          </h2>
          <p className="text-base leading-relaxed max-w-2xl mx-auto mb-10" style={{ color: "rgba(242, 222, 170,0.75)" }}>
            Dikshi Jewellery was born from a passion for craft and an eye for beauty. Since 1992, we have been creating pieces that transcend trends and become heirlooms.
          </p>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold tracking-wider border transition-all hover:bg-white/10"
            style={{ borderColor: "rgba(232, 201, 108,0.6)", color: "#E8C96C" }}
          >
            OUR STORY →
          </Link>
        </div>
      </section>
    </div>
  );
}
