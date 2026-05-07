import { Link } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { toast } from "sonner";

import { ItineraryPanel } from "@/components/itinerary/ItineraryPanel";
import { PARIS_TRIP } from "@/lib/mockData";
import { Button } from "@/components/ui/button";

const Itinerary = () => {
  // For MVP: always show Paris trip
  const trip = PARIS_TRIP;

  return (
    <div className="min-h-screen bg-memento-cream" data-testid="itinerary-page">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-memento-cream/90 backdrop-blur-md border-b border-memento-parchment">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link
            to="/trips"
            className="flex items-center gap-2 text-memento-espresso text-sm font-medium hover:text-memento-terracotta transition-colors"
            data-testid="itinerary-back-link"
          >
            <ArrowLeft className="w-4 h-4" />
            All trips
          </Link>
          <Link to="/chat" data-testid="itinerary-edit-link">
            <Button className="bg-memento-espresso hover:bg-memento-coffee text-memento-cream rounded-full h-9 px-4 text-xs">
              <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
              Edit with AI
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <ItineraryPanel
          trip={trip}
          onSave={() =>
            toast.success("Saved to your trips", {
              description: trip.title,
            })
          }
        />
      </div>
    </div>
  );
};

export default Itinerary;
