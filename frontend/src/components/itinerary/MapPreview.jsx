import { Map } from "lucide-react";

// CSS-only stylized map preview with mock pins
export const MapPreview = ({ trip }) => {
  // Distribute pins pseudo-randomly across an aesthetic plane
  const pins = trip.days.flatMap((d, di) =>
    d.activities.slice(0, 2).map((a, ai) => ({
      id: a.id,
      x: 12 + ((di * 37 + ai * 23) % 76),
      y: 18 + ((di * 19 + ai * 41) % 64),
      label: `${di + 1}`,
    }))
  );

  return (
    <div
      className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden border border-memento-parchment bg-memento-sand"
      data-testid="map-preview"
    >
      {/* Pseudo-map background — abstract topology */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#EFE6D5] via-[#E5DFD3] to-[#D9CFB8]">
        <svg
          viewBox="0 0 400 225"
          className="w-full h-full opacity-40"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Rivers / roads */}
          <path
            d="M0,140 Q80,120 160,150 T320,130 T400,160"
            stroke="#A8A096"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M0,80 Q120,90 200,70 T400,90"
            stroke="#A8A096"
            strokeWidth="0.6"
            fill="none"
          />
          <path
            d="M120,0 L130,225"
            stroke="#A8A096"
            strokeWidth="0.4"
            fill="none"
          />
          <path
            d="M260,0 Q270,80 250,225"
            stroke="#A8A096"
            strokeWidth="0.4"
            fill="none"
          />
          {/* Park */}
          <ellipse cx="180" cy="115" rx="35" ry="22" fill="#D8E0C6" opacity="0.6" />
          <text x="167" y="118" fontSize="6" fill="#5C5449" fontFamily="Outfit">
            Tuileries
          </text>
          {/* River label */}
          <text x="180" y="158" fontSize="6" fill="#7A6F5B" fontStyle="italic">
            La Seine
          </text>
        </svg>
      </div>

      {/* Pins */}
      {pins.map((p) => (
        <div
          key={p.id}
          className="absolute -translate-x-1/2 -translate-y-full"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
        >
          <div className="w-7 h-7 rounded-full bg-memento-terracotta text-white flex items-center justify-center text-xs font-bold shadow-md border-2 border-white">
            {p.label}
          </div>
          <div className="w-1 h-1 rounded-full bg-memento-terracotta mx-auto mt-0.5" />
        </div>
      ))}

      {/* Caption */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-memento-espresso flex items-center gap-1.5 shadow-sm">
          <Map className="w-3.5 h-3.5" />
          {trip.destination}
        </div>
        <button
          data-testid="map-expand"
          className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-memento-terracotta hover:bg-white shadow-sm"
        >
          Open map →
        </button>
      </div>
    </div>
  );
};
