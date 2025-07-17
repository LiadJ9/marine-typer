import { type FC } from 'react';
import { MapContainer } from 'react-leaflet/MapContainer';
import { STARTING_LOCATIONS } from '../../consts';
import { pickRandom } from '../../utils';
import { MapContent } from './MapContent';
import 'leaflet/dist/leaflet.css';

export const GameMap: FC = () => {
  const mapCenter = pickRandom(STARTING_LOCATIONS, 1)[0];
  console.log(mapCenter);
  return (
    <>
      <MapContainer
        className='w-full h-full relative z-10'
        center={mapCenter}
        zoom={5}
        scrollWheelZoom={true}
      >
        <MapContent />
      </MapContainer>
    </>
  );
};
