import { X, Download, Share2 } from "lucide-react";
import type { Booking } from "../data/bookings";

interface QRModalProps {
  booking: Booking;
  onClose: () => void;
}

function QRPattern({ value }: { value: string }) {
  const size = 21;
  const seed = value.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const rng = (i: number) => {
    const x = Math.sin(seed + i) * 10000;
    return x - Math.floor(x);
  };

  const cells: boolean[][] = Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, col) => {
      if ((row < 7 && col < 7) || (row < 7 && col >= 14) || (row >= 14 && col < 7)) return true;
      if (row === 0 || row === 6 || col === 0 || col === 6) return true;
      if (row >= 14 && row <= 20 && col === 0) return true;
      if (row >= 14 && row <= 20 && col === 6) return true;
      if (row === 14 && col <= 6) return true;
      if (row === 20 && col <= 6) return true;
      return rng(row * size + col) > 0.45;
    })
  );

  return (
    <div
      className="inline-grid bg-white p-3 rounded-xl"
      style={{ gridTemplateColumns: `repeat(${size}, 1fr)`, gap: "1px" }}
    >
      {cells.flat().map((on, i) => (
        <div key={i} style={{ width: 10, height: 10, background: on ? "#0a0a0f" : "white" }} />
      ))}
    </div>
  );
}

export function QRModal({ booking, onClose }: QRModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#12121e] border border-white/10 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative bg-gradient-to-br from-[#e63946]/20 to-transparent p-6 pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="text-xs font-medium text-[#e63946] uppercase tracking-widest mb-1">Your Ticket</div>
          <h2 className="text-xl font-bold">{booking.movie}</h2>
          <p className="text-sm text-white/50 mt-0.5">{booking.format} · {booking.seats.join(", ")}</p>
        </div>

        <div className="px-6 py-2">
          <div className="border-t border-dashed border-white/10 my-1" />
        </div>

        <div className="flex justify-center px-6 pb-4">
          <QRPattern value={booking.id} />
        </div>

        <div className="px-6 pb-4 text-center">
          <p className="text-xs font-mono text-white/40 tracking-widest">{booking.id}</p>
        </div>

        <div className="px-6 pb-4">
          <div className="border-t border-dashed border-white/10 my-1" />
        </div>

        <div className="px-6 pb-6 grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-xs text-white/40 mb-0.5">Date & Time</div>
            <div className="font-medium">{booking.date}</div>
            <div className="text-white/60">{booking.time}</div>
          </div>
          <div>
            <div className="text-xs text-white/40 mb-0.5">Venue</div>
            <div className="font-medium text-xs leading-snug">{booking.venue}</div>
          </div>
          <div>
            <div className="text-xs text-white/40 mb-0.5">Seats</div>
            <div className="font-mono font-semibold">{booking.seats.join(", ")}</div>
          </div>
          <div>
            <div className="text-xs text-white/40 mb-0.5">Amount Paid</div>
            <div className="font-bold text-emerald-400">₹{booking.amount.toLocaleString()}</div>
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 bg-[#e63946] hover:bg-[#c92d38] text-white rounded-xl py-2.5 text-sm font-semibold transition-colors">
            <Download className="w-4 h-4" />
            Download
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl py-2.5 text-sm transition-colors">
            <Share2 className="w-4 h-4 text-white/50" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
