const express = require("express");
const Movie = require("../schemas/Movie");

const router = express.Router();

// GET /api/movies?q=terminator -> Search movies
router.get("/search", (req, res) => {
  const query = req.query.q || "";
  
  // Simple text search on title and year
  Movie.find({
    title: new RegExp(query, "i")
  }, (err, movies) => {
    if (err) return res.json({ error: err.message });
    res.json(movies);
  });
});

// GET /api/movies -> Get all movies
router.get("/", (req, res) => {
  Movie.find({}, (err, movies) => {
    if (err) return res.json({ error: err.message });
    res.json(movies);
  });
});

module.exports = router;