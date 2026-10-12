import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import GoldRateCard from "../components/GoldRateCard";
import GoldCalculator from "../components/GoldCalculator";
import { getMetalRates } from "../services/metalRateService";

const refreshIntervalMs = 15 * 60 * 1000;
const goldHeroImage = "/images/gold-rate-jewelry.jpg";
const necklaceHeroImage = "/images/gold-rate-necklace.jpg";

export default function GoldRate() {
  const [rates, setRates] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const activeRequest = useRef(null);

  const refreshRates = useCallback(async ({ force = false } = {}) => {
    if (activeRequest.current) return;
    const controller = new AbortController();
    activeRequest.current = controller;
    setRefreshing(true);
    setError("");

    try {
      const data = await getMetalRates({ signal: controller.signal, force });
      if (activeRequest.current === controller) setRates(data);
    } catch (requestError) {
      if (requestError.name !== "AbortError" && activeRequest.current === controller) {
        console.error("Failed to load live metal rates:", requestError);
        setRates(null);
        setError(requestError.message || "Unable to fetch today's metal rates. Please try again.");
      }
    } finally {
      if (activeRequest.current === controller) {
        activeRequest.current = null;
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    const initialLoadId = window.setTimeout(refreshRates, 0);
    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") refreshRates();
    }, refreshIntervalMs);

    return () => {
      window.clearTimeout(initialLoadId);
      window.clearInterval(intervalId);
      activeRequest.current?.abort();
      activeRequest.current = null;
    };
  }, [refreshRates]);

  const updatedAtDate = rates ? new Date(rates.updatedAt) : null;
  const today = updatedAtDate ? new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(updatedAtDate) : "";

  return (
    <div className="min-h-screen bg-[#064E3B] pt-20 lg:pt-24">
      <header className="relative isolate flex h-[260px] w-full items-center justify-center overflow-hidden bg-[#064E3B] px-4 py-5 text-center">
        {goldHeroImage && (
          <img
            aria-hidden="true"
            src={goldHeroImage}
            alt=""
            className="absolute inset-y-0 left-0 -z-20 h-full w-[43%] object-cover object-[center_48%] sm:w-[34%]"
            style={{
              filter: "brightness(1.12) saturate(1.08)",
              maskImage: "linear-gradient(to right, black 0%, black 66%, transparent 100%)",
            }}
          />
        )}
        {necklaceHeroImage && (
          <img
            aria-hidden="true"
            src={necklaceHeroImage}
            alt=""
            className="absolute inset-y-0 right-0 -z-20 h-full w-[43%] object-cover object-[center_48%] sm:w-[32%]"
            style={{
              filter: "brightness(1.12) saturate(1.08)",
              maskImage: "linear-gradient(to left, black 0%, black 66%, transparent 100%)",
            }}
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{
            background: "linear-gradient(90deg, rgba(6,78,59,.32) 0%, rgba(6,78,59,.48) 25%, rgba(6,78,59,.96) 42%, rgba(6,78,59,.96) 58%, rgba(6,78,59,.48) 76%, rgba(6,78,59,.32) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-[0.07]"
          style={{ backgroundImage: "repeating-linear-gradient(135deg, #F2DEAA, #F2DEAA 1px, transparent 1px, transparent 12px)" }}
        />
        <div className="relative w-full max-w-3xl">
          <p className="text-[9px] font-semibold tracking-[0.35em] text-[#E8C96C] sm:text-[10px]">DIKSHI JEWELLERY</p>
          <h1
            className="mt-1 text-2xl font-semibold leading-tight text-[#F2DEAA] sm:text-4xl"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Today&apos;s Metal Rates
          </h1>
          <p className="mt-1 text-[11px] text-[#F2DEAA]/85 sm:text-sm">Live precious metal prices in INR</p>
          <p className="mx-auto mt-1 max-w-2xl text-[9px] leading-snug text-[#F2DEAA]/75 sm:text-[10px]">
            {today}
            {rates && <> · Updated {new Intl.DateTimeFormat("en-IN", {
              day: "2-digit",
              month: "short",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
              timeZone: "Asia/Kolkata",
            }).format(new Date(rates.updatedAt))}</>}
            {rates?.fxRateDate && <> · USD/INR {new Intl.DateTimeFormat("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              timeZone: "UTC",
            }).format(new Date(`${rates.fxRateDate}T00:00:00Z`))}</>}
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E8C96C]/70 bg-[#064E3B]/50 px-3 py-1.5 text-[10px] text-[#F2DEAA]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E8C96C]" />
              Live Market Rate · INR
            </span>
            <button
              type="button"
              onClick={() => refreshRates({ force: true })}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#E8C96C] px-3 py-1.5 text-[10px] font-semibold text-[#064E3B] transition hover:brightness-105 disabled:cursor-wait disabled:opacity-60"
            >
              <span aria-hidden="true" className={refreshing ? "animate-spin" : ""}>↻</span>
              {refreshing ? "Refreshing rates…" : "Refresh Rates"}
            </button>
          </div>
        </div>
      </header>

      <main
        className="relative mx-auto max-w-7xl overflow-hidden px-4 py-6 sm:px-6 sm:py-8"
        style={{
          backgroundColor: "#064E3B",
          backgroundImage: "radial-gradient(ellipse at 8% 20%, rgba(232, 201, 108,.10), transparent 26%), radial-gradient(ellipse at 92% 20%, rgba(15,118,110,.18), transparent 27%)",
        }}
      >
        {error && (
          <div role="alert" className="mb-8 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">Unable to fetch today&apos;s metal rates.</p>
              <p className="mt-1">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => refreshRates({ force: true })}
              disabled={refreshing}
              className="shrink-0 rounded-lg border border-red-300 px-4 py-2 font-semibold hover:bg-red-100 disabled:opacity-50"
            >
              Try again
            </button>
          </div>
        )}

        {refreshing && !rates ? (
          <RateSkeleton />
        ) : rates ? (
          <>
            <section aria-labelledby="rates-heading">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#E8C96C]">India · INR</p>
                  <h2
                    id="rates-heading"
                    className="mt-0.5 text-2xl font-semibold text-[#F2DEAA] sm:text-3xl"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    Today&apos;s Precious Metal Rates
                  </h2>
                  <p className="mt-1 text-xs text-[#F2DEAA]/75">Live market rates for Gold, Silver and Platinum · Auto-refreshes every 15 minutes</p>
                </div>
                <div aria-hidden="true" className="hidden h-px w-24 bg-gradient-to-r from-transparent via-[#E8C96C] to-transparent sm:block" />
                {refreshing && <span className="text-xs text-[#F2DEAA]/70">Updating…</span>}
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <GoldRateCard
                  label="Gold"
                  purity="Live gold market price"
                  updatedAt={rates.updatedAt}
                  rates={[
                    { label: "24K Gold · per gram", value: rates.gold["24k"].perGram },
                    { label: "24K Gold · per 10 grams", value: rates.gold["24k"].per10Gram },
                    { label: "22K Gold · per gram", value: rates.gold["22k"].perGram },
                    { label: "22K Gold · per 10 grams", value: rates.gold["22k"].per10Gram },
                  ]}
                />
                <GoldRateCard
                  label="Silver"
                  purity="Live silver spot price"
                  updatedAt={rates.updatedAt}
                  rates={[
                    { label: "Silver · per gram", value: rates.silver.perGram },
                    { label: "Silver · per 10 grams", value: rates.silver.per10Gram },
                    { label: "Silver · per kilogram", value: rates.silver.perKg },
                  ]}
                />
                <GoldRateCard
                  label="Platinum"
                  purity="Live platinum spot price"
                  updatedAt={rates.updatedAt}
                  rates={[
                    { label: "Platinum · per gram", value: rates.platinum.perGram },
                    { label: "Platinum · per 10 grams", value: rates.platinum.per10Gram },
                  ]}
                />
              </div>
            </section>

            <p className="mt-3 rounded-full border border-[#E8C96C]/30 bg-white/10 px-4 py-2 text-center text-[9px] leading-4 text-[#F2DEAA]/80 backdrop-blur-sm">
              Rates shown are indicative live market rates. Final jewellery prices may vary based on GST, making charges, wastage and applicable jeweller charges.
            </p>

            <section className="mt-12" aria-labelledby="calculator-heading">
              <h2
                id="calculator-heading"
                className="mb-5 text-2xl font-semibold text-[#F2DEAA]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Gold Price Calculator
              </h2>
              <div className="max-w-xl">
                <GoldCalculator rates={rates} />
              </div>
            </section>

            <section className="mt-12" aria-labelledby="diamond-guide-heading">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E8C96C]">A guide to diamond value</p>
                <h2
                  id="diamond-guide-heading"
                  className="mt-1 text-2xl font-semibold text-[#F2DEAA] sm:text-3xl"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Understanding the 4Cs
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[#F2DEAA]/75">
                  Diamonds do not have one universal daily spot rate. A quote is based on the individual stone and its grading report.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <DiamondFactor
                  name="Cut"
                  detail="How well the diamond is proportioned and finished. Cut strongly affects how much light it reflects."
                  scale="Common grades: Excellent to Poor"
                />
                <DiamondFactor
                  name="Colour"
                  detail="The absence of colour in a white diamond. Less colour is generally rarer in the standard grading scale."
                  scale="GIA scale: D (colourless) to Z"
                />
                <DiamondFactor
                  name="Clarity"
                  detail="The size, number and visibility of natural inclusions and surface blemishes."
                  scale="Ranges from Flawless to Included"
                />
                <DiamondFactor
                  name="Carat"
                  detail="The diamond's weight, not its face-up size. One carat equals 0.2 grams."
                  scale="Compare weight alongside the other 3Cs"
                />
              </div>
              <div className="mt-5 flex flex-col gap-3 rounded-xl border border-[#E8C96C]/35 bg-white/10 p-5 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-6 text-[#F2DEAA]/85">
                  For an accurate diamond quote, share the stone&apos;s cut, colour, clarity, carat weight and certification.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#064E3B] px-5 py-2.5 text-sm font-semibold text-[#F2DEAA] transition hover:opacity-90"
                >
                  Request a diamond quote
                </Link>
              </div>
            </section>

          </>
        ) : !refreshing ? (
          <div className="rounded-2xl border border-[#E8C96C]/40 bg-white/10 p-8 text-center text-sm text-[#F2DEAA]/80 backdrop-blur-sm">
            Today&apos;s live rates are unavailable. Please try again.
          </div>
        ) : null}
      </main>
    </div>
  );
}

function DiamondFactor({ name, detail, scale }) {
  return (
    <article className="rounded-xl border border-white/20 bg-white/10 p-5 shadow-sm backdrop-blur-sm">
      <h3
        className="text-lg font-semibold text-[#F2DEAA]"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        {name}
      </h3>
      <p className="mt-2 text-sm leading-6 text-[#F2DEAA]/75">{detail}</p>
      <p className="mt-4 border-t border-white/15 pt-3 text-xs font-medium text-[#F2DEAA]/65">{scale}</p>
    </article>
  );
}

function RateSkeleton() {
  return (
    <div aria-label="Fetching today's live rates" aria-busy="true">
      <p className="mb-4 text-center text-sm text-[#064E3B]/65">Fetching today&apos;s live rates…</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="animate-pulse overflow-hidden rounded-xl border border-white/20 bg-white/10 p-4">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-10 w-12 rounded-lg bg-[#064E3B]/10" />
              <div className="space-y-2">
                <div className="h-4 w-20 rounded bg-[#064E3B]/15" />
                <div className="h-3 w-32 rounded bg-[#064E3B]/10" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-7 rounded bg-[#064E3B]/10" />
              <div className="h-7 rounded bg-[#064E3B]/10" />
              <div className="h-7 rounded bg-[#064E3B]/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
