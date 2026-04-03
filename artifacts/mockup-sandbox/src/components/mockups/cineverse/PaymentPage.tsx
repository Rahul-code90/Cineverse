import { useState } from "react";
import { AppLayout } from "./_shared/AppLayout";
import { CreditCard, Smartphone, Building2, Wallet, Shield, Clock, CheckCircle2, ChevronRight, Lock, Zap, ArrowRight } from "lucide-react";

const PAYMENT_METHODS = [
  { id: "upi", icon: <Smartphone className="w-5 h-5" />, label: "UPI", desc: "Pay via UPI apps" },
  { id: "card", icon: <CreditCard className="w-5 h-5" />, label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay" },
  { id: "netbanking", icon: <Building2 className="w-5 h-5" />, label: "Net Banking", desc: "All major banks" },
  { id: "wallet", icon: <Wallet className="w-5 h-5" />, label: "Wallets", desc: "Paytm, PhonePe, Amazon Pay" },
];

const UPI_APPS = [
  { name: "Google Pay", color: "from-blue-500 to-green-500" },
  { name: "PhonePe", color: "from-purple-500 to-indigo-600" },
  { name: "Paytm", color: "from-blue-400 to-sky-600" },
  { name: "BHIM", color: "from-orange-500 to-amber-600" },
];

const BANKS = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra Bank", "Yes Bank"];

export function PaymentPage() {
  const [method, setMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [bank, setBank] = useState("State Bank of India");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => { setProcessing(false); setSuccess(true); }, 2000);
  };

  if (success) {
    return (
      <AppLayout>
        <div className="min-h-[80vh] flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
            <h1 className="text-3xl font-black mb-2">Booking Confirmed!</h1>
            <p className="text-white/50 mb-8">Your tickets have been booked successfully. Enjoy the show!</p>

            <div className="bg-[#12121e] border border-white/10 rounded-2xl p-6 mb-6 text-left">
              <div className="flex justify-between items-start mb-5 pb-5 border-b border-white/8">
                <div>
                  <div className="font-bold text-lg">Dune: Part Three</div>
                  <div className="text-white/40 text-sm">IMAX • English</div>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-2 py-1 text-xs text-emerald-400 font-medium">CONFIRMED</div>
              </div>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/50">Date & Time</span>
                  <span>Thu, Apr 03 • 01:30 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Venue</span>
                  <span>PVR ICON, Andheri West</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Seats</span>
                  <span className="font-mono font-semibold">C4, C5, C6</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Booking ID</span>
                  <span className="font-mono text-[#e63946] font-bold">CV2026040301234</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-white/8 mt-2">
                  <span>Amount Paid</span>
                  <span>₹1,485</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 py-3 rounded-xl font-semibold text-sm bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                Download Ticket
              </button>
              <button className="flex-1 py-3 rounded-xl font-semibold text-sm bg-[#e63946] hover:bg-[#c1121f] text-white transition-colors flex items-center justify-center gap-2">
                View Booking <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold mb-8">Complete Your Payment</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* Method Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PAYMENT_METHODS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    method === m.id
                      ? "border-[#e63946] bg-[#e63946]/10"
                      : "border-white/10 bg-white/3 hover:border-white/20"
                  }`}
                >
                  <div className={`mb-2 ${method === m.id ? "text-[#e63946]" : "text-white/50"}`}>{m.icon}</div>
                  <div className="text-sm font-semibold">{m.label}</div>
                  <div className="text-xs text-white/40 mt-0.5">{m.desc}</div>
                </button>
              ))}
            </div>

            {/* UPI */}
            {method === "upi" && (
              <div className="bg-[#12121e] border border-white/10 rounded-2xl p-6 space-y-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {UPI_APPS.map(app => (
                    <div key={app.name} className={`h-16 rounded-xl bg-gradient-to-br ${app.color} opacity-80 hover:opacity-100 cursor-pointer transition-opacity flex items-center justify-center`}>
                      <span className="text-white text-xs font-bold text-center px-2">{app.name}</span>
                    </div>
                  ))}
                </div>
                <div className="relative flex items-center gap-4">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-xs text-white/30">or enter UPI ID</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
                <div className="flex gap-3">
                  <input
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 focus:border-[#e63946]/50 rounded-xl px-4 py-3 text-sm outline-none transition-colors placeholder-white/20"
                    placeholder="name@upi or mobile@bank"
                  />
                  <button className="px-4 py-3 bg-[#e63946]/20 border border-[#e63946]/40 text-[#e63946] text-sm font-medium rounded-xl hover:bg-[#e63946]/30 transition-colors">
                    Verify
                  </button>
                </div>
              </div>
            )}

            {/* Card */}
            {method === "card" && (
              <div className="bg-[#12121e] border border-white/10 rounded-2xl p-6 space-y-4">
                {/* Card preview */}
                <div className="h-40 bg-gradient-to-br from-[#e63946] to-[#6a0572] rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-10 translate-x-10" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full translate-y-10 -translate-x-10" />
                  <div className="flex justify-between relative z-10">
                    <span className="text-white/70 text-sm font-medium">CineVerse Rewards</span>
                    <CreditCard className="w-6 h-6 text-white/80" />
                  </div>
                  <div className="relative z-10">
                    <div className="font-mono text-xl font-bold tracking-widest mb-2">
                      {cardNum || "•••• •••• •••• ••••"}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70 text-sm">{cardName || "CARD HOLDER"}</span>
                      <span className="text-white/70 text-sm">{expiry || "MM/YY"}</span>
                    </div>
                  </div>
                </div>

                <input
                  value={cardNum}
                  onChange={e => setCardNum(e.target.value.slice(0, 19))}
                  className="w-full bg-white/5 border border-white/10 focus:border-[#e63946]/50 rounded-xl px-4 py-3 text-sm outline-none font-mono placeholder-white/20 transition-colors"
                  placeholder="Card Number"
                  maxLength={19}
                />
                <input
                  value={cardName}
                  onChange={e => setCardName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-[#e63946]/50 rounded-xl px-4 py-3 text-sm outline-none placeholder-white/20 transition-colors"
                  placeholder="Cardholder Name"
                />
                <div className="flex gap-3">
                  <input
                    value={expiry}
                    onChange={e => setExpiry(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 focus:border-[#e63946]/50 rounded-xl px-4 py-3 text-sm outline-none font-mono placeholder-white/20 transition-colors"
                    placeholder="MM / YY"
                    maxLength={7}
                  />
                  <input
                    value={cvv}
                    onChange={e => setCvv(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 focus:border-[#e63946]/50 rounded-xl px-4 py-3 text-sm outline-none font-mono placeholder-white/20 transition-colors"
                    placeholder="CVV"
                    maxLength={4}
                    type="password"
                  />
                </div>
              </div>
            )}

            {/* Net Banking */}
            {method === "netbanking" && (
              <div className="bg-[#12121e] border border-white/10 rounded-2xl p-6">
                <select
                  value={bank}
                  onChange={e => setBank(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none cursor-pointer transition-colors"
                >
                  {BANKS.map(b => <option key={b} className="bg-[#1a1a2e]">{b}</option>)}
                </select>
                <p className="text-xs text-white/30 mt-3">You will be redirected to your bank's net banking portal to complete payment.</p>
              </div>
            )}

            {/* Wallet */}
            {method === "wallet" && (
              <div className="bg-[#12121e] border border-white/10 rounded-2xl p-6">
                <div className="grid grid-cols-3 gap-3">
                  {["Paytm", "PhonePe", "Amazon Pay", "Mobikwik", "FreeCharge", "Airtel"].map(w => (
                    <button key={w} className="py-4 rounded-xl bg-white/5 border border-white/10 text-sm hover:border-white/20 hover:bg-white/8 transition-all font-medium">
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Security note */}
            <div className="flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-4 py-3">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <p className="text-xs text-white/50">Your payment is secured with 256-bit encryption and verified by Razorpay. We never store card details.</p>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-[#12121e] border border-white/10 rounded-2xl p-5 sticky top-20">
              <h3 className="font-bold mb-5">Order Summary</h3>

              <div className="flex gap-3 mb-5 pb-5 border-b border-white/8">
                <div className="w-12 h-16 rounded-lg bg-gradient-to-b from-amber-800 to-amber-950 border border-white/10 shrink-0" />
                <div>
                  <div className="font-semibold text-sm">Dune: Part Three</div>
                  <div className="text-xs text-white/40 mt-0.5">IMAX • English</div>
                  <div className="text-xs text-white/40">01:30 PM • Apr 03</div>
                  <div className="text-xs text-[#e63946]/80 mt-1 font-mono font-semibold">C4, C5, C6</div>
                </div>
              </div>

              <div className="space-y-2.5 text-sm pb-4 mb-4 border-b border-white/8">
                <div className="flex justify-between">
                  <span className="text-white/50">3 × Executive (IMAX)</span>
                  <span>₹1,350</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Convenience Fee</span>
                  <span>₹135</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>CineVerse Rewards</span>
                  <span>-₹0</span>
                </div>
              </div>

              <div className="flex justify-between font-bold mb-6">
                <span>Total Amount</span>
                <span className="text-xl">₹1,485</span>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 flex items-center gap-2 mb-4">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-xs text-amber-400">Seats expire in <strong>06:22</strong></span>
              </div>

              <button
                onClick={handlePay}
                disabled={processing}
                className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  processing
                    ? "bg-[#e63946]/50 cursor-not-allowed"
                    : "bg-[#e63946] hover:bg-[#c1121f] shadow-lg shadow-[#e63946]/20"
                } text-white`}
              >
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Pay ₹1,485
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-white/25 mt-3 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" /> Secured by Razorpay
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
