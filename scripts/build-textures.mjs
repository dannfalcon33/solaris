/**
 * Pipeline de texturas: convierte las fuentes de `assets-src/` en niveles de
 * calidad (2k / 4k / 8k) WebP servidos desde `public/textures/`.
 *
 *   npm run textures
 *
 * Las fuentes originales NO se versionan (ver docs/ASSETS.md para su
 * procedencia, URL y hash SHA-256).
 */
import { mkdir, stat, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = (...p) => join(root, 'assets-src', ...p)
const out = (...p) => join(root, 'public', 'textures', ...p)

/** Ancho por nivel (alto = ancho / 2, proyección equirectangular 2:1). */
const TIERS = { '2k': 2048, '4k': 4096, '8k': 8192 }

/** Fuente → nombre de salida + parámetros de codificación. */
const EARTH = [
  { in: '8k_earth_daymap.jpg', name: 'day', quality: 90 },
  { in: '8k_earth_nightmap.jpg', name: 'night', quality: 90 },
  { in: '8k_earth_clouds.jpg', name: 'clouds', quality: 88, grayscale: true },
  { in: '8k_earth_normal_map.tif', name: 'normal', quality: 95 },
  { in: '8k_earth_specular_map.tif', name: 'specular', quality: 90, grayscale: true },
]
const SKY = [{ in: '8k_stars_milky_way.jpg', name: 'milkyway', quality: 88 }]

const report = []

async function build(group, folder, items) {
  for (const item of items) {
    const input = src(folder, item.in)
    const meta = await sharp(input, { limitInputPixels: false }).metadata()
    console.log(`\n${item.in}: ${meta.width}x${meta.height} ${meta.format} ch=${meta.channels} depth=${meta.depth}`)
    for (const [tier, width] of Object.entries(TIERS)) {
      const dir = out(group, tier)
      await mkdir(dir, { recursive: true })
      const file = join(dir, `${item.name}.webp`)
      let img = sharp(input, { limitInputPixels: false })
      if (width !== meta.width) {
        img = img.resize(width, width / 2, { kernel: 'lanczos3', fit: 'fill' })
      }
      if (item.grayscale) img = img.toColourspace('b-w')
      await img.webp({ quality: item.quality, effort: 5, smartSubsample: false }).toFile(file)
      const { size } = await stat(file)
      console.log(`  ${tier} -> ${item.name}.webp  ${(size / 1024 / 1024).toFixed(2)} MB`)
      report.push({ group, tier, name: item.name, width, height: width / 2, bytes: size })
    }
  }
}

await build('earth', 'earth', EARTH)
await build('sky', 'sky', SKY)
await writeFile(out('manifest.json'), JSON.stringify(report, null, 2))
console.log('\nOK -> public/textures/manifest.json')

