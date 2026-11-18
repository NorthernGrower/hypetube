const axios = require("axios");
const cheerio = require("cheerio");

/**
 * Fetches a movie's main poster and description from IMDb.
 * Uses the stable IMDb Image Proxy for direct image links.
 * @param {string} title - The movie title to fetch.
 * @returns {Promise<Object>} - { title, year, imdbId, poster, description }
 */
async function getMovieInfo(title) {
  if (!title) throw new Error("Title is required");

  // Normalize title for the query
  const cleanTitle = title.trim();
  const firstChar = encodeURIComponent(cleanTitle[0].toLowerCase());
  const query = encodeURIComponent(cleanTitle);

  // 1. Get the IMDb ID via the public suggestion API
  const suggestionUrl = `https://v2.sg.media-imdb.com/suggestion/${firstChar}/${query}.json`;
  const suggestionResp = await axios.get(suggestionUrl);
  const suggestionData = suggestionResp.data;

  if (!suggestionData.d || suggestionData.d.length === 0) {
    throw new Error(`No IMDb results found for "${cleanTitle}"`);
  }

  const firstResult = suggestionData.d[0];
  const imdbId = firstResult.id; // e.g., tt1234567
  const year = firstResult.y || null;
  const cleanTitle = firstResult.l || cleanTitle;

  // 2. Build the direct image link using the IMDb Image Proxy
  // The proxy automatically resizes and serves the correct quality
  const posterUrl = `https://m.media-imdb.com/${imdbId}.jpg`;

  // 3. Get the description from the page meta tag or JSON-LD
  const moviePageUrl = `https://www.imdb.com/title/${imdbId}/`;
  const pageResp = await axios.get(moviePageUrl);
  const $ = cheerio.load(pageResp.data);

  let description = "";
  // Try standard meta description first
  const descMeta = $('meta[name="description"]');
  if (descMeta.length > 0) {
    description = descMeta.attr("content");
    // Remove the "- IMDb" suffix if present
    description = description.replace(/-\s*IMDb\s*$/i, "").trim();
  }

  // Fallback: try JSON-LD script block
  if (!description && $('script[type="application/ld+json"]').length > 0) {
    const jsonLd = $('script[type="application/ld+json"]').html();
    const json = JSON.parse(jsonLd.replace("application/ld+json", ""));
    if (json.aggregateAnnotation && json.aggregateAnnotation.summary) {
      description = json.aggregateAnnotation.summary;
    }
  }

  return {
    title: cleanTitle,
    year,
    imdbId,
    poster: posterUrl, // Direct, reliable link
    description: description || "No description available.",
  };
}

module.exports = { getMovieInfo };