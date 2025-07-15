import { useState, type FC } from 'react';
import type { DialogChildProps, Fish } from '../../types';
import { TyperRacerDialog } from './TyperRacerDialog';

interface FishCaughtDialog extends DialogChildProps {
  caughtFish: Fish | null;
}

export const FishCaughtDialog: FC<FishCaughtDialog> = ({
  setIsOpen,
  caughtFish,
}) => {
  const [isChallengeSuccess, setIsChallengeSuccess] = useState(false);

  if (!caughtFish) return null;
  if (!isChallengeSuccess)
    return <TyperRacerDialog onSuccess={() => setIsChallengeSuccess(true)} />;
  const {
    imgUrl,
    scientificName,
    name,
    size,
    lat,
    lon,
    description,
    properties: { isBig, isSmall },
  } = caughtFish;

  return (
    <div className='flex flex-col gap-2 p-4'>
      <h2 className='text-2xl font-bold'>Sea critter caught! 🎣</h2>
      <div className='flex justify-center'>
        {imgUrl && (
          <img
            src={imgUrl}
            alt={scientificName}
            className='w-auto max-h-44 rounded shadow'
          />
        )}
      </div>

      <p>
        <strong>Common Name:</strong> {name ?? '- Not found'}
      </p>
      <p>
        <strong>Scientific Name:</strong> {scientificName}
      </p>
      <strong>Description:</strong>
      {description && (
        <div className='border-white border-2 rounded-lg p-2 max-h-40 overflow-y-scroll'>
          {description}
        </div>
      )}
      <p>
        <strong>Size:</strong> {size} FU (Fish Units)
      </p>
      {isBig && <p className='font-bold text-red-600'>EXTRA LARGE! 🔺</p>}
      {isSmall && <p className='text-sky-700'>This one's TINY! 🔻</p>}
      <p>
        <strong>Location:</strong> {lat.toFixed(4)}, {lon.toFixed(4)}
      </p>

      <button onClick={() => setIsOpen(false)} className='mt-4'>
        Close
      </button>
    </div>
  );
};
