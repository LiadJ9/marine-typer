import type { LatLng } from 'leaflet';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Fish, FishStats, Location } from '../types';

//TODO: Implement FishingOptions (buying from store)

interface FishStore {
  fishes: Record<number, FishStats>;
  caughtFish: Fish | null;
  fishingCoords: LatLng | null;
  fishingLocation: Location | null;
  fishingOptions: Record<string, boolean>;
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
