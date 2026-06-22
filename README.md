# Eurêka

A playful, French-language web game that helps a curious 10–12-year-old discover
that mathematics is far bigger and stranger than school shows. It runs on a phone
or tablet, installs to the home screen, and works offline.

Each topic is a **world** with the same four-step loop:

> **l'étincelle** (a spark of wonder) → **l'idée** (the idea) → **le jeu** (a hands-on
> mini-game) → **la découverte** (a collectible "merveille" card + a door to what's next)

The first world, **Les codes secrets**, teaches the Caesar cipher with a working
decoder dial. Five worlds ship today — codes, **Les nombres sans fin** (infinity),
**Le monde des motifs** (symmetry), **Le grand hasard** (probability) and
**Les formes impossibles** (the Möbius strip) — each built the same pluggable way;
see [How to add a new world](#how-to-add-a-new-world). New worlds can still be staged
as friendly "bientôt" placeholders (`status: 'soon'`).

## Privacy (a hard rule — this is for a child)

- No accounts, no sign-in, no analytics, no ads, **no third-party network calls**, no
  tracking of any kind.
- All progress lives on the device in `localStorage`. The only personal input is the
  nickname she gives the fox guide, stored locally.
- Fonts are self-hosted (bundled into the build), so nothing is fetched from Google
  Fonts or any CDN at runtime.

## Tech

- **Vite + React** (plain JavaScript / JSX), no backend.
- A small **world engine** renders any world from a definition — adding a world is
  writing content + a mini-game, not touching the engine.
- Styling carries over the prototype's design tokens (CSS custom properties) and class
  names, organised into per-component stylesheets.
- **PWA** via `vite-plugin-pwa` (installable, offline app shell + fonts).
- Self-hosted **Fredoka** + **Nunito** via `@fontsource` (Latin subsets only), with
  `system-ui` fallbacks.

## Run it

Requires Node 18+ (developed on Node 22).

```bash
npm install        # install dependencies
npm run dev        # start the dev server  → http://localhost:5173
npm run build      # production build       → dist/
npm run preview    # serve the production build → http://localhost:4173
npm run icons      # regenerate PWA icons from assets-source/icon.svg (see below)
```

`npm run dev` is the single command to start developing. The service worker is disabled
in dev (so there's no caching to fight); it's active in `build`/`preview` and in production.

## Deploy as a static site

The build output in `dist/` is fully static — host it anywhere.

### Netlify

- Build command: `npm run build`
- Publish directory: `dist`

(Or drag-and-drop the `dist/` folder onto Netlify.) No redirects needed; the app has a
single page.

### Vercel

- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`

### GitHub Pages

GitHub **project** sites are served from a sub-path (`https://user.github.io/<repo>/`),
so set the matching base path before building:

1. In `vite.config.js`, set `base: '/<repo>/'` (keep the leading and trailing slash).
2. `npm run build`
3. Publish the `dist/` folder to the `gh-pages` branch (e.g. with the `gh-pages` package,
   or GitHub Actions, or by committing `dist/` to that branch).

For a Netlify/Vercel/root deploy, leave `base: '/'` (the default). A **user/organisation**
GitHub Pages site (`https://user.github.io/`) is also served at the root, so it keeps
`base: '/'` too.

## PWA icons

The icon set is generated from a single source SVG so the brand stays consistent:

- Source: `assets-source/icon.svg` (the fox guide + a spark on the purple brand colour).
- Generator: `npm run icons` rasterises it (via `sharp`) into `/public`:
  `pwa-192x192.png`, `pwa-512x512.png`, `maskable-512x512.png`, `apple-touch-icon.png`,
  and a copy of `icon.svg`.

The generated PNGs are committed, so a normal `npm run build` never needs `sharp`. Only
re-run `npm run icons` when you change the source SVG.

## Project structure

```
math_learn/
├─ index.html                 # app shell host + meta/icons
├─ vite.config.js             # Vite + PWA (manifest, offline precache)
├─ assets-source/icon.svg     # source icon for the PWA icon set
├─ scripts/generate-icons.mjs # npm run icons
├─ public/                    # generated PWA icons (committed)
└─ src/
   ├─ main.jsx                # entry: fonts + global CSS + <App/>
   ├─ App.jsx                 # providers + the .app frame + view router
   ├─ fonts.js                # self-hosted @fontsource imports (Latin subsets)
   ├─ theme.js                # colour-name → CSS variables map
   ├─ icons.jsx               # all SVG icons as React components
   ├─ styles/                 # tokens.css, base.css, shell.css (shared)
   ├─ lib/                    # caesar.js, random.js, storage.js
   ├─ state/AppContext.jsx    # persisted state (name, cards, completed, lastOpened)
   ├─ components/             # Fox, Confetti, Toast, BottomNav, LoopBar,
   │                          # WonderCard, Welcome, WorldMap, Collection,
   │                          # Profil, WorldLoop (the engine) + per-component CSS
   ├─ cards/index.js          # wonder-card registry
   └─ worlds/
      ├─ index.js             # the WORLDS registry (add a world here)
      ├─ codes/               # ← fully-implemented reference world
      │  ├─ index.js          #   the world definition
      │  ├─ steps.jsx         #   Etincelle / Idee / Decouverte content
      │  ├─ CodesGame.jsx     #   the decoder mini-game (le jeu)
      │  ├─ session.js        #   per-play secret message + random shift
      │  ├─ messages.js       #   the pool of fun French sentences
      │  └─ codes.css         #   world-specific styles
      ├─ infinity/ motifs/ hasard/ formes/   # "bientôt" placeholders
```

### How it fits together

- `src/worlds/index.js` exports the `WORLDS` array. The home map renders one tile per
  world; `status: 'available'` worlds are playable, `status: 'soon'` worlds are locked
  and show a friendly toast.
- Opening a world hands its definition to **`WorldLoop`** (`src/components/WorldLoop.jsx`),
  the engine. The engine owns the loopbar, step dots, transitions, confetti and
  navigation. It calls `createSession()` once (per visit) and passes the result to each
  step.
- The world's `Game` receives **`onSolve()`**. When the player finishes, the game calls
  `onSolve()`, which **awards the world's wonder card(s), marks the world complete, and
  advances the loop to la découverte**.
- Earned cards are looked up in `src/cards/index.js` and shown in the Collection.
- Everything is themed from the world's `color` (one of the names in `src/theme.js`).

## How to add a new world

Worlds are pluggable. You write content + a mini-game; the engine does the rest. Here's
the whole process, end to end. (Use `src/worlds/codes/` as the reference implementation.)

### 1. (Optional) Add a wonder card

In `src/cards/index.js`, add the card(s) your world grants:

```js
export const CARDS = {
  // ...existing cards
  monNombre: {
    id: 'monNombre',
    world: 'monMonde',
    color: 'purple',                 // a name from src/theme.js (tints the card)
    rarity: 'Rare',
    sym: '∞',                        // the big glyph on the card
    title: 'Le nom de la merveille',
    fact: 'Une phrase courte pour la Collection.',
    factLong: 'Une phrase plus longue pour le grand moment de la découverte.',
  },
}
```

### 2. Create the world folder

`src/worlds/monMonde/` with these files:

**`steps.jsx`** — the content for three of the four loop steps. The engine supplies the
eyebrow label ("L'étincelle", etc.); you supply the heading, copy and the button.

```jsx
// l'étincelle — props: { session, onNext }
export function Etincelle({ session, onNext }) {
  return (
    <>
      <h2 className="h2">Un titre qui intrigue</h2>
      <p className="body">Le moment "wow" qui donne envie de comprendre.</p>
      <button className="btn btn-block" onClick={onNext}>Montre-moi</button>
    </>
  )
}

// l'idée — props: { session, onNext }
export function Idee({ onNext }) {
  return (
    <>
      <h2 className="h2">L'idée, simplement</h2>
      <p className="body">Explique l'astuce, idéalement avec un petit interactif.</p>
      <button className="btn btn-block" onClick={onNext}>J'ai compris</button>
    </>
  )
}

// la découverte — props: { session, onFinish }
import { CARDS } from '../../cards/index.js'
import { WonderCard } from '../../components/WonderCard.jsx'

export function Decouverte({ onFinish }) {
  return (
    <>
      <h2 className="h2">Une merveille pour toi !</h2>
      <WonderCard card={CARDS.monNombre} pop />
      <div className="door">
        <p className="body"><b>Et le monde s'agrandit :</b> la porte vers la suite.</p>
      </div>
      <button className="btn btn-block" onClick={onFinish}>Ajouter à ma collection</button>
    </>
  )
}
```

**`Game.jsx`** — le jeu. It receives **`onSolve`** and calls it when the player succeeds.
Tone: encouraging, never punishing — no "wrong"/"fail" language.

```jsx
export default function Game({ session, onSolve }) {
  return (
    <>
      <h2 className="h2">À toi de jouer</h2>
      {/* ...your interactive mini-game... */}
      {/* when the player succeeds, show a celebration, then: */}
      <button className="btn btn-block" onClick={onSolve}>Continuer</button>
    </>
  )
}
```

Need a celebration burst? `import { useConfetti } from '../../components/Confetti.jsx'`
and call `fire()`. Need per-play data shared across steps (like the codes world's random
secret), add a `session.js` exporting `makeSession()` and wire it via `createSession`.

**Scope your CSS.** The engine puts a `world-<id>` class on the loop root (e.g.
`.world-motifs`), so every selector in a world's stylesheet must be namespaced under it
(`.world-motifs .my-thing { … }`). This keeps a world's styles from leaking into the
rest of the app. Genuinely shared button variants (`.btn`, `.btn-block`, `.btn:disabled`,
`.btn-soft`) live in `src/styles/base.css` — reuse those rather than redefining them in a
world. Respect `prefers-reduced-motion` (snap/static instead of animating), as the engine
and existing worlds do.

**`index.js`** — the world definition (this is the contract the engine reads):

```js
import { InfinityIcon } from '../../icons.jsx'
import { Etincelle, Idee, Decouverte } from './steps.jsx'
import Game from './Game.jsx'
// import { makeSession } from './session.js'  // optional
// import './monMonde.css'                      // optional world-specific styles

export default {
  id: 'monMonde',                 // unique; also the completion key
  name: 'Mon nouveau monde',
  icon: InfinityIcon,             // a component from src/icons.jsx
  color: 'purple',                // a name from src/theme.js — themes the whole loop
  status: 'available',            // 'available' = playable, 'soon' = locked placeholder
  cards: ['monNombre'],           // wonder-card ids granted on solve
  // createSession: makeSession,  // optional per-play data → passed to every step
  etincelle: Etincelle,
  idee: Idee,
  Game,
  decouverte: Decouverte,
}
```

### 3. Register it

Add it to the array in `src/worlds/index.js`:

```js
import monMonde from './monMonde/index.js'
export const WORLDS = [codes, monMonde, infinity, motifs, hasard, formes]
```

That's it. The world appears on the map, themed in its colour, with the full four-step
loop, confetti, card reward, persistence and navigation handled by the engine. To ship a
world as a teaser instead, set `status: 'soon'` and omit the step/Game/cards fields — it
shows as a locked "Bientôt" tile.

### Mini-game contract (the one rule)

Your `Game` gets `onSolve()`. Call it when the player finishes. The engine then awards the
card(s), marks the world complete, and moves to la découverte. The puzzle messages in the
codes world must be uppercase A–Z + spaces only (the Caesar cipher only shifts A–Z) — your
own game can use whatever data it likes.
