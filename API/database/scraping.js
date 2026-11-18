/**
 * Centralized configuration for the Scraping System.
 * Keeps API keys, Base URLs, and Retry logic in one place.
 */

module.exports = {
  // The base domain for the external torrent API
  "baseUrl": "https://torrent-radar.api/v1/torrents", 
  
  // Delay between requests to respect rate limits
  "requestDelay": 500, 
  
  // Timeout in milliseconds
  "timeout": 10000, 
  
  // Custom headers to identify the app to the scraper
  "customHeaders": {
    "User-Agent": "Hypertube-Scanner/1.0"
  }
};