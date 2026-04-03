import { useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { MovieDetailPage } from "./pages/MovieDetailPage";
import { SeatSelectionPage } from "./pages/SeatSelectionPage";
import { PaymentPage } from "./pages/PaymentPage";
import { BookingHistoryPage } from "./pages/BookingHistoryPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { LoginPage } from "./pages/LoginPage";

const BARE_LAYOUT_ROUTES = ["/login", "/admin"];

function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const isBare = BARE_LAYOUT_ROUTES.some(r => location.startsWith(r));

  if (isBare) return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <div className="pt-16">
        {children}
      </div>
    </div>
  );
}

function BookingHistoryWrapper() {
  const [location] = useLocation();
  const [searchQuery] = useState("");
  return <BookingHistoryPage searchQuery={searchQuery} />;
}

export default function App() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/admin" component={AdminDashboardPage} />
      <Route>
        {() => (
          <LayoutWrapper />
        )}
      </Route>
    </Switch>
  );
}

function LayoutWrapper() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <div className="pt-16">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/movies/:id" component={MovieDetailPage} />
          <Route path="/seats" component={SeatSelectionPage} />
          <Route path="/payment" component={PaymentPage} />
          <Route path="/bookings">
            {() => <BookingHistoryPage searchQuery={searchQuery} />}
          </Route>
          <Route>
            {() => <HomePage />}
          </Route>
        </Switch>
      </div>
    </div>
  );
}
