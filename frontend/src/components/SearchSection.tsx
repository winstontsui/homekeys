import React, { useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const SearchSection = () => {
  const [searchQuery, setSearchQuery] = useState(
    "3 bed, 2 bath house with a garage"
  );

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Find Your Next Home</h2>
        <p className="text-gray-600">
          Use natural language to search for properties that match your needs
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Describe your dream home..."
          />
        </div>
        <Button className="bg-primary text-white px-6 flex items-center gap-2">
          <Search className="h-5 w-5" />
          <span>Search</span>
        </Button>
      </div>

      {/* <div className="mt-4 md:mt-0 float-right">
        <div className="bg-primary text-white px-6 py-4 rounded-lg max-w-xs flex flex-col">
          <p className="text-sm mb-1">Are you ready to sell your property?</p>
          <div className="flex items-center justify-between">
            <p className="font-medium">List Your Property Today</p>
            <Button variant="ghost" size="sm" className="text-white p-0 hover:bg-blue-600">
              <span className="mr-1">Get Started</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default SearchSection;
