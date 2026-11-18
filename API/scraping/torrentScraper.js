const axios = require("axios");
const { getMovieInfo } = require("../services/imdbScraper");

/**
 * Scrapes a list of torrents/movies for a specific search term.
 * @param {string} query - The search term.
 * @param {string} filter - 'movies' or 'shows'.
 * @returns {Promise<Object>} - { movies, total, searchQuery, filter }
 */
async function search(query, filter) {
  try {
    // Mock data structure for demonstration. 
    // In a real app, you might scrape a torrent tracker (like The Movie DB or Rutracker) here.
    // For now, we simulate fetching data and enriching it with the IMDb scraper.
    
    // Example: Fetch from a mock torrent source or your own DB
    const mockTorrentSource = [
      {
        title: "Dune",
        year: "2021",
        type: "movie",
        // We enrich this with the IMDb scraper below
      },
      {
        title: "The Terminator", 
        year: "1984",
        type: "movie",
      },
      {
        title: "Inception",
        year: "2010",
        type: "movie",
      }
    ];

    const movies = await Promise.all(
      mockTorrentSource.map(async (item) => {
        // Skip scraping if it's a show (filter logic)
        if (filter !== "movies" && item.type === "movie") return item;

        // Enrich with real IMDb data (Poster + Description)
        const info = await getMovieInfo(item.title);
        
        return {
          ...item,
          ...info, // Merges title, year, poster, description
          poster: info.poster, // Ensure poster is explicitly set
        };
      })
    );

    return {
      movies,
      total: movies.length,
      searchQuery: query,
      filter,
    };
  } catch (err) {
    console.error("Scrape error:", err);
    return {
      movies: [],
      total: 0,
      searchQuery: query,
      filter,
      error: err.message
    };
  }
}

module.exports = { search };