import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import MoviePage from "./MoviePage.jsx";
import "./style.css";

export const defaultPosters = [
  [
    "l_the-dark-knight-movie-poster_96214dbd.jpg",
    "The Dark Knight",
    "Movie",
    "2008",
    "Crime · Drama",
  ],
  [
    "xl_the-odyssey-movie-poster_81db230a.jpg",
    "The Odyssey",
    "Movie",
    "2026",
    "Adventure · Epic",
  ],
  ["images.jpg", "Saiyaara", "Movie", "2025", "Romance · Drama"],
  ["images (1).jpg", "Interstellar", "Movie", "2014", "Sci-Fi · Drama"],
  ["images (2).jpg", "Inception", "Movie", "2010", "Sci-Fi · Thriller"],
  ["images (3).jpg", "The Godfather", "Movie", "1972", "Crime · Drama"],
  ["images (4).jpg", "La La Land", "Movie", "2016", "Romance · Musical"],
  ["images (5).jpg", "Whiplash", "Movie", "2014", "Drama · Music"],
  ["images (6).jpg", "Dune", "Movie", "2021", "Sci-Fi · Adventure"],
  ["images (7).jpg", "Parasite", "Movie", "2019", "Thriller · Drama"],
  ["images (8).jpg", "The Grand Budapest Hotel", "Movie", "2014", "Comedy · Drama"],
  [
    "images (9).jpg",
    "Everything Everywhere All at Once",
    "Movie",
    "2022",
    "Fantasy · Drama",
  ],
].map(([file, title, type, year, genre], i) => ({
  _id: `default-${i + 1}`,
  id: i + 1,
  file: `/Posters/${file}`,
  title,
  type,
  year,
  genre,
  rating: i % 3 ? 5 : 4,
  note: [
    "A story that always finds a new way to stay with me.",
    "For the nights when I want to disappear into another world.",
    "Beautiful, strange, and completely unforgettable.",
  ][i % 3],
  favorite: [1, 3, 5, 7].includes(i),
  watchlist: [0, 4, 8, 10].includes(i),
}));

export function Mark() {
  return (
    <Link className="mark" to="/">
      <span>R</span>REELBOX
    </Link>
  );
}

export function Arrow() {
  return <span className="arrow">↗</span>;
}

export function PosterWall({ dim = false, movies = defaultPosters }) {
  const wallItems = movies && movies.length >= 6 ? movies : defaultPosters;
  const cols = [
    wallItems.slice(0, 4),
    wallItems.slice(4, 8),
    wallItems.slice(8, 12),
  ];
  return (
    <div className={`poster-wall ${dim ? "dim" : ""}`}>
      {cols.map((col, i) => (
        <div className={`poster-column ${i === 1 ? "down" : "up"}`} key={i}>
          <div className="poster-track">
            {[...col, ...col, ...col].map((m, k) => (
              <img key={k} src={m.file} alt={m.title || ""} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Landing() {
  const [featuredMovies, setFeaturedMovies] = useState(defaultPosters);
  const [user, setUser] = useState(null);
  const [communityOpen, setCommunityOpen] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("reelbox_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {}
    }

    fetch("/api/movies")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          setFeaturedMovies(data);
        }
      })
      .catch(() => {});
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("reelbox_user");
    setUser(null);
    nav("/");
  };

  const scrollToHow = () => {
    const el = document.getElementById("how");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="landing">
      <section className="hero">
        <PosterWall movies={featuredMovies} />
        <nav>
          <Mark />
          <div className="nav-links">
            <Link to="/collection">The collection</Link>
            <button
              onClick={() => setCommunityOpen(true)}
              style={{ background: "none", border: 0, color: "inherit", cursor: "pointer", font: "inherit" }}
            >
              Cinephiles
            </button>
            {user ? (
              <>
                <Link to="/collection" className="tiny-button">
                  My Reelbox ({user.name})
                </Link>
                <button
                  onClick={handleSignOut}
                  style={{
                    background: "none",
                    border: "1px solid var(--line)",
                    borderRadius: 99,
                    color: "#aaa5b1",
                    padding: "6px 12px",
                    cursor: "pointer",
                    fontSize: 12,
                  }}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Sign in</Link>
                <Link className="tiny-button" to="/signup">
                  Get started
                </Link>
              </>
            )}
          </div>
        </nav>
        <div className="hero-copy">
          <p className="eyebrow">PERSONAL CINEMA, CURATED</p>
          <h1>
            Your movies.
            <br />
            <i>Your memories.</i>
          </h1>
          <p className="lede">
            Reelbox helps you save, organize, and revisit the movies, series, and anime you love — with
            your own ratings, personal notes, watchlist, and custom collections.
          </p>
          <div className="hero-actions">
            <Link className="button" to={user ? "/collection" : "/signup"}>
              {user ? "Open your Reelbox" : "Build your Reelbox"} <Arrow />
            </Link>
            <Link className="text-link" to="/collection">
              Explore the library <Arrow />
            </Link>
          </div>
        </div>
        <div
          className="hero-caption"
          onClick={scrollToHow}
          style={{ cursor: "pointer" }}
          title="Click to scroll down"
        >
          SCROLL TO ENTER <span>↓</span>
        </div>
      </section>

      <section id="how" className="intro section">
        <p className="eyebrow">MORE THAN A LIBRARY</p>
        <h2>
          A place for <i>every story.</i>
        </h2>
        <p>
          A Reelbox is part archive, part diary. Save a film, leave a thought,
          and return to it whenever the mood finds you.
        </p>
        <div className="features">
          <Feature
            n="01"
            title="Movies, Series & Anime"
            text="Log any story worth keeping across all formats."
          />
          <Feature
            n="02"
            title="Favorites & Watchlist"
            text="Hold on to timeless stories and queue upcoming watches."
          />
          <Feature
            n="03"
            title="Amazon-Style Reviews"
            text="Read in-depth reviews and community ratings from fellow cinephiles."
          />
          <Feature
            n="04"
            title="Memories & Ratings"
            text="Leave ratings and thoughts for your future self."
          />
        </div>
      </section>

      <section id="preview" className="showcase">
        <div className="showcase-top">
          <div>
            <p className="eyebrow">A GLIMPSE INSIDE</p>
            <h2>
              Your collection,
              <br />
              <i>on your terms.</i>
            </h2>
          </div>
          <Link to="/collection" className="text-link">
            Open the library <Arrow />
          </Link>
        </div>
        <div className="preview-window">
          <div className="preview-nav">
            <Mark />
            <span>MY COLLECTION</span>
            <span>WATCHLIST</span>
            <span>FAVORITES</span>
          </div>
          <h3>Recently added</h3>
          <div className="mini-shelf">
            {featuredMovies.slice(0, 6).map((m) => (
              <img
                key={m._id || m.id}
                src={m.file}
                alt={m.title}
                style={{ cursor: "pointer" }}
                onClick={() => nav(`/movie/${m.movieId || m._id || m.id}`)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="closing">
        <p className="eyebrow">YOUR FIRST SCREENING AWAITS</p>
        <h2>
          Keep the stories
          <br />
          that <i>stay with you.</i>
        </h2>
        <p>Create your personal cinema with Reelbox.</p>
        <Link className="button" to={user ? "/collection" : "/signup"}>
          {user ? "Return to your collection" : "Create your Reelbox"} <Arrow />
        </Link>
      </section>

      <footer>
        <Mark />
        <p>Your movies. Your memories.</p>
        <small>© 2026 Reelbox</small>
        <div>Privacy&nbsp;&nbsp; Terms&nbsp;&nbsp; Contact</div>
      </footer>

      {communityOpen && (
        <CommunityModal close={() => setCommunityOpen(false)} />
      )}
    </main>
  );
}

export function Feature({ n, title, text }) {
  return (
    <article>
      <span>{n}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

export function Auth({ signup = false }) {
  const nav = useNavigate(),
    [values, setValues] = useState({ name: "", pass: "" }),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("reelbox_user");
    if (saved) {
      nav("/collection", { replace: true });
    }
  }, [nav]);

  async function submit(e) {
    e.preventDefault();
    if (!values.name.trim() || !values.pass.trim()) {
      return setError("Please fill in both fields to continue.");
    }
    setError("");
    setLoading(true);

    try {
      const endpoint = signup ? "/api/auth/signup" : "/api/auth/login";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: values.name.trim(), password: values.pass }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      localStorage.setItem("reelbox_user", JSON.stringify(data.user));
      nav("/collection");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth">
      <PosterWall dim />
      <Link className="auth-mark" to="/">
        <Mark />
      </Link>
      <section className="auth-card">
        <p className="eyebrow">
          {signup ? "CREATE YOUR SPACE" : "WELCOME BACK"}
        </p>
        <h1>{signup ? "Begin your Reelbox." : "Your cinema is waiting."}</h1>
        <p className="auth-desc">
          {signup
            ? "A home for every movie, series, and anime you want to remember."
            : "Sign in to return to the stories you love."}
        </p>
        <form onSubmit={submit}>
          <label>
            Username
            <input
              required
              value={values.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
              placeholder="e.g. cinema_lover"
            />
          </label>
          <label>
            Password
            <input
              required
              type="password"
              value={values.pass}
              onChange={(e) => setValues({ ...values, pass: e.target.value })}
              placeholder="••••••••"
            />
          </label>
          {error && <p className="error" style={{ color: "#d65151", fontSize: 13, margin: 0 }}>{error}</p>}
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Processing..." : signup ? "Create Reelbox" : "Sign in"} <Arrow />
          </button>
        </form>
        {!signup && (
          <a className="forgot" href="#forgot">
            Forgot password?
          </a>
        )}
        <p className="switch">
          {signup ? "Already have a Reelbox? " : "New to Reelbox? "}
          <Link to={signup ? "/login" : "/signup"}>
            {signup ? "Sign in" : "Create one"}
          </Link>
        </p>
      </section>
      <Link className="back" to="/">
        ← Back to home
      </Link>
    </main>
  );
}

export function MovieCard({ movie, onClick }) {
  const nav = useNavigate();
  return (
    <button
      className="movie-card"
      onClick={() => {
        if (onClick) onClick(movie);
        else nav(`/movie/${movie.movieId || movie._id || movie.id}`);
      }}
    >
      <img loading="lazy" src={movie.file} alt={movie.title} />
      <span className="movie-overlay">
        <b>{movie.title}</b>
        <small>
          <span className={`type-badge ${(movie.type || "Movie").toLowerCase()}`}>
            {movie.type || "Movie"}
          </span>
          {"★".repeat(movie.rating || 5)} <em>{movie.year}</em>
        </small>
        <small>{movie.genre}</small>
      </span>
    </button>
  );
}

export function Collection() {
  const nav = useNavigate();
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [communityOpen, setCommunityOpen] = useState(false);

  const [collections, setCollections] = useState([
    "Late Night",
    "Mind Benders",
    "Comfort Movies",
    "Weekend Picks",
  ]);
  const [newCollection, setNewCollection] = useState("");
  const [collectionOpen, setCollectionOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("reelbox_user");
    if (saved) {
      try {
        const u = JSON.parse(saved);
        setUser(u);
        fetchUserMovies(u.name);
      } catch {
        fetchUserMovies();
      }
    } else {
      fetchUserMovies();
    }
    fetchCollections();
  }, []);

  const fetchUserMovies = async (username) => {
    try {
      setLoading(true);
      const url = username ? `/api/movies?username=${encodeURIComponent(username)}` : "/api/movies";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setMovies(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch movies:", err);
      setMovies(defaultPosters);
    } finally {
      setLoading(false);
    }
  };

  const fetchCollections = async () => {
    try {
      const res = await fetch("/api/collections");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length) {
          setCollections(data.map((c) => c.name));
        }
      }
    } catch (err) {
      console.error("Failed to fetch collections:", err);
    }
  };

  const filtered = useMemo(
    () =>
      movies.filter(
        (m) =>
          m.title.toLowerCase().includes(query.toLowerCase()) &&
          (tab === "All" ||
            (tab === "Favorites" && m.favorite) ||
            (tab === "Watchlist" && m.watchlist)) &&
          (typeFilter === "All" || m.type === typeFilter),
      ),
    [movies, query, tab, typeFilter],
  );

  const handleAddCollection = async () => {
    if (!newCollection.trim()) return;
    try {
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCollection.trim() }),
      });
      if (res.ok) {
        const saved = await res.json();
        setCollections((prev) => [...prev, saved.name]);
        setNewCollection("");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to create collection");
      }
    } catch (err) {
      console.error("Failed to create collection:", err);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("reelbox_user");
    setUser(null);
    nav("/");
  };

  const userInitials = user?.name
    ? user.name.slice(0, 2).toUpperCase()
    : "AM";

  return (
    <main className="library">
      <header className="library-head">
        <Mark />
        <div className="library-links">
          <button onClick={() => nav("/")}>Home</button>
          <button className={tab === "All" ? "active" : ""} onClick={() => setTab("All")}>
            My Collection
          </button>
          <button className={tab === "Watchlist" ? "active" : ""} onClick={() => setTab("Watchlist")}>
            Watchlist
          </button>
          <button className={tab === "Favorites" ? "active" : ""} onClick={() => setTab("Favorites")}>
            Favorites
          </button>
          <button onClick={() => setCollectionOpen(true)}>Collections</button>
          <button onClick={() => setCommunityOpen(true)}>Cinephiles</button>
        </div>
        <button
          className="profile"
          title={user ? `Signed in as ${user.name} (Click to sign out)` : "Demo Profile (Click to sign out)"}
          onClick={handleSignOut}
        >
          {userInitials} <span>⌄</span>
        </button>
      </header>

      <div className="library-content">
        <section className="collection-hero">
          <div>
            <p className="eyebrow">{user ? `${user.name.toUpperCase()}'S REELBOX` : "PERSONAL CINEMA"}</p>
            <h1>
              Your <i>collection.</i>
            </h1>
            <p>The stories you’ve watched, loved, and reviewed in your personal vault.</p>
          </div>
          <button onClick={() => setAddModalOpen(true)} className="button">
            ＋ Log a title
          </button>
        </section>

        {/* Interactive Stat Row - Clicking filters the view! */}
        <section className="stat-row">
          <div style={{ cursor: "pointer" }} onClick={() => setTab("All")} title="View All Watched">
            <b>{movies.length.toString().padStart(2, "0")}</b>
            <span>Watched</span>
          </div>
          <div style={{ cursor: "pointer" }} onClick={() => setTab("Favorites")} title="View Favorites">
            <b>
              {movies
                .filter((m) => m.favorite)
                .length.toString()
                .padStart(2, "0")}
            </b>
            <span>Favorites</span>
          </div>
          <div style={{ cursor: "pointer" }} onClick={() => setTab("Watchlist")} title="View Watchlist">
            <b>
              {movies
                .filter((m) => m.watchlist)
                .length.toString()
                .padStart(2, "0")}
            </b>
            <span>Watchlist</span>
          </div>
          <div style={{ cursor: "pointer" }} onClick={() => setCollectionOpen(true)} title="Manage Collections">
            <b>{collections.length.toString().padStart(2, "0")}</b>
            <span>Collections</span>
          </div>
        </section>

        <section className="library-tools">
          <div className="tabs">
            {["All", "Favorites", "Watchlist"].map((t) => (
              <button
                onClick={() => setTab(t)}
                className={tab === t ? "active" : ""}
                key={t}
              >
                {t}
              </button>
            ))}
            <span style={{ color: "#4c4556", margin: "0 6px" }}>|</span>
            {["All", "Movie", "Series", "Anime"].map((fmt) => (
              <button
                onClick={() => setTypeFilter(fmt)}
                className={typeFilter === fmt ? "active" : ""}
                key={fmt}
                style={{ fontSize: 11, opacity: typeFilter === fmt ? 1 : 0.65 }}
              >
                {fmt === "All" ? "All Formats" : fmt}
              </button>
            ))}
          </div>
          <label className="search">
            ⌕{" "}
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your library..."
            />
          </label>
        </section>

        {loading ? (
          <div className="empty">
            <p>Loading your Reelbox...</p>
          </div>
        ) : (
          <>
            <Shelf
              title={tab === "All" ? (typeFilter === "All" ? "Recently added" : `${typeFilter}s`) : tab}
              movies={filtered}
              onCardClick={(m) => nav(`/movie/${m.movieId || m._id || m.id}`)}
            />
            {tab === "All" && typeFilter === "All" && (
              <>
                <Shelf
                  title="Favorites"
                  movies={movies.filter((m) => m.favorite)}
                  onCardClick={(m) => nav(`/movie/${m.movieId || m._id || m.id}`)}
                />
                <Shelf
                  title="Watchlist"
                  movies={movies.filter((m) => m.watchlist)}
                  onCardClick={(m) => nav(`/movie/${m.movieId || m._id || m.id}`)}
                />
              </>
            )}
          </>
        )}
      </div>

      {addModalOpen && (
        <SearchAddModal
          close={() => setAddModalOpen(false)}
          user={user}
          onTitleAdded={(saved) => {
            setMovies((prev) => [saved, ...prev.filter((m) => (m._id || m.id) !== (saved._id || saved.id))]);
            setAddModalOpen(false);
          }}
        />
      )}

      {collectionOpen && (
        <CollectionModal
          collections={collections}
          close={() => setCollectionOpen(false)}
          name={newCollection}
          setName={setNewCollection}
          add={handleAddCollection}
        />
      )}

      {communityOpen && (
        <CommunityModal close={() => setCommunityOpen(false)} />
      )}
    </main>
  );
}

export function Shelf({ title, movies, onCardClick }) {
  const nav = useNavigate();
  return (
    <section className="shelf">
      <div className="shelf-title">
        <h2>{title}</h2>
        <span>
          {movies.length ? `${movies.length} stories` : "Nothing here yet"}
        </span>
      </div>
      {movies.length ? (
        <div className="shelf-grid">
          {movies.map((m) => (
            <MovieCard
              movie={m}
              key={m._id || m.id}
              onClick={() => (onCardClick ? onCardClick(m) : nav(`/movie/${m.movieId || m._id || m.id}`))}
            />
          ))}
        </div>
      ) : (
        <div className="empty">
          <b>Nothing queued yet.</b>
          <p>Find a story worth logging to your library.</p>
        </div>
      )}
    </section>
  );
}

/**
 * Search-First Logging Modal
 * Stage 1: User searches for title; matching catalog results show up.
 * Clicking a result adds or reviews it directly!
 * Stage 2: If title is not found, an option below allows adding a Brand New Cinema.
 */
export function SearchAddModal({ close, user, onTitleAdded }) {
  const nav = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showNewCinemaForm, setShowNewCinemaForm] = useState(false);

  // Quick review / add dialog for a selected existing catalog title
  const [selectedCatalogItem, setSelectedCatalogItem] = useState(null);
  const [quickRating, setQuickRating] = useState(5);
  const [quickNote, setQuickNote] = useState("");
  const [quickFavorite, setQuickFavorite] = useState(false);
  const [quickWatchlist, setQuickWatchlist] = useState(false);

  // New cinema state if adding a brand new title
  const [newCinema, setNewCinema] = useState({
    title: "",
    type: "Movie",
    year: new Date().getFullYear().toString(),
    genre: "",
    description: "",
    file: "",
    rating: 5,
    note: "",
  });

  // Initial catalog load so users see popular titles immediately
  useEffect(() => {
    fetchSearchResults("");
  }, []);

  const fetchSearchResults = async (q) => {
    setSearching(true);
    try {
      const res = await fetch(`/api/movies/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setSearching(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSearchResults(searchTerm);
  };

  // Convert uploaded image to Base64 to store in MongoDB
  function handlePosterUpload(e) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCinema({ ...newCinema, file: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }

  // Add existing catalog title to user's collection
  const handleQuickAddExisting = async (e) => {
    e.preventDefault();
    if (!selectedCatalogItem) return;

    try {
      const payload = {
        title: selectedCatalogItem.title,
        type: selectedCatalogItem.type || "Movie",
        year: selectedCatalogItem.year,
        genre: selectedCatalogItem.genre,
        description: selectedCatalogItem.description,
        file: selectedCatalogItem.file,
        rating: Number(quickRating),
        note: quickNote.trim(),
        username: user?.name || "demo",
        userId: user?.id,
        favorite: quickFavorite,
        watchlist: quickWatchlist,
      };

      const res = await fetch("/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const saved = await res.json();
        onTitleAdded(saved);
      } else {
        const err = await res.json();
        alert(err.message || "Failed to add title");
      }
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  // Create brand new cinema title in catalog and log for user
  const handleCreateNewCinema = async (e) => {
    e.preventDefault();
    if (!newCinema.title.trim()) return;

    try {
      const payload = {
        title: newCinema.title.trim(),
        type: newCinema.type || "Movie",
        year: newCinema.year || new Date().getFullYear().toString(),
        genre: newCinema.genre || "Unfiled",
        description: newCinema.description || "A captivating story curated in Reelbox.",
        file: newCinema.file || "/Posters/images.jpg",
        rating: Number(newCinema.rating) || 5,
        note: newCinema.note.trim(),
        username: user?.name || "demo",
        userId: user?.id,
        favorite: false,
        watchlist: false,
      };

      const res = await fetch("/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const saved = await res.json();
        onTitleAdded(saved);
      } else {
        const err = await res.json();
        alert(err.message || "Failed to create cinema");
      }
    } catch (err) {
      console.error("Creation error:", err);
    }
  };

  return (
    <div className="modal-back" onMouseDown={close}>
      <div className="collection-modal search-modal-wrap" onMouseDown={(e) => e.stopPropagation()}>
        <button type="button" className="close" onClick={close}>
          ×
        </button>

        {selectedCatalogItem ? (
          /* Step 1B: Quick Review / Log dialog for selected title */
          <div>
            <button
              onClick={() => setSelectedCatalogItem(null)}
              style={{
                background: "none",
                border: 0,
                color: "#6b5993",
                cursor: "pointer",
                padding: 0,
                marginBottom: 16,
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              ← Back to search results
            </button>

            <div style={{ display: "flex", gap: 18, marginBottom: 20 }}>
              <img
                src={selectedCatalogItem.file}
                alt=""
                style={{ width: 80, height: 120, objectFit: "cover", borderRadius: 8 }}
              />
              <div>
                <p className="eyebrow" style={{ margin: 0 }}>
                  <span className={`type-badge ${(selectedCatalogItem.type || "Movie").toLowerCase()}`}>
                    {selectedCatalogItem.type || "Movie"}
                  </span>
                  ADD TO YOUR VAULT
                </p>
                <h2 style={{ margin: "4px 0" }}>{selectedCatalogItem.title}</h2>
                <small style={{ color: "#666" }}>
                  {selectedCatalogItem.year} · {selectedCatalogItem.genre}
                </small>
              </div>
            </div>

            <form onSubmit={handleQuickAddExisting} style={{ display: "grid", gap: 14 }}>
              <div className="two">
                <label>
                  Your Rating
                  <select value={quickRating} onChange={(e) => setQuickRating(+e.target.value)}>
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {n} Stars ({"★".repeat(n)})
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Watch Status
                  <select
                    value={quickWatchlist ? "watchlist" : "watched"}
                    onChange={(e) => setQuickWatchlist(e.target.value === "watchlist")}
                  >
                    <option value="watched">Mark as Watched</option>
                    <option value="watchlist">Save to Watchlist</option>
                  </select>
                </label>
              </div>

              <label>
                Personal Review & Memories
                <textarea
                  rows="3"
                  value={quickNote}
                  onChange={(e) => setQuickNote(e.target.value)}
                  placeholder="Leave a thought for your future self..."
                />
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13 }}>
                <input
                  type="checkbox"
                  style={{ width: "auto" }}
                  checked={quickFavorite}
                  onChange={(e) => setQuickFavorite(e.target.checked)}
                />
                Mark as Favorite (♥)
              </label>

              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button className="button" type="submit">
                  Save to My Reelbox <Arrow />
                </button>
                <button
                  type="button"
                  className="line-button"
                  style={{ width: "auto" }}
                  onClick={() => nav(`/movie/${selectedCatalogItem._id}`)}
                >
                  View Movie Page
                </button>
              </div>
            </form>
          </div>
        ) : showNewCinemaForm ? (
          /* Step 2: Form to Add a BRAND NEW Cinema */
          <div>
            <button
              onClick={() => setShowNewCinemaForm(false)}
              style={{
                background: "none",
                border: 0,
                color: "#6b5993",
                cursor: "pointer",
                padding: 0,
                marginBottom: 16,
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              ← Back to Search
            </button>

            <p className="eyebrow">CREATE A NEW RECORD</p>
            <h2>Add a New Cinema</h2>
            <form onSubmit={handleCreateNewCinema}>
              <div className="add-content" style={{ marginTop: 16 }}>
                <label className="upload">
                  {newCinema.file ? (
                    <img src={newCinema.file} alt="Preview" />
                  ) : (
                    <>
                      <span>＋</span>
                      <b>Upload Poster</b>
                      <small>Saved directly to database</small>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handlePosterUpload} />
                </label>

                <div className="form-fields">
                  <label>
                    Title
                    <input
                      required
                      value={newCinema.title}
                      onChange={(e) => setNewCinema({ ...newCinema, title: e.target.value })}
                      placeholder="e.g. Neon Genesis Evangelion, Severance"
                    />
                  </label>

                  <div className="two">
                    <label>
                      Format / Type
                      <select
                        value={newCinema.type}
                        onChange={(e) => setNewCinema({ ...newCinema, type: e.target.value })}
                      >
                        <option value="Movie">Movie</option>
                        <option value="Series">Series</option>
                        <option value="Anime">Anime</option>
                      </select>
                    </label>

                    <label>
                      Year
                      <input
                        value={newCinema.year}
                        onChange={(e) => setNewCinema({ ...newCinema, year: e.target.value })}
                        placeholder="2026"
                      />
                    </label>
                  </div>

                  <div className="two">
                    <label>
                      Genre
                      <input
                        value={newCinema.genre}
                        onChange={(e) => setNewCinema({ ...newCinema, genre: e.target.value })}
                        placeholder="Sci-Fi, Psychological"
                      />
                    </label>

                    <label>
                      Your Rating
                      <select
                        value={newCinema.rating}
                        onChange={(e) => setNewCinema({ ...newCinema, rating: +e.target.value })}
                      >
                        {[5, 4, 3, 2, 1].map((n) => (
                          <option key={n} value={n}>
                            {"★".repeat(n)}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label>
                    Synopsis / Description
                    <input
                      value={newCinema.description}
                      onChange={(e) => setNewCinema({ ...newCinema, description: e.target.value })}
                      placeholder="Brief summary of the story..."
                    />
                  </label>

                  <label>
                    Personal Review & Note
                    <textarea
                      value={newCinema.note}
                      onChange={(e) => setNewCinema({ ...newCinema, note: e.target.value })}
                      placeholder="What made this memorable?"
                    />
                  </label>
                </div>
              </div>

              <button className="button" type="submit" style={{ marginTop: 20 }}>
                Save New Cinema to Reelbox <Arrow />
              </button>
            </form>
          </div>
        ) : (
          /* Step 1A: Search Cinema First */
          <div>
            <p className="eyebrow">SEARCH OR ADD CINEMA</p>
            <h2>Log a Title</h2>
            <p style={{ color: "#6a6472", fontSize: 13, margin: "6px 0 16px" }}>
              Search for any movie, series, or anime in our database to log it, or add a new one if it's not listed.
            </p>

            <form onSubmit={handleSearchSubmit} className="search-cinema-bar">
              <input
                className="search-cinema-input"
                autoFocus
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  fetchSearchResults(e.target.value);
                }}
                placeholder="Search title (e.g. Dark Knight, Inception, Dune)..."
              />
              <button className="button" type="submit" style={{ padding: "0 22px" }}>
                Search
              </button>
            </form>

            {searching ? (
              <p style={{ color: "#888", textAlign: "center" }}>Searching cinema catalog...</p>
            ) : results.length > 0 ? (
              <div className="search-cinema-results">
                {results.map((item) => (
                  <div key={item._id} className="cinema-result-card">
                    <div className="cinema-result-left">
                      <img className="cinema-result-poster" src={item.file} alt="" />
                      <div className="cinema-result-info">
                        <b>{item.title}</b>
                        <small>
                          <span className={`type-badge ${(item.type || "Movie").toLowerCase()}`}>
                            {item.type || "Movie"}
                          </span>
                          {item.year} &nbsp;·&nbsp; {item.genre}
                        </small>
                      </div>
                    </div>
                    <button
                      className="cinema-add-btn"
                      onClick={() => setSelectedCatalogItem(item)}
                    >
                      ＋ Add / Review
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty" style={{ margin: "20px 0" }}>
                <b>No matching titles found for "{searchTerm}".</b>
                <p>You can add it as a brand new cinema below!</p>
              </div>
            )}

            {/* Option to ADD A NEW CINEMA */}
            <div className="add-new-cinema-banner">
              <p>Can't find what you're looking for?</p>
              <button
                type="button"
                className="add-new-cinema-btn"
                onClick={() => {
                  setNewCinema((prev) => ({
                    ...prev,
                    title: searchTerm.trim() || prev.title,
                  }));
                  setShowNewCinemaForm(true);
                }}
              >
                ＋ Add a New Cinema / Title
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function CollectionModal({ collections, close, name, setName, add }) {
  return (
    <div className="modal-back" onMouseDown={close}>
      <div className="collection-modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="close" onClick={close}>
          ×
        </button>
        <p className="eyebrow">YOUR SHELVES</p>
        <h2>Collections</h2>
        <div className="collection-list">
          {collections.map((c) => (
            <span key={c}>
              {c}
              <i>↗</i>
            </span>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            add();
          }}
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="A new collection"
          />
          <button className="button" type="submit">Create</button>
        </form>
      </div>
    </div>
  );
}

export function CommunityModal({ close }) {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    fetchUsers("");
  }, []);

  const fetchUsers = async (q) => {
    try {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);
    fetchUsers(val);
  };

  const openProfile = async (username) => {
    try {
      setLoadingProfile(true);
      setSelectedUser(username);
      const res = await fetch(`/api/users/${encodeURIComponent(username)}`);
      if (res.ok) {
        const data = await res.json();
        setProfileData(data);
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoadingProfile(false);
    }
  };

  return (
    <div className="modal-back" onMouseDown={close}>
      <div className="collection-modal user-modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="close" onClick={close}>
          ×
        </button>

        {selectedUser ? (
          <div>
            <button
              onClick={() => {
                setSelectedUser(null);
                setProfileData(null);
              }}
              style={{
                background: "none",
                border: 0,
                color: "#6b5993",
                cursor: "pointer",
                padding: 0,
                marginBottom: 16,
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              ← Back to Cinephiles
            </button>

            {loadingProfile || !profileData ? (
              <p>Loading {selectedUser}'s Reelbox...</p>
            ) : (
              <div>
                <div className="profile-head-card">
                  <div className="profile-head-avatar">
                    {profileData.user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 style={{ margin: "0 0 6px" }}>{profileData.user.name}</h2>
                    <p style={{ margin: 0, color: "#6a6472", fontSize: 13 }}>
                      {profileData.user.bio || "Cinema enthusiast."}
                    </p>
                    <div className="profile-stat-pills">
                      <span className="profile-stat-pill">
                        <b>{profileData.stats.total}</b> Stories Logged
                      </span>
                      <span className="profile-stat-pill">
                        <b>{profileData.stats.favorites}</b> Favorites
                      </span>
                      <span className="profile-stat-pill">
                        <b>{profileData.stats.watchlist}</b> Watchlist
                      </span>
                    </div>
                  </div>
                </div>

                <h3>{selectedUser}'s Watched Titles & Reviews</h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                    gap: 12,
                    maxHeight: "350px",
                    overflowY: "auto",
                  }}
                >
                  {profileData.movies.map((m) => (
                    <div
                      key={m._id}
                      style={{
                        background: "#fff",
                        borderRadius: 8,
                        overflow: "hidden",
                        border: "1px solid #ddd",
                        fontSize: 11,
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        close();
                        nav(`/movie/${m.movieId || m._id}`);
                      }}
                    >
                      <img
                        src={m.file}
                        alt={m.title}
                        style={{ width: "100%", height: 160, objectFit: "cover" }}
                      />
                      <div style={{ padding: 8 }}>
                        <b style={{ display: "block", color: "#111" }}>{m.title}</b>
                        <small style={{ color: "#777" }}>
                          {"★".repeat(m.rating || 5)} · {m.year}
                        </small>
                        {m.note && (
                          <p style={{ fontStyle: "italic", margin: "4px 0 0", color: "#444" }}>
                            "{m.note}"
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <p className="eyebrow">COMMUNITY OF CINEMA LOVERS</p>
            <h2>Explore Cinephiles</h2>
            <p style={{ color: "#6a6472", fontSize: 13, margin: "6px 0 16px" }}>
              Search for users to see what they’re watching, their reviews, and their collections.
            </p>

            <input
              className="user-search-input"
              value={query}
              onChange={handleSearch}
              placeholder="Search by username..."
            />

            <div className="user-grid">
              {users.map((u) => (
                <div
                  key={u._id}
                  className="user-card"
                  onClick={() => openProfile(u.name)}
                >
                  <div className="user-avatar">{u.name.slice(0, 2).toUpperCase()}</div>
                  <h3>{u.name}</h3>
                  <p>{u.bio || "Story collector."}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/signup" element={<Auth signup />} />
      <Route path="/collection" element={<Collection />} />
      <Route path="/movie/:id" element={<MoviePage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
