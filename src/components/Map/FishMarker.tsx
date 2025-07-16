import { type FC } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { icon, type LatLngExpression } from 'leaflet';
import lowResFish from '../../assets/fish_blue_marker_low_res.png';
import highResFish from '../../assets/fish_blue_marker.png';
import lowResBoat from '../../assets/fishing_boat_blue_low_res.png';
import highResBoat from '../../assets/fishing_boat_blue.png';
import type { FishMarkers } from '../../types';
import { FishCard, FishMarkerCard } from '../FishCard';

const boatMarker = icon({
  iconUrl: lowResBoat,
  iconRetinaUrl: highResBoat,
  iconSize: [50, 50],
  iconAnchor: [25, 50], // point of the icon corresponding to marker position
  popupAnchor: [0, -41], // point from which the popup should open relative to the iconAnchor :contentReference[oaicite:4]{index=4}
});

const fishMarker = icon({
  iconUrl: lowResFish,
  iconRetinaUrl: highResFish,
  iconSize: [50, 50],
  iconAnchor: [25, 50], // point of the icon corresponding to marker position
  popupAnchor: [0, -41], // point from which the popup should open relative to the iconAnchor
});

const markers = {
  boat: boatMarker,
  fish: fishMarker,
};

interface FishMarkerProps {
  position: LatLngExpression;
  marker?: 'boat' | 'fish';
  fishDetails?: FishMarkers;
}

export const FishMarker: FC<FishMarkerProps> = ({
  position,
  marker = 'boat',
  fishDetails,
}) => {
  return (
    <Marker icon={markers[marker]} position={position}>
      {fishDetails && (
        <Popup className='fish-popup'>
          <FishMarkerCard fish={fishDetails} />
        </Popup>
      )}
    </Marker>
  );
};
