import { type FC } from 'react';
import { useFishStore } from '../../stores';
import { FishCard } from '../FishCard';

interface FishCompendiumDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FishCompendiumDialog: FC<FishCompendiumDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const fishes = useFishStore((s) => s.fishes);
  if (!isOpen) return null;

  return (
    <div className='flex items-center justify-center w-2xl'>
      <div className='rounded-lg w-full overflow-auto p-6'>
        <header className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold'>Marine Compendium</h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-800'
          >
            X
          </button>
        </header>

        <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
          {Object.values(fishes).length === 0 && (
            <p>No fishes found! Go fish!</p>
          )}
          {Object.values(fishes).map((fish) => (
            <FishCard key={fish.aphiaID} fish={fish} />
          ))}
        </div>
      </div>
    </div>
  );
};
