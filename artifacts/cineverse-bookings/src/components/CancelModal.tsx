import { AlertTriangle, X } from "lucide-react";
import type { Booking } from "../data/bookings";

interface CancelModalProps {
  booking: Booking;
  onClose: () => void;
  onConfirm: (bookingId: string) => void;
}

export function CancelModal({ booking, onClose, onConfirm }: CancelModalProps) {
  const refundAmount = Math.round(booking.amount * 0.85);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#12121e] border border-white/10 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-white/8">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-2xl bg-[#e63946]/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-[#e63946]" />
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/8 hover:bg-white/15 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <h2 className="text-lg font-bold mt-3">Cancel Booking?</h2>
          <p className="text-sm text-white/50 mt-1">This action cannot be undone.</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-white/5 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Movie</span>
              <span className="font-medium">{booking.movie}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Date</span>
              <span>{booking.date} · {booking.time}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Seats</span>
              <span className="font-mono">{booking.seats.join(", ")}</span>
            </div>
            <div className="border-t border-white/8 pt-2 mt-2 flex justify-between text-sm">
              <span className="text-white/50">Amount Paid</span>
              <span className="line-through text-white/40">₹{booking.amount.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
            <div className="text-xs text-emerald-400 font-medium uppercase tracking-wider mb-1">Refund</div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/60">85% refund to original payment</span>
              <span className="text-lg font-bold text-emerald-400">₹{refundAmount.toLocaleString()}</span>
            </div>
            <p className="text-xs text-white/30 mt-1">Processed within 5–7 business days</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              Keep Booking
            </button>
            <button
              onClick={() => onConfirm(booking.id)}
              className="flex-1 py-2.5 rounded-xl text-sm bg-[#e63946] hover:bg-[#c92d38] text-white font-semibold transition-colors"
            >
              Yes, Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
