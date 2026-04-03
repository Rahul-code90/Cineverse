import { useState } from "react";
import { AppLayout } from "./_shared/AppLayout";
import { Ticket, Star, Download, QrCode, ChevronRight, Calendar, MapPin, Clock, Film, Music, Trophy, RefreshCw, X } from "lucide-react";

const BOOKINGS = [
  {
    id: "CV2026040301234",
    movie: "Dune: Part Three",
    type: "movie",
    poster: "bg-gradient-to-b from-amber-800 to-amber-950",
    date: "Apr 03, 2026",
    time: "01:30 PM",
    venue: "PVR ICON, Andheri West",
    seats: ["C4", "C5", "C6"],
    format: "IMAX",
    amount: 1485,
    status: "confirmed",
    rating: null,
  },
  {
    id: "CV2026031500987",
    movie: "Interstellar 2",
    type: "movie",
    poster: "bg-gradient-to-b from-blue-800 to-blue-950",
    date: "Mar 15, 2026",
    time: "06:45 PM",
    venue: "INOX Grand, Bandra",
    seats: ["F7", "F8"],
    format: "IMAX",
    amount: 990,
    status: "completed",
    rating: 5,
  },
  {
    id: "CV2026030800456",
    movie: "Coldplay World Tour",
    type: "event",
    poster: "bg-gradient-to-br from-cyan-800 to-blue-900",
    date: "Mar 08, 2026",
    time: "08:00 PM",
    venue: "DY Patil Stadium, Mumbai",
    seats: ["Block A, Row 3, 14–15"],
    format: "Concert",
    amount: 5998,
    status: "completed",
    rating: 5,
  },
  {
    id: "CV2026022200123",
    movie: "Spider-Man: Beyond",
    type: "movie",
    poster: "bg-gradient-to-b from-red-800 to-red-950",
    date: "Feb 22, 2026",
    time: "03:00 PM",
    venue: "Cinepolis, Goregaon",
    seats: ["D12", "D13"],
    format: "3D",
    amount: 770,
    status: "completed",
    rating: 4,
  },
  {
    id: "CV2026020500789",
    movie: "The Witcher Chronicles",
    type: "movie",
    poster: "bg-gradient-to-b from-purple-800 to-purple-950",
    date: "Feb 05, 2026",
    time: "10:30 AM",
    venue: "PVR ICON, Andheri West",
    seats: ["B4"],
    format: "2D",
    amount: 220,
    status: "cancelled",
    rating: null,
  },
];

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  confirmed: { color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30", label: "Confirmed" },
  completed: { color: "text-white/50", bg: "bg-white/5 border-white/10", label: "Completed" },
  cancelled: { color: "text-[#e63946]", bg: "bg-[#e63946]/10 border-[#e63946]/30", label: "Cancelled" },
};

const TYPE_ICON: Record<string, JSX.Element> = {
  movie: <Film className="w-3.5 h-3.5" />,
  event: <Music className="w-3.5 h-3.5" />,
  sports: <Trophy className="w-3.5 h-3.5" />,
};

export function BookingHistory() {
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>("CV2026040301234");

  const filters = [
    { key: "all", label: "All Bookings" },
    { key: "confirmed", label: "Upcoming" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
  ];

  const filtered = filter === "all" ? BOOKINGS : BOOKINGS.filter(b => b.status === filter);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">My Bookings</h1>
            <p className="text-white/40 text-sm">{BOOKINGS.length} bookings in 2026</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-xs text-white/30">Total Spent</div>
              <div className="text-xl font-bold">₹{BOOKINGS.filter(b => b.status !== "cancelled").reduce((s, b) => s + b.amount, 0).toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Bookings", value: BOOKINGS.length, icon: <Ticket className="w-4 h-4 text-[#e63946]" /> },
            { label: "Movies Watched", value: BOOKINGS.filter(b => b.type === "movie" && b.status === "completed").length, icon: <Film className="w-4 h-4 text-blue-400" /> },
            { label: "Events Attended", value: BOOKINGS.filter(b => b.type === "event" && b.status === "completed").length, icon: <Music className="w-4 h-4 text-purple-400" /> },
            { label: "CinePoints", value: "2,840", icon: <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> },
          ].map((stat, i) => (
            <div key={i} className="bg-[#12121e] border border-white/8 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                {stat.icon}
                <ChevronRight className="w-3.5 h-3.5 text-white/20" />
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-white/40 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f.key
                  ? "bg-[#e63946] text-white"
                  : "bg-white/5 border border-white/10 text-white/50 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Booking Cards */}
        <div className="space-y-4">
          {filtered.map(booking => {
            const status = STATUS_CONFIG[booking.status];
            const isExpanded = expandedId === booking.id;
            const isUpcoming = booking.status === "confirmed";

            return (
              <div
                key={booking.id}
                className={`bg-[#12121e] border rounded-2xl overflow-hidden transition-all ${
                  isExpanded ? "border-white/20" : "border-white/8"
                }`}
              >
                {/* Main Row */}
                <div
                  className="flex items-center gap-4 p-5 cursor-pointer hover:bg-white/2 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : booking.id)}
                >
                  {/* Poster */}
                  <div className={`w-14 h-18 rounded-xl ${booking.poster} border border-white/10 shrink-0 flex items-center justify-center`}
                    style={{ minHeight: '72px' }}>
                    <div className="text-white/30">{TYPE_ICON[booking.type]}</div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-sm truncate">{booking.movie}</h3>
                      <span className={`shrink-0 text-xs px-2 py-0.5 rounded-md border font-medium ${status.bg} ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/40">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{booking.date} • {booking.time}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{booking.venue}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-mono font-semibold text-white/60">
                        {booking.seats.join(", ")}
                      </span>
                      <span className="w-1 h-1 bg-white/20 rounded-full" />
                      <span className="text-xs bg-white/8 border border-white/10 rounded px-1.5 py-0.5">{booking.format}</span>
                    </div>
                  </div>

                  {/* Amount & chevron */}
                  <div className="text-right shrink-0">
                    <div className="font-bold">₹{booking.amount.toLocaleString()}</div>
                    <div className="text-xs text-white/30 mt-0.5">#{booking.id.slice(-6)}</div>
                    <ChevronRight className={`w-4 h-4 text-white/30 mt-2 ml-auto transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-white/8 p-5">
                    <div className="flex flex-wrap gap-3">
                      {isUpcoming && (
                        <>
                          <button className="flex items-center gap-2 bg-[#e63946]/10 border border-[#e63946]/30 text-[#e63946] rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#e63946]/20 transition-colors">
                            <QrCode className="w-4 h-4" />
                            Show QR Code
                          </button>
                          <button className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm hover:bg-white/10 transition-colors">
                            <Download className="w-4 h-4 text-white/50" />
                            Download Ticket
                          </button>
                          <button className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm hover:bg-white/10 transition-colors">
                            <RefreshCw className="w-4 h-4 text-white/50" />
                            Reschedule
                          </button>
                          <button className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-[#e63946]/70 hover:bg-[#e63946]/10 transition-colors ml-auto">
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        </>
                      )}
                      {booking.status === "completed" && (
                        <>
                          <button className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm hover:bg-white/10 transition-colors">
                            <Download className="w-4 h-4 text-white/50" />
                            Download Receipt
                          </button>
                          {!booking.rating && (
                            <button className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg px-4 py-2 text-sm font-medium hover:bg-amber-500/20 transition-colors">
                              <Star className="w-4 h-4" />
                              Rate this
                            </button>
                          )}
                          {booking.rating && (
                            <div className="flex items-center gap-1 px-3 py-2">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < booking.rating! ? "text-amber-400 fill-amber-400" : "text-white/20"}`} />
                              ))}
                              <span className="text-xs text-white/30 ml-1">Your rating</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
