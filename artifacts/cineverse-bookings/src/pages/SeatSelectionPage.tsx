import { useState, useMemo } from "react";
import { Armchair, Clock, MapPin, X, Info, ArrowRight, Zap } from "lucide-react";
import { useLocation } from "wouter";

type SeatStatus = "available" | "occupied" | "selected" | "wheelchair";
type SeatCategory = "premium" | "executive" | "standard";

interface Seat {
  id: string;
  row: string;
  num: number;
  status: SeatStatus;
  price: number;
  category: SeatCategory;
}

const ROW_CONFIG: { row: string; count: number; category: SeatCategory; price: number }[] = [
  { row: "A", count: 12, category: "premium", price: 650 },
  { row: "B", count: 14, category: "premium", price: 650 },
  { row: "C", count: 14, category: "executive", price: 450 },
  { row: "D", count: 16, category: "executive", price: 450 },
  { row: "E", count: 16, category: "executive", price: 450 },
  { row: "F", count: 18, category: "standard", price: 200 },
  { row: "G", count: 18, category: "standard", price: 200 },
  { row: "H", count: 18, category: "standard", price: 200 },
  { row: "J", count: 20, category: "standard", price: 200 },
];

function buildSeats(): Seat[] {
  const rng = (i: number) => {
    const x = Math.sin(42 + i) * 10000;
    return x - Math.floor(x);
  };
  const seats: Seat[] = [];
  let idx = 0;
  for (const { row, count, category, price } of ROW_CONFIG) {
    for (let n = 1; n <= count; n++) {
      seats.push({
        id: `${row}${n}`,
        row,
        num: n,
        status: rng(idx++) < 0.35 ? "occupied" : "available",
        price,
        category,
      });
    }
  }
  const j1 = seats.find(s => s.id === "J1");
  const j20 = seats.find(s => s.id === "J20");
  if (j1) j1.status = "wheelchair";
  if (j20) j20.status = "wheelchair";
  return seats;
}

const INITIAL_SEATS = buildSeats();

const CATEGORY_STYLES: Record<SeatCategory, { available: string; selected: string }> = {
  premium: {
    available: "bg-purple-900/50 border-purple-700/40 text-purple-400/60 hover:bg-purple-800/60",
    selected: "bg-purple-500 border-purple-400 text-white shadow-lg scale-110",
  },
  executive: {
    available: "bg-blue-900/50 border-blue-700/40 text-blue-400/60 hover:bg-blue-800/60",
    selected: "bg-blue-500 border-blue-400 text-white shadow-lg scale-110",
  },
  standard: {
    available: "bg-emerald-900/35 border-emerald-700/25 text-emerald-400/50 hover:bg-emerald-800/50",
    selected: "bg-emerald-500 border-emerald-400 text-white shadow-lg scale-110",
  },
};

export function SeatSelectionPage() {
  const [, navigate] = useLocation();
  const [seats, setSeats] = useState<Seat[]>(INITIAL_SEATS);
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);
  const [timeLeft] = useState("09:45");

  const toggleSeat = (id: string) => {
    setSeats(prev => prev.map(s => {
      if (s.id !== id || s.status === "occupied" || s.status === "wheelchair") return s;
      return { ...s, status: s.status === "selected" ? "available" : "selected" };
    }));
  };

  const selectedSeats = useMemo(() => seats.filter(s => s.status === "selected"), [seats]);
  const totalPrice = useMemo(() => selectedSeats.reduce((sum, s) => sum + s.price, 0), [selectedSeats]);
  const convenience = selectedSeats.length > 0 ? Math.round(totalPrice * 0.1) : 0;

  const rows = [...new Set(seats.map(s => s.row))];
  const seatsByRow = Object.fromEntries(rows.map(r => [r, seats.filter(s => s.row === r)]));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Select Your Seats</h1>
          <div className="flex items-center gap-4 mt-1.5 text-sm text-white/50 flex-wrap">
            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />PVR ICON, Andheri West</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />01:30 PM · IMAX</span>
            <span className="text-white/20">·</span>
            <span>Thu, Apr 03</span>
          </div>
        </div>
        {selectedSeats.length > 0 && (
          <div className="bg-[#e63946]/10 border border-[#e63946]/30 rounded-xl px-4 py-2 text-sm">
            <span className="text-[#e63946] font-bold">{selectedSeats.length}</span>
            <span className="text-white/50"> seat{selectedSeats.length > 1 ? "s" : ""} selected</span>
          </div>
        )}
      </div>

      <div className="flex gap-8 flex-col lg:flex-row">
        <div className="flex-1 overflow-x-auto">
          <div className="mb-10 text-center">
            <div className="mx-auto max-w-lg">
              <div className="h-3 bg-gradient-to-b from-white/20 to-transparent rounded-t-full mx-8 mb-1" />
              <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mb-2" />
              <span className="text-xs text-white/30 uppercase tracking-[4px]">SCREEN</span>
            </div>
          </div>

          <div className="space-y-1.5 min-w-max mx-auto">
            {rows.map(row => {
              const rowSeats = seatsByRow[row];
              const category = rowSeats[0].category;
              return (
                <div key={row} className="flex items-center gap-3">
                  <span className="w-5 text-xs font-mono text-white/30 text-right shrink-0">{row}</span>
                  <div className="flex items-center justify-center gap-1">
                    {rowSeats.map(seat => {
                      const isSelected = seat.status === "selected";
                      const isOccupied = seat.status === "occupied";
                      const isWheelchair = seat.status === "wheelchair";
                      const styles = CATEGORY_STYLES[category];
                      return (
                        <button
                          key={seat.id}
                          onClick={() => toggleSeat(seat.id)}
                          onMouseEnter={() => setHoveredSeat(seat.id)}
                          onMouseLeave={() => setHoveredSeat(null)}
                          disabled={isOccupied}
                          title={isWheelchair ? `${seat.id} — Accessible` : `${seat.id} — ₹${seat.price}`}
                          className={`w-7 h-6 rounded-t-md text-[9px] font-bold transition-all duration-100 border ${
                            isOccupied
                              ? "bg-white/8 border-white/8 text-white/15 cursor-not-allowed"
                              : isWheelchair
                              ? "bg-amber-500/25 border-amber-500/40 text-amber-400 cursor-not-allowed"
                              : isSelected
                              ? styles.selected
                              : hoveredSeat === seat.id
                              ? "bg-white/20 border-white/30 text-white scale-110"
                              : styles.available
                          }`}
                        >
                          {isWheelchair ? "♿" : seat.num}
                        </button>
                      );
                    })}
                  </div>
                  <span className="w-5 text-xs font-mono text-white/30 shrink-0">{row}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
            {[
              { style: "bg-emerald-900/35 border-emerald-700/25", label: "Standard — ₹200" },
              { style: "bg-blue-900/50 border-blue-700/40", label: "Executive — ₹450" },
              { style: "bg-purple-900/50 border-purple-700/40", label: "Premium — ₹650" },
              { style: "bg-white/8 border-white/8", label: "Occupied" },
              { style: "bg-emerald-500 border-emerald-400", label: "Selected" },
              { style: "bg-amber-500/25 border-amber-500/40", label: "Accessible" },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={`w-7 h-6 rounded-t-md border ${item.style}`} />
                <span className="text-xs text-white/50">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-[#12121e] border border-white/10 rounded-2xl p-5 sticky top-20">
            <h3 className="font-bold mb-5">Booking Summary</h3>

            <div className="flex gap-3 mb-5 pb-5 border-b border-white/8">
              <div className="w-12 h-16 rounded-xl bg-gradient-to-b from-amber-700 to-amber-950 border border-white/10 shrink-0" />
              <div>
                <div className="font-semibold text-sm">Dune: Part Three</div>
                <div className="text-xs text-white/40 mt-1">IMAX · English</div>
                <div className="text-xs text-white/40">01:30 PM · Apr 03</div>
                <div className="text-xs text-white/40 mt-0.5">PVR ICON, Andheri West</div>
              </div>
            </div>

            {selectedSeats.length > 0 ? (
              <div className="mb-5">
                <div className="text-xs text-white/40 uppercase tracking-wider mb-3">Selected Seats</div>
                <div className="flex flex-wrap gap-2">
                  {selectedSeats.map(s => (
                    <div key={s.id} className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1">
                      <Armchair className="w-3 h-3 text-white/40" />
                      <span className="text-xs font-mono font-semibold">{s.id}</span>
                      <button onClick={() => toggleSeat(s.id)} className="ml-1 text-white/25 hover:text-white/60 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-5 py-6 text-center">
                <Armchair className="w-8 h-8 text-white/20 mx-auto mb-2" />
                <p className="text-xs text-white/30">Click seats on the map to select them</p>
              </div>
            )}

            <div className="space-y-2 pb-4 mb-4 border-b border-white/8">
              <div className="flex justify-between text-sm">
                <span className="text-white/50">{selectedSeats.length} × Ticket{selectedSeats.length !== 1 ? "s" : ""}</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/50 flex items-center gap-1">Convenience Fee <Info className="w-3 h-3 text-white/20" /></span>
                <span>₹{convenience}</span>
              </div>
            </div>

            <div className="flex justify-between font-bold mb-5">
              <span>Total</span>
              <span className="text-xl">₹{(totalPrice + convenience).toLocaleString()}</span>
            </div>

            {selectedSeats.length > 0 && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2 mb-4 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-xs text-amber-400">Seats held for <strong>{timeLeft}</strong></span>
              </div>
            )}

            <button
              disabled={selectedSeats.length === 0}
              onClick={() => selectedSeats.length > 0 && navigate("/payment")}
              className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                selectedSeats.length > 0
                  ? "bg-[#e63946] hover:bg-[#c1121f] text-white shadow-lg shadow-[#e63946]/20"
                  : "bg-white/5 border border-white/8 text-white/30 cursor-not-allowed"
              }`}
            >
              <Zap className="w-4 h-4" />
              {selectedSeats.length > 0 ? "Proceed to Payment" : "Select Seats First"}
              {selectedSeats.length > 0 && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
