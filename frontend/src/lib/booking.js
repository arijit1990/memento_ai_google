// Booking deep-link helpers — generic search URLs (no affiliate IDs for MVP)

const enc = (s) => encodeURIComponent(s || "");

export const getBookingUrl = (activity) => {
  const cat = activity?.category || "";
  const name = activity?.title || "";
  const loc = activity?.location || "";
  const q = `${name} ${loc}`.trim();

  switch (cat) {
    case "Stay":
      return `https://www.google.com/travel/hotels/search?q=${enc(q)}`;
    case "Dining":
      return `https://www.google.com/maps/search/${enc(q + " restaurant")}`;
    case "Culture":
      return `https://www.google.com/search?q=${enc(q + " tickets")}`;
    case "Walk":
    case "Transit":
      return `https://www.google.com/maps/search/${enc(q)}`;
    default:
      return `https://www.google.com/search?q=${enc(q)}`;
  }
};

export const getBookingLabel = (activity) => {
  switch (activity?.category) {
    case "Stay":
      return "Book stay";
    case "Dining":
      return "Reserve";
    case "Culture":
      return "Tickets";
    case "Transit":
      return "Directions";
    case "Walk":
      return "Map";
    default:
      return "Open";
  }
};
