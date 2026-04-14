import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

const router = Router();

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "cineverse_salt").digest("hex");
}

router.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password, city } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }
    const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }
    const [user] = await db.insert(usersTable).values({
      name,
      email,
      passwordHash: hashPassword(password),
      city: city || "Mumbai",
    }).returning();
    res.json({ user: { id: user.id, name: user.name, email: user.email, city: user.city, cinePoints: user.cinePoints } });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (!user || user.passwordHash !== hashPassword(password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.json({ user: { id: user.id, name: user.name, email: user.email, city: user.city, cinePoints: user.cinePoints } });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

router.get("/auth/me/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id));
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user: { id: user.id, name: user.name, email: user.email, city: user.city, cinePoints: user.cinePoints } });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

router.patch("/auth/profile/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, city, currentPassword, newPassword } = req.body;

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id));
    if (!user) return res.status(404).json({ error: "User not found" });

    const updates: any = {};
    if (name) updates.name = name;
    if (city) updates.city = city;

    if (newPassword) {
      if (!currentPassword || user.passwordHash !== hashPassword(currentPassword)) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }
      updates.passwordHash = hashPassword(newPassword);
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const [updated] = await db.update(usersTable).set(updates).where(eq(usersTable.id, id)).returning();
    res.json({ user: { id: updated.id, name: updated.name, email: updated.email, city: updated.city, cinePoints: updated.cinePoints } });
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

export default router;

