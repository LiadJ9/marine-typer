import { useMapEvent } from 'react-leaflet';

export const LocationBtn = () => {
  const map = useMapEvent('locationfound', (e) => {
    map.flyTo(e.latlng, map.getZoom());
  });
  return (
    <button
      className='m-10 rounded-full p-4'
      onClick={(e) => {
        e.stopPropagation();
        map.locate({
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 10000,
          watch: false,
        });
      }}
    >
      📍
    </button>
  );
};
