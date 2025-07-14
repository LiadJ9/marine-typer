import { create } from 'zustand';

interface SettingsStore {
  mapStyle: 'satellite' | 'carto' | 'streets';
  setMapStyle: (style: 'satellite' | 'carto' | 'streets') => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  mapStyle:
    (localStorage.getItem('mapStyle') as 'satellite' | 'carto' | 'streets') ||
    'carto',
  setMapStyle: (style: 'satellite' | 'carto' | 'streets') =>
    set({ mapStyle: style }),
}));
