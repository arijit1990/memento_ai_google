import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { toast } from "sonner";

import { ItineraryPanel } from "@/components/itinerary/ItineraryPanel";
import { PARIS_TRIP } from "@/lib/mockData";
import { api, getGuestSessionId } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const Itinerary = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const loadTrip = async () => {
      if (id === "trip-paris-001") {
        if (!cancelled) {
          setTrip(PARIS_TRIP);
          setLoading(false);
        }
        return;
      }
      try {
        const r = await api.get(`/trips/${id}`, {
          params: user ? {} : { guest_session_id: getGuestSessionId() },
        });
        if (!cancelled) {
          setTrip(r.data);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e?.response?.data?.detail || "Trip not found");
          setLoading(false);
        }
      }
    };
    loadTrip();
    return () => {
      cancelled = true;
    };
  }, [id, user]);

  return (
    <div className="min-h-screen bg-memento-cream" data-testid="itinerary-page">
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
          {/* Pass the trip id via router state so Chat can load the existing trip */}
          <Link to="/chat" state={{ tripId: id }} data-testid="itinerary-edit-link">
            <Button className="bg-memento-espresso hover:bg-memento-coffee text-memento-cream rounded-full h-9 px-4 text-xs">
              <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
              Edit with AI
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        {loading && (
          <div className="px-6 py-32 text-center">
            <div className="w-12 h-12 rounded-full bg-memento-sand mx-auto animate-pulse" />
            <p className="text-memento-coffee mt-4 italic">Loading your trip...</p>
          </div>
        )}
        {error && !loading && (
          <div className="px-6 py-32 text-center">
            <p className="font-serif text-2xl text-memento-espresso">
              {error}
            </p>
            <Link to="/trips" className="text-memento-terracotta text-sm mt-3 inline-block">
              ← Back to your trips
            </Link>
          </div>
        )}
        {trip && !loading && (
          <ItineraryPanel
            trip={trip}
            onSave={() =>
              toast.success("Saved to your trips", { description: trip.title })
            }
          />
        )}
      </div>
    </div>
  );
};

export default Itinerary;
