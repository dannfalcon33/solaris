import { AdditiveBlending, BackSide, Color, FrontSide, NormalBlending, ShaderMaterial, type Texture } from 'three'
import { SUN_DIRECTION } from '@/engine/lighting/sun'
import { SEAMLESS_GLSL } from './earthSurface'

/**
 * Capa de nubes independiente, con iluminación propia:
 *  - pseudo-relieve a partir de la propia máscara (auto-sombreado volumétrico)
 *  - lado nocturno casi negro; tinte cálido en el terminador (atardecer)
 */
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  varying vec3 vWorldTangent;

  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vec3 east = cross(vec3(0.0, 1.0, 0.0), normal);
    if (dot(east, east) < 1e-6) east = vec3(1.0, 0.0, 0.0);
    vWorldTangent = normalize(mat3(modelMatrix) * normalize(east));
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

const fragmentShader = /* glsl */ `
  uniform sampler2D uClouds;
  uniform vec3 uSunDir;
  uniform vec3 uSunColor;
  uniform vec2 uTexel;

  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  varying vec3 vWorldTangent;

  ${SEAMLESS_GLSL}

  void main() {
    vec2 dx, dy;
    seamlessGradients(vUv, dx, dy);

    float c0 = textureGrad(uClouds, vUv, dx, dy).r;
    float cx = textureGrad(uClouds, vUv + vec2(uTexel.x * 2.0, 0.0), dx, dy).r;
    float cy = textureGrad(uClouds, vUv + vec2(0.0, uTexel.y * 2.0), dx, dy).r;

    vec3 N = normalize(vWorldNormal);
    vec3 T = normalize(vWorldTangent - N * dot(N, vWorldTangent));
    vec3 B = cross(N, T);
    vec3 L = normalize(uSunDir);
    vec3 V = normalize(cameraPosition - vWorldPos);

    // Pseudo-normal: las zonas densas "sobresalen".
    vec3 Nc = normalize(N + (T * (c0 - cx) + B * (c0 - cy)) * 3.2);

    float ndlGeo = dot(N, L);
    float ndl = dot(Nc, L);
    float lit = smoothstep(-0.10, 0.30, mix(ndlGeo, ndl, 0.7));

    // Atardecer: banda cálida cerca del terminador.
    float band = exp(-pow(ndlGeo / 0.16, 2.0));
    vec3 tint = mix(vec3(1.0), vec3(1.0, 0.58, 0.34), band * 0.85);

    vec3 color = vec3(0.97, 0.98, 1.0) * uSunColor * tint * lit * 1.35;
    color += vec3(0.012, 0.018, 0.03); // reflejo tenue del lado nocturno

    // Borde: más translúcidas hacia el limbo para no formar un "caparazón".
    float alpha = clamp(c0 * 1.25, 0.0, 1.0) * 0.96;

    gl_FragColor = vec4(color, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

export function createCloudMaterial(): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    side: FrontSide,
    blending: NormalBlending,
    uniforms: {
      uClouds: { value: null },
      uSunDir: { value: SUN_DIRECTION },
      uSunColor: { value: new Color(1.0, 0.96, 0.9) },
      uTexel: { value: [1 / 2048, 1 / 1024] },
    },
  })
}

export function setCloudTexture(material: ShaderMaterial, clouds: Texture): void {
  material.uniforms.uClouds!.value = clouds
  const img = clouds.image as { width: number; height: number } | undefined
  if (img) material.uniforms.uTexel!.value = [1 / img.width, 1 / img.height]
}

/* ------------------------------------------------------------------ */

/**
 * Atmósfera: cáscara exterior (BackSide) con aproximación analítica de
 * scattering. Para cada rayo se calcula la distancia mínima al centro del
 * planeta; la densidad decae exponencialmente con la altitud y se integra el
 * recorrido dentro de la cáscara. Azul Rayleigh en el lado diurno y banda
 * naranja en el terminador; sin borde "neón".
 */
const atmoVertex = /* glsl */ `
  varying vec3 vWorldPos;
  varying vec3 vCenter;
  varying float vRp;
  varying float vRa;

  uniform float uPlanetRadius;   // radio local del planeta (geometría)
  uniform float uAtmoRadius;     // radio local de la cáscara

  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    vCenter = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    float s = length(modelMatrix[0].xyz);
    vRp = uPlanetRadius * s;
    vRa = uAtmoRadius * s;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

const atmoFragment = /* glsl */ `
  uniform vec3 uSunDir;
  uniform float uIntensity;
  uniform float uScaleHeight;   // fracción del radio

  varying vec3 vWorldPos;
  varying vec3 vCenter;
  varying float vRp;
  varying float vRa;

  void main() {
    vec3 ro = cameraPosition - vCenter;
    vec3 rd = normalize(vWorldPos - cameraPosition);

    float tca = -dot(ro, rd);           // distancia al punto de máximo acercamiento
    vec3 closest = ro + rd * tca;
    float d = length(closest);          // parámetro de impacto

    if (d >= vRa) discard;

    float h = max(d - vRp, 0.0) / vRp;                       // altitud relativa
    float chord = 2.0 * sqrt(max(vRa * vRa - d * d, 0.0));   // recorrido en la cáscara
    float density = exp(-h / uScaleHeight);
    float optical = chord / vRp * density;
    float I = 1.0 - exp(-optical * 5.5);

    // Iluminación en el punto tangente (lado del limbo).
    vec3 up = normalize(closest);
    float s = dot(up, normalize(uSunDir));
    float dayAmt = smoothstep(-0.28, 0.55, s);
    float term = exp(-pow(s / 0.20, 2.0));

    vec3 blue = vec3(0.22, 0.50, 1.0);
    vec3 warm = vec3(1.0, 0.46, 0.18);
    vec3 col = mix(blue, warm, term * 0.75) * dayAmt;

    // Un poco más claro en el interior (menor altitud).
    col = mix(col, vec3(0.55, 0.78, 1.0) * dayAmt, smoothstep(0.35, 0.0, h) * 0.35);

    // Atenuación de borde para que se funda con el espacio.
    float edge = 1.0 - smoothstep(vRp, vRa, d);

    gl_FragColor = vec4(col * I * edge * uIntensity, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

export const ATMOSPHERE_RADIUS = 1.07
export const EARTH_RADIUS = 1.0

export function createAtmosphereMaterial(): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader: atmoVertex,
    fragmentShader: atmoFragment,
    transparent: true,
    depthWrite: false,
    side: BackSide,
    blending: AdditiveBlending,
    uniforms: {
      uSunDir: { value: SUN_DIRECTION },
      uPlanetRadius: { value: EARTH_RADIUS },
      uAtmoRadius: { value: ATMOSPHERE_RADIUS },
      uIntensity: { value: 1.35 },
      uScaleHeight: { value: 0.022 },
    },
  })
}
