import { TRASH_EMOJIS } from '../consts';
import type {
  Fish,
  FishMarkers,
  FishStats,
  Occurrence,
  RequiredPick,
} from '../types';

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

export const formatRequestFishData = (
  fishes: Occurrence[]
): RequiredPick<
  Fish,
  'aphiaID' | 'scientificName' | 'size' | 'lat' | 'lon' | 'properties'
>[] => {
  const newFishes: Fish[] = fishes.map((fish) => {
    const { size, isBig, isSmall } = calculateRandomFishSize();
    return {
      aphiaID: fish.aphiaID,
      scientificName: fish.scientificName,
      lat: fish.decimalLatitude,
      lon: fish.decimalLongitude,
      size,
      properties: { isBig, isSmall },
    };
  });

  return newFishes;
};

export const calculateRandomFishSize = () => {
  const isBig = Math.random() >= 0.9;
  const isSmall = Math.random() <= 0.1;
  if (isBig) {
    const bigSize = Math.floor(Math.random() * 100) + 1;
    return { size: bigSize, isBig };
  }
  if (isSmall) {
    const smallSize = Math.floor(Math.random() * 10) + 1;
    return { size: smallSize, isSmall };
  }
  const size = Math.floor(Math.random() * 50) + 1;
  return { size };
};

export const getRandomTrashEmoji = () => {
  return TRASH_EMOJIS[Math.floor(Math.random() * TRASH_EMOJIS.length)];
};

export const getFishMarkers = (fishes: Record<number, FishStats>) => {
  let markers: FishMarkers[] = [];
  Object.values(fishes).map((fish) => {
    const fishMarkers = fish.locations.map((location) => {
      return {
        aphiaID: fish.aphiaID,
        position: location,
        scientificName: fish.scientificName,
        name: fish.name,
        imgUrl: fish.imgUrl,
      };
    });
    markers = [...markers, ...fishMarkers];
  });
  return markers;
};
