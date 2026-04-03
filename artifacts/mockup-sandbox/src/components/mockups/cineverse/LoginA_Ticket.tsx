import { useState } from "react";
import { Film, Ticket, ArrowRight, Star, Clock, Zap } from "lucide-react";

// Concept: The login IS a ticket. You're at the booth, claiming your seat.
// Interaction: One field at a time, like tearing a stub. Physically satisfying.

const STEPS = ["enter", "verify", "ready"] as const;

export function LoginA_Ticket() {
  const [step, setStep] = useState<typeof STEPS[number]>("enter");
  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [value, setValue] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleOtp = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...otp];
    next[i] = v;
    setOtp(next);
    if (v && i < 5) {
      const el = document.getElementById(`otp-${i + 1}`);
      el?.focus();
    }
  };

  return (
    <div
      className="min-h-screen bg-[#080810] text-white flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Ambient bg */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#e63946]/6 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px]" />
      </div>

      {/* Ticket card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo above ticket */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#e63946] to-[#ff6b6b] flex items-center justify-center">
            <Film className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-black">Cine<span className="text-[#e63946]">Verse</span></span>
        </div>

        {/* The Ticket itself */}
        <div className="relative bg-[#12121e] rounded-3xl overflow-hidden shadow-2xl shadow-black/60 border border-white/8">
          {/* Ticket header strip */}
          <div className="bg-gradient-to-r from-[#e63946] to-[#c1121f] px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold tracking-[3px] text-white/70 mb-1">ENTRY TICKET</div>
                <div className="text-xl font-black">CineVerse Pass</div>
              </div>
              <Ticket className="w-10 h-10 text-white/30" />
            </div>
            {/* Seat-style details */}
            <div className="flex gap-6 mt-4 text-xs text-white/60">
              <div><div className="font-bold text-white">ADMIT</div><div>ONE</div></div>
              <div><div className="font-bold text-white">ACCESS</div><div>UNLIMITED</div></div>
              <div><div className="font-bold text-white">REWARDS</div><div>ENABLED</div></div>
            </div>
          </div>

          {/* Tear line */}
          <div className="flex items-center px-0 py-0">
            <div className="w-5 h-5 rounded-full bg-[#080810] -ml-2.5 shrink-0" />
            <div className="flex-1 border-t-2 border-dashed border-white/10" />
            <div className="w-5 h-5 rounded-full bg-[#080810] -mr-2.5 shrink-0" />
          </div>

          {/* Ticket body — the form */}
          <div className="px-6 py-6">
            {step === "enter" && (
              <div>
                <div className="text-sm font-bold mb-5">
                  {method === "phone" ? "Mobile Number" : "Email Address"}
                  <span className="ml-2 text-white/30 font-normal">— your ticket stub</span>
                </div>

                {/* Method toggle */}
                <div className="flex bg-white/4 rounded-xl p-1 mb-5">
                  {(["phone", "email"] as const).map(m => (
                    <button
                      key={m}
                      onClick={() => setMethod(m)}
                      className={`flex-1 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all ${
                        method === m ? "bg-white/10 text-white" : "text-white/30"
                      }`}
                    >
                      {m === "phone" ? "Mobile" : "Email"}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2 mb-6">
                  {method === "phone" && (
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3 text-sm text-white/60 shrink-0">
                      +91
                    </div>
                  )}
                  <input
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 focus:border-[#e63946]/50 rounded-xl px-4 py-3 text-sm outline-none placeholder-white/20 transition-colors"
                    placeholder={method === "phone" ? "10-digit mobile number" : "your@email.com"}
                    type={method === "phone" ? "tel" : "email"}
                    maxLength={method === "phone" ? 10 : undefined}
                  />
                </div>

                <button
                  onClick={() => value.length >= 6 && setStep("verify")}
                  className="w-full py-3.5 bg-[#e63946] hover:bg-[#c1121f] rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all group shadow-lg shadow-[#e63946]/20"
                >
                  <Zap className="w-4 h-4" />
                  Get OTP
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="mt-5 pt-5 border-t border-white/6">
                  <div className="flex gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 bg-white/4 border border-white/8 rounded-xl py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/8 transition-all">
                      <span className="text-base">G</span> Google
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 bg-white/4 border border-white/8 rounded-xl py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/8 transition-all">
                      <span className="text-base">f</span> Facebook
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === "verify" && (
              <div>
                <div className="text-sm font-bold mb-1">Enter OTP</div>
                <div className="text-xs text-white/40 mb-6">Sent to {method === "phone" ? `+91 ${value}` : value}</div>

                <div className="flex gap-2 justify-center mb-6">
                  {otp.map((d, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      value={d}
                      onChange={e => handleOtp(i, e.target.value)}
                      className="w-11 h-13 text-center text-xl font-black bg-white/5 border border-white/10 focus:border-[#e63946]/60 rounded-xl outline-none transition-colors"
                      style={{ height: "52px" }}
                      maxLength={1}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setStep("ready")}
                  className="w-full py-3.5 bg-[#e63946] hover:bg-[#c1121f] rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#e63946]/20"
                >
                  Verify & Enter
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setStep("enter")}
                  className="w-full mt-3 text-sm text-white/30 hover:text-white/60 transition-colors"
                >
                  ← Change number
                </button>
              </div>
            )}

            {step === "ready" && (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                  <Ticket className="w-8 h-8 text-emerald-500" />
                </div>
                <div className="text-xl font-black mb-1">Ticket Punched!</div>
                <div className="text-sm text-white/40 mb-6">You're inside, enjoy the show</div>
                <div className="bg-white/4 border border-white/8 rounded-xl px-4 py-3 text-left">
                  <div className="text-xs text-white/30 mb-1">Your CinePoints balance</div>
                  <div className="text-2xl font-black text-amber-400 flex items-center gap-2">
                    2,840 <Star className="w-5 h-5 fill-amber-400" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Barcode footer */}
          <div className="flex items-center px-0">
            <div className="w-5 h-5 rounded-full bg-[#080810] -ml-2.5 shrink-0" />
            <div className="flex-1 border-t-2 border-dashed border-white/10" />
            <div className="w-5 h-5 rounded-full bg-[#080810] -mr-2.5 shrink-0" />
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex gap-0.5">
              {Array.from({ length: 28 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white/20 rounded-sm"
                  style={{ width: Math.random() > 0.5 ? "3px" : "2px", height: `${16 + Math.random() * 12}px` }}
                />
              ))}
            </div>
            <div className="text-[10px] text-white/20 font-mono">CV-{Math.random().toString(36).slice(2, 8).toUpperCase()}</div>
          </div>
        </div>

        <p className="text-center text-xs text-white/20 mt-5">
          By entering, you agree to our <span className="text-white/40 cursor-pointer hover:text-white/60">Terms</span> & <span className="text-white/40 cursor-pointer hover:text-white/60">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
