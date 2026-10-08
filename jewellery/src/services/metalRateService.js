const RATE_ENDPOINT = "/api/metals/rates";
const DEFAULT_ERROR_MESSAGE = "Unable to fetch today's metal rates. Please try again.";

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

export function formatINR(value) {
  return inrFormatter.format(value);
}

function statusMessage(status) {
  if (status === 401 || status === 403) {
    return "The metal-rate provider rejected the server credentials. Please contact the site administrator.";
  }
  if (status === 429) {
    return "The metal-rate provider is receiving too many requests. Please try again shortly.";
  }
  if (status >= 500) return DEFAULT_ERROR_MESSAGE;
  return `Unable to fetch today's metal rates (HTTP ${status}). Please try again.`;
}

function responsePreview(body) {
  const compactBody = body.replace(/\s+/g, " ").trim();
  return compactBody ? compactBody.slice(0, 240) : "empty response body";
}

function errorMessageFromBody(body, contentType, fallback) {
  if (contentType.toLowerCase().includes("application/json") && body.trim()) {
    try {
      const data = JSON.parse(body);
      if (typeof data.message === "string" && data.message.trim()) return data.message;
    } catch {
      return `${fallback} Response was invalid JSON: ${responsePreview(body)}`;
    }
  }

  return `${fallback} Received ${contentType || "an unknown content type"}: ${responsePreview(body)}`;
}

function hasValidRates(data) {
  return data?.success === true &&
    data.currency === "INR" &&
    Number.isFinite(Date.parse(data.updatedAt)) &&
    ["gold.24k", "gold.22k", "silver", "platinum"].every((path) => {
      const value = path.split(".").reduce((current, key) => current?.[key], data);
      return Number.isFinite(value?.perGram) &&
        Number.isFinite(value?.per10Gram);
    }) &&
    Number.isFinite(data.silver.perKg);
}

export async function getMetalRates({ signal, force = false } = {}) {
  const endpoint = force ? `${RATE_ENDPOINT}?refresh=true` : RATE_ENDPOINT;
  let response;
  try {
    response = await fetch(endpoint, {
      headers: { Accept: "application/json" },
      signal,
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new Error(DEFAULT_ERROR_MESSAGE);
  }

  const contentType = response.headers.get("content-type") || "";
  let body;
  try {
    body = await response.text();
  } catch {
    throw new Error(`${statusMessage(response.status)} Could not read the server response.`);
  }

  if (!response.ok) {
    throw new Error(errorMessageFromBody(body, contentType, statusMessage(response.status)));
  }
  if (!contentType.toLowerCase().includes("application/json")) {
    throw new Error(`Expected JSON from ${RATE_ENDPOINT}. Received ${contentType || "an unknown content type"}: ${responsePreview(body)}`);
  }
  if (!body.trim()) throw new Error(`${DEFAULT_ERROR_MESSAGE} The server returned an empty JSON response.`);

  let data;
  try {
    data = JSON.parse(body);
  } catch {
    throw new Error(`${DEFAULT_ERROR_MESSAGE} The server returned invalid JSON: ${responsePreview(body)}`);
  }

  if (!hasValidRates(data)) throw new Error(DEFAULT_ERROR_MESSAGE);
  return data;
}

export function calculateGoldPrice({ purity, weightGrams, makingChargePercent = 12, gstPercent = 3, rates }) {
  const goldRate = rates?.gold?.[purity.toLowerCase()]?.perGram;
  const rate = goldRate ?? (purity === "18K" ? (rates?.gold?.["24k"]?.perGram ?? 0) * 0.75 : 0);
  const goldValue = rate * weightGrams;
  const makingCharges = (goldValue * makingChargePercent) / 100;
  const subtotal = goldValue + makingCharges;
  const gst = (subtotal * gstPercent) / 100;
  const total = subtotal + gst;

  return {
    goldValue: Math.round(goldValue),
    makingCharges: Math.round(makingCharges),
    gst: Math.round(gst),
    total: Math.round(total),
    breakdown: {
      rate,
      weightGrams,
      makingChargePercent,
      gstPercent,
    },
  };
}
