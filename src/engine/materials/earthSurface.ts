import { Color, ShaderMaterial, type Texture } from 'three'
import { SUN_DIRECTION } from '@/engine/lighting/sun'

/**
 * Superficie terrestre. Shader propio (no MeshStandardMaterial) porque combina:
 *  - albedo + normal map (TBN analítico esférico, sin artefactos en la costura)
 *  - brillo especular solo en océanos (mapa especular) + reflejo solar
 *  - luces nocturnas visibles solo en el lado oscuro y atenuadas por nubes
 *  - sombras de nubes proyectadas sobre la superficie
 *  - velo atmosférico (scattering aproximado) en el limbo diurno
 *
 * Mipmapping sin línea en la costura u=0/1: se usan gradientes seguros con
 * `textureGrad` (se elige la parametrización con menor salto de UV).
 */

export const SEAMLESS_GLSL = /* glsl */ `
  // Gradientes de UV seguros frente al salto u=1 -> u=0.
  void seamlessGradients(in vec2 uv, out vec2 dx, out vec2 dy) {
    dx = dFdx(uv);
    dy = dFdy(uv);
    vec2 uvB = vec2(fract(uv.x + 0.5), uv.y);
    vec2 dxB = dFdx(uvB);
    vec2 dyB = dFdy(uvB);
    if (abs(dx.x) + abs(dy.x) > abs(dxB.x) + abs(dyB.x)) {
      dx = dxB;
      dy = dyB;
    }
  }
`

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

    // Tangente "este" (+u) de la esfera: cross(norte, normal).
    vec3 east = cross(vec3(0.0, 1.0, 0.0), normal);
    if (dot(east, east) < 1e-6) east = vec3(1.0, 0.0, 0.0); // polos
    vWorldTangent = normalize(mat3(modelMatrix) * normalize(east));

    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

const fragmentShader = /* glsl */ `
  uniform sampler2D uDay;
  uniform sampler2D uNight;
  uniform sampler2D uClouds;
  uniform sampler2D uNormal;
  uniform sampler2D uSpecular;
  uniform vec3 uSunDir;
  uniform vec3 uSunColor;
  uniform float uNormalScale;
  uniform float uCloudShadow;
  uniform float uNightIntensity;

  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  varying vec3 vWorldTangent;

  ${SEAMLESS_GLSL}

  void main() {
    vec2 dx, dy;
    seamlessGradients(vUv, dx, dy);

    vec3 N = normalize(vWorldNormal);
    vec3 T = normalize(vWorldTangent - N * dot(N, vWorldTangent));
    vec3 B = cross(N, T); // norte
    vec3 L = normalize(uSunDir);
    vec3 V = normalize(cameraPosition - vWorldPos);

    // --- Relieve ---
    vec3 mapN = textureGrad(uNormal, vUv, dx, dy).xyz * 2.0 - 1.0;
    mapN.xy *= uNormalScale;
    vec3 Nb = normalize(T * mapN.x + B * mapN.y + N * mapN.z);

    float ndlGeo = dot(N, L);
    float ndlBump = dot(Nb, L);

    // --- Albedo y nubes ---
    vec3 albedo = textureGrad(uDay, vUv, dx, dy).rgb;
    float cover = textureGrad(uClouds, vUv, dx, dy).r;

    // Sombra de nubes: la nube que oculta el punto está desplazada hacia el Sol.
    float shadowK = 0.0026 / max(ndlGeo, 0.22);
    vec2 sunTS = vec2(dot(L, T), dot(L, B));
    float cloudAtSun = textureGrad(uClouds, vUv + sunTS * shadowK, dx, dy).r;
    float shadow = 1.0 - 0.5 * cloudAtSun * uCloudShadow;

    // --- Iluminación difusa (terminador suave) ---
    float diff = max(mix(ndlGeo, ndlBump, 0.9), 0.0);
    float lit = smoothstep(-0.04, 0.16, ndlGeo);
    vec3 color = albedo * uSunColor * diff * lit * shadow * 1.55;
    color += albedo * 0.006; // luz ambiente mínima (reflejo del espacio)

    // --- Océano: brillo especular + reflejo solar ---
    float ocean = textureGrad(uSpecular, vUv, dx, dy).r;
    vec3 H = normalize(L + V);
    float ndh = max(dot(Nb, H), 0.0);
    float glint = pow(ndh, 140.0) * 2.2 + pow(ndh, 22.0) * 0.18;
    color += uSunColor * glint * ocean * lit * (1.0 - cover * 0.9);

    // --- Velo atmosférico en el limbo (lado iluminado) ---
    float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);
    float dayHaze = smoothstep(-0.15, 0.5, ndlGeo);
    vec3 haze = vec3(0.16, 0.34, 0.70) * fres * dayHaze * 0.85;
    color += haze;

    // --- Luces nocturnas ---
    float night = 1.0 - smoothstep(-0.10, 0.08, ndlGeo);
    vec3 city = textureGrad(uNight, vUv, dx, dy).rgb;
    color += city * uNightIntensity * night * (1.0 - cover * 0.8);

    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

export interface EarthSurfaceTextures {
  day: Texture
  night: Texture
  clouds: Texture
  normal: Texture
  specular: Texture
}

export function createEarthSurfaceMaterial(cloudShadows: boolean): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uDay: { value: null },
      uNight: { value: null },
      uClouds: { value: null },
      uNormal: { value: null },
      uSpecular: { value: null },
      uSunDir: { value: SUN_DIRECTION },
      uSunColor: { value: new Color(1.0, 0.96, 0.9) },
      // El mapa de SSS codifica pendientes muy suaves (R,G ≈ 128±5, B = 255).
      uNormalScale: { value: 7.0 },
      uCloudShadow: { value: cloudShadows ? 1 : 0 },
      uNightIntensity: { value: 1.7 },
    },
  })
}

export function setEarthSurfaceTextures(material: ShaderMaterial, t: EarthSurfaceTextures): void {
  const u = material.uniforms
  u.uDay!.value = t.day
  u.uNight!.value = t.night
  u.uClouds!.value = t.clouds
  u.uNormal!.value = t.normal
  u.uSpecular!.value = t.specular
}

