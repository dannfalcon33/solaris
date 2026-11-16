import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  AdditiveBlending,
  Color,
  CylinderGeometry,
  DodecahedronGeometry,
  Group,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  Quaternion,
  RingGeometry,
  SphereGeometry,
  Vector3,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { computeCameraPose } from '@/engine/camera/heroLayout'
import { useQuality } from '@/engine/config/quality'
import { BODIES, DESTINATION_TO_BODY, getBodyPosition, getSunDirectionForBody } from '@/engine/config/solarSystemLayout'
import { debugStats } from '@/engine/debug/debugStats'
import { createAtmosphereMaterial } from '@/engine/materials/cloudsAndAtmosphere'
import { createEuropaMaterial, createTitanMaterial } from '@/engine/materials/moonMaterials'
import { getMotionScale } from '@/hooks/usePrefersReducedMotion'
import { useNavigationStore } from '@/stores/navigation.store'
import type { DestinationId } from '@/types'

const UP = new Vector3(0, 1, 0)
const BASE = import.meta.env.BASE_URL
const REFERENCE_ASPECT = 16 / 9

interface StationPlacementSpec {
  destinationId: DestinationId
  modelFile: string
  dFactor: number
  xFactor: number
  yFactor: number
  scaleFactor: number
  tilt: [number, number, number]
  faceSun?: boolean
  rotorSpeed: number
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

const modelPromiseCache = new Map<string, Promise<Group>>()
const gltfLoader = new GLTFLoader()

/** Carga diferida e individual de modelos .glb con caché en memoria. */
function loadStationModel(modelFile: string): Promise<Group> {
  let promise = modelPromiseCache.get(modelFile)
  if (!promise) {
    const t0 = performance.now()
    promise = gltfLoader.loadAsync(`${BASE}models/${modelFile}`).then((gltf) => {
      debugStats.textureLoadMs[`glb:${modelFile}`] = Math.round(performance.now() - t0)
      return gltf.scene
    })
    modelPromiseCache.set(modelFile, promise)
  }
  return promise
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
    const dt = Math.min(delta, 0.1) * getMotionScale()
    if (europaRef.current) europaRef.current.rotation.y += dt * 0.014
    if (titanRef.current) titanRef.current.rotation.y += dt * 0.011
  })

  return (
    <group name="companion-moons">
      <group position={[europaPos.x, europaPos.y, europaPos.z]} scale={europaRadius} name="moon-europa">
        <mesh ref={europaRef} material={europaMat}>
          <sphereGeometry args={[1, 48, 24]} />
        </mesh>
      </group>

      <group position={[titanPos.x, titanPos.y, titanPos.z]} scale={titanRadius} name="moon-titan">
        <mesh ref={titanRef} material={titanMat}>
          <sphereGeometry args={[1, 48, 24]} />
        </mesh>
        <mesh material={titanHaze} renderOrder={2}>
          <sphereGeometry args={[1.09, 36, 18]} />
        </mesh>
      </group>
    </group>
  )
}

/* ================================================================== */
/* Colonias de superficie con InstancedMesh (Marte y Mercurio)        */
/* ================================================================== */
interface ColonyClusterSpec {
  bodyId: 'mars' | 'mercury'
  offsets: ReadonlyArray<{ dTheta: number; dPhi: number; scale: number }>
}

const COLONY_SPECS: readonly ColonyClusterSpec[] = [
  {
    bodyId: 'mars',
    offsets: [
      { dTheta: 0.08, dPhi: 0.06, scale: 1.0 },
      { dTheta: 0.13, dPhi: 0.03, scale: 0.72 },
      { dTheta: 0.05, dPhi: 0.11, scale: 0.64 },
      { dTheta: 0.17, dPhi: 0.08, scale: 0.55 },
    ],
  },
  {
    bodyId: 'mercury',
    offsets: [
      { dTheta: 0.12, dPhi: -0.05, scale: 0.9 },
      { dTheta: 0.17, dPhi: -0.01, scale: 0.65 },
      { dTheta: 0.09, dPhi: -0.1, scale: 0.58 },
    ],
  },
]

function applyInstancedColonyMatrices(
  domesMesh: InstancedMesh,
  towersMesh: InstancedMesh,
  ringsMesh: InstancedMesh,
  domeMatrices: Matrix4[],
  towerMatrices: Matrix4[],
  ringMatrices: Matrix4[],
): void {
  for (let i = 0; i < domeMatrices.length; i++) {
    domesMesh.setMatrixAt(i, domeMatrices[i]!)
    towersMesh.setMatrixAt(i, towerMatrices[i]!)
    ringsMesh.setMatrixAt(i, ringMatrices[i]!)
  }
  domesMesh.instanceMatrix.needsUpdate = true
  towersMesh.instanceMatrix.needsUpdate = true
  ringsMesh.instanceMatrix.needsUpdate = true
}

function InstancedSurfaceColonies() {
  const { domeGeo, ringGeo, towerGeo, domeMat, ringMat, domeMatrices, towerMatrices, ringMatrices } =
    useMemo(() => {
      const dGeo = new SphereGeometry(0.014, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2)
      dGeo.rotateX(Math.PI / 2)

      const tGeo = new CylinderGeometry(0.002, 0.003, 0.024, 8)
      tGeo.rotateX(Math.PI / 2)
      tGeo.translate(0, 0, 0.012)

      const rGeo = new RingGeometry(0.017, 0.023, 24)
      rGeo.translate(0, 0, 0.001)

      const dMat = new MeshStandardMaterial({
        color: new Color('#d8e6ec'),
        metalness: 0.85,
        roughness: 0.2,
        emissive: new Color('#ffba75'),
        emissiveIntensity: 0.55,
      })

      const rMat = new MeshBasicMaterial({
        color: new Color('#00e5c3'),
        transparent: true,
        opacity: 0.78,
        blending: AdditiveBlending,
        depthWrite: false,
      })

      const dMatrices: Matrix4[] = []
      const tMatrices: Matrix4[] = []
      const rMatrices: Matrix4[] = []
      const dummy = new Object3D()

      for (const spec of COLONY_SPECS) {
        const cfg = BODIES[spec.bodyId]
        const center = getBodyPosition(spec.bodyId)
        const destId: DestinationId =
          spec.bodyId === 'mars' ? 'mars-red-frontier' : 'mercury-solar-frontier'
        const basis = getDestinationCameraBasis(destId)
        const toCam = basis.camPos.clone().sub(center).normalize()
        const sunDir = getSunDirectionForBody(spec.bodyId)
        const baseNormal = toCam.clone().lerp(sunDir, 0.22).normalize()
        const tangentA = new Vector3().crossVectors(UP, baseNormal).normalize()
        const tangentB = new Vector3().crossVectors(baseNormal, tangentA).normalize()

        for (const o of spec.offsets) {
          const normal = baseNormal
            .clone()
            .addScaledVector(tangentA, o.dTheta)
            .addScaledVector(tangentB, o.dPhi)
            .normalize()
          const worldPoint = center.clone().addScaledVector(normal, cfg.visualRadius * 1.001)
          dummy.position.copy(worldPoint)
          dummy.lookAt(worldPoint.clone().add(normal))
          dummy.scale.setScalar(cfg.visualRadius * o.scale)
          dummy.updateMatrix()

          const m = dummy.matrix.clone()
          dMatrices.push(m)
          tMatrices.push(m)
          rMatrices.push(m)
        }
      }

      return {
        domeGeo: dGeo,
        ringGeo: rGeo,
        towerGeo: tGeo,
        domeMat: dMat,
        ringMat: rMat,
        domeMatrices: dMatrices,
        towerMatrices: tMatrices,
        ringMatrices: rMatrices,
      }
    }, [])

  const domesRef = useRef<InstancedMesh>(null)
  const towersRef = useRef<InstancedMesh>(null)
  const ringsRef = useRef<InstancedMesh>(null)

  useLayoutEffect(() => {
    if (!domesRef.current || !towersRef.current || !ringsRef.current) return
    applyInstancedColonyMatrices(
      domesRef.current,
      towersRef.current,
      ringsRef.current,
      domeMatrices,
      towerMatrices,
      ringMatrices,
    )
  }, [domeMatrices, towerMatrices, ringMatrices])

  useLayoutEffect(
    () => () => {
      domeGeo.dispose()
      towerGeo.dispose()
      ringGeo.dispose()
      domeMat.dispose()
      ringMat.dispose()
    },
    [domeGeo, towerGeo, ringGeo, domeMat, ringMat],
  )

  const count = domeMatrices.length

  return (
    <group name="instanced-surface-colonies">
      <instancedMesh ref={domesRef} args={[domeGeo, domeMat, count]} frustumCulled={false} />
      <instancedMesh ref={towersRef} args={[towerGeo, domeMat, count]} frustumCulled={false} />
      <instancedMesh
        ref={ringsRef}
        args={[ringGeo, ringMat, count]}
        renderOrder={3}
        frustumCulled={false}
      />
    </group>
  )
}

/* ================================================================== */
/* Cinturón de asteroides instanciado (InstancedMesh — FASE 6)        */
/* ================================================================== */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function populateAsteroidMatrices(mesh: InstancedMesh, matrices: Matrix4[]): void {
  for (let i = 0; i < matrices.length; i++) {
    mesh.setMatrixAt(i, matrices[i]!)
  }
  mesh.instanceMatrix.needsUpdate = true
}

function InstancedAsteroidBelt() {
  const quality = useQuality()
  const show = useNavigationStore(
    (s) =>
      s.state === 'solar_system' ||
      (s.state === 'transitioning' && s.transitionGoal === 'solar_system'),
  )
  const count = quality.tier === 'low' ? 160 : quality.tier === 'medium' ? 280 : 420

  const { geometry, material, matrices } = useMemo(() => {
    const rand = mulberry32(90421)
    const geo = new DodecahedronGeometry(0.11, 0)
    const mat = new MeshStandardMaterial({
      color: new Color('#7e756c'),
      roughness: 0.9,
      metalness: 0.15,
    })

    const mats: Matrix4[] = []
    const pos = new Vector3()
    const quat = new Quaternion()
    const scale = new Vector3()

    for (let i = 0; i < count; i++) {
      const angle = rand() * Math.PI * 2
      const radius = 41.2 + (rand() - 0.5) * 4.8
      const y = (rand() - 0.5) * 1.4
      pos.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius)
      quat.setFromAxisAngle(
        new Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize(),
        rand() * Math.PI * 2,
      )
      const s = 0.35 + Math.pow(rand(), 2.2) * 1.25
      scale.set(s * (0.8 + rand() * 0.4), s * (0.7 + rand() * 0.5), s)

      const m = new Matrix4().compose(pos, quat, scale)
      mats.push(m)
    }

    return { geometry: geo, material: mat, matrices: mats }
  }, [count])

  const meshRef = useRef<InstancedMesh>(null)

  useLayoutEffect(() => {
    if (!meshRef.current) return
    populateAsteroidMatrices(meshRef.current, matrices)
  }, [matrices])

  useLayoutEffect(
    () => () => {
      geometry.dispose()
      material.dispose()
    },
    [geometry, material],
  )

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, count]}
      visible={show}
      name="instanced-asteroid-belt"
    />
  )
}

/* ================================================================== */
/* Estaciones orbitales GLB con carga diferida y activación selectiva */
/* ================================================================== */
interface LoadedStationInstance extends ComputedStationPlacement {
  scene: Group
  rotor: Object3D | undefined
}

export function DestinationEnvironments() {
  const placements = useMemo(() => computeStationPlacements(), [])
  const sceneReady = useNavigationStore((s) => s.sceneReady)
  const state = useNavigationStore((s) => s.state)
  const transitionGoal = useNavigationStore((s) => s.transitionGoal)
  const selectedDestinationId = useNavigationStore((s) => s.selectedDestinationId)

  const [loadedMap, setLoadedMap] = useState<Record<string, Group>>({})

  // Priorizar inmediatamente el modelo del destino seleccionado.
  useEffect(() => {
    if (!selectedDestinationId) return
    const spec = STATION_SPECS.find((s) => s.destinationId === selectedDestinationId)
    if (!spec || loadedMap[spec.modelFile]) return
    let cancelled = false
    loadStationModel(spec.modelFile)
      .then((scene) => {
        if (!cancelled) {
          setLoadedMap((prev) => (prev[spec.modelFile] ? prev : { ...prev, [spec.modelFile]: scene }))
        }
      })
      .catch((err) => console.warn(`[solaris] Error cargando ${spec.modelFile}`, err))
    return () => {
      cancelled = true
    }
  }, [selectedDestinationId, loadedMap])

  // Precarga diferida en segundo plano cuando la escena inicial ya está lista.
  useEffect(() => {
    if (!sceneReady) return
    let cancelled = false
    const timer = window.setTimeout(() => {
      for (const spec of STATION_SPECS) {
        loadStationModel(spec.modelFile)
          .then((scene) => {
            if (!cancelled) {
              setLoadedMap((prev) =>
                prev[spec.modelFile] ? prev : { ...prev, [spec.modelFile]: scene },
              )
            }
          })
          .catch(() => {
            /* silencioso en precarga */
          })
      }
    }, 900)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [sceneReady])

  const instances = useMemo<LoadedStationInstance[]>(() => {
    const out: LoadedStationInstance[] = []
    for (const p of placements) {
      const template = loadedMap[p.spec.modelFile]
      if (!template) continue
      const scene = template.clone(true)
      const rotor = scene.getObjectByName('rotor_ring')
      if (p.spec.faceSun) {
        orientObjectToSun(scene, p.sunDir, p.spec.tilt)
      } else {
        scene.rotation.set(...p.spec.tilt)
      }
      out.push({ ...p, scene, rotor })
    }
    return out
  }, [loadedMap, placements])

  const holderRefs = useRef<Record<string, Group | null>>({})
  const timeRef = useRef(0)

  const activeDestinationId =
    state === 'planet_detail' ||
    state === 'station_detail' ||
    (state === 'transitioning' && transitionGoal === 'destination')
      ? selectedDestinationId
      : null

  useFrame((_, delta) => {
    if (!activeDestinationId) return
    const dt = Math.min(delta, 0.1) * getMotionScale()
    timeRef.current += dt
    instances.forEach((inst, i) => {
      if (inst.spec.destinationId !== activeDestinationId) return
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
      <InstancedSurfaceColonies />
      <InstancedAsteroidBelt />

      {instances.map((inst) => {
        const isActive = inst.spec.destinationId === activeDestinationId
        return (
          <group
            key={inst.spec.destinationId}
            visible={isActive}
            position={[inst.position.x, inst.position.y, inst.position.z]}
            scale={inst.scale}
            name={`station-${inst.spec.destinationId}`}
          >
            {isActive && (
              <>
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
              </>
            )}
            <group
              ref={(node) => {
                holderRefs.current[inst.spec.destinationId] = node
              }}
            >
              <primitive object={inst.scene} />
            </group>
          </group>
        )
      })}
    </group>
  )
}
