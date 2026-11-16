/**
 * Generador de modelos 3D binarios glTF 2.0 (.glb) para las estaciones e
 * instalaciones orbitales de SOLARIS (FASE 4).
 *
 *   node scripts/build-models.mjs
 *
 * Construye 6 archivos .glb optimizados en `public/models/` usando geometrías
 * de Three.js y empaquetado binario estándar glTF 2.0 (autoría propia del
 * proyecto, licencia CC0 / MIT, documentados en docs/ASSETS.md).
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  BoxGeometry,
  ConeGeometry,
  CylinderGeometry,
  Matrix4,
  OctahedronGeometry,
  RingGeometry,
  SphereGeometry,
  TorusGeometry,
  Vector3,
} from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'models')

/** Transforma una geometría in-place (posición, rotación Euler XYZ, escala). */
function xform(geo, { pos = [0, 0, 0], rot = [0, 0, 0], scale = [1, 1, 1] } = {}) {
  const g = geo.clone()
  const m = new Matrix4()
  const rx = new Matrix4().makeRotationX(rot[0])
  const ry = new Matrix4().makeRotationY(rot[1])
  const rz = new Matrix4().makeRotationZ(rot[2])
  m.multiply(rz).multiply(ry).multiply(rx)
  m.scale(new Vector3(...scale))
  m.setPosition(...pos)
  g.applyMatrix4(m)
  // Aseguramos solo position y normal desindexados para un GLB compacto y limpio.
  const out = g.index ? g.toNonIndexed() : g
  out.deleteAttribute('uv')
  return out
}

function merge(parts) {
  const merged = mergeGeometries(parts, false)
  merged.computeVertexNormals()
  return merged
}

/** Materiales PBR reutilizables en especificación glTF 2.0. */
const MATERIALS = {
  titaniumHull: {
    name: 'TitaniumHull',
    pbrMetallicRoughness: {
      baseColorFactor: [0.82, 0.85, 0.88, 1.0],
      metallicFactor: 0.78,
      roughnessFactor: 0.32,
    },
  },
  darkFrame: {
    name: 'DarkStructure',
    pbrMetallicRoughness: {
      baseColorFactor: [0.18, 0.22, 0.26, 1.0],
      metallicFactor: 0.85,
      roughnessFactor: 0.42,
    },
  },
  solarArray: {
    name: 'SolarCells',
    pbrMetallicRoughness: {
      baseColorFactor: [0.06, 0.16, 0.34, 1.0],
      metallicFactor: 0.92,
      roughnessFactor: 0.18,
    },
  },
  goldFoil: {
    name: 'ThermalGoldFoil',
    pbrMetallicRoughness: {
      baseColorFactor: [0.94, 0.72, 0.28, 1.0],
      metallicFactor: 0.94,
      roughnessFactor: 0.22,
    },
  },
  bronzeShell: {
    name: 'AerostatBronze',
    pbrMetallicRoughness: {
      baseColorFactor: [0.88, 0.68, 0.44, 1.0],
      metallicFactor: 0.68,
      roughnessFactor: 0.28,
    },
  },
  habLights: {
    name: 'HabWindowGlow',
    pbrMetallicRoughness: {
      baseColorFactor: [1.0, 0.92, 0.76, 1.0],
      metallicFactor: 0.1,
      roughnessFactor: 0.2,
    },
    emissiveFactor: [1.0, 0.85, 0.58],
  },
  tealBeacons: {
    name: 'TealNavBeacon',
    pbrMetallicRoughness: {
      baseColorFactor: [0.0, 0.9, 0.76, 1.0],
      metallicFactor: 0.1,
      roughnessFactor: 0.2,
    },
    emissiveFactor: [0.0, 0.95, 0.82],
  },
}

/**
 * Empaqueta una lista de nodos `{ name, parts: [{ geometry, material }] }` en un
 * archivo binario `.glb` estándar (glTF 2.0).
 */
function buildGlb(nodesSpec) {
  const materialKeys = Object.keys(MATERIALS)
  const matIndex = Object.fromEntries(materialKeys.map((k, i) => [k, i]))

  const bufferViews = []
  const accessors = []
  const meshes = []
  const nodes = []
  const chunks = []
  let byteOffset = 0

  function appendFloat32(array, type) {
    const buf = Buffer.from(array.buffer, array.byteOffset, array.byteLength)
    const pad = (4 - (buf.length % 4)) % 4
    const padded = pad ? Buffer.concat([buf, Buffer.alloc(pad)]) : buf

    let min = [Infinity, Infinity, Infinity]
    let max = [-Infinity, -Infinity, -Infinity]
    const count = array.length / 3
    for (let i = 0; i < count; i++) {
      const x = array[i * 3]
      const y = array[i * 3 + 1]
      const z = array[i * 3 + 2]
      if (x < min[0]) min[0] = x
      if (y < min[1]) min[1] = y
      if (z < min[2]) min[2] = z
      if (x > max[0]) max[0] = x
      if (y > max[1]) max[1] = y
      if (z > max[2]) max[2] = z
    }

    const viewIdx = bufferViews.length
    bufferViews.push({
      buffer: 0,
      byteOffset,
      byteLength: buf.length,
      target: 34962, // ARRAY_BUFFER
    })
    chunks.push(padded)
    byteOffset += padded.length

    const accIdx = accessors.length
    accessors.push({
      bufferView: viewIdx,
      componentType: 5126, // FLOAT
      count,
      type,
      min,
      max,
    })
    return accIdx
  }

  let totalTriangles = 0

  for (const nodeSpec of nodesSpec) {
    const primitives = []
    for (const part of nodeSpec.parts) {
      const posAttr = part.geometry.getAttribute('position')
      const normAttr = part.geometry.getAttribute('normal')
      const posAcc = appendFloat32(posAttr.array, 'VEC3')
      const normAcc = appendFloat32(normAttr.array, 'VEC3')
      totalTriangles += posAttr.count / 3
      primitives.push({
        attributes: { POSITION: posAcc, NORMAL: normAcc },
        material: matIndex[part.material],
        mode: 4, // TRIANGLES
      })
    }
    const meshIdx = meshes.length
    meshes.push({ name: nodeSpec.name, primitives })
    nodes.push({ name: nodeSpec.name, mesh: meshIdx })
  }

  const gltf = {
    asset: {
      version: '2.0',
      generator: 'SOLARIS Interplanetary GLB Pipeline (Phase 4)',
      copyright: '2026 SOLARIS Interplanetary — CC0 / First-party asset',
    },
    scene: 0,
    scenes: [{ name: 'StationScene', nodes: nodes.map((_, i) => i) }],
    nodes,
    meshes,
    materials: materialKeys.map((k) => MATERIALS[k]),
    accessors,
    bufferViews,
    buffers: [{ byteLength: byteOffset }],
  }

  const jsonStr = JSON.stringify(gltf)
  const jsonPad = (4 - (Buffer.byteLength(jsonStr, 'utf8') % 4)) % 4
  const jsonBuf = Buffer.from(jsonStr + ' '.repeat(jsonPad), 'utf8')
  const binBuf = Buffer.concat(chunks)

  const totalLength = 12 + 8 + jsonBuf.length + 8 + binBuf.length
  const header = Buffer.alloc(12)
  header.writeUInt32LE(0x46546c67, 0) // 'glTF'
  header.writeUInt32LE(2, 4) // version 2
  header.writeUInt32LE(totalLength, 8)

  const jsonHeader = Buffer.alloc(8)
  jsonHeader.writeUInt32LE(jsonBuf.length, 0)
  jsonHeader.writeUInt32LE(0x4e4f534a, 4) // 'JSON'

  const binHeader = Buffer.alloc(8)
  binHeader.writeUInt32LE(binBuf.length, 0)
  binHeader.writeUInt32LE(0x004e4942, 4) // 'BIN\0'

  return {
    buffer: Buffer.concat([header, jsonHeader, jsonBuf, binHeader, binBuf]),
    triangles: Math.round(totalTriangles),
  }
}

/* ================================================================== */
/* 1. MERCURY — Solar Frontier Thermal Shield & Relay Station         */
/* ================================================================== */
function createMercuryStation() {
  // Escudo térmico multicapa orientado hacia +Z (el componente lo orienta al Sol)
  const shield = merge([
    xform(new CylinderGeometry(1.15, 0.95, 0.08, 32), { rot: [Math.PI / 2, 0, 0], pos: [0, 0, 0.55] }),
    xform(new CylinderGeometry(0.92, 0.78, 0.06, 32), { rot: [Math.PI / 2, 0, 0], pos: [0, 0, 0.4] }),
    xform(new ConeGeometry(0.28, 0.35, 24), { rot: [Math.PI / 2, 0, 0], pos: [0, 0, 0.72] }),
  ])

  const hull = merge([
    xform(new CylinderGeometry(0.22, 0.26, 1.65, 24), { rot: [Math.PI / 2, 0, 0], pos: [0, 0, -0.35] }),
    xform(new CylinderGeometry(0.36, 0.36, 0.42, 24), { rot: [Math.PI / 2, 0, 0], pos: [0, 0, -0.25] }),
    xform(new SphereGeometry(0.24, 20, 14), { pos: [0, 0, -1.2] }),
  ])

  const struts = merge([
    xform(new BoxGeometry(1.9, 0.05, 0.06), { pos: [0, 0, -0.55] }),
    xform(new BoxGeometry(0.05, 1.6, 0.06), { pos: [0, 0, -0.55] }),
    // Radiadores criogénicos en la sombra
    xform(new BoxGeometry(0.75, 0.02, 0.42), { pos: [0.62, 0, -0.78] }),
    xform(new BoxGeometry(0.75, 0.02, 0.42), { pos: [-0.62, 0, -0.78] }),
  ])

  const rotor = merge([
    xform(new TorusGeometry(0.56, 0.055, 14, 36), { pos: [0, 0, -0.25] }),
    xform(new BoxGeometry(1.1, 0.04, 0.04), { pos: [0, 0, -0.25] }),
  ])

  const beacons = merge([
    xform(new SphereGeometry(0.045, 10, 8), { pos: [0, 0.82, -0.55] }),
    xform(new SphereGeometry(0.045, 10, 8), { pos: [0, -0.82, -0.55] }),
    xform(new TorusGeometry(0.25, 0.018, 8, 24), { pos: [0, 0, -1.05] }),
  ])

  return buildGlb([
    {
      name: 'station_body',
      parts: [
        { geometry: shield, material: 'goldFoil' },
        { geometry: hull, material: 'titaniumHull' },
        { geometry: struts, material: 'darkFrame' },
        { geometry: beacons, material: 'tealBeacons' },
      ],
    },
    {
      name: 'rotor_ring',
      parts: [{ geometry: rotor, material: 'titaniumHull' }],
    },
  ])
}

/* ================================================================== */
/* 2. VENUS — Cloud Haven Aerostat Orbital Complex                    */
/* ================================================================== */
function createVenusStation() {
  const bronzeDomes = merge([
    xform(new SphereGeometry(0.62, 28, 18), { scale: [1, 0.42, 1], pos: [0, 0.12, 0] }),
    xform(new TorusGeometry(1.05, 0.11, 16, 48), { rot: [Math.PI / 2, 0, 0], pos: [0, 0, 0] }),
    xform(new TorusGeometry(0.68, 0.06, 12, 36), { rot: [Math.PI / 2, 0, 0], pos: [0, -0.18, 0] }),
  ])

  const hull = merge([
    xform(new CylinderGeometry(0.28, 0.16, 0.95, 24), { pos: [0, -0.22, 0] }),
    xform(new BoxGeometry(2.05, 0.045, 0.09), { pos: [0, 0, 0] }),
    xform(new BoxGeometry(0.09, 0.045, 2.05), { pos: [0, 0, 0] }),
  ])

  const windows = merge([
    xform(new TorusGeometry(1.16, 0.018, 8, 48), { rot: [Math.PI / 2, 0, 0], pos: [0, 0.02, 0] }),
    xform(new TorusGeometry(0.55, 0.015, 8, 32), { rot: [Math.PI / 2, 0, 0], pos: [0, 0.22, 0] }),
  ])

  const rotor = merge([
    xform(new TorusGeometry(1.38, 0.035, 10, 48), { rot: [Math.PI / 2, 0, 0], pos: [0, -0.06, 0] }),
    xform(new SphereGeometry(0.06, 10, 10), { pos: [1.38, -0.06, 0] }),
    xform(new SphereGeometry(0.06, 10, 10), { pos: [-1.38, -0.06, 0] }),
  ])

  return buildGlb([
    {
      name: 'station_body',
      parts: [
        { geometry: bronzeDomes, material: 'bronzeShell' },
        { geometry: hull, material: 'titaniumHull' },
        { geometry: windows, material: 'habLights' },
      ],
    },
    {
      name: 'rotor_ring',
      parts: [
        { geometry: rotor, material: 'darkFrame' },
        {
          geometry: merge([
            xform(new SphereGeometry(0.045, 8, 8), { pos: [0, -0.06, 1.38] }),
            xform(new SphereGeometry(0.045, 8, 8), { pos: [0, -0.06, -1.38] }),
          ]),
          material: 'tealBeacons',
        },
      ],
    },
  ])
}

/* ================================================================== */
/* 3. MARS — Red Frontier Orbital Transfer Hub                        */
/* ================================================================== */
function createMarsStation() {
  const hull = merge([
    xform(new CylinderGeometry(0.18, 0.18, 2.2, 24), { rot: [0, 0, Math.PI / 2] }),
    xform(new CylinderGeometry(0.28, 0.28, 0.55, 24), { rot: [0, 0, Math.PI / 2], pos: [-0.45, 0, 0] }),
    xform(new CylinderGeometry(0.24, 0.24, 0.45, 24), { rot: [0, 0, Math.PI / 2], pos: [0.55, 0, 0] }),
    xform(new SphereGeometry(0.22, 18, 14), { pos: [1.15, 0, 0] }),
  ])

  const solar = merge([
    xform(new BoxGeometry(0.38, 0.015, 1.85), { pos: [-0.45, 0, 1.18] }),
    xform(new BoxGeometry(0.38, 0.015, 1.85), { pos: [-0.45, 0, -1.18] }),
    xform(new BoxGeometry(0.28, 0.015, 1.35), { pos: [0.55, 0, 0.9] }),
    xform(new BoxGeometry(0.28, 0.015, 1.35), { pos: [0.55, 0, -0.9] }),
  ])

  const frame = merge([
    xform(new BoxGeometry(0.04, 0.04, 4.2), { pos: [-0.45, 0, 0] }),
    xform(new BoxGeometry(0.04, 0.04, 3.1), { pos: [0.55, 0, 0] }),
  ])

  const rotor = merge([
    xform(new TorusGeometry(0.78, 0.075, 16, 44), { rot: [0, Math.PI / 2, 0], pos: [0.05, 0, 0] }),
    xform(new BoxGeometry(0.05, 1.52, 0.05), { pos: [0.05, 0, 0] }),
    xform(new BoxGeometry(0.05, 0.05, 1.52), { pos: [0.05, 0, 0] }),
  ])

  const rotorLights = xform(new TorusGeometry(0.86, 0.014, 8, 44), {
    rot: [0, Math.PI / 2, 0],
    pos: [0.05, 0, 0],
  })

  const beacons = merge([
    xform(new SphereGeometry(0.05, 10, 8), { pos: [-1.15, 0, 0] }),
    xform(new SphereGeometry(0.05, 10, 8), { pos: [1.38, 0, 0] }),
  ])

  return buildGlb([
    {
      name: 'station_body',
      parts: [
        { geometry: hull, material: 'titaniumHull' },
        { geometry: solar, material: 'solarArray' },
        { geometry: frame, material: 'darkFrame' },
        { geometry: beacons, material: 'tealBeacons' },
      ],
    },
    {
      name: 'rotor_ring',
      parts: [
        { geometry: rotor, material: 'titaniumHull' },
        { geometry: rotorLights, material: 'habLights' },
      ],
    },
  ])
}

/* ================================================================== */
/* 4. JUPITER — Europa Orbital Station (Double Centrifuge Deep-Space) */
/* ================================================================== */
function createJupiterStation() {
  const spine = merge([
    xform(new CylinderGeometry(0.16, 0.16, 2.8, 24)),
    xform(new CylinderGeometry(0.34, 0.34, 0.5, 24), { pos: [0, 0.85, 0] }),
    xform(new CylinderGeometry(0.38, 0.28, 0.55, 24), { pos: [0, -0.95, 0] }),
    xform(new OctahedronGeometry(0.28, 1), { pos: [0, 1.52, 0] }),
  ])

  const solar = merge([
    xform(new BoxGeometry(2.6, 0.02, 0.42), { pos: [0, 0.85, 0] }),
    xform(new BoxGeometry(0.42, 0.02, 2.6), { pos: [0, 0.85, 0] }),
  ])

  const rotor = merge([
    xform(new TorusGeometry(1.18, 0.095, 18, 52), { rot: [Math.PI / 2, 0, 0], pos: [0, 0.18, 0] }),
    xform(new TorusGeometry(0.88, 0.07, 16, 44), { rot: [Math.PI / 2, 0, 0], pos: [0, -0.35, 0] }),
    xform(new BoxGeometry(2.3, 0.045, 0.045), { pos: [0, 0.18, 0] }),
    xform(new BoxGeometry(0.045, 0.045, 2.3), { pos: [0, 0.18, 0] }),
    xform(new BoxGeometry(1.72, 0.04, 0.04), { pos: [0, -0.35, 0] }),
  ])

  const windows = merge([
    xform(new TorusGeometry(1.28, 0.016, 8, 52), { rot: [Math.PI / 2, 0, 0], pos: [0, 0.18, 0] }),
    xform(new TorusGeometry(0.96, 0.014, 8, 44), { rot: [Math.PI / 2, 0, 0], pos: [0, -0.35, 0] }),
  ])

  const beacons = merge([
    xform(new SphereGeometry(0.055, 10, 8), { pos: [0, 1.82, 0] }),
    xform(new SphereGeometry(0.055, 10, 8), { pos: [0, -1.5, 0] }),
  ])

  return buildGlb([
    {
      name: 'station_body',
      parts: [
        { geometry: spine, material: 'titaniumHull' },
        { geometry: solar, material: 'solarArray' },
        { geometry: beacons, material: 'tealBeacons' },
      ],
    },
    {
      name: 'rotor_ring',
      parts: [
        { geometry: rotor, material: 'titaniumHull' },
        { geometry: windows, material: 'habLights' },
      ],
    },
  ])
}

/* ================================================================== */
/* 5. SATURN — Titan Orbital Station                                  */
/* ================================================================== */
function createSaturnTitanStation() {
  const core = merge([
    xform(new CylinderGeometry(0.2, 0.2, 2.4, 24)),
    xform(new SphereGeometry(0.42, 24, 18), { pos: [0, 0.55, 0] }),
    xform(new CylinderGeometry(0.48, 0.32, 0.35, 24), { pos: [0, -0.82, 0] }),
  ])

  const dish = merge([
    xform(new ConeGeometry(0.45, 0.22, 24), { rot: [0, 0, Math.PI / 3], pos: [0.55, -0.55, 0] }),
    xform(new BoxGeometry(2.4, 0.02, 0.36), { pos: [0, -0.82, 0] }),
  ])

  const rotor = merge([
    xform(new TorusGeometry(1.12, 0.085, 16, 48), { rot: [Math.PI / 2, 0, 0], pos: [0, 0, 0] }),
    xform(new BoxGeometry(2.2, 0.05, 0.05)),
    xform(new BoxGeometry(0.05, 0.05, 2.2)),
  ])

  const lights = merge([
    xform(new TorusGeometry(1.21, 0.016, 8, 48), { rot: [Math.PI / 2, 0, 0], pos: [0, 0, 0] }),
    xform(new TorusGeometry(0.43, 0.015, 8, 28), { rot: [Math.PI / 2, 0, 0], pos: [0, 0.55, 0] }),
  ])

  const beacons = merge([
    xform(new SphereGeometry(0.055, 10, 8), { pos: [0, 1.32, 0] }),
    xform(new SphereGeometry(0.055, 10, 8), { pos: [0, -1.28, 0] }),
  ])

  return buildGlb([
    {
      name: 'station_body',
      parts: [
        { geometry: core, material: 'titaniumHull' },
        { geometry: dish, material: 'goldFoil' },
        { geometry: beacons, material: 'tealBeacons' },
      ],
    },
    {
      name: 'rotor_ring',
      parts: [
        { geometry: rotor, material: 'bronzeShell' },
        { geometry: lights, material: 'habLights' },
      ],
    },
  ])
}

/* ================================================================== */
/* 6. SATURN — Ring Observation Platform (Cassini Conservatory)       */
/* ================================================================== */
function createSaturnRingObservatory() {
  const hull = merge([
    xform(new CylinderGeometry(0.58, 0.42, 0.32, 28)),
    xform(new SphereGeometry(0.52, 24, 16), { scale: [1, 0.55, 1], pos: [0, -0.18, 0] }),
    xform(new CylinderGeometry(0.14, 0.14, 1.35, 18), { pos: [0, 0.55, 0] }),
  ])

  const arrays = merge([
    xform(new BoxGeometry(2.3, 0.02, 0.34), { pos: [0, 0.35, 0] }),
    xform(new BoxGeometry(0.34, 0.02, 2.3), { pos: [0, 0.35, 0] }),
  ])

  const rotor = merge([
    xform(new TorusGeometry(0.92, 0.055, 14, 44), { rot: [Math.PI / 2, 0, 0], pos: [0, -0.05, 0] }),
    xform(new RingGeometry(0.62, 0.86, 36), { rot: [Math.PI / 2, 0, 0], pos: [0, -0.05, 0] }),
  ])

  const beacons = merge([
    xform(new TorusGeometry(0.56, 0.02, 8, 36), { rot: [Math.PI / 2, 0, 0], pos: [0, -0.22, 0] }),
    xform(new SphereGeometry(0.06, 10, 8), { pos: [0, 1.25, 0] }),
  ])

  return buildGlb([
    {
      name: 'station_body',
      parts: [
        { geometry: hull, material: 'titaniumHull' },
        { geometry: arrays, material: 'solarArray' },
        { geometry: beacons, material: 'tealBeacons' },
      ],
    },
    {
      name: 'rotor_ring',
      parts: [{ geometry: rotor, material: 'goldFoil' }],
    },
  ])
}

await mkdir(outDir, { recursive: true })

const SPECS = [
  ['mercury-shield-station.glb', createMercuryStation],
  ['venus-cloud-haven.glb', createVenusStation],
  ['mars-orbital-hub.glb', createMarsStation],
  ['jupiter-europa-station.glb', createJupiterStation],
  ['saturn-titan-station.glb', createSaturnTitanStation],
  ['saturn-ring-observatory.glb', createSaturnRingObservatory],
]

for (const [filename, builder] of SPECS) {
  const { buffer, triangles } = builder()
  const path = join(outDir, filename)
  await writeFile(path, buffer)
  console.log(`${filename.padEnd(30)} ${(buffer.length / 1024).toFixed(1).padStart(6)} KB  (${triangles} tris)`)
}
console.log('\nOK -> public/models/*.glb')
