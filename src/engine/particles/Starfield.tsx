import { useLayoutEffect, useMemo } from 'react'
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  ShaderMaterial,
} from 'three'
import { getQuality } from '@/engine/config/quality'

const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  varying vec3 vColor;

  void main() {
    vColor = aColor;
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPos;
    gl_PointSize = clamp(aSize * (320.0 / max(-mvPos.z, 1.0)), 1.0, 4.2);
  }
`

const fragmentShader = /* glsl */ `
  varying vec3 vColor;

  void main() {
    vec2 p = gl_PointCoord * 2.0 - 1.0;
    float r2 = dot(p, p);
    if (r2 > 1.0) discard;
    float falloff = exp(-r2 * 3.6);
    gl_FragColor = vec4(vColor * falloff, falloff);
  }
`

const SPECTRAL_COLORS = [
  new Color('#b8d4ff'), // tipo B/A azul-blanco
  new Color('#eef4ff'), // tipo F blanco
  new Color('#fff4dc'), // tipo G amarillo-blanco
  new Color('#ffd7a8'), // tipo K cálido
]

/** Generador pseudoaleatorio determinista (Mulberry32) para evitar impurezas en useMemo. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Campo estelar puntual 3D con distribución esférica y colores espectrales
 * realistas. Complementa la panorámica de la Vía Láctea (`Skybox`) con
 * paralaje espacial y estrellas nítidas.
 */
export function Starfield() {
  const quality = getQuality()
  const count = quality.tier === 'low' ? 1800 : quality.tier === 'medium' ? 2600 : 3800

  const { geometry, material } = useMemo(() => {
    const rand = mulberry32(203104)
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const u = rand()
      const v = rand()
      const theta = 2 * Math.PI * u
      const phi = Math.acos(2 * v - 1)
      const radius = 240 + rand() * 520

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.cos(phi)
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)

      const base = SPECTRAL_COLORS[Math.floor(rand() * SPECTRAL_COLORS.length)]!
      const brightness = 0.35 + Math.pow(rand(), 2.2) * 0.65
      colors[i * 3] = base.r * brightness
      colors[i * 3 + 1] = base.g * brightness
      colors[i * 3 + 2] = base.b * brightness

      sizes[i] = 0.8 + Math.pow(rand(), 3.0) * 2.4
    }

    const geo = new BufferGeometry()
    geo.setAttribute('position', new BufferAttribute(positions, 3))
    geo.setAttribute('aColor', new BufferAttribute(colors, 3))
    geo.setAttribute('aSize', new BufferAttribute(sizes, 1))

    const mat = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    })

    return { geometry: geo, material: mat }
  }, [count])

  useLayoutEffect(
    () => () => {
      geometry.dispose()
      material.dispose()
    },
    [geometry, material],
  )

  return <points geometry={geometry} material={material} frustumCulled={false} name="starfield" />
}
