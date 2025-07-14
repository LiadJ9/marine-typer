import { useMemo } from 'react';
import { MAP_STYLES } from '../consts';
import { useSettingsStore } from '../stores';
import { Dropdown } from './Dropdown';

export const SideMenu = () => {
  const setMapStyle = useSettingsStore((s) => s.setMapStyle);

  const mapStyleButtons = useMemo(
    () =>
      Object.keys(MAP_STYLES).map((key) => ({
        label: key,
        onClick: () => setMapStyle(key as 'satellite' | 'carto' | 'streets'),
      })),
    [setMapStyle]
  );

  return (
    <div className='w-60 h-full bg-slate-800 p-2'>
      <div className='flex flex-col gap-2'>
        <div className='flex text-center items-center justify-center font-bold'>
          Fish quest!
        </div>
        <Dropdown title='Map Style' buttons={mapStyleButtons} />
      </div>
    </div>
  );
};
