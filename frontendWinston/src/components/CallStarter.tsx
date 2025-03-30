import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function BlandCallStarter() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCall = async () => {
    if (!phone) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    try {
      const headers = {
        Authorization: "", // Replace with actual key
      };

      const data = {
        phone_number: phone,
        pathway_id: "9c28befe-308e-40eb-893f-c56503491b64",
        voice: "june",
      };

      await axios.post("https://api.bland.ai/v1/calls", data, { headers });
      toast.success("Call started successfully!");
    } catch (error) {
      toast.error("Failed to start call");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-4 mt-10">
      <CardContent className="flex flex-col gap-4">
        <Label htmlFor="phone">Enter Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1XXXXXXXXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Button onClick={handleCall} disabled={loading}>
          {loading ? "Calling..." : "Start Call"}
        </Button>
      </CardContent>
    </Card>
  );
}
