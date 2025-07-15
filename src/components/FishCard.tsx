import React from 'react';
import type { FishStats } from '../types';

interface FishCardProps {
  fish: FishStats;
}

export const FishCard: React.FC<FishCardProps> = ({ fish }) => {
  return (
    <div className='border rounded-lg p-4 shadow-sm flex flex-col'>
      {fish.imgUrl && (
        <img
          src={fish.imgUrl}
          alt={fish.scientificName}
          className='w-full h-40 object-cover rounded-md mb-4'
        />
      )}
      <h3 className='text-xl font-semibold mb-1'>
        {fish.name ?? fish.scientificName}
      </h3>
      <p className='text-sm text-gray-600 mb-2'>
        <strong>Aphia ID:</strong> {fish.aphiaID}
      </p>
      <div className='text-sm mb-2'>
        <p>
          <strong>Observations:</strong> {fish.count}
        </p>
        <p>
          <strong>Biggest Ever:</strong> {fish.biggestEver} MU
        </p>
        <p>
          <strong>Smallest Ever:</strong> {fish.smallestEver} MU
        </p>
      </div>
      <p className='text-xs text-gray-500 mt-auto'>
        Locations recorded: {fish.locations.length}
      </p>
    </div>
  );
};
