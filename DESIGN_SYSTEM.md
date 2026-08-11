# ProYard Design System — Reference Spec

Extracted from `exports/vercel/` (the "ProYard Sales Map" navigation demo). This
document is meant to be **handed to another repo** so its exact look, layout,
and interaction patterns can be reproduced on a different, fully-built tool.
It captures tokens, layout architecture, component patterns, and copy-pasteable
source, plus notes on what to swap out for a real product (branding, data,
backend).

Everything here is inline-style React (no CSS framework, no component
library) — every value is explicit, which is why it's easy to port into any
stack (Tailwind config, CSS variables, styled-components, plain CSS, etc.).

---

## 1. Concept summary

A single-page app shell: a fixed-width dark sidebar on the left (branding,
tab switcher, contextual filters/stats, credit meter, user footer) and a
full-bleed content area on the right that swaps between destinations. Four
destinations in the demo — **Chat / Map / Prospect / Enrich** — but the shell
pattern generalizes to any N-tab tool.

Visual language: near-black surfaces, soft-grey text hierarchy, a single
saturated green accent used sparingly (primary actions, success/connected
state, active indicator dots), monospace micro-labels for section headers and
table headers, and generous rounded corners (8–12px) everywhere.

---

## 2. Design tokens

### 2.1 Color palette

Single source of truth lives in `theme.js` as an exported `C` object. Copy
this object verbatim into a new repo's theme file and reference every color
through it — never hardcode hex values in components.

| Token | Hex | Usage |
|---|---|---|
| `bg` | `#0B0B0D` | App background, sidebar background |
| `surface` | `#0F1012` | Main content area background |
| `card` | `#141518` | Card/panel background, table background |
| `cardAlt` | `#17181B` | Table header row, active nav item bg, input bg |
| `raised` | `#1E1F23` | Elevated chat bubble (user message), dropdown item hover/active |
| `line` | `#1c1d20` | Hairline dividers (topbar border, list separators) |
| `border` | `#232427` | Default 1px borders on cards/inputs/tables |
| `borderStrong` | `#2A2C30` | Emphasized borders (cards with more visual weight, dashed "add" cards) |
| `text` | `#F6F5F2` | Headline / large numeric text |
| `textBody` | `#D6D5D1` | Primary body/table text |
| `textDim` | `#9DA0A6` | Secondary labels, section headers, muted UI text |
| `textMute` | `#6E7178` | Tertiary text (timestamps, "/ monthly" suffix) |
| `textFaint` | `#5D6067` | Disabled text, masked/locked cell placeholders |
| `green` | `#2BD576` | Primary accent — primary buttons, active status dot, progress fill |
| `greenText` | `#07170D` | Text color placed *on top of* `green` (buttons, FAB) |
| `greenSoft` | `#7EE8AC` | Link hover color, soft accent text |
| `greenBg` | `#1B2A21` | Background for "reveal" action chip (soft green fill) |
| `greenBorder` | `#27563C` | Border for the soft-green action chip |
| `warn` | `#E8B54A` | Amber warning — meter fill when balance is low (<10%) |

Near-white text that appears directly in components (not tokenized, but
consistent): `#EDEDEA` (primary text on dark surfaces), `#B9BCC2` /
`#C9C8C4` / `#A9ACB2` (secondary UI text, ghost-button labels).

Avatar/user-badge accent (separate from the main palette, used only for the
identity chip): background `#1F6F45`, text `#DFF7E8`.

**Formula to remember:** background layers get *darker → lighter* as you move
from app background → surface → card → cardAlt → raised (5-step elevation
scale). Text gets *dimmer* the less important it is: text → textBody →
textDim → textMute → textFaint (5-step hierarchy). Everything else derives
from these two scales plus the single green accent.

### 2.2 Typography

- **Body/UI font:** `Inter Tight` (weights 400/500/600/700), loaded from
  Google Fonts.
- **Monospace font:** `JetBrains Mono` (weights 400/500) — used *only* for
  small-caps-style section labels and table column headers, never for body
  copy.

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
```

```css
body { font-family: 'Inter Tight', system-ui, sans-serif; }
```

Mono label style (used for "FILTERS", "RECENT", "CREDITS", table column
headers, etc.):

```js
export const label = {
  color: C.textDim,
  fontSize: 10.5,
  fontFamily: mono,        // "'JetBrains Mono', monospace"
  letterSpacing: '.12em',  // wide tracking is what makes it read as a label, not a typo
};
```

Type scale actually used across the app (px): **10 / 10.5 / 11 / 11.5 / 12 /
12.5 / 13 / 13.5 / 14 / 15 / 16 / 20 / 26**. There's no formal modular scale —
values were chosen per-context, but they cluster tightly around 10.5–13.5 for
almost all UI chrome, with 20/26 reserved for headline numbers (stat tiles,
credit totals) and empty-state headings.

Numeric values that change frequently (credit counts, stats) use
`fontVariantNumeric: 'tabular-nums'` so digits don't cause layout jitter.

### 2.3 Radii & spacing

- Border radius scale: **6 / 7 / 8 / 9 / 10 / 11 / 12px**, plus `999px` for
  pills and progress-bar fills. Small interactive chips use 6–8px; cards and
  panels use 10–12px; nothing is ever perfectly square or fully rounded
  except pills/dots.
- Spacing is ad hoc (not an 8pt grid) but common paddings are `6px 11px`,
  `7px 12px`, `9px 13px`, `11px 14px`/`11px 15px`, `14px 16px` — i.e.
  vertical padding roughly 45–55% of horizontal padding on buttons/chips.
- 1px borders everywhere (never 2px+); the only elevation cue beyond border
  color is `box-shadow: 0 14px 34px rgba(0,0,0,.5–.55)` on floating surfaces
  (dropdowns, toasts).

### 2.4 Shared style objects (`theme.js`)

These are the primitives every component imports instead of re-declaring
styles:

```js
export const cardStyle = {
  background: C.card,
  border: '1px solid ' + C.borderStrong,
  borderRadius: 12,
};

export const btnGhost = {
  border: '1px solid ' + C.borderStrong,
  color: '#C9C8C4',
  borderRadius: 8,
  padding: '7px 12px',
  fontSize: 12,
  cursor: 'pointer',
};

export const btnPrimary = {
  background: C.green,
  color: C.greenText,
  borderRadius: 8,
  padding: '7px 12px',
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
};

export const tableWrap = {
  border: '1px solid ' + C.border,
  background: C.card,
  borderRadius: 11,
  overflowX: 'auto',
};

export const theadCell = {
  background: C.cardAlt,
  borderBottom: '1px solid ' + C.border,
  padding: '10px 14px',
  color: C.textDim,
  fontSize: 10.5,
  fontFamily: mono,
  letterSpacing: '.08em',
};
```

A disabled/inactive variant of `btnPrimary` recurs at every call site (not
factored out in the demo, but should be in a real port):

```js
const btnDisabled = {
  background: C.cardAlt,
  color: C.textFaint,
  border: '1px solid ' + C.border,
  borderRadius: 8,
  padding: '6-7px 11-12px',
  fontSize: 12,
  cursor: 'not-allowed', // or 'default' for "already done" states
};
```

---

## 3. Layout architecture

### 3.1 App shell

```
┌──────────────┬─────────────────────────────────────────────┐
│              │  46px top bar (per-view, sticky)             │
│  Sidebar     ├─────────────────────────────────────────────┤
│  268px fixed │                                               │
│              │              View content                     │
│  (flex col)  │        (position: absolute; inset: 0)         │
│              │                                               │
└──────────────┴─────────────────────────────────────────────┘
```

Root container: `display: flex; height: 100vh; width: 100%; overflow: hidden`
— the whole app is a non-scrolling viewport-locked shell; individual regions
scroll internally.

Sidebar: fixed `width: 268px`, `flexShrink: 0`, `background: bg`,
`borderRight: 1px solid line`, itself a column flex with three fixed zones
(header+tabs, scrollable middle, footer) and one flexible zone:

1. **Header** — logo image (`height: 48px`) + one-line product subtitle in
   `textDim`.
2. **Tab switcher** — a pill-shaped segmented control (see 4.3).
3. **Scrollable body** — content changes completely per active tab (see 3.3).
4. **Credit meter** — persistent across all tabs (see 4.6).
5. **User footer** — avatar circle + name, `borderTop` divider.

Content area: `flex: 1; position: relative; minWidth: 0; background: surface`.
Each view is absolutely positioned at `inset: 0` inside this container. Only
one is interactive at a time.

### 3.2 Tab routing pattern

Tabs are persisted in the URL hash (`#/chat`, `#/map`, `#/prospect`,
`#/enrich`) so every destination is directly linkable/bookmarkable, without
pulling in a router dependency:

```js
const [tab, setTabState] = useState(() => {
  const h = window.location.hash.replace('#/', '');
  return TABS.includes(h) ? h : 'chat';
});
const setTab = useCallback((next) => {
  setTabState(next);
  window.history.replaceState(null, '', '#/' + next);
}, []);
useEffect(() => {
  const onHash = () => {
    const h = window.location.hash.replace('#/', '');
    if (TABS.includes(h)) setTabState(h);
  };
  window.addEventListener('hashchange', onHash);
  return () => window.removeEventListener('hashchange', onHash);
}, []);
```

Port note: if the target repo already has a router (React Router, etc.),
replace this with real routes but **keep the "stay mounted" rule below** —
it's the important part, not the hash mechanism itself.

### 3.3 "Stay mounted" rule for expensive views

The Map view is the one screen with real cost to re-initialize (a map
canvas/SDK). It is rendered *unconditionally*, and every other tab is layered
on top of it. Visibility is toggled with CSS, not mount/unmount:

```jsx
<MapView active={tab === 'map'} .../>   {/* always mounted */}
{tab === 'chat' && <ChatView .../>}     {/* mount/unmount is fine here */}
{tab === 'prospect' && <ProspectView .../>}
{tab === 'enrich' && <EnrichView .../>}
```

Inside `MapView`:

```jsx
<div style={{
  position: 'absolute', inset: 0,
  visibility: active ? 'visible' : 'hidden',
  pointerEvents: active ? 'auto' : 'none',
}}>
```

Apply this rule to whichever view in the target tool wraps an expensive
external SDK (maps, charts/canvas libraries, video, editors) — keep it
mounted and hide with `visibility`, not `display: none` or unmounting.

### 3.4 Sidebar body changes per tab, chrome doesn't

The tab switcher, credit meter, and user footer never change. Only the
scrollable middle section of the sidebar swaps content based on the active
tab (recent chats vs. map filter groups vs. saved searches vs. credit-cost
table). This is what makes the shell feel like one coherent tool rather than
four separate pages bolted together.

---

## 4. Component catalog

### 4.1 Cards / panels

Every discrete content block — filter group, query composer, table
container, profile summary, credit summary — is the same primitive:

```js
{ background: C.card, border: '1px solid ' + C.borderStrong, borderRadius: 12, padding: '14-16px' }
```

Nesting depth is shown by swapping `card` → `cardAlt` for the inner
surface (e.g. table header row inside a `card` table wrapper), never by
adding shadow or changing radius.

### 4.2 Buttons

Three states, always inline `<div onClick>` rather than `<button>` in the
demo (a real port should use real `<button>` elements for accessibility):

- **Primary** — solid green fill, dark text, used for the one recommended
  next action per screen ("Show these on map", "Add N to map", "Reveal all").
- **Ghost** — 1px border, light-grey text, transparent fill. Used for
  secondary actions ("Build a route", "Export CSV", "Push to CRM", "Save
  search").
- **Disabled** — `cardAlt` background, `textFaint` text, `cursor:
  not-allowed` (or `default` if the state means "already complete" rather
  than "blocked"). Copy changes with state, e.g. "Select accounts" →
  "Add 3 to map"; "All revealed" → "Reveal all - 12".

A **soft-accent pill** variant exists for one specific action (per-row
"Reveal - 2"): green-tinted background/border/text (`greenBg` /
`greenBorder` / `greenSoft`) rather than solid fill — used when the action
recurs many times per screen (once per table row) and a solid button would
be too visually loud repeated 10+ times.

### 4.3 Segmented tab switcher

A rounded outer track (`card` background, `border`, `borderRadius: 10`,
`padding: 3px`) containing equal-width tab cells. The active cell gets a
**solid white pill** (`#FFFFFF` background, `bg`-colored text, 600 weight);
inactive cells are transparent with `textDim` text. This white-on-dark
inversion is the single most distinctive UI signature in the system — reuse
it exactly.

Keyboard support: arrow-left/right cycles tabs when a tab has focus
(`role="tablist"` / `role="tab"` / roving `tabIndex`).

### 4.4 Tables

Every table (chat result table, prospect list, contacts list) shares one
shape:
- Outer wrap: `tableWrap` (card bg, `border`, radius 11, `overflowX: auto`).
- Header row: `cardAlt` background, mono uppercase-tracked labels
  (`theadCell`), bottom border only.
- Body rows: `padding: 10-11px 14px`, `borderTop: 1px solid line` (hairline
  between rows, no border on the last row), grid layout via
  `gridTemplateColumns` with a fixed `minWidth` so columns never collapse —
  scroll horizontally on narrow viewports instead.
- Row states: selectable rows get a filled circle (`✓` in green) vs. empty
  circle (`○` in muted grey) for selection, and a `cardAlt` row background
  when selected. Clicking anywhere in the row toggles selection; a
  right-aligned per-row action (e.g. "Enrich") calls `stopPropagation()` so
  it doesn't also toggle the row.

### 4.5 Inputs & selects

Text inputs are typically borderless and transparent, living *inside* an
already-bordered card (the border belongs to the containing card, not the
input) — e.g. the chat composer textarea, the prospect query input. Standalone
selects (map filter fields) get their own visible border:

```js
const select = {
  background: C.cardAlt, border: '1px solid ' + C.border, borderRadius: 7,
  padding: '8px 10px', color: C.textBody, fontSize: 11.5, outline: 'none',
  appearance: 'none', cursor: 'pointer',
};
```

Placeholder color is the dimmest text token, `textFaint` (`#5D6067`).

### 4.6 Progress / credit meter

A labeled mini-panel: mono "CREDITS" label, right-aligned current/total
count (current in bright text, "/ total" suffix in `textMute`), a 4–5px
pill-shaped track (`border` color) with a fill bar (`green`, or `warn` when
below 10%) animated via `transition: width .35s ease`, and a muted caption
line below (plan name / reset date). This exact shape reappears twice: once
persistent in the sidebar, once expanded (bigger numbers, extra stat rows)
in the Enrich view's side panel.

### 4.7 Stat tiles

Two-line KPI block used side-by-side in pairs: big tabular-nums number
(`text` color, 20px, 700 weight) over a small dim label (`textDim`, 10px),
inside a `cardAlt` box with `border`, radius 9.

### 4.8 Toast

Bottom-right floating confirmation, auto-dismiss after ~2.6s: `card`
background, `borderStrong` border, radius 10, drop shadow, a small green
status dot + message text. One toast at a time (new one replaces old,
resetting the timer) — no stacking/queueing.

### 4.9 Floating map overlays

Controls drawn on top of the map canvas use a translucent dark chip instead
of the opaque `card` token, so the map stays visible through it:
`background: rgba(15,16,18,.93)`, `border: 1px solid borderStrong`,
`backdropFilter: blur(6px)`. Used for: the "pinned" result banner
(top-left), zoom/layer icon buttons (top-right, 34×34 squares), and the
bottom-left action chips ("Find surrounding businesses", "Ask about these
accounts"). The floating "+" add button is the one place a *solid* green
square appears over the map, marking it as the primary/creative action.

### 4.10 Chips / pills

Small rounded-rect (radius 7) or fully-rounded (radius 999) tags used for:
active filter summaries ("Radius: 20 mi"), quick-suggestion prompts under
the chat composer, and status labels ("connected" in green text next to a
data source name).

### 4.11 Avatar / identity badge

24–26px circle, solid color fill unrelated to the main palette (`#1F6F45`
bg / `#DFF7E8` text), initials centered, 10px bold. Reused identically in
the sidebar footer and the map view's top bar.

### 4.12 Empty state

Centered column: a small solid-color square/rounded-square as an icon
placeholder (36×36, green, radius 10), a 20px/600-weight headline, and a
13px `textDim` supporting line. Used for the chat view's zero-message state.

### 4.13 "Thinking"/loading indicator

Three 6px dots in `textMute`, staggered pulse animation:

```css
@keyframes pulseDot { 0%, 100% { opacity: .25 } 50% { opacity: 1 } }
```
```js
animation: `pulseDot 1.1s ${delay}s infinite` // delay: 0, 0.2, 0.4
```

### 4.14 Reveal-to-unlock / masking pattern

A recurring interaction for gated data (contact emails/phones behind a
credit cost): locked cells render literal bullet characters in the exact
shape of the real value (`••••••@domain.com`, `(•••) •••-••••`) in
`textFaint`, with a soft-green "Reveal - N" pill at the row's end. On reveal,
the cell swaps to the real value in `textBody` and the action label changes
to plain muted text ("Revealed"). This is more convincing than blurring —
worth reproducing exactly if the target tool has any paywalled/gated data.

---

## 5. Per-view structure (for exact layout parity)

### Sidebar (`268px`, all tabs)
Logo (48px) + subtitle → tab switcher pill → **[tab-specific body]** → credit
meter → user footer.

- **Chat body:** "+ New chat" (active-styled nav row) + "All chats" → mono
  "RECENT" label → list of recent chat titles (truncated, ellipsis).
- **Map body:** two stat tiles (Total / Showing) → "FILTERS" label + "Clear
  all" → repeatable filter-group cards (field select → "is any of" static
  chip → value select → remove "×") → dashed "+ Add filter group" card.
- **Prospect body:** "New search" (active) / "Saved searches" / "Imported
  lists" nav rows → mono "SOURCES" label → connected-source chips.
- **Enrich body:** "Company lookup" (active) / "Bulk enrich" / "Enrichment
  history" nav rows → mono "CREDIT COSTS" label → price list rows.

### Chat view
46px top bar: chat title (left) + model picker dropdown (right, green status
dot + name + caret; opens a floating menu listing selectable models). Center
column capped at `680px` width: empty state, or a message list (user bubbles
right-aligned in `raised` surface with an asymmetric corner; assistant
messages left-aligned with a green square "avatar" + prose + optional result
table + a primary/ghost action row). Composer pinned at bottom: bordered card
containing a borderless textarea, a footer row with an attach affordance, a
"map context" chip showing the live account count, and a circular green send
button — plus a row of pill-shaped suggestion prompts below the composer.

### Map view
Full-bleed background image/canvas. 46px translucent-free top bar
(`surface` bg, not translucent, since it's not over the map art) with a
search input (card style, left magnifier glyph), a "Sync from Clay" ghost
chip, and the user avatar. Floating (translucent) elements over the canvas:
top-left pinned-result banner (dismissible), top-right vertical stack of
zoom/layers icon buttons + solid-green add button, bottom-left two action
chips.

### Prospect view
46px top bar: "Prospect" title + "Save search" ghost button + primary/
disabled "Add N to map" button that reflects selection count live. Body:
query composer card (borderless input + filter chips) → results meta row
(mono "N RESULTS - N SELECTED" + sort indicator) → selectable results table
(checkbox-style circle, property/type/city/turf/value columns, per-row
"Enrich" ghost chip).

### Enrich view
46px top bar: company name + an origin chip explaining *how* this company
entered the view (e.g. "from map - Lehi, UT") + live credit balance + a
primary/disabled "Reveal all" button. Two-column body (wraps responsively):
left column (~620px) has a search/find-contacts card, a contacts table with
the reveal-to-unlock pattern, and a ghost-button action row (Push to CRM /
Export CSV / Draft outreach); right column (~280–300px) stacks a "Company
profile" key-value card and a "This month" usage card (big number, progress
bar, two stat rows, "Buy more credits" ghost button).

---

## 6. Interaction & state conventions

- Everything clickable is `cursor: pointer` (or `not-allowed`/`default` when
  disabled) — there's no other hover treatment on most rows/chips in the
  demo; rely on cursor + occasional background swap (selected row, active
  nav item) rather than elaborate hover animations.
- Disabled buttons follow one formula everywhere: swap fill to `cardAlt`,
  text to `textFaint`, border to plain `border` (not `borderStrong`), and
  change the label text to reflect *why* ("Select accounts" instead of a
  greyed-out "Add to map").
- Active/selected state is shown by background fill (`cardAlt` for
  list rows, solid `white` for the tab pill), not by border color changes.
- Section headers inside any panel are always the mono micro-label style
  (10–10.5px, `textDim` or `textMute`, `.08–.12em` tracking, uppercase
  copy) — this is the connective tissue that makes disparate panels feel
  like one system.
- Numbers that update live (credits, counts) always use `tabular-nums` and
  animate underlying bars with `transition: width .35s ease`, never a hard
  cut.
- Transient feedback (toast) confirms every credit-spending or data-mutating
  action ("2 credits used - contact revealed", "CSV exported - 12 rows").

---

## 7. Assets to bring over

- **Fonts:** Inter Tight (400/500/600/700) + JetBrains Mono (400/500) via
  Google Fonts `<link>` tags (see §2.2), or self-hosted equivalents.
- **Logo:** the demo uses the *actual client's* rustic logo
  (`public/logo.png`, a green hand-drawn landscaping mark) as a placeholder
  inside an otherwise modern dark shell — this is intentionally a stand-in.
  **Swap for the target tool's real logo/wordmark**; only the *slot*
  (48px-tall image, top-left of sidebar, `alignSelf: flex-start`) and the
  one-line subtitle beneath it are part of the reusable pattern, not this
  specific artwork.
- **Map art:** `public/map-canvas.png` is a static screenshot standing in
  for a live map SDK (Mapbox, per the README) — not a design asset, replace
  with the real canvas per §3.3.
- **Favicon:** none is set in the demo (`index.html` has no `<link
  rel="icon">`) — add one for the target tool.

---

## 8. Portable source files

Copy these two files as-is into the target repo (adjust the import path if
the target isn't using bare ESM/Vite), then rebuild components against `C`
and the shared style objects rather than one-off hex values.

**`theme.js`** — full file at `exports/vercel/src/theme.js` in this repo (see
§2.1/§2.4 above for the complete contents).

**`index.css`** — full file at `exports/vercel/src/index.css`:

```css
html, body, #root { margin: 0; height: 100%; background: #0B0B0D; }
body { font-family: 'Inter Tight', system-ui, sans-serif; }
* { box-sizing: border-box; }
a { color: #2BD576; text-decoration: none; }
a:hover { color: #7EE8AC; }
input, select, textarea { font-family: inherit; }
input::placeholder, textarea::placeholder { color: #5D6067; }
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-thumb { background: #26282C; border-radius: 99px; }
::-webkit-scrollbar-track { background: transparent; }
@keyframes pulseDot { 0%, 100% { opacity: .25 } 50% { opacity: 1 } }
```

The four view components (`src/views/*.jsx`) and shared components
(`src/components/*.jsx`) in this repo are the reference implementation for
every pattern described in §4–5 — read them directly when porting a specific
screen, since they contain the exact JSX structure and inline style values
this document summarizes.

---

## 9. Notes for applying this to a different, already-built tool

1. **Treat this as a skin + shell pattern, not a data model.** Nothing here
   assumes any particular backend — port the tokens (§2), the shell/tab
   architecture (§3), and the component shapes (§4) independently of the
   demo's fake data (`data.js`) and canned interactions (`App.jsx`).
2. **Map the target tool's existing N screens onto the tab-switcher +
   per-tab-sidebar-body shell** (§3.1, §3.4) rather than keeping its old
   navigation chrome — that's the biggest visual identity swap.
3. **Convert inline styles to whatever the target repo already uses**
   (Tailwind classes, CSS modules, styled-components) but keep the *token
   values* identical — the easiest path is generating Tailwind theme
   extensions or CSS custom properties directly from the `C` object in
   §2.1.
4. **Keep the "stay mounted" rule (§3.3)** for any screen wrapping an
   expensive SDK in the target tool (maps, charts, editors, video).
5. **Reuse the reveal-to-unlock masking pattern (§4.14)** for any gated/paid
   data the target tool has, and the disabled-button formula (§6) for every
   button whose availability depends on state — these are the two patterns
   most likely to otherwise get reinvented inconsistently.
6. **Replace branding assets** (§7) but keep every slot dimension (48px
   logo height, 268px sidebar width, 46px top bar height) so the layout
   rhythm doesn't shift.
