import { useState } from "react";
import { calculateGoldPrice, formatINR } from "../services/metalRateService";

export default function GoldCalculator({ rates }) {
  const [form, setForm] = useState({
    purity: "22K",
    weight: "",
    makingCharge: 12,
    gst: 3,
  });
  const [result, setResult] = useState(null);

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setResult(null);
  };

  const calculate = () => {
    if (!form.weight || isNaN(form.weight) || parseFloat(form.weight) <= 0) return;
    const res = calculateGoldPrice({
      purity: form.purity,
      weightGrams: parseFloat(form.weight),
      makingChargePercent: parseFloat(form.makingCharge),
      gstPercent: parseFloat(form.gst),
      rates,
    });
    setResult(res);
  };

  const ratePerGram = rates?.gold?.[form.purity.toLowerCase()]?.perGram
    ?? (form.purity === "18K" ? (rates?.gold?.["24k"]?.perGram ?? 0) * 0.75 : 0);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-sm backdrop-blur-md">
      <div className="px-6 py-5" style={{ backgroundColor: "#064E3B" }}>
        <h3
          className="text-xl font-semibold"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#FCF1D0" }}
        >
          Gold Price Calculator
        </h3>
        <p className="text-xs mt-1" style={{ color: "rgba(252,241,208,0.65)" }}>
          Estimate your jewellery cost instantly
        </p>
      </div>

      <div className="p-6 space-y-5">
        {/* Purity */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#FCF1D0]/80">
            Gold Purity
          </label>
          <div className="flex gap-2">
            {["24K", "22K", "18K"].map((p) => (
              <button
                key={p}
                onClick={() => update("purity", p)}
                className="flex-1 py-2.5 text-sm font-semibold rounded-lg border transition-all"
                style={
                  form.purity === p
                    ? { backgroundColor: "#064E3B", color: "#FCF1D0", borderColor: "#064E3B" }
                    : { backgroundColor: "white", color: "#064E3B", borderColor: "#e5e7eb" }
                }
              >
                {p}
              </button>
            ))}
          </div>
          {ratePerGram > 0 && (
            <p className="mt-2 text-xs text-[#FCF1D0]/65">
              Current rate: {formatINR(ratePerGram)} / gram
            </p>
          )}
        </div>

        {/* Weight */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#FCF1D0]/80">
            Weight (grams)
          </label>
          <input
            type="number"
            min="0.1"
            step="0.1"
            placeholder="e.g. 5.5"
            value={form.weight}
            onChange={(e) => update("weight", e.target.value)}
            className="w-full rounded-lg border border-white/25 bg-white/10 px-4 py-3 text-sm text-[#FCF1D0] outline-none transition-colors placeholder:text-[#FCF1D0]/45 focus:border-[#F5DF92]"
          />
        </div>

        {/* Making charges */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#FCF1D0]/80">
            Making Charges: {form.makingCharge}%
          </label>
          <input
            type="range"
            min="5"
            max="30"
            step="0.5"
            value={form.makingCharge}
            onChange={(e) => update("makingCharge", e.target.value)}
            className="w-full accent-[#F5DF92]"
          />
          <div className="mt-1 flex justify-between text-xs text-[#FCF1D0]/60">
            <span>5%</span>
            <span>30%</span>
          </div>
        </div>

        {/* GST */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#FCF1D0]/80">
            GST: {form.gst}%
          </label>
          <div className="flex gap-2">
            {[1.5, 3, 5].map((g) => (
              <button
                key={g}
                onClick={() => update("gst", g)}
                className="flex-1 py-2 text-sm rounded-lg border transition-all"
                style={
                  parseFloat(form.gst) === g
                    ? { backgroundColor: "#F5DF92", color: "#064E3B", borderColor: "#F5DF92" }
                    : { backgroundColor: "white", color: "#064E3B", borderColor: "#e5e7eb" }
                }
              >
                {g}%
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={calculate}
          disabled={!form.weight}
          className="w-full py-3 rounded-lg font-semibold text-sm tracking-wider transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
          style={{ backgroundColor: "#064E3B", color: "#FCF1D0" }}
        >
          CALCULATE PRICE
        </button>

        {/* Result */}
        {result && (
          <div
            className="rounded-xl p-5 space-y-3"
            style={{ backgroundColor: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.2)" }}
          >
            <h4
              className="font-semibold text-base"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#FCF1D0" }}
            >
              Price Breakdown
            </h4>

            {[
              {
                label: `Gold Value (${form.purity} × ${form.weight}g)`,
                value: formatINR(result.goldValue),
                sub: true,
              },
              {
                label: `Making Charges (${form.makingCharge}%)`,
                value: formatINR(result.makingCharges),
                sub: true,
              },
              { label: `GST (${form.gst}%)`, value: formatINR(result.gst), sub: true },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center">
                <span className={`text-sm ${row.sub ? "text-[#FCF1D0]/75" : "font-bold text-[#FCF1D0]"}`}>
                  {row.label}
                </span>
                <span className={`text-sm ${row.sub ? "text-[#FCF1D0]/75" : "font-bold text-[#FCF1D0]"}`}>
                  {row.value}
                </span>
              </div>
            ))}

            <div
              className="flex justify-between items-center pt-3 mt-3 border-t"
              style={{ borderColor: "rgba(245,223,146,0.4)" }}
            >
              <span className="font-bold" style={{ color: "#FCF1D0" }}>
                Estimated Total
              </span>
              <span className="text-lg font-bold" style={{ color: "#FCF1D0" }}>
                {formatINR(result.total)}
              </span>
            </div>

            <p className="pt-1 text-xs text-[#FCF1D0]/65">
              * Indicative price only. Actual price may vary based on design and store rates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
