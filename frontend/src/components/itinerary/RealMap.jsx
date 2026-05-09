import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Map as MapIcon } from "lucide-react";

// Fix default Leaflet icon path broken by webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const buildPins = (trip) => {
  const pins = [];
  (trip.days || []).forEach((d, di) => {
    (d.activities || []).forEach((a, ai) => {
      const lat = typeof a.lat === "number" ? a.lat : typeof a.latitude === "number" ? a.latitude : null;
      const lng = typeof a.lng === "number" ? a.lng : typeof a.longitude === "number" ? a.longitude : null;
      pins.push({
        id: a.id || `${di}-${ai}`,
        lat,
        lng,
        label: `${di + 1}`,
        title: a.title || "",
        location: a.location || "",
        hasCoords: lat !== null && lng !== null,
      });
    });
  });
  return pins;
};

async function nominatimGeocode(query) {
  if (!query) return null;
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
    const resp = await fetch(url, { headers: { "Accept-Language": "en" } });
    const data = await resp.json();
    if (data && data[0]) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch (_) {}
  return null;
}

function createDivIcon(label) {
  return L.divIcon({
    className: "",
    html: `<div style="width:28px;height:28px;border-radius:50%;background:#C85A40;color:white;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;font-family:Outfit,sans-serif;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);cursor:pointer">${label}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

export const RealMap = ({ trip }) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const boundsRef = useRef([]); // kept in sync so ResizeObserver can re-fit
  const [status, setStatus] = useState("loading"); // "loading" | "ready" | "error"

  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;

    const allPins = buildPins(trip);

    const initMap = async (centerLat, centerLng, zoom) => {
      if (cancelled || !containerRef.current) return;

      // Destroy previous instance
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      const map = L.map(containerRef.current, {
        center: [centerLat, centerLng],
        zoom,
        zoomControl: true,
        attributionControl: true,
      });
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      setStatus("ready");

      // Add pins that already have coordinates
      const bounds = [];
      const pinsWithCoords = allPins.filter((p) => p.hasCoords);
      pinsWithCoords.forEach((p) => {
        L.marker([p.lat, p.lng], { icon: createDivIcon(p.label) })
          .addTo(map)
          .bindPopup(`<div style="font-family:Outfit,sans-serif;font-size:12px;font-weight:600;color:#2D2823">${p.title}</div>`);
        bounds.push([p.lat, p.lng]);
      });

      if (bounds.length >= 2) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      }
      boundsRef.current = [...bounds];

      // Geocode activities that lack coordinates — add pins progressively
      const pinsWithout = allPins.filter((p) => !p.hasCoords);
      for (const p of pinsWithout) {
        if (cancelled) break;
        const query = [p.title, p.location, trip.destination].filter(Boolean).join(", ");
        const geo = await nominatimGeocode(query);
        if (cancelled) break;
        if (geo) {
          L.marker([geo.lat, geo.lng], { icon: createDivIcon(p.label) })
            .addTo(map)
            .bindPopup(`<div style="font-family:Outfit,sans-serif;font-size:12px;font-weight:600;color:#2D2823">${p.title}</div>`);
          bounds.push([geo.lat, geo.lng]);
          boundsRef.current = [...bounds];
          if (bounds.length >= 2 && pinsWithCoords.length === 0) {
            map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
          }
        }
        // Small delay to respect Nominatim's usage policy
        await new Promise((r) => setTimeout(r, 300));
      }
    };

    (async () => {
      let centerLat, centerLng, zoom;

      const cLat = typeof trip.centerLat === "number" ? trip.centerLat : parseFloat(trip.centerLat);
      const cLng = typeof trip.centerLng === "number" ? trip.centerLng : parseFloat(trip.centerLng);

      if (!isNaN(cLat) && !isNaN(cLng) && (cLat !== 0 || cLng !== 0)) {
        centerLat = cLat;
        centerLng = cLng;
        zoom = 12;
      } else if (allPins.some((p) => p.hasCoords)) {
        const first = allPins.find((p) => p.hasCoords);
        centerLat = first.lat;
        centerLng = first.lng;
        zoom = 12;
      } else {
        const geo = await nominatimGeocode(trip.destination || "");
        if (cancelled) return;
        if (geo) {
          centerLat = geo.lat;
          centerLng = geo.lng;
          zoom = 12;
        } else {
          centerLat = 20;
          centerLng = 0;
          zoom = 2;
        }
      }

      await initMap(centerLat, centerLng, zoom);
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [trip]);

  // Re-fit map whenever the container is resized (e.g. chat panel collapses/expands).
  // Debounced at 350ms so it fires once after the 300ms CSS transition completes.
  useEffect(() => {
    if (!containerRef.current) return;
    let timer = null;
    const observer = new ResizeObserver(() => {
      if (!mapRef.current) return;
      mapRef.current.invalidateSize();
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (!mapRef.current) return;
        mapRef.current.invalidateSize();
        if (boundsRef.current.length >= 2) {
          mapRef.current.fitBounds(boundsRef.current, { padding: [40, 40], maxZoom: 14 });
        } else if (boundsRef.current.length === 1) {
          mapRef.current.setView(boundsRef.current[0], mapRef.current.getZoom());
        }
      }, 350);
    });
    observer.observe(containerRef.current);
    return () => { observer.disconnect(); clearTimeout(timer); };
  }, []);

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden border border-memento-parchment bg-memento-sand"
      style={{ height: "320px" }}
      data-testid="real-map"
    >
      <div ref={containerRef} style={{ position: "absolute", inset: 0, zIndex: 0 }} />
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <p className="text-xs text-memento-coffee italic">Loading map…</p>
        </div>
      )}
      <div className="absolute bottom-3 left-3 z-10 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-memento-espresso flex items-center gap-1.5 shadow-sm pointer-events-none">
        <MapIcon className="w-3.5 h-3.5" />
        {trip.destination}
      </div>
    </div>
  );
};
