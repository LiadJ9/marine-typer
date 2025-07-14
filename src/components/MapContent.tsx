import { Marker, TileLayer, useMapEvents } from 'react-leaflet';
import { MAP_STYLES } from '../consts';
import { useFishStore, useSettingsStore } from '../stores';

export const MapContent = () => {
  const mapStyle = useSettingsStore((s) => s.mapStyle);
  const fishingCoords = useFishStore((s) => s.fishingCoords);
  const setLocation = useFishStore((s) => s.setFishingLocation);
  const setCoords = useFishStore((s) => s.setfishingCoords);

  const map = useMapEvents({
    click(e) {
      setLocation(null);
      setCoords(e.latlng);
    },
    locationfound(e) {
      //Unused right now, can use with map.locate()
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return (
    <>
      <TileLayer
        url={MAP_STYLES[mapStyle].url}
        attribution={MAP_STYLES[mapStyle].attribution}
      />
      {fishingCoords && (
        <Marker position={[fishingCoords.lat, fishingCoords.lng]} />
      )}
    </>
  );
};
