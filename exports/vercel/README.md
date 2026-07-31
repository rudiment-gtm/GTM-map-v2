# ProYard Sales Map - navigation demo

Front-end demo of the four-destination shell: **Chat / Map / Prospect / Enrich**.
All data is local and faked - there is no backend. Built to show the UI, not the plumbing.

## Run locally

    npm install
    npm run dev

## Deploy to Vercel

Push this folder to a GitHub repo and import it at vercel.com. Vercel auto-detects Vite:

- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`

No environment variables are needed.

## What works in the demo

- **Tab switcher** - keyboard-navigable, deep-linkable via `#/chat`, `#/map`, `#/prospect`, `#/enrich`.
- **Chat** - type a message or click a suggestion; canned replies are keyword-matched in `src/data.js`. Model picker switches between Claude and GPT names. "Show these on map" navigates to Map and updates the visible count and pin banner.
- **Map** - filter groups recompute the "Showing" count from a lookup table. "Find surrounding businesses" routes into Enrich.
- **Prospect** - row selection, "Add N to map", per-row Enrich.
- **Enrich** - "Reveal - 2" unmasks a contact and deducts 2 credits from the live balance; "Reveal all" charges in bulk. Meter turns amber below 10%.

## File map

    src/App.jsx                  app shell, all state, tab routing
    src/data.js                  every piece of demo data + canned chat replies
    src/theme.js                 color palette and shared style objects
    src/components/Sidebar.jsx   tab switcher + per-destination sidebar bodies
    src/components/CreditMeter.jsx
    src/components/Toast.jsx
    src/views/MapView.jsx        map image, top bar, pin banner, map actions
    src/views/ChatView.jsx       thread, model picker, composer
    src/views/ProspectView.jsx   query card + results table
    src/views/EnrichView.jsx     contacts table, credits, company profile
    public/map-canvas.png        static screenshot standing in for Mapbox

## Wiring it up for real

1. **Map** - replace the background image in `MapView.jsx` with the Mapbox canvas. Keep the node mounted: the wrapper toggles `visibility`, never unmounts, so the map never re-initializes on tab switch.
2. **Chat** - replace the `setTimeout` in `App.jsx` `send()` with a streaming `fetch('/api/chat')`. Keep API keys server-side only.
3. **Credits** - the client decrement in `revealContact` / `revealAll` is display only. Real deduction belongs in the same server transaction that returns enriched data, with an idempotency key so a re-reveal of purchased data costs nothing.
