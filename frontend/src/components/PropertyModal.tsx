
import React from "react";
import { X, Heart, ArrowLeft, ArrowRight, Bed, Bath, Move, ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Property } from "./PropertyCard";
import { Button } from "@/components/ui/button";
import PropertyDetails from "./PropertyDetails";

interface PropertyModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

const PropertyModal: React.FC<PropertyModalProps> = ({
  property,
  isOpen,
  onClose,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
}) => {
  const navigate = useNavigate();
  
  if (!isOpen) return null;

  // Images for the gallery - in a real app, you would have multiple images
  const images = [
    property.image,
    "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1560185008-a33f5c1a290e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  ];

  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center 
        transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      {/* Background overlay */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div 
        className="relative h-[90vh] w-[90vw] max-w-6xl bg-white rounded-lg shadow-xl 
          overflow-y-auto overflow-x-hidden z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          className="absolute top-4 right-4 z-20 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Back to map button */}
        <button 
          className="absolute top-4 left-4 z-20 bg-white/80 p-2 rounded-full hover:bg-white transition-colors flex items-center gap-1"
          onClick={onClose}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="text-sm">Map</span>
        </button>

        {/* Image gallery */}
        <div className="relative w-full h-72 md:h-96 bg-gray-200">
          <img 
            src={images[currentImageIndex]} 
            alt={property.address}
            className="w-full h-full object-cover"
          />
          
          {/* Image counter */}
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
            {currentImageIndex + 1} / {images.length}
          </div>
          
          {/* Navigation arrows */}
          <button 
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 
              bg-white/80 p-2 rounded-full hover:bg-white transition-colors
              ${currentImageIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handlePrevImage}
            disabled={currentImageIndex === 0}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <button 
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 
              bg-white/80 p-2 rounded-full hover:bg-white transition-colors
              ${currentImageIndex === images.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleNextImage}
            disabled={currentImageIndex === images.length - 1}
          >
            <ArrowRight className="h-5 w-5" />
          </button>
          
          {/* Save button */}
          <button 
            className="absolute top-4 right-16 z-20 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
          >
            <Heart className="h-5 w-5" />
          </button>
        </div>

        {/* Property content */}
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-1">{property.address}</h1>
            <p className="text-gray-600">{property.city}, {property.state} {property.zip}</p>
            
            <div className="flex items-center mt-4">
              <span className="text-2xl md:text-3xl font-bold">${property.price.toLocaleString()}</span>
              <div className="flex ml-6 text-gray-600">
                <div className="flex items-center mr-4">
                  <Bed className="h-5 w-5 mr-1" />
                  <span>{property.beds} beds</span>
                </div>
                <div className="flex items-center mr-4">
                  <Bath className="h-5 w-5 mr-1" />
                  <span>{property.baths} baths</span>
                </div>
                <div className="flex items-center">
                  <Move className="h-5 w-5 mr-1" />
                  <span>{property.sqft.toLocaleString()} sqft</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 mb-8">
            <Button className="bg-primary">Contact Agent</Button>
            <Button variant="outline">Schedule Tour</Button>
            <Link 
              to={`/property-details/${property.id}`} 
              className="ml-auto text-blue-600 hover:underline flex items-center"
            >
              View Full Details
            </Link>
          </div>
          
          {/* Property details */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Overview</h2>
            <p className="text-gray-700">
              This stunning property offers a perfect blend of modern design and comfort. 
              Featuring an open floor plan with abundant natural light, gourmet kitchen with high-end appliances, 
              and spacious bedrooms. The primary suite includes a walk-in closet and luxurious bathroom. 
              The backyard is perfect for entertaining with a covered patio area. 
              Located in a highly desirable neighborhood with excellent schools nearby.
            </p>
          </div>
          
          {/* Features */}
          <div className="border-t mt-6 pt-6">
            <h2 className="text-xl font-semibold mb-4">Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {property.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                  <span>{feature}</span>
                </div>
              ))}
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                <span>Hardwood Floors</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                <span>Updated Kitchen</span>
              </div>
            </div>
          </div>
          
          {/* Navigation between properties */}
          <div className="border-t mt-6 pt-6 flex justify-between">
            <Button 
              variant="outline" 
              onClick={onPrevious}
              disabled={!hasPrevious}
              className={!hasPrevious ? "opacity-50 cursor-not-allowed" : ""}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous Property
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onNext}
              disabled={!hasNext}
              className={!hasNext ? "opacity-50 cursor-not-allowed" : ""}
            >
              Next Property
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyModal;
