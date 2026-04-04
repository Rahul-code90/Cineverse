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

export default router;
