
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import PropertyCard, { Property } from "./PropertyCard";

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

const PropertyList = () => {
  const [sortOption, setSortOption] = useState("Newest");
  
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Explore Properties</h2>
        <div className="relative">
          <button className="flex items-center gap-1 border rounded-md px-3 py-1.5 text-sm">
            {sortOption}
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
};

export default PropertyList;
