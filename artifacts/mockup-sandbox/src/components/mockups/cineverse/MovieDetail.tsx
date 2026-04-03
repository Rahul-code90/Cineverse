import { useState } from "react";
import { AppLayout } from "./_shared/AppLayout";
import { Star, Clock, Play, Heart, Share2, ChevronRight, Calendar, MapPin, Users, Award, Zap, ArrowRight } from "lucide-react";

const SHOW_TIMES = [
  { time: "10:00 AM", format: "2D", price: 200, seats: 142, total: 200 },
  { time: "01:30 PM", format: "IMAX", price: 450, seats: 78, total: 150 },
  { time: "04:00 PM", format: "4DX", price: 550, seats: 35, total: 100 },
  { time: "06:45 PM", format: "3D", price: 350, seats: 92, total: 180 },
  { time: "09:30 PM", format: "IMAX", price: 450, seats: 110, total: 150 },
  { time: "11:55 PM", format: "2D", price: 220, seats: 168, total: 200 },
];

const CAST = [
  { name: "Timothée Chalamet", role: "Paul Atreides", color: "from-amber-700 to-amber-900" },
  { name: "Zendaya", role: "Chani", color: "from-rose-700 to-rose-900" },
  { name: "Florence Pugh", role: "Lady Margot", color: "from-purple-700 to-purple-900" },
  { name: "Austin Butler", role: "Feyd-Rautha", color: "from-blue-700 to-blue-900" },
];

const REVIEWS = [
  { user: "Rahul K.", rating: 9.5, comment: "Breathtaking visuals and an epic storyline. Villeneuve has outdone himself!", date: "2 days ago" },
  { user: "Priya S.", rating: 9.0, comment: "A masterpiece. The IMAX experience is absolutely worth it.", date: "3 days ago" },
  { user: "Amit T.", rating: 8.5, comment: "Dense narrative but rewarding. Chalamet is phenomenal.", date: "4 days ago" },
];

const DATES = [
  { day: "Thu", date: "03" },
  { day: "Fri", date: "04" },
  { day: "Sat", date: "05" },
  { day: "Sun", date: "06" },
  { day: "Mon", date: "07" },
  { day: "Tue", date: "08" },
];

export function MovieDetail() {
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedShow, setSelectedShow] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);

  return (
    <AppLayout>
      {/* Hero Banner */}
      <div className="relative h-[50vh] min-h-[400px] bg-gradient-to-br from-amber-900/80 via-amber-950 to-[#0a0a0f] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] to-transparent z-10" />
        {/* Simulated poster BG */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-amber-900/30 to-transparent" />
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-10">
          <div className="flex gap-8 items-end w-full">
            {/* Poster */}
            <div className="hidden md:block w-40 h-60 rounded-2xl bg-gradient-to-b from-amber-800 to-amber-950 border border-white/10 shrink-0 shadow-2xl" />
            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="bg-[#e63946] text-white text-xs font-bold px-2 py-0.5 rounded">NEW RELEASE</span>
                <span className="bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold px-2 py-0.5 rounded">UA</span>
                <span className="text-white/40 text-sm">Sci-Fi / Adventure / Drama</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Dune: Part Three</h1>
              <div className="flex flex-wrap items-center gap-5 text-sm text-white/60">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-white font-semibold">9.1</span>
                  <span>(42.5K)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>2h 45m</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-400">Critics' Choice</span>
                </div>
                <span>English • Hindi • Tamil • Telugu</span>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setLiked(!liked)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                  liked ? "bg-[#e63946]/20 border-[#e63946]/40 text-[#e63946]" : "bg-white/5 border-white/10 text-white/50 hover:text-white"
                }`}
              >
                <Heart className={`w-5 h-5 ${liked ? "fill-[#e63946]" : ""}`} />
              </button>
              <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-white/50 hover:text-white transition-all">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="flex items-center gap-2 bg-white/10 border border-white/20 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-white/15 transition-all">
                <Play className="w-4 h-4" />
                Watch Trailer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-10">
            {/* Synopsis */}
            <div>
              <h2 className="text-lg font-bold mb-4">Synopsis</h2>
              <p className="text-white/60 leading-relaxed">
                Following the events of Dune: Part Two, Paul Atreides continues his journey as the Kwisatz Haderach, navigating the complex political landscape of the universe. As new threats emerge from beyond the known galaxy, Paul must unite the fractured factions of Arrakis while confronting his own destiny. Denis Villeneuve returns to craft the final chapter of Frank Herbert's legendary saga, delivering a breathtaking conclusion to the most ambitious sci-fi trilogy of the century.
              </p>
            </div>

            {/* Cast */}
            <div>
              <h2 className="text-lg font-bold mb-4">Cast</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {CAST.map(member => (
                  <div key={member.name} className="text-center group cursor-pointer">
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${member.color} mb-3 border border-white/10 group-hover:scale-105 transition-transform`} />
                    <div className="text-sm font-medium">{member.name}</div>
                    <div className="text-xs text-white/40">{member.role}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Reviews</h2>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-bold">9.1</span>
                  </div>
                  <span className="text-white/30">•</span>
                  <span className="text-sm text-white/40">42,500 ratings</span>
                </div>
              </div>
              <div className="space-y-4">
                {REVIEWS.map((review, i) => (
                  <div key={i} className="bg-white/3 border border-white/8 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e63946] to-[#ff6b6b] flex items-center justify-center text-xs font-bold">
                          {review.user[0]}
                        </div>
                        <span className="font-medium text-sm">{review.user}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-amber-400 font-bold text-sm">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed">{review.comment}</p>
                    <span className="text-xs text-white/25 mt-2 block">{review.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Booking Panel */}
          <div className="space-y-5">
            <div className="bg-[#12121e] border border-white/10 rounded-2xl p-5 sticky top-20">
              <h2 className="text-lg font-bold mb-5">Book Tickets</h2>

              {/* Date Selector */}
              <div className="mb-5">
                <div className="text-xs text-white/40 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  Select Date
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {DATES.map((d, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(i)}
                      className={`flex flex-col items-center min-w-[48px] py-2.5 px-3 rounded-xl text-xs transition-all ${
                        selectedDate === i
                          ? "bg-[#e63946] text-white"
                          : "bg-white/5 border border-white/10 text-white/50 hover:bg-white/10"
                      }`}
                    >
                      <span className="font-medium">{d.day}</span>
                      <span className={`text-lg font-bold mt-0.5 ${selectedDate === i ? "text-white" : "text-white/80"}`}>{d.date}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Venue */}
              <div className="mb-5">
                <div className="text-xs text-white/40 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" />
                  Select Venue
                </div>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none appearance-none cursor-pointer">
                  <option className="bg-[#1a1a2e]">PVR ICON, Andheri West</option>
                  <option className="bg-[#1a1a2e]">INOX Grand, Bandra</option>
                  <option className="bg-[#1a1a2e]">Cinepolis, Goregaon</option>
                  <option className="bg-[#1a1a2e]">Carnival Cinemas, Thane</option>
                </select>
              </div>

              {/* Show Times */}
              <div className="mb-5">
                <div className="text-xs text-white/40 uppercase tracking-wider mb-3">Show Times</div>
                <div className="grid grid-cols-2 gap-2">
                  {SHOW_TIMES.map((show, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedShow(i)}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        selectedShow === i
                          ? "border-[#e63946] bg-[#e63946]/10"
                          : "border-white/10 bg-white/3 hover:border-white/20"
                      }`}
                    >
                      <div className="font-semibold text-sm">{show.time}</div>
                      <div className="flex items-center justify-between mt-1">
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                          show.format === "IMAX" ? "bg-blue-500/20 text-blue-400" :
                          show.format === "4DX" ? "bg-purple-500/20 text-purple-400" :
                          show.format === "3D" ? "bg-amber-500/20 text-amber-400" :
                          "bg-white/10 text-white/50"
                        }`}>{show.format}</span>
                        <span className="text-xs text-white/40">₹{show.price}</span>
                      </div>
                      <div className="mt-1.5">
                        <div className="flex items-center justify-between text-xs text-white/30 mb-1">
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {show.seats}/{show.total}</span>
                          <span className={show.seats < 50 ? "text-[#e63946]" : "text-emerald-400"}>
                            {show.seats < 50 ? "Fast Filling" : "Available"}
                          </span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-1">
                          <div
                            className={`h-1 rounded-full ${show.seats < 50 ? "bg-[#e63946]" : "bg-emerald-500"}`}
                            style={{ width: `${(show.seats / show.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  selectedShow !== null
                    ? "bg-[#e63946] hover:bg-[#c1121f] text-white shadow-lg shadow-[#e63946]/20"
                    : "bg-white/5 border border-white/10 text-white/30 cursor-not-allowed"
                }`}
              >
                <Zap className="w-4 h-4" />
                {selectedShow !== null ? "Select Seats" : "Choose a Showtime"}
                {selectedShow !== null && <ArrowRight className="w-4 h-4" />}
              </button>

              {selectedShow !== null && (
                <div className="mt-3 text-center text-xs text-white/30">
                  Tickets will be held for 10 minutes
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
