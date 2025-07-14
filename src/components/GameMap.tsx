import { type FC } from 'react';
import { MapContainer } from 'react-leaflet/MapContainer';
import { MapContent } from './MapContent';
import { InfoOverlay } from './InfoOverlay';
import 'leaflet/dist/leaflet.css';

export const GameMap: FC = () => {
  return (
    <>
      <InfoOverlay />
      <MapContainer
        className='w-full h-full relative z-10'
        center={[51.505, -0.09]}
        zoom={15}
        scrollWheelZoom={true}
      >
        <MapContent />
      </MapContainer>
    </>
  );
};
