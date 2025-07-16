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
  radiusMeters = 40000, //This has to be this high because of how the API works
}: FetchFishesParams): Promise<FetchFishesResponse | null> => {
  const wkt = createWktBoundingBox(lon, lat, radiusMeters);
  try {
    const fishes = await apiRequest<FetchFishesResponse>({
      url: 'https://api.obis.org/v3/occurrence',
      params: {
        geometry: wkt,
        fields: 'scientificName,aphiaID,decimalLatitude,decimalLongitude',
        taxonId: '11676',
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
): Promise<{ name?: string; imgUrl?: string; description?: string }> => {
  try {
    const fishName = await apiRequest<
      { language: string; vernacular: string }[]
    >({
      url: `https://www.marinespecies.org/rest/AphiaVernacularsByAphiaID/${aphiaID}`,
      method: 'GET',
    });

    const englishRes =
      fishName && fishName?.find((n) => n.language === 'English');
    const { imgUrl, description } = await fetchWikipediaDetails(scientificName);
    return {
      name: englishRes?.vernacular || '',
      imgUrl: imgUrl || undefined,
      description: description || undefined,
    };
  } catch (e) {
    console.error(e);
    toast.error('Failed to fetch some Information on this fish, sorry ;( ');
    return { name: undefined, imgUrl: undefined };
  }
};

export const fetchWikipediaDetails = async (
  fishName: string
): Promise<{ imgUrl?: string; description?: string }> => {
  try {
    const res = await apiRequest<{
      query: {
        pages: Record<
          string,
          {
            thumbnail?: { source: string };
            extract?: string;
          }
        >;
      };
    }>({
      url: 'https://en.wikipedia.org/w/api.php',
      method: 'GET',
      params: {
        action: 'query',
        format: 'json',
        origin: '*',
        titles: fishName,
        prop: 'pageimages|extracts', //  include both images and extracts
        piprop: 'thumbnail|name',
        pithumbsize: '500',
        pilicense: 'any',
        exintro: 'true', // ← only the intro section :contentReference[oaicite:0]{index=0}
        explaintext: 'true', // ← strip out any HTML :contentReference[oaicite:1]{index=1}
        redirects: '1', // ← follow redirects if needed
      },
    });

    // grab the single page returned
    const page = res.query.pages[Object.keys(res.query.pages)[0]];
    return { imgUrl: page.thumbnail?.source, description: page.extract };
  } catch (e) {
    console.error(e);
    toast.error('Failed to fetch fish Wiki information e: ' + e);
    return { imgUrl: undefined, description: undefined };
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
    console.error(err);
    toast.error('Failed to fetch country :( E: ' + err);
    const location = {
      country: 'Open sea',
      city: '',
    };
    callBack(location);
    return location;
  }
};
