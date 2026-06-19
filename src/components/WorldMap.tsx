/**
 * Global Markets map — a realistic world map showing NTA Group's trade routes
 * radiating from the UAE hub. Served as a static image asset.
 */
export default function WorldMap() {
  return (
    <img
      src={`${import.meta.env.BASE_URL}images/world-map.png`}
      alt="Global trade routes from NTA Group's UAE hub to markets worldwide"
      className="block h-auto w-full"
    />
  )
}
