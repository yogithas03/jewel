# React + Vite

## Live metal rates

The Gold Rates page uses the current USD spot quotes from Gold-API.com for gold
(`XAU`), silver (`XAG`), and platinum (`XPT`), converted on the server with the
latest published USD/INR reference rate from Frankfurter. It converts troy
ounces to grams and derives 22K from 24K gold. The backend exposes
`GET /api/metals/rates`; this provider setup does not require an API key.

Run locally with `npm run dev`. The page refreshes automatically every 15
minutes and the server caches provider quotes for that interval to reduce
requests. A manual refresh requests a fresh provider quote. The API returns
explicit JSON errors and does not substitute saved or sample rates.

For a Node 22 host such as Render, use `npm ci` for the build command,
`npm run build` for the frontend build, and `npm start` for the start command.
Set the health check path to `/api/metals/rates`. No provider secret is needed.

For Vercel, import the repository with the Vite framework preset and use
`npm run build` as the build command with `dist` as the output directory. The
Vercel function is at `api/metals/rates.js`; no provider environment variable
is required.

Rates are indicative live international spot prices converted to INR, not
store-specific retail prices or final jewellery selling prices. USD/INR uses
the latest published reference rate, which may be from the previous business
day. Diamonds do not have a single universal spot price.

### How the live metal rates are obtained and calculated

Gold, silver, and platinum are traded in international markets. The site gets
their latest available spot prices in US dollars per troy ounce from
Gold-API.com. A troy ounce is a standard precious-metals weight equal to
31.1034768 grams. The site also gets the latest published USD-to-INR reference
exchange rate from Frankfurter.

The server converts each metal price to an approximate Indian rupee price per
gram using:

```text
INR per gram = (USD price per troy ounce × USD/INR exchange rate) ÷ 31.1034768
```

For example, if a metal costs USD 2,000 per troy ounce and USD 1 equals INR 83,
the indicative rate is `(2,000 × 83) ÷ 31.1034768`, or about INR 5,337 per
gram. This is only an example; actual market and exchange rates change.

The 24-karat gold rate represents pure gold. The 22-karat rate is estimated
from it by multiplying by `22 ÷ 24`, because 22-karat gold is about 91.67%
gold. Silver and platinum are converted to per-gram rates in the same way;
silver is also shown per 10 grams and per kilogram. The website displays the
rates in INR and rounds them to two decimal places.

The rates page refreshes automatically every 15 minutes, and its refresh
button requests new market data. The server also caches provider data for up
to 15 minutes. “Live” therefore means the latest available feed quote, not a
guarantee of a tick-by-tick exchange price. The USD/INR feed is a published
reference rate and may be from the previous business day; the page shows its
date separately from the metal quote update time.

These are indicative raw-metal spot rates, not the final price a jewellery
shop will charge. A finished item can also include making charges, applicable
taxes, wastage, stones, and store-specific pricing. The site’s gold
calculator estimates a gold item by multiplying its selected per-gram rate by
its weight, adding the selected making-charge percentage, then applying the
selected GST percentage to that subtotal. Confirm a final quote with the
jeweller.

## Sign in and registration

The `/login` page uses Supabase Auth for email/password sign-in, registration,
email confirmation, and password recovery. Configure these Vite environment
variables in a local `.env` file and in each deployment environment:

```dotenv
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-or-publishable-key
```

These frontend values are public by design. Never use a Supabase `service_role`
key in a `VITE_` variable or browser code. Add the local and deployed site URLs
to Supabase Auth's allowed redirect URLs. For email confirmation, configure
the Supabase confirmation email to redirect to the deployed application.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
