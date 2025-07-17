import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { MAP_STYLES } from '../consts';
import { GithubIcon } from '../assets';
import { useSettingsStore } from '../stores';
import { Dropdown } from './Dropdown';
import { Dialog } from './Dialogs/Dialog';
import { FishCompendiumDialog } from './Dialogs';

export const SideMenu = () => {
  const [isCompendiumOpen, setIsCompendiumOpen] = useState(false);
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
      <div className='flex flex-col h-full justify-between py-1'>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col text-center items-center justify-center font-bold text-2xl'>
            Marine Typer 🎣
          </div>
          <div className='flex flex-col gap-2'>
            <button
              className='w-full'
              onClick={() => setIsCompendiumOpen(true)}
            >
              Marine Compendium
            </button>
            <Dialog isOpen={isCompendiumOpen} setIsOpen={setIsCompendiumOpen}>
              {() => (
                <FishCompendiumDialog
                  isOpen={isCompendiumOpen}
                  onClose={() => setIsCompendiumOpen(false)}
                />
              )}
            </Dialog>
            <button className='w-full' onClick={() => toast('Coming soon!?')}>
              Shop
            </button>
            <div className='text-[0.75em] font-semibold text-gray-200'>
              Description: <br /> A Fishing/Typing Game for discovering new
              marine life AND improving your typing skills, featuring quotes
              from Herman Melville's Moby-Dick.
            </div>
          </div>
        </div>

        <div className='py-2 flex flex-col gap-2'>
          <Dropdown title='Map Style' buttons={mapStyleButtons} />
          <div className='flex items-end gap-2'>
            <button
              onClick={() =>
                window.open(
                  'https://github.com/LiadJ9/marine-typer',
                  '_blank',
                  'noopener,noreferrer'
                )
              }
              className='p-2 rounded-full'
            >
              <img src={GithubIcon} />
            </button>
            <span className='text-xs font-semibold'>Created by LiadJ9</span>
          </div>
        </div>
      </div>
    </div>
  );
};
