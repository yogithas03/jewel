import { Link } from "react-router-dom";

const milestones = [
  { year: "1992", title: "Founded", desc: "Dikshi Jewellery opens its first store in Mumbai's legendary gold market." },
  { year: "2001", title: "BIS Certification", desc: "Became one of the first jewellers in the region to receive BIS hallmarking certification." },
  { year: "2010", title: "Bridal Excellence", desc: "Launched our acclaimed Bridal Atelier — crafting personalised bridal sets." },
  { year: "2018", title: "Diamond Studio", desc: "Opened our dedicated diamond jewellery studio, featuring GIA-certified stones." },
  { year: "2024", title: "Online Store", desc: "Bringing Dikshi's legacy online — luxury delivered to your doorstep." },
];

const values = [
  { icon: "✦", title: "Craftsmanship", desc: "Every piece is hand-finished by master craftsmen with decades of experience." },
  { icon: "◈", title: "Purity", desc: "All our jewellery is BIS hallmarked and GIA/IGI certified — no compromises." },
  { icon: "♛", title: "Elegance", desc: "We believe jewellery should feel as extraordinary as it looks." },
  { icon: "◎", title: "Trust", desc: "Transparent pricing, certified quality, and a 30-year reputation." },
];

export default function About() {
  return (
    <div className="pt-20 lg:pt-24">
      {/* Hero */}
      <div className="relative min-h-[60vh] flex items-center overflow-hidden" style={{ backgroundColor: "#064E3B" }}>
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=1600&q=80"
            alt="Dikshi Jewellery craftsmanship"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#064E3B] via-[#064E3B]/70 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <p className="text-xs tracking-[0.35em] mb-4" style={{ color: "#E8C96C" }}>OUR STORY</p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-semibold mb-6 max-w-2xl leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#F2DEAA" }}
          >
            The Art of Timeless Jewellery
          </h1>
          <p className="text-base max-w-xl leading-relaxed" style={{ color: "rgba(242, 222, 170,0.75)" }}>
            For over three decades, Dikshi Jewellery has crafted pieces that transcend trends and become heirlooms — passed down with love, worn with pride.
          </p>
        </div>
      </div>

      {/* Our Story */}
      <section id="story" className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8" style={{ backgroundColor: "#E8C96C" }} />
              <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "#E8C96C" }}>Our Story</span>
            </div>
            <h2
              className="text-3xl sm:text-4xl font-semibold mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#064E3B" }}
            >
              Born from a Passion for Beauty
            </h2>
            <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
              <p>
                Dikshi Jewellery was founded in 1992 by the Sharma family in the heart of Mumbai's historic jewellery district. What began as a small family workshop has grown into a trusted name synonymous with quality, elegance and craftsmanship.
              </p>
              <p>
                Our founder, Mr. Arun Sharma, believed that jewellery is not just adornment — it is emotion, memory, and legacy captured in gold. That philosophy continues to guide every piece we create.
              </p>
              <p>
                Today, Dikshi Jewellery serves thousands of customers across India, crafting everything from everyday wear to grand bridal collections, always with the same commitment to excellence.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80"
                alt="Dikshi Jewellery store"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="absolute -bottom-6 -left-6 rounded-2xl p-6 shadow-2xl max-w-xs"
              style={{ backgroundColor: "#064E3B" }}
            >
              <p className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#E8C96C" }}>30+</p>
              <p className="text-sm mt-1" style={{ color: "rgba(242, 222, 170,0.85)" }}>Years of trusted craftsmanship</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 sm:px-6" style={{ backgroundcolor: "#F2DEAA" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-8" style={{ backgroundColor: "#E8C96C" }} />
              <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "#E8C96C" }}>What We Stand For</span>
              <div className="h-px w-8" style={{ backgroundColor: "#E8C96C" }} />
            </div>
            <h2
              className="text-3xl sm:text-4xl font-semibold"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#064E3B" }}
            >
              Our Core Values
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v) => (
              <div key={v.title} className="text-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-5"
                  style={{ backgroundColor: "#064E3B", color: "#E8C96C" }}
                >
                  {v.icon}
                </div>
                <h3
                  className="text-lg font-semibold mb-3"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#064E3B" }}
                >
                  {v.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-8" style={{ backgroundColor: "#E8C96C" }} />
              <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "#E8C96C" }}>Our Journey</span>
              <div className="h-px w-8" style={{ backgroundColor: "#E8C96C" }} />
            </div>
            <h2
              className="text-3xl sm:text-4xl font-semibold"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#064E3B" }}
            >
              Milestones
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-12 top-0 bottom-0 w-px" style={{ backgroundColor: "rgba(232, 201, 108,0.3)" }} />
            <div className="space-y-8">
              {milestones.map((m) => (
                <div key={m.year} className="flex gap-6 items-start">
                  <div
                    className="w-24 shrink-0 text-right relative"
                  >
                    <span
                      className="text-sm font-bold block"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#E8C96C" }}
                    >
                      {m.year}
                    </span>
                    <div
                      className="absolute right-[-22px] top-2 w-3 h-3 rounded-full border-2 bg-white"
                      style={{ borderColor: "#E8C96C" }}
                    />
                  </div>
                  <div className="flex-1 pb-8">
                    <h4
                      className="text-base font-semibold mb-1"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#064E3B" }}
                    >
                      {m.title}
                    </h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6" style={{ backgroundColor: "#064E3B" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h3
            className="text-3xl sm:text-4xl font-semibold mb-5"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#F2DEAA" }}
          >
            Your Story Deserves Our Finest
          </h3>
          <p className="text-sm mb-8 max-w-xl mx-auto" style={{ color: "rgba(242, 222, 170,0.70)" }}>
            Whether you're celebrating a milestone or simply treating yourself, we're here to help you find — or create — the perfect piece.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/jewellery"
              className="px-8 py-4 rounded-full font-semibold text-sm tracking-wider transition-all hover:scale-105"
              style={{ backgroundColor: "#E8C96C", color: "#064E3B" }}
            >
              SHOP NOW
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 rounded-full font-semibold text-sm tracking-wider border transition-all hover:bg-white/10"
              style={{ borderColor: "rgba(242, 222, 170,0.45)", color: "#F2DEAA" }}
            >
              CONTACT US
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
