import { useState } from "react";
import { Film, Star, Clock, ArrowRight, Play, Eye, EyeOff } from "lucide-react";

// Concept: You're peering through a cinema window to sign in.
// The entire background IS the app — movie cards visible behind frosted glass.
// The form is a floating glass panel, not a separate "page". You're already inside.

const BG_MOVIES = [
  { title: "Dune: Part Three", rating: 9.1, time: "01:30 PM", color: "from-amber-800/80 to-amber-950/90", x: "left-4", y: "top-16", w: "w-36", h: "h-52", rotate: "-rotate-2" },
  { title: "Interstellar 2", rating: 9.3, time: "04:00 PM", color: "from-blue-800/80 to-blue-950/90", x: "right-8", y: "top-8", w: "w-32", h: "h-48", rotate: "rotate-3" },
  { title: "Spider-Man", rating: 8.5, time: "06:45 PM", color: "from-red-800/80 to-red-950/90", x: "left-20", y: "bottom-16", w: "w-28", h: "h-42", rotate: "rotate-1" },
  { title: "The Witcher", rating: 8.2, time: "09:30 PM", color: "from-purple-800/80 to-purple-950/90", x: "right-12", y: "bottom-24", w: "w-32", h: "h-44", rotate: "-rotate-3" },
  { title: "Oppenheimer 2", rating: 8.8, time: "03:00 PM", color: "from-gray-700/80 to-gray-950/90", x: "left-1/3", y: "top-4", w: "w-28", h: "h-40", rotate: "rotate-2" },
];

export function LoginC_Immersive() {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [name, setName] = useState("");

  return (
    <div className="min-h-screen bg-[#070710] flex items-center justify-center relative overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* The "cinema" background — blurred movie world behind you */}
      <div className="absolute inset-0">
        {/* Ambient light */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#e63946]/8 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-800/8 rounded-full blur-[150px]" />

        {/* Movie cards scattered in background */}
        {BG_MOVIES.map((m, i) => (
          <div
            key={i}
            className={`absolute ${m.x} ${m.y} ${m.w} ${m.rotate} rounded-xl bg-gradient-to-b ${m.color} border border-white/10 select-none`}
            style={{ height: m.h === "h-42" ? "168px" : m.h === "h-44" ? "176px" : m.h === "h-48" ? "192px" : m.h === "h-52" ? "208px" : "160px" }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-xl" />
            <div className="absolute bottom-2 left-2 right-2">
              <div className="text-[9px] font-bold truncate mb-0.5">{m.title}</div>
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                  <span className="text-[9px] text-amber-400">{m.rating}</span>
                </div>
                <div className="flex items-center gap-0.5 text-[9px] text-white/40">
                  <Clock className="w-2.5 h-2.5" />{m.time}
                </div>
              </div>
            </div>
            <button className="absolute top-2 right-2 w-6 h-6 bg-white/10 rounded-full flex items-center justify-center">
              <Play className="w-3 h-3 text-white/60 ml-0.5" />
            </button>
          </div>
        ))}

        {/* Subtle grid lines */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }} />
      </div>

      {/* Frosted glass form panel — floating over the "cinema" */}
      <div className="relative z-10 w-full max-w-sm mx-4">
        <div
          className="rounded-3xl border border-white/10 p-8 shadow-2xl shadow-black/80"
          style={{ background: "rgba(12, 12, 20, 0.85)", backdropFilter: "blur(32px)" }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#e63946] to-[#ff6b6b] flex items-center justify-center">
              <Film className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-black">Cine<span className="text-[#e63946]">Verse</span></span>
          </div>

          {/* The glass morphism tag */}
          <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs text-white/40 mb-5">
            <div className="w-1.5 h-1.5 bg-[#e63946] rounded-full animate-pulse" />
            4 movies playing near you tonight
          </div>

          <h1 className="text-2xl font-black mb-1">{tab === "signin" ? "Sign in to book" : "Create your account"}</h1>
          <p className="text-white/35 text-sm mb-6">
            {tab === "signin" ? "Your watchlist and bookings are waiting" : "Join to unlock seat selection & rewards"}
          </p>

          {/* Tabs — ultra minimal */}
          <div className="flex gap-4 border-b border-white/8 mb-6">
            {(["signin", "signup"] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`pb-3 text-sm font-semibold border-b-2 -mb-px transition-all ${
                  tab === t ? "border-[#e63946] text-white" : "border-transparent text-white/30 hover:text-white/60"
                }`}
              >
                {t === "signin" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <div className="space-y-3 mb-5">
            {tab === "signup" && (
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/8 focus:border-[#e63946]/40 rounded-xl px-4 py-3 text-sm outline-none placeholder-white/20 transition-colors"
                placeholder="Full name"
              />
            )}
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/8 focus:border-[#e63946]/40 rounded-xl px-4 py-3 text-sm outline-none placeholder-white/20 transition-colors"
              placeholder="Email or mobile"
              type="email"
            />
            <div className="relative">
              <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                type={showPass ? "text" : "password"}
                className="w-full bg-white/5 border border-white/8 focus:border-[#e63946]/40 rounded-xl px-4 py-3 pr-10 text-sm outline-none placeholder-white/20 transition-colors"
                placeholder="Password"
              />
              <button
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {tab === "signin" && (
              <div className="text-right">
                <button className="text-xs text-[#e63946]/70 hover:text-[#e63946] transition-colors">Forgot password?</button>
              </div>
            )}
          </div>

          <button className="w-full py-3 bg-[#e63946] hover:bg-[#c1121f] rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#e63946]/20 mb-4 group">
            {tab === "signin" ? "Sign In & Book" : "Create Account"}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-[11px] text-white/25">or</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 bg-white/4 border border-white/8 hover:bg-white/8 rounded-xl py-2.5 text-xs text-white/50 hover:text-white/80 transition-all">
              G Google
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-white/4 border border-white/8 hover:bg-white/8 rounded-xl py-2.5 text-xs text-white/50 hover:text-white/80 transition-all">
              📱 Mobile OTP
            </button>
          </div>
        </div>

        {/* Floating "tonight's picks" hint below the card */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-white/20">
          <Play className="w-3 h-3" />
          Sign in to save your watchlist and earn reward points
        </div>
      </div>
    </div>
  );
}
