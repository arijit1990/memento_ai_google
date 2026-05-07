import {
  Bed,
  Utensils,
  Coffee,
  Landmark,
  Train,
  Plane,
  Wine,
  Mountain,
  Footprints,
  Salad,
  MapPin,
  ExternalLink,
  Bookmark,
} from "lucide-react";
import { getBookingUrl, getBookingLabel } from "@/lib/booking";

const ICONS = {
  bed: Bed,
  utensils: Utensils,
  coffee: Coffee,
  landmark: Landmark,
  train: Train,
  plane: Plane,
  wine: Wine,
  mountain: Mountain,
  footprints: Footprints,
  salad: Salad,
};

const CATEGORY_COLORS = {
  Stay: "bg-memento-sand text-memento-espresso",
  Dining: "bg-[#FBE9DF] text-[#A84A33]",
  Culture: "bg-[#E8E1F2] text-[#5B4980]",
  Walk: "bg-memento-sage text-memento-sage-dark",
  Transit: "bg-[#E5DFD3] text-memento-coffee",
};

export const ActivityCard = ({ activity, dayIndex, activityIndex }) => {
  const Icon = ICONS[activity.icon] || MapPin;
  const colorClass =
    CATEGORY_COLORS[activity.category] || "bg-memento-sand text-memento-espresso";
  const bookingUrl = getBookingUrl(activity);
  const bookingLabel = getBookingLabel(activity);

  return (
    <div
      data-testid={`activity-card-${activity.id}`}
      className="group relative bg-white rounded-2xl border border-memento-parchment hover:border-memento-terracotta/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row gap-0 sm:gap-0">
        {/* Time column */}
        <div className="hidden sm:flex flex-col items-center justify-start pt-5 pb-5 px-5 w-24 shrink-0 border-r border-memento-parchment bg-memento-cream/40">
          <span className="font-serif text-2xl text-memento-espresso leading-none">
            {activity.time}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-memento-coffee mt-1">
            {activity.duration}
          </span>
        </div>

        {/* Image (only when provided) */}
        {activity.image && (
          <div className="relative w-full sm:w-40 h-40 sm:h-auto shrink-0 overflow-hidden bg-memento-sand">
            <img
              src={activity.image}
              alt={activity.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        )}

        {/* Body */}
        <div className="flex-1 p-5 flex flex-col">
          <div className="sm:hidden flex items-center gap-2 mb-2 text-xs text-memento-coffee">
            <span className="font-serif text-base text-memento-espresso">
              {activity.time}
            </span>
            <span>·</span>
            <span>{activity.duration}</span>
          </div>

          <div className="flex items-start justify-between gap-3 mb-2">
            <span
              className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${colorClass}`}
            >
              <Icon className="w-3 h-3" />
              {activity.category}
            </span>
            <button
              data-testid={`activity-bookmark-${activity.id}`}
              className="shrink-0 w-7 h-7 rounded-full hover:bg-memento-sand flex items-center justify-center text-memento-coffee hover:text-memento-terracotta transition-colors"
              aria-label="Save"
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>

          <h4 className="font-serif text-xl text-memento-espresso tracking-tight leading-snug mb-1">
            {activity.title}
          </h4>
          <p className="text-xs text-memento-coffee flex items-center gap-1.5 mb-2">
            <MapPin className="w-3 h-3" />
            {activity.location}
          </p>
          {activity.notes && (
            <p className="text-sm text-memento-coffee leading-relaxed mb-3 italic">
              "{activity.notes}"
            </p>
          )}

          <div className="flex items-center justify-between gap-3 mt-auto pt-3 border-t border-memento-parchment/60">
            <span className="text-sm font-semibold text-memento-espresso">
              {activity.cost}
            </span>
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`activity-book-${activity.id}`}
              className="text-xs font-semibold text-memento-terracotta hover:text-memento-terracotta-dark flex items-center gap-1"
            >
              {bookingLabel}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="absolute top-4 left-4 w-7 h-7 rounded-full bg-memento-espresso text-memento-cream flex items-center justify-center font-bold text-xs shadow-md border-2 border-white sm:hidden">
          {dayIndex + 1}.{activityIndex + 1}
        </div>
      </div>
    </div>
  );
};
