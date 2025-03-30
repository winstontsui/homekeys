import React from "react";
import { Link } from "react-router-dom";
import { Heart, Bed, Bath, Move, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface Property {
  id: number | string;
  type?: "Condo" | "Single Family Home";
  price: number;
  description: string;
  address: string;
  image: string;
  bedrooms: number;
  bathrooms: number;
  square_footage: number;
  lot_size?: number | null;
  house_age?: number;
  hazard_zones?: string[];
  open_house_info?: {
    date: string;
    time: string;
  };
  view?: string | null;
  financial?: {
    monthly_ground_rent?: number;
    lease_type?: string;
    monthly_hoa_fees?: number;
  };
  amenities?: string[];
  // For backward compatibility with existing code
  beds?: number;
  baths?: number;
  sqft?: number;
  features?: string[];
  city?: string;
  state?: string;
  zip?: string;
}

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  // Determine beds/bedrooms, baths/bathrooms, and sqft/square_footage for compatibility
  const beds = property.bedrooms || property.beds || 0;
  const baths = property.bathrooms || property.baths || 0;
  const sqft = property.square_footage || property.sqft || 0;

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
        {/* PRICE */}
        <div className="mb-2">
          <span className="text-xl font-bold">
            ${property.price?.toLocaleString()}
          </span>
        </div>

        {/* ADDRESS */}
        <p className="text-sm text-gray-700 mb-2">{property.address}</p>

        {/* LOCATION */}
        {property.city && property.state && property.zip && (
          <p className="text-xs text-gray-500 mb-3">
            {property.city}, {property.state} {property.zip}
          </p>
        )}

        {/* Bedrooms / Bathrooms / Square Footage */}
        <div className="flex items-center gap-3 text-sm text-gray-700 mb-4">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            <span>{beds} beds</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            <span>{baths} {property.bathrooms ? 'bathrooms' : 'baths'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Move className="h-4 w-4" />
            <span>{sqft?.toLocaleString()} sq ft</span>
          </div>
        </div>

        {/* EXTRA DETAILS */}
        {property.lot_size && (
          <p className="text-xs text-gray-500 mb-1">
            Lot Size: {property.lot_size.toLocaleString()} sq ft
          </p>
        )}
        {property.house_age && (
          <p className="text-xs text-gray-500 mb-1">
            House Age: {property.house_age} years
          </p>
        )}
        {property.financial?.monthly_hoa_fees ? (
          <p className="text-xs text-gray-500 mb-1">
            HOA: ${property.financial.monthly_hoa_fees?.toLocaleString()}/mo
          </p>
        ) : null}
        {property.view && (
          <p className="text-xs text-gray-500 mb-1">View: {property.view}</p>
        )}
        {property.hazard_zones && property.hazard_zones.length > 0 && (
          <p className="text-xs text-red-600 mb-1">
            Hazard Zones: {property.hazard_zones?.join(", ")}
          </p>
        )}
        {property.open_house_info && (
          <p className="text-xs text-green-600 mb-3">
            Open House: {property.open_house_info.date}{" "}
            {property.open_house_info.time}
          </p>
        )}

        {/* FEATURES: Garage, Pool, etc. */}
        <div className="flex items-center gap-2 flex-wrap mt-3">
          {property.amenities && property.amenities.length > 0 ? (
            property.amenities.map((amenity, index) => (
              <Badge key={index} className="flex items-center text-xs">
                <span>{amenity}</span>
              </Badge>
            ))
          ) : property.features && property.features.length > 0 ? (
            property.features.map((feature, index) => (
              <Badge key={index} className="flex items-center text-xs">
                <span>{feature}</span>
              </Badge>
            ))
          ) : null}
        </div>

        {/* CTA BUTTONS */}
        <div className="flex mt-4 gap-2">
          <Button
            variant="outline"
            className="text-xs py-1 px-3 h-8 bg-gray-50"
            size="sm"
          >
            <span className="mr-1">🏠</span> Request Valuation
          </Button>
          <Button
            variant="outline"
            className="text-xs py-1 px-3 h-8 bg-blue-50 text-blue-600"
            size="sm"
          >
            <span className="mr-1">🤖</span> Ask AI
          </Button>
          <Link
            to={`/map/${property.id}`}
            className="text-xs py-1 px-3 h-8 flex items-center bg-gray-50 rounded-md border"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
