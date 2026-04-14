import { db } from "@workspace/db";
import { showtimesTable, moviesTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

async function backfill() {
  const [movie] = await db.select().from(moviesTable).where(eq(moviesTable.title, "The Taj Story"));
  if (!movie) {
    console.log("The Taj Story not found.");
    return;
  }

  // Get next 5 dates
  const dates = Array.from({ length: 5 }, (_, i) => {
    const now = new Date();
    const date = new Date(now.getTime() + (i * 24 * 60 * 60 * 1000));
    return date.toISOString().split("T")[0];
  });
  
  const standardTimes = ["10:00 AM", "02:30 PM", "07:00 PM"];
  const standardVenues = ["PVR ICON, Andheri West", "INOX Grand, Bandra", "Cinepolis, Goregaon", "Carnival Cinemas, Thane"];

  console.log("Generating missing showtimes for:", movie.title);

  const newShowtimes: any[] = [];
  for (const d of dates) {
    for (const t of standardTimes) {
      for (const v of standardVenues) {
        newShowtimes.push({
          movieId: movie.id,
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

  await db.insert(showtimesTable).values(newShowtimes);
  console.log(`Successfully added ${newShowtimes.length} showtimes for missing venues.`);
}

backfill();
