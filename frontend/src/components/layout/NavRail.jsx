import { NavLink, useLocation } from "react-router-dom";
import {
  Compass,
  MessageCircle,
  MapPinned,
  Bookmark,
  Settings as SettingsIcon,
  Home,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

const NAV = [
  { to: "/", icon: Home, label: "Home", testid: "nav-home" },
  { to: "/chat", icon: MessageCircle, label: "Plan", testid: "nav-chat" },
  { to: "/trips", icon: MapPinned, label: "Trips", testid: "nav-trips" },
  { to: "/explore", icon: Compass, label: "Explore", testid: "nav-explore" },
  { to: "/saved", icon: Bookmark, label: "Saved", testid: "nav-saved" },
  { to: "/settings", icon: SettingsIcon, label: "Settings", testid: "nav-settings" },
];

const initials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || "?";
  return ((parts[0][0] || "") + (parts[parts.length - 1][0] || "")).toUpperCase();
};

export const NavRail = () => {
  const location = useLocation();
  const { user, signOut, signIn } = useAuth();

  if (location.pathname.startsWith("/auth")) return null;

  return (
    <>
      <aside
        className="hidden lg:flex fixed left-0 top-0 h-screen w-20 flex-col items-center py-8 bg-white border-r border-memento-parchment gap-2 z-40"
        data-testid="nav-rail-desktop"
      >
        <NavLink to="/" className="mb-6 flex flex-col items-center" data-testid="nav-logo">
          <div className="w-10 h-10 rounded-full bg-memento-espresso text-memento-cream flex items-center justify-center font-serif text-lg">
            M
          </div>
        </NavLink>

        {NAV.map(({ to, icon: Icon, label, testid }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            data-testid={testid}
            className={({ isActive }) =>
              `group relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                isActive
                  ? "bg-memento-terracotta text-white shadow-[0_8px_15px_rgba(200,90,64,0.25)]"
                  : "text-memento-coffee hover:bg-memento-sand hover:text-memento-espresso"
              }`
            }
          >
            <Icon className="w-5 h-5" strokeWidth={1.6} />
            <span className="absolute left-14 px-2.5 py-1 rounded-md bg-memento-espresso text-memento-cream text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none translate-x-[-4px] group-hover:translate-x-0">
              {label}
            </span>
          </NavLink>
        ))}

        <div className="mt-auto flex flex-col items-center gap-2">
          {user ? (
            <>
              <button
                onClick={signOut}
                data-testid="nav-logout"
                className="group relative w-10 h-10 rounded-full bg-memento-sand hover:bg-memento-parchment text-memento-espresso flex items-center justify-center transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="absolute left-12 px-2.5 py-1 rounded-md bg-memento-espresso text-memento-cream text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Sign out
                </span>
              </button>
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  data-testid="nav-user-avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div
                  data-testid="nav-user-avatar"
                  className="w-10 h-10 rounded-full bg-memento-terracotta text-white flex items-center justify-center text-xs font-semibold"
                >
                  {initials(user.name)}
                </div>
              )}
            </>
          ) : (
            <button
              onClick={signIn}
              data-testid="nav-login"
              className="w-10 h-10 rounded-full bg-memento-sand hover:bg-memento-parchment text-memento-espresso flex items-center justify-center text-xs font-semibold transition-colors"
              title="Sign in"
            >
              IN
            </button>
          )}
        </div>
      </aside>

      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-memento-parchment flex items-center justify-around z-40 px-2"
        data-testid="nav-rail-mobile"
      >
        {NAV.slice(0, 5).map(({ to, icon: Icon, label, testid }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            data-testid={`${testid}-mobile`}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors ${
                isActive ? "text-memento-terracotta" : "text-memento-coffee"
              }`
            }
          >
            <Icon className="w-5 h-5" strokeWidth={1.6} />
            <span className="text-[10px] font-medium tracking-wide">{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
};
