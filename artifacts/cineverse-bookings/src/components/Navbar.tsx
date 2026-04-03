import { useState } from "react";
import { Search, Bell, User, Menu, X, Film, ChevronDown } from "lucide-react";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function Navbar({ searchQuery, onSearchChange }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2.5 cursor-pointer">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#e63946] to-[#ff6b6b] flex items-center justify-center shadow-lg shadow-red-500/20">
                <Film className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Cine<span className="text-[#e63946]">Verse</span>
              </span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm">
              {["Movies", "Events", "Sports"].map(item => (
                <a key={item} href="#" className="text-white/50 hover:text-white transition-colors">{item}</a>
              ))}
              <a href="#" className="text-white/50 hover:text-white transition-colors flex items-center gap-1">
                More <ChevronDown className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/8 rounded-xl px-3 py-1.5 focus-within:border-white/20 transition-colors">
              <Search className="w-4 h-4 text-white/30 shrink-0" />
              <input
                className="bg-transparent text-sm text-white placeholder-white/30 outline-none w-44"
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/8 hover:bg-white/10 transition-colors"
              >
                <Bell className="w-4 h-4 text-white/60" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#e63946] rounded-full" />
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-11 w-72 bg-[#12121e] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 p-4 z-50">
                  <div className="text-sm font-semibold mb-3">Notifications</div>
                  <div className="space-y-3">
                    {[
                      { icon: "🎬", title: "Dune: Part Three tomorrow!", sub: "Your show is at 1:30 PM · PVR ICON" },
                      { icon: "⭐", title: "Rate Interstellar 2", sub: "How was your experience?" },
                      { icon: "🎁", title: "100 CinePoints earned!", sub: "From your Coldplay Concert booking" },
                    ].map((n, i) => (
                      <div key={i} className="flex gap-3 p-2 hover:bg-white/5 rounded-xl cursor-pointer transition-colors">
                        <span className="text-lg mt-0.5">{n.icon}</span>
                        <div>
                          <div className="text-sm font-medium">{n.title}</div>
                          <div className="text-xs text-white/40">{n.sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/8 rounded-xl px-3 py-1.5 text-sm transition-colors">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <User className="w-3 h-3 text-white" />
              </div>
              <span className="hidden sm:block text-white/80 font-medium">Aryan S.</span>
            </button>

            <button
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/8"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden py-3 border-t border-white/5 space-y-1">
            <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-xl px-3 py-2 mb-3">
              <Search className="w-4 h-4 text-white/30 shrink-0" />
              <input
                className="bg-transparent text-sm text-white placeholder-white/30 outline-none flex-1"
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
              />
            </div>
            {["Movies", "Events", "Sports", "More"].map(item => (
              <a key={item} href="#" className="block px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-colors">{item}</a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
