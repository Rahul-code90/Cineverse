import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { BookingHistoryPage } from "./pages/BookingHistoryPage";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <BookingHistoryPage searchQuery={searchQuery} />
    </div>
  );
}
