
import React from "react";
import { Bed, Bath, Move, CircleDollarSign, MapPin, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyDetailsProps {
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  type: string;
  yearBuilt: number;
  lotSize: string;
  description: string;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  price,
  beds,
  baths,
  sqft,
  type,
  yearBuilt,
  lotSize,
  description,
}) => {
  return (
    <div className="my-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <div className="flex items-center">
            <CircleDollarSign className="h-6 w-6 text-green-600 mr-2" />
            <span className="text-3xl font-bold">${price.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center">
              <Bed className="h-5 w-5 text-gray-500 mr-2" />
              <span>{beds} beds</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-5 w-5 text-gray-500 mr-2" />
              <span>{baths} baths</span>
            </div>
            <div className="flex items-center">
              <Move className="h-5 w-5 text-gray-500 mr-2" />
              <span>{sqft.toLocaleString()} sqft</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 md:mt-0 flex gap-3">
          <Button className="bg-primary">Contact Agent</Button>
          <Button variant="outline">Schedule Tour</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Property Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">Property Type</p>
              <p className="font-medium">{type}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Year Built</p>
              <p className="font-medium">{yearBuilt}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Lot Size</p>
              <p className="font-medium">{lotSize}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">MLS #</p>
              <p className="font-medium">ML81938383</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Location</h3>
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
            <div>
              <p className="font-medium">Excellent Location</p>
              <p className="text-gray-600 text-sm">
                Close to schools, parks, and shopping centers
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Description</h3>
        <p className="text-gray-700 whitespace-pre-line">{description}</p>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-8">
        <h3 className="text-lg font-semibold mb-3">Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <div className="bg-blue-100 p-1.5 rounded-full mr-3">
              <Home className="h-4 w-4 text-blue-600" />
            </div>
            <span>Air Conditioning</span>
          </div>
          <div className="flex items-center">
            <div className="bg-blue-100 p-1.5 rounded-full mr-3">
              <Home className="h-4 w-4 text-blue-600" />
            </div>
            <span>Fireplace</span>
          </div>
          <div className="flex items-center">
            <div className="bg-blue-100 p-1.5 rounded-full mr-3">
              <Home className="h-4 w-4 text-blue-600" />
            </div>
            <span>Garage</span>
          </div>
          <div className="flex items-center">
            <div className="bg-blue-100 p-1.5 rounded-full mr-3">
              <Home className="h-4 w-4 text-blue-600" />
            </div>
            <span>Hardwood Floors</span>
          </div>
          <div className="flex items-center">
            <div className="bg-blue-100 p-1.5 rounded-full mr-3">
              <Home className="h-4 w-4 text-blue-600" />
            </div>
            <span>Updated Kitchen</span>
          </div>
          <div className="flex items-center">
            <div className="bg-blue-100 p-1.5 rounded-full mr-3">
              <Home className="h-4 w-4 text-blue-600" />
            </div>
            <span>Fenced Yard</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
