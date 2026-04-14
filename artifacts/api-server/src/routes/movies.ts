import { Router } from "express";
import { db } from "@workspace/db";
import { moviesTable, showtimesTable, reviewsTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";

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
    return res.json({ movies: movies.map(parseMovie) });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch movies" });
  }
});

router.get("/movies/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [movie] = await db.select().from(moviesTable).where(eq(moviesTable.id, id));
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    return res.json({ movie: parseMovie(movie) });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch movie" });
  }
});

router.get("/movies/:id/showtimes", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { date } = req.query;
    const showtimes = await db.select().from(showtimesTable).where(eq(showtimesTable.movieId, id));
    const filtered = date ? showtimes.filter(s => s.date === date) : showtimes;
    return res.json({ showtimes: filtered });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch showtimes" });
  }
});

router.get("/movies/:id/reviews", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const reviews = await db.select().from(reviewsTable).where(eq(reviewsTable.movieId, id)).orderBy(desc(reviewsTable.createdAt));
    return res.json({ reviews });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

router.post("/movies/:id/reviews", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { userName, rating, comment } = req.body;
    if (!userName || rating == null || !comment) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const [review] = await db.insert(reviewsTable).values({
      movieId: id,
      userName,
      rating,
      comment
    }).returning();

    // Update movie rating and votes
    const [movie] = await db.select().from(moviesTable).where(eq(moviesTable.id, id));
    if (movie) {
      const currentRating = movie.rating || 0;
      const currentVotes = movie.votes || 0;
      const newVotes = currentVotes + 1;
      const newRating = Number((((currentRating * currentVotes) + rating) / newVotes).toFixed(1));
      
      await db.update(moviesTable)
        .set({ rating: newRating, votes: newVotes })
        .where(eq(moviesTable.id, id));
    }

    return res.json({ success: true, review });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to post review: " + err.message });
  }
});

export default router;
