import axios, { type AxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';
import type { FetchFishesParams, FetchFishesResponse, Location } from './types';
import { createWktBoundingBox } from './utils';

export interface ApiRequestParams {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: unknown;
  headers?: Record<string, string>;
  query?: Record<string, string>;
  params?: Record<string, string>;
}

export const apiRequest = async <T = unknown>({
  url,
  method,
  data,
  headers,
  params,
}: ApiRequestParams): Promise<T> => {
  const axiosConfig: AxiosRequestConfig = {
    method: method || 'GET',
    url,
    params,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    data: data || {},
  };

  const response = await axios(axiosConfig);
  return response.data;
};

export const fetchFishes = async ({
  lon,
  lat,
  radiusMeters = 5000,
}: FetchFishesParams): Promise<FetchFishesResponse | null> => {
  const wkt = createWktBoundingBox(lon, lat, radiusMeters);
  try {
    const fishes = await apiRequest<FetchFishesResponse>({
      url: 'https://api.obis.org/v3/occurrence',
      params: {
        geometry: wkt,
        fields: 'scientificName,aphiaID,decimalLatitude,decimalLongitude',
        size: '5',
      },
      method: 'GET',
    });
    return fishes;
  } catch (e) {
    console.error(e);
    toast.error('Failed to fetch fishes :( E: ' + e);
    return null;
  }
};

export const fetchFishDetails = async (
  aphiaID: number,
  scientificName: string
) => {
  try {
    const res = await Promise.all([
      apiRequest<{ language: string; vernacular: string }[]>({
        url: `https://www.marinespecies.org/rest/AphiaVernacularsByAphiaID/${aphiaID}`,
        method: 'GET',
      }),
      apiRequest<{ usageKey: string }>({
        url: `https://api.gbif.org/v1/species/match?name=${scientificName}`,
        method: 'GET',
      }),
    ]);
    const [nameRes, species] = res;
    if (!nameRes || !species) {
      throw new Error('One of the requests failed', {
        cause: { nameRes, species },
      });
    }
    const englishRes = nameRes?.find((n) => n.language === 'English');
    const imageRes = await apiRequest<{ results: { identifier: string }[] }>({
      url: `https://api.gbif.org/v1/species/${species.usageKey}/media`,
      method: 'GET',
    });
    const imageUrl =
      imageRes?.results?.length > 0 && imageRes.results[0]?.identifier;
    return {
      name: englishRes?.vernacular || '',
      image: imageUrl || '',
    };
  } catch (e) {
    console.error(e);
    toast.error('Failed to fetch fish NAME/IMAGE :( e: ' + e);
  }
};

export const fetchCountry = async (
  lat: number,
  lng: number,
  callBack: (location: Location) => void
): Promise<Location> => {
  try {
    const res = await apiRequest<{
      address: Location;
      error: string;
    }>({
      url: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      method: 'GET',
    });
    let location: Location;
    if (res?.error) {
      location = {
        country: 'Open sea',
        city: '',
      };
      callBack(location);
      return {
        country: 'Open sea',
        city: '',
      };
    }
    location = {
      country: res.address.country,
      city: res.address.city,
    };
    callBack(location);
    return location;
  } catch (err) {
    console.log(err);
    toast.error('Failed to fetch country :( E: ' + err);
    const location = {
      country: 'Open sea',
      city: '',
    };
    callBack(location);
    return location;
  }
};
