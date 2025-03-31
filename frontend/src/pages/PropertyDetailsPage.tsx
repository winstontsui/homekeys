
import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import PropertyGallery from "@/components/PropertyGallery";
import PropertyDetails from "@/components/PropertyDetails";
import SimilarProperties from "@/components/SimilarProperties";
import propertiesData from "@/components/properties.json";
import { Property } from "@/components/PropertyCard";

const allProperties: Property[] = propertiesData.properties;


const PropertyDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  const property = allProperties.find((p) => p.id === Number(id));

  if (!property) {
    return <div className="p-10 text-center text-gray-500">Property not found.</div>;
  }
  
  // Property images - adding more for the gallery
  const propertyImages = [
    property.image,
    "https://images.unsplash.com/photo-1560184897-ae75f418493e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1560185008-a33f5c1a290e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
  ];
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
        <PropertyGallery 
          images={propertyImages}
          address={property.address}
          city={property.city}
          state={property.state}
          zip={property.zip}
        />
        
        <PropertyDetails 
          price={property.price}
          beds={property.bedrooms}
          baths={property.bathrooms}
          sqft={property.square_footage ?? 0}
          type={property.type}
          yearBuilt={2005}
          lotSize="0.25 acres"
          description="This stunning property offers a perfect blend of modern design and comfort. Featuring an open floor plan with abundant natural light, gourmet kitchen with high-end appliances, and spacious bedrooms. The primary suite includes a walk-in closet and luxurious bathroom. The backyard is perfect for entertaining with a covered patio area. Located in a highly desirable neighborhood with excellent schools nearby."
        />
        
        <SimilarProperties 
          properties={allProperties.filter(p => String(p.id) !== id).slice(0, 3)}
        />
      </div>
    </div>
  );
};

export default PropertyDetailsPage;
