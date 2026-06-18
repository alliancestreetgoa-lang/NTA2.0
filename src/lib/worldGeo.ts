/**
 * Coarse continent outlines + helpers, shared by the 3D hero globe and the
 * Global Markets SVG map. Low fidelity by design — rendered as dot clusters so
 * shapes read as a world map without needing real geodata.
 */

export const CONTINENTS: [number, number][][] = [
  // North America
  [
    [-159, 64], [-150, 61], [-140, 60], [-130, 56], [-124, 48], [-124, 40], [-118, 33],
    [-110, 23], [-105, 22], [-97, 16], [-90, 14], [-83, 9], [-81, 18], [-80, 26], [-75, 35],
    [-70, 42], [-66, 45], [-60, 47], [-56, 51], [-64, 60], [-78, 62], [-95, 60], [-110, 68],
    [-125, 70], [-140, 70], [-156, 71], [-168, 66], [-159, 64],
  ],
  // Greenland
  [[-45, 60], [-30, 60], [-20, 70], [-25, 80], [-45, 83], [-60, 80], [-55, 70], [-45, 60]],
  // South America
  [
    [-81, 5], [-78, 0], [-80, -5], [-75, -15], [-70, -20], [-71, -30], [-73, -40], [-74, -50],
    [-68, -55], [-65, -50], [-62, -40], [-58, -35], [-56, -30], [-48, -25], [-40, -20],
    [-35, -8], [-35, -5], [-50, 0], [-60, 5], [-70, 10], [-78, 8], [-81, 5],
  ],
  // Africa
  [
    [-17, 15], [-16, 21], [-9, 30], [0, 34], [10, 36], [20, 32], [30, 31], [34, 28], [35, 22],
    [43, 12], [51, 12], [42, -5], [40, -15], [35, -22], [27, -33], [20, -35], [18, -30],
    [12, -18], [9, 0], [3, 5], [-7, 5], [-12, 9], [-17, 15],
  ],
  // Europe
  [
    [-10, 37], [-9, 43], [-2, 44], [0, 49], [2, 51], [8, 54], [12, 58], [22, 60], [30, 62],
    [40, 64], [32, 54], [30, 48], [28, 45], [20, 42], [14, 40], [8, 44], [3, 42], [-2, 38], [-10, 37],
  ],
  // Asia
  [
    [32, 54], [45, 50], [50, 44], [55, 42], [60, 38], [62, 40], [68, 38], [72, 28], [78, 22],
    [80, 10], [78, 8], [83, 17], [90, 22], [95, 16], [98, 8], [104, 9], [106, 18], [110, 20],
    [120, 22], [122, 30], [126, 34], [130, 42], [135, 45], [140, 50], [142, 54], [150, 58],
    [160, 64], [170, 66], [178, 68], [165, 70], [140, 72], [120, 73], [100, 72], [85, 70],
    [70, 68], [60, 66], [55, 60], [48, 56], [40, 56], [32, 54],
  ],
  // India peninsula
  [[70, 24], [73, 18], [76, 10], [78, 8], [80, 13], [82, 18], [85, 20], [88, 22], [80, 25], [73, 24], [70, 24]],
  // SE Asia / Indonesia
  [[98, 4], [104, 2], [110, 0], [118, 0], [120, -4], [115, -8], [106, -8], [100, -2], [98, 4]],
  // Australia
  [
    [114, -22], [122, -18], [130, -12], [137, -12], [142, -11], [145, -16], [150, -24],
    [153, -28], [150, -38], [143, -39], [135, -35], [129, -32], [120, -34], [115, -30], [114, -22],
  ],
]

export function inPolygon(lon: number, lat: number, poly: [number, number][]): boolean {
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0]
    const yi = poly[i][1]
    const xj = poly[j][0]
    const yj = poly[j][1]
    const intersect = yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi
    if (intersect) inside = !inside
  }
  return inside
}

export function isLand(lon: number, lat: number): boolean {
  return CONTINENTS.some((c) => inPolygon(lon, lat, c))
}

/**
 * Sample a grid of land points (degrees). `polar` widens longitude spacing
 * toward the poles to keep on-sphere density roughly even.
 */
export function landGrid(stepLat = 2.6, stepLon = 2.6, polar = true): [number, number][] {
  const pts: [number, number][] = []
  for (let lat = -78; lat <= 80; lat += stepLat) {
    const ls = polar ? stepLon / Math.max(0.22, Math.cos((lat * Math.PI) / 180)) : stepLon
    for (let lon = -180; lon <= 180; lon += ls) {
      if (isLand(lon, lat)) pts.push([lon, lat])
    }
  }
  return pts
}
