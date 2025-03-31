import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SearchSection from "@/components/SearchSection";
import PropertyList from "@/components/PropertyList";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <SearchSection />
      <PropertyList />
    </div>
  );
};

export default Index;
