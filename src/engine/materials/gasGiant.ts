import {
  Color,
  DoubleSide,
  NormalBlending,
  ShaderMaterial,
  Vector3,
  type ColorRepresentation,
  type Texture,
} from 'three'
import { SEAMLESS_GLSL } from './earthSurface'

export const SATURN_RING_INNER = 1.23
export const SATURN_RING_OUTER = 2.32

/**
 * Materiales específicos para gigantes gaseosos (Júpiter y Saturno) y para el
 * sistema de anillos de Saturno:
 *  - Oscurecimiento de limbo tipo Minnaert propio de atmósferas profundas H/He.
 *  - Micro-relieve en bordes de bandas convectivas y tormentas.
 *  - En Saturno: sombra real proyectada por los anillos (con la división de
 *    Cassini) sobre las nubes del planeta, y sombra del globo planetario sobre
 *    los anillos.
 */
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  varying vec3 vWorldTangent;
  varying vec3 vCenter;
  varying float vRadius;

  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    vCenter = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    vRadius = length(modelMatrix[0].xyz);
    vWorldNormal = normalize(mat3(modelMatrix) * normal);

    vec3 east = cross(vec3(0.0, 1.0, 0.0), normal);
    if (dot(east, east) < 1e-6) east = vec3(1.0, 0.0, 0.0);
    vWorldTangent = normalize(mat3(modelMatrix) * normalize(east));

    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

const fragmentShader = /* glsl */ `
  uniform sampler2D uAlbedo;
  uniform sampler2D uRingTex;
  uniform vec3 uSunDir;
  uniform vec3 uSunColor;
  uniform vec3 uHazeColor;
  uniform vec3 uRingNormal;
  uniform vec2 uTexel;
  uniform float uBumpScale;
  uniform float uHasRings;
  uniform float uRingInner;
  uniform float uRingOuter;
  uniform float uZonalShear;

  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  varying vec3 vWorldTangent;
  varying vec3 vCenter;
  varying float vRadius;

  ${SEAMLESS_GLSL}

  float luma(vec3 c) {
    return dot(c, vec3(0.299, 0.587, 0.114));
  }

  void main() {
    vec2 dx, dy;
    seamlessGradients(vUv, dx, dy);

    vec3 N = normalize(vWorldNormal);
    vec3 T = normalize(vWorldTangent - N * dot(N, vWorldTangent));
    vec3 B = cross(N, T);
    vec3 L = normalize(uSunDir);
    vec3 V = normalize(cameraPosition - vWorldPos);

    // Cizalladura zonal muy sutil entre cinturones y zonas.
    float lat = (vUv.y - 0.5) * 2.0;
    float beltShift = sin(lat * 22.0) * uZonalShear;
    vec2 uv = vec2(fract(vUv.x + beltShift), vUv.y);

    vec3 baseCol = textureGrad(uAlbedo, uv, dx, dy).rgb;

    // Relieve suave en las bandas de nubes y vórtices.
    float h0 = luma(baseCol);
    float hx = luma(textureGrad(uAlbedo, vec2(fract(uv.x + uTexel.x * 1.5), uv.y), dx, dy).rgb);
    float hy = luma(textureGrad(uAlbedo, vec2(uv.x, uv.y + uTexel.y * 1.5), dx, dy).rgb);
    vec3 Nb = normalize(N + (T * (h0 - hx) + B * (h0 - hy)) * uBumpScale);

    float ndlGeo = dot(N, L);
    float ndl = max(dot(Nb, L), 0.0);
    float ndv = max(dot(N, V), 0.001);

    // Oscurecimiento de limbo (Minnaert) de gigante gaseoso.
    float minnaert = pow(ndl, 0.78) * pow(ndv, 0.26);
    float lit = smoothstep(-0.08, 0.18, ndlGeo);

    // Sombra proyectada por los anillos sobre el globo (Saturno).
    float ringShadow = 1.0;
    if (uHasRings > 0.5 && ndlGeo > -0.05) {
      vec3 P = (vWorldPos - vCenter) / max(vRadius, 1e-4);
      vec3 Nr = normalize(uRingNormal);
      float denom = dot(L, Nr);
      if (abs(denom) > 1e-4) {
        float t = -dot(P, Nr) / denom;
        if (t > 0.0) {
          vec3 hit = P + t * L;
          float r = length(hit);
          if (r > uRingInner && r < uRingOuter) {
            float u = (r - uRingInner) / (uRingOuter - uRingInner);
            float alpha = texture2D(uRingTex, vec2(u, 0.5)).a;
            ringShadow = 1.0 - alpha * 0.78;
          }
        }
      }
    }

    vec3 color = baseCol * uSunColor * minnaert * lit * ringShadow * 1.48;
    color += baseCol * 0.006;

    // Halo atmosférico cálido en el limbo iluminado.
    float fres = pow(1.0 - ndv, 3.2);
    float dayLimb = smoothstep(-0.15, 0.5, ndlGeo);
    color += uHazeColor * fres * dayLimb * 0.52;

    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

export interface GasGiantMaterialOptions {
  sunDir: Vector3
  hazeColor: ColorRepresentation
  bumpScale?: number
  hasRings?: boolean
  ringNormal?: Vector3
}

export function createGasGiantMaterial(opts: GasGiantMaterialOptions): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uAlbedo: { value: null },
      uRingTex: { value: null },
      uSunDir: { value: opts.sunDir },
      uSunColor: { value: new Color('#fff5e6') },
      uHazeColor: { value: new Color(opts.hazeColor) },
      uRingNormal: { value: opts.ringNormal ?? new Vector3(0, 1, 0) },
      uTexel: { value: [1 / 2048, 1 / 1024] },
      uBumpScale: { value: opts.bumpScale ?? 1.8 },
      uHasRings: { value: opts.hasRings ? 1 : 0 },
      uRingInner: { value: SATURN_RING_INNER },
      uRingOuter: { value: SATURN_RING_OUTER },
      uZonalShear: { value: 0 },
    },
  })
}

export function setGasGiantTextures(
  material: ShaderMaterial,
  albedo: Texture,
  ringTex?: Texture,
  ringMaterial?: ShaderMaterial,
): void {
  material.uniforms.uAlbedo!.value = albedo
  if (ringTex) material.uniforms.uRingTex!.value = ringTex
  if (ringMaterial && ringTex) ringMaterial.uniforms.uRingTex!.value = ringTex
  const img = albedo.image as { width: number; height: number } | undefined
  if (img) material.uniforms.uTexel!.value = [1 / img.width, 1 / img.height]
}

/* ------------------------------------------------------------------ */

const ringVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vCenter;

  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    vCenter = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

const ringFragment = /* glsl */ `
  uniform sampler2D uRingTex;
  uniform vec3 uSunDir;
  uniform vec3 uSunColor;
  uniform float uPlanetRadius;

  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vCenter;

  void main() {
    vec4 sampleCol = texture2D(uRingTex, vec2(clamp(vUv.x, 0.001, 0.999), 0.5));
    if (sampleCol.a < 0.01) discard;

    vec3 L = normalize(uSunDir);
    vec3 V = normalize(cameraPosition - vWorldPos);

    // Fase de dispersión de partículas de hielo (retro-dispersión + dispersión frontal).
    float cosTheta = dot(V, L);
    float backScatter = smoothstep(-0.2, 1.0, cosTheta) * 0.35;
    float forwardScatter = pow(max(-cosTheta, 0.0), 4.0) * 0.45;
    float phase = 0.88 + backScatter + forwardScatter;

    // Variación micro-radial de cristales de hielo.
    float shimmer = 0.96 + 0.04 * sin(vUv.x * 420.0);

    // Sombra del globo de Saturno proyectada sobre los anillos.
    vec3 P = (vWorldPos - vCenter) / max(uPlanetRadius, 1e-4);
    float proj = dot(P, L);
    float planetShadow = 1.0;
    if (proj < 0.0) {
      vec3 perp = P - proj * L;
      float d = length(perp);
      planetShadow = mix(0.06, 1.0, smoothstep(0.96, 1.03, d));
    }

    vec3 color = sampleCol.rgb * uSunColor * phase * shimmer * planetShadow * 1.35;
    float alpha = clamp(sampleCol.a * 1.08, 0.0, 0.98);

    gl_FragColor = vec4(color, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

export function createSaturnRingMaterial(sunDir: Vector3, planetRadius: number): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader: ringVertex,
    fragmentShader: ringFragment,
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    blending: NormalBlending,
    uniforms: {
      uRingTex: { value: null },
      uSunDir: { value: sunDir },
      uSunColor: { value: new Color('#fff6e5') },
      uPlanetRadius: { value: planetRadius },
    },
  })
}
