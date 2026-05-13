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
  history?: { location: string; status: string }[];
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
  'Savannah': [32.0809, -81.0912],
  'Sydney': [-33.8688, 151.2093],
  'Mumbai': [19.0760, 72.8777],
  'San Francisco': [37.7749, -122.4194],
  'Paris': [48.8566, 2.3522],
  'Tokyo': [35.6762, 139.6503],
  'Hong Kong': [22.3193, 114.1694],
  'Los Angeles': [34.0522, -118.2437],
  'Antwerp': [51.2194, 4.4025],
  'Hamburg': [53.5511, 9.9937],
  'Busan': [35.1796, 129.0756],
  'Transit Hub 04': [48.8566, 2.3522],
};

const findCoordinates = (location: string): [number, number] => {
  const normalized = location.toLowerCase();
  const hub = Object.keys(HUB_COORDINATES).find(key => 
    normalized.includes(key.toLowerCase())
  );
  if (hub) return HUB_COORDINATES[hub];
  
  // Deterministic fallback based on name
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
      map.flyToBounds(bounds, { padding: [100, 100], duration: 1.5 });
    } else {
      map.flyTo(coords, 5, { duration: 1.5 });
    }
  }, [coords, allCoords, map]);
  return null;
}

export const MapComponent: React.FC<MapComponentProps> = ({ locationName, origin, destination, history = [] }) => {
  const currentCoords = findCoordinates(locationName);
  const originCoords = origin ? findCoordinates(origin) : null;
  const destCoords = destination ? findCoordinates(destination) : null;
  const historyCoords = history.map(h => findCoordinates(h.location));

  const allCoords: [number, number][] = [currentCoords];
  if (originCoords) allCoords.push(originCoords);
  if (destCoords) allCoords.push(destCoords);
  historyCoords.forEach(c => allCoords.push(c));

  // Build the route chronologically: Origin -> History Nodes (oldest to newest) -> Current Location -> Destination
  const routePoints: [number, number][] = [];
  if (originCoords) routePoints.push(originCoords);
  
  // Reversing history if it's newest-first in the UI, but for map we want oldest-first path
  const chronologicalHistory = [...historyCoords].reverse();
  chronologicalHistory.forEach(c => routePoints.push(c));
  
  routePoints.push(currentCoords);
  if (destCoords) routePoints.push(destCoords);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden relative border border-white/10 group shadow-inner">
      <MapContainer 
        center={currentCoords} 
        zoom={3} 
        scrollWheelZoom={false}
        className="w-full h-full z-10"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        <RecenterMap coords={currentCoords} allCoords={allCoords} />
        
        {routePoints.length > 1 && (
          <Polyline 
            positions={routePoints} 
            pathOptions={{ 
              color: '#FF6B00', 
              weight: 3, 
              dashArray: '10, 15', 
              opacity: 0.8,
              lineCap: 'round',
              lineJoin: 'round'
            }} 
          />
        )}

        {originCoords && (
          <CircleMarker center={originCoords} radius={6} pathOptions={{ color: 'white', fillColor: '#334155', fillOpacity: 1, weight: 2 }} />
        )}

        {destCoords && (
          <CircleMarker center={destCoords} radius={6} pathOptions={{ color: 'white', fillColor: '#334155', fillOpacity: 1, weight: 2 }} />
        )}

        {historyCoords.map((coord, idx) => (
          <CircleMarker 
            key={`history-${idx}`}
            center={coord} 
            radius={4} 
            pathOptions={{ color: 'white', fillColor: '#FF6B00', fillOpacity: 0.6, weight: 1 }} 
          />
        ))}
        
        <CircleMarker 
          center={currentCoords}
          radius={10}
          pathOptions={{ 
            fillColor: '#FF6B00', 
            fillOpacity: 1, 
            color: 'white', 
            weight: 3,
            className: 'map-pulse shadow-glow' 
          }}
        />
      </MapContainer>

      <div className="absolute bottom-4 left-4 z-20 flex gap-2">
         <div className="bg-navy/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-xl">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <div className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">Active Transmission</div>
            </div>
            <div className="text-xs font-bold text-white truncate max-w-[200px]">{locationName}</div>
         </div>
      </div>
    </div>
  );
};
