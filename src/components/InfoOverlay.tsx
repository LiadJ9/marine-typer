import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useFishStore } from '../stores';
import { fetchCountry, fetchFishDetails, fetchFishes } from '../api';
import { pickRandom } from '../utils';

export const InfoOverlay = () => {
  const fishingCoords = useFishStore((s) => s.fishingCoords);
  const fishingLocation = useFishStore((s) => s.fishingLocation);
  const setFishingLocation = useFishStore((s) => s.setFishingLocation);

  const onFish = async () => {
    try {
      if (!fishingCoords) return;
      const fishRes = await fetchFishes({
        lon: fishingCoords.lng,
        lat: fishingCoords.lat,
      });
      if (!fishRes) {
        toast.error('No fishes found :(');
        return;
      }
      const fish = pickRandom(fishRes.results);
      const firstFish = fish[0];
      const fishDetails = await fetchFishDetails(
        firstFish.aphiaID,
        firstFish.scientificName
      );
      const fishData = {
        ...firstFish,
        ...fishDetails,
      };
      console.log(fishData);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (fishingCoords && !fishingLocation) {
      fetchCountry(fishingCoords.lat, fishingCoords.lng, setFishingLocation);
    }
  }, [fishingCoords, fishingLocation, setFishingLocation]);

  if (!fishingCoords) return null;
  return (
    <div className='absolute top-0 right-0 m-10 w-4/12 h-40 p-4 flex justify-between bg-slate-800 rounded-2xl z-50'>
      <div className='location-info'>
        <div className='font-bold text-xl'>Selected Location</div>
        <div className='flex flex-col gap-2'>
          {fishingLocation?.country && `Country: ${fishingLocation.country}`}
          {fishingLocation?.city && `City: ${fishingLocation.city}`}
        </div>
      </div>
      <div>
        <button onClick={() => onFish()} type='button' role='button'>
          Go fish!
        </button>
      </div>
    </div>
  );
};
