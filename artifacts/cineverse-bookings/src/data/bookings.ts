export type BookingStatus = "confirmed" | "completed" | "cancelled";
export type BookingType = "movie" | "event" | "sports";

export interface Booking {
  id: string;
  movie: string;
  type: BookingType;
  posterGradient: string;
  date: string;
  rawDate: Date;
  time: string;
  venue: string;
  city: string;
  seats: string[];
  format: string;
  amount: number;
  status: BookingStatus;
  rating: number | null;
  director?: string;
  duration?: string;
  language?: string;
  genre?: string[];
}

export const BOOKINGS: Booking[] = [
  {
    id: "CV2026040301234",
    movie: "Dune: Part Three",
    type: "movie",
    posterGradient: "from-amber-700 via-amber-900 to-stone-950",
    date: "Apr 03, 2026",
    rawDate: new Date("2026-04-03T13:30:00"),
    time: "01:30 PM",
    venue: "PVR ICON, Andheri West",
    city: "Mumbai",
    seats: ["C4", "C5", "C6"],
    format: "IMAX",
    amount: 1485,
    status: "confirmed",
    rating: null,
    director: "Denis Villeneuve",
    duration: "2h 46m",
    language: "English",
    genre: ["Sci-Fi", "Adventure"],
  },
  {
    id: "CV2026031500987",
    movie: "Interstellar 2",
    type: "movie",
    posterGradient: "from-blue-700 via-blue-900 to-slate-950",
    date: "Mar 15, 2026",
    rawDate: new Date("2026-03-15T18:45:00"),
    time: "06:45 PM",
    venue: "INOX Grand, Bandra",
    city: "Mumbai",
    seats: ["F7", "F8"],
    format: "IMAX",
    amount: 990,
    status: "completed",
    rating: 5,
    director: "Christopher Nolan",
    duration: "3h 12m",
    language: "English",
    genre: ["Sci-Fi", "Drama"],
  },
  {
    id: "CV2026030800456",
    movie: "Coldplay World Tour",
    type: "event",
    posterGradient: "from-cyan-600 via-blue-800 to-indigo-950",
    date: "Mar 08, 2026",
    rawDate: new Date("2026-03-08T20:00:00"),
    time: "08:00 PM",
    venue: "DY Patil Stadium, Mumbai",
    city: "Mumbai",
    seats: ["Block A, Row 3, 14–15"],
    format: "Concert",
    amount: 5998,
    status: "completed",
    rating: 5,
    genre: ["Music", "Live Event"],
  },
  {
    id: "CV2026022200123",
    movie: "Spider-Man: Beyond",
    type: "movie",
    posterGradient: "from-red-700 via-red-900 to-slate-950",
    date: "Feb 22, 2026",
    rawDate: new Date("2026-02-22T15:00:00"),
    time: "03:00 PM",
    venue: "Cinepolis, Goregaon",
    city: "Mumbai",
    seats: ["D12", "D13"],
    format: "3D",
    amount: 770,
    status: "completed",
    rating: 4,
    director: "Sam Raimi",
    duration: "2h 18m",
    language: "English",
    genre: ["Action", "Superhero"],
  },
  {
    id: "CV2026020500789",
    movie: "The Witcher Chronicles",
    type: "movie",
    posterGradient: "from-purple-700 via-purple-900 to-slate-950",
    date: "Feb 05, 2026",
    rawDate: new Date("2026-02-05T10:30:00"),
    time: "10:30 AM",
    venue: "PVR ICON, Andheri West",
    city: "Mumbai",
    seats: ["B4"],
    format: "2D",
    amount: 220,
    status: "cancelled",
    rating: null,
    duration: "2h 05m",
    language: "English",
    genre: ["Fantasy", "Action"],
  },
  {
    id: "CV2026011500321",
    movie: "Mumbai Indians vs CSK",
    type: "sports",
    posterGradient: "from-sky-600 via-blue-900 to-slate-950",
    date: "Jan 15, 2026",
    rawDate: new Date("2026-01-15T19:30:00"),
    time: "07:30 PM",
    venue: "Wankhede Stadium, Mumbai",
    city: "Mumbai",
    seats: ["Stand D, Row 8, 45–46"],
    format: "IPL",
    amount: 2400,
    status: "completed",
    rating: 4,
    genre: ["Sports", "Cricket"],
  },
];

export const STATS = {
  totalBookings: BOOKINGS.length,
  moviesWatched: BOOKINGS.filter(b => b.type === "movie" && b.status === "completed").length,
  eventsAttended: BOOKINGS.filter(b => b.type === "event" && b.status === "completed").length,
  sportsAttended: BOOKINGS.filter(b => b.type === "sports" && b.status === "completed").length,
  totalSpent: BOOKINGS.filter(b => b.status !== "cancelled").reduce((s, b) => s + b.amount, 0),
  cinePoints: 3240,
};
