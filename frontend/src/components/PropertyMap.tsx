import React, { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Property } from "./PropertyCard";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface PropertyMapProps {
  properties: Property[];
  selectedPropertyId?: string | number;
  onSelectProperty?: (id: string | number) => void;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ 
  properties, 
  selectedPropertyId, 
  onSelectProperty 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{[key: string]: mapboxgl.Marker}>({});
  const [hoveredPin, setHoveredPin] = useState<string | number | null>(null);

  // Initialize Mapbox with your API key
  mapboxgl.accessToken = 'pk.eyJ1Ijoibnkxd2luc3RvbiIsImEiOiJjbTh3N3Z4cGQwNHc3Mm1wc253aDhjN2ZnIn0.3GpalNuRfH6-JnqTdjYNcg';

  useEffect(() => {
    if (!mapRef.current) return;
    
    // Initialize map
    mapInstance.current = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-122.171, 37.444], // Stanford area
      zoom: 13
    });

    // Add navigation controls
    mapInstance.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Cleanup on unmount
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, []);

  // Add markers for properties
  useEffect(() => {
    if (!mapInstance.current || !properties.length) return;

    // Wait for map to be loaded
    mapInstance.current.on('load', () => {
      // Clear existing markers
      Object.values(markersRef.current).forEach(marker => marker.remove());
      markersRef.current = {};

      // Add markers for each property
      properties.forEach(property => {
        // Create a fake coordinate based on property index (in a real app, you'd use actual coordinates)
        // This creates a scatter of properties around Stanford for visualization
        const randomLat = 37.444 + (Math.random() - 0.5) * 0.02;
        const randomLng = -122.171 + (Math.random() - 0.5) * 0.02;

        // Create a custom marker element
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.innerHTML = `
          <div class="${selectedPropertyId === property.id ? 'bg-primary text-white' : 'bg-white text-primary'} 
            flex items-center justify-center rounded-full shadow-lg border border-white
            w-8 h-8 font-bold text-xs cursor-pointer">
            $${Math.round(property.price / 1000)}k
          </div>
        `;

        // Hover and click events for the marker
        el.addEventListener('mouseenter', () => setHoveredPin(property.id));
        el.addEventListener('mouseleave', () => setHoveredPin(null));
        el.addEventListener('click', () => {
          if (onSelectProperty) onSelectProperty(property.id);
        });

        // Create and add the marker
        const marker = new mapboxgl.Marker(el)
          .setLngLat([randomLng, randomLat])
          .addTo(mapInstance.current!);

        // Store reference to marker for later removal
        markersRef.current[property.id.toString()] = marker;

        // If this is the selected property, fly to it
        if (selectedPropertyId === property.id) {
          mapInstance.current!.flyTo({
            center: [randomLng, randomLat],
            zoom: 15,
            essential: true
          });
        }
      });
    });
  }, [properties, selectedPropertyId, onSelectProperty]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Mapbox container */}
      <div 
        ref={mapRef} 
        className="absolute inset-0"
      />

      {/* Add custom styles for markers */}
      <style jsx global>{`
        .custom-marker {
          cursor: pointer;
          transition: transform 0.2s;
        }
        .custom-marker:hover {
          transform: scale(1.2);
          z-index: 100;
        }
      `}</style>

      {/* Map controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button className="bg-white p-2 rounded-full shadow-md">
          <MapPin className="h-5 w-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default PropertyMap;