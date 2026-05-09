import { useState, useEffect, useRef } from "react";
import { Plane, ArrowLeft, MessageCircle, Map, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";

import { ChatThread } from "@/components/chat/ChatThread";
import { IntakeWizard } from "@/components/chat/IntakeWizard";
import { ItineraryPanel } from "@/components/itinerary/ItineraryPanel";
import { SAMPLE_CHAT } from "@/lib/mockData";
import { api, getGuestSessionId } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { cleanDestination } from "@/lib/intake";
import { streamGenerate } from "@/lib/stream";

const THINKING_PHRASES = [
  "Listening...",
  "Got it...",
  "Pulling this together...",
  "One sec...",
  "Mulling it over...",
  "Tracking that down...",
];

const Chat = () => {
  const { user } = useAuth();
  const location = useLocation();
  const locState = location.state || {};

  const [mode, setMode] = useState(locState.destination ? "wizard" : "chat");
  const [messages, setMessages] = useState(SAMPLE_CHAT);
  const [showConfirm, setShowConfirm] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [trip, setTrip] = useState(null);
  const [confirmSummary, setConfirmSummary] = useState([]);
  const [intake, setIntake] = useState(
    locState.destination || locState.tripType || locState.group
      ? {
          destination: locState.destination || "",
          dates: locState.dates || "",
          group: locState.group || "2 adults",
          travelerType: locState.travelerType || [],
          tripType: locState.tripType || "City Break",
          budget: "",
        }
      : {}
  );
  const [chatCollapsed, setChatCollapsed] = useState(false);
  const [editing, setEditing] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [thinkingLabel, setThinkingLabel] = useState(THINKING_PHRASES[0]);
  const [progressMessage, setProgressMessage] = useState("Handcrafting your itinerary...");
  const [mobileView, setMobileView] = useState("chat"); // 'chat' | 'itinerary' (mobile only)
  const thinkingIdx = useRef(0);

  useEffect(() => {
    if (!user) getGuestSessionId();
  }, [user]);

  // When opened from /itinerary/:id via "Edit with AI", load the existing trip
  useEffect(() => {
    if (!locState.tripId || trip) return;
    api.get(`/trips/${locState.tripId}`, {
      params: user ? {} : { guest_session_id: getGuestSessionId() },
    })
      .then(r => {
        setTrip(r.data);
        setMobileView("itinerary");
      })
      .catch(() => {});
  }, [locState.tripId]); // eslint-disable-line react-hooks/exhaustive-deps

  const buildSummary = (data) => [
    { label: "Destination", value: data.destination || "—" },
    { label: "When", value: data.dates || "Flexible" },
    { label: "Group", value: data.group || "2 adults" },
    { label: "Vibe", value: (data.travelerType || []).join(" · ") || "Explorer" },
    { label: "Trip type", value: data.tripType || "City Break" },
    { label: "Budget", value: data.budget || "Flexible" },
  ];

  const handleSend = async (text) => {
    const userMsg = { id: `m-${Date.now()}`, role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);

    // If we already have a trip, treat the message as an EDIT request
    if (trip) {
      handleEdit(text);
      return;
    }

    // LLM-driven intake extraction (gemini-2.5-flash, ~$0.0001/call)
    // Cycle thinking copy to keep it warm/varied
    thinkingIdx.current = (thinkingIdx.current + 1) % THINKING_PHRASES.length;
    setThinkingLabel(THINKING_PHRASES[thinkingIdx.current]);
    setThinking(true);
    try {
      const r = await api.post("/chat/intake", {
        messages: newMessages.map(({ role, content }) => ({ role, content })),
        current_intake: intake,
      });
      const { intake: newIntake, next_question, complete } = r.data;
      setIntake(newIntake);

      if (next_question) {
        setMessages((m) => [
          ...m,
          {
            id: `m-${Date.now() + 1}`,
            role: "ai",
            content: next_question,
          },
        ]);
      }
      if (complete) {
        setTimeout(() => {
          setConfirmSummary(buildSummary(newIntake));
          setShowConfirm(true);
        }, 400);
      }
    } catch (e) {
      const msg =
        e?.response?.data?.detail ||
        e?.message ||
        "Could not reach the backend";
      console.error("[intake] API call failed:", e);
      setMessages((m) => [
        ...m,
        {
          id: `m-${Date.now() + 1}`,
          role: "ai",
          content: `Hmm, I hit a snag — ${msg}. Could you try again?`,
        },
      ]);
    } finally {
      setThinking(false);
    }
  };

  const handleEdit = async (message) => {
    setEditing(true);
    setMessages((m) => [
      ...m,
      {
        id: `m-${Date.now()}`,
        role: "ai",
        content: "Working on it — rewriting your itinerary now...",
      },
    ]);
    try {
      const r = await api.post(
        `/trips/${trip.id}/edit`,
        { message },
        { params: user ? {} : { guest_session_id: getGuestSessionId() } },
      );
      setTrip(r.data.trip);
      setMessages((m) => [
        ...m,
        {
          id: `m-${Date.now() + 1}`,
          role: "ai",
          content: "Done — your itinerary is updated. Take a look on the right.",
        },
      ]);
      toast.success("Itinerary updated");
      setMobileView("itinerary");
    } catch (e) {
      const msg = e?.response?.data?.detail || e?.message || "Edit failed";
      toast.error("Couldn't apply that edit", { description: msg });
      setMessages((m) => [
        ...m,
        {
          id: `m-${Date.now() + 2}`,
          role: "ai",
          content: `I hit a snag — ${msg}. Want to try rephrasing?`,
        },
      ]);
    } finally {
      setEditing(false);
    }
  };

  const handleWizardComplete = (data) => {
    // Apply destination cleanup so confirm card looks tidy even when user types verbosely
    const cleaned = { ...data, destination: cleanDestination(data.destination) };
    setMode("chat");
    setIntake(cleaned);
    setConfirmSummary(buildSummary(cleaned));
    setMessages([
      ...SAMPLE_CHAT,
      {
        id: `m-${Date.now()}`,
        role: "ai",
        content: "Perfect — I have everything I need. Let me read this back to make sure I've got it right.",
      },
    ]);
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    setGenerating(true);
    setProgressMessage("Handcrafting your itinerary...");
    setMessages((m) => [
      ...m,
      { id: `m-${Date.now()}`, role: "user", content: "Yes, generate it." },
    ]);

    const payload = {
      intake: {
        destination: intake?.destination || "Paris, France",
        dates: intake?.dates || "Flexible",
        group: intake?.group || "2 adults",
        travelerType:
          (intake?.travelerType && intake.travelerType.length > 0)
            ? intake.travelerType
            : ["Explorer"],
        tripType: intake?.tripType || "City Break",
        budget: intake?.budget || "Flexible",
      },
      guest_session_id: user ? null : getGuestSessionId(),
    };

    try {
      let generated = null;
      let errorDetail = null;
      for await (const evt of streamGenerate(payload)) {
        if (evt.type === "status" && evt.message) {
          setProgressMessage(evt.message);
        } else if (evt.type === "done" && evt.trip) {
          generated = evt.trip;
        } else if (evt.type === "error") {
          errorDetail = evt.detail || "Generation failed";
        }
      }
      if (errorDetail) throw new Error(errorDetail);
      if (!generated) throw new Error("No trip received");

      setTrip(generated);
      setChatCollapsed(true);
      setMobileView("itinerary");
      setMessages((m) => [
        ...m,
        {
          id: `m-${Date.now() + 1}`,
          role: "ai",
          content: `Done — your ${generated.destination} itinerary is on the right. I've layered in ${generated.smartHacks?.length || 0} smart hacks. Tell me what to tweak — anything from "make day 3 less touristy" to "add a romantic dinner".`,
        },
      ]);
      toast.success("Itinerary ready", {
        description: `${generated.title} — ${generated.duration} handcrafted`,
      });
    } catch (e) {
      const msg = e?.message || "Generation failed";
      toast.error("Couldn't generate the trip", { description: msg });
      setMessages((m) => [
        ...m,
        {
          id: `m-${Date.now() + 2}`,
          role: "ai",
          content: `I hit a snag generating that — ${msg}. Want to try again?`,
        },
      ]);
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveTrip = () => {
    if (user) {
      toast.success("Saved to your trips");
    } else {
      toast.message("Sign in to keep this trip", {
        description: "Free — your draft will be moved to your account.",
      });
    }
  };

  const showItineraryMobile = mobileView === "itinerary" && trip;

  return (
    <div
      className="flex h-screen w-full bg-memento-cream overflow-hidden"
      data-testid="chat-page"
    >
      {/* ── Left: Chat panel (collapses to 48 px rail after itinerary generates) ── */}
      <div
        className={`h-full flex flex-col border-r border-memento-parchment bg-white relative overflow-hidden transition-[width] duration-300 ease-in-out
          ${chatCollapsed
            ? "hidden md:flex md:w-12 cursor-pointer hover:bg-memento-sand/40"
            : showItineraryMobile
              ? "hidden md:flex md:w-[45%] lg:w-[42%] xl:w-[40%]"
              : "flex w-full md:w-[45%] lg:w-[42%] xl:w-[40%]"
          }`}
        onClick={chatCollapsed ? () => setChatCollapsed(false) : undefined}
        title={chatCollapsed ? "Expand chat" : undefined}
        role={chatCollapsed ? "button" : undefined}
        aria-label={chatCollapsed ? "Expand chat panel" : undefined}
      >
        {chatCollapsed ? (
          /* Collapsed rail — click anywhere to expand */
          <div className="flex-1 flex flex-col items-center pt-6 gap-4 select-none">
            <div className="w-8 h-8 rounded-full bg-memento-sand flex items-center justify-center">
              <ChevronRight className="w-4 h-4 text-memento-terracotta" strokeWidth={2.5} />
            </div>
            <div style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
              <span className="text-[9px] uppercase tracking-[0.2em] text-memento-coffee font-semibold">
                Chat
              </span>
            </div>
            <MessageCircle className="w-4 h-4 text-memento-parchment mt-2" />
          </div>
        ) : (
          <>
            <div className="md:hidden border-b border-memento-parchment px-4 py-3 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2 text-memento-espresso text-sm">
                <ArrowLeft className="w-4 h-4" />
                <span className="font-serif">Memento</span>
              </Link>
              {trip && (
                <button
                  onClick={() => setMobileView("itinerary")}
                  data-testid="mobile-show-itinerary"
                  className="text-xs font-medium text-memento-terracotta flex items-center gap-1"
                >
                  <Map className="w-3.5 h-3.5" />
                  View itinerary
                </button>
              )}
            </div>

            {mode === "wizard" ? (
              <IntakeWizard
                onComplete={handleWizardComplete}
                onSwitchToChat={() => setMode("chat")}
                initialDestination={locState.destination || ""}
              />
            ) : (
              <ChatThread
                messages={messages}
                onSend={handleSend}
                onConfirm={handleConfirm}
                generating={generating || editing || thinking}
                generatingLabel={
                  editing
                    ? "Rewriting your itinerary..."
                    : generating
                    ? progressMessage
                    : thinkingLabel
                }
                showProgressBullets={generating}
                onSwitchToWizard={() => setMode("wizard")}
                showConfirmCard={showConfirm}
                confirmSummary={confirmSummary}
                placeholder={
                  trip
                    ? "Make day 3 less touristy. Or add a romantic dinner..."
                    : "Tell me where you're going — 'Paris with my partner for a week, food and art'..."
                }
              />
            )}
          </>
        )}
      </div>

      {/* ── Right: Itinerary panel (expands to fill space when chat is collapsed) ── */}
      <div
        className={`h-full bg-memento-cream flex-col transition-all duration-300 ease-in-out
          ${chatCollapsed
            ? "flex flex-1"
            : showItineraryMobile
              ? "flex w-full"
              : "hidden md:flex md:w-[55%] lg:w-[58%] xl:w-[60%]"
          }`}
        data-testid="itinerary-side-panel"
      >
        {showItineraryMobile && (
          <div className="md:hidden border-b border-memento-parchment px-4 py-3 flex items-center justify-between bg-white">
            <button
              onClick={() => setMobileView("chat")}
              data-testid="mobile-show-chat"
              className="flex items-center gap-2 text-memento-espresso text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to chat
            </button>
            <span className="text-xs uppercase tracking-[0.15em] text-memento-coffee font-semibold flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              Edit by message
            </span>
          </div>
        )}
        {trip ? (
          <ItineraryPanel
            trip={trip}
            compact
            onSave={handleSaveTrip}
            onEdit={() => setChatCollapsed(false)}
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
        Once we have a few details, your handcrafted day-by-day itinerary will appear here — maps, smart hacks, and all.
      </p>
      <div className="bg-white rounded-2xl p-5 border border-memento-parchment text-left">
        <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-memento-coffee mb-2">
          Try saying
        </p>
        <p className="text-memento-espresso font-serif italic">
          "Paris with my partner for 5 days, mid-April. We love art and good food."
        </p>
      </div>
    </div>
  </div>
);

export default Chat;
