const metalsApiUrl = "https://api.gold-api.com/price";
const exchangeApiUrl = "https://api.frankfurter.app/latest?from=USD&to=INR";
const troyOunceInGrams = 31.1034768;
const cacheDurationMs = 15 * 60 * 1000;
let cachedRates;
let cachedAt = 0;
let pendingRequest;

function roundCurrency(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

async function fetchJson(url, sourceName) {
  let response;
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(12000) });
  } catch {
    throw new Error(`${sourceName} could not be reached. Please try again shortly.`);
  }

  const contentType = response.headers.get("content-type") || "";
  const body = await response.text();
  if (!response.ok) {
    const error = new Error(`${sourceName} returned HTTP ${response.status}.`);
    error.status = response.status === 429 ? 429 : 502;
    throw error;
  }
  if (!contentType.toLowerCase().includes("application/json")) {
    throw new Error(`${sourceName} returned a non-JSON response.`);
  }
  if (!body.trim()) throw new Error(`${sourceName} returned an empty response.`);

  try {
    return JSON.parse(body);
  } catch {
    throw new Error(`${sourceName} returned invalid JSON.`);
  }
}

async function fetchMetal(symbol) {
  const data = await fetchJson(`${metalsApiUrl}/${symbol}`, `The ${symbol} market feed`);
  const updatedAt = Date.parse(data.updatedAt);
  if (
    data.currency !== "USD" ||
    !Number.isFinite(data.price) ||
    data.price <= 0 ||
    !Number.isFinite(updatedAt)
  ) {
    throw new Error(`The ${symbol} market feed returned invalid price data.`);
  }

  return { price: data.price, updatedAt };
}

function makeMetalRates(pricePerTroyOunceInUsd, usdInr, purity = 1) {
  const rawPerGram = (pricePerTroyOunceInUsd * usdInr / troyOunceInGrams) * purity;
  const perGram = roundCurrency(rawPerGram);
  return {
    perGram,
    per10Gram: roundCurrency(rawPerGram * 10),
  };
}

async function fetchLiveRates() {
  const [gold, silver, platinum, exchange] = await Promise.all([
    fetchMetal("XAU"),
    fetchMetal("XAG"),
    fetchMetal("XPT"),
    fetchJson(exchangeApiUrl, "The USD/INR exchange-rate feed"),
  ]);

  const usdInr = exchange?.rates?.INR;
  if (!Number.isFinite(usdInr) || usdInr <= 0 || !Number.isFinite(Date.parse(exchange.date))) {
    throw new Error("The USD/INR exchange-rate feed returned invalid data.");
  }

  return {
    success: true,
    currency: "INR",
    updatedAt: new Date(Math.min(gold.updatedAt, silver.updatedAt, platinum.updatedAt)).toISOString(),
    fxRateDate: exchange.date,
    gold: {
      "24k": makeMetalRates(gold.price, usdInr),
      "22k": makeMetalRates(gold.price, usdInr, 22 / 24),
    },
    silver: {
      ...makeMetalRates(silver.price, usdInr),
      perKg: roundCurrency((silver.price * usdInr / troyOunceInGrams) * 1000),
    },
    platinum: makeMetalRates(platinum.price, usdInr),
  };
}

export async function getLiveMetalRates({ force = false } = {}) {
  if (!force && cachedRates && Date.now() - cachedAt < cacheDurationMs) {
    return cachedRates;
  }
  if (!pendingRequest) {
    pendingRequest = fetchLiveRates()
      .then((rates) => {
        cachedRates = rates;
        cachedAt = Date.now();
        return rates;
      })
      .finally(() => {
        pendingRequest = null;
      });
  }
  return pendingRequest;
}
