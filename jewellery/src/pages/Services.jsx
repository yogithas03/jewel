import { Link } from "react-router-dom";
import { services } from "../data/services";
import jewelleryCustomize from "../assets/jewellery-customize-new.jpg";
import jewelleryRepair from "../assets/jewellery-repair.jpg";
import jewelleryCleaning from "../assets/jewellery-cleaning.jpg";
import jewelleryGoldExchange from "../assets/jewellery-gold-exchange.jpg";
import jewelleryValuation from "../assets/jewellery-valuation.jpg";
import jewelleryConsultation from "../assets/jewellery-consultation.jpg";
import bridalNecklace from "../assets/services-necklace.png";
import servicesPromise from "../assets/services-promise.png";
import servicesCare from "../assets/services-care.png";

const serviceImages = [
  jewelleryCustomize,
  jewelleryRepair,
  jewelleryCleaning,
  jewelleryGoldExchange,
  jewelleryValuation,
  jewelleryConsultation,
  bridalNecklace,
];

export default function Services() {
  return (
    <div className="bg-[#FCF8EE] pt-20 lg:pt-24">
      <section className="relative isolate flex min-h-[320px] items-center overflow-hidden bg-[#064E3B] px-5 py-14 sm:min-h-[380px] md:min-h-[420px] sm:px-8">
        {/* Diamond jewellery set background - framed and zoomed out */}
        <div className="absolute inset-y-0 right-0 z-0 flex h-full w-full items-center justify-end overflow-hidden sm:w-[65%] md:w-[55%] lg:w-[46%] xl:w-[42%]">
          <img
            src={servicesPromise}
            alt="Exquisite diamond necklace and earrings set"
            className="h-full w-full object-cover object-[center_40%]"
            style={{ filter: "brightness(0.8) saturate(1.1)" }}
          /> 
          {/* Subtle blend gradient on the image container */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, #064E3B 0%, rgba(6,78,59,0.7) 18%, rgba(6,78,59,0.15) 55%, transparent 100%)",
            }}
          />
        </div>

        {/* Full-width royal emerald gradient overlay for crisp text readability */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, rgba(6,78,59,1) 0%, rgba(6,78,59,0.96) 38%, rgba(6,78,59,0.55) 65%, rgba(6,78,59,0.1) 100%)",
          }}
        />

        <div className="relative z-20 mx-auto w-full max-w-7xl">
          <div className="max-w-xl text-center sm:text-left">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#E8C96C]">
              The Dikshi Promise
            </p>
            <h1
              className="mt-2 text-3xl font-semibold leading-tight text-[#F2DEAA] sm:text-5xl"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Care for Every Precious Moment
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#F2DEAA]/80 sm:mx-0">
              Beyond beautiful jewellery, we offer trusted services to help you create, care for and celebrate the pieces you love.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-6 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#A77B18]">
            Made personal, made to last
          </p>
          <h2
            className="mt-1 text-2xl font-semibold text-[#064E3B] sm:text-3xl"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Our Jewellery Services
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-xs leading-5 text-[#31594D]/75">
            Expert guidance and considered care for every stage of jewellery journey.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const isBridal = service.title === "Custom Bridal Jewellery";
            const isCustomization = service.title === "Jewellery Customization";

            return (
              <article
                key={service.id}
                className="group relative isolate flex min-h-[270px] flex-col overflow-hidden rounded-xl border border-[#D6C184]/60 bg-[#064E3B] p-5 shadow-[0_5px_18px_rgba(6,78,59,0.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_26px_rgba(6,78,59,0.15)]"
              >
                <img
                  src={serviceImages[index]}
                  alt=""
                  loading="lazy"
                  className={`absolute right-0 -z-20 h-full transition-transform duration-500 group-hover:scale-105 ${
                    isBridal
                      ? "inset-y-0 inset-x-0 w-full object-contain object-[110%_center] opacity-100"
                      : `inset-y-0 w-[68%] object-cover object-center ${isCustomization ? "opacity-100" : "opacity-90"}`
                  }`}
                  style={
                    isBridal
                      ? { filter: "brightness(1.08) contrast(1.05) saturate(1.08)" }
                      : isCustomization
                        ? { filter: "brightness(1.08) contrast(1.05) saturate(1.08)" }
                        : undefined
                  }
                />
                <div
                  aria-hidden="true"
                  className={`absolute inset-y-0 left-0 -z-10 ${
                    isBridal ? "w-[82%]" : isCustomization ? "w-[92%]" : "w-full"
                  }`}
                  style={{
                    background: isBridal
                      ? "linear-gradient(90deg, #064E3B 0%, rgba(6,78,59,.98) 46%, rgba(6,78,59,.82) 68%, rgba(6,78,59,.28) 88%, rgba(6,78,59,0) 100%)"
                      : isCustomization
                        ? "linear-gradient(90deg, #064E3B 0%, rgba(6,78,59,.96) 46%, rgba(6,78,59,.72) 68%, rgba(6,78,59,.24) 90%, rgba(6,78,59,0) 100%)"
                      : "linear-gradient(90deg, #064E3B 0%, rgba(6,78,59,.97) 43%, rgba(6,78,59,.78) 62%, rgba(6,78,59,.18) 100%)",
                  }}
                />

                  <div className="flex items-start justify-between gap-2">
                    <span className="grid h-10 w-10 place-items-center rounded-full border border-[#D6C184]/60 bg-[#F2DEAA]/90 text-lg text-[#8B681B] shadow-sm">
                      {service.icon}
                    </span>
                    <span className="pt-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#97721E]">
                      0{index + 1}
                    </span>
                  </div>

                  <div className="mt-4 max-w-[82%]">
                    <h3
                      className="text-lg font-semibold leading-tight text-white"
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                      {service.title}
                    </h3>
                    <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.13em] text-[#E8C96C]">
                      {service.shortDesc}
                    </p>
                    <p className="mt-2 text-[11px] font-medium leading-[1.55] text-white/95">
                      {service.description}
                    </p>
                  </div>

                  <ul className="mt-3 space-y-1">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-[10px] font-medium leading-4 text-white/95">
                        <span className="h-1 w-1 shrink-0 rounded-full bg-[#B58A27]" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/contact"
                    className="mt-auto inline-flex w-fit items-center gap-1 pt-4 text-xs font-semibold text-white transition-colors hover:text-[#E8C96C]">
                    Enquire now
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
              </article>
            );
          })}
        </div>

        <section className="relative isolate mt-10 flex min-h-48 items-center overflow-hidden rounded-2xl border border-[#D6C184]/50 bg-[#064E3B] px-6 py-8 sm:px-10">
          <img
            src={servicesCare}
            alt="Handcrafted diamond necklace"
            loading="lazy"
            className="absolute inset-0 z-0 h-full w-full object-cover object-[left_center] sm:object-[12%_center]"
            style={{
              filter: "brightness(0.82) saturate(1.15)",
              WebkitMaskImage:
                "linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.3) 42%, rgba(0,0,0,0) 60%)",
              maskImage:
                "linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.3) 42%, rgba(0,0,0,0) 60%)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, rgba(6,78,59,0.1) 0%, rgba(6,78,59,0.35) 25%, rgba(6,78,59,0.9) 48%, #064E3B 65%, #064E3B 100%)",
            }}
          />
          <div className="relative z-20 mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
            <div className="sm:ml-[35%]">
              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#E8C96C]">Your jewellery, our care</p>
              <h2
                className="mt-1 text-2xl font-semibold text-[#F2DEAA] sm:text-3xl"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Your Jewellery, Our Care
              </h2>
              <p className="mt-1 text-xs text-[#F2DEAA]/75">
                Expert service to keep your precious pieces as beautiful as your memories.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex shrink-0 items-center gap-2 rounded-md bg-[#E8C96C] px-5 py-3 text-xs font-semibold text-[#064E3B] transition hover:bg-[#F2DEAA]"
            >
              Book a consultation <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
