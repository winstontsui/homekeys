
import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SearchSection from "@/components/SearchSection";
import PropertyList from "@/components/PropertyList";
import BlandCallStarter from "@/components/CallStarter";


const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <BlandCallStarter />
      <SearchSection />
      <PropertyList />
    </div>
  );
};

export default Index;
