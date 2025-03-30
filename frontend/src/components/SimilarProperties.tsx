
import React from "react";
import PropertyCard, { Property } from "./PropertyCard";

interface SimilarPropertiesProps {
  properties: Property[];
}

const SimilarProperties: React.FC<SimilarPropertiesProps> = ({ properties }) => {
  return (
    <div className="my-10">
      <h2 className="text-2xl font-bold mb-6">Similar Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {properties.slice(0, 3).map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
};

export default SimilarProperties;
