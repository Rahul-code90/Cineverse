import { useState } from "react";
import { X, Star, Send } from "lucide-react";
import type { Booking } from "../data/bookings";

interface RatingModalProps {
  booking: Booking;
  onClose: () => void;
  onSubmit: (bookingId: string, rating: number, review: string) => void;
}

const TAGS = ["Great Story", "Amazing Visuals", "Top Performances", "Must Watch", "Good Sound", "Loved the Ending", "Epic Scale", "Emotional"];

export function RatingModal({ booking, onClose, onSubmit }: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [review, setReview] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) return;
    setSubmitted(true);
    setTimeout(() => {
      onSubmit(booking.id, rating, review);
      onClose();
    }, 1500);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const ratingLabels = ["", "Poor", "Fair", "Good", "Great", "Excellent!"];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#12121e] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-400/10 flex items-center justify-center mb-4">
              <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
            </div>
            <h3 className="text-xl font-bold mb-1">Thanks for rating!</h3>
            <p className="text-white/50 text-sm">+50 CinePoints added to your account</p>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-white/8">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-amber-400 font-medium uppercase tracking-widest mb-1">Rate your experience</div>
                  <h2 className="text-xl font-bold">{booking.movie}</h2>
                  <p className="text-sm text-white/50 mt-0.5">{booking.date} · {booking.venue}</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/8 hover:bg-white/15 transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onMouseEnter={() => setHovered(star)}
                      onMouseLeave={() => setHovered(0)}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110 active:scale-95"
                    >
                      <Star
                        className={`w-10 h-10 transition-colors ${
                          star <= (hovered || rating)
                            ? "text-amber-400 fill-amber-400"
                            : "text-white/20"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className={`text-sm font-semibold transition-all ${(hovered || rating) ? "opacity-100" : "opacity-0"}`}>
                  {ratingLabels[hovered || rating]}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {TAGS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      selectedTags.includes(tag)
                        ? "bg-amber-400/15 border-amber-400/40 text-amber-300"
                        : "bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/20"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <textarea
                value={review}
                onChange={e => setReview(e.target.value)}
                placeholder="Add a review... (optional)"
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none resize-none focus:border-white/20 transition-colors"
              />

              <button
                onClick={handleSubmit}
                disabled={rating === 0}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
                  rating > 0
                    ? "bg-amber-400 text-black hover:bg-amber-300"
                    : "bg-white/5 text-white/30 cursor-not-allowed"
                }`}
              >
                <Send className="w-4 h-4" />
                Submit Rating
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
