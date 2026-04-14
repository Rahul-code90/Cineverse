import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Play, Star, Clock, ChevronRight, MapPin, Calendar, Flame, TrendingUp, Award, Zap, ArrowRight, Film, Loader2, X, Ticket } from "lucide-react";
import { useLocation } from "wouter";
import { api, type Movie, type Event } from "../lib/api";
import { useApp } from "../contexts/AppContext";

const CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata"];
const GENRES = ["All", "Action", "Sci-Fi", "Drama", "Fantasy", "Thriller", "Comedy", "Animation"];

function MovieCard({ movie, onClick }: { movie: Movie; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group relative cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div className={`relative rounded-2xl overflow-hidden aspect-[2/3] mb-3 border border-white/8 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-black/60`}>
        {!imgError && movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-b ${movie.posterGradient || "from-gray-800 to-gray-950"}`} />
        )}
        {movie.badge && (
          <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold z-10 ${
            movie.badge === "HOT" ? "bg-[#e63946]" :
            movie.badge === "NEW" ? "bg-emerald-500" :
            movie.badge === "TRENDING" ? "bg-amber-500" :
            "bg-purple-500"
          }`}>{movie.badge}</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        {hovered && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 transition-all">
            <button 
              onClick={(e) => { e.stopPropagation(); setSelectedTrailer(movie); }}
              className="w-12 h-12 rounded-full bg-[#e63946] hover:scale-110 active:scale-95 flex items-center justify-center shadow-lg shadow-red-500/30 transition-transform"
              title="Watch Trailer"
            >
              <Play className="w-5 h-5 text-white ml-0.5" />
            </button>
          </div>
        )}
        <div className="absolute bottom-2 left-0 right-0 px-2 z-10">
          <div className="flex flex-wrap gap-1">
            {(movie.languages as string[]).slice(0, 2).map((l: string) => (
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
            <span className="text-xs font-medium text-amber-400">{movie.rating?.toFixed(1)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <Clock className="w-3 h-3 text-white/30" />
          <span className="text-xs text-white/30">{movie.runtime}</span>
        </div>
      </div>
      {hovered && (
        <button
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          className="w-full mt-2 py-2 bg-[#e63946] hover:bg-[#c1121f] text-white text-xs font-bold rounded-xl transition-colors"
        >
          Book Now
        </button>
      )}
    </div>
  );
}

function EventCard({ event, onClick }: { event: Event; onClick: () => void }) {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="group relative rounded-2xl overflow-hidden border border-white/8 hover:border-white/15 transition-all cursor-pointer" onClick={onClick}>
      <div className="h-48 relative">
        {!imgError && event.imageUrl ? (
          <img src={event.imageUrl} alt={event.name} className="w-full h-full object-cover" onError={() => setImgError(true)} />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${event.imageGradient}`} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1 text-xs font-medium">
          {event.category}
        </div>
      </div>
      <div className="p-5 bg-[#12121e]">
        <h3 className="text-lg font-bold mb-2 group-hover:text-[#e63946] transition-colors">{event.name}</h3>
        <div className="flex items-center gap-2 text-sm text-white/50 mb-1">
          <Calendar className="w-3.5 h-3.5 shrink-0" />{event.date}
        </div>
        <div className="flex items-center gap-2 text-sm text-white/50 mb-4">
          <MapPin className="w-3.5 h-3.5 shrink-0" />{event.venue}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-white/30">Starting from</span>
            <div className="text-xl font-bold">₹{event.priceFrom.toLocaleString()}</div>
          </div>
          <button className="flex items-center gap-1.5 bg-[#e63946] hover:bg-[#c1121f] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors group/btn" onClick={(e) => { e.stopPropagation(); onClick(); }}>
            Book <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function HomePage() {
  const [, navigate] = useLocation();
  const [selectedCity, setSelectedCity] = useState("Mumbai");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { isSeeded, setIsSeeded, setBookingSession } = useApp();
  const [selectedTrailer, setSelectedTrailer] = useState<Movie | null>(null);

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    
    // Comprehensive regex for YouTube IDs (Standard, shortened, embed, shorts)
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(regex);
    const videoId = match ? match[1] : (url.length === 11 ? url : "");

    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&rel=0&modestbranding=1&enablejsapi=1` : "";
  };

  const { data: moviesData, isLoading: moviesLoading, refetch: refetchMovies } = useQuery({
    queryKey: ["movies"],
    queryFn: () => api.movies.list(),
  });

  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ["events"],
    queryFn: () => api.events.list(),
  });

  useEffect(() => {
    if (moviesData && moviesData.movies.length > 0 && !isSeeded) {
      setIsSeeded(true);
    }
  }, [moviesData, isSeeded]);

  const movies = moviesData?.movies || [];
  const events = eventsData?.events || [];

  const filteredMovies = movies.filter(m => {
    const matchesGenre = selectedGenre === "All" || m.genre === selectedGenre;
    const matchesSearch = !searchQuery || m.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  const featuredMovie = movies[0];

  return (
    <div>
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#12122a] to-[#0a0a0f]" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#e63946]/8 rounded-full blur-[100px]" />
          <div className="absolute -bottom-40 -left-20 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-24 pt-32">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1.5 bg-[#e63946]/10 border border-[#e63946]/20 rounded-full px-3 py-1">
                <Flame className="w-3.5 h-3.5 text-[#e63946]" />
                <span className="text-xs font-medium text-[#e63946]">
                  Now Booking — {featuredMovie?.title || "Latest Releases"}
                </span>
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
                <input className="bg-transparent flex-1 text-white placeholder-white/30 outline-none text-sm"
                  placeholder="Search movies, events, venues..."
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <MapPin className="w-4 h-4 text-[#e63946]" />
                <select className="bg-transparent text-white text-sm outline-none cursor-pointer" value={selectedCity} onChange={e => setSelectedCity(e.target.value)}>
                  {CITIES.map(c => <option key={c} value={c} className="bg-[#1a1a2e]">{c}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={() => navigate(`/movies/${featuredMovie?.id || 1}`)}
                  className="bg-[#e63946] hover:bg-[#c1121f] text-white font-semibold px-6 py-3 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-red-500/20">
                  <Ticket className="w-4 h-4" />Book Now
                </button>
                {featuredMovie?.trailerUrl && (
                  <button onClick={() => setSelectedTrailer(featuredMovie)}
                    className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-all flex items-center gap-2 border border-white/10">
                    <Play className="w-4 h-4" />Watch Trailer
                  </button>
                )}
              </div>
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

        <div className="absolute right-0 top-0 bottom-0 hidden xl:flex items-center gap-4 pr-12 opacity-25">
          {movies.slice(0, 3).map((m, i) => (
            <div key={m.id} className="relative overflow-hidden rounded-2xl border border-white/10"
              style={{ width: "160px", height: `${380 - i * 40}px`, marginTop: `${i * 24}px` }}>
              {m.posterUrl ? (
                <img src={m.posterUrl} alt={m.title} className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full bg-gradient-to-b ${m.posterGradient}`} />
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#e63946] text-sm font-medium mb-2">
              <TrendingUp className="w-4 h-4" />NOW SHOWING
            </div>
            <h2 className="text-3xl font-bold">Trending This Week</h2>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex gap-1.5 flex-wrap">
              {GENRES.slice(0, 6).map(g => (
                <button key={g} onClick={() => setSelectedGenre(g)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                    selectedGenre === g ? "bg-[#e63946] text-white shadow-lg shadow-red-500/20" : "bg-white/5 border border-white/8 text-white/60 hover:text-white"
                  }`}>{g}</button>
              ))}
            </div>
            <button className="text-white/40 hover:text-white flex items-center gap-1 text-sm ml-2 transition-colors">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {moviesLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#e63946] animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {filteredMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} onClick={() => navigate(`/movies/${movie.id}`)} />
            ))}
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-2">
              <Calendar className="w-4 h-4" />LIVE EVENTS
            </div>
            <h2 className="text-3xl font-bold">Upcoming Events</h2>
          </div>
          <button className="text-white/40 hover:text-white flex items-center gap-1 text-sm transition-colors">
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {eventsLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {events.slice(0, 3).map(event => (
              <EventCard key={event.id} event={event} onClick={() => {
                setBookingSession({
                  eventId: event.id,
                  movieTitle: event.name,
                  venue: event.venue,
                  date: event.date,
                  time: "07:00 PM",
                  format: event.category || "LIVE",
                  seats: [],
                  totalAmount: event.priceFrom,
                  convenienceFee: Math.round(event.priceFrom * 0.1),
                  posterUrl: event.imageUrl,
                  posterGradient: event.imageGradient || "from-gray-800 to-gray-900",
                });
                navigate("/seats");
              }} />
            ))}
          </div>
        )}
      </section>

      {/* Trailer Modal */}
      {selectedTrailer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-10 backdrop-blur-md" onClick={() => setSelectedTrailer(null)}>
          <button className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-[101]" onClick={() => setSelectedTrailer(null)}>
            <X className="w-6 h-6" />
          </button>
          <div className="w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10" onClick={e => e.stopPropagation()}>
            {selectedTrailer.trailerUrl ? (
              <iframe 
                src={getEmbedUrl(selectedTrailer.trailerUrl)}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-white/30">
                <Play className="w-16 h-16 opacity-20" />
                <p>Trailer not available for this title</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
