/**
 * Tiny isometric projection helper for the SVG drawings (About timeline and demo project illustrations).
 * World axes: x runs down-right, y runs down-left, z is up. Visible faces are the top,
 * the "front" face (at y + depth) and the "side" face (at x + width).
 */
export type Point3 = [number, number, number]

const COS = Math.cos(Math.PI / 6)
const SIN = 0.5

export function createIso(unit: number) {
  const project = ([x, y, z]: Point3): [number, number] => [
    Math.round((x - y) * COS * unit * 100) / 100,
    Math.round(((x + y) * SIN - z) * unit * 100) / 100,
  ]

  /** Closed polygon through the given points. */
  const path = (points: Point3[]) => `M${points.map(point => project(point).join(' ')).join(' L')} Z`

  /** Open polyline. */
  const polyline = (points: Point3[]) => `M${points.map(point => project(point).join(' ')).join(' L')}`

  const line = (a: Point3, b: Point3) => polyline([a, b])

  /** Rectangle on a horizontal plane. */
  const rect = (x: number, y: number, w: number, d: number, z = 0) =>
    path([[x, y, z], [x + w, y, z], [x + w, y + d, z], [x, y + d, z]])

  const box = (x: number, y: number, z: number, w: number, d: number, h: number) => ({
    top: rect(x, y, w, d, z + h),
    front: path([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]]),
    side: path([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]]),
    /** Wireframe edges, useful for "structure" drawings. */
    edges: [
      polyline([[x, y, z], [x + w, y, z], [x + w, y + d, z], [x, y + d, z], [x, y, z]]),
      polyline([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h], [x, y, z + h]]),
      line([x, y, z], [x, y, z + h]),
      line([x + w, y, z], [x + w, y, z + h]),
      line([x + w, y + d, z], [x + w, y + d, z + h]),
      line([x, y + d, z], [x, y + d, z + h]),
    ],
  })

  /** Gable roof with the ridge running along x. `z` is the eave height. */
  const gable = (x: number, y: number, z: number, w: number, d: number, rise: number, overhang = 0) => {
    const o = overhang
    const ridge = y + d / 2
    return {
      back: path([[x - o, y - o, z], [x + w + o, y - o, z], [x + w + o, ridge, z + rise], [x - o, ridge, z + rise]]),
      front: path([[x - o, y + d + o, z], [x + w + o, y + d + o, z], [x + w + o, ridge, z + rise], [x - o, ridge, z + rise]]),
      end: path([[x + w, y, z], [x + w, y + d, z], [x + w, ridge, z + rise]]),
      ridge: line([x - o, ridge, z + rise], [x + w + o, ridge, z + rise]),
    }
  }

  /** Gable roof with the ridge running along y. The visible end triangle is on the front face. */
  const gableY = (x: number, y: number, z: number, w: number, d: number, rise: number, overhang = 0) => {
    const o = overhang
    const ridge = x + w / 2
    return {
      left: path([[x - o, y - o, z], [x - o, y + d + o, z], [ridge, y + d + o, z + rise], [ridge, y - o, z + rise]]),
      right: path([[x + w + o, y - o, z], [x + w + o, y + d + o, z], [ridge, y + d + o, z + rise], [ridge, y - o, z + rise]]),
      end: path([[x, y + d, z], [x + w, y + d, z], [ridge, y + d, z + rise]]),
    }
  }

  /** Rectangle drawn on a front-facing wall (plane y = face). */
  const frontPanel = (face: number, x: number, z: number, w: number, h: number) =>
    path([[x, face, z], [x + w, face, z], [x + w, face, z + h], [x, face, z + h]])

  /** Rectangle drawn on a side-facing wall (plane x = face). */
  const sidePanel = (face: number, y: number, z: number, d: number, h: number) =>
    path([[face, y, z], [face, y + d, z], [face, y + d, z + h], [face, y, z + h]])

  /** Smooth open curve through ground points (used for contours). */
  const contour = (points: [number, number][], z = 0) => {
    const projected = points.map(([x, y]) => project([x, y, z]))
    let d = `M${projected[0].join(' ')}`
    for (let index = 1; index < projected.length - 1; index++) {
      const [cx, cy] = projected[index]
      const [nx, ny] = projected[index + 1]
      d += ` Q${cx} ${cy} ${(cx + nx) / 2} ${(cy + ny) / 2}`
    }
    return `${d} L${projected[projected.length - 1].join(' ')}`
  }

  return { project, path, polyline, line, rect, box, gable, gableY, frontPanel, sidePanel, contour }
}
