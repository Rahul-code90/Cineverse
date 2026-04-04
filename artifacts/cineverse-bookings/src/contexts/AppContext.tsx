import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { AuthUser } from "../lib/api";

interface BookingSession {
  movieId?: number;
  movieTitle: string;
  showtimeId?: number;
  venue: string;
  date: string;
  time: string;
  format: string;
  seats: string[];
  totalAmount: number;
  convenienceFee: number;
  posterUrl: string;
  posterGradient: string;
}

interface AppContextType {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  bookingSession: BookingSession | null;
  setBookingSession: (session: BookingSession | null) => void;
  isSeeded: boolean;
  setIsSeeded: (v: boolean) => void;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

const DEMO_USER: AuthUser = {
  id: 1,
  name: "Aryan Singh",
  email: "aryan@cineverse.com",
  city: "Mumbai",
  cinePoints: 1250,
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem("cv_user");
      return stored ? JSON.parse(stored) : DEMO_USER;
    } catch { return DEMO_USER; }
  });
  const [bookingSession, setBookingSession] = useState<BookingSession | null>(() => {
    try {
      const stored = sessionStorage.getItem("cv_booking");
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  const [isSeeded, setIsSeeded] = useState(() => {
    return localStorage.getItem("cv_seeded") === "true";
  });

  const setUser = (u: AuthUser | null) => {
    setUserState(u);
    if (u) localStorage.setItem("cv_user", JSON.stringify(u));
    else localStorage.removeItem("cv_user");
  };

  const setBookingSessionAndStore = (s: BookingSession | null) => {
    setBookingSession(s);
    if (s) sessionStorage.setItem("cv_booking", JSON.stringify(s));
    else sessionStorage.removeItem("cv_booking");
  };

  const setIsSeededAndStore = (v: boolean) => {
    setIsSeeded(v);
    if (v) localStorage.setItem("cv_seeded", "true");
  };

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      bookingSession,
      setBookingSession: setBookingSessionAndStore,
      isSeeded,
      setIsSeeded: setIsSeededAndStore,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
