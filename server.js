const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./API/routes/auth");
const userRoutes = require("./API/routes/user");
const commentRoutes = require("./API/routes/commentRoutes");
const movieRoutes = require("./API/routes/movieRoutes");
const searchRoutes = require("./API/routes/searchRoutes");
const torrentRoutes = require("./API/routes/torrentRoutes");

// Load environment variables
dotenv.config();

// Import the custom scraper
const { search: searchTorrents } = require("./API/scraping/torrentScraper");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/torrents", torrentRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Ready to scan torrents at http://localhost:${PORT}/api/torrents/search`);
});

module.exports = app;