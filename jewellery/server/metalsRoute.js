import { getLiveMetalRates } from "./metals.js";

export async function getMetalRatesResponse({ method, force = false }) {
  if (method !== "GET") {
    return {
      status: 405,
      body: {
        success: false,
        message: "Method not allowed. Use GET /api/metals/rates.",
      },
    };
  }

  try {
    return {
      status: 200,
      body: await getLiveMetalRates({ force }),
    };
  } catch (error) {
    console.error("Failed to retrieve live metal rates:", error);
    const status = error.status || 502;
    return {
      status,
      body: {
        success: false,
        message: error.message || "Unable to fetch today's metal rates. Please try again.",
      },
    };
  }
}
