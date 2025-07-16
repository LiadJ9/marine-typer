import { useMemo } from 'react';
import { TileLayer, useMapEvent } from 'react-leaflet';
import { useFishStore, useSettingsStore } from '../../stores';
import { MAP_STYLES } from '../../consts';
import { InfoOverlay } from '../InfoOverlay';
import { getFishMarkers } from '../../utils';
import { LocationBtn } from './LocationBtn';
import { MapController } from './MapController';
import { FishMarker } from './FishMarker';

export const MapContent = () => {
  const mapStyle = useSettingsStore((s) => s.mapStyle);
  const fishingCoords = useFishStore((s) => s.fishingCoords);
  const setLocation = useFishStore((s) => s.setFishingLocation);
  const setCoords = useFishStore((s) => s.setfishingCoords);
  const fishes = useFishStore((s) => s.fishes);
  useMapEvent('click', (e) => {
    setLocation(null);
    setCoords(e.latlng);
  });

  const fishMarkers = useMemo(() => getFishMarkers(fishes), [fishes]);
  return (
    <>
      <MapController position='topright'>
        <InfoOverlay />
      </MapController>
      <TileLayer
        url={MAP_STYLES[mapStyle].url}
        attribution={MAP_STYLES[mapStyle].attribution}
      />
      {fishingCoords && (
        <FishMarker
          marker='boat'
          position={[fishingCoords.lat, fishingCoords.lng]}
        />
      )}
      {fishMarkers.map((fish) => (
        <FishMarker
          key={fish.aphiaID}
          marker='fish'
          position={fish.position}
          fishDetails={fish}
        />
      ))}
      <MapController position='bottomright'>
        <LocationBtn />
      </MapController>
    </>
  );
};
