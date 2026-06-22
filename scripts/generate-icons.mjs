// Generates the PWA icon set from a single source SVG (assets-source/icon.svg).
// Run with:  npm run icons
// The generated PNGs live in /public and are committed, so the production build
// never depends on `sharp`. Re-run this only when the source icon changes.
import sharp from 'sharp'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, 'assets-source', 'icon.svg')
const pub = join(root, 'public')

const targets = [
  ['pwa-192x192.png', 192],
  ['pwa-512x512.png', 512],
  ['maskable-512x512.png', 512],
  ['apple-touch-icon.png', 180],
]

const svg = await readFile(src)
await mkdir(pub, { recursive: true })

for (const [name, size] of targets) {
  // High density keeps the rasterised SVG crisp at every size.
  await sharp(svg, { density: 384 }).resize(size, size).png().toFile(join(pub, name))
  console.log('✓', name)
}

// Keep an SVG favicon alongside the PNGs.
await writeFile(join(pub, 'icon.svg'), svg)
console.log('✓ icon.svg')
console.log('Done — icons written to /public')
