import { formatINR } from "../services/metalRateService";

export default function GoldRateCard({
  label,
  purity,
  rates = [],
  updatedAt,
}) {
  return (
    <article className="overflow-hidden rounded-xl border border-[#F5DF92]/60 bg-white/95 shadow-[0_6px_18px_rgba(6,78,59,0.08)] transition-shadow hover:shadow-[0_10px_26px_rgba(6,78,59,0.14)]">
      <div className="flex items-center justify-between gap-3 px-4 pb-3 pt-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <MetalIcon metal={label} />
          <div className="min-w-0">
            <h3
              className="text-lg font-semibold leading-tight text-[#064E3B]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {label}
            </h3>
            <p className="mt-0.5 truncate text-[11px] text-[#064E3B]/65">{purity}</p>
          </div>
        </div>
        {label === "Gold" && (
          <div className="shrink-0 rounded-md bg-[#FCF1D0] px-2 py-1 text-[9px] font-semibold leading-4 text-[#064E3B]">
            24K · 99.9% pure<br />22K · 91.6% pure
          </div>
        )}
      </div>

      <div className="px-4 pb-3 sm:px-5">
        {rates.map(({ label: rateLabel, value }) => (
          <div
            key={rateLabel}
            className="flex items-center justify-between gap-3 border-t border-dashed border-[#064E3B]/10 py-2"
          >
            <span className="text-xs text-[#064E3B]/75">{rateLabel}</span>
            <span className="whitespace-nowrap text-sm font-bold text-[#064E3B]">
              {typeof value === "number" ? formatINR(value) : "—"}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-[#F5DF92]/20 bg-[#FCF1D0]/65 px-4 py-2 text-[9px] text-[#064E3B]/70 sm:px-5">
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
      <path d="M6 25 14 9h20l9 16-9 10H14L6 25Z" fill={fill} stroke="#064E3B" strokeOpacity=".16" />
      <path d="m14 9 10 8 10-8M6 25l18-8 19 8M14 35l10-18 10 18" fill={highlight} fillOpacity=".72" />
      <path d="m6 25 18-8 19 8M14 35l10-18 10 18" fill="none" stroke="#064E3B" strokeOpacity=".18" />
    </svg>
  );
}
