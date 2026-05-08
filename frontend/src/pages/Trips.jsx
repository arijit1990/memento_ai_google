import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SAMPLE_TRIPS } from "@/lib/mockData";
import { api, getGuestSessionId } from "@/lib/api";
import { useAuth } from "@/lib/auth";

const STATUS_LABEL = {
  upcoming: { text: "Upcoming", color: "bg-memento-sage text-memento-sage-dark" },
  draft: { text: "Draft", color: "bg-memento-sand text-memento-coffee" },
  past: { text: "Past", color: "bg-[#F0E6E1] text-memento-coffee" },
};

const Trips = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const r = await api.get("/trips", {
          params: user ? {} : { guest_session_id: getGuestSessionId() },
        });
        if (cancelled) return;
        const real = r.data?.trips || [];
        // Only show sample trips when the user has no real trips yet
        setTrips(real.length > 0 ? real : SAMPLE_TRIPS);
      } catch (_e) {
        if (!cancelled) setTrips(SAMPLE_TRIPS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <div className="min-h-screen bg-memento-cream" data-testid="trips-page">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-16">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-memento-terracotta font-semibold mb-3">
              {user ? `Welcome back, ${user.name?.split(" ")[0] || "Traveler"}` : "Your travels"}
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl text-memento-espresso tracking-tight leading-tight">
              Trips, dreams,
              <br />
              <em className="italic font-normal text-memento-coffee">
                memories in waiting.
              </em>
            </h1>
          </div>
          <Link to="/chat" data-testid="trips-new-cta">
            <Button className="bg-memento-terracotta hover:bg-memento-terracotta-dark text-white rounded-full h-12 px-6 text-sm font-medium shadow-[0_8px_15px_rgba(200,90,64,0.25)]">
              <Plus className="w-4 h-4 mr-2" />
              Plan a new trip
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-3xl bg-memento-sand h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {trips.map((t, i) => {
              const s = STATUS_LABEL[t.status] || STATUS_LABEL.draft;
              return (
                <Link
                  key={t.id}
                  to={`/itinerary/${t.id}`}
                  data-testid={`trip-card-${t.id}`}
                  className="group relative rounded-3xl overflow-hidden bg-white border border-memento-parchment hover:border-memento-terracotta/40 hover:-translate-y-1 transition-all duration-300 shadow-[0_4px_15px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="aspect-[5/4] overflow-hidden bg-memento-sand">
                    {t.cover && (
                      <img
                        src={t.cover}
                        alt={t.destination}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    )}
                  </div>
                  <div className="absolute top-4 left-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${s.color}`}
                    >
                      {s.text}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-2xl text-memento-espresso tracking-tight leading-tight mb-2">
                      {t.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-memento-coffee mb-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {t.destination}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="flex items-center gap-1.5 text-xs text-memento-coffee">
                        <Calendar className="w-3 h-3" />
                        {t.dates || ""}
                      </span>
                      <span className="text-xs font-semibold text-memento-terracotta">
                        {t.days} days
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}

            <Link
              to="/chat"
              data-testid="trips-new-card"
              className="group rounded-3xl border-2 border-dashed border-memento-parchment hover:border-memento-terracotta hover:bg-white transition-all flex flex-col items-center justify-center text-center p-12 min-h-[320px]"
            >
              <div className="w-14 h-14 rounded-full bg-memento-sand group-hover:bg-memento-terracotta group-hover:text-white flex items-center justify-center mb-4 transition-colors">
                <Plus className="w-6 h-6" strokeWidth={1.6} />
              </div>
              <p className="font-serif text-xl text-memento-espresso mb-1">
                Start a new trip
              </p>
              <p className="text-xs text-memento-coffee">
                Memento will handle the rest
              </p>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Trips;
