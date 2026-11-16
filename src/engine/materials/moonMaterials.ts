import { Color, ShaderMaterial, type Vector3 } from 'three'

/**
 * Shaders procedurales específicos para las lunas principales de la FASE 4:
 *  - Europa (Júpiter): corteza helada de alto albedo cruzada por fracturas
 *    tectónicas rojizas (lineae) en coordenadas 3D sin costuras UV.
 *  - Titán (Saturno): atmósfera densa de nitrógeno/metano naranja-ámbar con
 *    oscurecimiento de limbo Minnaert y bruma estratosférica azulada.
 */
const vertexShader = /* glsl */ `
  varying vec3 vLocalPos;
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;

  void main() {
    vLocalPos = normalize(position);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

const europaFragment = /* glsl */ `
  uniform vec3 uSunDir;
  uniform vec3 uSunColor;

  varying vec3 vLocalPos;
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;

  // Patrón 3D determinista de fracturas lineales (lineae) sobre la corteza de hielo.
  float lineBand(vec3 p, vec3 axis, float freq, float sharp) {
    float v = abs(sin(dot(p, normalize(axis)) * freq + sin(p.y * 9.0) * 0.45));
    return pow(1.0 - clamp(v, 0.0, 1.0), sharp);
  }

  void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 L = normalize(uSunDir);
    vec3 V = normalize(cameraPosition - vWorldPos);

    vec3 p = vLocalPos;
    float l1 = lineBand(p, vec3(0.8, 0.35, -0.45), 14.0, 14.0);
    float l2 = lineBand(p, vec3(-0.5, 0.72, 0.48), 19.0, 16.0);
    float l3 = lineBand(p, vec3(0.25, -0.65, 0.72), 25.0, 18.0);
    float fractures = clamp(l1 * 0.75 + l2 * 0.65 + l3 * 0.5, 0.0, 1.0);

    float mottling = 0.5 + 0.5 * sin(p.x * 7.0) * cos(p.y * 9.0) * sin(p.z * 8.0);

    vec3 iceBase = mix(vec3(0.76, 0.83, 0.89), vec3(0.90, 0.93, 0.96), mottling);
    vec3 mineralCrack = vec3(0.58, 0.36, 0.25);
    vec3 albedo = mix(iceBase, mineralCrack, fractures * 0.72);

    // Pequeña perturbación de la normal a lo largo de las fracturas.
    vec3 Nb = normalize(N + vec3(l1 - l2, l2 - l3, l3 - l1) * 0.12);

    float ndlGeo = dot(N, L);
    float ndl = max(dot(Nb, L), 0.0);
    float lit = smoothstep(-0.06, 0.14, ndlGeo);

    vec3 color = albedo * uSunColor * ndl * lit * 1.38;
    color += albedo * 0.012;

    // Brillo especular sobre el hielo liso.
    vec3 H = normalize(L + V);
    float spec = pow(max(dot(Nb, H), 0.0), 48.0) * (1.0 - fractures * 0.7) * 0.28;
    color += uSunColor * spec * lit;

    // Escarcha fría en el limbo iluminado.
    float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);
    color += vec3(0.58, 0.78, 0.96) * fres * smoothstep(-0.1, 0.45, ndlGeo) * 0.35;

    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

const titanFragment = /* glsl */ `
  uniform vec3 uSunDir;
  uniform vec3 uSunColor;

  varying vec3 vLocalPos;
  varying vec3 vWorldPos;
  varying vec3 vWorldNormal;

  void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 L = normalize(uSunDir);
    vec3 V = normalize(cameraPosition - vWorldPos);

    float ndlGeo = dot(N, L);
    float ndl = max(ndlGeo, 0.0);
    float ndv = max(dot(N, V), 0.001);

    // Bandas latitudinales muy suaves y capucha polar norte más oscura (estilo Cassini).
    float lat = vLocalPos.y;
    float hood = smoothstep(0.45, 0.88, lat);
    vec3 lowAtmo = mix(vec3(0.86, 0.56, 0.22), vec3(0.68, 0.40, 0.16), hood * 0.45);
    lowAtmo += 0.025 * sin(lat * 16.0);

    float minnaert = pow(ndl, 0.74) * pow(ndv, 0.24);
    float lit = smoothstep(-0.16, 0.24, ndlGeo);

    vec3 color = lowAtmo * uSunColor * minnaert * lit * 1.45;
    color += lowAtmo * 0.01;

    // Bruma estratosférica superior azul-cian característica de Titán en el limbo.
    float fres = pow(1.0 - ndv, 3.4);
    float dayLimb = smoothstep(-0.22, 0.52, ndlGeo);
    vec3 blueHaze = vec3(0.32, 0.68, 0.95) * fres * dayLimb * 0.72;
    vec3 orangeTwilight = vec3(0.95, 0.48, 0.14) * exp(-pow(ndlGeo / 0.18, 2.0)) * 0.22;

    color += blueHaze + orangeTwilight;

    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

export function createEuropaMaterial(sunDir: Vector3): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader,
    fragmentShader: europaFragment,
    uniforms: {
      uSunDir: { value: sunDir },
      uSunColor: { value: new Color('#fff6ea') },
    },
  })
}

export function createTitanMaterial(sunDir: Vector3): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader,
    fragmentShader: titanFragment,
    uniforms: {
      uSunDir: { value: sunDir },
      uSunColor: { value: new Color('#fff5e4') },
    },
  })
}
