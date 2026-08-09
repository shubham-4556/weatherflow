import { useState, useEffect } from "react";
import { CloudSun, Search, MapPin, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Returns a Tailwind gradient class based on the real time of day,
// so the accent strip under the navbar always reads as "right now."
function getSkyGradient() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 8) return "from-orange-300 via-pink-300 to-sky-400"; // dawn
  if (hour >= 8 && hour < 17) return "from-sky-400 via-sky-300 to-sky-200"; // day
  if (hour >= 17 && hour < 20) return "from-indigo-500 via-orange-400 to-pink-400"; // dusk
  return "from-slate-900 via-indigo-950 to-slate-900"; // night
}

const NAV_LINKS = [
  { label: "Today", href: "#today" },
  { label: "7-Day", href: "#forecast" },
  { label: "Maps", href: "#maps" },
  { label: "Alerts", href: "#alerts" },
];

export default function WeatherNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [skyGradient, setSkyGradient] = useState(getSkyGradient());

  // Re-check every 10 minutes so the strip drifts across dawn/day/dusk/night
  // without a page refresh.
  useEffect(() => {
    const id = setInterval(() => setSkyGradient(getSkyGradient()), 10 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full">
      <nav className="flex items-center justify-between gap-4 bg-slate-950 px-4 py-3 sm:px-6">
        {/* Brand */}
        <a href="#" className="flex items-center gap-2 shrink-0">
          <CloudSun className="h-6 w-6 text-sky-300" strokeWidth={2} />
          <span className="text-lg font-semibold tracking-tight text-white">
            Weatherflow
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Location search (desktop) */}
        <div className="hidden md:flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1.5 w-56">
          <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search city..."
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 outline-none"
          />
        </div>

        <div className="hidden md:flex items-center gap-2 shrink-0">
          <Button variant="secondary" size="sm">
            Sign in
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-slate-200"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Signature accent: a thin strip that mirrors the current sky */}
      <div className={`h-[3px] w-full bg-gradient-to-r ${skyGradient}`} />

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-1 bg-slate-950 px-4 pb-4">
          <div className="flex items-center gap-2 rounded-full bg-slate-900 px-3 py-2 my-2">
            <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search city..."
              className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 outline-none"
            />
          </div>
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-md px-2 py-2 text-sm font-medium text-slate-300 hover:bg-slate-900 hover:text-white"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Button variant="secondary" size="sm" className="mt-2 w-full">
            Sign in
          </Button>
        </div>
      )}
    </header>
  );
}