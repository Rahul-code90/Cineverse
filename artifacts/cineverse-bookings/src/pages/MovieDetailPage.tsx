import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Star, Clock, Play, Heart, Share2, Calendar, MapPin, Users, Award, Zap, ArrowRight, Loader2 } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { api, type Showtime } from "../lib/api";
import { useApp } from "../contexts/AppContext";

const VENUES = ["PVR ICON, Andheri West", "INOX Grand, Bandra", "Cinepolis, Goregaon", "Carnival Cinemas, Thane"];
const DATES = [
  { day: "Thu", date: "03", full: "2026-04-03", label: "Apr 03, 2026" },
  { day: "Fri", date: "04", full: "2026-04-04", label: "Apr 04, 2026" },
  { day: "Sat", date: "05", full: "2026-04-05", label: "Apr 05, 2026" },
  { day: "Sun", date: "06", full: "2026-04-06", label: "Apr 06, 2026" },
  { day: "Mon", date: "07", full: "2026-04-07", label: "Apr 07, 2026" },
  { day: "Tue", date: "08", full: "2026-04-08", label: "Apr 08, 2026" },
];

const FORMAT_CLASSES: Record<string, string> = {
  IMAX: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "4DX": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "3D": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "2D": "bg-white/10 text-white/50 border-white/10",
};

export function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const movieId = parseInt(id || "1");
  const [, navigate] = useLocation();
  const { setBookingSession } = useApp();
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedVenue, setSelectedVenue] = useState(VENUES[0]);
  const [selectedShow, setSelectedShow] = useState<Showtime | null>(null);
  const [liked, setLiked] = useState(false);
  const [imgError, setImgError] = useState(false);

  const { data: movieData, isLoading: movieLoading } = useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => api.movies.get(movieId),
  });

  const { data: showtimesData, isLoading: showtimesLoading } = useQuery({
    queryKey: ["showtimes", movieId, DATES[selectedDate].full],
    queryFn: () => api.movies.showtimes(movieId, DATES[selectedDate].full),
  });

  const movie = movieData?.movie;
  const allShowtimes = showtimesData?.showtimes || [];
  const showtimes = allShowtimes.filter(s => s.venue === selectedVenue).slice(0, 6);

  const handleSelectSeats = () => {
    if (!selectedShow || !movie) return;
    setBookingSession({
      movieId: movie.id,
      movieTitle: movie.title,
      showtimeId: selectedShow.id,
      venue: selectedShow.venue,
      date: DATES[selectedDate].label,
      time: selectedShow.time,
      format: selectedShow.format,
      seats: [],
      totalAmount: 0,
      convenienceFee: 0,
      posterUrl: movie.posterUrl,
      posterGradient: movie.posterGradient,
    });
    navigate("/seats");
  };

  if (movieLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-10 h-10 text-[#e63946] animate-spin" />
    </div>
  );

  if (!movie) return (
    <div className="flex items-center justify-center min-h-screen text-white/50">Movie not found</div>
  );

  const cast = Array.isArray(movie.cast) ? movie.cast : [];

  return (
    <div>
      <div className="relative h-[55vh] min-h-[420px] overflow-hidden">
        {!imgError && movie.backdropUrl ? (
          <img src={movie.backdropUrl} alt={movie.title} className="absolute inset-0 w-full h-full object-cover" onError={() => setImgError(true)} />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${movie.posterGradient}`} />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-10 pt-24">
          <div className="flex gap-8 items-end w-full flex-wrap">
            <div className="hidden md:block w-40 h-60 rounded-2xl overflow-hidden border border-white/10 shrink-0 shadow-2xl shadow-black/50">
              {!imgError && movie.posterUrl ? (
                <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" onError={() => setImgError(true)} />
              ) : (
                <div className={`w-full h-full bg-gradient-to-b ${movie.posterGradient}`} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {movie.badge && <span className={`text-white text-xs font-bold px-2 py-0.5 rounded-md ${
                  movie.badge === "HOT" ? "bg-[#e63946]" :
                  movie.badge === "NEW" ? "bg-emerald-500" :
                  movie.badge === "TRENDING" ? "bg-amber-500" : "bg-purple-500"
                }`}>{movie.badge}</span>}
                <span className="bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold px-2 py-0.5 rounded-md">{movie.certificate}</span>
                <span className="text-white/40 text-sm">{movie.genre}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">{movie.title}</h1>
              <div className="flex flex-wrap items-center gap-5 text-sm text-white/60">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-white font-semibold">{movie.rating?.toFixed(1)}</span>
                  <span>({(movie.votes / 1000).toFixed(1)}K)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /><span>{movie.runtime}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-400">Critics' Choice</span>
                </div>
                <span>{(movie.languages as string[]).join(" · ")}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button onClick={() => setLiked(!liked)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                  liked ? "bg-[#e63946]/20 border-[#e63946]/40 text-[#e63946]" : "bg-white/5 border-white/10 text-white/50 hover:text-white"
                }`}>
                <Heart className={`w-5 h-5 ${liked ? "fill-[#e63946]" : ""}`} />
              </button>
              <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-white/50 hover:text-white transition-all">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="flex items-center gap-2 bg-white/10 border border-white/20 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-white/15 transition-all">
                <Play className="w-4 h-4" />Watch Trailer
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="text-lg font-bold mb-4">Synopsis</h2>
              <p className="text-white/60 leading-relaxed">{movie.synopsis}</p>
            </div>

            {cast.length > 0 && (
              <div>
                <h2 className="text-lg font-bold mb-4">Cast & Crew</h2>
                <div className="flex items-center gap-2 text-sm text-white/40 mb-4">
                  <span>Directed by</span>
                  <span className="text-white font-medium">{movie.director}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {cast.map((member: any) => (
                    <div key={member.name} className="text-center group cursor-pointer">
                      <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${member.color} mb-3 border border-white/10 group-hover:scale-105 transition-transform shadow-lg`} />
                      <div className="text-sm font-medium">{member.name}</div>
                      <div className="text-xs text-white/40">{member.role}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Audience Reviews</h2>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-bold">{movie.rating?.toFixed(1)}</span>
                  </div>
                  <span className="text-white/20">·</span>
                  <span className="text-sm text-white/40">{(movie.votes / 1000).toFixed(1)}K ratings</span>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { user: "Rahul K.", rating: 9.5, comment: "Breathtaking visuals and an epic storyline. The director has outdone himself!", date: "2 days ago" },
                  { user: "Priya S.", rating: 9.0, comment: "A masterpiece. The IMAX experience is absolutely worth it.", date: "3 days ago" },
                  { user: "Amit T.", rating: 8.5, comment: "Dense narrative but rewarding. The lead performance is phenomenal.", date: "4 days ago" },
                ].map((review, i) => (
                  <div key={i} className="bg-white/3 border border-white/6 rounded-2xl p-4 hover:border-white/10 transition-colors">
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

          <div>
            <div className="bg-[#12121e] border border-white/10 rounded-2xl p-5 sticky top-20">
              <h2 className="text-lg font-bold mb-5">Book Tickets</h2>
              <div className="mb-5">
                <div className="text-xs text-white/40 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />Select Date
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {DATES.map((d, i) => (
                    <button key={i} onClick={() => { setSelectedDate(i); setSelectedShow(null); }}
                      className={`flex flex-col items-center min-w-[48px] py-2.5 px-2.5 rounded-xl text-xs transition-all ${
                        selectedDate === i ? "bg-[#e63946] text-white shadow-lg shadow-red-500/20" : "bg-white/5 border border-white/8 text-white/50 hover:bg-white/10"
                      }`}>
                      <span className="font-medium">{d.day}</span>
                      <span className={`text-lg font-bold mt-0.5 ${selectedDate === i ? "text-white" : "text-white/80"}`}>{d.date}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <div className="text-xs text-white/40 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" />Select Venue
                </div>
                <select value={selectedVenue} onChange={e => { setSelectedVenue(e.target.value); setSelectedShow(null); }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none cursor-pointer hover:border-white/20 transition-colors">
                  {VENUES.map(v => <option key={v} className="bg-[#1a1a2e]">{v}</option>)}
                </select>
              </div>

              <div className="mb-5">
                <div className="text-xs text-white/40 uppercase tracking-wider mb-3">Show Times</div>
                {showtimesLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="w-5 h-5 text-white/30 animate-spin" />
                  </div>
                ) : showtimes.length === 0 ? (
                  <p className="text-xs text-white/30 text-center py-4">No shows for this date/venue</p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {showtimes.map((show) => (
                      <button key={show.id} onClick={() => setSelectedShow(show)}
                        className={`p-3 rounded-xl text-left border transition-all ${
                          selectedShow?.id === show.id ? "border-[#e63946] bg-[#e63946]/10" : "border-white/8 bg-white/3 hover:border-white/15"
                        }`}>
                        <div className="font-semibold text-sm">{show.time}</div>
                        <div className="flex items-center justify-between mt-1">
                          <span className={`text-xs font-medium px-1.5 py-0.5 rounded border ${FORMAT_CLASSES[show.format] || "bg-white/10 text-white/50 border-white/10"}`}>
                            {show.format}
                          </span>
                          <span className="text-xs text-white/40">₹{show.price}</span>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-white/30 mb-1">
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{show.availableSeats}/{show.totalSeats}</span>
                            <span className={show.availableSeats < 50 ? "text-[#e63946]" : "text-emerald-400"}>
                              {show.availableSeats < 50 ? "Fast Filling" : "Available"}
                            </span>
                          </div>
                          <div className="w-full bg-white/5 rounded-full h-1">
                            <div className={`h-1 rounded-full ${show.availableSeats < 50 ? "bg-[#e63946]" : "bg-emerald-500"}`}
                              style={{ width: `${(show.availableSeats / show.totalSeats) * 100}%` }} />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={handleSelectSeats}
                className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  selectedShow ? "bg-[#e63946] hover:bg-[#c1121f] text-white shadow-lg shadow-[#e63946]/20" : "bg-white/5 border border-white/8 text-white/30 cursor-not-allowed"
                }`}>
                <Zap className="w-4 h-4" />
                {selectedShow ? "Select Seats" : "Choose a Showtime"}
                {selectedShow && <ArrowRight className="w-4 h-4" />}
              </button>
              {selectedShow && <p className="mt-3 text-center text-xs text-white/25">Tickets will be held for 10 minutes</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
