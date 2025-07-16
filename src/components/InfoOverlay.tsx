import { useEffect } from 'react';
import { useFishStore } from '../stores';
import { fetchCountry } from '../api';

export const InfoOverlay = () => {
  const fishingCoords = useFishStore((s) => s.fishingCoords);
  const fishingLocation = useFishStore((s) => s.fishingLocation);
  const setFishingLocation = useFishStore((s) => s.setFishingLocation);
  const onFish = useFishStore((s) => s.onFish);
  const isCatchingFish = useFishStore((s) => s.isCatchingFish);

  useEffect(() => {
    if (fishingCoords && !fishingLocation) {
      fetchCountry(fishingCoords.lat, fishingCoords.lng, setFishingLocation);
    }
  }, [fishingCoords, fishingLocation, setFishingLocation]);

  if (!fishingCoords) return null;

  return (
    <div className='w-md font-montserrat p-4 flex justify-between bg-slate-800 rounded-2xl'>
      <div className='location-info'>
        <div className='font-bold text-xl'>🗺️ Selected Location</div>
        <div className='flex flex-col gap-0.5'>
          <div>
            {fishingLocation?.country && `Country: ${fishingLocation.country}`}
          </div>
          <div>{fishingLocation?.city && `City: ${fishingLocation.city}`}</div>
        </div>
      </div>
      <div>
        <button
          disabled={isCatchingFish}
          onClick={() => onFish()}
          type='button'
          role='button'
        >
          Go fish!
        </button>
      </div>
    </div>
  );
};
