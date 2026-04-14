import { Router } from "express";
import { db } from "@workspace/db";
import { moviesTable, showtimesTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router = Router();

function parseMovie(movie: any) {
  return {
    ...movie,
    languages: typeof movie.languages === "string" ? JSON.parse(movie.languages) : movie.languages,
    cast: typeof movie.cast === "string" ? JSON.parse(movie.cast) : movie.cast,
  };
}

router.get("/movies", async (req, res) => {
  try {
    const movies = await db.select().from(moviesTable).where(eq(moviesTable.isActive, 1));
    res.json({ movies: movies.map(parseMovie) });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch movies" });
  }
});

router.get("/movies/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [movie] = await db.select().from(moviesTable).where(eq(moviesTable.id, id));
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.json({ movie: parseMovie(movie) });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch movie" });
  }
});

router.get("/movies/:id/showtimes", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { date } = req.query;
    const showtimes = await db.select().from(showtimesTable).where(eq(showtimesTable.movieId, id));
    const filtered = date ? showtimes.filter(s => s.date === date) : showtimes;
    res.json({ showtimes: filtered });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch showtimes" });
  }
});

export default router;
