import { useState } from "react";
import { Search, MapPin, Calendar, Clock, ChevronRight, Ticket, Star, Film, ArrowRight, Zap, Filter } from "lucide-react";

const MOVIES = [
  { title: "Dune: Part Three", formats: ["IMAX 2D", "4DX", "3D"], times: ["10:00 AM", "01:30 PM", "06:45 PM", "09:30 PM"], rating: 9.1, color: "bg-amber-900/60", seats: [142, 78, 35, 110] },
  { title: "Interstellar 2", formats: ["IMAX 2D", "2D"], times: ["11:00 AM", "03:00 PM", "07:30 PM"], rating: 9.3, color: "bg-blue-900/60", seats: [98, 145, 62] },
  { title: "Spider-Man: Beyond", formats: ["3D", "2D", "4DX"], times: ["09:30 AM", "12:45 PM", "04:00 PM", "08:15 PM"], rating: 8.5, color: "bg-red-900/60", seats: [182, 94, 201, 55] },
  { title: "Oppenheimer 2", formats: ["2D", "4DX"], times: ["10:30 AM", "02:15 PM", "06:00 PM"], rating: 8.8, color: "bg-gray-700/60", seats: [68, 112, 88] },
  { title: "Fast & Furious 12", formats: ["4DX", "3D", "2D"], times: ["11:30 AM", "03:30 PM", "07:00 PM", "10:00 PM"], rating: 7.6, color: "bg-orange-900/60", seats: [220, 88, 156, 30] },
];

const VENUES = ["All Venues", "PVR ICON, Andheri", "INOX Grand, Bandra", "Cinepolis, Goregaon", "Carnival, Thane"];
const CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune"];
const TODAY_DATES = ["Today, Apr 3", "Tomorrow, Apr 4", "Sat, Apr 5", "Sun, Apr 6", "Mon, Apr 7"];

export function HomepageC_QuickBook() {
  const [city, setCity] = useState("Mumbai");
  const [date, setDate] = useState(0);
  const [query, setQuery] = useState("");
  const [format, setFormat] = useState("All");
  const [venue, setVenue] = useState("All Venues");
  const [expandedMovie, setExpandedMovie] = useState<number | null>(0);

  const filtered = MOVIES.filter(m => query === "" || m.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#0b0b12] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Top command bar */}
      <div className="bg-[#0f0f1a] border-b border-white/6 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#e63946] to-[#ff6b6b] flex items-center justify-center">
              <Film className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-black">Cine<span className="text-[#e63946]">Verse</span></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#e63946]" />
              <select className="bg-transparent text-sm outline-none text-white cursor-pointer">
                {CITIES.map(c => <option key={c} className="bg-[#1a1a2e]">{c}</option>)}
              </select>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e63946] to-[#ff6b6b] flex items-center justify-center text-xs font-bold">R</div>
          </div>
        </div>
      </div>

      {/* Hero booking strip */}
      <div className="bg-gradient-to-r from-[#e63946] to-[#c1121f] py-4 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-black/20 rounded-xl px-4 py-2.5 flex-1">
              <Search className="w-4 h-4 text-white/60 shrink-0" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="bg-transparent text-sm text-white placeholder-white/50 outline-none flex-1"
                placeholder="Search movie, event, or venue..."
              />
            </div>
            <div className="flex items-center gap-2 bg-black/20 rounded-xl px-3 py-2.5 text-sm text-white/80 whitespace-nowrap">
              <Calendar className="w-4 h-4" />
              {TODAY_DATES[date].split(",")[0]}
            </div>
            <button className="bg-white text-[#e63946] font-bold text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-white/90 transition-colors whitespace-nowrap">
              <Ticket className="w-4 h-4" /> Find Shows
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Date + filter row */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex gap-2">
            {TODAY_DATES.map((d, i) => (
              <button
                key={i}
                onClick={() => setDate(i)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  date === i ? "bg-[#e63946] text-white font-semibold" : "bg-white/5 border border-white/10 text-white/50 hover:text-white"
                }`}
              >
                {d.split(",")[0]}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {["All", "IMAX", "4DX", "3D", "2D"].map(f => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  format === f ? "bg-white/15 text-white" : "text-white/30 hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
            <div className="w-px h-4 bg-white/10 mx-1" />
            <button className="flex items-center gap-1 text-xs text-white/40 hover:text-white transition-colors">
              <Filter className="w-3.5 h-3.5" /> Filter
            </button>
          </div>
        </div>

        {/* Venue tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {VENUES.map(v => (
            <button
              key={v}
              onClick={() => setVenue(v)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                venue === v ? "border-white/30 bg-white/10 text-white" : "border-white/8 text-white/35 hover:text-white/60"
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        {/* Results: movie → showtimes inline */}
        <div className="space-y-3">
          {filtered.map((movie, i) => (
            <div key={i} className="bg-[#12121e] border border-white/8 rounded-2xl overflow-hidden">
              {/* Header row */}
              <button
                className="w-full flex items-center gap-4 p-4 hover:bg-white/2 transition-colors text-left"
                onClick={() => setExpandedMovie(expandedMovie === i ? null : i)}
              >
                <div className={`w-12 h-16 rounded-xl ${movie.color} border border-white/10 shrink-0 flex items-end p-1`}>
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400 mx-auto" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base mb-0.5">{movie.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-white/40">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {movie.rating}</span>
                    <span>{movie.formats.join(" · ")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <span>{movie.times.length} shows</span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${expandedMovie === i ? "rotate-90" : ""}`} />
                </div>
              </button>

              {/* Showtimes */}
              {expandedMovie === i && (
                <div className="px-4 pb-4 border-t border-white/6 pt-4">
                  {movie.formats.map((fmt, fi) => (
                    <div key={fi} className="flex items-center gap-3 mb-3 last:mb-0">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded w-20 text-center shrink-0 ${
                        fmt.includes("IMAX") ? "bg-blue-500/15 text-blue-400" :
                        fmt.includes("4DX") ? "bg-purple-500/15 text-purple-400" :
                        fmt.includes("3D") ? "bg-amber-500/15 text-amber-400" :
                        "bg-white/8 text-white/50"
                      }`}>{fmt}</span>
                      <div className="flex flex-wrap gap-2">
                        {movie.times.slice(0, fi === 0 ? 4 : 3).map((time, ti) => {
                          const seats = movie.seats[(fi * 3 + ti) % movie.seats.length];
                          const low = seats < 50;
                          return (
                            <button
                              key={ti}
                              className={`group flex flex-col items-center px-4 py-2 rounded-xl border transition-all hover:border-[#e63946]/50 hover:bg-[#e63946]/8 ${
                                low ? "border-[#e63946]/30 bg-[#e63946]/5" : "border-white/10 bg-white/3"
                              }`}
                            >
                              <span className="text-sm font-bold">{time}</span>
                              <span className={`text-[10px] mt-0.5 ${low ? "text-[#e63946]" : "text-white/30"}`}>
                                {low ? `${seats} left!` : `${seats} seats`}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick stats footer */}
        <div className="mt-8 flex items-center justify-center gap-8 text-xs text-white/20">
          <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-[#e63946]" /> Instant confirmation</span>
          <span className="flex items-center gap-1.5"><Ticket className="w-3.5 h-3.5 text-white/30" /> 0% booking fee today</span>
          <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-amber-400" /> Earn CinePoints</span>
        </div>
      </div>
    </div>
  );
}
