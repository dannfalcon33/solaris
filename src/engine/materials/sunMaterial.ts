import { AdditiveBlending, BackSide, ShaderMaterial, type Texture } from 'three'
import { SEAMLESS_GLSL } from './earthSurface'

export const SUN_CORONA_RADIUS = 1.75

/**
 * Materiales específicos del Sol:
 *  - Fotosfera emisiva con granulación convectiva animada y oscurecimiento de
 *    limbo astrofísico (blanco-amarillo en el centro -> naranja-rojizo en el
 *    borde).
 *  - Corona solar volumétrica (BackSide, AdditiveBlending) con rayos coronales
 *    suaves sin cortes geométricos.
 */
const surfaceVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;

  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

const surfaceFragment = /* glsl */ `
  uniform sampler2D uAlbedo;
  uniform float uTime;

  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;

  ${SEAMLESS_GLSL}

  void main() {
    vec2 dx, dy;
    seamlessGradients(vUv, dx, dy);

    vec3 N = normalize(vWorldNormal);
    vec3 V = normalize(cameraPosition - vWorldPos);
    float mu = clamp(dot(N, V), 0.0, 1.0);

    // Convección lenta de dos capas sobre el mapa solar.
    vec2 uvA = vec2(fract(vUv.x + uTime * 0.0018), vUv.y);
    vec2 uvB = vec2(fract(vUv.x * 2.0 - uTime * 0.0032), clamp(vUv.y + sin(uTime * 0.15 + vUv.x * 12.0) * 0.002, 0.01, 0.99));

    vec3 colA = textureGrad(uAlbedo, uvA, dx, dy).rgb;
    vec3 colB = textureGrad(uAlbedo, uvB, dx * 2.0, dy * 2.0).rgb;
    vec3 plasma = mix(colA, colB, 0.25);

    // Oscurecimiento de limbo solar dependiente de la longitud de onda.
    vec3 limbProfile = pow(vec3(max(mu, 0.02)), vec3(0.28, 0.58, 0.95));
    vec3 coreBoost = vec3(1.45, 1.22, 0.92) * (0.55 + 0.75 * pow(mu, 0.65));

    // Brillo cromosférico en el borde extremo.
    float rim = pow(1.0 - mu, 3.5);
    vec3 chromosphere = vec3(1.0, 0.38, 0.08) * rim * 0.85;

    vec3 color = plasma * limbProfile * coreBoost * 1.45 + chromosphere;

    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

export function createSunSurfaceMaterial(): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader: surfaceVertex,
    fragmentShader: surfaceFragment,
    uniforms: {
      uAlbedo: { value: null },
      uTime: { value: 0 },
    },
  })
}

export function setSunTexture(material: ShaderMaterial, albedo: Texture): void {
  material.uniforms.uAlbedo!.value = albedo
}

export function advanceSunTime(
  surface: ShaderMaterial,
  corona: ShaderMaterial,
  dt: number,
): void {
  surface.uniforms.uTime!.value += dt
  corona.uniforms.uTime!.value += dt
}

/* ------------------------------------------------------------------ */

const coronaVertex = /* glsl */ `
  varying vec3 vWorldPos;
  varying vec3 vCenter;
  varying float vRp;
  varying float vRa;

  uniform float uSunRadius;
  uniform float uCoronaRadius;

  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    vCenter = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    float s = length(modelMatrix[0].xyz);
    vRp = uSunRadius * s;
    vRa = uCoronaRadius * s;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

const coronaFragment = /* glsl */ `
  uniform float uTime;

  varying vec3 vWorldPos;
  varying vec3 vCenter;
  varying float vRp;
  varying float vRa;

  void main() {
    vec3 ro = cameraPosition - vCenter;
    vec3 rd = normalize(vWorldPos - cameraPosition);

    float tca = -dot(ro, rd);
    vec3 closest = ro + rd * tca;
    float d = length(closest);

    if (d >= vRa) discard;

    float h = max(d - vRp, 0.0) / max(vRa - vRp, 1e-4);
    float falloff = exp(-h * 3.8) * (1.0 - smoothstep(0.0, 1.0, h));

    // Rayos coronales sutiles según el ángulo en el plano perpendicular.
    vec3 dir = normalize(closest);
    float angle = atan(dir.y, dir.x);
    float streamers =
      0.86 +
      0.09 * sin(angle * 7.0 + uTime * 0.25) +
      0.05 * cos(angle * 13.0 - uTime * 0.18);

    vec3 innerCol = vec3(1.0, 0.78, 0.42);
    vec3 outerCol = vec3(1.0, 0.36, 0.08);
    vec3 col = mix(innerCol, outerCol, smoothstep(0.0, 0.75, h));

    gl_FragColor = vec4(col * falloff * streamers * 1.45, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

export function createSunCoronaMaterial(): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader: coronaVertex,
    fragmentShader: coronaFragment,
    transparent: true,
    depthWrite: false,
    side: BackSide,
    blending: AdditiveBlending,
    uniforms: {
      uSunRadius: { value: 1.0 },
      uCoronaRadius: { value: SUN_CORONA_RADIUS },
      uTime: { value: 0 },
    },
  })
}
