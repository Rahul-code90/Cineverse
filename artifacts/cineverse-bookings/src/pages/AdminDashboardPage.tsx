import { useState } from "react";
import { Film, Ticket, TrendingUp, Users, DollarSign, Calendar, BarChart3, Settings, Plus, Search, ChevronDown, ArrowUp, ArrowDown, Eye, Edit, Activity, Star, Home, LogOut } from "lucide-react";
import { useLocation } from "wouter";

const STATS = [
  { label: "Total Revenue", value: "₹48.2L", change: "+22.5%", up: true, icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  { label: "Bookings Today", value: "1,842", change: "+18.3%", up: true, icon: Ticket, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  { label: "Active Users", value: "32,480", change: "+12.1%", up: true, icon: Users, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
  { label: "Avg. Rating", value: "4.7 / 5", change: "+0.2", up: true, icon: Star, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
];

const RECENT_BOOKINGS = [
  { id: "CV2026040301234", user: "Rahul Kumar", movie: "Dune: Part Three", seats: 3, amount: 1485, status: "confirmed", time: "2 min ago" },
  { id: "CV2026040301233", user: "Priya Sharma", movie: "Interstellar 2", seats: 2, amount: 990, status: "confirmed", time: "5 min ago" },
  { id: "CV2026040301230", user: "Amit Tiwari", movie: "Spider-Man: Beyond", seats: 4, amount: 1540, status: "pending", time: "8 min ago" },
  { id: "CV2026040301228", user: "Neha Singh", movie: "Coldplay Tour", seats: 2, amount: 5998, status: "confirmed", time: "12 min ago" },
  { id: "CV2026040301225", user: "Arjun Mehta", movie: "Oppenheimer 2", seats: 1, amount: 450, status: "cancelled", time: "15 min ago" },
];

const EVENTS = [
  { title: "Dune: Part Three", genre: "Sci-Fi", bookings: 4820, revenue: "₹24.1L", occupancy: 92, status: "live" },
  { title: "Interstellar 2", genre: "Sci-Fi", bookings: 3240, revenue: "₹18.5L", occupancy: 78, status: "live" },
  { title: "Coldplay World Tour", genre: "Concert", bookings: 2800, revenue: "₹84L", occupancy: 95, status: "live" },
  { title: "Spider-Man: Beyond", genre: "Action", bookings: 5100, revenue: "₹28.7L", occupancy: 85, status: "live" },
  { title: "IPL Final 2026", genre: "Sports", bookings: 45000, revenue: "₹4.5Cr", occupancy: 99, status: "upcoming" },
];

const REVENUE_DATA = [38, 52, 61, 45, 72, 88, 65, 91, 78, 95, 83, 100];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const SIDEBAR_ITEMS = [
  { icon: BarChart3, label: "Analytics" },
  { icon: Film, label: "Events" },
  { icon: Ticket, label: "Bookings" },
  { icon: Users, label: "Users" },
  { icon: Calendar, label: "Schedule" },
  { icon: Settings, label: "Settings" },
];

export function AdminDashboardPage() {
  const [, navigate] = useLocation();
  const [activeNav, setActiveNav] = useState("Analytics");
  const [searchEvent, setSearchEvent] = useState("");

  const filteredEvents = EVENTS.filter(e =>
    e.title.toLowerCase().includes(searchEvent.toLowerCase()) ||
    e.genre.toLowerCase().includes(searchEvent.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex">
      <div className="w-56 bg-[#0d0d1a] border-r border-white/5 flex flex-col shrink-0 fixed inset-y-0 left-0 z-40">
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#e63946] to-[#ff6b6b] flex items-center justify-center">
              <Film className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-base font-bold">Cine<span className="text-[#e63946]">Verse</span></span>
          </div>
          <div className="text-[10px] text-white/25 mt-0.5 ml-9">Admin Dashboard</div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white hover:bg-white/5 transition-all"
          >
            <Home className="w-4 h-4" />
            Back to Site
          </button>
          <div className="h-px bg-white/5 my-2" />
          {SIDEBAR_ITEMS.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => setActiveNav(item.label)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeNav === item.label
                    ? "bg-[#e63946]/15 text-[#e63946] border border-[#e63946]/25"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e63946] to-purple-600 flex items-center justify-center text-xs font-bold shrink-0">A</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">Admin</div>
              <div className="text-xs text-white/30 truncate">admin@cineverse.com</div>
            </div>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-white/30 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      </div>

      <div className="flex-1 ml-56 overflow-auto">
        <div className="sticky top-0 bg-[#0a0a0f]/95 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h1 className="text-xl font-bold">{activeNav} Overview</h1>
            <p className="text-xs text-white/30">Apr 03, 2026 · Updated 2 min ago</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm">
              <Calendar className="w-3.5 h-3.5 text-white/40" />
              <span className="text-white/60">Last 30 days</span>
              <ChevronDown className="w-3.5 h-3.5 text-white/30" />
            </div>
            <button className="flex items-center gap-2 bg-[#e63946] hover:bg-[#c1121f] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
              <Plus className="w-4 h-4" />
              Add Event
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className={`bg-[#12121e] border rounded-2xl p-5 ${stat.bg}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-white/40 font-medium uppercase tracking-wide">{stat.label}</span>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.bg}`}>
                      <Icon className={`w-4.5 h-4.5 ${stat.color}`} size={18} />
                    </div>
                  </div>
                  <div className="text-2xl font-black mb-2">{stat.value}</div>
                  <div className={`flex items-center gap-1 text-xs font-medium ${stat.up ? "text-emerald-400" : "text-[#e63946]"}`}>
                    {stat.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {stat.change} vs last month
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <div className="xl:col-span-2 bg-[#12121e] border border-white/8 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-semibold">Revenue Trend</h2>
                  <p className="text-xs text-white/30 mt-0.5">Monthly revenue in Lakhs (₹)</p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-1.5">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-emerald-400">+22.5%</span>
                </div>
              </div>
              <div className="flex items-end gap-2 h-40">
                {REVENUE_DATA.map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                    <div
                      className={`w-full rounded-t-lg transition-all cursor-pointer ${
                        i === 3 || i === 4
                          ? "bg-[#e63946] shadow-lg shadow-[#e63946]/20"
                          : "bg-white/10 group-hover:bg-white/20"
                      }`}
                      style={{ height: `${val}%` }}
                    />
                    <span className="text-[9px] text-white/25">{MONTHS[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#12121e] border border-white/8 rounded-2xl p-5">
              <h2 className="font-semibold mb-1">Booking Mix</h2>
              <p className="text-xs text-white/30 mb-5">By category</p>
              <div className="relative w-32 h-32 mx-auto mb-5">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e1e2e" strokeWidth="3.5" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e63946" strokeWidth="3.5" strokeDasharray="55 45" strokeDashoffset="0" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#3b82f6" strokeWidth="3.5" strokeDasharray="25 75" strokeDashoffset="-55" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#a855f7" strokeWidth="3.5" strokeDasharray="12 88" strokeDashoffset="-80" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f59e0b" strokeWidth="3.5" strokeDasharray="8 92" strokeDashoffset="-92" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-xl font-black">9.2K</div>
                  <div className="text-[10px] text-white/30">today</div>
                </div>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: "Movies", pct: 55, color: "bg-[#e63946]" },
                  { label: "Concerts", pct: 25, color: "bg-blue-500" },
                  { label: "Sports", pct: 12, color: "bg-purple-500" },
                  { label: "Other", pct: 8, color: "bg-amber-500" },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-sm ${item.color} shrink-0`} />
                    <span className="text-xs text-white/60 flex-1">{item.label}</span>
                    <div className="flex-1 h-1 bg-white/5 rounded-full">
                      <div className={`h-1 rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                    </div>
                    <span className="text-xs font-semibold w-8 text-right">{item.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <div className="bg-[#12121e] border border-white/8 rounded-2xl">
              <div className="flex items-center justify-between p-5 border-b border-white/5">
                <h2 className="font-semibold">Active Events</h2>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
                  <Search className="w-3.5 h-3.5 text-white/30" />
                  <input
                    className="bg-transparent text-xs outline-none placeholder-white/20 w-24"
                    placeholder="Search events"
                    value={searchEvent}
                    onChange={e => setSearchEvent(e.target.value)}
                  />
                </div>
              </div>
              <div className="p-2">
                {filteredEvents.map((ev, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/3 transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/8 flex items-center justify-center shrink-0">
                      <Film className="w-4 h-4 text-white/30" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{ev.title}</div>
                      <div className="text-xs text-white/30 mt-0.5">{ev.genre} · {ev.bookings.toLocaleString()} bookings</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold">{ev.revenue}</div>
                      <div className="text-[10px] mt-0.5">
                        <span className={ev.occupancy >= 90 ? "text-[#e63946] font-semibold" : "text-white/30"}>{ev.occupancy}%</span>
                        <span className="text-white/30"> full</span>
                      </div>
                    </div>
                    <div className="hidden group-hover:flex items-center gap-1 ml-1">
                      <button className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                        <Eye className="w-3.5 h-3.5 text-white/40" />
                      </button>
                      <button className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                        <Edit className="w-3.5 h-3.5 text-white/40" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#12121e] border border-white/8 rounded-2xl">
              <div className="flex items-center justify-between p-5 border-b border-white/5">
                <h2 className="font-semibold">Recent Bookings</h2>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-xs text-white/30">Live feed</span>
                </div>
              </div>
              <div className="p-2">
                {RECENT_BOOKINGS.map((bk, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/3 transition-colors">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#e63946]/30 to-purple-600/30 border border-white/8 flex items-center justify-center text-xs font-bold shrink-0">
                      {bk.user[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{bk.user}</div>
                      <div className="text-xs text-white/30 mt-0.5 truncate">{bk.movie} · {bk.seats} seat{bk.seats > 1 ? "s" : ""}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold">₹{bk.amount.toLocaleString()}</div>
                      <div className={`text-[10px] mt-0.5 font-medium ${
                        bk.status === "confirmed" ? "text-emerald-400" :
                        bk.status === "pending" ? "text-amber-400" :
                        "text-[#e63946]"
                      }`}>{bk.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
