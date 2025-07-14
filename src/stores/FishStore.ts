import type { LatLng } from 'leaflet';
import { create } from 'zustand';
import type { Location } from '../types';

//TODO: Implement FishingOptions (buying from store)
//TODO: Implement PreviousLocations.
//TODO: Move these to a type folder.
interface Fish {
  id: string;
  type: string;
  name: string;
  size: number;
}

interface FishTypeStats {
  count: number;
  biggest: Fish;
  smallest: Fish;
}

interface PreviousLocation extends LatLng {
  fishCaught: Fish[];
}

interface FishStore {
  fishes: Record<string, Fish>;
  stats: Record<string, FishTypeStats>;
  fishingCoords: LatLng | null;
  fishingLocation: Location | null;
  fishingOptions: Record<string, boolean>;
  setFishingOptions: (options: Record<string, boolean>) => void;
  setFishingLocation: (location: Location | null) => void;
  previousLocations: PreviousLocation[];
  pushPreviousLocation: (location: PreviousLocation) => void;
  setfishingCoords: (location: LatLng) => void;

  addFish: (fish: Fish) => void;
  removeFish: (id: string) => void;
}

export const useFishStore = create<FishStore>((set, get) => ({
  fishes: {},
  stats: {},
  fishingOptions: {},
  fishingCoords: null,
  fishingLocation: null,
  previousLocations: [],

  setFishingOptions: (options) => {
    const fishingOptions = get().fishingOptions;
    set({ fishingOptions: { ...fishingOptions, ...options } });
  },

  setFishingLocation: (location) => set({ fishingLocation: location }),
  setfishingCoords: (coords) => set({ fishingCoords: coords }),
  pushPreviousLocation: (location) => {
    const prevLocations = get().previousLocations;
    //This is very unlikely unless you're botting. (😠)
    if (prevLocations.includes(location)) return;

    if (prevLocations.length > 40) prevLocations.shift();

    set((state) => ({
      previousLocations: [...state.previousLocations, location],
    }));
  },

  addFish: ({ type, name, size }) => {
    const id = crypto.randomUUID();
    const newFish: Fish = { id, type, name, size };

    set((state) => {
      const fishes = { ...state.fishes, [id]: newFish };

      const prev = state.stats[type];
      let stats: FishTypeStats;
      if (!prev) {
        stats = { count: 1, biggest: newFish, smallest: newFish };
      } else {
        stats = {
          count: prev.count + 1,
          biggest: size > prev.biggest.size ? newFish : prev.biggest,
          smallest: size < prev.smallest.size ? newFish : prev.smallest,
        };
      }

      return {
        fishes,
        stats: { ...state.stats, [type]: stats },
      };
    });
  },

  removeFish: (id) => {
    set((state) => {
      const fish = state.fishes[id];
      if (!fish) return {};

      const fishes = state.fishes;

      const remainingOfType = Object.values(fishes).filter(
        (f) => f.type === fish.type
      );
      const stats = { ...state.stats };

      if (remainingOfType.length === 0) {
        delete stats[fish.type];
      } else {
        const biggest = remainingOfType.reduce((a, b) =>
          b.size > a.size ? b : a
        );
        const smallest = remainingOfType.reduce((a, b) =>
          b.size < a.size ? b : a
        );
        stats[fish.type] = {
          count: remainingOfType.length,
          biggest,
          smallest,
        };
      }

      return { fishes, stats };
    });
  },
}));
