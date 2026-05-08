import { useState, useEffect } from "react";
import { Sparkles, Check, Clock, DollarSign } from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = (tripId) => `memento_hacks_${tripId}`;

export const SmartHacksStrip = ({ hacks, tripId }) => {
  const [applied, setApplied] = useState(() => {
    if (!tripId) return new Set();
    try {
      const stored = localStorage.getItem(STORAGE_KEY(tripId));
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Persist applied hacks to localStorage whenever they change
  useEffect(() => {
    if (!tripId) return;
    try {
      localStorage.setItem(STORAGE_KEY(tripId), JSON.stringify([...applied]));
    } catch {
      /* storage may be blocked in private browsing */
    }
  }, [applied, tripId]);

  const apply = (h) => {
    if (applied.has(h.id)) return;
    setApplied(new Set([...applied, h.id]));
    toast.success(`Applied: ${h.title}`, { description: h.saves });
  };

  return (
    <div className="bg-memento-sage rounded-3xl p-6 border border-[#C6D8CB]" data-testid="smart-hacks-strip">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-memento-sage-dark" />
        <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-memento-sage-dark">
          Smart hacks
        </h3>
        <span className="text-xs text-memento-sage-dark/70 ml-1">
          · {hacks.length} suggested
        </span>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {hacks.map((h) => {
          const on = applied.has(h.id);
          const Icon = h.type === "money" ? DollarSign : Clock;
          return (
            <button
              key={h.id}
              onClick={() => apply(h)}
              data-testid={`smart-hack-${h.id}`}
              className={`group text-left p-4 rounded-2xl border transition-all ${
                on
                  ? "bg-memento-sage-dark text-memento-cream border-memento-sage-dark"
                  : "bg-white/70 border-[#C6D8CB] hover:border-memento-sage-dark hover:bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center ${
                      on
                        ? "bg-memento-cream/15 text-memento-cream"
                        : "bg-memento-sage-dark/10 text-memento-sage-dark"
                    }`}
                  >
                    {on ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                  </div>
                  <p
                    className={`font-semibold text-sm ${
                      on ? "text-memento-cream" : "text-memento-espresso"
                    }`}
                  >
                    {h.title}
                  </p>
                </div>
                <span
                  className={`text-[10px] uppercase tracking-wider font-bold whitespace-nowrap ${
                    on ? "text-memento-cream/70" : "text-memento-sage-dark"
                  }`}
                >
                  {h.saves}
                </span>
              </div>
              <p
                className={`text-xs leading-relaxed ${
                  on ? "text-memento-cream/80" : "text-memento-coffee"
                }`}
              >
                {h.detail}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
