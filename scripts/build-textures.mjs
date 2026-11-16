/**
 * Pipeline de texturas: convierte las fuentes de `assets-src/` en niveles de
 * calidad (2k / 4k / 8k) WebP servidos desde `public/textures/`.
 *
 *   npm run textures
 *
 * Las fuentes originales NO se versionan (ver docs/ASSETS.md para su
 * procedencia, URL, licencia CC BY 4.0 y hash SHA-256).
 */
import { mkdir, stat, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = (...p) => join(root, 'assets-src', ...p)
const out = (...p) => join(root, 'public', 'textures', ...p)

/** Ancho por nivel (el alto conserva la proporción original del mapa). */
const TIERS = { '2k': 2048, '4k': 4096, '8k': 8192 }

const GROUPS = {
  earth: [
    { in: '8k_earth_daymap.jpg', name: 'day', quality: 90 },
    { in: '8k_earth_nightmap.jpg', name: 'night', quality: 90 },
    { in: '8k_earth_clouds.jpg', name: 'clouds', quality: 88, grayscale: true },
    { in: '8k_earth_normal_map.tif', name: 'normal', quality: 95 },
    { in: '8k_earth_specular_map.tif', name: 'specular', quality: 90, grayscale: true },
  ],
  sky: [{ in: '8k_stars_milky_way.jpg', name: 'milkyway', quality: 88 }],
  sun: [{ in: '8k_sun.jpg', name: 'albedo', quality: 90 }],
  mercury: [{ in: '8k_mercury.jpg', name: 'albedo', quality: 86 }],
  venus: [
    { in: '8k_venus_surface.jpg', name: 'surface', quality: 86 },
    { in: '4k_venus_atmosphere.jpg', name: 'atmosphere', quality: 90 },
  ],
  mars: [{ in: '8k_mars.jpg', name: 'albedo', quality: 88 }],
  jupiter: [{ in: '8k_jupiter.jpg', name: 'albedo', quality: 90 }],
  saturn: [
    { in: '8k_saturn.jpg', name: 'albedo', quality: 90 },
    { in: '8k_saturn_ring_alpha.png', name: 'rings', quality: 94, alphaQuality: 100 },
  ],
}

const force = process.argv.includes('--force')
const report = []

for (const [group, items] of Object.entries(GROUPS)) {
  for (const item of items) {
    const input = src(group, item.in)
    const meta = await sharp(input, { limitInputPixels: false }).metadata()
    console.log(`\n[${group}] ${item.in}: ${meta.width}x${meta.height} ${meta.format}`)
    for (const [tier, width] of Object.entries(TIERS)) {
      const dir = out(group, tier)
      await mkdir(dir, { recursive: true })
      const file = join(dir, `${item.name}.webp`)
      const height = Math.max(1, Math.round((width * meta.height) / meta.width))
      const existing = !force ? await stat(file).catch(() => null) : null
      if (existing && existing.size > 1024) {
        console.log(`  ${tier} (${width}x${height}) -> ${item.name}.webp  (ya existe, ${(existing.size / 1024 / 1024).toFixed(2)} MB)`)
        report.push({ group, tier, name: item.name, width, height, bytes: existing.size })
        continue
      }
      let img = sharp(input, { limitInputPixels: false })
      if (width !== meta.width || height !== meta.height) {
        img = img.resize(width, height, { kernel: 'lanczos3', fit: 'fill' })
      }
      if (item.grayscale) img = img.toColourspace('b-w')
      await img
        .webp({
          quality: item.quality,
          alphaQuality: item.alphaQuality ?? 100,
          effort: 3,
          smartSubsample: false,
        })
        .toFile(file)
      const { size } = await stat(file)
      console.log(`  ${tier} (${width}x${height}) -> ${item.name}.webp  ${(size / 1024 / 1024).toFixed(2)} MB`)
      report.push({ group, tier, name: item.name, width, height, bytes: size })
    }
  }
}

await writeFile(out('manifest.json'), JSON.stringify(report, null, 2))
console.log('\nOK -> public/textures/manifest.json')
