import { useState } from "react";
import {
  Calendar, MapPin, ChevronRight, QrCode, Download,
  RefreshCw, X, Star, Film, Music, Trophy, Check
} from "lucide-react";
import type { Booking } from "../data/bookings";

const STATUS_CONFIG = {
  confirmed: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/30",
    dot: "bg-emerald-400",
    label: "Confirmed",
  },
  completed: {
    color: "text-white/40",
    bg: "bg-white/5 border-white/10",
    dot: "bg-white/30",
    label: "Completed",
  },
  cancelled: {
    color: "text-[#e63946]",
    bg: "bg-[#e63946]/10 border-[#e63946]/30",
    dot: "bg-[#e63946]",
    label: "Cancelled",
  },
};

const TYPE_ICON = {
  movie: Film,
  event: Music,
  sports: Trophy,
};

interface BookingCardProps {
  booking: Booking;
  isExpanded: boolean;
  onToggle: () => void;
  onShowQR: () => void;
  onRate: () => void;
  onCancel: () => void;
}

export function BookingCard({
  booking, isExpanded, onToggle, onShowQR, onRate, onCancel
}: BookingCardProps) {
  const [downloaded, setDownloaded] = useState(false);
  const status = STATUS_CONFIG[booking.status];
  const TypeIcon = TYPE_ICON[booking.type];

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className={`bg-[#12121e] border rounded-2xl overflow-hidden transition-all duration-200 ${
      isExpanded ? "border-white/15 shadow-lg shadow-black/30" : "border-white/6 hover:border-white/12"
    }`}>
      <button
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/[0.02] transition-colors"
        onClick={onToggle}
      >
        <div className={`w-14 shrink-0 rounded-xl bg-gradient-to-b ${booking.posterGradient} border border-white/8 flex items-center justify-center`}
          style={{ height: 72 }}>
          <TypeIcon className="w-5 h-5 text-white/30" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <h3 className="font-bold text-sm truncate">{booking.movie}</h3>
            <span className={`shrink-0 inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-lg border font-medium ${status.bg} ${status.color}`}>
              <span className={`w-1 h-1 rounded-full ${status.dot}`} />
              {status.label}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/40">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 shrink-0" />
              {booking.date} · {booking.time}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 shrink-0" />
              {booking.venue}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-mono font-semibold text-white/55">
              {booking.seats.join(", ")}
            </span>
            <span className="w-1 h-1 bg-white/20 rounded-full shrink-0" />
            <span className="text-xs bg-white/6 border border-white/8 rounded-md px-2 py-0.5 text-white/60">
              {booking.format}
            </span>
            {booking.rating && (
              <>
                <span className="w-1 h-1 bg-white/20 rounded-full shrink-0" />
                <span className="flex items-center gap-0.5">
                  {Array.from({ length: booking.rating }).map((_, i) => (
                    <Star key={i} className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                  ))}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="text-right shrink-0 hidden sm:block">
          <div className="font-bold text-base">₹{booking.amount.toLocaleString()}</div>
          <div className="text-xs text-white/30 mt-0.5 font-mono">#{booking.id.slice(-6)}</div>
          <ChevronRight className={`w-4 h-4 text-white/25 mt-2 ml-auto transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`} />
        </div>

        <div className="text-right shrink-0 sm:hidden">
          <div className="font-bold text-sm">₹{booking.amount.toLocaleString()}</div>
          <ChevronRight className={`w-4 h-4 text-white/25 mt-1 ml-auto transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`} />
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-white/6 p-5">
          {booking.type === "movie" && booking.director && (
            <div className="flex flex-wrap gap-4 mb-4 text-xs text-white/40">
              {booking.director && <span>Director: <span className="text-white/70">{booking.director}</span></span>}
              {booking.duration && <span>Duration: <span className="text-white/70">{booking.duration}</span></span>}
              {booking.language && <span>Language: <span className="text-white/70">{booking.language}</span></span>}
            </div>
          )}

          <div className="flex flex-wrap gap-2.5">
            {booking.status === "confirmed" && (
              <>
                <button
                  onClick={onShowQR}
                  className="flex items-center gap-2 bg-[#e63946]/10 border border-[#e63946]/25 text-[#e63946] rounded-xl px-4 py-2 text-sm font-semibold hover:bg-[#e63946]/20 transition-colors"
                >
                  <QrCode className="w-4 h-4" />
                  Show QR Code
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm hover:bg-white/10 transition-colors"
                >
                  {downloaded ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4 text-white/50" />}
                  {downloaded ? "Downloaded!" : "Download Ticket"}
                </button>
                <button className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm hover:bg-white/10 transition-colors">
                  <RefreshCw className="w-4 h-4 text-white/50" />
                  Reschedule
                </button>
                <button
                  onClick={onCancel}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-[#e63946]/60 hover:bg-[#e63946]/10 hover:border-[#e63946]/20 transition-colors ml-auto"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </>
            )}

            {booking.status === "completed" && (
              <>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm hover:bg-white/10 transition-colors"
                >
                  {downloaded ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4 text-white/50" />}
                  {downloaded ? "Downloaded!" : "Download Receipt"}
                </button>
                {!booking.rating ? (
                  <button
                    onClick={onRate}
                    className="flex items-center gap-2 bg-amber-400/10 border border-amber-400/25 text-amber-400 rounded-xl px-4 py-2 text-sm font-semibold hover:bg-amber-400/20 transition-colors"
                  >
                    <Star className="w-4 h-4" />
                    Rate this
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < booking.rating! ? "text-amber-400 fill-amber-400" : "text-white/15"}`} />
                    ))}
                    <span className="text-xs text-white/30 ml-1">Your rating</span>
                  </div>
                )}
              </>
            )}

            {booking.status === "cancelled" && (
              <div className="flex items-center gap-2 text-sm text-white/30 italic">
                <X className="w-4 h-4 text-[#e63946]/50" />
                This booking was cancelled. Refund processed.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
