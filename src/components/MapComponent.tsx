import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, CircleMarker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'motion/react';

// Stabilizing Leaflet Icons with CDN assets to avoid local build issues
const icon = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetina = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const iconShadow = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    iconRetinaUrl: iconRetina,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
  locationName: string;
  origin?: string;
  destination?: string;
}

// Global transit nodes coordinates for mapping
const HUB_COORDINATES: Record<string, [number, number]> = {
  'Dubai': [25.2048, 55.2708],
  'Singapore': [1.3521, 103.8198],
  'New York': [40.7128, -74.0060],
  'London': [51.5074, -0.1278],
  'Shanghai': [31.2304, 121.4737],
  'Rotterdam': [51.9225, 4.4792],
  'Lagos': [6.5244, 3.3792],
  'Sydney': [-33.8688, 151.2093],
  'Mumbai': [19.0760, 72.8777],
  'San Francisco': [37.7749, -122.4194],
  'Paris': [48.8566, 2.3522],
  'Tokyo': [35.6762, 139.6503],
  'Transit Hub 04': [48.8566, 2.3522],
};

const findCoordinates = (location: string): [number, number] => {
  const normalized = location.toLowerCase();
  const hub = Object.keys(HUB_COORDINATES).find(key => 
    normalized.includes(key.toLowerCase())
  );
  if (hub) return HUB_COORDINATES[hub];
  
  let hash = 0;
  for (let i = 0; i < location.length; i++) {
    hash = location.charCodeAt(i) + ((hash << 5) - hash);
  }
  const lat = ((Math.abs(hash) % 120) - 40); // Between -40 and 80
  const lng = ((Math.abs(hash * 7) % 360) - 180); // Between -180 and 180
  return [lat, lng];
};

function RecenterMap({ coords, allCoords }: { coords: [number, number]; allCoords?: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (allCoords && allCoords.length > 1) {
      const bounds = L.latLngBounds(allCoords);
      map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5 });
    } else {
      map.flyTo(coords, 6, { duration: 1.5 });
    }
  }, [coords, allCoords, map]);
  return null;
}

export const MapComponent: React.FC<MapComponentProps> = ({ locationName, origin, destination }) => {
  const currentCoords = findCoordinates(locationName);
  const originCoords = origin ? findCoordinates(origin) : null;
  const destCoords = destination ? findCoordinates(destination) : null;

  const allCoords: [number, number][] = [currentCoords];
  if (originCoords) allCoords.push(originCoords);
  if (destCoords) allCoords.push(destCoords);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden relative border border-white/10 group shadow-inner">
      <MapContainer 
        center={currentCoords} 
        zoom={4} 
        scrollWheelZoom={false}
        className="w-full h-full z-10"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterMap coords={currentCoords} allCoords={allCoords} />
        
        {originCoords && destCoords && (
          <Polyline 
            positions={[originCoords, currentCoords, destCoords]} 
            pathOptions={{ 
              color: '#FF6B00', 
              weight: 2, 
              dashArray: '8, 12', 
              opacity: 0.5,
              lineCap: 'round'
            }} 
          />
        )}

        {originCoords && (
          <Marker position={originCoords} opacity={0.6}>
            <CircleMarker center={originCoords} radius={4} pathOptions={{ color: '#94a3b8', fillColor: '#94a3b8' }} />
          </Marker>
        )}

        {destCoords && (
          <Marker position={destCoords} opacity={0.6}>
            <CircleMarker center={destCoords} radius={4} pathOptions={{ color: '#94a3b8', fillColor: '#94a3b8' }} />
          </Marker>
        )}
        
        <CircleMarker 
          center={currentCoords}
          radius={8}
          pathOptions={{ 
            fillColor: '#FF6B00', 
            fillOpacity: 1, 
            color: 'white', 
            weight: 2,
            className: 'map-pulse shadow-glow' 
          }}
        />
      </MapContainer>

      <div className="absolute bottom-4 left-4 z-20 flex gap-2">
         <div className="bg-navy/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 shadow-xl">
            <div className="text-[8px] font-black text-primary uppercase tracking-widest leading-none mb-1">Live Node</div>
            <div className="text-[10px] font-bold text-white truncate max-w-[150px]">{locationName}</div>
         </div>
      </div>
    </div>
  );
};
