import toast from 'react-hot-toast';
import type { LatLng } from 'leaflet';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Fish, FishStats, Location } from '../types';
import { fetchFishDetails, fetchFishes } from '../api';
import {
  formatRequestFishData,
  getRandomTrashEmoji,
  pickRandom,
} from '../utils';

//TODO: Implement FishingOptions (buying from store)

interface FishStore {
  fishes: Record<number, FishStats>;
  isCatchingFish: boolean;
  caughtFish: Fish | null;
  fishingCoords: LatLng | null;
  fishingLocation: Location | null;
  fishingOptions: Record<string, boolean>;
  onFish: () => Promise<void>;
  setCaughtFish: (fish: Fish | null) => void;
  setFishingOptions: (options: Record<string, boolean>) => void;
  setFishingLocation: (location: Location | null) => void;
  setfishingCoords: (location: LatLng) => void;
  addFish: (fish: Fish) => void;
  removeFish: (aphiaID: number) => void;
}

export const useFishStore = create<FishStore>()(
  persist(
    (set, get) => ({
      fishes: {},
      fishingOptions: {},
      isCatchingFish: false,
      fishingCoords: null,
      fishingLocation: null,
      caughtFish: null,

      setFishingOptions: (options) => {
        const fishingOptions = get().fishingOptions;
        set({ fishingOptions: { ...fishingOptions, ...options } });
      },
      setFishingLocation: (location) => set({ fishingLocation: location }),
      setfishingCoords: (coords) => set({ fishingCoords: coords }),
      setCaughtFish: (fish) => set({ caughtFish: fish }),

      addFish: (fish) => {
        const { aphiaID, name, lat, lon, size, scientificName, imgUrl } = fish;

        set((state) => {
          const prev = state.fishes[aphiaID];
          const updated: FishStats = prev
            ? {
                ...prev,
                count: prev.count + 1,
                biggestEver: Math.max(prev.biggestEver, size),
                smallestEver: Math.min(prev.smallestEver, size),
                locations: [...prev.locations, [lat, lon]],
              }
            : {
                aphiaID,
                name,
                scientificName,
                imgUrl,
                count: 1,
                biggestEver: size,
                smallestEver: size,
                locations: [[lat, lon]],
              };

          return { fishes: { ...state.fishes, [aphiaID]: updated } };
        });
      },
      onFish: async () => {
        try {
          set({ isCatchingFish: true });
          const { fishingCoords } = get();
          if (!fishingCoords) return;
          toast('Casting line... 🧵');
          const fishRes = await fetchFishes({
            lon: fishingCoords.lng,
            lat: fishingCoords.lat,
          });
          if (!fishRes || fishRes.results.length === 0) {
            toast.error(`No fishes found... ${getRandomTrashEmoji()}`, {
              style: {
                border: '1px solid bg-slate-900',
              },
            });
            return;
          }
          toast('Something is biting..! 🐟');
          const fishes = formatRequestFishData(fishRes.results);
          const fish = pickRandom(fishes);
          const firstFish = fish[0];
          const fishDetails = await fetchFishDetails(
            firstFish.aphiaID,
            firstFish.scientificName
          );

          const fishData = {
            ...firstFish,
            ...fishDetails,
          };
          set({ caughtFish: fishData });
        } catch (e) {
          console.error(e);
        } finally {
          set({ isCatchingFish: false });
        }
      },
      //Currently unused
      removeFish: (aphiaID) => {
        set((state) => {
          const prev = state.fishes[aphiaID];
          if (!prev) return {};

          if (prev.count <= 1) {
            const { [aphiaID]: _, ...rest } = state.fishes;
            return { fishes: rest };
          }

          return {
            stats: {
              ...state.fishes,
              [aphiaID]: {
                ...prev,
                locations: prev.locations.slice(1),
                count: prev.count - 1,
              },
            },
          };
        });
      },
    }),
    {
      name: 'fish-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        fishes: state.fishes,
        fishingOptions: state.fishingOptions,
      }),
    }
  )
);
