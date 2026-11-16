import { use, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  AdditiveBlending,
  Color,
  CylinderGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  RingGeometry,
  SphereGeometry,
  Vector3,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { computeCameraPose } from '@/engine/camera/heroLayout'
import { BODIES, DESTINATION_TO_BODY, getBodyPosition, getSunDirectionForBody } from '@/engine/config/solarSystemLayout'
import { createAtmosphereMaterial } from '@/engine/materials/cloudsAndAtmosphere'
import { createEuropaMaterial, createTitanMaterial } from '@/engine/materials/moonMaterials'
import type { DestinationId } from '@/types'

const UP = new Vector3(0, 1, 0)
const BASE = import.meta.env.BASE_URL
const REFERENCE_ASPECT = 16 / 9

interface StationPlacementSpec {
  destinationId: DestinationId
  modelFile: string
  /** Fracción de la distancia cámara -> planeta a la que se ubica la estación. */
  dFactor: number
  /** Desplazamiento horizontal en el encuadre (fracción de camDist). */
  xFactor: number
  /** Desplazamiento vertical en el encuadre (fracción de camDist). */
  yFactor: number
  /** Escala del modelo en fracción de camDist. */
  scaleFactor: number
  /** Inclinación artística de la estación (Euler XYZ). */
  tilt: [number, number, number]
  /** Si `true`, orienta el eje +Z local de la estación hacia el Sol (Mercurio). */
  faceSun?: boolean
  /** Velocidad de giro del anillo centrífugo `rotor_ring` (rad/s). */
  rotorSpeed: number
  /** Color de luz de rebote planetario sobre el casco metálico. */
  bounceColor: string
}

const STATION_SPECS: readonly StationPlacementSpec[] = [
  {
    destinationId: 'mercury-solar-frontier',
    modelFile: 'mercury-shield-station.glb',
    dFactor: 0.34,
    xFactor: 0.065,
    yFactor: -0.025,
    scaleFactor: 0.042,
    tilt: [0.15, -0.35, 0.08],
    faceSun: true,
    rotorSpeed: 0.45,
    bounceColor: '#d8c5b0',
  },
  {
    destinationId: 'venus-cloud-haven',
    modelFile: 'venus-cloud-haven.glb',
    dFactor: 0.35,
    xFactor: 0.07,
    yFactor: -0.02,
    scaleFactor: 0.04,
    tilt: [0.18, 0.4, -0.12],
    rotorSpeed: 0.32,
    bounceColor: '#f2c478',
  },
  {
    destinationId: 'mars-red-frontier',
    modelFile: 'mars-orbital-hub.glb',
    dFactor: 0.34,
    xFactor: 0.068,
    yFactor: -0.028,
    scaleFactor: 0.042,
    tilt: [0.22, -0.5, 0.14],
    rotorSpeed: 0.52,
    bounceColor: '#e07a48',
  },
  {
    destinationId: 'jupiter-europa-station',
    modelFile: 'jupiter-europa-station.glb',
    dFactor: 0.33,
    xFactor: 0.072,
    yFactor: -0.02,
    scaleFactor: 0.038,
    tilt: [0.2, 0.35, -0.18],
    rotorSpeed: 0.38,
    bounceColor: '#deb88a',
  },
  {
    destinationId: 'saturn-titan-station',
    modelFile: 'saturn-titan-station.glb',
    dFactor: 0.31,
    xFactor: 0.068,
    yFactor: -0.032,
    scaleFactor: 0.036,
    tilt: [0.16, -0.38, 0.15],
    rotorSpeed: 0.36,
    bounceColor: '#e8cf98',
  },
  {
    destinationId: 'saturn-ring-observation',
    modelFile: 'saturn-ring-observatory.glb',
    dFactor: 0.32,
    xFactor: 0.06,
    yFactor: -0.03,
    scaleFactor: 0.042,
    tilt: [0.42, 0.28, -0.1],
    rotorSpeed: 0.3,
    bounceColor: '#f0dfba',
  },
]

export interface ComputedStationPlacement {
  spec: StationPlacementSpec
  position: Vector3
  scale: number
  sunDir: Vector3
  planetDir: Vector3
}

/** Calcula la base ortonormal del encuadre de cámara de un destino. */
function getDestinationCameraBasis(destinationId: DestinationId) {
  const bodyId = DESTINATION_TO_BODY[destinationId]
  const planetCenter = getBodyPosition(bodyId)
  const pose = computeCameraPose('planet_detail', 'destination', destinationId, REFERENCE_ASPECT)
  const forward = pose.target.clone().sub(pose.position).normalize()
  const right = new Vector3().crossVectors(forward, UP).normalize()
  const up = new Vector3().crossVectors(right, forward).normalize()
  const camDist = pose.position.distanceTo(planetCenter)
  return { bodyId, planetCenter, camPos: pose.position, forward, right, up, camDist }
}

function computeStationPlacements(): ComputedStationPlacement[] {
  return STATION_SPECS.map((spec) => {
    const { bodyId, planetCenter, camPos, forward, right, up, camDist } =
      getDestinationCameraBasis(spec.destinationId)

    const position = camPos
      .clone()
      .addScaledVector(forward, camDist * spec.dFactor)
      .addScaledVector(right, camDist * spec.xFactor)
      .addScaledVector(up, camDist * spec.yFactor)

    const sunDir = getSunDirectionForBody(bodyId)
    const planetDir = planetCenter.clone().sub(position).normalize()

    return {
      spec,
      position,
      scale: camDist * spec.scaleFactor,
      sunDir,
      planetDir,
    }
  })
}

let modelsCachePromise: Promise<Record<string, Group>> | null = null

function loadAllStationModels(): Promise<Record<string, Group>> {
  if (!modelsCachePromise) {
    const loader = new GLTFLoader()
    modelsCachePromise = Promise.all(
      STATION_SPECS.map(async (s) => {
        const gltf = await loader.loadAsync(`${BASE}models/${s.modelFile}`)
        return [s.modelFile, gltf.scene] as const
      }),
    ).then((pairs) => Object.fromEntries(pairs))
  }
  return modelsCachePromise
}

function orientObjectToSun(obj: Object3D, sunDir: Vector3, tilt: [number, number, number]): void {
  const target = obj.position.clone().add(sunDir)
  obj.lookAt(target)
  obj.rotateX(tilt[0])
  obj.rotateY(tilt[1])
  obj.rotateZ(tilt[2])
}

function animateStationInstance(
  holder: Group | null,
  rotor: Object3D | undefined,
  rotorSpeed: number,
  time: number,
  dt: number,
  index: number,
): void {
  if (rotor) {
    rotor.rotation.y += dt * rotorSpeed
  }
  if (holder) {
    holder.position.y = Math.sin(time * 0.75 + index * 1.3) * 0.035
    holder.rotation.z = Math.sin(time * 0.45 + index) * 0.025
  }
}

/* ================================================================== */
/* Lunas acompañantes: Europa (Júpiter) y Titán (Saturno)             */
/* ================================================================== */
function CompanionMoons() {
  const { europaPos, europaRadius, jupiterSun, titanPos, titanRadius, saturnSun } = useMemo(() => {
    const jBasis = getDestinationCameraBasis('jupiter-europa-station')
    const europaP = jBasis.camPos
      .clone()
      .addScaledVector(jBasis.forward, jBasis.camDist * 0.64)
      .addScaledVector(jBasis.right, -jBasis.camDist * 0.23)
      .addScaledVector(jBasis.up, jBasis.camDist * 0.13)

    const sBasis = getDestinationCameraBasis('saturn-titan-station')
    const titanP = sBasis.camPos
      .clone()
      .addScaledVector(sBasis.forward, sBasis.camDist * 0.7)
      .addScaledVector(sBasis.right, sBasis.camDist * 0.25)
      .addScaledVector(sBasis.up, sBasis.camDist * 0.16)

    return {
      europaPos: europaP,
      europaRadius: BODIES.jupiter.visualRadius * 0.145,
      jupiterSun: getSunDirectionForBody('jupiter'),
      titanPos: titanP,
      titanRadius: BODIES.saturn.visualRadius * 0.175,
      saturnSun: getSunDirectionForBody('saturn'),
    }
  }, [])

  const europaMat = useMemo(() => createEuropaMaterial(jupiterSun), [jupiterSun])
  const titanMat = useMemo(() => createTitanMaterial(saturnSun), [saturnSun])
  const titanHaze = useMemo(
    () =>
      createAtmosphereMaterial({
        sunDir: saturnSun,
        dayColor: '#48a4eb',
        terminatorColor: '#d97624',
        innerColor: '#f0b865',
        intensity: 1.25,
        scaleHeight: 0.035,
        atmoRadius: 1.09,
      }),
    [saturnSun],
  )

  useLayoutEffect(
    () => () => {
      europaMat.dispose()
      titanMat.dispose()
      titanHaze.dispose()
    },
    [europaMat, titanMat, titanHaze],
  )

  const europaRef = useRef<Mesh>(null)
  const titanRef = useRef<Mesh>(null)

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1)
    if (europaRef.current) europaRef.current.rotation.y += dt * 0.014
    if (titanRef.current) titanRef.current.rotation.y += dt * 0.011
  })

  return (
    <group name="companion-moons">
      {/* Europa en órbita joviana */}
      <group position={[europaPos.x, europaPos.y, europaPos.z]} scale={europaRadius} name="moon-europa">
        <mesh ref={europaRef} material={europaMat}>
          <sphereGeometry args={[1, 64, 32]} />
        </mesh>
      </group>

      {/* Titán en órbita saturniana exterior con bruma estratosférica azulada */}
      <group position={[titanPos.x, titanPos.y, titanPos.z]} scale={titanRadius} name="moon-titan">
        <mesh ref={titanRef} material={titanMat}>
          <sphereGeometry args={[1, 64, 32]} />
        </mesh>
        <mesh material={titanHaze} renderOrder={2}>
          <sphereGeometry args={[1.09, 48, 24]} />
        </mesh>
      </group>
    </group>
  )
}

/* ================================================================== */
/* Colonias e instalaciones de superficie (Marte y Mercurio)          */
/* ================================================================== */
interface ColonyClusterSpec {
  bodyId: 'mars' | 'mercury'
  accentColor: string
  glowColor: string
  offsets: ReadonlyArray<{ dTheta: number; dPhi: number; scale: number }>
}

const COLONY_SPECS: readonly ColonyClusterSpec[] = [
  {
    bodyId: 'mars',
    accentColor: '#ff9d5c',
    glowColor: '#00e5c3',
    offsets: [
      { dTheta: 0.08, dPhi: 0.06, scale: 1.0 },
      { dTheta: 0.13, dPhi: 0.03, scale: 0.72 },
      { dTheta: 0.05, dPhi: 0.11, scale: 0.64 },
      { dTheta: 0.17, dPhi: 0.08, scale: 0.55 },
    ],
  },
  {
    bodyId: 'mercury',
    accentColor: '#ffd27d',
    glowColor: '#35ddf2',
    offsets: [
      { dTheta: 0.12, dPhi: -0.05, scale: 0.9 },
      { dTheta: 0.17, dPhi: -0.01, scale: 0.65 },
      { dTheta: 0.09, dPhi: -0.1, scale: 0.58 },
    ],
  },
]

function SurfaceColonies() {
  const clusters = useMemo(() => {
    const domeGeo = new SphereGeometry(0.014, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2)
    const ringGeo = new RingGeometry(0.017, 0.023, 24)
    const towerGeo = new CylinderGeometry(0.002, 0.003, 0.024, 8)

    const domeMat = new MeshStandardMaterial({
      color: new Color('#d8e6ec'),
      metalness: 0.85,
      roughness: 0.2,
      emissive: new Color('#ffba75'),
      emissiveIntensity: 0.55,
    })

    const ringMat = new MeshBasicMaterial({
      color: new Color('#00e5c3'),
      transparent: true,
      opacity: 0.78,
      blending: AdditiveBlending,
      depthWrite: false,
    })

    const nodes = COLONY_SPECS.map((spec) => {
      const cfg = BODIES[spec.bodyId]
      const center = getBodyPosition(spec.bodyId)
      const destId: DestinationId =
        spec.bodyId === 'mars' ? 'mars-red-frontier' : 'mercury-solar-frontier'
      const basis = getDestinationCameraBasis(destId)
      // Dirección desde el centro del planeta hacia la cámara orbital.
      const toCam = basis.camPos.clone().sub(center).normalize()
      const sunDir = getSunDirectionForBody(spec.bodyId)
      // Colocamos las cúpulas cerca de la zona crepuscular del terminador visible.
      const baseNormal = toCam.clone().lerp(sunDir, 0.22).normalize()
      const tangentA = new Vector3().crossVectors(UP, baseNormal).normalize()
      const tangentB = new Vector3().crossVectors(baseNormal, tangentA).normalize()

      const domes = spec.offsets.map((o, idx) => {
        const normal = baseNormal
          .clone()
          .addScaledVector(tangentA, o.dTheta)
          .addScaledVector(tangentB, o.dPhi)
          .normalize()
        const surfacePoint = normal.clone().multiplyScalar(1.001)
        const holder = new Object3D()
        holder.position.copy(surfacePoint)
        holder.lookAt(normal.clone().multiplyScalar(2))
        return {
          key: `${spec.bodyId}-dome-${idx}`,
          pos: [surfacePoint.x, surfacePoint.y, surfacePoint.z] as [number, number, number],
          quat: [holder.quaternion.x, holder.quaternion.y, holder.quaternion.z, holder.quaternion.w] as [
            number,
            number,
            number,
            number,
          ],
          scale: o.scale,
        }
      })

      return {
        bodyId: spec.bodyId,
        planetPos: [center.x, center.y, center.z] as [number, number, number],
        planetRadius: cfg.visualRadius,
        domes,
      }
    })

    return { domeGeo, ringGeo, towerGeo, domeMat, ringMat, nodes }
  }, [])

  useLayoutEffect(
    () => () => {
      clusters.domeGeo.dispose()
      clusters.ringGeo.dispose()
      clusters.towerGeo.dispose()
      clusters.domeMat.dispose()
      clusters.ringMat.dispose()
    },
    [clusters],
  )

  return (
    <group name="surface-colonies">
      {clusters.nodes.map((c) => (
        <group key={c.bodyId} position={c.planetPos} scale={c.planetRadius}>
          {c.domes.map((d) => (
            <group key={d.key} position={d.pos} quaternion={d.quat} scale={d.scale}>
              <mesh
                geometry={clusters.domeGeo}
                material={clusters.domeMat}
                rotation={[Math.PI / 2, 0, 0]}
              />
              <mesh
                geometry={clusters.towerGeo}
                material={clusters.domeMat}
                rotation={[Math.PI / 2, 0, 0]}
                position={[0, 0, 0.012]}
              />
              <mesh
                geometry={clusters.ringGeo}
                material={clusters.ringMat}
                position={[0, 0, 0.001]}
                renderOrder={3}
              />
            </group>
          ))}
        </group>
      ))}
    </group>
  )
}

/* ================================================================== */
/* Estaciones e instalaciones orbitales GLB                           */
/* ================================================================== */
export function DestinationEnvironments() {
  const rawModels = use(loadAllStationModels())
  const placements = useMemo(() => computeStationPlacements(), [])

  const instances = useMemo(() => {
    return placements.map((p) => {
      const template = rawModels[p.spec.modelFile]!
      const scene = template.clone(true)
      const rotor = scene.getObjectByName('rotor_ring')
      if (p.spec.faceSun) {
        orientObjectToSun(scene, p.sunDir, p.spec.tilt)
      } else {
        scene.rotation.set(...p.spec.tilt)
      }
      return {
        ...p,
        scene,
        rotor,
      }
    })
  }, [rawModels, placements])

  const holderRefs = useRef<Record<string, Group | null>>({})
  const timeRef = useRef(0)

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1)
    timeRef.current += dt
    instances.forEach((inst, i) => {
      animateStationInstance(
        holderRefs.current[inst.spec.destinationId] ?? null,
        inst.rotor,
        inst.spec.rotorSpeed,
        timeRef.current,
        dt,
        i,
      )
    })
  })

  return (
    <group name="destination-environments">
      <CompanionMoons />
      <SurfaceColonies />

      {instances.map((inst) => (
        <group
          key={inst.spec.destinationId}
          position={[inst.position.x, inst.position.y, inst.position.z]}
          scale={inst.scale}
          name={`station-${inst.spec.destinationId}`}
        >
          {/* Iluminación local PBR coherente con la dirección solar y el albedo planetario */}
          <pointLight
            position={[inst.sunDir.x * 6, inst.sunDir.y * 6, inst.sunDir.z * 6]}
            intensity={4.2}
            distance={14}
            decay={1.2}
            color="#fff5e4"
          />
          <pointLight
            position={[inst.planetDir.x * 4, inst.planetDir.y * 4, inst.planetDir.z * 4]}
            intensity={1.6}
            distance={10}
            decay={1.4}
            color={inst.spec.bounceColor}
          />
          <group
            ref={(node) => {
              holderRefs.current[inst.spec.destinationId] = node
            }}
          >
            <primitive object={inst.scene} />
          </group>
        </group>
      ))}
    </group>
  )
}
