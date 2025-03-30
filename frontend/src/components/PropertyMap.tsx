import React, { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Property } from "./PropertyCard";

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
  const [hoveredPin, setHoveredPin] = useState<string | number | null>(null);

  // Simulate map positioning - in a real app, use a mapping library like Mapbox or Google Maps
  useEffect(() => {
    // This would be where you initialize your map
    console.log("Map initialized");
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Map placeholder - in a real implementation, this would be the actual map */}
      <div 
        ref={mapRef} 
        className="absolute inset-0 bg-[#e9edf1]"
        style={{
          backgroundImage: "url('/lovable-uploads/f38a6eef-5a54-4731-aeb6-0022f7c0210e.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.9
        }}
      >
        {/* Property pins */}
        {properties.map((property) => {
          // Get beds/bedrooms, baths/bathrooms, sqft/square_footage for compatibility
          const beds = property.bedrooms || property.beds || 0;
          const baths = property.bathrooms || property.baths || 0;
          const sqft = property.square_footage || property.sqft || 0;
          
          return (
            <div
              key={property.id}
              className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
                property.id === selectedPropertyId ? "z-30" : hoveredPin === property.id ? "z-20" : "z-10"
              }`}
              style={{
                // Random positioning for demo 
                left: `${30 + Math.random() * 40}%`,
                top: `${30 + Math.random() * 40}%`
              }}
              onMouseEnter={() => setHoveredPin(property.id)}
              onMouseLeave={() => setHoveredPin(null)}
              onClick={() => onSelectProperty && onSelectProperty(property.id)}
            >
              <div className={`relative group ${property.id === selectedPropertyId ? "scale-125" : ""}`}>
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full shadow-lg border border-white
                  ${property.id === selectedPropertyId 
                    ? "bg-primary text-white" 
                    : hoveredPin === property.id 
                      ? "bg-primary/90 text-white" 
                      : "bg-white text-primary"
                  } 
                `}>
                  <span className="font-bold text-xs">${Math.round(property.price / 1000)}k</span>
                </div>
                
                {/* Tooltip that shows on hover */}
                <div className={`
                  absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
                  w-48 bg-white shadow-xl rounded-lg overflow-hidden opacity-0 
                  pointer-events-none transition-opacity duration-200
                  ${(hoveredPin === property.id || property.id === selectedPropertyId) ? "opacity-100" : ""}
                `}>
                  <img 
                    src={property.image} 
                    alt={property.address} 
                    className="w-full h-24 object-cover"
                  />
                  <div className="p-2">
                    <p className="font-bold text-sm">${property.price.toLocaleString()}</p>
                    <p className="text-xs text-gray-600 truncate">{property.address}</p>
                    <div className="flex text-xs text-gray-500 mt-1">
                      <span className="mr-2">{beds} bd</span>
                      <span className="mr-2">{baths} ba</span>
                      <span>{sqft} sqft</span>
                    </div>
                    
                    {/* Show hazard zones if available */}
                    {property.hazard_zones && property.hazard_zones.length > 0 && (
                      <p className="text-xs text-red-600 mt-1">
                        Hazard: {property.hazard_zones.join(", ")}
                      </p>
                    )}
                    
                    {/* Show open house info if available */}
                    {property.open_house_info && (
                      <p className="text-xs text-green-600 mt-1">
                        Open: {property.open_house_info.date.split('-')[2]}/{property.open_house_info.date.split('-')[1]} {property.open_house_info.time}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

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
