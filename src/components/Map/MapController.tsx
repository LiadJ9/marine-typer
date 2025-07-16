import { DomEvent } from 'leaflet';
import { useEffect, useRef, type FC, type ReactNode } from 'react';

interface MapControllerProps {
  position?: 'bottomleft' | 'bottomright' | 'topleft' | 'topright';
  children: ReactNode;
  className?: string;
}

export const MapController: FC<MapControllerProps> = ({
  position,
  children,
  className = '',
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    DomEvent.disableClickPropagation(container);
    DomEvent.disableScrollPropagation(container);
  }, []);

  const positionClass = {
    bottomleft: 'leaflet-bottom leaflet-left',
    bottomright: 'leaflet-bottom leaflet-right',
    topleft: 'leaflet-top leaflet-left',
    topright: 'leaflet-top leaflet-right',
  }[position || 'topright'];

  return (
    <div className={positionClass}>
      <div
        ref={containerRef}
        className={`leaflet-control leaflet-bar ${className}`}
      >
        {children}
      </div>
    </div>
  );
};
