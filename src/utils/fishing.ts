/**
 * Create a WKT POLYGON string around a lat/lon point (For fetching fish data).
 * @param {number} lon - Longitude
 * @param {number} lat - Latitude
 * @param {number} radiusMeters - Radius in meters
 * @returns {string} WKT polygon string
 */
export const createWktBoundingBox = (
  lon: number,
  lat: number,
  radiusMeters = 5000
) => {
  const earthRadius = 6378137; // in meters (Pretty important)
  const deltaLat = (radiusMeters / earthRadius) * (180 / Math.PI);
  const deltaLon =
    (radiusMeters / (earthRadius * Math.cos((Math.PI * lat) / 180))) *
    (180 / Math.PI);

  const minLat = lat - deltaLat;
  const maxLat = lat + deltaLat;
  const minLon = lon - deltaLon;
  const maxLon = lon + deltaLon;

  return `POLYGON((${minLon} ${minLat},${maxLon} ${minLat},${maxLon} ${maxLat},${minLon} ${maxLat},${minLon} ${minLat}))`;
};
