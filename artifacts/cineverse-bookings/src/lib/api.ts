const BASE = "/api";

async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

export const api = {
  movies: {
    list: () => req<{ movies: Movie[] }>("/movies"),
    get: (id: number) => req<{ movie: Movie }>(`/movies/${id}`),
    showtimes: (id: number, date?: string) =>
      req<{ showtimes: Showtime[] }>(`/movies/${id}/showtimes${date ? `?date=${date}` : ""}`),
  },
  events: {
    list: () => req<{ events: Event[] }>("/events"),
    get: (id: number) => req<{ event: Event }>(`/events/${id}`),
  },
  bookings: {
    list: (userId?: number) =>
      req<{ bookings: Booking[] }>(`/bookings${userId ? `?userId=${userId}` : ""}`),
    create: (data: CreateBookingInput) =>
      req<{ booking: Booking }>("/bookings", { method: "POST", body: JSON.stringify(data) }),
    cancel: (id: number) =>
      req<{ booking: Booking }>(`/bookings/${id}/cancel`, { method: "PATCH" }),
    rate: (id: number, rating: number) =>
      req<{ booking: Booking }>(`/bookings/${id}/rate`, {
        method: "PATCH",
        body: JSON.stringify({ rating }),
      }),
  },
  auth: {
    login: (email: string, password: string) =>
      req<{ user: AuthUser }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    register: (data: { name: string; email: string; password: string; city?: string }) =>
      req<{ user: AuthUser }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  admin: {
    stats: () => req<AdminStats>("/admin/stats"),
  },
  seed: () => req<any>("/seed", { method: "POST" }),
};

export interface Movie {
  id: number;
  title: string;
  genre: string;
  rating: number;
  votes: number;
  runtime: string;
  certificate: string;
  languages: string[];
  badge: string;
  synopsis: string;
  director: string;
  cast: { name: string; role: string; color: string }[];
  posterUrl: string;
  backdropUrl: string;
  posterGradient: string;
  popularity: number;
  isActive: number;
}

export interface Event {
  id: number;
  name: string;
  category: string;
  date: string;
  venue: string;
  city: string;
  priceFrom: number;
  imageUrl: string;
  imageGradient: string;
  description: string;
  totalTickets: number;
  availableTickets: number;
}

export interface Showtime {
  id: number;
  movieId: number;
  venue: string;
  date: string;
  time: string;
  format: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
}

export interface Booking {
  id: number;
  bookingRef: string;
  userId: number;
  movieId: number | null;
  eventId: number | null;
  showtimeId: number | null;
  movieTitle: string;
  venue: string;
  date: string;
  time: string;
  format: string;
  seats: string[];
  totalAmount: number;
  convenienceFee: number;
  status: string;
  userRating: number | null;
  posterUrl: string;
  posterGradient: string;
  createdAt: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  city: string;
  cinePoints: number;
}

export interface CreateBookingInput {
  userId?: number;
  movieId?: number;
  eventId?: number;
  showtimeId?: number;
  movieTitle: string;
  venue: string;
  date: string;
  time: string;
  format?: string;
  seats: string[];
  totalAmount: number;
  convenienceFee?: number;
  posterUrl?: string;
  posterGradient?: string;
}

export interface AdminStats {
  stats: {
    totalRevenue: number;
    bookingsToday: number;
    totalUsers: number;
  };
  recentBookings: Booking[];
  movies: Movie[];
  events: Event[];
}
