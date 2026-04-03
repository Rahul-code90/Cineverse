import { useState, useEffect } from "react";
import { Play, Star, Clock, ChevronLeft, ChevronRight, Volume2, VolumeX, Search, Bell, User, Film, ArrowRight, Ticket } from "lucide-react";

const FEATURED = [
  {
    id: 1, title: "Dune: Part Three", tagline: "The legend ends. The universe begins.",
    genre: "Sci-Fi · Adventure", rating: 9.1, runtime: "2h 45m",
    from: "from-[#4a2c0a]", via: "via-[#2a1a06]", to: "to-[#0a0a0f]",
    accent: "#d97706", glow: "rgba(217,119,6,0.3)", badge: "NOW IN IMAX",
    desc: "Paul Atreides unites the galaxy in an epic final chapter of the most ambitious sci-fi saga of the century.",
    score: 98, votes: "128K",
  },
  {
    id: 2, title: "Interstellar 2", tagline: "Beyond time. Beyond space. Beyond love.",
    genre: "Sci-Fi · Drama", rating: 9.3, runtime: "2h 55m",
    from: "from-[#0a1a3a]", via: "via-[#06102a]", to: "to-[#0a0a0f]",
    accent: "#3b82f6", glow: "rgba(59,130,246,0.3)", badge: "MUST WATCH",
    desc: "Nolan returns to the cosmos with a breathtaking journey that redefines the limits of human imagination.",
    score: 99, votes: "94K",
  },
  {
    id: 3, title: "Spider-Man: Beyond", tagline: "With great power comes an infinite multiverse.",
    genre: "Action · Adventure", rating: 8.5, runtime: "2h 20m",
    from: "from-[#3a0a0a]", via: "via-[#200606]", to: "to-[#0a0a0f]",
    accent: "#e63946", glow: "rgba(230,57,70,0.3)", badge: "TRENDING",
    desc: "Peter Parker faces his greatest challenge yet as the boundaries between worlds collapse around him.",
    score: 91, votes: "215K",
  },
  {
    id: 4, title: "The Witcher Chronicles", tagline: "Magic fades. Monsters rise. Geralt hunts.",
    genre: "Fantasy · Drama", rating: 8.2, runtime: "2h 35m",
    from: "from-[#1a0a3a]", via: "via-[#100620]", to: "to-[#0a0a0f]",
    accent: "#a855f7", glow: "rgba(168,85,247,0.3)", badge: "NEW RELEASE",
    desc: "The final season of the legendary saga delivers an explosive conclusion three decades in the making.",
    score: 87, votes: "67K",
  },
];

const UPCOMING = [
  { title: "Oppenheimer 2", genre: "Drama", rating: 8.8, color: "from-gray-700 to-gray-900" },
  { title: "Fast & Furious 12", genre: "Action", rating: 7.6, color: "from-orange-700 to-orange-950" },
  { title: "Coldplay Tour", genre: "Concert", rating: 9.5, color: "from-cyan-700 to-blue-950" },
  { title: "Inception 2", genre: "Thriller", rating: 9.0, color: "from-indigo-700 to-indigo-950" },
  { title: "Avatar 3", genre: "Sci-Fi", rating: 8.7, color: "from-teal-700 to-teal-950" },
];

export function HomepageA_Cinematic() {
  const [current, setCurrent] = useState(0);
  const [muted, setMuted] = useState(true);
  const [animating, setAnimating] = useState(false);

  const go = (dir: 1 | -1) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(c => (c + dir + FEATURED.length) % FEATURED.length);
      setAnimating(false);
    }, 300);
  };

  useEffect(() => {
    const t = setInterval(() => go(1), 5000);
    return () => clearInterval(t);
  }, [current]);

  const film = FEATURED[current];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Minimal floating nav */}
      <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#e63946] to-[#ff6b6b] flex items-center justify-center">
            <Film className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-black tracking-tight">Cine<span className="text-[#e63946]">Verse</span></span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-4 py-2">
            <Search className="w-3.5 h-3.5 text-white/40" />
            <input className="bg-transparent text-sm outline-none text-white placeholder-white/30 w-40" placeholder="Search..." />
          </div>
          <button className="w-9 h-9 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10">
            <Bell className="w-4 h-4 text-white/60" />
          </button>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#e63946] to-[#ff6b6b] flex items-center justify-center text-sm font-bold cursor-pointer">R</div>
        </div>
      </nav>

      {/* Cinematic Hero — full screen */}
      <div className="relative h-screen overflow-hidden">
        {/* Background gradient that changes per film */}
        <div
          className={`absolute inset-0 bg-gradient-to-br transition-all duration-700 ${film.from} ${film.via} ${film.to}`}
          style={{ opacity: animating ? 0 : 1, transition: "opacity 0.4s ease" }}
        />
        {/* Glow orb matching film accent */}
        <div
          className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full blur-[150px] transition-all duration-700"
          style={{ background: film.glow, opacity: animating ? 0 : 0.6 }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />

        {/* Decorative poster silhouette (right side) */}
        <div
          className={`absolute right-20 top-1/2 -translate-y-1/2 w-72 h-[430px] rounded-3xl bg-gradient-to-b transition-all duration-700 ${film.from.replace("from-", "from-")} to-transparent border border-white/10 shadow-2xl`}
          style={{ opacity: animating ? 0 : 0.4 }}
        />

        {/* Content */}
        <div className="relative z-10 h-full flex items-center px-12 lg:px-20">
          <div className="max-w-2xl" style={{ opacity: animating ? 0 : 1, transition: "opacity 0.35s ease, transform 0.35s ease", transform: animating ? "translateY(10px)" : "translateY(0)" }}>
            <div className="flex items-center gap-2 mb-5">
              <span
                className="text-xs font-black px-3 py-1 rounded-full tracking-wider"
                style={{ background: film.accent + "30", color: film.accent, border: `1px solid ${film.accent}50` }}
              >
                {film.badge}
              </span>
              <span className="text-xs text-white/40">{film.genre}</span>
            </div>
            <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-none mb-4">{film.title}</h1>
            <p className="text-base text-white/50 italic mb-6 font-light tracking-wide">"{film.tagline}"</p>
            <p className="text-white/60 text-base leading-relaxed mb-8 max-w-xl">{film.desc}</p>

            <div className="flex items-center gap-6 mb-10">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-black text-lg">{film.rating}</span>
                <span className="text-white/30 text-sm">/ 10</span>
              </div>
              <span className="w-px h-5 bg-white/15" />
              <div className="flex items-center gap-1.5 text-white/50 text-sm">
                <Clock className="w-4 h-4" />
                {film.runtime}
              </div>
              <span className="w-px h-5 bg-white/15" />
              <div className="text-sm text-white/40">{film.votes} ratings</div>
            </div>

            <div className="flex items-center gap-4">
              <button
                className="flex items-center gap-3 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200 hover:scale-105 shadow-xl"
                style={{ background: film.accent, boxShadow: `0 10px 40px ${film.glow}` }}
              >
                <Ticket className="w-5 h-5" />
                Book Tickets
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-2 text-white/70 font-medium px-6 py-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all">
                <Play className="w-4 h-4" />
                Watch Trailer
              </button>
              <button
                onClick={() => setMuted(!muted)}
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                {muted ? <VolumeX className="w-4 h-4 text-white/40" /> : <Volume2 className="w-4 h-4 text-white/60" />}
              </button>
            </div>
          </div>
        </div>

        {/* Nav controls — bottom left */}
        <div className="absolute bottom-10 left-12 lg:left-20 z-20 flex items-center gap-4">
          <button onClick={() => go(-1)} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center hover:bg-white/20 transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-2">
            {FEATURED.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === current ? "32px" : "8px",
                  background: i === current ? film.accent : "rgba(255,255,255,0.2)"
                }}
              />
            ))}
          </div>
          <button onClick={() => go(1)} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center hover:bg-white/20 transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Popularity meter — right side */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2">
          <span className="text-[10px] text-white/30 uppercase tracking-widest" style={{ writingMode: "vertical-rl" }}>popularity</span>
          <div className="w-1 h-32 bg-white/10 rounded-full overflow-hidden">
            <div className="w-full bg-gradient-to-t from-[#e63946] to-amber-400 rounded-full transition-all duration-700" style={{ height: `${film.score}%` }} />
          </div>
          <span className="text-sm font-black">{film.score}</span>
        </div>
      </div>

      {/* Upcoming strip below fold */}
      <div className="px-12 lg:px-20 py-10 bg-gradient-to-b from-[#0a0a0f] to-[#0d0d15]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white/80">Also Playing</h2>
          <button className="text-sm text-white/30 hover:text-white transition-colors flex items-center gap-1">All movies <ArrowRight className="w-3.5 h-3.5" /></button>
        </div>
        <div className="flex gap-4">
          {UPCOMING.map((m, i) => (
            <div key={i} className="group flex-1 cursor-pointer">
              <div className={`h-24 rounded-xl bg-gradient-to-br ${m.color} border border-white/8 mb-2 group-hover:scale-105 group-hover:border-white/20 transition-all duration-200 flex items-end p-2`}>
                <span className="text-[10px] bg-black/50 rounded px-1.5 py-0.5">{m.genre}</span>
              </div>
              <div className="text-xs font-semibold truncate">{m.title}</div>
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="text-[11px] text-amber-400">{m.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
