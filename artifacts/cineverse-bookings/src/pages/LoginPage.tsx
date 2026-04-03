import { useState } from "react";
import { Film, Mail, Lock, Eye, EyeOff, ArrowRight, Chrome, Facebook, Phone } from "lucide-react";
import { useLocation } from "wouter";

export function LoginPage() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("Mumbai");
  const [showPass, setShowPass] = useState(false);
  const [tab, setTab] = useState<"login" | "signup">("login");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
  };

  const CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata"];
  const POSTERS = [
    "from-amber-700 to-amber-950",
    "from-blue-700 to-blue-950",
    "from-red-700 to-red-950",
    "from-purple-700 to-purple-950",
    "from-cyan-700 to-cyan-950",
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#12122a] to-[#0a0a0f]" />
        <div className="absolute -top-40 -left-20 w-[600px] h-[600px] bg-[#e63946]/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px]" />
        <div className="relative z-10 flex items-center gap-2.5 mb-auto">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e63946] to-[#ff6b6b] flex items-center justify-center shadow-lg shadow-red-500/20">
            <Film className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-black">Cine<span className="text-[#e63946]">Verse</span></span>
        </div>
        <div className="relative z-10 mt-auto">
          <h2 className="text-5xl font-black tracking-tight mb-5 leading-tight">
            Your gateway to<br />
            <span className="bg-gradient-to-r from-[#e63946] to-[#ff8f3f] bg-clip-text text-transparent">
              extraordinary<br />experiences
            </span>
          </h2>
          <p className="text-white/40 text-lg leading-relaxed mb-10">
            Book tickets for movies, concerts, sports and more. Experience entertainment like never before.
          </p>
          <div className="flex gap-3 items-end">
            {POSTERS.map((g, i) => (
              <div key={i}
                className={`w-16 rounded-xl bg-gradient-to-b ${g} border border-white/10 opacity-70`}
                style={{ height: `${110 - i * 12}px` }}
              />
            ))}
          </div>
          <div className="mt-8 flex items-center gap-6">
            {[["500+", "Movies"], ["2000+", "Venues"], ["50M+", "Bookings"]].map(([val, label]) => (
              <div key={label}>
                <div className="text-xl font-bold">{val}</div>
                <div className="text-xs text-white/40">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 lg:max-w-md flex items-center justify-center px-8 py-12 bg-[#0d0d1a] border-l border-white/5">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#e63946] to-[#ff6b6b] flex items-center justify-center">
              <Film className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-black">Cine<span className="text-[#e63946]">Verse</span></span>
          </div>

          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 mb-8">
            {(["login", "signup"] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                  tab === t ? "bg-[#e63946] text-white shadow-lg shadow-[#e63946]/20" : "text-white/40 hover:text-white"
                }`}
              >
                {t === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <h1 className="text-2xl font-black mb-1">{tab === "login" ? "Welcome back" : "Create account"}</h1>
          <p className="text-white/40 text-sm mb-8">
            {tab === "login" ? "Sign in to your CineVerse account" : "Join millions of movie lovers"}
          </p>

          <div className="flex gap-3 mb-6">
            <button className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/8 rounded-xl py-2.5 text-sm font-medium transition-colors">
              <Chrome className="w-4 h-4 text-white/60" />
              Google
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/8 rounded-xl py-2.5 text-sm font-medium transition-colors">
              <Phone className="w-4 h-4 text-white/60" />
              Phone
            </button>
          </div>

          <div className="relative flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-xs text-white/30">or continue with email</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {tab === "signup" && (
              <div>
                <label className="block text-xs text-white/40 font-medium mb-2">Full Name</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-[#e63946]/50 rounded-xl px-4 py-3 text-sm outline-none text-white placeholder-white/20 transition-colors"
                  placeholder="Rahul Kumar"
                />
              </div>
            )}
            <div>
              <label className="block text-xs text-white/40 font-medium mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-[#e63946]/50 rounded-xl pl-10 pr-4 py-3 text-sm outline-none text-white placeholder-white/20 transition-colors"
                  placeholder="you@example.com"
                  type="email"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-white/40 font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-[#e63946]/50 rounded-xl pl-10 pr-10 py-3 text-sm outline-none text-white placeholder-white/20 transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {tab === "login" && (
              <div className="flex justify-end">
                <button type="button" className="text-xs text-[#e63946] hover:text-[#ff6b6b] transition-colors">
                  Forgot password?
                </button>
              </div>
            )}
            {tab === "signup" && (
              <div>
                <label className="block text-xs text-white/40 font-medium mb-2">City</label>
                <select
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none text-white/70 cursor-pointer"
                >
                  {CITIES.map(c => <option key={c} className="bg-[#1a1a2e]">{c}</option>)}
                </select>
              </div>
            )}
            <button
              type="submit"
              className="w-full py-3.5 bg-[#e63946] hover:bg-[#c1121f] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#e63946]/20 group"
            >
              {tab === "login" ? "Sign In" : "Create Account"}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {tab === "signup" && (
            <p className="text-center text-xs text-white/25">
              By creating an account, you agree to our{" "}
              <span className="text-white/40 hover:text-white cursor-pointer transition-colors">Terms of Service</span>
              {" "}and{" "}
              <span className="text-white/40 hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            </p>
          )}
          <p className="text-center text-xs text-white/25 mt-4">
            {tab === "login" ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setTab(tab === "login" ? "signup" : "login")} className="text-[#e63946] hover:text-[#ff6b6b] font-medium transition-colors">
              {tab === "login" ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
