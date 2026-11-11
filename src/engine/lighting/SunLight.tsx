/** Iluminación solar direccional de la escena placeholder. */
export function SunLight() {
  return (
    <>
      <ambientLight intensity={0.08} />
      <directionalLight position={[6, 2, 4]} intensity={3.2} color="#fff4e0" />
    </>
  )
}

