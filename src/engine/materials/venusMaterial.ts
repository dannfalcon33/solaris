import { Color, ShaderMaterial, type Texture, type Vector3 } from 'three'
import { SEAMLESS_GLSL } from './earthSurface'

/**
 * Material específico de Venus:
 *  - Super-rotación atmosférica: la capa densa de ácido sulfúrico (`uAtmosphere`)
 *    se desplaza con velocidad propia sobre la topografía volcánica (`uSurface`).
 *  - Iluminación de atmósfera densa (Minnaert + dispersión frontal cálida en el
 *    terminador) y relieve suave en las cimas nubosas.
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
  uniform sampler2D uSurface;
  uniform sampler2D uAtmosphere;
  uniform vec3 uSunDir;
  uniform vec3 uSunColor;
  uniform vec2 uTexel;
  uniform float uCloudDrift;

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

    // Coordenadas de la super-rotación de las nubes altas + ligera cizalladura zonal.
    float lat = (vUv.y - 0.5) * 2.0;
    float zonal = cos(lat * 1.5707963) * 0.015;
    vec2 cloudUv = vec2(fract(vUv.x + uCloudDrift + zonal), vUv.y);

    vec3 surfCol = textureGrad(uSurface, vUv, dx, dy).rgb;
    vec3 atmoCol = textureGrad(uAtmosphere, cloudUv, dx, dy).rgb;

    // Relieve suave de las bandas de nubes superiores.
    float c0 = luma(atmoCol);
    float cx = luma(textureGrad(uAtmosphere, vec2(fract(cloudUv.x + uTexel.x * 2.0), cloudUv.y), dx, dy).rgb);
    float cy = luma(textureGrad(uAtmosphere, vec2(cloudUv.x, cloudUv.y + uTexel.y * 2.0), dx, dy).rgb);
    vec3 Nc = normalize(N + (T * (c0 - cx) + B * (c0 - cy)) * 2.2);

    float ndlGeo = dot(N, L);
    float ndl = max(dot(Nc, L), 0.0);
    float ndv = max(dot(N, V), 0.001);

    // Oscurecimiento de limbo tipo Minnaert para atmósfera muy densa.
    float minnaert = pow(max(ndl, 0.0), 0.72) * pow(ndv, 0.22);

    // Mezcla sutil de estructura superficial filtrada por las nubes densas.
    vec3 combinedAlbedo = mix(surfCol * vec3(1.05, 0.88, 0.68), atmoCol, 0.86);

    // Terminador amplio por difusión múltiple en la cubierta nubosa.
    float lit = smoothstep(-0.14, 0.24, ndlGeo);
    float twilight = exp(-pow(ndlGeo / 0.19, 2.0)) * smoothstep(-0.26, 0.28, ndlGeo);

    vec3 color = combinedAlbedo * uSunColor * minnaert * lit * 1.48;
    color += vec3(0.95, 0.52, 0.18) * twilight * 0.28;

    // Velo dorado cálido en el limbo iluminado.
    float fres = pow(1.0 - ndv, 3.0);
    float dayLimb = smoothstep(-0.15, 0.5, ndlGeo);
    color += vec3(0.96, 0.76, 0.42) * fres * dayLimb * 0.65;
    color += combinedAlbedo * 0.006;

    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

export function createVenusMaterial(sunDir: Vector3): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uSurface: { value: null },
      uAtmosphere: { value: null },
      uSunDir: { value: sunDir },
      uSunColor: { value: new Color('#fff4de') },
      uTexel: { value: [1 / 2048, 1 / 1024] },
      uCloudDrift: { value: 0 },
    },
  })
}

export function setVenusTextures(
  material: ShaderMaterial,
  surface: Texture,
  atmosphere: Texture,
): void {
  material.uniforms.uSurface!.value = surface
  material.uniforms.uAtmosphere!.value = atmosphere
  const img = atmosphere.image as { width: number; height: number } | undefined
  if (img) material.uniforms.uTexel!.value = [1 / img.width, 1 / img.height]
}

export function advanceVenusClouds(material: ShaderMaterial, dt: number): void {
  material.uniforms.uCloudDrift!.value = (material.uniforms.uCloudDrift!.value - dt * 0.0028) % 1
}
