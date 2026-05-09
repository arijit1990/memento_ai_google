import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, MapPin, Wand2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DESTINATIONS, STATS, HERO_IMAGE } from "@/lib/mockData";

const FEATURES = [
  {
    icon: Wand2,
    title: "Handcrafted by AI",
    body: "Memento doesn't list — it composes. A multi-agent system writes a day-by-day plan that fits your pace, palate, and people.",
  },
  {
    icon: Sparkles,
    title: "Smart travel hacks",
    body: "Locals' tricks, surfaced as one-tap suggestions. Skip lines, optimize transit, save hundreds.",
  },
  {
    icon: MapPin,
    title: "Edit by conversation",
    body: "\"Make day 3 less touristy\" — and it does. Refine your trip in plain English, not dropdowns.",
  },
  {
    icon: Lock,
    title: "Private by default",
    body: "Your data is yours. No social login required. Sessions discard after 72 hours unless you save them.",
  },
];

const Landing = () => {
  return (
    <div className="bg-memento-cream" data-testid="landing-page">
      {/* HERO */}
      <section className="relative min-h-[92vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="A traveler's memory"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-memento-espresso/60 via-memento-espresso/30 to-memento-cream" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-24 lg:pt-32 pb-24">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-16 lg:mb-24 animate-float-up">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-memento-cream/95 text-memento-espresso flex items-center justify-center font-serif text-xl">
                M
              </div>
              <span className="font-serif text-2xl text-memento-cream tracking-tight">
                Memento
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/auth/login"
                className="hidden sm:inline text-memento-cream/90 hover:text-memento-cream text-sm font-medium px-4 py-2"
                data-testid="hero-login-link"
              >
                Sign in
              </Link>
              <Link to="/auth/signup" data-testid="hero-signup-link">
                <Button className="bg-memento-cream text-memento-espresso hover:bg-white rounded-full px-5 h-10 font-medium">
                  Create account
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero text */}
          <div className="max-w-3xl animate-float-up" style={{ animationDelay: "120ms" }}>
            <p className="text-xs tracking-[0.3em] uppercase text-memento-apricot font-semibold mb-6">
              A smart travel companion
            </p>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-memento-cream leading-[0.95] tracking-tight mb-7">
              Plan trips you'll
              <br />
              actually <em className="italic font-medium text-memento-apricot">remember.</em>
            </h1>
            <p className="text-lg sm:text-xl text-memento-cream/85 leading-relaxed max-w-xl mb-10 font-light">
              Tell Memento where you're dreaming of going. We'll handcraft a
              day-by-day itinerary that feels like it was written by a friend
              who lives there.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/chat" data-testid="hero-cta-plan">
                <Button className="bg-memento-terracotta hover:bg-memento-terracotta-dark text-white rounded-full h-14 px-8 text-base font-medium shadow-[0_12px_30px_rgba(200,90,64,0.4)] hover:shadow-[0_16px_40px_rgba(200,90,64,0.5)] transition-all">
                  Plan my trip — free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/explore" data-testid="hero-cta-explore">
                <Button
                  variant="ghost"
                  className="text-memento-cream hover:bg-memento-cream/10 hover:text-memento-cream rounded-full h-14 px-7 text-base font-medium border border-memento-cream/20"
                >
                  Browse destinations
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-memento-cream/15 backdrop-blur-sm bg-memento-espresso/40">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex flex-wrap gap-8 sm:gap-16 justify-center sm:justify-start">
            {STATS.map((s) => (
              <div key={s.label} data-testid={`stat-${s.label.toLowerCase().replace(/[^a-z]/g, "-")}`}>
                <div className="font-serif text-3xl text-memento-cream">
                  {s.value}
                </div>
                <div className="text-xs uppercase tracking-[0.2em] text-memento-cream/60 mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS / FEATURES */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
        <div className="max-w-2xl mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-memento-terracotta font-semibold mb-4">
            How Memento works
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl text-memento-espresso leading-tight tracking-tight">
            Not another itinerary generator.
            <br />
            <em className="italic text-memento-coffee font-normal">
              A travel companion.
            </em>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {FEATURES.map(({ icon: Icon, title, body }, i) => (
            <div
              key={title}
              data-testid={`feature-${i}`}
              className="group relative bg-white rounded-3xl p-8 lg:p-10 border border-memento-parchment hover:border-memento-terracotta/30 hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]"
            >
              <div className="w-12 h-12 rounded-2xl bg-memento-sand text-memento-terracotta flex items-center justify-center mb-6 group-hover:bg-memento-terracotta group-hover:text-white transition-colors">
                <Icon className="w-5 h-5" strokeWidth={1.6} />
              </div>
              <h3 className="font-serif text-2xl text-memento-espresso mb-3">
                {title}
              </h3>
              <p className="text-memento-coffee leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className="bg-memento-sand py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
            <div className="max-w-2xl">
              <p className="text-xs tracking-[0.3em] uppercase text-memento-terracotta font-semibold mb-4">
                Where travelers are heading
              </p>
              <h2 className="font-serif text-4xl sm:text-5xl text-memento-espresso leading-tight tracking-tight">
                Loved by Memento travelers
                <br />
                <em className="italic text-memento-coffee font-normal">
                  this season.
                </em>
              </h2>
            </div>
            <Link to="/explore" data-testid="landing-explore-link">
              <Button
                variant="ghost"
                className="text-memento-espresso hover:bg-white rounded-full px-5"
              >
                See all destinations
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {DESTINATIONS.slice(0, 8).map((d) => (
              <Link
                key={d.name}
                to="/chat"
                state={{ destination: `${d.name}, ${d.country}` }}
                data-testid={`landing-destination-${d.name.toLowerCase()}`}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-memento-espresso block"
              >
                <img
                  src={d.image}
                  alt={d.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-memento-espresso via-memento-espresso/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-serif text-2xl text-memento-cream tracking-tight">
                    {d.name}
                  </h3>
                  <p className="text-memento-cream/70 text-xs mt-1">
                    {d.country}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-4xl mx-auto px-6 lg:px-12 py-24 lg:py-32 text-center">
        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-memento-espresso leading-[1.05] tracking-tight mb-6">
          Your next trip is
          <br />
          <em className="italic font-medium text-memento-terracotta">
            already a memory.
          </em>
        </h2>
        <p className="text-memento-coffee text-lg max-w-xl mx-auto mb-10">
          No credit card. No sign-up wall. Just you, a place you've been
          dreaming of, and 78 seconds.
        </p>
        <Link to="/chat" data-testid="landing-final-cta">
          <Button className="bg-memento-espresso hover:bg-memento-coffee text-memento-cream rounded-full h-14 px-10 text-base font-medium">
            Start planning
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-memento-parchment py-10 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-sm text-memento-coffee">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-memento-espresso text-memento-cream flex items-center justify-center font-serif text-sm">
              M
            </div>
            <span className="font-serif text-lg text-memento-espresso">
              Memento
            </span>
            <span className="text-memento-coffee/70">
              · Plan trips you'll remember
            </span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-memento-terracotta">
              Privacy
            </a>
            <a href="#" className="hover:text-memento-terracotta">
              Terms
            </a>
            <a href="#" className="hover:text-memento-terracotta">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
