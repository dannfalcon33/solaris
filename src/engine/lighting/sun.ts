import { Vector3 } from 'three'

/**
 * Dirección HACIA el Sol (espacio mundo). Única fuente de verdad para la luz
 * direccional y los shaders. Elegida para que, con la Tierra a la derecha del
 * encuadre hero, el lado diurno mire a cámara y el terminador (ciudades
 * nocturnas) quede visible en el limbo derecho.
 */
export const SUN_DIRECTION = new Vector3(-0.85, 0.28, 0.45).normalize()

