import React from "react";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  ChevronUp,
  Home,
  Send,
  Mail,
  Clock,
  FileText,
  Search,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

interface Property {
  id: number;
  image: string;
  address: string;
  price: string;
  status: string;
  type: string;
  bedsBaths: string;
  sqft: string;
}

const fetchSavedProperties = async (): Promise<Property[]> => {
  // Adjust your URL/port as needed
  const { data } = await axios.get(
    "https://homekeys-b8lh.onrender.com/saved-properties"
  );
  return data;
};

const Dashboard = () => {
  const {
    data: savedProperties = [],
    isLoading,
    isError,
  } = useQuery<Property[]>({
    queryKey: ["savedProperties"],
    queryFn: fetchSavedProperties,
  });

  if (isLoading) {
    return <div>Loading saved properties...</div>;
  }

  if (isError) {
    return <div>Failed to load saved properties.</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Property Management Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Track your real estate transactions and manage tasks
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="p-6 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-800">
                  Saved Properties
                </h3>
                {/* Use the length of savedProperties for the count */}
                <p className="text-4xl font-bold mt-2">
                  {savedProperties.length}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Properties of interest
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Home className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </Card>

          <Card className="p-6 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-800">Offers Sent</h3>
                <p className="text-4xl font-bold mt-2">0</p>
                <p className="text-sm text-gray-500 mt-1">Total offers sent</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Send className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </Card>

          <Card className="p-6 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-800">Offers Received</h3>
                <p className="text-4xl font-bold mt-2">0</p>
                <p className="text-sm text-gray-500 mt-1">
                  Total offers received
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Mail className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </Card>

          <Card className="p-6 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-800">Pending Offers</h3>
                <p className="text-4xl font-bold mt-2">0</p>
                <p className="text-sm text-gray-500 mt-1">Awaiting response</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </Card>
        </div>

        {/* Saved Properties Table */}
        <Card className="mb-10">
          <div className="p-6 flex justify-between items-center border-b">
            <h2 className="text-xl font-semibold">Saved Properties</h2>
            <ChevronUp className="h-5 w-5 text-gray-500" />
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Asking Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Beds/Baths</TableHead>
                  <TableHead>Sqft</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {savedProperties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={property.image}
                          alt={property.address}
                          className="h-12 w-16 object-cover rounded"
                        />
                        <span>{property.address}</span>
                      </div>
                    </TableCell>
                    <TableCell>{property.price}</TableCell>
                    <TableCell>
                      <span className="px-3 py-1 bg-gray-800 text-white text-xs rounded-md">
                        {property.status}
                      </span>
                    </TableCell>
                    <TableCell>{property.type}</TableCell>
                    <TableCell>{property.bedsBaths}</TableCell>
                    <TableCell>{property.sqft}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs flex items-center gap-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                          View Listing
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs text-red-500 flex items-center gap-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                          Unsave
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Understanding the Process */}
        <Card>
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Understanding the Process</h2>
            <p className="text-gray-600 mt-1">
              The property transaction process is divided into three main
              stages. Below, you'll find an overview of what to expect at each
              stage.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <div>
              <div className="bg-blue-50 p-3 rounded-lg inline-block mb-4">
                <FileText className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Offer & Agreement</h3>
              <p className="text-gray-600 mb-3">
                The initial phase where the buyer and seller negotiate the terms
                of the property purchase.
              </p>
              <p className="font-medium">Typically 7-14 days</p>
            </div>

            <div>
              <div className="bg-blue-50 p-3 rounded-lg inline-block mb-4">
                <Search className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                Inspection & Review
              </h3>
              <p className="text-gray-600 mb-3">
                This phase focuses on property inspections and document reviews
                to finalize the deal.
              </p>
              <p className="font-medium">Typically 14-30 days</p>
            </div>

            <div>
              <div className="bg-blue-50 p-3 rounded-lg inline-block mb-4">
                <Zap className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                Utilities & Closing
              </h3>
              <p className="text-gray-600 mb-3">
                The final steps to transfer ownership and complete the property
                transaction.
              </p>
              <p className="font-medium">Typically 10-21 days</p>
            </div>
          </div>
        </Card>

        {/* Personalize Your Journey Button */}
        <div className="mt-8 flex justify-end">
          <Button className="border rounded-lg px-6 py-2 flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800">
            Personalize Your Journey
            <div className="bg-blue-500 text-white rounded-full p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </div>
          </Button>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          Define and update your goals with the help of AI
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
