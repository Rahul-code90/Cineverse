import { Router } from "express";
import { db } from "@workspace/db";
import { eventsTable } from "@workspace/db/schema";

const router = Router();

router.get("/events", async (req, res) => {
  try {
    const events = await db.select().from(eventsTable);
    return res.json({ events });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch events" });
  }
});

router.get("/events/:id", async (req, res) => {
  try {
    const { eq } = await import("drizzle-orm");
    const id = parseInt(req.params.id);
    const [event] = await db.select().from(eventsTable).where(eq(eventsTable.id, id));
    if (!event) return res.status(404).json({ error: "Event not found" });
    return res.json({ event });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch event" });
  }
});

export default router;
