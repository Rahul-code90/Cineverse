import { useState } from "react";
import { Film, MapPin, Bell, Star, Clock, Users, TrendingUp, MessageCircle, Heart, Share2, ChevronRight, ArrowRight, Flame, Ticket } from "lucide-react";

const FRIENDS_ACTIVITY = [
  { name: "Priya S.", initials: "PS", color: "from-pink-500 to-rose-600", movie: "Dune: Part Three", action: "just booked", time: "2m ago", seats: "C4–C6", venue: "PVR ICON" },
  { name: "Rahul K.", initials: "RK", color: "from-blue-500 to-indigo-600", movie: "Interstellar 2", action: "wants to watch", time: "15m ago", seats: null, venue: null },
  { name: "Amit T.", initials: "AT", color: "from-emerald-500 to-teal-600", movie: "Spider-Man: Beyond", action: "rated 9/10", time: "1h ago", seats: null, venue: "INOX Bandra" },
  { name: "Neha M.", initials: "NM", color: "from-amber-500 to-orange-600", movie: "Coldplay Tour", action: "going to", time: "2h ago", seats: "Block B", venue: "DY Patil" },
];

const TRENDING_LOCAL = [
  { rank: 1, title: "Dune: Part Three", venue: "PVR ICON, Andheri", filling: 92, genre: "Sci-Fi", color: "from-amber-800 to-amber-950", hot: true },
  { rank: 2, title: "Coldplay World Tour", venue: "DY Patil Stadium", filling: 98, genre: "Concert", color: "from-cyan-800 to-blue-950", hot: true },
  { rank: 3, title: "Interstellar 2", venue: "INOX Grand, Bandra", filling: 75, genre: "Sci-Fi", color: "from-blue-800 to-blue-950", hot: false },
  { rank: 4, title: "Spider-Man: Beyond", venue: "Cinepolis, Goregaon", filling: 64, genre: "Action", color: "from-red-800 to-red-950", hot: false },
];

const COMMUNITY_PICKS = [
  { title: "Must Watch in IMAX", curator: "CineVerse Team", movies: ["Dune: Part Three", "Interstellar 2", "Oppenheimer 2"], likes: 4821 },
  { title: "Best of 2026 So Far", curator: "Top Critics", movies: ["Interstellar 2", "The Witcher", "Spider-Man: Beyond"], likes: 3204 },
  { title: "Mumbai's Favorites This Week", curator: "Community", movies: ["Dune: Part Three", "Coldplay Tour", "IPL Final"], likes: 2845 },
];

const POSTS = [
  { user: "Ravi P.", initials: "RP", color: "from-purple-500 to-indigo-600", movie: "Dune: Part Three", text: "Absolutely mind-blowing in IMAX. Villeneuve is a genius. Go watch this NOW.", rating: 10, likes: 182, time: "3h ago" },
  { user: "Sonia G.", initials: "SG", color: "from-pink-500 to-rose-600", movie: "Coldplay Tour", text: "Night of my life. Yellow live gave me chills. Already looking for encore dates!", rating: 10, likes: 341, time: "8h ago" },
];

export function HomepageD_SocialCity() {
  const [city, setCity] = useState("Mumbai");
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  const toggleLike = (i: number) => {
    setLikedPosts(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  };

  return (
    <div className="min-h-screen bg-[#09090f] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#09090f]/90 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-5 py-3.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#e63946] to-[#ff6b6b] flex items-center justify-center">
            <Film className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-black">Cine<span className="text-[#e63946]">Verse</span></span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/8 rounded-full px-3 py-1.5 text-sm">
            <MapPin className="w-3.5 h-3.5 text-[#e63946]" />
            <select className="bg-transparent outline-none cursor-pointer text-white/80 text-sm">
              {["Mumbai", "Delhi", "Bangalore"].map(c => <option key={c} className="bg-[#1a1a2e]">{c}</option>)}
            </select>
          </div>
          <div className="relative">
            <Bell className="w-4 h-4 text-white/60" />
            <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[#e63946] rounded-full" />
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e63946] to-[#ff6b6b] flex items-center justify-center text-xs font-bold">R</div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-5 py-6 grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Left column: Friends + Posts */}
        <div className="md:col-span-2 space-y-5">
          {/* Friends Activity */}
          <div className="bg-[#12121e] border border-white/8 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold flex items-center gap-2">
                <Users className="w-4 h-4 text-white/40" /> Friends Activity
              </h2>
              <button className="text-xs text-white/30 hover:text-white transition-colors">See all</button>
            </div>
            <div className="space-y-3">
              {FRIENDS_ACTIVITY.map((f, i) => (
                <div key={i} className="flex items-start gap-3 group">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${f.color} flex items-center justify-center text-xs font-bold shrink-0`}>
                    {f.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm">
                      <span className="font-semibold">{f.name}</span>
                      <span className="text-white/40"> {f.action} </span>
                      <span className="font-semibold text-[#e63946]">{f.movie}</span>
                      {f.venue && <span className="text-white/40"> at {f.venue}</span>}
                    </div>
                    {f.seats && (
                      <span className="text-[11px] text-white/30">Seats: {f.seats}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-white/25">{f.time}</span>
                    {f.action === "just booked" || f.action === "going to" ? (
                      <button className="text-[11px] border border-[#e63946]/40 text-[#e63946] rounded-full px-2 py-0.5 hover:bg-[#e63946]/10 transition-colors">Join</button>
                    ) : (
                      <button className="text-[11px] border border-white/10 text-white/40 rounded-full px-2 py-0.5 hover:bg-white/8 transition-colors">Plan together</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Community posts */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-white/40" /> What People Are Saying
              </h2>
            </div>
            <div className="space-y-4">
              {POSTS.map((post, i) => (
                <div key={i} className="bg-[#12121e] border border-white/8 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${post.color} flex items-center justify-center text-xs font-bold shrink-0`}>
                      {post.initials}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm">{post.user}</span>
                        <span className="text-[11px] text-white/25">{post.time}</span>
                      </div>
                      <div className="text-xs text-[#e63946]/80 font-medium mb-2">{post.movie}</div>
                      <p className="text-sm text-white/70 leading-relaxed mb-3">{post.text}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex">
                          {Array.from({ length: post.rating }).map((_, ri) => (
                            <Star key={ri} className="w-3 h-3 text-amber-400 fill-amber-400" />
                          ))}
                        </div>
                        <button
                          onClick={() => toggleLike(i)}
                          className={`flex items-center gap-1.5 text-xs transition-colors ${likedPosts.includes(i) ? "text-[#e63946]" : "text-white/30 hover:text-white/60"}`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${likedPosts.includes(i) ? "fill-[#e63946]" : ""}`} />
                          {post.likes + (likedPosts.includes(i) ? 1 : 0)}
                        </button>
                        <button className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors">
                          <Share2 className="w-3.5 h-3.5" /> Share
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Trending + Collections */}
        <div className="space-y-5">
          {/* Trending in City */}
          <div className="bg-[#12121e] border border-white/8 rounded-2xl p-4">
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#e63946]" />
              Trending in {city}
            </h2>
            <div className="space-y-3">
              {TRENDING_LOCAL.map((item, i) => (
                <div key={i} className="flex items-center gap-3 cursor-pointer group">
                  <span className={`text-lg font-black w-6 text-center ${i === 0 ? "text-[#e63946]" : "text-white/20"}`}>
                    {item.rank}
                  </span>
                  <div className={`w-10 h-12 rounded-xl bg-gradient-to-b ${item.color} border border-white/10 shrink-0 flex items-end p-1`}>
                    <div className={`w-full h-1 rounded-full ${item.filling > 80 ? "bg-[#e63946]" : "bg-white/20"}`} style={{ width: `${item.filling}%` }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate group-hover:text-[#e63946] transition-colors">{item.title}</div>
                    <div className="text-[11px] text-white/35 truncate">{item.venue}</div>
                    <div className="flex items-center gap-1 mt-0.5">
                      {item.hot && <Flame className="w-3 h-3 text-[#e63946]" />}
                      <span className={`text-[11px] font-semibold ${item.filling > 80 ? "text-[#e63946]" : "text-white/30"}`}>
                        {item.filling}% full
                      </span>
                    </div>
                  </div>
                  <button className="shrink-0 text-xs bg-[#e63946]/10 border border-[#e63946]/25 text-[#e63946] rounded-lg px-2 py-1 hover:bg-[#e63946]/20 transition-colors">
                    Book
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Curated Collections */}
          <div className="bg-[#12121e] border border-white/8 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-sm">Curated Collections</h2>
              <ChevronRight className="w-4 h-4 text-white/25" />
            </div>
            <div className="space-y-3">
              {COMMUNITY_PICKS.map((pick, i) => (
                <div key={i} className="cursor-pointer group p-3 rounded-xl bg-white/3 border border-white/6 hover:border-white/12 transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-sm font-semibold group-hover:text-[#e63946] transition-colors">{pick.title}</div>
                      <div className="text-[11px] text-white/30">{pick.curator}</div>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-white/30">
                      <Heart className="w-3 h-3" /> {(pick.likes / 1000).toFixed(1)}K
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {pick.movies.slice(0, 3).map((m, mi) => (
                      <span key={mi} className="text-[10px] bg-white/5 border border-white/8 rounded-md px-1.5 py-0.5 truncate max-w-[80px]">{m}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick CTA */}
          <button className="w-full bg-gradient-to-r from-[#e63946] to-[#c1121f] rounded-2xl p-4 flex items-center justify-between hover:opacity-90 transition-opacity">
            <div className="text-left">
              <div className="font-bold">Book Group Tickets</div>
              <div className="text-xs text-white/70 mt-0.5">Get 10% off on 4+ seats</div>
            </div>
            <Ticket className="w-6 h-6" />
          </button>
        </div>

      </div>
    </div>
  );
}
