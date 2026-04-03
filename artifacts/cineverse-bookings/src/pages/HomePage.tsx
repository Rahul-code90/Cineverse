import { useState } from "react";
import { Search, Play, Star, Clock, ChevronRight, MapPin, Calendar, Flame, TrendingUp, Award, Zap, ArrowRight, Film } from "lucide-react";
import { useLocation } from "wouter";

const MOVIES = [
  { id: 1, title: "Dune: Part Three", genre: "Sci-Fi", rating: 9.1, runtime: "2h 45m", poster: "from-amber-800 via-amber-900 to-stone-950", badge: "NEW", badgeColor: "bg-emerald-500", languages: ["IMAX", "4DX", "3D"] },
  { id: 2, title: "Oppenheimer 2", genre: "Drama", rating: 8.8, runtime: "3h 10m", poster: "from-gray-700 via-gray-900 to-slate-950", badge: "HOT", badgeColor: "bg-[#e63946]", languages: ["2D", "4DX"] },
  { id: 3, title: "Spider-Man: Beyond", genre: "Action", rating: 8.5, runtime: "2h 20m", poster: "from-red-800 via-red-900 to-slate-950", badge: "TRENDING", badgeColor: "bg-amber-500", languages: ["IMAX", "3D", "2D"] },
  { id: 4, title: "The Witcher Chronicles", genre: "Fantasy", rating: 8.2, runtime: "2h 35m", poster: "from-purple-800 via-purple-900 to-slate-950", badge: "NEW", badgeColor: "bg-emerald-500", languages: ["2D", "3D"] },
  { id: 5, title: "Interstellar 2", genre: "Sci-Fi", rating: 9.3, runtime: "2h 55m", poster: "from-blue-800 via-blue-900 to-slate-950", badge: "MUST WATCH", badgeColor: "bg-purple-500", languages: ["IMAX"] },
  { id: 6, title: "Fast & Furious 12", genre: "Action", rating: 7.6, runtime: "2h 10m", poster: "from-orange-700 via-orange-900 to-slate-950", badge: "", badgeColor: "", languages: ["2D", "3D", "4DX"] },
];

const CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata", "Ahmedabad"];

const UPCOMING_EVENTS = [
  { id: 1, name: "Coldplay World Tour 2026", date: "Apr 15, 2026", venue: "DY Patil Stadium, Mumbai", price: "₹2,499", image: "from-cyan-700 via-blue-800 to-indigo-950", category: "Concert" },
  { id: 2, name: "IPL Final 2026", date: "May 28, 2026", venue: "Wankhede Stadium, Mumbai", price: "₹999", image: "from-blue-700 via-indigo-800 to-slate-950", category: "Sports" },
  { id: 3, name: "Ed Sheeran Live", date: "Jun 3, 2026", venue: "NSCI Dome, Mumbai", price: "₹3,999", image: "from-orange-700 via-red-800 to-rose-950", category: "Concert" },
];

const GENRES = ["All", "Action", "Sci-Fi", "Drama", "Fantasy", "Thriller", "Comedy", "Animation"];

export function HomePage() {
  const [, navigate] = useLocation();
  const [selectedCity, setSelectedCity] = useState("Mumbai");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMovies = MOVIES.filter(m => {
    const matchesGenre = selectedGenre === "All" || m.genre === selectedGenre;
    const matchesSearch = !searchQuery || m.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#12122a] to-[#0a0a0f]" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#e63946]/8 rounded-full blur-[100px]" />
          <div className="absolute -bottom-40 -left-20 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-purple-600/5 rounded-full blur-[80px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-24 pt-32">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1.5 bg-[#e63946]/10 border border-[#e63946]/20 rounded-full px-3 py-1">
                <Flame className="w-3.5 h-3.5 text-[#e63946]" />
                <span className="text-xs font-medium text-[#e63946]">Now Booking — Dune: Part Three</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-none">
              Your Cinema,<br />
              <span className="bg-gradient-to-r from-[#e63946] via-[#ff6b6b] to-[#ff8f3f] bg-clip-text text-transparent">
                Your Universe
              </span>
            </h1>
            <p className="text-lg text-white/50 mb-10 max-w-xl leading-relaxed">
              Book tickets for the latest movies and live events. Experience entertainment like never before with smart seat selection and instant confirmation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <div className="flex-1 flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-white/20 transition-colors">
                <Search className="w-5 h-5 text-white/30 shrink-0" />
                <input
                  className="bg-transparent flex-1 text-white placeholder-white/30 outline-none text-sm"
                  placeholder="Search movies, events, venues..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:border-white/20 transition-colors">
                <MapPin className="w-4 h-4 text-[#e63946]" />
                <select
                  className="bg-transparent text-white text-sm outline-none cursor-pointer"
                  value={selectedCity}
                  onChange={e => setSelectedCity(e.target.value)}
                >
                  {CITIES.map(c => <option key={c} value={c} className="bg-[#1a1a2e]">{c}</option>)}
                </select>
              </div>
              <button
                onClick={() => navigate("/movies/1")}
                className="bg-[#e63946] hover:bg-[#c1121f] text-white font-semibold px-6 py-3 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-red-500/20"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
            <div className="flex items-center gap-8">
              {[
                { icon: Film, color: "text-[#e63946]", value: "500+", label: "Movies" },
                { icon: Zap, color: "text-amber-400", value: "2000+", label: "Venues" },
                { icon: Award, color: "text-emerald-400", value: "50M+", label: "Bookings" },
              ].map(({ icon: Icon, color, value, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${color}`} />
                  <div>
                    <div className="text-lg font-bold">{value}</div>
                    <div className="text-xs text-white/40">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 hidden xl:flex items-center gap-4 pr-12 opacity-30">
          {MOVIES.slice(0, 3).map((m, i) => (
            <div key={m.id} className={`w-40 rounded-2xl bg-gradient-to-b ${m.poster} border border-white/10`}
              style={{ height: `${380 - i * 40}px`, marginTop: `${i * 24}px` }} />
          ))}
        </div>
      </section>

      {/* Now Showing */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#e63946] text-sm font-medium mb-2">
              <TrendingUp className="w-4 h-4" />
              NOW SHOWING
            </div>
            <h2 className="text-3xl font-bold">Trending This Week</h2>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex gap-1.5 flex-wrap">
              {GENRES.slice(0, 6).map(g => (
                <button key={g} onClick={() => setSelectedGenre(g)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                    selectedGenre === g ? "bg-[#e63946] text-white shadow-lg shadow-red-500/20" : "bg-white/5 border border-white/8 text-white/60 hover:text-white"
                  }`}>
                  {g}
                </button>
              ))}
            </div>
            <button className="text-white/40 hover:text-white flex items-center gap-1 text-sm ml-2 transition-colors">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {filteredMovies.map(movie => (
            <div key={movie.id} className="group relative cursor-pointer"
              onMouseEnter={() => setHoveredMovie(movie.id)}
              onMouseLeave={() => setHoveredMovie(null)}
              onClick={() => navigate(`/movies/${movie.id}`)}
            >
              <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-b ${movie.poster} aspect-[2/3] mb-3 border border-white/8 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-black/50`}>
                {movie.badge && (
                  <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold ${movie.badgeColor}`}>
                    {movie.badge}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {hoveredMovie === movie.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div className="w-12 h-12 rounded-full bg-[#e63946] flex items-center justify-center shadow-lg shadow-red-500/30">
                      <Play className="w-5 h-5 text-white ml-0.5" />
                    </div>
                  </div>
                )}
                <div className="absolute bottom-2 left-0 right-0 px-2">
                  <div className="flex flex-wrap gap-1">
                    {movie.languages.slice(0, 2).map(l => (
                      <span key={l} className="text-[10px] bg-black/60 border border-white/20 rounded px-1.5 py-0.5">{l}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold group-hover:text-[#e63946] transition-colors truncate">{movie.title}</h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-white/40">{movie.genre}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-medium text-amber-400">{movie.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3 text-white/30" />
                  <span className="text-xs text-white/30">{movie.runtime}</span>
                </div>
              </div>
              {hoveredMovie === movie.id && (
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/movies/${movie.id}`); }}
                  className="w-full mt-2 py-2 bg-[#e63946] hover:bg-[#c1121f] text-white text-xs font-bold rounded-xl transition-colors shadow-lg shadow-red-500/20"
                >
                  Book Now
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-2">
              <Calendar className="w-4 h-4" />
              LIVE EVENTS
            </div>
            <h2 className="text-3xl font-bold">Upcoming Events</h2>
          </div>
          <button className="text-white/40 hover:text-white flex items-center gap-1 text-sm transition-colors">
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {UPCOMING_EVENTS.map(event => (
            <div key={event.id} className="group relative rounded-2xl overflow-hidden border border-white/8 hover:border-white/15 transition-all cursor-pointer"
              onClick={() => navigate("/movies/1")}>
              <div className={`h-48 bg-gradient-to-br ${event.image} relative`}>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1 text-xs font-medium">
                  {event.category}
                </div>
              </div>
              <div className="p-5 bg-[#12121e]">
                <h3 className="text-lg font-bold mb-2 group-hover:text-[#e63946] transition-colors">{event.name}</h3>
                <div className="flex items-center gap-2 text-sm text-white/50 mb-1">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  {event.date}
                </div>
                <div className="flex items-center gap-2 text-sm text-white/50 mb-4">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  {event.venue}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-white/30">Starting from</span>
                    <div className="text-xl font-bold">{event.price}</div>
                  </div>
                  <button className="flex items-center gap-1.5 bg-[#e63946] hover:bg-[#c1121f] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors group/btn">
                    Book <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
