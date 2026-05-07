import { useState } from "react";
import { Plane, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { ChatThread } from "@/components/chat/ChatThread";
import { IntakeWizard } from "@/components/chat/IntakeWizard";
import { ItineraryPanel } from "@/components/itinerary/ItineraryPanel";
import { PARIS_TRIP, SAMPLE_CHAT } from "@/lib/mockData";
import { Button } from "@/components/ui/button";

const Chat = () => {
  const [mode, setMode] = useState("chat"); // 'chat' | 'wizard'
  const [messages, setMessages] = useState(SAMPLE_CHAT);
  const [showConfirm, setShowConfirm] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [hasItinerary, setHasItinerary] = useState(false);
  const [confirmSummary, setConfirmSummary] = useState([]);

  const handleSend = (text) => {
    const userMsg = { id: `m-${Date.now()}`, role: "user", content: text };
    setMessages((m) => [...m, userMsg]);

    // Mock AI replies
    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply;

      if (lower.includes("paris") || messages.length <= 1) {
        reply = {
          id: `m-${Date.now() + 1}`,
          role: "ai",
          content:
            "Paris in spring — gorgeous choice. Are you traveling solo, as a couple, or with a group? And roughly when?",
        };
      } else if (lower.includes("couple") || lower.includes("2") || lower.includes("two")) {
        reply = {
          id: `m-${Date.now() + 1}`,
          role: "ai",
          content:
            "A couple's trip — perfect. What's the vibe you're after? Romantic and slow? Culture-heavy? Foodie? Pick anything that resonates.",
        };
      } else if (
        lower.includes("food") ||
        lower.includes("culture") ||
        lower.includes("art")
      ) {
        reply = {
          id: `m-${Date.now() + 1}`,
          role: "ai",
          content:
            "Got it — culture and food it is. One more: what's a comfortable budget for the two of you, all in?",
        };
        // Trigger confirm card after a short delay
        setTimeout(() => {
          setConfirmSummary([
            { label: "Destination", value: "Paris, France" },
            { label: "When", value: "Apr 12 – 16, 2026 · 5 days" },
            { label: "Group", value: "2 adults" },
            { label: "Vibe", value: "Culture Seeker · Food Lover" },
            { label: "Trip type", value: "City Break — romantic pacing" },
            { label: "Budget", value: "$2,500 – $3,500" },
          ]);
          setShowConfirm(true);
        }, 800);
      } else {
        reply = {
          id: `m-${Date.now() + 1}`,
          role: "ai",
          content:
            "Lovely. Tell me a bit more — when are you thinking, and who's coming along?",
        };
      }
      setMessages((m) => [...m, reply]);
    }, 700);
  };

  const handleWizardComplete = (data) => {
    setMode("chat");
    const summary = [
      { label: "Destination", value: data.destination },
      { label: "When", value: data.dates },
      { label: "Group", value: data.group },
      { label: "Vibe", value: data.travelerType.join(" · ") },
      { label: "Trip type", value: data.tripType },
      { label: "Budget", value: data.budget },
    ];
    setConfirmSummary(summary);
    setMessages([
      ...SAMPLE_CHAT,
      {
        id: `m-${Date.now()}`,
        role: "ai",
        content:
          "Perfect — I have everything I need. Let me read this back to make sure I've got it right.",
      },
    ]);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    setGenerating(true);
    setMessages((m) => [
      ...m,
      {
        id: `m-${Date.now()}`,
        role: "user",
        content: "Yes, generate it.",
      },
    ]);

    setTimeout(() => {
      setGenerating(false);
      setHasItinerary(true);
      setMessages((m) => [
        ...m,
        {
          id: `m-${Date.now() + 1}`,
          role: "ai",
          content:
            "Done — your Paris itinerary is on the right. I've layered in 4 smart hacks that should save you about 2 hours and $258. Take a look and tell me what to tweak.",
        },
      ]);
      toast.success("Itinerary ready", {
        description: "Paris in Spring — 5 days handcrafted",
      });
    }, 2400);
  };

  const handleSaveTrip = () => {
    toast.message("Sign in to save", {
      description: "Create a free account to keep your Paris trip.",
    });
  };

  return (
    <div
      className="flex h-screen w-full bg-memento-cream overflow-hidden"
      data-testid="chat-page"
    >
      {/* Left: Chat / Wizard */}
      <div className="w-full md:w-[45%] lg:w-[42%] xl:w-[40%] h-full flex flex-col border-r border-memento-parchment bg-white relative">
        {/* Mobile back link */}
        <div className="md:hidden border-b border-memento-parchment px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-memento-espresso text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-serif">Memento</span>
          </Link>
          {hasItinerary && (
            <Link to="/itinerary/trip-paris-001" className="text-xs font-medium text-memento-terracotta">
              View itinerary →
            </Link>
          )}
        </div>

        {mode === "wizard" ? (
          <IntakeWizard
            onComplete={handleWizardComplete}
            onSwitchToChat={() => setMode("chat")}
          />
        ) : (
          <ChatThread
            messages={messages}
            onSend={handleSend}
            onConfirm={handleConfirm}
            generating={generating}
            onSwitchToWizard={() => setMode("wizard")}
            showConfirmCard={showConfirm}
            confirmSummary={confirmSummary}
          />
        )}
      </div>

      {/* Right: Itinerary preview */}
      <div className="hidden md:flex md:w-[55%] lg:w-[58%] xl:w-[60%] h-full bg-memento-cream flex-col" data-testid="itinerary-side-panel">
        {hasItinerary ? (
          <ItineraryPanel
            trip={PARIS_TRIP}
            compact
            onSave={handleSaveTrip}
          />
        ) : (
          <EmptyItineraryState />
        )}
      </div>
    </div>
  );
};

const EmptyItineraryState = () => (
  <div className="flex-1 flex items-center justify-center p-12">
    <div className="max-w-md text-center">
      <div className="w-20 h-20 rounded-full bg-memento-sand flex items-center justify-center mx-auto mb-6">
        <Plane className="w-8 h-8 text-memento-terracotta" strokeWidth={1.5} />
      </div>
      <p className="text-xs tracking-[0.3em] uppercase text-memento-terracotta font-semibold mb-3">
        Your itinerary
      </p>
      <h2 className="font-serif text-3xl text-memento-espresso tracking-tight mb-3">
        Tell Memento where you're going.
      </h2>
      <p className="text-memento-coffee leading-relaxed mb-6">
        Once we have a few details, your handcrafted day-by-day itinerary will
        appear here — maps, smart hacks, and all.
      </p>
      <div className="bg-white rounded-2xl p-5 border border-memento-parchment text-left">
        <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-memento-coffee mb-2">
          Try saying
        </p>
        <p className="text-memento-espresso font-serif italic">
          "Paris with my partner for 5 days, mid-April. We love art and good
          food."
        </p>
      </div>
    </div>
  </div>
);

export default Chat;
