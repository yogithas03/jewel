import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { getMetalRatesResponse } from './server/metalsRoute.js'

function metalRatesApi() {
  return {
    name: 'dikshi-metal-rates-api',
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        let pathname
        try {
          pathname = new URL(request.url, 'http://localhost').pathname
        } catch {
          response.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' })
          response.end(JSON.stringify({ success: false, message: 'Invalid request URL.' }))
          return
        }

        if (pathname !== '/api/metals/rates') {
          next()
          return
        }

        const query = new URL(request.url, 'http://localhost').searchParams
        const result = await getMetalRatesResponse({
          method: request.method,
          force: query.get('refresh') === 'true',
        })
        response.writeHead(result.status, {
          'Cache-Control': 'no-store',
          'Content-Type': 'application/json; charset=utf-8',
        })
        response.end(JSON.stringify(result.body))
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), metalRatesApi()],
})
