import { Color, ShaderMaterial, type ColorRepresentation, type Texture, type Vector3 } from 'three'
import { SEAMLESS_GLSL } from './earthSurface'

/**
 * Materiales específicos para mundos rocosos (Mercurio y Marte):
 *  - Mercurio: reflectancia de regolito sin atmósfera (Lommel-Seeliger +
 *    Oren-Nayar), terminador nítido de alto contraste y relieve de cráteres
 *    extraído por gradiente sub-texel del mapa 8K.
 *  - Marte: terreno oxidado con relieve de cañones/cráteres, respuesta
 *    especular diferenciada en los casquetes polares de hielo y dispersión de
 *    polvo ferruginoso en el limbo y el terminador.
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
  uniform sampler2D uAlbedo;
  uniform vec3 uSunDir;
  uniform vec3 uSunColor;
  uniform vec3 uHazeColor;
  uniform vec2 uTexel;
  uniform float uBumpScale;
  uniform float uRegolithMix;   // 1.0 = Mercurio (Lommel-Seeliger), 0.0 = Marte
  uniform float uHazeStrength;  // velo de polvo en el limbo (Marte)
  uniform float uPolarIce;      // realce especular de casquetes polares (Marte)
  uniform float uExposure;

  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;
  varying vec3 vWorldTangent;

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

    vec3 baseCol = textureGrad(uAlbedo, vUv, dx, dy).rgb;

    // Relieve de alta frecuencia derivado del gradiente local de luminancia.
    float h0 = luma(baseCol);
    float hx = luma(textureGrad(uAlbedo, vUv + vec2(uTexel.x * 1.5, 0.0), dx, dy).rgb);
    float hy = luma(textureGrad(uAlbedo, vUv + vec2(0.0, uTexel.y * 1.5), dx, dy).rgb);
    vec3 Nb = normalize(N + (T * (h0 - hx) + B * (h0 - hy)) * uBumpScale);

    float ndlGeo = dot(N, L);
    float ndl = max(dot(Nb, L), 0.0);
    float ndv = max(dot(Nb, V), 0.001);

    // Reflectancia lunar/mercurial Lommel-Seeliger para regolito sin atmósfera.
    float lommel = (ndl / (ndl + ndv + 0.12)) * 1.65;
    float diffuse = mix(ndl * 1.35, lommel, uRegolithMix);

    // Terminador: más abrupto en Mercurio, más suave y cálido en Marte.
    float termSoft = mix(0.14, 0.04, uRegolithMix);
    float lit = smoothstep(-0.04, termSoft, ndlGeo);

    vec3 color = baseCol * uSunColor * diffuse * lit * uExposure;
    color += baseCol * 0.005;

    // Micro-especular mineral / hielo polar en Marte.
    vec3 H = normalize(L + V);
    float ndh = max(dot(Nb, H), 0.0);
    float lat = abs(vUv.y - 0.5) * 2.0;
    float iceMask = uPolarIce * smoothstep(0.72, 0.92, lat) * smoothstep(0.32, 0.65, h0);
    float spec = pow(ndh, 28.0) * 0.05 + pow(ndh, 70.0) * 0.35 * iceMask;
    color += uSunColor * spec * lit;

    // Dispersión de polvo en el limbo y terminador (Marte).
    if (uHazeStrength > 0.001) {
      float fres = pow(1.0 - max(dot(N, V), 0.0), 2.8);
      float dayHaze = smoothstep(-0.18, 0.48, ndlGeo);
      float twilight = exp(-pow(ndlGeo / 0.14, 2.0)) * smoothstep(-0.22, 0.22, ndlGeo);
      color += uHazeColor * (fres * dayHaze * 0.65 + twilight * 0.22) * uHazeStrength;
    }

    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

export interface RockyPlanetMaterialOptions {
  sunDir: Vector3
  sunColor?: ColorRepresentation
  hazeColor?: ColorRepresentation
  bumpScale: number
  regolithMix: number
  hazeStrength: number
  polarIce?: number
  exposure?: number
}

export function createRockyPlanetMaterial(opts: RockyPlanetMaterialOptions): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uAlbedo: { value: null },
      uSunDir: { value: opts.sunDir },
      uSunColor: { value: new Color(opts.sunColor ?? '#fff5e6') },
      uHazeColor: { value: new Color(opts.hazeColor ?? '#d97848') },
      uTexel: { value: [1 / 2048, 1 / 1024] },
      uBumpScale: { value: opts.bumpScale },
      uRegolithMix: { value: opts.regolithMix },
      uHazeStrength: { value: opts.hazeStrength },
      uPolarIce: { value: opts.polarIce ?? 0 },
      uExposure: { value: opts.exposure ?? 1.25 },
    },
  })
}

export function setRockyPlanetTexture(material: ShaderMaterial, albedo: Texture): void {
  material.uniforms.uAlbedo!.value = albedo
  const img = albedo.image as { width: number; height: number } | undefined
  if (img) material.uniforms.uTexel!.value = [1 / img.width, 1 / img.height]
}
