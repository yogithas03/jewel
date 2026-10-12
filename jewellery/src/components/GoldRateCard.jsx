import { formatINR } from "../services/metalRateService";
import "./GoldCoinConfetti.css";

const goldCoins = [
  { left: "12%", delay: "0s", duration: "5.8s" },
  { left: "34%", delay: "-3.2s", duration: "6.5s" },
  { left: "58%", delay: "-1.1s", duration: "5.2s" },
  { left: "81%", delay: "-4.4s", duration: "6.1s" },
  { left: "94%", delay: "-2.2s", duration: "5.6s" },
];

export default function GoldRateCard({
  label,
  purity,
  rates = [],
  updatedAt,
}) {
  return (
    <article className="relative isolate overflow-hidden rounded-xl border border-white/25 bg-white/10 shadow-[0_6px_18px_rgba(0,0,0,0.12)] backdrop-blur-md transition-shadow hover:bg-white/15 hover:shadow-[0_10px_26px_rgba(0,0,0,0.18)]">
      {["Gold", "Silver", "Platinum"].includes(label) && (
        <span className="metal-coin-confetti" aria-hidden="true">
          {goldCoins.map((coin, index) => (
            <span
              key={index}
              className={`metal-coin ${label.toLowerCase()}-coin`}
              style={{
                "--coin-left": coin.left,
                "--coin-delay": coin.delay,
                "--coin-duration": coin.duration,
              }}
            >
              ₹
            </span>
          ))}
        </span>
      )}
      <div className="relative z-10 flex items-center justify-between gap-3 px-4 pb-3 pt-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <MetalIcon metal={label} />
          <div className="min-w-0">
            <h3
              className="text-lg font-semibold leading-tight text-[#F2DEAA]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {label}
            </h3>
            <p className="mt-0.5 truncate text-[11px] text-[#F2DEAA]/75">{purity}</p>
          </div>
        </div>
        {label === "Gold" && (
          <div className="shrink-0 rounded-md bg-[#E8C96C]/20 px-2 py-1 text-[9px] font-semibold leading-4 text-[#F2DEAA]">
            24K · 99.9% pure<br />22K · 91.6% pure
          </div>
        )}
      </div>

      <div className="relative z-10 px-4 pb-3 sm:px-5">
        {rates.map(({ label: rateLabel, value }) => (
          <div
            key={rateLabel}
            className="flex items-center justify-between gap-3 border-t border-dashed border-white/20 py-2"
          >
            <span className="text-xs text-[#F2DEAA]/80">{rateLabel}</span>
            <span className="whitespace-nowrap text-sm font-bold text-[#F2DEAA]">
              {typeof value === "number" ? formatINR(value) : "—"}
            </span>
          </div>
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-between border-t border-white/15 bg-white/5 px-4 py-2 text-[9px] text-[#F2DEAA]/75 sm:px-5">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#0F766E]" />
          Live market rate · INR
        </span>
        {updatedAt && (
          <span>
            Updated {new Intl.DateTimeFormat("en-IN", {
              day: "2-digit",
              month: "short",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
              timeZone: "Asia/Kolkata",
            }).format(new Date(updatedAt))}
          </span>
        )}
      </div>
    </article>
  );
}

function MetalIcon({ metal }) {
  const type = metal.toLowerCase();
  const fill = type === "gold" ? "#E9B83E" : type === "silver" ? "#AEB9C1" : "#D9C9A8";
  const highlight = type === "gold" ? "#FFE7A0" : type === "silver" ? "#E5EBEF" : "#F2E6CD";

  return (
    <svg aria-hidden="true" viewBox="0 0 48 40" className="h-10 w-12 shrink-0">
      <path d="M6 25 14 9h20l9 16-9 10H14L6 25Z" fill={fill} stroke="#F2DEAA" strokeOpacity=".35" />
      <path d="m14 9 10 8 10-8M6 25l18-8 19 8M14 35l10-18 10 18" fill={highlight} fillOpacity=".72" />
      <path d="m6 25 18-8 19 8M14 35l10-18 10 18" fill="none" stroke="#F2DEAA" strokeOpacity=".3" />
    </svg>
  );
}
