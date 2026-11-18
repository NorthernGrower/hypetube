const express = require("express");
const router = express.Router();

// Import the real scraper
const torrentScraper = require("../scraping/torrentScraper");

// GET /api/torrents/search?q=term&filter=movies
router.get("/search", async (req, res) => {
  const query = req.query.q?.trim() || "dune"; // default term if none supplied
  const filter = req.query.filter?.trim() || "movies";

  try {
    // Call the scraper – it returns { movies, total, ... }
    const result = await torrentScraper.search(query, filter);

    if (result.error) {
      return res.status(500).json({ error: result.error });
    }

    // We only need the array of movies/torrents for the UI
    res.json({
      movies: result.movies,
      total: result.total,
      query: result.searchQuery,
      filter: result.filter
    });
  } catch (err) {
    console.error("Torrent route error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;