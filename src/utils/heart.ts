/**
 * Parametric heart curve from the original Python script.
 *
 *   x = 16 sin³(t)
 *   y = 13 cos(t) − 5 cos(2t) − 2 cos(3t) − cos(4t)
 */

export interface Point2D {
  x: number;
  y: number;
}

export function heartPoint(t: number): Point2D {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y =
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t);
  // Flip y so the heart points upward on screen
  return { x, y: -y };
}
