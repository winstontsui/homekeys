import React, { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import BlandCallStarter from "./CallStarter";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState(
    "3 bed, 2 bath house with a garage"
  );

  return (
    <div className="w-full bg-blue-50 py-16 px-6 md:px-10 text-center mb-8">
      <div className="max-w-3xl mx-auto">
        <div className="">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Homekey is the new, streamlined alternative to the traditional real
            estate model.
          </h1>
          <p className="text-gray-600">
            Learn more about our one-stop AI-based platform to help you manage
            the entire process{" "}
            <a href="#" className="text-blue-500">
              here
            </a>
            .
          </p>
          <div className="mt-4">
            <a href="#" className="text-blue-500 font-medium">
              Request access to the demo account.
            </a>
          </div>
          <BlandCallStarter />
        </div>
      </div>
    </div>
  );
};

export default Hero;
