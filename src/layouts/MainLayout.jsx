import { useCallback } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import { BrandMark } from "../components/BrandMark.jsx";

function MainLayout() {
  const { user, signOut, isAdmin, isOwner } = useAuth();
  const navigate = useNavigate();
  const isHomePage = useLocation().pathname === "/";

  const handleLogout = useCallback(async () => {
    await signOut();
    navigate("/");
  }, [signOut, navigate]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className={`border-b backdrop-blur-sm ${isHomePage ? "border-[#242424] bg-[#090909]/95" : "border-[#292929] bg-[#090909]/95 shadow-lg shadow-black/20"}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Logo */}
          <Link to="/" aria-label="CineHub home" className="shrink-0">
            <BrandMark />
          </Link>

          {/* Navigation */}
          <nav className="flex max-w-[78%] flex-wrap items-center justify-end gap-x-4 gap-y-2 text-xs text-slate-300 sm:text-sm">

            <Link to="/" className={`transition hover:text-white ${isHomePage ? "text-white" : "hover:text-brand-300"}`}>
              Home
            </Link>

            <Link to="/movies" className="transition hover:text-brand-300">
              Movies
            </Link>

            {/* Customer bookings */}
            {user && (
              <Link
                to="/my-bookings"
                className="transition hover:text-brand-300"
              >
                My Bookings
              </Link>
            )}

            {/* Admin */}
            {isAdmin && (
              <Link to="/admin" className="transition hover:text-brand-300">
                Admin
              </Link>
            )}

            {/* Theatre Owner */}
            {isOwner && (
              <Link to="/theatres" className="transition hover:text-brand-300">
                Theatre Dashboard
              </Link>
            )}

            {user ? (
              <>
                {/* Profile */}
                <Link
                  to="/profile"
                  className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm text-slate-200 transition hover:text-white ${isHomePage ? "border-[#303030] bg-[#151515] hover:border-[#f12b3b]" : "border-[#303030] bg-[#151515] hover:border-brand-500"}`}
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${isHomePage ? "bg-[#f12b3b]/15 text-[#ff6571]" : "bg-brand-500/15 text-brand-200"}`}>
                    {String(
                      user?.name || user?.email || "U"
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <span className="max-w-[120px] truncate">
                    {user?.name || user?.email || "User"}
                  </span>
                </Link>

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className={`rounded-full px-4 py-2 text-slate-200 transition ${isHomePage ? "bg-[#202020] hover:bg-[#303030]" : "bg-slate-800 hover:bg-slate-700 hover:text-white"}`}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className={`rounded-full px-4 py-2 text-slate-200 transition ${isHomePage ? "bg-[#f12b3b] hover:bg-[#d91d2c]" : "bg-brand-500 text-white shadow-md shadow-brand-900/30 hover:bg-brand-600"}`}
              >
                Sign In
              </Link>
            )}

          </nav>
        </div>
      </header>

      <main className={`flex-1 ${isHomePage ? "bg-[#0a0a0a]" : "bg-[#080808] px-4 py-8 sm:px-6"}`}>
        <div className={isHomePage ? "w-full" : "mx-auto w-full max-w-7xl"}>
          <Outlet />
        </div>
      </main>

      <footer className="border-t border-[#242424] bg-[#090909]">
        <div className="py-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} CineHub. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;