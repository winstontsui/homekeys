import { Bot, House, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import FeatureBox from "@/components/FeatureBox";
import { ConversationStream } from "./components/ConversationStream";
import { useState } from "react";

const App = () => {
  const boxes = [
    {
      title: "Voice-Assisted Search",
      description:
        "Simply call and describe your dream home to our AI assistant",
      icon: Phone,
    },
    {
      title: "AI Matching",
      description:
        "Advanced algorithms match your preferences with available properties",
      icon: Bot,
    },
    {
      title: "Instant Results",
      description: "Get personalized property recommendations in real-time",
      icon: House,
    },
  ];

  const [open, setOpen] = useState(true);

  return (
    <div>
      {open && (
        <div className="fixed bottom-4 right-4 z-50 shadow-lg">
          <ConversationStream setOpen={setOpen} />
        </div>
      )}
      <div className={`p-4 flex justify-between`}>
        <img
          className={`w-[120px]`}
          src="https://www.homekeys.casa/_next/image?url=%2FHomekeyLogo.png&w=256&q=75"
        />
      </div>

      <div className={`bg-blue-100 bg-opacity-50`}>
        <div
          className={`max-w-screen-xl mx-auto flex flex-col gap-8 items-center py-24`}
        >
          <div className={`text-5xl font-medium`}>
            Find Your Dream Home with AI Assistance
          </div>
          <div className={`text-slate-800`}>
            Call our AI-powered search hotline and let us find you the perfect
            property
          </div>
          <Card
            className={`p-4 gap-4 flex flex-col items-center w-full max-w-md`}
          >
            <div className={`font-medium`}>Call Now</div>
            <div className={`text-4xl font-medium`}>1-800-HOMEKEY</div>
            <div className={`text-sm text-slate-800`}>
              Available 24/7 - AI-Assisted Property Search
            </div>
          </Card>
        </div>
      </div>
      <div className={`max-w-screen-xl mx-auto py-16 grid grid-cols-3 gap-8`}>
        {boxes.map((box, index) => (
          <FeatureBox key={index} {...box} />
        ))}
      </div>
    </div>
  );
};

export default App;
