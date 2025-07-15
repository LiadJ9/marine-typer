import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useFishStore } from '../stores';
import { fetchCountry, fetchFishDetails, fetchFishes } from '../api';
import {
  formatRequestFishData,
  getRandomTrashEmoji,
  pickRandom,
} from '../utils';

export const InfoOverlay = () => {
  const [isLoading, setIsLoading] = useState(false);
  const fishingCoords = useFishStore((s) => s.fishingCoords);
  const fishingLocation = useFishStore((s) => s.fishingLocation);
  const setFishingLocation = useFishStore((s) => s.setFishingLocation);
  const setCaughtFish = useFishStore((s) => s.setCaughtFish);

  const onFish = async () => {
    try {
      setIsLoading(true);
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
      setCaughtFish(fishData);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (fishingCoords && !fishingLocation) {
      fetchCountry(fishingCoords.lat, fishingCoords.lng, setFishingLocation);
    }
  }, [fishingCoords, fishingLocation, setFishingLocation]);

  if (!fishingCoords) return null;
  return (
    <div className='absolute top-0 right-0 m-10 w-4/12 p-4 flex justify-between bg-slate-800 rounded-2xl z-50'>
      <div className='location-info'>
        <div className='font-bold text-xl'>Selected Location</div>
        <div className='flex flex-col gap-0.5'>
          <div>
            {fishingLocation?.country && `Country: ${fishingLocation.country}`}
          </div>
          <div>{fishingLocation?.city && `City: ${fishingLocation.city}`}</div>
        </div>
      </div>
      <div>
        <button
          disabled={isLoading}
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
