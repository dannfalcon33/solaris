/** Encuadre "hero" de la Tierra según el aspecto de la ventana. */
export interface HeroLayout {
  x: number
  y: number
  /** Radio visual de la Tierra en unidades de escena. */
  radius: number
}

export const HERO_CAMERA_Z = 5
export const HERO_FOV = 45

/**
 * Escritorio/apaisado: Tierra grande a la derecha, dejando libre el texto del
 * hero. Vertical: Tierra centrada en la mitad superior.
 */
export function heroLayout(aspect: number): HeroLayout {
  const halfH = HERO_CAMERA_Z * Math.tan((HERO_FOV * Math.PI) / 360)
  const halfW = halfH * aspect

  if (aspect >= 1.2) {
    const radius = Math.min(1.75, halfH * 0.82)
    return { x: Math.min(halfW * 0.42, halfW - radius * 1.05), y: -0.12, radius }
  }
  const radius = Math.min(1.55, halfW * 0.88)
  return { x: 0, y: halfH * 0.28, radius }
}

