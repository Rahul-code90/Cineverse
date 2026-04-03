import { useState } from "react";
import { Film, ArrowRight, ChevronLeft, Shield, Smartphone } from "lucide-react";

// Concept: Phone-first OTP, zero friction. Indian mobile-first UX.
// No password to forget. No forms to fill. Just your number → OTP → in.
// Centered, spacious, calm. Everything non-essential is stripped out.

export function LoginB_PhoneFirst() {
  const [stage, setStage] = useState<"phone" | "otp" | "name">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [name, setName] = useState("");
  const [isNew, setIsNew] = useState(false);

  const handleOtp = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...otp];
    next[i] = v;
    setOtp(next);
    if (v && i < 3) document.getElementById(`b-otp-${i + 1}`)?.focus();
  };

  const phoneComplete = phone.length === 10;
  const otpComplete = otp.every(d => d !== "");

  return (
    <div className="min-h-screen bg-[#070709] text-white flex items-center justify-center px-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Extremely subtle top band */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#e63946]/40 to-transparent" />

      <div className="w-full max-w-sm">
        {/* Logo — small, unobtrusive */}
        <div className="text-center mb-12">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#e63946] to-[#c1121f] flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#e63946]/30">
            <Film className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight">Cine<span className="text-[#e63946]">Verse</span></span>
        </div>

        {/* Stage: Phone */}
        {stage === "phone" && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Enter your mobile</h1>
              <p className="text-white/35 text-sm">We'll send a 4-digit OTP to verify you</p>
            </div>

            <div className="flex items-center gap-0 mb-2 bg-[#111118] border border-white/10 rounded-2xl overflow-hidden focus-within:border-[#e63946]/40 transition-colors">
              <div className="flex items-center gap-2 px-4 py-4 border-r border-white/8 shrink-0">
                <span className="text-lg">🇮🇳</span>
                <span className="text-sm font-medium text-white/60">+91</span>
              </div>
              <input
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="flex-1 bg-transparent px-4 py-4 text-xl font-bold outline-none tracking-widest placeholder-white/15"
                placeholder="00000 00000"
                type="tel"
                inputMode="numeric"
              />
            </div>

            <div className="text-xs text-white/20 text-center mb-8">
              {phone.length}/10 digits {phone.length === 10 && "✓"}
            </div>

            <button
              onClick={() => { if (phoneComplete) { setIsNew(phone === "9999999999"); setStage("otp"); } }}
              disabled={!phoneComplete}
              className={`w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all duration-300 ${
                phoneComplete
                  ? "bg-[#e63946] hover:bg-[#c1121f] shadow-xl shadow-[#e63946]/30 scale-100"
                  : "bg-white/5 text-white/20 cursor-not-allowed"
              }`}
            >
              <Smartphone className="w-5 h-5" />
              Send OTP
              {phoneComplete && <ArrowRight className="w-5 h-5" />}
            </button>

            <div className="mt-8 text-center">
              <div className="text-xs text-white/20 mb-4">Other options</div>
              <div className="flex gap-3 justify-center">
                <button className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors px-4 py-2 rounded-xl border border-white/8 hover:border-white/15">
                  <span>G</span> Google
                </button>
                <button className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors px-4 py-2 rounded-xl border border-white/8 hover:border-white/15">
                  <span>✉</span> Email
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stage: OTP */}
        {stage === "otp" && (
          <div>
            <button
              onClick={() => setStage("phone")}
              className="flex items-center gap-1 text-sm text-white/40 hover:text-white/70 transition-colors mb-8"
            >
              <ChevronLeft className="w-4 h-4" /> Change number
            </button>

            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-full bg-[#e63946]/10 border border-[#e63946]/20 flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-7 h-7 text-[#e63946]" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Check your SMS</h1>
              <p className="text-white/35 text-sm">Sent to <span className="text-white font-semibold">+91 {phone}</span></p>
            </div>

            {/* Big OTP boxes */}
            <div className="flex gap-4 justify-center mb-3">
              {otp.map((d, i) => (
                <input
                  key={i}
                  id={`b-otp-${i}`}
                  value={d}
                  onChange={e => handleOtp(i, e.target.value)}
                  className="w-16 h-16 text-center text-3xl font-black bg-[#111118] border-2 border-white/10 focus:border-[#e63946]/60 rounded-2xl outline-none transition-colors"
                  maxLength={1}
                  inputMode="numeric"
                />
              ))}
            </div>

            <div className="text-center text-xs text-white/25 mb-8">
              Didn't get it?{" "}
              <button className="text-[#e63946] hover:text-[#ff6b6b] transition-colors font-semibold">Resend in 0:45</button>
            </div>

            <button
              onClick={() => otpComplete && (isNew ? setStage("name") : setStage("phone"))}
              disabled={!otpComplete}
              className={`w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all ${
                otpComplete
                  ? "bg-[#e63946] hover:bg-[#c1121f] shadow-xl shadow-[#e63946]/30"
                  : "bg-white/5 text-white/20 cursor-not-allowed"
              }`}
            >
              <Shield className="w-5 h-5" />
              Verify & Continue
            </button>
          </div>
        )}

        {/* Stage: Name (new user only) */}
        {stage === "name" && (
          <div>
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">👋</div>
              <h1 className="text-2xl font-bold mb-2">What should we call you?</h1>
              <p className="text-white/35 text-sm">Just your first name is fine</p>
            </div>

            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-[#111118] border-2 border-white/10 focus:border-[#e63946]/50 rounded-2xl px-5 py-4 text-xl font-bold outline-none text-center placeholder-white/15 mb-3 transition-colors"
              placeholder="Your name"
              autoFocus
            />

            <div className="flex gap-2 mb-8 justify-center flex-wrap">
              {["Rahul", "Priya", "Amit", "Neha", "Arjun"].map(n => (
                <button
                  key={n}
                  onClick={() => setName(n)}
                  className="text-sm px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
                >
                  {n}
                </button>
              ))}
            </div>

            <button
              disabled={!name.trim()}
              className={`w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all ${
                name.trim()
                  ? "bg-[#e63946] hover:bg-[#c1121f] shadow-xl shadow-[#e63946]/30"
                  : "bg-white/5 text-white/20 cursor-not-allowed"
              }`}
            >
              Let's go, {name || "friend"} →
            </button>
          </div>
        )}

        <div className="mt-10 text-center text-xs text-white/15">
          Protected by 256-bit encryption · No password needed
        </div>
      </div>
    </div>
  );
}
