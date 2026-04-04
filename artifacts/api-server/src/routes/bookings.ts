import { Router } from "express";
import { db } from "@workspace/db";
import { bookingsTable, showtimesTable } from "@workspace/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import crypto from "crypto";

const router = Router();

function generateBookingRef(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `CV${dateStr}${rand}`;
}

router.get("/bookings", async (req, res) => {
  try {
    const userId = parseInt(req.query.userId as string) || 1;
    const bookings = await db.select().from(bookingsTable)
      .where(eq(bookingsTable.userId, userId))
      .orderBy(desc(bookingsTable.createdAt));
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

router.post("/bookings", async (req, res) => {
  try {
    const {
      userId = 1,
      movieId,
      eventId,
      showtimeId,
      movieTitle,
      venue,
      date,
      time,
      format,
      seats,
      totalAmount,
      convenienceFee,
      posterUrl = "",
      posterGradient = "from-gray-800 to-gray-950",
    } = req.body;

    if (!movieTitle || !venue || !date || !time || !seats?.length || !totalAmount) {
      return res.status(400).json({ error: "Missing required booking fields" });
    }

    const bookingRef = generateBookingRef();

    const [booking] = await db.insert(bookingsTable).values({
      bookingRef,
      userId,
      movieId,
      eventId,
      showtimeId,
      movieTitle,
      venue,
      date,
      time,
      format: format || "2D",
      seats,
      totalAmount,
      convenienceFee: convenienceFee || Math.round(totalAmount * 0.1),
      status: "confirmed",
      posterUrl,
      posterGradient,
    }).returning();

    if (showtimeId) {
      await db.update(showtimesTable)
        .set({ availableSeats: sql`${showtimesTable.availableSeats} - ${seats.length}` })
        .where(eq(showtimesTable.id, showtimeId));
    }

    res.json({ booking });
  } catch (err) {
    res.status(500).json({ error: "Failed to create booking" });
  }
});

router.patch("/bookings/:id/cancel", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [booking] = await db.update(bookingsTable)
      .set({ status: "cancelled" })
      .where(eq(bookingsTable.id, id))
      .returning();
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json({ booking });
  } catch (err) {
    res.status(500).json({ error: "Failed to cancel booking" });
  }
});

router.patch("/bookings/:id/rate", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 10) {
      return res.status(400).json({ error: "Rating must be between 1 and 10" });
    }
    const [booking] = await db.update(bookingsTable)
      .set({ userRating: rating })
      .where(eq(bookingsTable.id, id))
      .returning();
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json({ booking });
  } catch (err) {
    res.status(500).json({ error: "Failed to rate booking" });
  }
});

export default router;
