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
