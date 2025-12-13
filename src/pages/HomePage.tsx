import { useEffect, useState } from "react";

// Replace with your OMDb API key
//const API_KEY = import.meta.env.VITE_API_KEY;
const API_KEY = window.__ENV__?.VITE_API_KEY;
if (!API_KEY) {
  console.error("VITE_API_KEY is missing at runtime");
}


// Add 100 movie titles here
const MOVIE_TITLES = [
  "Avatar",
  "Inception",
  "The Dark Knight",
  "Interstellar",
  "Titanic",
  "Avengers: Endgame",
  "The Matrix",
  "Gladiator",
  "Joker",
  "The Godfather",
  // Add remaining 90 titles...
];

interface Movie {
  Title: string;
  Poster: string;
  Plot: string;
  imdbRating: string;
  Genre: string;
  Released: string;
}

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const [recommended, setRecommended] = useState<string[]>([]);
  const [loadingRec, setLoadingRec] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const responses = await Promise.all(
          MOVIE_TITLES.map((title) =>
            fetch(
              `https://www.omdbapi.com/?t=${encodeURIComponent(
                title
              )}&apikey=${API_KEY}`
            ).then((res) => res.json())
          )
        );

        const validMovies = responses.filter(
          (movie) => movie && movie.Response !== "False"
        );

        setMovies(validMovies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const fetchRecommendations = async (title: string) => {
    try {
      setLoadingRec(true);
      const res = await fetch(
	`/api/recommend?title=${encodeURIComponent(title)}`
      );
      console.log("Response returned from backend-service:", res);

      const data = await res.json();

      // extract only movie titles
      const titles = data.recommendations.map((m: any) => m.title);

      console.log("Have set the recommended titles");
      setRecommended(titles);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
    } finally {
      setLoadingRec(false);
    }
  };

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    fetchRecommendations(movie.Title);
  };

  if (loading) {
    return <h1 style={{ textAlign: "center" }}>Loading movies...</h1>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Current Movie List</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {movies.map((movie, index) => (
          <div
            key={index}
            onClick={() => handleMovieClick(movie)}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "15px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
            }}
          >
            <h2>{movie.Title}</h2>
            <img
              src={movie.Poster}
              alt={movie.Title}
              style={{ width: "100%", borderRadius: "8px" }}
            />
            <p><strong>IMDb:</strong> {movie.imdbRating}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedMovie && (
        <div
          onClick={() => setSelectedMovie(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "10px",
              width: "80%",
              maxWidth: "900px",
              height: "500px",
              display: "flex",
              overflow: "hidden",
            }}
          >
            {/* Left: Thumbnail */}
            <div style={{ flex: 1, padding: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <img
                src={selectedMovie.Poster}
                alt={selectedMovie.Title}
                style={{ width: "100%", height: "auto", borderRadius: "8px" }}
              />
            </div>

            {/* Right: Movie list */}
            <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
              <h2>{selectedMovie.Title}</h2>
              <p><strong>IMDb:</strong> {selectedMovie.imdbRating}</p>
              <p><strong>Genre:</strong> {selectedMovie.Genre}</p>
              <p><strong>Released:</strong> {selectedMovie.Released}</p>
              <p>{selectedMovie.Plot}</p>

              <hr style={{ margin: "20px 0" }} />

              <h3>Recommended Movies:</h3>
	      {loadingRec ? (
                <p>Loading recommendations...</p>
              ) : (
                <ul>
                  {recommended.map((title, idx) => (
                    <li key={idx}>{title}</li>
                  ))}
                </ul>
              )}
	      {/*
              <ul>
                {movies.map((movie) => (
                  <li key={movie.Title}>{movie.Title}</li>
                ))}
              </ul>
	      */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
