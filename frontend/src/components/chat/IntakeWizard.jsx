import { useState } from "react";
import { ArrowRight, ArrowLeft, Calendar, Users, Wallet, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TRAVELER_TYPES, TRIP_TYPES } from "@/lib/mockData";

const STEPS = [
  { key: "destination", title: "Where to?", subtitle: "A city, a country, or just a vibe." },
  { key: "dates", title: "When?", subtitle: "Approximate is fine." },
  { key: "group", title: "Who's coming?", subtitle: "We'll tune the pace." },
  { key: "travelerType", title: "How do you travel?", subtitle: "Pick all that feel right." },
  { key: "tripType", title: "What kind of trip?", subtitle: "Just one." },
  { key: "budget", title: "Budget range?", subtitle: "Per person, total." },
];

export const IntakeWizard = ({ onComplete, onSwitchToChat }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    destination: "Paris, France",
    dates: "Apr 12 – 16, 2026",
    group: "2 adults",
    travelerType: ["Culture Seeker", "Food Lover"],
    tripType: "City Break",
    budget: "$2,500 – $3,500",
  });

  const current = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else onComplete(data);
  };
  const back = () => step > 0 && setStep(step - 1);

  const toggleMulti = (val) => {
    const arr = data.travelerType.includes(val)
      ? data.travelerType.filter((v) => v !== val)
      : [...data.travelerType, val];
    setData({ ...data, travelerType: arr });
  };

  return (
    <div className="flex flex-col h-full" data-testid="intake-wizard">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-memento-parchment">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs tracking-[0.2em] uppercase text-memento-coffee font-semibold">
            Step {step + 1} of {STEPS.length}
          </p>
          <button
            onClick={onSwitchToChat}
            data-testid="switch-to-chat"
            className="text-xs font-medium text-memento-terracotta hover:text-memento-terracotta-dark"
          >
            Prefer to chat? →
          </button>
        </div>
        <div className="h-1 bg-memento-sand rounded-full overflow-hidden">
          <div
            className="h-full bg-memento-terracotta transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-8 scrollbar-thin">
        <div className="max-w-md mx-auto animate-float-up" key={step}>
          <h2 className="font-serif text-3xl sm:text-4xl text-memento-espresso tracking-tight mb-2">
            {current.title}
          </h2>
          <p className="text-memento-coffee mb-8">{current.subtitle}</p>

          {/* DESTINATION */}
          {current.key === "destination" && (
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-memento-coffee" />
              <Input
                data-testid="wizard-destination-input"
                value={data.destination}
                onChange={(e) =>
                  setData({ ...data, destination: e.target.value })
                }
                placeholder="e.g., Paris, Tokyo, Bali..."
                className="pl-11 h-14 rounded-2xl border-memento-parchment bg-white text-base"
              />
            </div>
          )}

          {/* DATES */}
          {current.key === "dates" && (
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-memento-coffee" />
              <Input
                data-testid="wizard-dates-input"
                value={data.dates}
                onChange={(e) => setData({ ...data, dates: e.target.value })}
                placeholder="Apr 12 – 16, 2026"
                className="pl-11 h-14 rounded-2xl border-memento-parchment bg-white text-base"
              />
              <div className="grid grid-cols-3 gap-2 mt-4">
                {["Weekend", "Long weekend", "1 week", "2 weeks", "3+ weeks", "Flexible"].map((d) => (
                  <button
                    key={d}
                    data-testid={`wizard-dates-chip-${d.toLowerCase().replace(/\s/g, "-")}`}
                    onClick={() => setData({ ...data, dates: d })}
                    className={`px-4 py-2.5 rounded-full text-sm border transition-colors ${
                      data.dates === d
                        ? "bg-memento-espresso text-memento-cream border-memento-espresso"
                        : "bg-white border-memento-parchment text-memento-espresso hover:border-memento-terracotta"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* GROUP */}
          {current.key === "group" && (
            <div className="grid grid-cols-2 gap-3">
              {[
                "Solo",
                "Couple",
                "2 adults",
                "Family with kids",
                "Friends (3-5)",
                "Friends (6+)",
              ].map((g) => (
                <button
                  key={g}
                  data-testid={`wizard-group-${g.toLowerCase().replace(/[^a-z]/g, "-")}`}
                  onClick={() => setData({ ...data, group: g })}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    data.group === g
                      ? "bg-memento-espresso text-memento-cream border-memento-espresso"
                      : "bg-white border-memento-parchment text-memento-espresso hover:border-memento-terracotta"
                  }`}
                >
                  <Users className="w-4 h-4 mb-2 opacity-70" />
                  <div className="font-medium">{g}</div>
                </button>
              ))}
            </div>
          )}

          {/* TRAVELER TYPE */}
          {current.key === "travelerType" && (
            <div className="flex flex-wrap gap-2">
              {TRAVELER_TYPES.map((t) => {
                const on = data.travelerType.includes(t);
                return (
                  <button
                    key={t}
                    data-testid={`wizard-traveler-${t.toLowerCase().replace(/\s/g, "-")}`}
                    onClick={() => toggleMulti(t)}
                    className={`px-5 py-2.5 rounded-full text-sm border transition-all ${
                      on
                        ? "bg-memento-terracotta text-white border-memento-terracotta"
                        : "bg-white border-memento-parchment text-memento-espresso hover:border-memento-terracotta"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          )}

          {/* TRIP TYPE */}
          {current.key === "tripType" && (
            <div className="grid grid-cols-2 gap-2">
              {TRIP_TYPES.map((t) => (
                <button
                  key={t}
                  data-testid={`wizard-triptype-${t.toLowerCase().replace(/[^a-z]/g, "-")}`}
                  onClick={() => setData({ ...data, tripType: t })}
                  className={`px-4 py-3 rounded-2xl text-sm border text-left transition-all ${
                    data.tripType === t
                      ? "bg-memento-espresso text-memento-cream border-memento-espresso"
                      : "bg-white border-memento-parchment text-memento-espresso hover:border-memento-terracotta"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          {/* BUDGET */}
          {current.key === "budget" && (
            <div className="space-y-3">
              <div className="relative">
                <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-memento-coffee" />
                <Input
                  data-testid="wizard-budget-input"
                  value={data.budget}
                  onChange={(e) => setData({ ...data, budget: e.target.value })}
                  placeholder="$2,500 – $3,500"
                  className="pl-11 h-14 rounded-2xl border-memento-parchment bg-white text-base"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Under $1k",
                  "$1k – $2.5k",
                  "$2.5k – $5k",
                  "$5k – $10k",
                  "$10k+",
                  "No limit",
                ].map((b) => (
                  <button
                    key={b}
                    data-testid={`wizard-budget-${b.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                    onClick={() => setData({ ...data, budget: b })}
                    className={`px-4 py-3 rounded-2xl text-sm border transition-all ${
                      data.budget === b
                        ? "bg-memento-espresso text-memento-cream border-memento-espresso"
                        : "bg-white border-memento-parchment text-memento-espresso hover:border-memento-terracotta"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-memento-parchment p-4 flex items-center justify-between bg-white">
        <Button
          variant="ghost"
          onClick={back}
          disabled={step === 0}
          data-testid="wizard-back"
          className="rounded-full text-memento-coffee hover:bg-memento-sand disabled:opacity-30"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={next}
          data-testid="wizard-next"
          className="bg-memento-terracotta hover:bg-memento-terracotta-dark text-white rounded-full px-7 h-11"
        >
          {step === STEPS.length - 1 ? "Generate itinerary" : "Continue"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
