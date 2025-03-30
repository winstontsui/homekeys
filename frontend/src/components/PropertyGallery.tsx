
import React from "react";
import { Heart, Share2 } from "lucide-react";

interface PropertyGalleryProps {
  images: string[];
  address: string;
  city: string;
  state: string;
  zip: string;
}

const PropertyGallery: React.FC<PropertyGalleryProps> = ({ 
  images, 
  address, 
  city, 
  state, 
  zip 
}) => {
  const mainImage = images[0];
  const additionalImages = images.slice(1, 5);

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
        <div className="md:col-span-2 md:row-span-2">
          <img
            src={mainImage}
            alt={`Primary view of ${address}`}
            className="w-full h-full object-cover rounded-lg aspect-[4/3]"
          />
        </div>
        
        {additionalImages.map((img, idx) => (
          <div key={idx} className="hidden md:block">
            <img
              src={img}
              alt={`View ${idx + 1} of ${address}`}
              className="w-full h-full object-cover rounded-lg aspect-[4/3]"
            />
          </div>
        ))}
      </div>

      <div className="absolute top-4 right-4 flex space-x-2">
        <button className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition">
          <Share2 className="h-5 w-5 text-gray-700" />
        </button>
        <button className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition">
          <Heart className="h-5 w-5 text-gray-700" />
        </button>
      </div>
      
      <div className="mt-4">
        <h1 className="text-2xl font-bold">{address}</h1>
        <p className="text-gray-600">{`${city}, ${state} ${zip}`}</p>
      </div>
    </div>
  );
};

export default PropertyGallery;
