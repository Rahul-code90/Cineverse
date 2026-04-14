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
    return res.json({ user: { id: user.id, name: user.name, email: user.email, city: user.city, cinePoints: user.cinePoints } });
  } catch (err) {
    return res.status(500).json({ error: "Registration failed" });
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
    return res.json({ user: { id: user.id, name: user.name, email: user.email, city: user.city, cinePoints: user.cinePoints } });
  } catch (err) {
    return res.status(500).json({ error: "Login failed" });
  }
});

router.get("/auth/me/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id));
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json({ user: { id: user.id, name: user.name, email: user.email, city: user.city, cinePoints: user.cinePoints } });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch user" });
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
    return res.json({ user: { id: updated.id, name: updated.name, email: updated.email, city: updated.city, cinePoints: updated.cinePoints } });
  } catch (err) {
    return res.status(500).json({ error: "Failed to update profile" });
  }
});

router.post("/auth/google", async (req, res) => {
  try {
    const { googleId, name, email } = req.body;
    if (!googleId || !email) return res.status(400).json({ error: "Google ID and email required" });

    let [user] = await db.select().from(usersTable).where(eq(usersTable.googleId, googleId));
    if (!user) {
      // Auto-register
      [user] = await db.insert(usersTable).values({
        name: name || "Google User",
        email,
        googleId,
        passwordHash: hashPassword("SOCIAL_LOGIN_BY_GOOGLE_PREVENT_ERROR"),
        city: "Mumbai"
      }).returning();
    }
    return res.json({ user: { id: user.id, name: user.name, email: user.email, city: user.city, cinePoints: user.cinePoints } });
  } catch (err) {
    return res.status(500).json({ error: "Google login failed" });
  }
});

router.post("/auth/phone", async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) return res.status(400).json({ error: "Phone number required" });

    let [user] = await db.select().from(usersTable).where(eq(usersTable.phoneNumber, phoneNumber));
    if (!user) {
      [user] = await db.insert(usersTable).values({
        name: "User " + phoneNumber.slice(-4),
        email: phoneNumber + "@cineverse.phone",
        phoneNumber,
        passwordHash: hashPassword("SOCIAL_LOGIN_BY_PHONE_PREVENT_ERROR"),
        city: "Mumbai"
      }).returning();
    }
    return res.json({ user: { id: user.id, name: user.name, email: user.email, city: user.city, cinePoints: user.cinePoints } });
  } catch (err) {
    return res.status(500).json({ error: "Phone login failed" });
  }
});

export default router;

