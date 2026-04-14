import { useState } from "react";
import { Search, Bell, User, Menu, X, Film, ChevronDown, Ticket, BarChart3, LogOut, MapPin, Edit2, Lock, Loader2, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";
import { useApp } from "../contexts/AppContext";
import { api } from "../lib/api";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata"];

function ProfileModal({ onClose }: { onClose: () => void }) {
  const { user, setUser } = useApp();
  const [, navigate] = useLocation();
  const [name, setName] = useState(user?.name || "");
  const [city, setCity] = useState(user?.city || "Mumbai");
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError("");
    setLoading(true);
    try {
      const payload: any = {};
      if (name !== user.name) payload.name = name;
      if (city !== user.city) payload.city = city;
      if (newPwd) { payload.currentPassword = currentPwd; payload.newPassword = newPwd; }
      if (Object.keys(payload).length === 0) { setLoading(false); return; }
      const result = await api.auth.updateProfile(user.id, payload);
      setUser(result.user);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      setError(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    onClose();
    navigate("/login");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-end pt-20 pr-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#12121e] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 w-80 p-5" onClick={e => e.stopPropagation()}>
        {/* Avatar / Name */}
        <div className="flex items-center gap-3 mb-5 pb-5 border-b border-white/8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#e63946] to-violet-600 flex items-center justify-center text-lg font-black shrink-0">
            {user?.name?.[0] || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold truncate">{user?.name}</div>
            <div className="text-xs text-white/40 truncate">{user?.email}</div>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="w-2.5 h-2.5 text-[#e63946]" />
              <span className="text-xs text-white/40">{user?.city}</span>
              <span className="text-xs text-amber-400 ml-2">⭐ {user?.cinePoints?.toLocaleString()} pts</span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="block text-xs text-white/40 font-medium mb-1.5 flex items-center gap-1"><Edit2 className="w-3 h-3" /> Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-[#e63946]/50 rounded-xl px-3 py-2 text-sm outline-none text-white placeholder-white/20 transition-colors"
              placeholder="Your name" />
          </div>
          <div>
            <label className="block text-xs text-white/40 font-medium mb-1.5 flex items-center gap-1"><MapPin className="w-3 h-3" /> City</label>
            <select value={city} onChange={e => setCity(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none text-white cursor-pointer">
              {CITIES.map(c => <option key={c} className="bg-[#1a1a2e]">{c}</option>)}
            </select>
          </div>
          <div className="pt-1 border-t border-white/8">
            <p className="text-[11px] text-white/30 mb-2 flex items-center gap-1"><Lock className="w-3 h-3" /> Change Password (optional)</p>
            <input type="password" value={currentPwd} onChange={e => setCurrentPwd(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none text-white placeholder-white/20 mb-2 transition-colors"
              placeholder="Current password" />
            <input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none text-white placeholder-white/20 transition-colors"
              placeholder="New password" />
          </div>

          {error && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
          {success && (
            <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" /> Profile updated!
            </p>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-[#e63946] hover:bg-[#c1121f] disabled:opacity-60 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : "Save Changes"}
          </button>
        </form>

        <button onClick={handleLogout}
          className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/5 transition-colors">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );
}

export function Navbar({ searchQuery, onSearchChange }: NavbarProps) {
  const [location, navigate] = useLocation();
  const { user } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const navLinks = [
    { label: "Movies", href: "/" },
    { label: "Events", href: "/" },
    { label: "Sports", href: "/" },
  ];

  const isActive = (href: string) => location === href;

  const trimmedName = user?.name?.trim() || "";
  const nameParts = trimmedName.split(/\s+/);
  const displayName = trimmedName
    ? nameParts[0] + (nameParts.length > 1 ? " " + nameParts[nameParts.length - 1][0] + "." : "")
    : "Sign In";

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div
                className="flex items-center gap-2.5 cursor-pointer shrink-0"
                onClick={() => navigate("/")}
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#e63946] to-[#ff6b6b] flex items-center justify-center shadow-md shadow-red-500/20">
                  <Film className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight">
                  Cine<span className="text-[#e63946]">Verse</span>
                </span>
              </div>
              <div className="hidden md:flex items-center gap-1">
                {navLinks.map(link => (
                  <button
                    key={link.label}
                    onClick={() => navigate(link.href)}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive(link.href) && link.href !== "/"
                        ? "text-white bg-white/8"
                        : "text-white/55 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
                <div className="relative">
                  <button
                    onClick={() => setShowMore(!showMore)}
                    className="px-3 py-2 rounded-lg text-sm text-white/55 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    More <ChevronDown className={`w-3 h-3 transition-transform ${showMore ? "rotate-180" : ""}`} />
                  </button>
                  {showMore && (
                    <div className="absolute top-10 left-0 w-40 bg-[#12121e] border border-white/10 rounded-xl shadow-xl z-50 py-1">
                      <button onClick={() => { navigate("/bookings"); setShowMore(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                        <Ticket className="w-3.5 h-3.5" />
                        My Bookings
                      </button>
                      <button onClick={() => { navigate("/admin"); setShowMore(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                        <BarChart3 className="w-3.5 h-3.5" />
                        Admin
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/8 rounded-xl px-3 py-1.5 focus-within:border-white/20 transition-colors">
                <Search className="w-4 h-4 text-white/30 shrink-0" />
                <input
                  className="bg-transparent text-sm text-white placeholder-white/30 outline-none w-44"
                  placeholder="Search movies, events..."
                  value={searchQuery}
                  onChange={e => onSearchChange(e.target.value)}
                />
              </div>

              <div className="relative">
                <button
                  onClick={() => { setShowNotifications(!showNotifications); setShowMore(false); setShowProfile(false); }}
                  className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/8 hover:bg-white/10 transition-colors"
                >
                  <Bell className="w-4 h-4 text-white/60" />
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#e63946] rounded-full" />
                </button>
                {showNotifications && (
                  <div className="absolute right-0 top-11 w-72 bg-[#12121e] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 p-4 z-50">
                    <div className="text-sm font-semibold mb-3">Notifications</div>
                    <div className="space-y-1">
                      {[
                        { icon: "🎬", title: "New releases available!", sub: "Check out the latest movies now" },
                        { icon: "⭐", title: "Rate your last booking", sub: "How was your experience?" },
                        { icon: "🎁", title: "+100 CinePoints earned!", sub: "From your recent booking" },
                      ].map((n, i) => (
                        <div key={i} className="flex gap-3 p-2.5 hover:bg-white/5 rounded-xl cursor-pointer transition-colors">
                          <span className="text-lg mt-0.5">{n.icon}</span>
                          <div>
                            <div className="text-sm font-medium">{n.title}</div>
                            <div className="text-xs text-white/40 mt-0.5">{n.sub}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => navigate("/bookings")}
                className={`hidden sm:flex items-center gap-2 border rounded-xl px-3 py-1.5 text-sm transition-colors ${
                  location === "/bookings"
                    ? "bg-white/10 border-white/15 text-white"
                    : "bg-white/5 hover:bg-white/10 border-white/8 text-white/80"
                }`}
              >
                <Ticket className="w-4 h-4 text-white/60" />
                <span className="hidden sm:block font-medium">Bookings</span>
              </button>

              {user ? (
                <button
                  onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); setShowMore(false); }}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/8 rounded-xl px-3 py-1.5 text-sm transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#e63946] to-violet-600 flex items-center justify-center text-[10px] font-bold text-white">
                    {user.name?.[0] || <User className="w-3 h-3" />}
                  </div>
                  <span className="hidden sm:block text-white/80 font-medium">{displayName}</span>
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-2 bg-[#e63946] hover:bg-[#c1121f] rounded-xl px-3 py-1.5 text-sm font-semibold transition-colors"
                >
                  Sign In
                </button>
              )}

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
                  placeholder="Search movies, events..."
                  value={searchQuery}
                  onChange={e => onSearchChange(e.target.value)}
                />
              </div>
              {[
                { label: "Movies", path: "/" },
                { label: "Events", path: "/" },
                { label: "My Bookings", path: "/bookings" },
                { label: "Admin Dashboard", path: "/admin" },
                { label: user ? "My Profile" : "Sign In", path: user ? "#profile" : "/login" },
              ].map(item => (
                <button key={item.label} onClick={() => {
                  if (item.path === "#profile") { setShowProfile(true); }
                  else { navigate(item.path); }
                  setMenuOpen(false);
                }}
                  className="w-full text-left px-3 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </>
  );
}
