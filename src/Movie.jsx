import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Movie.css";

const API_KEY = "4ecaf5d83219f294ecee4156c2f8dc9d";
const IMG_URL = "https://image.tmdb.org/t/p/w300";

// Only block these 3 movies
const blockedTitles = [
  "drogam: nadanthathu enna?",
  "shanthi appuram nithya",
  "anaagarigam",
];

// Safe filter function
const isSafeMovie = (movie) => {
  const title = movie.title.toLowerCase().trim();

  return (
    movie.poster_path &&
    movie.adult === false &&
    movie.vote_average >= 5 &&
    !blockedTitles.some((word) => title.includes(word))
  );
};

export default function App() {
  const [movies, setMovies] = useState([]);
  const [startYear, setStartYear] = useState("2002");
  const [endYear, setEndYear] = useState("2026");
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [lang, setLang] = useState("ta");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [trailer, setTrailer] = useState("");

  useEffect(() => {
    fetchMovies();
  }, [startYear, endYear, genre, lang]);

  //  FETCH MOVIES
  const fetchMovies = async () => {
    try {
      let url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&include_adult=false&with_original_language=${lang}&primary_release_date.gte=${startYear}-01-01&primary_release_date.lte=${endYear}-12-31`;

      if (genre) url += `&with_genres=${genre}`;

      const res = await axios.get(url);

      const filtered = res.data.results.filter(isSafeMovie);

      const unique = Array.from(
        new Map(filtered.map((m) => [m.id, m])).values()
      );

      setMovies(unique);
    } catch (err) {
      console.log("Fetch Error:", err);
    }
  };

  //  SEARCH MOVIE
  const searchMovie = async () => {
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${search}&include_adult=false`
      );

      const filtered = res.data.results
        .filter(isSafeMovie)
        .filter((m) => !genre || m.genre_ids.includes(Number(genre)));

      const unique = Array.from(
        new Map(filtered.map((m) => [m.id, m])).values()
      );

      setMovies(unique);
    } catch (err) {
      console.log("Search Error:", err);
    }
  };

  //  GET DETAILS + TRAILER
  const getDetails = async (id) => {
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
      );

      setSelectedMovie(res.data);

      const vid = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`
      );

      const vids = vid.data.results;

      const t =
        vids.find((v) => v.type === "Trailer") ||
        vids.find((v) => v.type === "Teaser") ||
        vids[0];

      setTrailer(t ? t.key : "");
    } catch (err) {
      console.log("Trailer Error:", err);
      setTrailer("");
    }
  };

  return (
    <div className="container">
      <h1>MovieDB</h1>

      {/* Controls */}
      <div className="controls">
        <input
          className="input"
          placeholder="Search movie..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="btn search-btn" onClick={searchMovie}>
          Search
        </button>

        <select
          className="input"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
        >
          <option value="ta">Tamil</option>
          <option value="te">Telugu</option>
          <option value="hi">Hindi</option>
          <option value="en">English</option>
        </select>

        <input
          type="number"
          value={startYear}
          onChange={(e) => setStartYear(e.target.value)}
          className="input"
          placeholder="Start Year"
        />

        <input
          type="number"
          value={endYear}
          onChange={(e) => setEndYear(e.target.value)}
          className="input"
          placeholder="End Year"
        />
      </div>

      {/* Genre */}
      <div className="category">
        {[
          { name: "All", id: "" },
          { name: "Action", id: "28" },
          { name: "Comedy", id: "35" },
          { name: "Drama", id: "18" },
          { name: "Love", id: "10749" },
          { name: "Thriller", id: "53" },
          { name: "Horror", id: "27" },
        ].map((g) => (
          <div            key={g.id}
            className={`chip ${genre === g.id ? "active" : ""}`}
            onClick={() => setGenre(g.id)}
          >
            {g.name}
          </div>
        ))}
      </div>

      {/* Movies OR No Data */}
      {movies.length === 0 ? (
        <p className="no-data">
          😢 {search ? `"${search}" movie not found` : "No movies found"}
        </p>
      ) : (
        <div className="grid">
          {movies.map((m) => (
            <div key={m.id} className="card">
              <img src={IMG_URL + m.poster_path} alt="" />
              <h4>{m.title}</h4>
              <p>⭐ {m.vote_average}</p>
              <button className="btn" onClick={() => getDetails(m.id)}>
                🎥 Trailer
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Popup */}
      {selectedMovie && (
        <div className="overlay" onClick={() => setSelectedMovie(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedMovie.title}</h2>
            <p>{selectedMovie.overview}</p>

            {trailer ? (
              <iframe
                width="100%"
                height="250"
                src={`https://www.youtube.com/embed/${trailer}`}
                title="trailer"
                allowFullScreen
              />
            ) : (
              <p>No trailer available 😢</p>
            )}

            <button className="btn" onClick={() => setSelectedMovie(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}