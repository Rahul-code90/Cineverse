import { useState } from "react";
import { Search, Bell, User, Film, Star, Clock, ArrowRight, MapPin, ChevronRight, Sparkles } from "lucide-react";

const MOODS = [
  { id: "action", emoji: "⚡", label: "Pumped Up", desc: "High-octane action", color: "from-orange-500 to-red-600", glow: "rgba(239,68,68,0.4)", movies: [0, 2, 5] },
  { id: "drama", emoji: "🎭", label: "Feel Deeply", desc: "Rich emotional stories", color: "from-amber-500 to-amber-700", glow: "rgba(245,158,11,0.3)", movies: [1, 3, 4] },
  { id: "scifi", emoji: "🚀", label: "Mind Blown", desc: "Sci-fi & the unknown", color: "from-blue-500 to-indigo-600", glow: "rgba(59,130,246,0.35)", movies: [0, 4, 1] },
  { id: "comedy", emoji: "😂", label: "Just Laugh", desc: "Pure feel-good fun", color: "from-yellow-400 to-amber-500", glow: "rgba(251,191,36,0.35)", movies: [5, 2, 3] },
  { id: "horror", emoji: "👻", label: "Get Scared", desc: "Edge-of-seat thrills", color: "from-purple-600 to-purple-900", glow: "rgba(147,51,234,0.35)", movies: [3, 1, 0] },
  { id: "romance", emoji: "💫", label: "Feel the Love", desc: "Heartwarming stories", color: "from-pink-500 to-rose-600", glow: "rgba(236,72,153,0.35)", movies: [1, 4, 2] },
  { id: "adventure", emoji: "🌍", label: "Explore", desc: "Epic journeys & worlds", color: "from-emerald-500 to-teal-600", glow: "rgba(16,185,129,0.3)", movies: [0, 2, 4] },
  { id: "thriller", emoji: "🔥", label: "Stay Tense", desc: "Suspense & mystery", color: "from-gray-500 to-gray-700", glow: "rgba(107,114,128,0.3)", movies: [1, 3, 5] },
];

const ALL_MOVIES = [
  { title: "Dune: Part Three", genre: "Sci-Fi", rating: 9.1, runtime: "2h 45m", color: "from-amber-800 to-amber-950", format: "IMAX", price: 450 },
  { title: "Interstellar 2", genre: "Drama", rating: 9.3, runtime: "2h 55m", color: "from-blue-800 to-blue-950", format: "IMAX", price: 450 },
  { title: "Spider-Man: Beyond", genre: "Action", rating: 8.5, runtime: "2h 20m", color: "from-red-800 to-red-950", format: "3D", price: 350 },
  { title: "The Witcher Chronicles", genre: "Fantasy", rating: 8.2, runtime: "2h 35m", color: "from-purple-800 to-purple-950", format: "2D", price: 220 },
  { title: "Oppenheimer 2", genre: "Drama", rating: 8.8, runtime: "3h 10m", color: "from-gray-700 to-gray-950", format: "4DX", price: 550 },
  { title: "Fast & Furious 12", genre: "Action", rating: 7.6, runtime: "2h 10m", color: "from-orange-800 to-orange-950", format: "4DX", price: 550 },
];

export function HomepageB_MoodFirst() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [city, setCity] = useState("Mumbai");

  const mood = MOODS.find(m => m.id === selectedMood);
  const movies = mood ? mood.movies.map(i => ALL_MOVIES[i]) : ALL_MOVIES.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#09090f] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#e63946] to-[#ff6b6b] flex items-center justify-center">
            <Film className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-black">Cine<span className="text-[#e63946]">Verse</span></span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/8 rounded-full px-3 py-1.5 text-sm text-white/50">
            <MapPin className="w-3.5 h-3.5 text-[#e63946]" />
            <select className="bg-transparent outline-none cursor-pointer">
              {["Mumbai", "Delhi", "Bangalore", "Chennai"].map(c => <option key={c} className="bg-[#1a1a2e]">{c}</option>)}
            </select>
          </div>
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/8">
            <Bell className="w-3.5 h-3.5 text-white/50" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e63946] to-[#ff6b6b] flex items-center justify-center text-xs font-bold">R</div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Mood Question — the central hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#e63946]/10 border border-[#e63946]/20 rounded-full px-4 py-1.5 mb-5">
            <Sparkles className="w-3.5 h-3.5 text-[#e63946]" />
            <span className="text-sm text-[#e63946] font-medium">Smart Discovery</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
            {selectedMood
              ? <>Showing <span style={{ color: mood?.glow.replace('rgba(', '').replace(/,\d+\.\d+\)/, '') && "#fff" }} className="underline decoration-[#e63946]">"{mood?.label}"</span> picks</>
              : "What's your mood tonight?"
            }
          </h1>
          <p className="text-white/40 text-lg">{selectedMood ? "Perfect films matched to your vibe" : "Pick a vibe and we'll find your perfect film"}</p>
        </div>

        {/* Mood Grid */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3 mb-12">
          {MOODS.map(m => (
            <button
              key={m.id}
              onClick={() => setSelectedMood(selectedMood === m.id ? null : m.id)}
              className={`relative group rounded-2xl p-3 text-center transition-all duration-300 border ${
                selectedMood === m.id
                  ? "border-white/30 scale-105"
                  : "border-white/8 hover:border-white/15 hover:scale-102"
              }`}
              style={selectedMood === m.id ? {
                background: `linear-gradient(135deg, ${m.glow.replace('0.4)', '0.25)').replace('0.3)', '0.25)').replace('0.35)', '0.25)')}, transparent)`,
                boxShadow: `0 0 30px ${m.glow}`
              } : {
                background: "rgba(255,255,255,0.03)"
              }}
            >
              <div className="text-2xl mb-1.5">{m.emoji}</div>
              <div className="text-xs font-bold leading-tight">{m.label}</div>
              <div className="text-[10px] text-white/30 mt-0.5 hidden md:block">{m.desc}</div>
            </button>
          ))}
        </div>

        {/* Context line / transition */}
        {selectedMood && mood && (
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-white/8" />
            <div
              className="text-xs font-semibold px-4 py-1.5 rounded-full"
              style={{ background: mood.glow.replace('0.4)', '0.15)').replace('0.3)', '0.15)').replace('0.35)', '0.15)'), color: "rgba(255,255,255,0.7)" }}
            >
              {mood.desc} · {movies.length} films
            </div>
            <div className="h-px flex-1 bg-white/8" />
          </div>
        )}

        {/* Movie cards — shift based on mood */}
        <div className={`grid gap-5 mb-10 ${selectedMood ? "grid-cols-3" : "grid-cols-3"}`}>
          {movies.map((movie, i) => (
            <div
              key={i}
              className="group cursor-pointer"
              style={selectedMood && mood ? { animationDelay: `${i * 80}ms` } : {}}
            >
              <div className={`relative rounded-2xl bg-gradient-to-b ${movie.color} border border-white/10 overflow-hidden mb-3 group-hover:border-white/25 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-black/40 group-hover:-translate-y-1`}
                style={{ aspectRatio: "2/3" }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-bold bg-black/60 border border-white/20 rounded-full px-2 py-0.5">{movie.format}</span>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-amber-400 font-bold text-sm">{movie.rating}</span>
                  </div>
                  <div className="text-xs font-bold text-white">{movie.title}</div>
                </div>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold mb-0.5 group-hover:text-[#e63946] transition-colors">{movie.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <span>{movie.genre}</span>
                    <span>·</span>
                    <Clock className="w-3 h-3" />
                    <span>{movie.runtime}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-black text-white">₹{movie.price}</div>
                  <div className="text-[10px] text-white/30">onwards</div>
                </div>
              </div>
              <button className="w-full mt-2.5 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 hover:bg-[#e63946] hover:border-[#e63946] transition-all duration-200">
                Book Now →
              </button>
            </div>
          ))}
        </div>

        {/* Not in mood? Search fallback */}
        <div className="text-center">
          <p className="text-sm text-white/30 mb-3">Know exactly what you want?</p>
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl px-5 py-3 cursor-text transition-all group">
            <Search className="w-4 h-4 text-white/30 group-hover:text-white/50 transition-colors" />
            <input className="bg-transparent text-sm text-white placeholder-white/25 outline-none w-60" placeholder="Search movies, events, venues..." />
            <button className="flex items-center gap-1 text-xs text-[#e63946] font-semibold hover:text-white transition-colors">
              Search <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
