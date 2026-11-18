import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFilm, faClock, faStar } from "@fortawesome/free-regular-svg-icons";

const TorrentResults = ({ torrents, onSearch, isLoading }) => {
  return (
    <div style={{ padding: "2rem 0" }}>
      <h2 style={{ marginBottom: "1rem", color: "#2196f3" }}>
        Search Results <span style={{fontSize: "0.8em", color: "#666"}}>({torrents.length})</span>
      </h2>
      
      {/* Search Input Area */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "2rem" }}>
        <input 
          type="text" 
          placeholder="Search for movies..." 
          value={onSearch ? "" : "All movies..."}
          onChange={(e) => onSearch(e.target.value)}
          style={{ 
            padding: "8px", 
            fontSize: "16px", 
            flex: 1,
            border: "1px solid #ddd",
            borderRadius: "4px"
          }}
        />
        <button 
          onClick={onSearch}
          style={{
            padding: "8px 16px",
            background: "#263238",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Go
        </button>
      </div>

      {/* Error or Empty State */}
      {!isLoading && torrents.length === 0 && (
        <div style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
          No torrents found. Try a different search term.
        </div>
      )}

      {/* The Grid of Movie Cards */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", 
        gap: "20px" 
      }}>
        {isLoading ? (
          // Loading Skeletons
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{
              height: "300px",
              background: "#eee",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#999"
            }}>
              Loading...
            </div>
          ))
        ) : (
          // Actual Movie Cards
          torrents.map((movie) => (
            <div 
              key={movie.id} 
              style={{
                background: "white",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                cursor: "pointer"
              }}
            >
              <img 
                src={movie.image} 
                alt={movie.title} 
                style={{
                  width: "100%", 
                  height: "220px", 
                  objectFit: "cover",
                  background: "#ccc"
                }}
              />
              <div style={{ padding: "10px" }}>
                <div style={{ 
                  fontWeight: "bold", 
                  fontSize: "0.95rem", 
                  margin: "0 0 5px 0",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  color: "#333"
                }}>
                  {movie.title}
                </div>
                
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#777" }}>
                  <span>{movie.year || movie.id}</span>
                  <span>{movie.seeders} ⬆ / {movie.leechers} ⬇</span>
                </div>
                
                <div style={{ 
                  marginTop: "5px", 
                  background: "#e3f2fd", 
                  color: "#0d47a1",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "0.75rem"
                }}>
                  {movie.genre || "Movie"}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TorrentResults;