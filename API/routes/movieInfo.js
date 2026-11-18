const express = require("express");
const router = express.Router();
const { getMovieInfo } = require("../services/imdbScraper");
const Movie = require("../schemas/Movie");

/**
 * POST /api/movies/scrape
 * Sends a movie title and receives the full IMDb entry (with poster) back.
 */
router.post("/scrape", async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Missing required field: title" });
  }

  try {
    // Scrape IMDb for poster & description
    const info = await getMovieInfo(title);

    // Check if we already have this movie in the DB
    const existing = await Movie.findOne({ imdbId: info.imdbId });
    
    if (existing) {
      // If it exists, we just return the full object with the poster to update the UI
      return res.json({
        message: "Movie already exists (or updated)",
        movie: existing,
      });
    }

    // Create the new Movie document
    const newMovie = new Movie({
      title: info.title,
      year: info.year,
      imdbId: info.imdbId,
      poster: info.poster, // Direct IMDb proxy link
      description: info.description,
    });

    await newMovie.save();

    res.json({
      message: "Movie successfully added with thumbnail",
      movie: newMovie,
    });
  } catch (err) {
    console.error("IMDb scrape error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;