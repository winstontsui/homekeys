
import React from "react";
import { Link } from "react-router-dom";
import { Building, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <header className="w-full py-4 px-6 md:px-10 border-b flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center">
          <Building className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl font-semibold">Homekey</span>
        </Link>
      </div>

      <nav className="hidden md:flex items-center space-x-8">
        <Link to="/" className="text-blue-500 font-medium">
          Explore Listings
        </Link>
        <Link to="/dashboard" className="text-gray-700 hover:text-gray-900">
          Dashboard
        </Link>
        <div className="relative group">
          <button className="flex items-center text-gray-700 hover:text-gray-900">
            Company
            <ChevronDown className="ml-1 h-4 w-4" />
          </button>
        </div>
        <div className="relative group">
          <button className="flex items-center text-gray-700 hover:text-gray-900">
            Partner with Us
            <ChevronDown className="ml-1 h-4 w-4" />
          </button>
        </div>
      </nav>

      <div className="flex items-center gap-4">
        <Button variant="outline" className="hidden md:flex items-center gap-2 bg-blue-50 text-primary border-blue-100">
          Enable AI Assistant
          <span className="bg-blue-100 text-primary rounded-md px-1 py-0.5 text-xs">
            AI
          </span>
        </Button>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white">
            W
          </div>
          <span className="hidden md:inline font-medium">Winston Tsui</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
