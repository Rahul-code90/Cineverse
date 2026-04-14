import { useState, useMemo } from "react";
import { Ticket, Star, Film, Music, Trophy, ChevronRight, Sparkles, TrendingUp, Loader2, RefreshCw } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type Booking as ApiBooking } from "../lib/api";
import { useApp } from "../contexts/AppContext";

interface BookingHistoryPageProps {
  searchQuery: string;
}

type FilterKey = "all" | "confirmed" | "completed" | "cancelled";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All Bookings" },
  { key: "confirmed", label: "Upcoming" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

// ---- QR Modal -----------------------------------------------------------
function QRModal({ booking, onClose }: { booking: ApiBooking; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#12121e] border border-white/10 rounded-2xl p-6 max-w-xs w-full" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold mb-1">{booking.movieTitle}</h3>
        <p className="text-xs text-white/40 mb-4">{booking.venue} · {booking.date}</p>
        <div className="bg-white p-4 rounded-xl mb-4 flex items-center justify-center">
          <div className="grid grid-cols-8 gap-0.5">
            {Array.from({ length: 64 }, (_, i) => (
              <div key={i} className={`w-4 h-4 rounded-sm ${Math.random() > 0.5 ? "bg-black" : "bg-white"}`} />
            ))}
          </div>
        </div>
        <p className="text-center text-sm font-mono font-bold text-[#e63946] mb-1">{booking.bookingRef}</p>
        <p className="text-center text-xs text-white/30">Show this at the entrance</p>
        <button onClick={onClose} className="w-full mt-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-sm transition-colors">Close</button>
      </div>
    </div>
  );
}

// ---- Rating Modal --------------------------------------------------------
function RatingModal({ booking, onClose, onSubmit }: { booking: ApiBooking; onClose: () => void; onSubmit: (id: number, rating: number) => void }) {
  const [selected, setSelected] = useState(0);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#12121e] border border-white/10 rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold mb-1">Rate your experience</h3>
        <p className="text-sm text-white/40 mb-5">{booking.movieTitle}</p>
        <div className="flex gap-1.5 justify-center mb-6">
          {[1,2,3,4,5,6,7,8,9,10].map(n => (
            <button key={n} onClick={() => setSelected(n)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${selected >= n ? "bg-amber-400 text-black" : "bg-white/8 text-white/40 hover:bg-white/15"}`}>
              {n}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-sm transition-colors">Cancel</button>
          <button onClick={() => selected && onSubmit(booking.id, selected)} disabled={!selected}
            className="flex-1 py-2.5 bg-amber-400 disabled:opacity-40 hover:bg-amber-300 text-black font-bold rounded-xl text-sm transition-colors">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- Cancel Modal --------------------------------------------------------
function CancelModal({ booking, onClose, onConfirm }: { booking: ApiBooking; onClose: () => void; onConfirm: (id: number) => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#12121e] border border-white/10 rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold mb-1">Cancel Booking?</h3>
        <p className="text-sm text-white/40 mb-2">{booking.movieTitle}</p>
        <p className="text-xs text-white/30 mb-6">Ref: {booking.bookingRef} · This action cannot be undone.</p>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-sm transition-colors">Keep Booking</button>
          <button onClick={() => onConfirm(booking.id)}
            className="flex-1 py-2.5 bg-[#e63946] hover:bg-[#c1121f] text-white font-bold rounded-xl text-sm transition-colors">
            Cancel Booking
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- Booking Card --------------------------------------------------------
function BookingCard({ booking, isExpanded, onToggle, onShowQR, onRate, onCancel }: {
  booking: ApiBooking;
  isExpanded: boolean;
  onToggle: () => void;
  onShowQR: () => void;
  onRate: () => void;
  onCancel: () => void;
}) {
  const statusColor = booking.status === "confirmed" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    : booking.status === "cancelled" ? "text-red-400 bg-red-500/10 border-red-500/20"
    : "text-white/50 bg-white/5 border-white/10";

  return (
    <div className={`bg-[#12121e] border rounded-2xl overflow-hidden transition-all ${isExpanded ? "border-white/15" : "border-white/6 hover:border-white/12"}`}>
      <button className="w-full p-4 flex items-center gap-4 text-left" onClick={onToggle}>
        <div className={`w-12 h-16 rounded-xl bg-gradient-to-b ${booking.posterGradient} shrink-0 flex items-center justify-center`}>
          <Film className="w-5 h-5 text-white/40" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold truncate">{booking.movieTitle}</h3>
            <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border shrink-0 ${statusColor}`}>
              {booking.status}
            </span>
          </div>
          <p className="text-xs text-white/40 mt-0.5 truncate">{booking.venue}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-xs text-white/30">{booking.date} · {booking.time}</span>
            <span className="text-xs bg-white/8 border border-white/10 rounded px-1.5 py-0.5">{booking.format}</span>
          </div>
        </div>
        <ChevronRight className={`w-4 h-4 text-white/20 shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
      </button>

      {isExpanded && (
        <div className="border-t border-white/5 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/3 rounded-xl p-3">
              <div className="text-xs text-white/30 mb-0.5">Booking Ref</div>
              <div className="text-sm font-mono font-medium text-[#e63946]">{booking.bookingRef}</div>
            </div>
            <div className="bg-white/3 rounded-xl p-3">
              <div className="text-xs text-white/30 mb-0.5">Seats</div>
              <div className="text-sm font-semibold">{(booking.seats as string[]).join(", ")}</div>
            </div>
            <div className="bg-white/3 rounded-xl p-3">
              <div className="text-xs text-white/30 mb-0.5">Total Paid</div>
              <div className="text-sm font-bold">₹{booking.totalAmount.toLocaleString()}</div>
            </div>
            <div className="bg-white/3 rounded-xl p-3">
              <div className="text-xs text-white/30 mb-0.5">Convenience Fee</div>
              <div className="text-sm font-medium">₹{booking.convenienceFee.toLocaleString()}</div>
            </div>
          </div>

          {booking.userRating && (
            <div className="flex items-center gap-2 text-sm">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-white/60">You rated this {booking.userRating}/10</span>
            </div>
          )}

          <div className="flex gap-2">
            {booking.status === "confirmed" && (
              <>
                <button onClick={onShowQR} className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/8 rounded-xl text-xs font-medium transition-colors">
                  Show QR Code
                </button>
                <button onClick={onCancel} className="flex-1 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl text-xs font-medium transition-colors">
                  Cancel
                </button>
              </>
            )}
            {booking.status === "completed" && !booking.userRating && (
              <button onClick={onRate} className="flex-1 py-2 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/20 text-amber-400 rounded-xl text-xs font-medium transition-colors">
                <Star className="w-3.5 h-3.5 inline mr-1" />Rate Experience
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Main Page -----------------------------------------------------------
export function BookingHistoryPage({ searchQuery }: BookingHistoryPageProps) {
  const { user } = useApp();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [qrBooking, setQrBooking] = useState<ApiBooking | null>(null);
  const [rateBooking, setRateBooking] = useState<ApiBooking | null>(null);
  const [cancelBooking, setCancelBooking] = useState<ApiBooking | null>(null);

  const userId = user?.id;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["bookings", userId],
    queryFn: () => api.bookings.list(userId),
    enabled: !!userId,
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number) => api.bookings.cancel(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["bookings"] }); setCancelBooking(null); },
  });

  const rateMutation = useMutation({
    mutationFn: ({ id, rating }: { id: number; rating: number }) => api.bookings.rate(id, rating),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["bookings"] }); setRateBooking(null); },
  });

  const bookings: ApiBooking[] = data?.bookings || [];

  const filtered = useMemo(() => {
    let list = bookings;
    if (filter !== "all") list = list.filter(b => b.status === filter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(b => b.movieTitle.toLowerCase().includes(q) || b.venue.toLowerCase().includes(q) || b.format.toLowerCase().includes(q));
    }
    return list;
  }, [bookings, filter, searchQuery]);

  const totalSpent = bookings.filter(b => b.status !== "cancelled").reduce((s, b) => s + b.totalAmount, 0);
  const moviesWatched = bookings.filter(b => b.status === "completed").length;
  const cinePoints = user?.cinePoints || 0;
  
  const ratedBookings = bookings.filter(b => b.userRating != null && b.userRating > 0);
  const avgRatingGiven = ratedBookings.length > 0
    ? (ratedBookings.reduce((sum, b) => sum + (b.userRating || 0), 0) / ratedBookings.length).toFixed(1)
    : "—";

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
            <p className="text-white/40 text-sm mt-1">
              {bookings.length} bookings · {bookings.filter(b => b.status === "confirmed").length} upcoming
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-white/30 mb-1 flex items-center gap-1 justify-end">
              <TrendingUp className="w-3 h-3" /> Total Spent
            </div>
            <div className="text-2xl font-bold">₹{totalSpent.toLocaleString()}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total Bookings", value: bookings.length, icon: <Ticket className="w-4 h-4 text-[#e63946]" />, bg: "from-[#e63946]/10 to-transparent" },
            { label: "Watched", value: moviesWatched, icon: <Film className="w-4 h-4 text-blue-400" />, bg: "from-blue-500/10 to-transparent" },
            { label: "Avg Rating Given", value: avgRatingGiven, icon: <Star className="w-4 h-4 text-amber-400" />, bg: "from-purple-500/10 to-transparent" },
            { label: "CinePoints", value: cinePoints.toLocaleString(), icon: <Trophy className="w-4 h-4 text-amber-400" />, bg: "from-amber-400/10 to-transparent" },
          ].map((stat, i) => (
            <div key={i} className={`bg-[#12121e] border border-white/6 rounded-2xl p-4 bg-gradient-to-br ${stat.bg}`}>
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">{stat.icon}</div>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-white/35 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {cinePoints >= 3000 && (
          <div className="flex items-center gap-3 bg-gradient-to-r from-amber-400/10 to-amber-500/5 border border-amber-400/20 rounded-2xl p-4 mb-6">
            <div className="w-9 h-9 rounded-xl bg-amber-400/15 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-amber-300">Gold Member</div>
              <div className="text-xs text-white/40">You've unlocked free cancellations and priority booking</div>
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {FILTERS.map(f => {
            const count = f.key === "all" ? bookings.length : bookings.filter(b => b.status === f.key).length;
            return (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${filter === f.key ? "bg-[#e63946] text-white shadow-lg shadow-red-500/20" : "bg-white/5 border border-white/8 text-white/50 hover:text-white"}`}>
                {f.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-md ${filter === f.key ? "bg-white/20" : "bg-white/8"}`}>{count}</span>
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-[#e63946] animate-spin" />
            <p className="text-white/30 text-sm">Loading your bookings…</p>
          </div>
        ) : isError ? (
          <div className="text-center py-20">
            <p className="text-white/40 mb-4">Failed to load bookings.</p>
            <button onClick={() => refetch()} className="flex items-center gap-2 mx-auto px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm transition-colors">
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Ticket className="w-8 h-8 text-white/20" />
            </div>
            <h3 className="text-lg font-semibold text-white/50 mb-1">No bookings found</h3>
            <p className="text-sm text-white/25">
              {searchQuery ? "Try a different search term" : "Nothing in this category yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(booking => (
              <BookingCard
                key={booking.id}
                booking={booking}
                isExpanded={expandedId === booking.id}
                onToggle={() => setExpandedId(expandedId === booking.id ? null : booking.id)}
                onShowQR={() => setQrBooking(booking)}
                onRate={() => setRateBooking(booking)}
                onCancel={() => setCancelBooking(booking)}
              />
            ))}
          </div>
        )}

        {filtered.length > 0 && (
          <p className="text-center text-xs text-white/20 mt-8">
            Showing {filtered.length} of {bookings.length} bookings
          </p>
        )}
      </div>

      {qrBooking && <QRModal booking={qrBooking} onClose={() => setQrBooking(null)} />}
      {rateBooking && (
        <RatingModal booking={rateBooking} onClose={() => setRateBooking(null)}
          onSubmit={(id, rating) => rateMutation.mutate({ id, rating })} />
      )}
      {cancelBooking && (
        <CancelModal booking={cancelBooking} onClose={() => setCancelBooking(null)}
          onConfirm={(id) => cancelMutation.mutate(id)} />
      )}
    </div>
  );
}
