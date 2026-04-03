import { useState, useMemo } from "react";
import { Ticket, Star, Film, Music, Trophy, ChevronRight, Sparkles, TrendingUp } from "lucide-react";
import { BookingCard } from "../components/BookingCard";
import { QRModal } from "../components/QRModal";
import { RatingModal } from "../components/RatingModal";
import { CancelModal } from "../components/CancelModal";
import { BOOKINGS, STATS, type Booking, type BookingStatus } from "../data/bookings";

interface BookingHistoryPageProps {
  searchQuery: string;
}

type FilterKey = "all" | BookingStatus;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All Bookings" },
  { key: "confirmed", label: "Upcoming" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

export function BookingHistoryPage({ searchQuery }: BookingHistoryPageProps) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [expandedId, setExpandedId] = useState<string | null>(BOOKINGS[0].id);
  const [qrBooking, setQrBooking] = useState<Booking | null>(null);
  const [rateBooking, setRateBooking] = useState<Booking | null>(null);
  const [cancelBooking, setCancelBooking] = useState<Booking | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(BOOKINGS);
  const [stats, setStats] = useState(STATS);

  const filtered = useMemo(() => {
    let list = bookings;
    if (filter !== "all") list = list.filter(b => b.status === filter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(b =>
        b.movie.toLowerCase().includes(q) ||
        b.venue.toLowerCase().includes(q) ||
        b.format.toLowerCase().includes(q)
      );
    }
    return list;
  }, [bookings, filter, searchQuery]);

  const handleRatingSubmit = (bookingId: string, rating: number) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, rating } : b));
    setStats(prev => ({ ...prev, cinePoints: prev.cinePoints + 50 }));
    setRateBooking(null);
  };

  const handleCancelConfirm = (bookingId: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: "cancelled" as BookingStatus } : b));
    setStats(prev => {
      const booking = bookings.find(b => b.id === bookingId)!;
      return {
        ...prev,
        totalSpent: prev.totalSpent - booking.amount,
        totalBookings: prev.totalBookings,
      };
    });
    setCancelBooking(null);
    setExpandedId(null);
  };

  const currentStats = useMemo(() => ({
    totalBookings: bookings.length,
    moviesWatched: bookings.filter(b => b.type === "movie" && b.status === "completed").length,
    eventsAttended: bookings.filter(b => b.type === "event" && b.status === "completed").length,
    totalSpent: bookings.filter(b => b.status !== "cancelled").reduce((s, b) => s + b.amount, 0),
    cinePoints: stats.cinePoints,
  }), [bookings, stats]);

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
            <div className="text-2xl font-bold">₹{currentStats.totalSpent.toLocaleString()}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            {
              label: "Total Bookings",
              value: currentStats.totalBookings,
              icon: <Ticket className="w-4 h-4 text-[#e63946]" />,
              bg: "from-[#e63946]/10 to-transparent",
            },
            {
              label: "Movies Watched",
              value: currentStats.moviesWatched,
              icon: <Film className="w-4 h-4 text-blue-400" />,
              bg: "from-blue-500/10 to-transparent",
            },
            {
              label: "Events Attended",
              value: currentStats.eventsAttended,
              icon: <Music className="w-4 h-4 text-purple-400" />,
              bg: "from-purple-500/10 to-transparent",
            },
            {
              label: "CinePoints",
              value: currentStats.cinePoints.toLocaleString(),
              icon: <Star className="w-4 h-4 text-amber-400 fill-amber-400" />,
              bg: "from-amber-400/10 to-transparent",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={`bg-[#12121e] border border-white/6 rounded-2xl p-4 cursor-pointer hover:border-white/12 transition-colors group bg-gradient-to-br ${stat.bg}`}
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center">
                  {stat.icon}
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-white/15 group-hover:text-white/30 transition-colors" />
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-white/35 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {currentStats.cinePoints >= 3000 && (
          <div className="flex items-center gap-3 bg-gradient-to-r from-amber-400/10 to-amber-500/5 border border-amber-400/20 rounded-2xl p-4 mb-6">
            <div className="w-9 h-9 rounded-xl bg-amber-400/15 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-amber-300">Gold Member</div>
              <div className="text-xs text-white/40">You've unlocked free cancellations and priority booking</div>
            </div>
            <button className="text-xs text-amber-400 font-medium shrink-0 hover:text-amber-300 transition-colors">
              View Perks →
            </button>
          </div>
        )}

        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-thin pb-1">
          {FILTERS.map(f => {
            const count = f.key === "all"
              ? bookings.length
              : bookings.filter(b => b.status === f.key).length;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                  filter === f.key
                    ? "bg-[#e63946] text-white shadow-lg shadow-red-500/20"
                    : "bg-white/5 border border-white/8 text-white/50 hover:text-white hover:border-white/15"
                }`}
              >
                {f.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-md ${
                  filter === f.key ? "bg-white/20" : "bg-white/8"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
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

      {qrBooking && (
        <QRModal booking={qrBooking} onClose={() => setQrBooking(null)} />
      )}
      {rateBooking && (
        <RatingModal
          booking={rateBooking}
          onClose={() => setRateBooking(null)}
          onSubmit={handleRatingSubmit}
        />
      )}
      {cancelBooking && (
        <CancelModal
          booking={cancelBooking}
          onClose={() => setCancelBooking(null)}
          onConfirm={handleCancelConfirm}
        />
      )}
    </div>
  );
}
