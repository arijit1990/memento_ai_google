import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Map as MapIcon } from "lucide-react";

const TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
if (TOKEN) {
  mapboxgl.accessToken = TOKEN;
}

// Build pins from trip; if activity lacks lat/lng, skip
const buildPins = (trip) => {
  const pins = [];
  (trip.days || []).forEach((d, di) => {
    (d.activities || []).forEach((a, ai) => {
      const lat = a.lat ?? a.latitude;
      const lng = a.lng ?? a.longitude;
      if (typeof lat === "number" && typeof lng === "number") {
        pins.push({
          id: a.id || `${di}-${ai}`,
          lat,
          lng,
          label: `${di + 1}`,
          title: a.title,
        });
      }
    });
  });
  return pins;
};

export const RealMap = ({ trip }) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!TOKEN || !containerRef.current) return;
    const pins = buildPins(trip);
    if (pins.length === 0 && !trip.centerLat) return;

    const center = [
      trip.centerLng ?? pins[0]?.lng ?? 2.3522,
      trip.centerLat ?? pins[0]?.lat ?? 48.8566,
    ];

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center,
      zoom: 11.5,
      attributionControl: false,
    });
    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
    map.addControl(new mapboxgl.AttributionControl({ compact: true }));

    const bounds = new mapboxgl.LngLatBounds();
    pins.forEach((p) => {
      const el = document.createElement("div");
      el.className =
        "memento-marker w-7 h-7 rounded-full bg-[#C85A40] text-white flex items-center justify-center text-xs font-bold shadow-md border-2 border-white cursor-pointer";
      el.style.fontFamily = "Outfit, sans-serif";
      el.textContent = p.label;
      const popup = new mapboxgl.Popup({ offset: 18, closeButton: false }).setHTML(
        `<div style="font-family:Outfit,sans-serif;font-size:12px;color:#2D2823;padding:2px 4px;">
           <div style="font-weight:600;">${p.title || ""}</div>
         </div>`
      );
      new mapboxgl.Marker({ element: el })
        .setLngLat([p.lng, p.lat])
        .setPopup(popup)
        .addTo(map);
      bounds.extend([p.lng, p.lat]);
    });

    if (pins.length >= 2) {
      map.fitBounds(bounds, { padding: 60, maxZoom: 13.5, duration: 0 });
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [trip]);

  if (!TOKEN) {
    return (
      <div
        className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden border border-memento-parchment bg-memento-sand flex items-center justify-center"
        data-testid="map-no-token"
      >
        <p className="text-sm text-memento-coffee italic">
          Map unavailable — set REACT_APP_MAPBOX_TOKEN
        </p>
      </div>
    );
  }

  return (
    <div
      className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden border border-memento-parchment bg-memento-sand"
      data-testid="real-map"
    >
      <div ref={containerRef} className="absolute inset-0" />
      <div className="absolute bottom-3 left-3 z-10 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-memento-espresso flex items-center gap-1.5 shadow-sm pointer-events-none">
        <MapIcon className="w-3.5 h-3.5" />
        {trip.destination}
      </div>
    </div>
  );
};
