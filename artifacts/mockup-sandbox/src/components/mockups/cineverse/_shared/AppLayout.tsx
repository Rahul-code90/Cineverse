import { useState } from "react";
import { Search, Bell, User, Menu, X, Film, Ticket, Heart, ChevronDown } from "lucide-react";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-['Inter']" style={{ fontFamily: "'Inter', sans-serif" }}>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#e63946] to-[#ff6b6b] flex items-center justify-center">
                  <Film className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight">
                  Cine<span className="text-[#e63946]">Verse</span>
                </span>
              </div>
              <div className="hidden md:flex items-center gap-6 text-sm">
                <a href="#" className="text-white/70 hover:text-white transition-colors">Movies</a>
                <a href="#" className="text-white/70 hover:text-white transition-colors">Events</a>
                <a href="#" className="text-white/70 hover:text-white transition-colors">Sports</a>
                <a href="#" className="text-white/70 hover:text-white transition-colors flex items-center gap-1">
                  More <ChevronDown className="w-3 h-3" />
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5">
                <Search className="w-4 h-4 text-white/40" />
                <input
                  className="bg-transparent text-sm text-white placeholder-white/30 outline-none w-48"
                  placeholder="Search movies, events..."
                />
              </div>
              <button className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <Bell className="w-4 h-4 text-white/70" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#e63946] rounded-full" />
              </button>
              <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 text-sm transition-colors">
                <User className="w-4 h-4 text-white/70" />
                <span className="hidden sm:block text-white/80">Account</span>
              </button>
              <button
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-white/5"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="pt-16">{children}</div>
    </div>
  );
}
