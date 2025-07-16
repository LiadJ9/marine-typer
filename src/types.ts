import type { LatLng, LatLngExpression } from 'leaflet';

export type Location = { country: string; city: string };

export interface Occurrence {
  aphiaID: number;
  scientificName: string;
  decimalLatitude: number;
  decimalLongitude: number;
}

export interface FetchFishesResponse {
  total: number;
  results: Occurrence[];
}

export interface FetchFishesParams {
  lon: number;
  lat: number;
  radiusMeters?: number;
}

export interface Fish {
  aphiaID: number;
  name?: string;
  size: number;
  lat: number;
  lon: number;
  scientificName: string;
  properties: { isBig?: boolean; isSmall?: boolean };
  description?: string;
  imgUrl?: string;
}

export interface FishStats
  extends Omit<Fish, 'size' | 'lat' | 'lon' | 'properties'> {
  aphiaID: number;
  name?: string;
  scientificName: string;
  imgUrl?: string;
  locations: LatLngExpression[];
  count: number;
  biggestEver: number;
  smallestEver: number;
}

export interface FishMarkers {
  aphiaID: number;
  position: LatLngExpression;
  scientificName: string;
  name?: string;
  imgUrl?: string;
}

export type RequiredPick<T, K extends keyof T> = Partial<T> &
  Required<Pick<T, K>>;

export interface DialogChildProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}
