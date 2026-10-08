import { getMetalRatesResponse } from "../../server/metalsRoute.js";

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  const result = await getMetalRatesResponse({
    method: request.method,
    force: request.query?.refresh === "true",
  });
  return response.status(result.status).json(result.body);
}
