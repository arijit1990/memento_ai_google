import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, TrendingUp, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DESTINATIONS } from "@/lib/mockData";

const COLLECTIONS = [
  {
    title: "Slow weekends in Europe",
    sub: "3-day itineraries built for unwinding",
    image:
      "https://images.unsplash.com/photo-1493707553966-283afac8c358?auto=format&fit=crop&w=1200&q=80",
    state: { destination: "Europe", tripType: "City Break", dates: "Long weekend" },
  },
  {
    title: "Honeymoons that aren't beaches",
    sub: "Romance, with a sense of place",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
    state: { tripType: "Honeymoon", travelerType: ["Luxury Traveller"] },
  },
  {
    title: "Solo trips for introverts",
    sub: "Quiet cities, slow rhythms",
    image:
      "https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=1200&q=80",
    state: { group: "Solo", travelerType: ["Explorer"] },
  },
];

const Explore = () => {
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen bg-memento-cream" data-testid="explore-page">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-12 lg:pt-16 pb-8">
        <p className="text-xs tracking-[0.3em] uppercase text-memento-terracotta font-semibold mb-3">
          Explore
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-memento-espresso tracking-tight leading-[1.05] mb-6 max-w-3xl">
          A library of places,
          <br />
          <em className="italic font-normal text-memento-coffee">
            ready to become trips.
          </em>
        </h1>

        <div className="relative max-w-xl">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-memento-coffee" />
          <Input
            data-testid="explore-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a city, country, or vibe..."
            className="pl-12 h-14 rounded-full border-memento-parchment bg-white text-base shadow-[0_4px_20px_rgb(0,0,0,0.04)]"
          />
        </div>
      </section>

      {/* Trending */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-6 pb-12">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-4 h-4 text-memento-terracotta" />
          <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-memento-espresso">
            Trending this season
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {DESTINATIONS.filter((d) => {
            if (!query) return true;
            const q = query.toLowerCase();
            return (
              d.name.toLowerCase().includes(q) ||
              d.country.toLowerCase().includes(q) ||
              (d.tagline || "").toLowerCase().includes(q)
            );
          }).map((d, i) => (
            <Link
              key={d.name}
              to="/chat"
              state={{ destination: `${d.name}, ${d.country}` }}
              data-testid={`explore-destination-${d.name.toLowerCase()}`}
              className="group block animate-float-up"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="aspect-[3/4] rounded-2xl overflow-hidden relative bg-memento-espresso mb-3">
                <img
                  src={d.image}
                  alt={d.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-memento-espresso/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-serif text-2xl text-memento-cream tracking-tight">
                    {d.name}
                  </h3>
                  <p className="text-memento-cream/70 text-xs">{d.country}</p>
                </div>
              </div>
              <p className="text-sm text-memento-espresso font-medium">
                {d.tagline}
              </p>
              <p className="text-xs text-memento-coffee mt-0.5">
                {d.trips.toLocaleString()} memento travelers
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Editorial collections */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-20">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-4 h-4 text-memento-terracotta" />
          <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-memento-espresso">
            Curated collections
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {COLLECTIONS.map((c, i) => (
            <Link
              key={c.title}
              to="/chat"
              state={c.state || {}}
              data-testid={`explore-collection-${i}`}
              className="group relative aspect-[4/5] rounded-3xl overflow-hidden block bg-memento-espresso"
            >
              <img
                src={c.image}
                alt={c.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-memento-espresso via-memento-espresso/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <h3 className="font-serif text-3xl text-memento-cream leading-tight tracking-tight mb-2">
                  {c.title}
                </h3>
                <p className="text-memento-cream/80 text-sm">{c.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Explore;
