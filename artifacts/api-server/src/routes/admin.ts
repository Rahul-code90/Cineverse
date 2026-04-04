import { Router } from "express";
import { db } from "@workspace/db";
import { bookingsTable, moviesTable, eventsTable, usersTable } from "@workspace/db/schema";
import { sql, desc, eq } from "drizzle-orm";

const router = Router();

router.get("/admin/stats", async (req, res) => {
  try {
    const [totalRevenueResult] = await db
      .select({ total: sql<number>`COALESCE(SUM(${bookingsTable.totalAmount}), 0)` })
      .from(bookingsTable)
      .where(eq(bookingsTable.status, "confirmed"));

    const today = new Date().toISOString().slice(0, 10);
    const [todayBookingsResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(bookingsTable)
      .where(sql`DATE(${bookingsTable.createdAt}) = ${today}`);

    const [totalUsersResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(usersTable);

    const recentBookings = await db.select().from(bookingsTable)
      .orderBy(desc(bookingsTable.createdAt))
      .limit(10);

    const movies = await db.select().from(moviesTable).where(eq(moviesTable.isActive, 1));
    const events = await db.select().from(eventsTable).limit(5);

    res.json({
      stats: {
        totalRevenue: totalRevenueResult?.total || 0,
        bookingsToday: Number(todayBookingsResult?.count) || 0,
        totalUsers: Number(totalUsersResult?.count) || 0,
      },
      recentBookings,
      movies,
      events,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch admin stats" });
  }
});

export default router;
