import { Router } from "express";
import { db } from "@workspace/db";
import { bookingsTable, moviesTable, eventsTable, usersTable, showtimesTable } from "@workspace/db/schema";
import { sql, desc, eq } from "drizzle-orm";

const router = Router();

router.get("/admin/stats", async (req, res) => {
  try {
    const [totalRevenueResult] = await db
      .select({ total: sql<number>`COALESCE(SUM(${bookingsTable.totalAmount}), 0)` })
      .from(bookingsTable)
      .where(eq(bookingsTable.status, "confirmed"));

    // SQLite: use strftime for date comparison instead of DATE()
    const today = new Date().toISOString().slice(0, 10);
    const [todayBookingsResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(bookingsTable)
      .where(sql`strftime('%Y-%m-%d', ${bookingsTable.createdAt}) = ${today}`);

    const [totalUsersResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(usersTable);

    const recentBookings = await db.select().from(bookingsTable)
      .orderBy(desc(bookingsTable.createdAt))
      .limit(10);

    // Parse seats JSON for each booking
    const parsedBookings = recentBookings.map(b => ({
      ...b,
      seats: typeof b.seats === "string" ? JSON.parse(b.seats) : b.seats,
    }));

    const movies = await db.select().from(moviesTable).where(eq(moviesTable.isActive, 1));
    const events = await db.select().from(eventsTable).limit(5);

    // REAL-TIME ANALYTICS: Daily Revenue Trend (Last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoISO = thirtyDaysAgo.toISOString().slice(0, 10);

    const revenueTrendRaw = await db
      .select({
        day: sql<string>`strftime('%Y-%m-%d', ${bookingsTable.createdAt})`,
        revenue: sql<number>`SUM(${bookingsTable.totalAmount})`
      })
      .from(bookingsTable)
      .where(sql`${bookingsTable.status} = 'confirmed' AND strftime('%Y-%m-%d', ${bookingsTable.createdAt}) >= ${thirtyDaysAgoISO}`)
      .groupBy(sql`strftime('%Y-%m-%d', ${bookingsTable.createdAt})`)
      .orderBy(sql`strftime('%Y-%m-%d', ${bookingsTable.createdAt})`);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const revenueTrend = revenueTrendRaw.map(r => {
      const [year, month, day] = r.day.split("-");
      return {
        month: `${day} ${monthNames[parseInt(month) - 1]}`, // Label is "DD MMM"
        revenue: r.revenue
      };
    });

    // REAL-TIME ANALYTICS: Booking Mix
    const movieBookingsCount = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(bookingsTable)
      .where(sql`${bookingsTable.movieId} IS NOT NULL AND ${bookingsTable.status} = 'confirmed'`);
    
    const eventBookingsCount = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(bookingsTable)
      .where(sql`${bookingsTable.eventId} IS NOT NULL AND ${bookingsTable.status} = 'confirmed'`);

    const bookingMix = [
      { label: "Movies", count: movieBookingsCount[0].count, color: "#e63946" },
      { label: "Concerts & Events", count: eventBookingsCount[0].count, color: "#3b82f6" },
      { label: "Sports", count: 0, color: "#a855f7" },
      { label: "Other", count: 0, color: "#f59e0b" },
    ];

    // Parse JSON fields for movies
    const parsedMovies = movies.map(m => ({
      ...m,
      languages: typeof m.languages === "string" ? JSON.parse(m.languages) : m.languages,
      cast: typeof m.cast === "string" ? JSON.parse(m.cast) : m.cast,
    }));

    return res.json({
      stats: {
        totalRevenue: totalRevenueResult?.total || 0,
        bookingsToday: Number(todayBookingsResult?.count) || 0,
        totalUsers: Number(totalUsersResult?.count) || 0,
      },
      recentBookings: parsedBookings,
      movies: parsedMovies,
      events,
      revenueTrend,
      bookingMix
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to fetch admin stats: " + err.message });
  }
});

router.get("/admin/schedule", async (req, res) => {
  try {
    const showtimes = await db.select().from(showtimesTable).orderBy(desc(showtimesTable.date));
    const movies = await db.select().from(moviesTable);
    const movieMap = Object.fromEntries(movies.map(m => [m.id, m]));
    
    const schedule = showtimes.map(st => ({
      ...st,
      movieTitle: movieMap[st.movieId]?.title || "Unknown Movie",
    }));

    return res.json({ schedule });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to fetch schedule: " + err.message });
  }
});

router.get("/admin/schedule/export", async (req, res) => {
  try {
    const showtimes = await db.select().from(showtimesTable).orderBy(desc(showtimesTable.date));
    const movies = await db.select().from(moviesTable);
    const movieMap = Object.fromEntries(movies.map(m => [m.id, m]));
    
    if (showtimes.length === 0) {
      return res.status(404).send("No schedule data found");
    }

    const headers = ["ID", "Movie Title", "Venue", "Date", "Time", "Format", "Price", "Available Seats"].join(",");
    const rows = showtimes.map(st => {
      const data = [
        st.id,
        movieMap[st.movieId]?.title || "Unknown",
        st.venue,
        st.date,
        st.time,
        st.format,
        st.price,
        st.availableSeats
      ];
      return data.map(val => {
        if (typeof val === 'string') {
          const escaped = val.replace(/"/g, '""');
          return `"${escaped}"`;
        }
        return val;
      }).join(",");
    });

    const csvContent = [headers, ...rows].join("\n");
    
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=cineverse_schedule.csv");
    return res.send(csvContent);
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to export schedule: " + err.message });
  }
});

router.get("/admin/bookings/export", async (req, res) => {
  try {
    const allBookings = await db.select().from(bookingsTable).orderBy(desc(bookingsTable.createdAt));
    
    if (allBookings.length === 0) {
      return res.status(404).send("No bookings found");
    }

    const headers = Object.keys(allBookings[0]).join(",");
    const rows = allBookings.map(b => {
      return Object.values(b).map(val => {
        if (typeof val === 'string') {
          // Escape quotes and wrap string in quotes if it contains commas
          const escaped = val.replace(/"/g, '""');
          return `"${escaped}"`;
        }
        if (val === null || val === undefined) return "";
        return val;
      }).join(",");
    });

    const csvContent = [headers, ...rows].join("\n");
    
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=cineverse_bookings.csv");
    return res.send(csvContent);
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to export bookings: " + err.message });
  }
});

router.post("/admin/movies", async (req, res) => {
  try {
    const { 
      title, genre, runtime, posterUrl, backdropUrl, trailerUrl, 
      certificate = "UA", synopsis = "Newly added movie.",
      languages = [], cast = [] 
    } = req.body;
    
    if (!title || !genre || !runtime) {
      return res.status(400).json({ error: "Missing required fields (title, genre, runtime)" });
    }

    const [newMovie] = await db.insert(moviesTable).values({
      title,
      genre,
      runtime,
      posterUrl: posterUrl || "",
      backdropUrl: backdropUrl || "",
      trailerUrl: trailerUrl || "",
      certificate,
      synopsis,
      languages: JSON.stringify(languages) || "[]",
      cast: JSON.stringify(cast) || "[]",
      rating: 0,
      votes: 0,
      badge: "NEW",
      isActive: 1,
    }).returning();

    // Dynamically generate 5 days of showtimes instantly
    function getNextDates(count: number): string[] {
      return Array.from({ length: count }, (_, i) => {
        const now = new Date();
        const date = new Date(now.getTime() + (i * 24 * 60 * 60 * 1000));
        return date.toISOString().split("T")[0];
      });
    }

    const upcomingDates = getNextDates(5);
    const standardTimes = ["10:00 AM", "02:30 PM", "07:00 PM"];
    const standardVenues = ["PVR ICON, Andheri West", "INOX Grand, Bandra", "Cinepolis, Goregaon", "Carnival Cinemas, Thane"];
    
    const newShowtimes: any[] = [];
    for (const d of upcomingDates) {
      for (const t of standardTimes) {
        for (const v of standardVenues) {
          newShowtimes.push({
            movieId: newMovie.id,
            venue: v,
            date: d,
            time: t,
            format: "2D",
            price: 250,
            totalSeats: 150,
            availableSeats: 150
          });
        }
      }
    }
    
    if (newShowtimes.length > 0) {
      await db.insert(showtimesTable).values(newShowtimes);
    }

    return res.json({ success: true, movie: newMovie });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to add movie: " + err.message });
  }
});

router.delete("/admin/movies/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [updated] = await db.update(moviesTable)
      .set({ isActive: 0 })
      .where(eq(moviesTable.id, id))
      .returning();
      
    if (!updated) {
      return res.status(404).json({ error: "Movie not found" });
    }
    
    return res.json({ success: true, message: "Movie deactivated." });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to delete movie: " + err.message });
  }
});

router.patch("/admin/movies/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates = req.body;

    // Remove id from updates if present
    delete updates.id;

    const [updated] = await db.update(moviesTable)
      .set({
        ...updates,
        // Ensure some fields stay strings if they was passed as objects
        languages: updates.languages ? JSON.stringify(updates.languages) : undefined,
        cast: updates.cast ? JSON.stringify(updates.cast) : undefined,
      })
      .where(eq(moviesTable.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: "Movie not found" });
    }

    return res.json({ success: true, movie: updated });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to update movie: " + err.message });
  }
});

router.get("/admin/users", async (req, res) => {
  try {
    const users = await db.select().from(usersTable).orderBy(desc(usersTable.createdAt));
    return res.json({ users });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to fetch users: " + err.message });
  }
});

router.get("/admin/users/export", async (req, res) => {
  try {
    const allUsers = await db.select().from(usersTable).orderBy(desc(usersTable.createdAt));
    
    if (allUsers.length === 0) {
      return res.status(404).send("No users found");
    }

    const headers = ["ID", "Name", "Email", "Google ID", "Phone Number", "City", "CinePoints", "Created At"].join(",");
    const rows = allUsers.map(u => {
      const data = [
        u.id,
        u.name,
        u.email,
        (u as any).googleId || "",
        (u as any).phoneNumber || "",
        u.city,
        u.cinePoints || 0,
        u.createdAt
      ];
      return data.map(val => {
        if (typeof val === 'string') {
          const escaped = val.replace(/"/g, '""');
          return `"${escaped}"`;
        }
        return val;
      }).join(",");
    });

    const csvContent = [headers, ...rows].join("\n");
    
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=cineverse_users.csv");
    return res.send(csvContent);
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to export users: " + err.message });
  }
});

router.post("/admin/showtimes", async (req, res) => {
  try {
    const { movieId, date, time, venue, format = "2D", price = 250, totalSeats = 150 } = req.body;
    if (!movieId || !date || !time || !venue) {
      return res.status(400).json({ error: "Missing required fields (movieId, date, time, venue)" });
    }
    const [showtime] = await db.insert(showtimesTable).values({
      movieId,
      date,
      time,
      venue,
      format,
      price,
      totalSeats,
      availableSeats: totalSeats
    }).returning();
    
    return res.json({ success: true, showtime });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to add showtime: " + err.message });
  }
});

router.post("/admin/events", async (req, res) => {
  try {
    const { name, category, venue, date, priceFrom, imageUrl, availableTickets = 150, isHot = 0 } = req.body;
    if (!name || !category || !venue || !date || !priceFrom) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const [event] = await db.insert(eventsTable).values({
      name,
      category,
      venue,
      date,
      priceFrom,
      imageUrl: imageUrl || "",
      imageGradient: "from-indigo-600 to-violet-600",
      availableTickets,
      isHot: isHot ? 1 : 0
    }).returning();
    return res.json({ success: true, event: event });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to create event: " + err.message });
  }
});

router.patch("/admin/events/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates = req.body;
    const [updated] = await db.update(eventsTable)
      .set(updates)
      .where(eq(eventsTable.id, id))
      .returning();
    if (!updated) return res.status(404).json({ error: "Event not found" });
    return res.json({ success: true, event: updated });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to update event: " + err.message });
  }
});

router.delete("/admin/events/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(eventsTable).where(eq(eventsTable.id, id));
    return res.json({ success: true, message: "Event deleted." });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to delete event: " + err.message });
  }
});

export default router;
