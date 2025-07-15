import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SettingsStore {
  mapStyle: 'satellite' | 'carto' | 'streets';
  racesCompleted: number;
  averageWPM: number;
  setMapStyle: (style: 'satellite' | 'carto' | 'streets') => void;
  updateWPM: (newWPM: number) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      mapStyle: 'carto',
      averageWPM: 0,
      racesCompleted: 0,

      setMapStyle: (style) => set({ mapStyle: style }),

      updateWPM: (newWPM) => {
        const { averageWPM, racesCompleted } = get();
        const totalRaces = racesCompleted + 1;

        // Use a cumulative moving average formula for numerical stability
        const newAverage = averageWPM + (newWPM - averageWPM) / totalRaces;

        set({
          averageWPM: newAverage,
          racesCompleted: totalRaces,
        });
      },
    }),
    {
      name: 'fish-settings-storage',
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        mapStyle: state.mapStyle,
        averageWPM: state.averageWPM,
        racesCompleted: state.racesCompleted,
      }),
    }
  )
);
