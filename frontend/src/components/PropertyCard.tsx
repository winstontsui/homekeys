
import React from "react";
import { Link } from "react-router-dom";
import { Heart, Bed, Bath, Move, Car } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Property {
  id: string;
  type: "Condo" | "Single Family Home";
  price: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  beds: number;
  baths: number;
  sqft: number;
  features: string[];
  image: string;
}

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <div className="rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
      <div className="relative">
        <img
          src={property.image}
          alt={property.address}
          className="w-full h-56 object-cover"
        />
        <div className="absolute top-3 left-3 bg-gray-900 text-white text-xs px-2 py-1 rounded">
          {property.type}
        </div>
        <button 
          className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow-md text-gray-500 hover:text-red-500"
          aria-label="Save property"
        >
          <Heart className="h-5 w-5" />
        </button>
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <span className="text-xl font-bold">${property.price.toLocaleString()}</span>
        </div>
        <p className="text-sm text-gray-700 mb-2">{property.address}</p>
        <p className="text-xs text-gray-500 mb-3">{`${property.city}, ${property.state} ${property.zip}`}</p>
        
        <div className="flex items-center gap-3 text-sm text-gray-700 mb-4">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            <span>{property.beds} beds</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            <span>{property.baths} baths</span>
          </div>
          <div className="flex items-center gap-1">
            <Move className="h-4 w-4" />
            <span>{property.sqft.toLocaleString()} sqft</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap mt-3">
          {property.features.includes("Garage") && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Car className="h-3 w-3" />
              <span>Garage</span>
            </div>
          )}
          {property.features.includes("Pool") && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span className="inline-block h-2 w-2 bg-blue-400 rounded-full"></span>
              <span>Pool</span>
            </div>
          )}
        </div>
        
        <div className="flex mt-4 gap-2">
          <Button variant="outline" className="text-xs py-1 px-3 h-8 bg-gray-50" size="sm">
            <span className="mr-1">🏠</span> Request Valuation
          </Button>
          <Button variant="outline" className="text-xs py-1 px-3 h-8 bg-blue-50 text-blue-600" size="sm">
            <span className="mr-1">🤖</span> Ask AI
          </Button>
          <Link to={`/property-details/${property.id}`} className="text-xs py-1 px-3 h-8 flex items-center bg-gray-50 rounded-md border">
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
