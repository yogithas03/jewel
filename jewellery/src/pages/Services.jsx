import { Link } from "react-router-dom";
import { services } from "../data/services";

export default function Services() {
  return (
    <div className="pt-20 lg:pt-24">
      {/* Hero */}
      <div className="relative py-16 px-4 text-center overflow-hidden" style={{ backgroundColor: "#064E3B" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "repeating-linear-gradient(45deg, #F5DF92, #F5DF92 1px, transparent 1px, transparent 10px)" }} />
        <p className="text-xs tracking-[0.35em] mb-3 relative z-10" style={{ color: "#D79B01" }}>DIKSHI JEWELLERY</p>
        <h1
          className="text-3xl sm:text-5xl font-semibold mb-3 relative z-10"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#FCF1D0" }}
        >
          Our Services
        </h1>
        <p className="text-sm max-w-xl mx-auto relative z-10" style={{ color: "rgba(252,241,208,0.70)" }}>
          Beyond beautiful jewellery — we offer a full range of services to help you create, care for and celebrate your pieces.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-lg transition-all duration-300 group"
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 transition-transform duration-300 group-hover:scale-110"
                style={{
                  backgroundColor: i % 2 === 0 ? "#064E3B" : "#064E3B",
                  color: i % 2 === 0 ? "#F5DF92" : "#F5DF92",
                }}
              >
                {service.icon}
              </div>

              <h3
                className="text-xl font-semibold mb-2"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#064E3B" }}
              >
                {service.title}
              </h3>
              <p className="text-xs font-medium mb-3 tracking-wider uppercase" style={{ color: "#F5DF92" }}>
                {service.shortDesc}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                {service.description}
              </p>

              <ul className="space-y-2 mb-6">
                {service.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "#F5DF92" }} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:opacity-80"
                style={{ color: "#064E3B" }}
              >
                Enquire Now
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className="mt-16 rounded-3xl p-10 text-center"
          style={{ backgroundColor: "#064E3B" }}
        >
          <div className="text-2xl mb-4" style={{ color: "#F5DF92" }}>♛</div>
          <h3
            className="text-2xl sm:text-3xl font-semibold mb-3"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#FCF1D0" }}
          >
            Book a Consultation
          </h3>
          <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: "rgba(252,241,208,0.70)" }}>
            Not sure which service you need? Our jewellery experts are here to guide you — in store or virtually.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm tracking-wider transition-all hover:scale-105"
            style={{ backgroundColor: "#F5DF92", color: "#064E3B" }}
          >
            GET IN TOUCH
          </Link>
        </div>
      </div>
    </div>
  );
}
