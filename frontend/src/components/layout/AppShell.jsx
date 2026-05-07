import { Outlet, useLocation } from "react-router-dom";
import { NavRail } from "./NavRail";

export const AppShell = () => {
  const location = useLocation();
  const isAuth = location.pathname.startsWith("/auth");
  const isChat = location.pathname.startsWith("/chat");

  return (
    <div className="min-h-screen bg-memento-cream">
      <NavRail />
      <main
        className={`${
          isAuth ? "" : "lg:pl-20 pb-16 lg:pb-0"
        } ${isChat ? "h-screen overflow-hidden" : ""}`}
      >
        <Outlet />
      </main>
    </div>
  );
};
