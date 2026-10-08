import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import heroVideo from "../assets/jewellery-video.mp4";

export default function Hero() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: "#0d2e34",
        background:
          "radial-gradient(ellipse at 85% 45%, #0F766E 0%, #065F46 50%, #064E3B 90%)",
        minHeight: "100svh",
      }}
    >
      {/* Background video & lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover object-center lg:inset-y-0 lg:left-auto lg:right-0 lg:w-[63%]"
          style={{
            opacity: 0.98,
            filter: "brightness(2.1) contrast(1.15) saturate(1.3)",
            maskImage: "linear-gradient(to right, transparent 0%, black 25%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 25%)",
          }}
        />
        {/* Keep the text area dark while letting the video stay natural on the right. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, #064E3B 0%, #064E3B 28%, rgba(6,78,59,0.7) 40%, rgba(6,78,59,0.1) 55%, transparent 68%)",
          }}
        />
        {/* Soft top & bottom gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, #064E3B 0%, transparent 18%, transparent 85%, rgba(6,78,59,0.3) 100%)",
          }}
        />
      </div>

      {/* Extra bright spotlight on the jewel area */}
      <div
        className="absolute top-0 right-0 w-[60%] h-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 70% 50%, rgba(255,248,210,0.38) 0%, rgba(255,220,80,0.22) 25%, rgba(245,223,146,0.12) 50%, transparent 72%)",
        }}
      />

      {/* Decorative ambient lighting behind shifted jewel */}
      <div
        className="absolute top-1/4 right-8 lg:right-20 w-96 h-96 rounded-full opacity-[0.55] blur-2xl pointer-events-none"
        style={{ backgroundColor: "#F5DF92" }}
      />
      <div
        className="absolute top-1/3 right-16 lg:right-32 w-64 h-64 rounded-full opacity-[0.38] blur-xl pointer-events-none"
        style={{ backgroundColor: "#fff8e0" }}
      />
      <div
        className="absolute top-[38%] right-[22%] w-44 h-44 rounded-full opacity-[0.55] blur-lg pointer-events-none"
        style={{ backgroundColor: "#fffbe8" }}
      />

      {/* Main content */}
      <div
        className="relative z-10 flex items-center max-w-7xl mx-auto px-4 sm:px-6 w-full"
        style={{ paddingTop: "calc(5rem + 40px)", paddingBottom: "5rem", minHeight: "100svh" }}
      >
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-10" style={{ backgroundColor: "#F5DF92" }} />
            <span className="text-xs tracking-[0.35em] font-medium uppercase" style={{ color: "#F5DF92" }}>
              Since 1992
            </span>
          </div>

          {/* Heading */}
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold leading-tight mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#FCF1D0" }}
          >
            Timeless <br />
            <span style={{ color: "#F5DF92" }}>Elegance,</span>
            <br />
            Crafted for You
          </h1>

          <p className="text-base sm:text-lg leading-relaxed mb-10 max-w-lg" style={{ color: "rgba(252,241,208,0.75)" }}>
            Discover jewellery designed to celebrate every beautiful moment — from everyday grace to once-in-a-lifetime occasions.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-14">
            <Link
              to="/jewellery"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm tracking-wider transition-all hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: "#F5DF92", color: "#064E3B" }}
            >
              SHOP JEWELLERY
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              to="/jewellery/bridal"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm tracking-wider border transition-all hover:bg-white/10"
              style={{ borderColor: "rgba(252,241,208,0.45)", color: "#FCF1D0" }}
            >
              EXPLORE BRIDAL
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8">
            {[
              { value: "30+", label: "Years of Craft" },
              { value: "10,000+", label: "Happy Customers" },
              { value: "BIS", label: "Hallmarked" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#F5DF92" }}>
                  {stat.value}
                </p>
                <p className="text-xs tracking-wider mt-0.5" style={{ color: "rgba(252,241,208,0.55)" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce z-10">
        <div className="h-6 w-px" style={{ backgroundColor: "rgba(245,223,146,0.4)" }} />
        <p className="text-xs tracking-widest" style={{ color: "rgba(245,223,146,0.5)" }}>SCROLL</p>
      </div>
    </section>
  );
}
