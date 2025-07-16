import React, { type FC } from 'react';
import type { FishMarkers, FishStats } from '../types';

interface FishCardProps {
  fish: FishStats;
}

export const FishCard: FC<FishCardProps> = ({ fish }) => {
  const {
    scientificName,
    name,
    imgUrl,
    count,
    biggestEver,
    smallestEver,
    aphiaID,
    locations,
  } = fish;
  return (
    <div className='border-2 border-retro-text rounded-lg p-4 shadow  bg-cream-hover flex flex-col'>
      {fish.imgUrl && (
        <img
          src={imgUrl}
          alt={scientificName}
          className='w-full h-32 object-cover border-retro-text border-4 rounded-md mb-3'
        />
      )}

      <h3 className='text-md text-retro-text font-semibold mb-1'>
        {name ?? scientificName}
      </h3>

      <div className='text-xs text-retro-text mb-3 space-y-1'>
        <p>
          <strong>Observations:</strong> {count}
        </p>
        <p>
          <strong>Biggest Ever:</strong> {biggestEver} MU
        </p>
        <p>
          <strong>Smallest Ever:</strong> {smallestEver} MU
        </p>
      </div>

      <p className='text-xs text-gray-500 mb-2 truncate'>
        <strong>Aphia ID:</strong> {aphiaID}
      </p>
      <p className='text-xs text-gray-400 mt-auto truncate'>
        Locations: {locations.length}
      </p>
    </div>
  );
};

interface FishMarkerCardProps {
  fish: FishMarkers;
}

export const FishMarkerCard: FC<FishMarkerCardProps> = ({ fish }) => {
  const { scientificName, name, imgUrl } = fish;
  return (
    <div className='w-40 flex flex-col items-center'>
      {imgUrl ? (
        <img
          src={imgUrl}
          alt={name ?? scientificName}
          className='w-full h-24 object-cover rounded-md mb-2'
        />
      ) : (
        <div className='w-full h-24 flex items-center justify-center text-gray-300'>
          No Image
        </div>
      )}
      <h4 className='text-sm font-medium text-center truncate'>
        {name ?? scientificName}
      </h4>
    </div>
  );
};
