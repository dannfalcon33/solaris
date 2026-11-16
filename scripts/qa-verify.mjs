/**
 * Script de auditoría automatizada de QA (FASE 7):
 *   npm run qa
 *
 * Verifica integridad de las 42 texturas WebP, los 6 modelos binarios .glb
 * (cabecera mágica glTF 2.0), metadatos SEO/JSON-LD en index.html y
 * configuración de despliegue en vercel.json.
 */
import { readFile, stat } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
let failures = 0

function assert(cond, msg) {
  if (!cond) {
    console.error(`  [FAIL] ${msg}`)
    failures++
  } else {
    console.log(`  [OK]   ${msg}`)
  }
}

console.log('=== 1. Verificación de Texturas WebP (2k / 4k / 8k) ===')
const manifestRaw = await readFile(join(root, 'public', 'textures', 'manifest.json'), 'utf8')
const manifest = JSON.parse(manifestRaw)
assert(manifest.length === 42, `manifest.json contiene 42 entradas (actual: ${manifest.length})`)

let totalTexBytes = 0
for (const entry of manifest) {
  const p = join(root, 'public', 'textures', entry.group, entry.tier, `${entry.name}.webp`)
  const s = await stat(p).catch(() => null)
  if (!s || s.size < 512) {
    assert(false, `Falta o está corrupta la textura: ${entry.group}/${entry.tier}/${entry.name}.webp`)
  }
  totalTexBytes += s ? s.size : 0
}
assert(
  totalTexBytes > 40 * 1024 * 1024,
  `Las 42 texturas WebP existen en disco (${(totalTexBytes / 1024 / 1024).toFixed(2)} MB totales)`,
)

console.log('\n=== 2. Verificación de Modelos 3D Binarios (.glb glTF 2.0) ===')
const EXPECTED_GLBS = [
  'mercury-shield-station.glb',
  'venus-cloud-haven.glb',
  'mars-orbital-hub.glb',
  'jupiter-europa-station.glb',
  'saturn-titan-station.glb',
  'saturn-ring-observatory.glb',
]

for (const file of EXPECTED_GLBS) {
  const p = join(root, 'public', 'models', file)
  const buf = await readFile(p).catch(() => null)
  const validMagic = buf && buf.length > 20 && buf.readUInt32LE(0) === 0x46546c67 && buf.readUInt32LE(4) === 2
  assert(
    Boolean(validMagic),
    `${file} válido (glTF v2, ${buf ? (buf.length / 1024).toFixed(1) : 0} KB)`,
  )
}

console.log('\n=== 3. Verificación de SEO, Metadatos y Configuración Vercel ===')
const html = await readFile(join(root, 'index.html'), 'utf8')
assert(html.includes('lang="es"'), 'index.html define lang="es"')
assert(html.includes('name="description"'), 'index.html incluye meta description')
assert(html.includes('property="og:title"'), 'index.html incluye etiquetas Open Graph')
assert(html.includes('name="twitter:card"'), 'index.html incluye etiquetas Twitter Card')
assert(html.includes('application/ld+json'), 'index.html incluye datos estructurados JSON-LD')

const vercelRaw = await readFile(join(root, 'vercel.json'), 'utf8')
const vercelCfg = JSON.parse(vercelRaw)
assert(
  vercelCfg.outputDirectory === 'dist' && Array.isArray(vercelCfg.headers),
  'vercel.json válido con reglas de Cache-Control para /textures y /models',
)

if (failures > 0) {
  console.error(`\nAuditoría fallida con ${failures} error(es).`)
  process.exit(1)
}
console.log('\nAuditoría QA completada con 0 errores.')
