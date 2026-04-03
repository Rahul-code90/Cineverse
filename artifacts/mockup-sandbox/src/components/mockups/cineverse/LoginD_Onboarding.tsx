import { useState } from "react";
import { Film, ArrowRight, Check, MapPin, Star, Zap } from "lucide-react";

// Concept: Sign-up as a personalization journey — a 4-step wizard that feels
// like setting up a streaming service. You're not "creating an account",
// you're curating your entertainment identity.
// Existing users are handled in one step (step 0 shortcut).

const GENRES = [
  { id: "action", label: "Action", emoji: "⚡" },
  { id: "drama", label: "Drama", emoji: "🎭" },
  { id: "comedy", label: "Comedy", emoji: "😂" },
  { id: "scifi", label: "Sci-Fi", emoji: "🚀" },
  { id: "horror", label: "Horror", emoji: "👻" },
  { id: "romance", label: "Romance", emoji: "💫" },
  { id: "thriller", label: "Thriller", emoji: "🔥" },
  { id: "animation", label: "Animation", emoji: "🌟" },
  { id: "documentary", label: "Docs", emoji: "🎬" },
];

const CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata", "Ahmedabad"];

const VENUES_BY_CITY: Record<string, string[]> = {
  Mumbai: ["PVR ICON, Andheri", "INOX Grand, Bandra", "Cinepolis, Goregaon"],
  Delhi: ["PVR Saket", "INOX, CP", "Cinepolis, Vasant Kunj"],
  Bangalore: ["PVR Orion", "INOX, Garuda Mall", "Cinepolis, Mantri Square"],
  Chennai: ["PVR VR Chennai", "SPI Palazzo", "Inox, Sathyam"],
  Hyderabad: ["PVR Inorbit", "AMB Cinemas", "Cinepolis, Forum"],
  Pune: ["PVR Bund Garden", "INOX, E-Square", "Cinepolis, Phoenix"],
  Kolkata: ["INOX South City", "PVR Acropolis", "Cinepolis, Quest"],
  Ahmedabad: ["PVR AlphaOne", "INOX, Star Bazaar", "Cinepolis, Himalaya"],
};

const STEPS = [
  { id: "who", label: "Who are you?" },
  { id: "genres", label: "Pick your vibe" },
  { id: "city", label: "Your city" },
  { id: "ready", label: "All set!" },
];

export function LoginD_Onboarding() {
  const [step, setStep] = useState(0);
  const [isReturning, setIsReturning] = useState<boolean | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [city, setCity] = useState("");
  const [venue, setVenue] = useState("");

  const toggleGenre = (g: string) => {
    setSelectedGenres(prev =>
      prev.includes(g) ? prev.filter(x => x !== g) : prev.length < 4 ? [...prev, g] : prev
    );
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-[#08080f] text-white flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#e63946] to-[#ff6b6b] flex items-center justify-center">
            <Film className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-black">Cine<span className="text-[#e63946]">Verse</span></span>
        </div>
        {isReturning === null && (
          <button
            onClick={() => { setIsReturning(true); setStep(0); }}
            className="text-xs text-white/40 hover:text-white/70 transition-colors border border-white/10 rounded-full px-3 py-1.5"
          >
            Already a member? Sign in
          </button>
        )}
      </div>

      {/* Progress bar */}
      {isReturning === false && (
        <div className="px-6 mb-0">
          <div className="flex items-center gap-2 mb-1">
            {STEPS.map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className={`h-1 w-full rounded-full transition-all duration-500 ${
                  i < step ? "bg-[#e63946]" : i === step ? "bg-[#e63946]/60" : "bg-white/10"
                }`} />
              </div>
            ))}
          </div>
          <div className="text-[11px] text-white/25 text-right">Step {step + 1} of {STEPS.length}</div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">

          {/* Returning user shortcut */}
          {isReturning === null && (
            <div className="text-center">
              <div className="text-5xl mb-5">🎬</div>
              <h1 className="text-3xl font-black mb-2">Welcome to CineVerse</h1>
              <p className="text-white/35 mb-10">Your smart movie & events companion</p>
              <button
                onClick={() => { setIsReturning(false); setStep(0); }}
                className="w-full py-4 bg-[#e63946] hover:bg-[#c1121f] rounded-2xl font-black text-base flex items-center justify-center gap-3 shadow-xl shadow-[#e63946]/25 mb-3 group transition-all"
              >
                <Zap className="w-5 h-5" /> Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="flex gap-3">
                <button className="flex-1 py-3 bg-white/5 border border-white/10 hover:bg-white/8 rounded-xl text-sm font-medium text-white/60 transition-all">
                  G  Continue with Google
                </button>
                <button className="flex-1 py-3 bg-white/5 border border-white/10 hover:bg-white/8 rounded-xl text-sm font-medium text-white/60 transition-all">
                  📱 Mobile OTP
                </button>
              </div>
            </div>
          )}

          {/* Returning sign in */}
          {isReturning === true && (
            <div>
              <h1 className="text-2xl font-black mb-1">Welcome back</h1>
              <p className="text-white/35 text-sm mb-6">Sign in to continue</p>
              <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none placeholder-white/20 mb-3 focus:border-[#e63946]/40 transition-colors" placeholder="Email or mobile" />
              <input type="password" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none placeholder-white/20 mb-1 focus:border-[#e63946]/40 transition-colors" placeholder="Password" />
              <div className="text-right mb-5">
                <button className="text-xs text-[#e63946]/70 hover:text-[#e63946]">Forgot?</button>
              </div>
              <button className="w-full py-3.5 bg-[#e63946] hover:bg-[#c1121f] rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#e63946]/20">Sign In</button>
              <button onClick={() => setIsReturning(null)} className="w-full mt-3 text-sm text-white/30 hover:text-white/50 transition-colors">← Back</button>
            </div>
          )}

          {/* Step 0: Who are you? */}
          {isReturning === false && step === 0 && (
            <div>
              <div className="text-4xl mb-4">👋</div>
              <h1 className="text-3xl font-black mb-1">What's your name?</h1>
              <p className="text-white/35 text-sm mb-8">We'll personalize your experience</p>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-[#111118] border-2 border-white/10 focus:border-[#e63946]/50 rounded-2xl px-5 py-4 text-xl font-bold outline-none placeholder-white/15 mb-3 transition-colors"
                placeholder="Your first name"
                autoFocus
              />
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#111118] border-2 border-white/10 focus:border-[#e63946]/50 rounded-2xl px-5 py-3 text-sm outline-none placeholder-white/15 mb-8 transition-colors"
                placeholder="Email or mobile number"
              />
              <button
                onClick={() => name.trim() && email.trim() && setStep(1)}
                disabled={!name.trim() || !email.trim()}
                className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all ${
                  name.trim() && email.trim()
                    ? "bg-[#e63946] hover:bg-[#c1121f] shadow-xl shadow-[#e63946]/25"
                    : "bg-white/5 text-white/25 cursor-not-allowed"
                }`}
              >
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Step 1: Genre preferences */}
          {isReturning === false && step === 1 && (
            <div>
              <div className="text-4xl mb-4">🎭</div>
              <h1 className="text-3xl font-black mb-1">What do you love, {name}?</h1>
              <p className="text-white/35 text-sm mb-2">Pick up to 4 genres you enjoy</p>
              <div className="text-xs text-white/20 mb-6">{selectedGenres.length}/4 selected</div>
              <div className="grid grid-cols-3 gap-2.5 mb-8">
                {GENRES.map(g => {
                  const on = selectedGenres.includes(g.id);
                  const maxed = selectedGenres.length >= 4 && !on;
                  return (
                    <button
                      key={g.id}
                      onClick={() => !maxed && toggleGenre(g.id)}
                      className={`relative py-4 rounded-2xl flex flex-col items-center gap-1.5 transition-all border text-sm font-semibold ${
                        on
                          ? "bg-[#e63946]/15 border-[#e63946]/50 text-white scale-105 shadow-lg shadow-[#e63946]/15"
                          : maxed
                          ? "bg-white/2 border-white/5 text-white/20 cursor-not-allowed"
                          : "bg-white/4 border-white/10 text-white/60 hover:bg-white/8 hover:text-white"
                      }`}
                    >
                      {on && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-[#e63946] rounded-full flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                      <span className="text-xl">{g.emoji}</span>
                      <span>{g.label}</span>
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => selectedGenres.length > 0 && setStep(2)}
                disabled={selectedGenres.length === 0}
                className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all ${
                  selectedGenres.length > 0
                    ? "bg-[#e63946] hover:bg-[#c1121f] shadow-xl shadow-[#e63946]/25"
                    : "bg-white/5 text-white/25 cursor-not-allowed"
                }`}
              >
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Step 2: City */}
          {isReturning === false && step === 2 && (
            <div>
              <div className="text-4xl mb-4">📍</div>
              <h1 className="text-3xl font-black mb-1">Your city?</h1>
              <p className="text-white/35 text-sm mb-6">We'll show you what's near you</p>
              <div className="grid grid-cols-4 gap-2 mb-5">
                {CITIES.map(c => (
                  <button
                    key={c}
                    onClick={() => { setCity(c); setVenue(""); }}
                    className={`py-3 rounded-xl text-sm font-semibold transition-all border ${
                      city === c
                        ? "bg-[#e63946]/15 border-[#e63946]/50 text-white"
                        : "bg-white/4 border-white/10 text-white/50 hover:text-white hover:bg-white/8"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              {city && (
                <div className="mb-5">
                  <div className="text-xs text-white/30 mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#e63946]" /> Favorite venue in {city} (optional)
                  </div>
                  <div className="space-y-2">
                    {(VENUES_BY_CITY[city] || []).map(v => (
                      <button
                        key={v}
                        onClick={() => setVenue(venue === v ? "" : v)}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm border transition-all ${
                          venue === v ? "border-[#e63946]/40 bg-[#e63946]/8 text-white" : "border-white/8 bg-white/3 text-white/50 hover:text-white"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <button
                onClick={() => city && setStep(3)}
                disabled={!city}
                className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all ${
                  city
                    ? "bg-[#e63946] hover:bg-[#c1121f] shadow-xl shadow-[#e63946]/25"
                    : "bg-white/5 text-white/25 cursor-not-allowed"
                }`}
              >
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Step 3: All set */}
          {isReturning === false && step === 3 && (
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-emerald-500" />
              </div>
              <h1 className="text-3xl font-black mb-2">You're all set, {name}!</h1>
              <p className="text-white/35 mb-8">Your CineVerse is personalized and ready</p>

              <div className="bg-[#111118] border border-white/8 rounded-2xl p-5 mb-8 text-left">
                <div className="text-xs text-white/30 uppercase tracking-wider mb-4">Your Profile</div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Name</span>
                    <span className="font-semibold">{name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">City</span>
                    <span className="font-semibold flex items-center gap-1"><MapPin className="w-3 h-3 text-[#e63946]" />{city}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Genres</span>
                    <div className="flex gap-1">
                      {selectedGenres.slice(0, 3).map(g => {
                        const genre = GENRES.find(x => x.id === g);
                        return <span key={g}>{genre?.emoji}</span>;
                      })}
                      {selectedGenres.length > 3 && <span className="text-white/40">+{selectedGenres.length - 3}</span>}
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Welcome Bonus</span>
                    <span className="font-bold text-amber-400 flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-amber-400" /> 500 CinePoints</span>
                  </div>
                </div>
              </div>

              <button className="w-full py-4 bg-[#e63946] hover:bg-[#c1121f] rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-[#e63946]/25 transition-all group">
                <Zap className="w-5 h-5" />
                Explore Movies
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
