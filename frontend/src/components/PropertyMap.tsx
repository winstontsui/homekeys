import React, { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Property } from "./PropertyCard";

interface PropertyMapProps {
  properties: Property[];
  selectedPropertyId?: string | number;
  onSelectProperty?: (id: string | number) => void;
}

const PropertyMap: React.FC<PropertyMapProps> = ({
  properties,
  selectedPropertyId,
  onSelectProperty,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});

  mapboxgl.accessToken = 'pk.eyJ1Ijoibnkxd2luc3RvbiIsImEiOiJjbTh3N3Z4cGQwNHc3Mm1wc253aDhjN2ZnIn0.3GpalNuRfH6-JnqTdjYNcg';

  useEffect(() => {
    if (!mapRef.current) return;

    mapInstance.current = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-122.171, 37.444], // Stanford area
      zoom: 13,
    });

    mapInstance.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      mapInstance.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current || !properties.length) return;

    mapInstance.current.on('load', () => {
      Object.values(markersRef.current).forEach((marker) => marker.remove());
      markersRef.current = {};

      properties.forEach((property) => {
        const { latitude, longitude } = property as any;

        if (typeof latitude !== 'number' || typeof longitude !== 'number') return;

        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.innerHTML = `
          <div class="${selectedPropertyId === property.id ? 'bg-primary text-white' : 'bg-white text-primary'} 
            flex items-center justify-center rounded-full shadow-lg border border-white
            w-8 h-8 font-bold text-xs cursor-pointer">
            $${Math.round(property.price / 1000)}k
          </div>
        `;


        el.addEventListener('click', () => {
          onSelectProperty?.(property.id);
        });

        const marker = new mapboxgl.Marker(el).setLngLat([longitude, latitude]).addTo(mapInstance.current!);
        markersRef.current[property.id.toString()] = marker;

        // Fly to selected property
        if (selectedPropertyId === property.id) {
          mapInstance.current!.flyTo({
            center: [longitude, latitude],
            zoom: 15,
            essential: true,
          });
        }
      });
    });
  }, [properties, selectedPropertyId, onSelectProperty]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div ref={mapRef} className="absolute inset-0" />

      <style jsx global>{`
        .custom-marker {
          cursor: pointer;
        }
        .custom-marker:hover {
          transform: scale(1.2);
          z-index: 100;
        }
      `}</style>

      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button className="bg-white p-2 rounded-full shadow-md">
          <MapPin className="h-5 w-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default PropertyMap;
