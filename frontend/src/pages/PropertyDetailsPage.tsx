
import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import PropertyGallery from "@/components/PropertyGallery";
import PropertyDetails from "@/components/PropertyDetails";
import SimilarProperties from "@/components/SimilarProperties";
import { Property } from "@/components/PropertyCard";

// Sample property data
const sampleProperties: Property[] = [
  {
    id: "1",
    type: "Condo",
    price: 550000,
    address: "87 Pearce Mitchell Place",
    city: "Stanford",
    state: "CA",
    zip: "94305-8526",
    beds: 2,
    baths: 2,
    sqft: 1019,
    features: ["Pool", "Carport"],
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  },
  {
    id: "2",
    type: "Single Family Home",
    price: 3750000,
    address: "710 Frenchman's Road",
    city: "Stanford",
    state: "CA",
    zip: "94305-1005",
    beds: 6,
    baths: 5,
    sqft: 2918,
    features: ["Garage"],
    image: "https://images.unsplash.com/photo-1598228723793-52759bba239c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
  },
  {
    id: "3",
    type: "Single Family Home",
    price: 2213000,
    address: "2254 Oberlin Street",
    city: "Palo Alto",
    state: "CA",
    zip: "94306-1313",
    beds: 3,
    baths: 3,
    sqft: 2345,
    features: ["Garage"],
    image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  },
  {
    id: "4",
    type: "Condo",
    price: 890000,
    address: "123 Main Street",
    city: "San Francisco",
    state: "CA",
    zip: "94107",
    beds: 2,
    baths: 2,
    sqft: 1200,
    features: ["Garage"],
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  },
  {
    id: "5",
    type: "Single Family Home",
    price: 1580000,
    address: "456 Oak Avenue",
    city: "Menlo Park",
    state: "CA",
    zip: "94025",
    beds: 4,
    baths: 3,
    sqft: 2800,
    features: ["Pool", "Garage"],
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  },
  {
    id: "6",
    type: "Single Family Home",
    price: 2350000,
    address: "789 Pine Lane",
    city: "Palo Alto",
    state: "CA",
    zip: "94301",
    beds: 5,
    baths: 4,
    sqft: 3200,
    features: ["Pool", "Garage"],
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  }
];

const PropertyDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  
  // Find the property based on ID
  const property = sampleProperties.find((p) => p.id === id) || sampleProperties[0];
  
  // Property images - adding more for the gallery
  const propertyImages = [
    property.image,
    "https://images.unsplash.com/photo-1560184897-ae75f418493e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1560185008-a33f5c1a290e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
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
          beds={property.beds}
          baths={property.baths}
          sqft={property.sqft}
          type={property.type}
          yearBuilt={2005}
          lotSize="0.25 acres"
          description="This stunning property offers a perfect blend of modern design and comfort. Featuring an open floor plan with abundant natural light, gourmet kitchen with high-end appliances, and spacious bedrooms. The primary suite includes a walk-in closet and luxurious bathroom. The backyard is perfect for entertaining with a covered patio area. Located in a highly desirable neighborhood with excellent schools nearby."
        />
        
        <SimilarProperties 
          properties={sampleProperties.filter(p => p.id !== id).slice(0, 3)}
        />
      </div>
    </div>
  );
};

export default PropertyDetailsPage;
