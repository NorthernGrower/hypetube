import React from "react";
import { useNavigate } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  // Helper to safely handle missing images
  const getPoster = (posterUrl) => {
    if (!posterUrl) return "https://cdn.jsdelivr.net/npm/@heroicons/heroicons-24-regular@1.0.16/dist/heroicons.24-regular.svg"; // Or a simple local fallback
    
    // Ensure the image URL is valid (handle potential relative paths from scraper)
    const safeUrl = posterUrl.startsWith("//") ? "https:" + posterUrl : posterUrl;
    return safeUrl;
  };

  // Helper for description truncation
  const description = movie.description?.substring(0, 100) + (movie.description.length > 100 ? "..." : "");

  return (
    <div className="movie-card">
      <div 
        className="movie-poster-container" 
        style={{ backgroundImage: `url(${getPoster(movie.poster)})` }}
        // Optional: add a background image tag if you prefer
      >
        <img 
          src={getPoster(movie.poster)} 
          alt={movie.title} 
          onError={(e) => {
            e.target.src = "https://cdn-icons-png.flaticon.com/512/4338-4338447-movie.jpg"; // Ultimate fallback
          }}
        />
      </div>
      
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>{description}</p>
        
        {/* Buttons to search for torrents for this specific movie */}
        <button 
          onClick={() => navigate(`/torrents/search?q=${encodeURIComponent(movie.title)}`)}
          className="btn btn-primary"
        >
          Find Torrents
        </button>
      </div>
    </div>
  );
};

export default MovieCard;