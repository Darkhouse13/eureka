// Self-hosted fonts via @fontsource. Vite bundles the woff2 files into the
// build (hashed) and the PWA precaches them, so the app works offline.
// Weights match the prototype: Fredoka 400/500/600, Nunito 400/600/700.
// We import only the Latin + Latin-ext subsets (everything French needs) to
// keep the offline cache small — no Cyrillic/Greek/Vietnamese, etc.
import '@fontsource/fredoka/latin-400.css'
import '@fontsource/fredoka/latin-500.css'
import '@fontsource/fredoka/latin-600.css'
import '@fontsource/fredoka/latin-ext-400.css'
import '@fontsource/fredoka/latin-ext-500.css'
import '@fontsource/fredoka/latin-ext-600.css'

import '@fontsource/nunito/latin-400.css'
import '@fontsource/nunito/latin-600.css'
import '@fontsource/nunito/latin-700.css'
import '@fontsource/nunito/latin-ext-400.css'
import '@fontsource/nunito/latin-ext-600.css'
import '@fontsource/nunito/latin-ext-700.css'
