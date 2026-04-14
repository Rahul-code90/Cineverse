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

    // Parse JSON fields for movies
    const parsedMovies = movies.map(m => ({
      ...m,
      languages: typeof m.languages === "string" ? JSON.parse(m.languages) : m.languages,
      cast: typeof m.cast === "string" ? JSON.parse(m.cast) : m.cast,
    }));

    res.json({
      stats: {
        totalRevenue: totalRevenueResult?.total || 0,
        bookingsToday: Number(todayBookingsResult?.count) || 0,
        totalUsers: Number(totalUsersResult?.count) || 0,
      },
      recentBookings: parsedBookings,
      movies: parsedMovies,
      events,
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch admin stats: " + err.message });
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
    res.send(csvContent);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to export bookings: " + err.message });
  }
});

router.post("/admin/movies", async (req, res) => {
  try {
    const { title, genre, runtime, posterUrl, backdropUrl, trailerUrl, certificate = "UA", synopsis = "Newly added movie." } = req.body;
    
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
      languages: "[]",
      cast: "[]",
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
    
    const newShowtimes: any[] = [];
    for (const d of upcomingDates) {
      for (const t of standardTimes) {
        newShowtimes.push({
          movieId: newMovie.id,
          venue: "CineVerse Main Theater",
          date: d,
          time: t,
          format: "2D",
          price: 250,
          totalSeats: 150,
          availableSeats: 150
        });
      }
    }
    
    if (newShowtimes.length > 0) {
      await db.insert(showtimesTable).values(newShowtimes);
    }

    res.json({ success: true, movie: newMovie });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to add movie: " + err.message });
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
    
    res.json({ success: true, message: "Movie deactivated." });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to delete movie: " + err.message });
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

    res.json({ success: true, movie: updated });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to update movie: " + err.message });
  }
});

export default router;
