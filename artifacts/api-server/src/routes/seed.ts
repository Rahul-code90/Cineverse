import { Router } from "express";
import { db } from "@workspace/db";
import { moviesTable, eventsTable, showtimesTable, bookingsTable, usersTable } from "@workspace/db/schema";
import { sql } from "drizzle-orm";

const router = Router();

const MOVIES = [
  {
    title: "Dune: Part Three",
    genre: "Sci-Fi",
    rating: 9.1,
    votes: 42500,
    runtime: "2h 45m",
    certificate: "UA",
    languages: ["English", "Hindi", "Tamil"],
    badge: "NEW",
    synopsis: "Following the events of Dune: Part Two, Paul Atreides continues his journey as the Kwisatz Haderach, navigating the complex political landscape of the universe. As new threats emerge from beyond the known galaxy, Paul must unite the fractured factions of Arrakis while confronting his own destiny.",
    director: "Denis Villeneuve",
    cast: [
      { name: "Timothée Chalamet", role: "Paul Atreides", color: "from-amber-700 to-amber-900" },
      { name: "Zendaya", role: "Chani", color: "from-rose-700 to-rose-900" },
      { name: "Florence Pugh", role: "Lady Margot", color: "from-purple-700 to-purple-900" },
      { name: "Austin Butler", role: "Feyd-Rautha", color: "from-blue-700 to-blue-900" },
    ],
    posterUrl: "https://image.tmdb.org/t/p/w500/8b8R8l88XOedX922WuDnuw9t3KC.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
    posterGradient: "from-amber-800 via-amber-900 to-stone-950",
    popularity: 98,
    isActive: 1,
  },
  {
    title: "Oppenheimer 2",
    genre: "Drama",
    rating: 8.8,
    votes: 38200,
    runtime: "3h 10m",
    certificate: "UA",
    languages: ["English", "Hindi"],
    badge: "HOT",
    synopsis: "A continuation of the life and legacy of J. Robert Oppenheimer as the consequences of the atomic age reshape world politics. A deeply personal story of guilt, redemption, and the burden of scientific progress.",
    director: "Christopher Nolan",
    cast: [
      { name: "Cillian Murphy", role: "J. Robert Oppenheimer", color: "from-slate-700 to-slate-900" },
      { name: "Emily Blunt", role: "Katherine Oppenheimer", color: "from-blue-700 to-blue-900" },
      { name: "Matt Damon", role: "General Groves", color: "from-green-700 to-green-900" },
      { name: "Robert Downey Jr.", role: "Lewis Strauss", color: "from-red-700 to-red-900" },
    ],
    posterUrl: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg",
    posterGradient: "from-gray-700 via-gray-900 to-slate-950",
    popularity: 94,
    isActive: 1,
  },
  {
    title: "Spider-Man: Beyond",
    genre: "Action",
    rating: 8.5,
    votes: 56800,
    runtime: "2h 20m",
    certificate: "U",
    languages: ["English", "Hindi", "Tamil", "Telugu"],
    badge: "TRENDING",
    synopsis: "Miles Morales returns in a brand new adventure that takes him across dimensions he has never seen before. With new enemies threatening the multiverse, Miles must forge unexpected alliances to save everything he holds dear.",
    director: "Joaquim Dos Santos",
    cast: [
      { name: "Shameik Moore", role: "Miles Morales", color: "from-red-700 to-red-900" },
      { name: "Hailee Steinfeld", role: "Gwen Stacy", color: "from-pink-700 to-pink-900" },
      { name: "Oscar Isaac", role: "Spider-Man 2099", color: "from-blue-700 to-blue-900" },
    ],
    posterUrl: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/ynXoOxmDHNQ4UAy0oU6avW71HVW.jpg",
    posterGradient: "from-red-800 via-red-900 to-slate-950",
    popularity: 91,
    isActive: 1,
  },
  {
    title: "Interstellar 2",
    genre: "Sci-Fi",
    rating: 9.3,
    votes: 29100,
    runtime: "2h 55m",
    certificate: "U",
    languages: ["English", "Hindi"],
    badge: "MUST WATCH",
    synopsis: "Years after Cooper's return from the wormhole, a new cosmic anomaly threatens Earth's future. A team of scientists and explorers must venture deeper into space than any human has before to unravel the mystery at the edge of the universe.",
    director: "Christopher Nolan",
    cast: [
      { name: "Matthew McConaughey", role: "Cooper", color: "from-blue-700 to-blue-900" },
      { name: "Jessica Chastain", role: "Murph", color: "from-orange-700 to-orange-900" },
      { name: "Anne Hathaway", role: "Brand", color: "from-teal-700 to-teal-900" },
    ],
    posterUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lZtvYcdeGiI.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/xu9zaAevzQ5nnrsXN6JcahLnG4i.jpg",
    posterGradient: "from-blue-800 via-blue-900 to-slate-950",
    popularity: 99,
    isActive: 1,
  },
  {
    title: "The Witcher Chronicles",
    genre: "Fantasy",
    rating: 8.2,
    votes: 21400,
    runtime: "2h 35m",
    certificate: "A",
    languages: ["English", "Hindi"],
    badge: "NEW",
    synopsis: "Geralt of Rivia faces his most challenging quest yet as ancient forces awaken across the Continent. An epic fantasy adventure that blurs the line between destiny and free will.",
    director: "Andrzej Sapkowski",
    cast: [
      { name: "Henry Cavill", role: "Geralt of Rivia", color: "from-gray-700 to-gray-900" },
      { name: "Anya Chalotra", role: "Yennefer", color: "from-purple-700 to-purple-900" },
      { name: "Freya Allan", role: "Ciri", color: "from-amber-700 to-amber-900" },
    ],
    posterUrl: "https://image.tmdb.org/t/p/w500/7VzOSMkJYPZB7S1TnzBB6iw5Lfz.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/3FbnF5LPJLEF3R53RsCpCZy4vg4.jpg",
    posterGradient: "from-purple-800 via-purple-900 to-slate-950",
    popularity: 87,
    isActive: 1,
  },
  {
    title: "Fast & Furious 12",
    genre: "Action",
    rating: 7.6,
    votes: 18200,
    runtime: "2h 10m",
    certificate: "UA",
    languages: ["English", "Hindi", "Tamil", "Telugu"],
    badge: "",
    synopsis: "Dom Toretto and his family face their most dangerous challenge yet when a mysterious enemy from the past returns with an army capable of ending their family forever.",
    director: "Louis Leterrier",
    cast: [
      { name: "Vin Diesel", role: "Dom Toretto", color: "from-orange-700 to-orange-900" },
      { name: "Michelle Rodriguez", role: "Letty", color: "from-red-700 to-red-900" },
      { name: "Tyrese Gibson", role: "Roman Pierce", color: "from-yellow-700 to-yellow-900" },
    ],
    posterUrl: "https://image.tmdb.org/t/p/w500/fiVW06jE7z9YnO4trhaMEdclSiC.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/4XM8DUTQb3lhLemJC51Jx4a2EuA.jpg",
    posterGradient: "from-orange-700 via-orange-900 to-slate-950",
    popularity: 78,
    isActive: 1,
  },
];

const EVENTS = [
  {
    name: "Coldplay World Tour 2026",
    category: "Concert",
    date: "Apr 15, 2026",
    venue: "DY Patil Stadium, Mumbai",
    city: "Mumbai",
    priceFrom: 2499,
    imageUrl: "https://picsum.photos/seed/coldplay2026/800/450",
    imageGradient: "from-cyan-700 via-blue-800 to-indigo-950",
    description: "Experience the magic of Coldplay live as they bring their Music of the Spheres World Tour to India. An unforgettable night of music, lights, and memories.",
    totalTickets: 60000,
    availableTickets: 42000,
  },
  {
    name: "IPL Final 2026",
    category: "Sports",
    date: "May 28, 2026",
    venue: "Wankhede Stadium, Mumbai",
    city: "Mumbai",
    priceFrom: 999,
    imageUrl: "https://picsum.photos/seed/iplFinal2026/800/450",
    imageGradient: "from-blue-700 via-indigo-800 to-slate-950",
    description: "Witness the thrilling climax of IPL 2026 at the iconic Wankhede Stadium. Two best teams battle it out for the ultimate cricket glory.",
    totalTickets: 33000,
    availableTickets: 8500,
  },
  {
    name: "Ed Sheeran Live",
    category: "Concert",
    date: "Jun 3, 2026",
    venue: "NSCI Dome, Mumbai",
    city: "Mumbai",
    priceFrom: 3999,
    imageUrl: "https://picsum.photos/seed/edsheeran2026/800/450",
    imageGradient: "from-orange-700 via-red-800 to-rose-950",
    description: "Ed Sheeran brings his Mathematics Tour to Mumbai for one unforgettable night. Sing along to all your favourite hits live!",
    totalTickets: 15000,
    availableTickets: 3200,
  },
  {
    name: "AR Rahman Night",
    category: "Concert",
    date: "Jul 12, 2026",
    venue: "Lal Bahadur Shastri Stadium, Hyderabad",
    city: "Hyderabad",
    priceFrom: 1499,
    imageUrl: "https://picsum.photos/seed/arrahman2026/800/450",
    imageGradient: "from-amber-700 via-yellow-800 to-orange-950",
    description: "The Mozart of Madras returns with a spectacular 4-hour live concert spanning his legendary 30-year career. An evening of pure musical bliss.",
    totalTickets: 40000,
    availableTickets: 22000,
  },
];

const VENUES = [
  "PVR ICON, Andheri West",
  "INOX Grand, Bandra",
  "Cinepolis, Goregaon",
  "Carnival Cinemas, Thane",
];
const FORMATS = ["2D", "3D", "IMAX", "4DX"];
const FORMAT_PRICES: Record<string, number> = { "2D": 200, "3D": 350, "IMAX": 450, "4DX": 550 };
const DATES = ["2026-04-03", "2026-04-04", "2026-04-05", "2026-04-06", "2026-04-07"];
const TIMES = ["10:00 AM", "01:30 PM", "04:00 PM", "06:45 PM", "09:30 PM", "11:55 PM"];

router.post("/seed", async (req, res) => {
  try {
    await db.execute(sql`TRUNCATE TABLE bookings, showtimes, events, movies, users RESTART IDENTITY CASCADE`);

    const insertedMovies = await db.insert(moviesTable).values(MOVIES).returning();
    const insertedEvents = await db.insert(eventsTable).values(EVENTS).returning();

    const showtimeRows: any[] = [];
    for (const movie of insertedMovies) {
      for (const venue of VENUES) {
        for (const date of DATES) {
          const pickedFormats = FORMATS.slice(0, Math.floor(Math.random() * 3) + 1);
          for (const format of pickedFormats) {
            for (const time of TIMES.slice(0, 3)) {
              const total = format === "IMAX" ? 150 : format === "4DX" ? 100 : 200;
              const available = Math.floor(total * (0.4 + Math.random() * 0.6));
              showtimeRows.push({
                movieId: movie.id,
                venue,
                date,
                time,
                format,
                price: FORMAT_PRICES[format],
                totalSeats: total,
                availableSeats: available,
              });
            }
          }
        }
      }
    }
    await db.insert(showtimesTable).values(showtimeRows);

    const [demoUser] = await db.insert(usersTable).values({
      name: "Aryan Singh",
      email: "aryan@cineverse.com",
      passwordHash: "demo",
      city: "Mumbai",
      cinePoints: 1250,
    }).returning();

    const sampleBookings = [
      {
        bookingRef: "CV20260403DEMO1",
        userId: demoUser.id,
        movieId: insertedMovies[0].id,
        movieTitle: "Dune: Part Three",
        venue: "PVR ICON, Andheri West",
        date: "Apr 03, 2026",
        time: "01:30 PM",
        format: "IMAX",
        seats: ["C4", "C5", "C6"],
        totalAmount: 1350,
        convenienceFee: 135,
        status: "confirmed",
        posterUrl: MOVIES[0].posterUrl,
        posterGradient: MOVIES[0].posterGradient,
      },
      {
        bookingRef: "CV20260325DEMO2",
        userId: demoUser.id,
        movieId: insertedMovies[3].id,
        movieTitle: "Interstellar 2",
        venue: "INOX Grand, Bandra",
        date: "Mar 25, 2026",
        time: "06:45 PM",
        format: "IMAX",
        seats: ["F8", "F9"],
        totalAmount: 900,
        convenienceFee: 90,
        status: "confirmed",
        userRating: 9,
        posterUrl: MOVIES[3].posterUrl,
        posterGradient: MOVIES[3].posterGradient,
      },
      {
        bookingRef: "CV20260310DEMO3",
        userId: demoUser.id,
        movieId: insertedMovies[2].id,
        movieTitle: "Spider-Man: Beyond",
        venue: "Cinepolis, Goregaon",
        date: "Mar 10, 2026",
        time: "04:00 PM",
        format: "3D",
        seats: ["H12", "H13", "H14", "H15"],
        totalAmount: 1400,
        convenienceFee: 140,
        status: "cancelled",
        posterUrl: MOVIES[2].posterUrl,
        posterGradient: MOVIES[2].posterGradient,
      },
    ];
    await db.insert(bookingsTable).values(sampleBookings);

    res.json({
      success: true,
      message: "Database seeded successfully",
      counts: {
        movies: insertedMovies.length,
        events: insertedEvents.length,
        showtimes: showtimeRows.length,
        demoUserId: demoUser.id,
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: "Seed failed: " + err.message });
  }
});

export default router;
