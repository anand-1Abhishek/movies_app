import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const API_KEY = "67ab9d14"; 
const API_URL = "http://www.omdbapi.com/";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMovies = async () => {
    if (!searchTerm.trim()) {
      setError("Please enter a search term");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${API_URL}?apikey=${API_KEY}&s=${searchTerm}`);
      
      if (response.data.Response === "False") {
        setError(response.data.Error || "No movies found");
        setMovies([]);
      } else {
        setMovies(response.data.Search || []);
      }
    } catch (err) {
      setError("Error fetching movies. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMovieDetails = async (id) => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${API_URL}?apikey=${API_KEY}&i=${id}`);
      setSelectedMovie(response.data);
    } catch (err) {
      setError("Error fetching movie details. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchMovies();
    }
  };

  return (
    <div className="container">
      <h1>Movie Search App</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={fetchMovies} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading && !selectedMovie && <div className="loading">Loading...</div>}

      {selectedMovie ? (
        <div className="movie-detail">
          <button onClick={() => setSelectedMovie(null)}>Back to Results</button>
          
          <div className="movie-detail-poster">
            {selectedMovie.Poster && selectedMovie.Poster !== "N/A" ? (
              <img src={selectedMovie.Poster} alt={selectedMovie.Title} />
            ) : (
              <div className="no-poster">No Poster Available</div>
            )}
          </div>
          
          <div className="movie-detail-info">
            <h2>{selectedMovie.Title} ({selectedMovie.Year})</h2>
            
            {selectedMovie.imdbRating && (
              <div className="rating">IMDb: {selectedMovie.imdbRating}/10</div>
            )}
            
            <p><strong>Plot:</strong> {selectedMovie.Plot}</p>
            <p><strong>Director:</strong> {selectedMovie.Director}</p>
            <p><strong>Actors:</strong> {selectedMovie.Actors}</p>
            <p><strong>Genre:</strong> {selectedMovie.Genre}</p>
            <p><strong>Released:</strong> {selectedMovie.Released}</p>
            {selectedMovie.Runtime && <p><strong>Runtime:</strong> {selectedMovie.Runtime}</p>}
            {selectedMovie.Awards && <p><strong>Awards:</strong> {selectedMovie.Awards}</p>}
          </div>
        </div>
      ) : (
        <div className="movie-list">
          {movies.map((movie) => (
            <div
              key={movie.imdbID}
              className="movie-card"
              onClick={() => fetchMovieDetails(movie.imdbID)}
            >
              {movie.Poster && movie.Poster !== "N/A" ? (
                <img src={movie.Poster} alt={movie.Title} />
              ) : (
                <div className="no-poster">No Poster</div>
              )}
              <div className="movie-card-content">
                <h3>{movie.Title}</h3>
                <p>{movie.Year}</p>
                <span className="type">{movie.Type}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;