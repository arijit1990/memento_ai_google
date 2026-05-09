import { useState, useEffect, useRef } from "react";
import { Hotel, Plane, Star, Search, Loader2, ChevronRight, LocateFixed } from "lucide-react";
import { parse, format, differenceInDays } from "date-fns";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Parse LLM date strings like "Apr 12, 2026" or "May 9, 2026" → "2026-04-12"
function toIsoDate(dateStr) {
  if (!dateStr) return null;
  try {
    const d = parse(dateStr.trim(), "MMM d, yyyy", new Date());
    if (isNaN(d)) return null;
    return format(d, "yyyy-MM-dd");
  } catch {
    return null;
  }
}

function parseAdults(travelers) {
  if (!travelers) return 2;
  const m = travelers.match(/(\d+)/);
  return m ? Math.max(1, parseInt(m[1])) : 2;
}

function durationLabel(mins) {
  if (!mins) return "";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

const StarRating = ({ rating }) => {
  if (!rating) return null;
  return (
    <span className="flex items-center gap-0.5 text-amber-500">
      <Star className="w-3 h-3 fill-current" />
      <span className="text-xs text-memento-espresso font-medium">{rating}</span>
    </span>
  );
};

export const LivePricesPanel = ({ trip }) => {
  const [activeTab, setActiveTab] = useState("hotels");
  const [hotels, setHotels] = useState(null);
  const [hotelsLoading, setHotelsLoading] = useState(false);
  const [hotelsError, setHotelsError] = useState(null);

  const [origin, setOrigin] = useState("");
  const [detectedLabel, setDetectedLabel] = useState(""); // e.g. "Mumbai (BOM)"
  const [detecting, setDetecting] = useState(false);
  const [flights, setFlights] = useState(null);
  const [flightsLoading, setFlightsLoading] = useState(false);
  const [flightsError, setFlightsError] = useState(null);
  const [arrivalIata, setArrivalIata] = useState("");

  const checkIn = toIsoDate(trip.startDate);
  const checkOut = toIsoDate(trip.endDate);
  const adults = parseAdults(trip.travelers);
  const nights = checkIn && checkOut ? differenceInDays(new Date(checkOut), new Date(checkIn)) : null;

  // Auto-detect nearest airport from user's IP on first render
  useEffect(() => {
    setDetecting(true);
    fetch("https://ipapi.co/json/")
      .then((r) => r.json())
      .then((geo) => {
        const city = geo.city || "";
        const country = geo.country_name || "";
        return api.get("/airports/detect", { params: { city, country } }).then((r) => ({
          iata: r.data.iata,
          city,
          country,
        }));
      })
      .then(({ iata, city, country }) => {
        if (iata) {
          setOrigin(iata);
          setDetectedLabel(`${city || country} (${iata})`);
        }
      })
      .catch(() => {})
      .finally(() => setDetecting(false));
  }, []); // run once

  // Auto-fetch hotels when we have dates
  useEffect(() => {
    if (!checkIn || !checkOut || !trip.destination) return;
    let cancelled = false;
    setHotelsLoading(true);
    setHotelsError(null);
    api
      .get("/prices/hotels", {
        params: { destination: trip.destination, check_in: checkIn, check_out: checkOut, adults },
      })
      .then((r) => {
        if (!cancelled) {
          setHotels(r.data.hotels || []);
          if (r.data.error && !r.data.hotels?.length) setHotelsError(r.data.error);
        }
      })
      .catch((e) => {
        if (!cancelled) setHotelsError(e?.response?.data?.detail || "Could not load hotel prices");
      })
      .finally(() => { if (!cancelled) setHotelsLoading(false); });
    return () => { cancelled = true; };
  }, [trip.destination, checkIn, checkOut, adults]);

  const searchFlights = async () => {
    if (!origin.trim() || !checkIn) return;
    setFlightsLoading(true);
    setFlightsError(null);
    setFlights(null);
    try {
      const r = await api.get("/prices/flights", {
        params: {
          origin: origin.trim().toUpperCase(),
          destination: trip.destination,
          outbound_date: checkIn,
          return_date: checkOut || undefined,
          adults,
        },
      });
      setFlights(r.data.flights || []);
      setArrivalIata(r.data.arrival_iata || "");
      if (r.data.error && !r.data.flights?.length) setFlightsError(r.data.error);
    } catch (e) {
      setFlightsError(e?.response?.data?.detail || "Could not load flight prices");
    } finally {
      setFlightsLoading(false);
    }
  };

  if (!checkIn) return null; // No dates → hide panel entirely

  return (
    <div className="mb-10 bg-white rounded-3xl border border-memento-parchment overflow-hidden" data-testid="live-prices-panel">
      {/* Tabs */}
      <div className="flex border-b border-memento-parchment">
        {[
          { id: "hotels", label: "Hotels", Icon: Hotel },
          { id: "flights", label: "Flights", Icon: Plane },
        ].map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === id
                ? "border-memento-terracotta text-memento-terracotta"
                : "border-transparent text-memento-coffee hover:text-memento-espresso"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
        <div className="ml-auto flex items-center px-5">
          <span className="text-[10px] uppercase tracking-[0.15em] text-memento-coffee font-semibold">
            Live prices · {trip.startDate}
          </span>
        </div>
      </div>

      {/* Hotels tab */}
      {activeTab === "hotels" && (
        <div className="p-5">
          {hotelsLoading && (
            <div className="flex items-center justify-center gap-2 py-8 text-memento-coffee">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Fetching live hotel prices…</span>
            </div>
          )}
          {hotelsError && !hotelsLoading && (
            <p className="text-sm text-memento-coffee text-center py-6">{hotelsError}</p>
          )}
          {!hotelsLoading && hotels && hotels.length === 0 && (
            <p className="text-sm text-memento-coffee text-center py-6">No hotels found for these dates.</p>
          )}
          {!hotelsLoading && hotels && hotels.length > 0 && (
            <div className="space-y-3">
              {hotels.map((h, i) => (
                <a
                  key={i}
                  href={h.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 rounded-2xl border border-memento-parchment hover:border-memento-terracotta hover:shadow-sm transition-all group"
                >
                  {h.thumbnail && (
                    <img
                      src={h.thumbnail}
                      alt={h.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-memento-espresso leading-tight mb-1 truncate">
                      {h.name}
                    </p>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      {h.stars && (
                        <span className="text-[10px] text-memento-coffee">{h.stars}</span>
                      )}
                      <StarRating rating={h.rating} />
                      {h.reviews && (
                        <span className="text-[10px] text-memento-coffee">
                          ({h.reviews.toLocaleString()} reviews)
                        </span>
                      )}
                    </div>
                    {h.amenities && h.amenities.length > 0 && (
                      <p className="text-[10px] text-memento-coffee">
                        {h.amenities.slice(0, 3).join(" · ")}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-base font-bold text-memento-terracotta">{h.price_per_night}</p>
                    <p className="text-[10px] text-memento-coffee">per night</p>
                    {nights && h.total_price && (
                      <p className="text-xs text-memento-coffee mt-0.5">{h.total_price} total</p>
                    )}
                    <ChevronRight className="w-3.5 h-3.5 text-memento-coffee ml-auto mt-1 group-hover:text-memento-terracotta transition-colors" />
                  </div>
                </a>
              ))}
              <p className="text-[10px] text-memento-coffee text-center pt-1">
                Prices from Google Hotels · Click to book
              </p>
            </div>
          )}
        </div>
      )}

      {/* Flights tab */}
      {activeTab === "flights" && (
        <div className="p-5">
          <div className="flex gap-2 mb-2">
            <div className="relative flex-1">
              {detecting ? (
                <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-memento-coffee animate-spin" />
              ) : (
                <LocateFixed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-memento-coffee" />
              )}
              <Input
                value={origin}
                onChange={(e) => {
                  setOrigin(e.target.value.toUpperCase().slice(0, 3));
                  setDetectedLabel(""); // user overriding auto-detect
                }}
                placeholder="From (IATA e.g. BOM, LHR)"
                className="pl-9 h-11 rounded-xl border-memento-parchment text-sm"
                onKeyDown={(e) => e.key === "Enter" && searchFlights()}
                maxLength={3}
              />
            </div>
            <Button
              onClick={searchFlights}
              data-testid="flights-search-btn"
              disabled={flightsLoading || !origin.trim() || !checkIn}
              className="bg-memento-terracotta hover:bg-memento-terracotta-dark text-white rounded-xl h-11 px-5"
            >
              {flightsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </Button>
          </div>
          {detectedLabel && (
            <p className="text-[10px] text-memento-terracotta mb-4 flex items-center gap-1">
              <LocateFixed className="w-3 h-3" />
              Nearest airport detected: <strong>{detectedLabel}</strong> — change above if needed
            </p>
          )}

          {arrivalIata && (
            <p className="text-[10px] text-memento-coffee mb-4 text-center">
              Searching {origin} → {arrivalIata} · {trip.startDate}{checkOut ? ` – ${trip.endDate}` : ""} · {adults} {adults === 1 ? "adult" : "adults"}
            </p>
          )}

          {flightsLoading && (
            <div className="flex items-center justify-center gap-2 py-8 text-memento-coffee">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Searching flights…</span>
            </div>
          )}
          {flightsError && !flightsLoading && (
            <p className="text-sm text-memento-coffee text-center py-6">{flightsError}</p>
          )}
          {!flightsLoading && flights && flights.length === 0 && (
            <p className="text-sm text-memento-coffee text-center py-6">
              No flights found. Try a different origin airport code.
            </p>
          )}
          {!flightsLoading && flights && flights.length > 0 && (
            <div className="space-y-3">
              {flights.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-memento-parchment"
                >
                  {f.airline_logo && (
                    <img src={f.airline_logo} alt={f.airline} className="w-8 h-8 object-contain shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-memento-espresso">{f.airline}</p>
                    <p className="text-xs text-memento-coffee">
                      {f.stops === 0 ? "Direct" : `${f.stops} stop${f.stops > 1 ? "s" : ""}`}
                      {f.duration_min ? ` · ${durationLabel(f.duration_min)}` : ""}
                    </p>
                    {f.departs && (
                      <p className="text-[10px] text-memento-coffee mt-0.5">
                        {f.departs.split(" ")[1]} → {f.arrives?.split(" ")[1]}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base font-bold text-memento-terracotta">
                      ${f.price?.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-memento-coffee">per person</p>
                  </div>
                </div>
              ))}
              <p className="text-[10px] text-memento-coffee text-center pt-1">
                Prices from Google Flights via SerpAPI · Book directly with the airline
              </p>
            </div>
          )}

          {!flights && !flightsLoading && (
            <div className="text-center py-6">
              <Plane className="w-8 h-8 text-memento-parchment mx-auto mb-3" />
              <p className="text-sm text-memento-coffee">
                Enter your departure airport code (e.g. <strong>LHR</strong>, <strong>JFK</strong>, <strong>BOM</strong>) to see live prices.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
