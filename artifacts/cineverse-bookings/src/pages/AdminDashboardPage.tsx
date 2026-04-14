import { useState } from "react";
import { Film, Ticket, TrendingUp, Users, DollarSign, Calendar, BarChart3, Settings, Plus, Search, ChevronDown, ArrowUp, ArrowDown, Eye, Edit, Activity, Star, Home, LogOut, Loader2, RefreshCw, Download, X, Trash2 } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { api } from "../lib/api";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<any>(null);
  const [newMovieData, setNewMovieData] = useState({ title: "", genre: "", runtime: "", posterUrl: "", backdropUrl: "", trailerUrl: "" });
  const [isExporting, setIsExporting] = useState(false);
  const queryClient = useQueryClient();

  const addMovieMutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingMovie) {
        return await api.admin.updateMovie(editingMovie.id, data);
      }
      return await api.admin.createMovie(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      setIsModalOpen(false);
      setEditingMovie(null);
      setNewMovieData({ title: "", genre: "", runtime: "", posterUrl: "", backdropUrl: "", trailerUrl: "" });
    },
    onError: (err: any) => {
      alert("Error: " + err.message);
    }
  });

  const deleteMovieMutation = useMutation({
    mutationFn: (id: number) => api.admin.deleteMovie(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    }
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => api.admin.stats(),
    refetchInterval: 30000, // refresh every 30s
  });

  const { data: mlRevenue } = useQuery({
    queryKey: ["ml-revenue"],
    queryFn: () => api.ml.revenue(),
  });

  const { data: mlDemand } = useQuery({
    queryKey: ["ml-demand"],
    queryFn: () => api.ml.demand(),
  });

  const stats = data?.stats;
  const recentBookings = data?.recentBookings || [];
  const events = data?.events || [];
  const movies = data?.movies || [];

  const filteredEvents = [...movies, ...events].filter(e =>
    (e as any).title?.toLowerCase().includes(searchEvent.toLowerCase()) ||
    (e as any).name?.toLowerCase().includes(searchEvent.toLowerCase()) ||
    (e as any).genre?.toLowerCase().includes(searchEvent.toLowerCase()) ||
    (e as any).category?.toLowerCase().includes(searchEvent.toLowerCase())
  );

  const STAT_CARDS = [
    {
      label: "Total Revenue",
      value: stats ? `₹${(stats.totalRevenue / 100000).toFixed(1)}L` : "—",
      change: "+22.5%", up: true,
      icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "Bookings Today",
      value: stats ? stats.bookingsToday.toLocaleString() : "—",
      change: "+18.3%", up: true,
      icon: Ticket, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20",
    },
    {
      label: "Total Users",
      value: stats ? stats.totalUsers.toLocaleString() : "—",
      change: "+12.1%", up: true,
      icon: Users, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20",
    },
    {
      label: "Avg. Rating",
      value: "4.7 / 5", change: "+0.2", up: true,
      icon: Star, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex">
      {/* Sidebar */}
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

      {/* Main */}
      <div className="flex-1 ml-56 overflow-auto">
        <div className="sticky top-0 bg-[#0a0a0f]/95 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h1 className="text-xl font-bold">{activeNav} Overview</h1>
            <p className="text-xs text-white/30">Live data from database · {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => refetch()} className="flex items-center gap-1.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl px-3 py-2 text-xs text-white/60 transition-colors">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
            <button 
              onClick={() => {
                setEditingMovie(null);
                setNewMovieData({ title: "", genre: "", runtime: "", posterUrl: "", backdropUrl: "", trailerUrl: "" });
                setIsModalOpen(true);
              }} 
              className="flex items-center gap-2 bg-[#e63946] hover:bg-[#c1121f] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Movie
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Stat Cards */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-[#e63946] animate-spin" />
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-white/40">
              <p className="mb-3">Failed to load stats from database.</p>
              <button onClick={() => refetch()} className="flex items-center gap-2 mx-auto px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm transition-colors">
                <RefreshCw className="w-4 h-4" /> Retry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              {STAT_CARDS.map((stat, i) => {
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
          )}

          {/* Charts Row */}
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
              <div className="h-48 mt-4">
                {mlRevenue?.data ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mlRevenue.data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#e63946" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#e63946" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="month" stroke="#ffffff50" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#ffffff50" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v/100000).toFixed(1)}L`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#12121e', borderColor: '#ffffff20', borderRadius: '12px' }}
                        itemStyle={{ color: '#e63946' }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#e63946" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white/30 text-xs">
                    <Loader2 className="w-5 h-5 animate-spin mb-2" />
                    Loading ML Forecast...
                  </div>
                )}
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
                  <div className="text-xl font-black">{mlDemand?.prediction?.expectedOccupancy || "—"}%</div>
                  <div className="text-[10px] text-white/30">est. occupancy</div>
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

          {/* Tables Row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {/* Active Events / Movies */}
            <div className="bg-[#12121e] border border-white/8 rounded-2xl">
              <div className="flex items-center justify-between p-5 border-b border-white/5">
                <h2 className="font-semibold">Active Movies & Events</h2>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
                  <Search className="w-3.5 h-3.5 text-white/30" />
                  <input
                    className="bg-transparent text-xs outline-none placeholder-white/20 w-24"
                    placeholder="Search…"
                    value={searchEvent}
                    onChange={e => setSearchEvent(e.target.value)}
                  />
                </div>
              </div>
              <div className="p-2">
                {filteredEvents.slice(0, 8).map((ev: any, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/3 transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/8 flex items-center justify-center shrink-0">
                      <Film className="w-4 h-4 text-white/30" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{ev.title || ev.name}</div>
                      <div className="text-xs text-white/30 mt-0.5">{ev.genre || ev.category}</div>
                    </div>
                    <div className="text-right shrink-0">
                      {ev.rating != null && (
                        <div className="text-sm font-bold text-amber-400">{ev.rating}/10</div>
                      )}
                      {ev.priceFrom != null && (
                        <div className="text-sm font-bold">₹{ev.priceFrom.toLocaleString()}</div>
                      )}
                      <div className="text-[10px] text-white/30">
                        {ev.isActive === 1 ? "live" : ev.availableTickets != null ? `${ev.availableTickets} left` : ""}
                      </div>
                    </div>
                    <div className="hidden group-hover:flex items-center gap-1 ml-1">
                      <button className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                        <Eye className="w-3.5 h-3.5 text-white/40" />
                      </button>
                      <button 
                        onClick={() => {
                          setEditingMovie(ev);
                          setNewMovieData({
                            title: ev.title || ev.name || "",
                            genre: ev.genre || ev.category || "",
                            runtime: ev.runtime || "",
                            posterUrl: ev.posterUrl || ev.imageUrl || "",
                            backdropUrl: ev.backdropUrl || "",
                            trailerUrl: ev.trailerUrl || "",
                          });
                          setIsModalOpen(true);
                        }}
                        className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5 text-white/40" />
                      </button>
                      {(ev as any).isActive !== undefined && (
                        <button 
                          onClick={() => deleteMovieMutation.mutate(ev.id)}
                          className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 transition-colors"
                        >
                          {deleteMovieMutation.isPending && deleteMovieMutation.variables === ev.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5 text-white/40" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-[#12121e] border border-white/8 rounded-2xl">
              <div className="flex items-center justify-between p-5 border-b border-white/5">
                <h2 className="font-semibold">Recent Bookings</h2>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={async () => {
                      try {
                        setIsExporting(true);
                        const blob = await api.admin.exportBookings();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "bookings_export.csv";
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                      } catch (err) {
                        alert("Export failed");
                      } finally {
                        setIsExporting(false);
                      }
                    }}
                    disabled={isExporting}
                    className="flex items-center gap-1.5 bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 rounded-xl px-3 py-1.5 text-xs text-white/60 transition-colors"
                  >
                    {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />} 
                    Export CSV
                  </button>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-xs text-white/30">Live feed</span>
                  </div>
                </div>
              </div>
              <div className="p-2">
                {recentBookings.length === 0 ? (
                  <p className="text-center text-xs text-white/25 py-8">No bookings yet. Seed the database to populate data.</p>
                ) : (
                  recentBookings.slice(0, 8).map((bk, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/3 transition-colors">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#e63946]/30 to-purple-600/30 border border-white/8 flex items-center justify-center text-xs font-bold shrink-0">
                        {bk.movieTitle?.[0] || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{bk.movieTitle}</div>
                        <div className="text-xs text-white/30 mt-0.5 truncate">
                          Ref: {bk.bookingRef} · {Array.isArray(bk.seats) ? bk.seats.length : 1} seat(s)
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold">₹{bk.totalAmount?.toLocaleString()}</div>
                        <div className={`text-[10px] mt-0.5 font-medium ${
                          bk.status === "confirmed" ? "text-emerald-400" :
                          bk.status === "cancelled" ? "text-[#e63946]" :
                          "text-white/40"
                        }`}>{bk.status}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Movie Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#12121e] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-lg font-bold">{editingMovie ? "Edit Content" : "Add New Content"}</h2>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingMovie(null);
                }} 
                className="text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">Movie Title</label>
                <input 
                  type="text" 
                  value={newMovieData.title}
                  onChange={e => setNewMovieData({...newMovieData, title: e.target.value})}
                  className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#e63946]/50 focus:ring-1 focus:ring-[#e63946]/50 transition-all placeholder-white/20"
                  placeholder="e.g. Inception 2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">Genre</label>
                  <input 
                    type="text" 
                    value={newMovieData.genre}
                    onChange={e => setNewMovieData({...newMovieData, genre: e.target.value})}
                    className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#e63946]/50 transition-all placeholder-white/20"
                    placeholder="e.g. Sci-Fi"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">Runtime</label>
                  <input 
                    type="text" 
                    value={newMovieData.runtime}
                    onChange={e => setNewMovieData({...newMovieData, runtime: e.target.value})}
                    className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#e63946]/50 transition-all placeholder-white/20"
                    placeholder="e.g. 2h 10m"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">Poster URL <span className="text-white/20 text-[10px]">(Optional)</span></label>
                <input 
                  type="text" 
                  value={newMovieData.posterUrl}
                  onChange={e => setNewMovieData({...newMovieData, posterUrl: e.target.value})}
                  className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#e63946]/50 focus:ring-1 focus:ring-[#e63946]/50 transition-all placeholder-white/20"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">Backdrop Banner URL <span className="text-white/20 text-[10px]">(Optional)</span></label>
                <input 
                  type="text" 
                  value={newMovieData.backdropUrl}
                  onChange={e => setNewMovieData({...newMovieData, backdropUrl: e.target.value})}
                  className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#e63946]/50 focus:ring-1 focus:ring-[#e63946]/50 transition-all placeholder-white/20"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">YouTube Trailer URL <span className="text-white/20 text-[10px]">(Optional)</span></label>
                <input 
                  type="text" 
                  value={newMovieData.trailerUrl}
                  onChange={e => setNewMovieData({...newMovieData, trailerUrl: e.target.value})}
                  className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#e63946]/50 focus:ring-1 focus:ring-[#e63946]/50 transition-all placeholder-white/20"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addMovieMutation.mutate(newMovieData);
                }}
                disabled={!newMovieData.title || !newMovieData.genre || !newMovieData.runtime || addMovieMutation.isPending}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-[#e63946] hover:bg-[#c1121f] disabled:opacity-50 disabled:hover:bg-[#e63946] text-white text-sm font-bold px-4 py-3 rounded-xl transition-colors cursor-pointer relative z-50"
              >
                {addMovieMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : editingMovie ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {editingMovie ? "Update Content" : "Publish Live"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
