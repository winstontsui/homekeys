import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import PropertyMap from "@/components/PropertyMap";
import PropertyModal from "@/components/PropertyModal";
import PropertyCard, { Property } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Search, ListFilter, Grid, LayoutList, Map, ChevronDown } from "lucide-react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import propertiesData from "@/components/properties.json";

// Sample property images
const sampleImages = [
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1598228723793-52759bba239c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
  "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
];

function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const shuffledImages = shuffle(sampleImages);

// Map properties from the JSON file and assign images
const properties: Property[] = propertiesData.properties.map((property, index) => {
  const image = shuffledImages[index % shuffledImages.length];
  return {
    ...property,
    image,
  };
});

const MapView = () => {
  const { propertyId } = useParams<{ propertyId?: string }>();
  const navigate = useNavigate();
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | number | undefined>(propertyId ? Number(propertyId) : undefined);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(!!propertyId);
  const [isListView, setIsListView] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  
  useEffect(() => {
    if (propertyId) {
      setSelectedPropertyId(Number(propertyId));
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [propertyId]);

  const selectedProperty = selectedPropertyId !== undefined
    ? properties.find(p => p.id === selectedPropertyId) 
    : undefined;
  
  const handleSelectProperty = (id: string | number) => {
    navigate(`/map/${id}`);
  };
  
  const handleCloseModal = () => {
    navigate('/map');
  };
  
  const handlePreviousProperty = () => {
    if (!selectedPropertyId) return;
    
    const currentIndex = properties.findIndex(p => p.id === selectedPropertyId);
    if (currentIndex > 0) {
      navigate(`/map/${properties[currentIndex - 1].id}`);
    }
  };
  
  const handleNextProperty = () => {
    if (!selectedPropertyId) return;
    
    const currentIndex = properties.findIndex(p => p.id === selectedPropertyId);
    if (currentIndex < properties.length - 1) {
      navigate(`/map/${properties[currentIndex + 1].id}`);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProperties = properties.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(properties.length / itemsPerPage);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Search controls */}
      <div className="bg-white shadow-sm border-b px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap md:flex-nowrap items-center justify-between gap-3">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input 
              type="text" 
              placeholder="City, Address, ZIP"
              className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div className="flex flex-wrap md:flex-nowrap items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <span>For Sale</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <span>Price</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <span>Beds & Baths</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <span>Home Type</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center border rounded overflow-hidden">
              <button 
                className={`px-3 py-1.5 flex items-center gap-1 ${!isListView ? 'bg-primary text-white' : 'bg-white'}`}
                onClick={() => setIsListView(false)}
              >
                <Map className="h-4 w-4" />
                <span className="text-sm">Map</span>
              </button>
              <button 
                className={`px-3 py-1.5 flex items-center gap-1 ${isListView ? 'bg-primary text-white' : 'bg-white'}`}
                onClick={() => setIsListView(true)}
              >
                <LayoutList className="h-4 w-4" />
                <span className="text-sm">List</span>
              </button>
            </div>
            
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              Save search
            </Button>
          </div>
        </div>
      </div>
      
      {/* Results count */}
      <div className="bg-white border-b px-6 py-2">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold">Properties For Sale</h1>
            <p className="text-sm text-gray-500">{properties.length} results</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Sort:</span>
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <span>Recommended</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {isListView ? (
        <div className="flex-1 bg-gray-50 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 relative">
          <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-179px)]">
            {/* Property listings panel */}
            <ResizablePanel defaultSize={40} minSize={30}>
              <div className="h-full overflow-y-auto bg-white p-4">
                <div className="space-y-4">
                  {currentProperties.map((property) => (
                    <div 
                      key={property.id} 
                      className={`border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer
                        ${selectedPropertyId === property.id ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => handleSelectProperty(property.id)}
                    >
                      <div className="flex flex-col sm:flex-row">
                        <div className="w-full sm:w-1/3 h-48 sm:h-auto relative">
                          <img 
                            src={property.image} 
                            alt={property.address}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {property.type}
                          </div>
                          
                          {/* Show open house info if available */}
                          {property.open_house_info && (
                            <div className="absolute bottom-2 left-2 bg-green-600/90 text-white text-xs px-2 py-1 rounded">
                              Open House
                            </div>
                          )}
                        </div>
                        <div className="p-4 flex-1">
                          <div className="mb-2">
                            <span className="text-xl font-bold">${property.price.toLocaleString()}</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-1">{property.address}</p>
                          
                          <div className="flex items-center gap-3 text-sm text-gray-700 mb-2">
                            <div>{property.bedrooms || property.beds} beds</div>
                            <div>{property.bathrooms || property.baths} baths</div>
                            <div>{(property.square_footage || property.sqft)?.toLocaleString()} sqft</div>
                          </div>
                          
                          {/* Display hazard zones if available */}
                          {property.hazard_zones && property.hazard_zones.length > 0 && (
                            <p className="text-xs text-red-600 mb-2">
                              Hazard Zones: {property.hazard_zones.join(", ")}
                            </p>
                          )}
                          
                          <div className="flex flex-wrap gap-1">
                            {(property.amenities || property.features || []).map((feature, idx) => (
                              <span key={idx} className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Pagination */}
                <Pagination className="mt-6">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className={currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <PaginationItem key={idx}>
                        <PaginationLink
                          onClick={() => setCurrentPage(idx + 1)}
                          isActive={currentPage === idx + 1}
                        >
                          {idx + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        className={currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </ResizablePanel>
            
            {/* Resizable handle */}
            <ResizableHandle withHandle />
            
            {/* Map panel */}
            <ResizablePanel defaultSize={60}>
              <div className="h-full relative">
                <PropertyMap 
                  properties={properties}
                  selectedPropertyId={selectedPropertyId}
                  onSelectProperty={handleSelectProperty}
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
          
          {/* Property modal */}
          {selectedProperty && (
            <PropertyModal 
              property={selectedProperty}
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onPrevious={handlePreviousProperty}
              onNext={handleNextProperty}
              hasPrevious={properties.findIndex(p => p.id === selectedPropertyId) > 0}
              hasNext={properties.findIndex(p => p.id === selectedPropertyId) < properties.length - 1}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MapView;