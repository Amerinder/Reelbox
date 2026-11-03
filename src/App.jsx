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
    "Crime · Action · Drama",
  ],
  [
    "xl_the-odyssey-movie-poster_81db230a.jpg",
    "The Odyssey",
    "Movie",
    "2026",
    "Adventure · Epic",
  ],
  ["saiyaara.jpg", "Saiyaara", "Movie", "2025", "Romance · Drama"],
  ["openhimer.jpg", "Oppenheimer", "Movie", "2023", "Biography · Drama"],
  ["batman.jpg", "The Batman", "Movie", "2022", "Action · Crime · Drama"],
  ["dune.jpg", "Dune", "Movie", "2021", "Sci-Fi · Adventure"],
  [
    "avengersinfinity war.jpg",
    "Avengers: Infinity War",
    "Movie",
    "2018",
    "Action · Sci-Fi · Adventure",
  ],
  ["avtar.jpg", "Avatar", "Movie", "2009", "Sci-Fi · Adventure · Action"],
  ["animal.jpg", "Animal", "Movie", "2023", "Action · Crime · Drama"],
  ["joker.jpg", "Joker", "Movie", "2019", "Crime · Drama · Thriller"],
  [
    "spidermandrandnewday.jpg",
    "Spider-Man: Brand New Day",
    "Movie",
    "2026",
    "Action · Adventure · Sci-Fi",
  ],
  ["starwars.jpg", "Star Wars", "Movie", "1977", "Action · Adventure · Fantasy"],
  ["mahavatar.jpg", "Mahavatar", "Movie", "2026", "Mythology · Epic · Action"],
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
  const [suggestedMovies, setSuggestedMovies] = useState([]);
  const [user, setUser] = useState(null);
  const [communityOpen, setCommunityOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("reelbox_user");
    let currentUser = null;
    if (saved) {
      try {
        currentUser = JSON.parse(saved);
        setUser(currentUser);
      } catch {}
    }

    fetch("/api/movies/search")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          setFeaturedMovies(data);
        }
      })
      .catch(() => {});

    // Fetch movies the user has NOT watched yet from the database
    const queryUser = currentUser?.name ? `?username=${encodeURIComponent(currentUser.name)}` : "";
    fetch(`/api/movies/unwatched${queryUser}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSuggestedMovies(data);
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
          <div className="nav-common-bar">
            <Link to="/collection" className="nav-common-btn">
              The collection
            </Link>
            <button
              type="button"
              className="nav-common-btn"
              onClick={() => setCommunityOpen(true)}
            >
              Cinephiles
            </button>
            <button
              type="button"
              className="nav-common-btn"
              onClick={() => setAddModalOpen(true)}
            >
              ⌕ Search & Add
            </button>
            {user ? (
              <>
                <Link to="/collection" className="nav-common-btn">
                  My Reelbox ({user.name})
                </Link>
                <button
                  type="button"
                  className="nav-common-btn"
                  onClick={handleSignOut}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-common-btn">
                  Sign in
                </Link>
                <Link to="/signup" className="nav-common-btn">
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

      {/* Suggested Unwatched Movies from Database */}
      <section id="preview" className="showcase">
        <div className="showcase-top">
          <div>
            <p className="eyebrow">DISCOVER STORIES</p>
            <h2>
              Suggested for you,
              <br />
              <i>waiting to be watched.</i>
            </h2>
          </div>
          <Link to="/collection" className="text-link">
            Open your library <Arrow />
          </Link>
        </div>
        <div className="preview-window">
          <div className="preview-nav">
            <Mark />
            <span>UNWATCHED IN DATABASE</span>
            <span>CATALOG SUGGESTIONS</span>
          </div>
          <h3>{user ? `Recommendations for ${user.name}` : "Curated Unwatched Cinema"}</h3>
          {suggestedMovies.length > 0 ? (
            <div className="suggested-shelf-grid">
              {suggestedMovies.slice(0, 6).map((m) => (
                <div
                  key={m._id || m.id}
                  className="suggested-card"
                  onClick={() => nav(`/movie/${m._id || m.id}`)}
                >
                  <img src={m.file} alt={m.title} />
                  <div className="suggested-card-body">
                    <b>{m.title}</b>
                    <div className="suggested-card-meta">
                      <span className={`type-badge ${(m.type || "Movie").toLowerCase()}`}>
                        {m.type || "Movie"}
                      </span>
                      <span>{m.year}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty">
              <b>You've watched all catalog titles!</b>
              <p>Add a new cinema using the Search & Add button in the navigation bar.</p>
            </div>
          )}
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
      {addModalOpen && (
        <SearchAddModal
          close={() => setAddModalOpen(false)}
          user={user}
          onTitleAdded={() => {
            setAddModalOpen(false);
            nav("/collection");
          }}
        />
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

export function MovieCard({ movie, onClick, onEdit, onDelete }) {
  const nav = useNavigate();
  return (
    <div className="movie-card-wrap">
      {(onEdit || onDelete) && (
        <div className="card-action-bar" onClick={(e) => e.stopPropagation()}>
          {onEdit && (
            <button
              type="button"
              className="card-action-btn edit"
              title="Edit title / review / shelf"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(movie);
              }}
            >
              ✎ Edit
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className="card-action-btn delete"
              title="Delete from Reelbox"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(movie);
              }}
            >
              🗑
            </button>
          )}
        </div>
      )}
      <button
        type="button"
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
            {movie.watchlist ? (
              <span className="watchlist-badge">⏱ Watchlist</span>
            ) : (
              <span>{"★".repeat(movie.rating || 5)}</span>
            )}{" "}
            <em>{movie.year}</em>
          </small>
          <small>{movie.genre}</small>
          {movie.collectionName && (
            <span className="card-shelf-tag">📁 {movie.collectionName}</span>
          )}
        </span>
      </button>
    </div>
  );
}

export function EditCinemaModal({ movie, close, collections = [], onSave, onDelete }) {
  const [rating, setRating] = useState(movie.rating || 5);
  const [hoverRating, setHoverRating] = useState(0);
  const [note, setNote] = useState(movie.note || "");
  const [favorite, setFavorite] = useState(Boolean(movie.favorite));
  const [watchlist, setWatchlist] = useState(Boolean(movie.watchlist));
  const [collectionName, setCollectionName] = useState(movie.collectionName || "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        rating: watchlist ? 0 : Number(rating),
        note: watchlist ? "" : note.trim(),
        favorite: watchlist ? false : favorite,
        watchlist: Boolean(watchlist),
        collectionName: collectionName || "",
      };

      const res = await fetch(`/api/movies/${encodeURIComponent(movie._id || movie.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const updated = await res.json();
        onSave(updated);
      } else {
        const data = await res.json();
        alert(data.message || "Failed to update entry");
      }
    } catch (err) {
      console.error("Save edit error:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-back" onMouseDown={close}>
      <div className="collection-modal search-modal-wrap" onMouseDown={(e) => e.stopPropagation()}>
        <button type="button" className="close" onClick={close}>
          ×
        </button>

        <div className="curate-vault-container">
          <div className="curate-hero-card">
            <div className="curate-poster-box">
              <img
                src={movie.file || "/Posters/saiyaara.jpg"}
                alt={movie.title}
                className="curate-poster-img"
              />
            </div>
            <div className="curate-hero-details">
              <div className="curate-tags-row">
                <span className={`type-badge ${(movie.type || "Movie").toLowerCase()}`}>
                  {movie.type || "Movie"}
                </span>
                <span className="curate-dot">•</span>
                <span className="curate-eyebrow">EDIT REELBOX ENTRY</span>
              </div>
              <h2 className="curate-title">{movie.title}</h2>
              <div className="curate-meta-line">
                <span className="curate-year">{movie.year}</span>
                <span className="curate-dot">•</span>
                <span className="curate-genre">{movie.genre || "Cinema"}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="curate-form">
            {/* Watch Status & Shelf */}
            <div className="curate-grid-two">
              <div className="curate-field-group">
                <label>Watch Status</label>
                <div className="curate-toggle-group">
                  <button
                    type="button"
                    className={`curate-toggle-btn ${!watchlist ? "active" : ""}`}
                    onClick={() => setWatchlist(false)}
                  >
                    <span>✓</span> Watched
                  </button>
                  <button
                    type="button"
                    className={`curate-toggle-btn ${watchlist ? "active" : ""}`}
                    onClick={() => setWatchlist(true)}
                  >
                    <span>⏱</span> Save to Watchlist
                  </button>
                </div>
              </div>

              <div className="curate-field-group">
                <label>Collection Shelf</label>
                <div className="curate-select-wrap">
                  <select
                    className="curate-select"
                    value={collectionName}
                    onChange={(e) => setCollectionName(e.target.value)}
                  >
                    <option value="">No Shelf (Unfiled)</option>
                    {collections.map((c) => (
                      <option key={c} value={c}>
                        📁 {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {watchlist ? (
              <div className="watchlist-mode-notice" style={{ margin: "8px 0 16px" }}>
                <span className="notice-icon">⏱</span>
                <div>
                  <b>Watchlist Mode (Unwatched)</b>
                  <p>This title is stored in your Watchlist. Ratings and personal reviews are reserved for stories you have watched.</p>
                </div>
              </div>
            ) : (
              <>
                {/* Interactive Star Rating */}
                <div className="curate-field-group">
                  <div className="curate-field-header">
                    <label>Your Rating</label>
                    <span className="curate-rating-badge">
                      {(hoverRating || rating) === 5 && "★★★★★ · 5.0 Masterpiece"}
                      {(hoverRating || rating) === 4 && "★★★★☆ · 4.0 Great Story"}
                      {(hoverRating || rating) === 3 && "★★★☆☆ · 3.0 Good Watch"}
                      {(hoverRating || rating) === 2 && "★★☆☆☆ · 2.0 Mediocre"}
                      {(hoverRating || rating) === 1 && "★☆☆☆☆ · 1.0 Not for me"}
                    </span>
                  </div>
                  <div className="curate-stars-row">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        className={`star-btn ${(hoverRating || rating) >= star ? "active" : ""}`}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        title={`${star} Stars`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="star-score-num">{rating} / 5</span>
                  </div>
                </div>

                {/* Personal Review */}
                <div className="curate-field-group">
                  <div className="curate-field-header">
                    <label>Personal Review & Memories</label>
                    <span className="curate-hint">Saved to cinema page</span>
                  </div>
                  <textarea
                    className="curate-textarea"
                    rows="3"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Leave a thought for your future self..."
                  />
                </div>

                {/* Favorite Toggle */}
                <div className="curate-fav-row">
                  <button
                    type="button"
                    className={`curate-fav-btn ${favorite ? "active" : ""}`}
                    onClick={() => setFavorite(!favorite)}
                  >
                    <span className="fav-heart">{favorite ? "♥" : "♡"}</span>
                    <span className="fav-text">
                      {favorite ? "Favorited in your Vault" : "Mark as Favorite (♥)"}
                    </span>
                  </button>
                </div>
              </>
            )}

            {/* Actions */}
            <div className="curate-actions-footer">
              <button className="button curate-save-btn" type="submit" disabled={saving}>
                <span>{saving ? "Saving..." : "Save Changes"}</span>
                <Arrow />
              </button>
              <button
                type="button"
                className="line-button"
                style={{ borderColor: "#ef444455", color: "#f87171" }}
                onClick={() => {
                  close();
                  if (onDelete) onDelete(movie);
                }}
              >
                🗑 Remove
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
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
  const [editingMovie, setEditingMovie] = useState(null);

  const [collections, setCollections] = useState([
    "Late Night",
    "Mind Benders",
    "Comfort Movies",
    "Weekend Picks",
  ]);
  const [newCollection, setNewCollection] = useState("");
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);

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
          (tab === "Collection"
            ? (m.collectionName || "").toLowerCase() === (selectedCollection || "").toLowerCase()
            : tab === "All"
            ? !m.watchlist
            : (tab === "Favorites" && m.favorite) ||
              (tab === "Watchlist" && m.watchlist)) &&
          (typeFilter === "All" || m.type === typeFilter),
      ),
    [movies, query, tab, selectedCollection, typeFilter],
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

  const handleDeleteCollection = async (colName) => {
    const confirmed = window.confirm(
      `Delete the shelf "${colName}"? Titles on this shelf will not be deleted, but will become unfiled.`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/collections/${encodeURIComponent(colName)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCollections((prev) => prev.filter((c) => c !== colName));
        setMovies((prev) =>
          prev.map((m) =>
            m.collectionName === colName ? { ...m, collectionName: "" } : m
          )
        );
        if (selectedCollection === colName) {
          setSelectedCollection(null);
          setTab("All");
        }
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete collection");
      }
    } catch (err) {
      console.error("Error deleting collection:", err);
    }
  };

  const handleDeleteMovie = async (movie) => {
    const confirmed = window.confirm(`Remove "${movie.title}" from your Reelbox?`);
    if (!confirmed) return;

    try {
      const id = movie._id || movie.id;
      const res = await fetch(`/api/movies/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMovies((prev) =>
          prev.filter((m) => (m._id || m.id) !== id && m.movieId !== id)
        );
      } else {
        const err = await res.json();
        alert(err.message || "Failed to remove title");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleSaveEdit = (updated) => {
    setMovies((prev) =>
      prev.map((m) =>
        (m._id || m.id) === (updated._id || updated.id) ||
        (m.movieId && m.movieId === updated.movieId)
          ? { ...m, ...updated }
          : m
      )
    );
    setEditingMovie(null);
  };

  const handleSignOut = () => {
    localStorage.removeItem("reelbox_user");
    setUser(null);
    nav("/");
  };

  const userInitials = user?.name
    ? user.name.slice(0, 2).toUpperCase()
    : "AM";

  const watchedCount = movies.filter((m) => !m.watchlist).length;
  const favoritesCount = movies.filter((m) => m.favorite).length;
  const watchlistCount = movies.filter((m) => m.watchlist).length;

  return (
    <main className="library">
      <header className="library-head">
        <Mark />
        <div className="library-links">
          <button onClick={() => nav("/")}>Home</button>
          <button
            className={tab === "All" ? "active" : ""}
            onClick={() => {
              setTab("All");
              setSelectedCollection(null);
            }}
          >
            My Collection
          </button>
          <button
            className={tab === "Watchlist" ? "active" : ""}
            onClick={() => {
              setTab("Watchlist");
              setSelectedCollection(null);
            }}
          >
            Watchlist
          </button>
          <button
            className={tab === "Favorites" ? "active" : ""}
            onClick={() => {
              setTab("Favorites");
              setSelectedCollection(null);
            }}
          >
            Favorites
          </button>
          <button
            className={tab === "Collection" ? "active" : ""}
            onClick={() => setCollectionOpen(true)}
          >
            Collections {selectedCollection ? `(${selectedCollection})` : ""}
          </button>
          <button onClick={() => setCommunityOpen(true)}>Cinephiles</button>
          <button className="nav-search-btn" onClick={() => setAddModalOpen(true)}>
            <span>⌕</span> Search & Add
          </button>
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
        </section>

        {/* Interactive Stat Row - Clicking filters the view! */}
        <section className="stat-row">
          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              setTab("All");
              setSelectedCollection(null);
            }}
            title="View All Watched"
          >
            <b>{watchedCount.toString().padStart(2, "0")}</b>
            <span>Watched</span>
          </div>
          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              setTab("Favorites");
              setSelectedCollection(null);
            }}
            title="View Favorites"
          >
            <b>{favoritesCount.toString().padStart(2, "0")}</b>
            <span>Favorites</span>
          </div>
          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              setTab("Watchlist");
              setSelectedCollection(null);
            }}
            title="View Watchlist"
          >
            <b>{watchlistCount.toString().padStart(2, "0")}</b>
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
                onClick={() => {
                  setTab(t);
                  setSelectedCollection(null);
                }}
                className={tab === t ? "active" : ""}
                key={t}
              >
                {t}
              </button>
            ))}
            {tab === "Collection" && selectedCollection && (
              <div style={{ display: "inline-flex", alignItems: "center" }}>
                <button
                  className="active"
                  style={{
                    background: "#9472dc24",
                    borderRadius: "99px 0 0 99px",
                    padding: "4px 10px",
                    color: "#d4c5ff",
                    border: "1px solid #9472dc",
                    borderRight: "none",
                  }}
                  onClick={() => setCollectionOpen(true)}
                  title="Switch Collection Shelf"
                >
                  Shelf: {selectedCollection}
                </button>
                <button
                  style={{
                    background: "#9472dc24",
                    borderRadius: "0 99px 99px 0",
                    padding: "4px 8px",
                    color: "#d4c5ff",
                    border: "1px solid #9472dc",
                    borderLeft: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setSelectedCollection(null);
                    setTab("All");
                  }}
                  title="Clear shelf filter and show All"
                >
                  ✕
                </button>
              </div>
            )}
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
              title={
                tab === "Collection"
                  ? `Shelf: ${selectedCollection}`
                  : tab === "All"
                  ? typeFilter === "All"
                    ? "Recently watched"
                    : `Watched ${typeFilter}s`
                  : tab
              }
              movies={filtered}
              onCardClick={(m) => nav(`/movie/${m.movieId || m._id || m.id}`)}
              onEdit={(m) => setEditingMovie(m)}
              onDelete={handleDeleteMovie}
            />
            {tab === "All" && typeFilter === "All" && (
              <>
                <Shelf
                  title="Favorites"
                  movies={movies.filter((m) => m.favorite)}
                  onCardClick={(m) => nav(`/movie/${m.movieId || m._id || m.id}`)}
                  onEdit={(m) => setEditingMovie(m)}
                  onDelete={handleDeleteMovie}
                />
                <Shelf
                  title="Watchlist"
                  movies={movies.filter((m) => m.watchlist)}
                  onCardClick={(m) => nav(`/movie/${m.movieId || m._id || m.id}`)}
                  onEdit={(m) => setEditingMovie(m)}
                  onDelete={handleDeleteMovie}
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
          collections={collections}
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
          selectedCollection={selectedCollection}
          onSelectCollection={(colName) => {
            setSelectedCollection(colName);
            setTab("Collection");
            setCollectionOpen(false);
          }}
          onDeleteCollection={handleDeleteCollection}
        />
      )}

      {editingMovie && (
        <EditCinemaModal
          movie={editingMovie}
          close={() => setEditingMovie(null)}
          collections={collections}
          onSave={handleSaveEdit}
          onDelete={handleDeleteMovie}
        />
      )}

      {communityOpen && (
        <CommunityModal close={() => setCommunityOpen(false)} />
      )}
    </main>
  );
}

export function Shelf({ title, movies, onCardClick, onEdit, onDelete }) {
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
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="empty">
          <b>{title.startsWith("Shelf:") ? `No titles on ${title} yet` : "Nothing queued yet."}</b>
          <p>
            {title.startsWith("Shelf:")
              ? "Assign movies to this shelf when adding or reviewing a cinema title."
              : "Find a story worth logging to your library."}
          </p>
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
export function SearchAddModal({ close, user, collections = [], onTitleAdded }) {
  const nav = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showNewCinemaForm, setShowNewCinemaForm] = useState(false);
  const debounceRef = useRef(null);

  // Available collections for dropdown assignment
  const [availableCollections, setAvailableCollections] = useState(
    collections && collections.length
      ? collections
      : ["Late Night", "Mind Benders", "Comfort Movies", "Weekend Picks"],
  );

  useEffect(() => {
    if (!collections || !collections.length) {
      fetch("/api/collections")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length) {
            setAvailableCollections(data.map((c) => c.name));
          }
        })
        .catch(() => {});
    } else {
      setAvailableCollections(collections);
    }
  }, [collections]);

  // Quick review / add dialog for a selected existing catalog title
  const [selectedCatalogItem, setSelectedCatalogItem] = useState(null);
  const [quickRating, setQuickRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [quickNote, setQuickNote] = useState("");
  const [quickFavorite, setQuickFavorite] = useState(false);
  const [quickWatchlist, setQuickWatchlist] = useState(false);
  const [quickCollection, setQuickCollection] = useState("");

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
    collectionName: "",
  });

  // Initial catalog load so users see popular titles immediately
  useEffect(() => {
    fetchSearchResults("");
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const fetchSearchResults = async (q) => {
    setSearching(true);
    try {
      const res = await fetch(`/api/movies/search?q=${encodeURIComponent(q.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setSearching(false);
    }
  };

  const handleInputChange = (val) => {
    setSearchTerm(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSearchResults(val);
    }, 150);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
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
        collectionName: quickCollection || "",
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
        file: newCinema.file || "/Posters/saiyaara.jpg",
        rating: Number(newCinema.rating) || 5,
        note: newCinema.note.trim(),
        username: user?.name || "demo",
        userId: user?.id,
        favorite: false,
        watchlist: false,
        collectionName: newCinema.collectionName || "",
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
          <div className="curate-vault-container">
            <button
              type="button"
              className="curate-back-btn"
              onClick={() => setSelectedCatalogItem(null)}
            >
              <span>←</span> Back to search results
            </button>

            <div className="curate-hero-card">
              <div className="curate-poster-box">
                <img
                  src={selectedCatalogItem.file || "/Posters/saiyaara.jpg"}
                  alt={selectedCatalogItem.title}
                  className="curate-poster-img"
                />
              </div>
              <div className="curate-hero-details">
                <div className="curate-tags-row">
                  <span className={`type-badge ${(selectedCatalogItem.type || "Movie").toLowerCase()}`}>
                    {selectedCatalogItem.type || "Movie"}
                  </span>
                  <span className="curate-dot">•</span>
                  <span className="curate-eyebrow">ADD TO YOUR VAULT</span>
                </div>
                <h2 className="curate-title">{selectedCatalogItem.title}</h2>
                <div className="curate-meta-line">
                  <span className="curate-year">{selectedCatalogItem.year}</span>
                  <span className="curate-dot">•</span>
                  <span className="curate-genre">{selectedCatalogItem.genre || "Cinema"}</span>
                </div>
                {selectedCatalogItem.description && (
                  <p className="curate-desc">
                    {selectedCatalogItem.description.slice(0, 160)}
                    {selectedCatalogItem.description.length > 160 ? "..." : ""}
                  </p>
                )}
              </div>
            </div>

            <form onSubmit={handleQuickAddExisting} className="curate-form">
              {/* Watch Status & Shelf */}
              <div className="curate-grid-two">
                <div className="curate-field-group">
                  <label>Watch Status</label>
                  <div className="curate-toggle-group">
                    <button
                      type="button"
                      className={`curate-toggle-btn ${!quickWatchlist ? "active" : ""}`}
                      onClick={() => setQuickWatchlist(false)}
                    >
                      <span>✓</span> Watched
                    </button>
                    <button
                      type="button"
                      className={`curate-toggle-btn ${quickWatchlist ? "active" : ""}`}
                      onClick={() => setQuickWatchlist(true)}
                    >
                      <span>⏱</span> Save to Watchlist
                    </button>
                  </div>
                </div>

                <div className="curate-field-group">
                  <label>Assign to Shelf</label>
                  <div className="curate-select-wrap">
                    <select
                      className="curate-select"
                      value={quickCollection}
                      onChange={(e) => setQuickCollection(e.target.value)}
                    >
                      <option value="">No Shelf (Unfiled)</option>
                      {availableCollections.map((c) => (
                        <option key={c} value={c}>
                          📁 {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {quickWatchlist ? (
                /* Watchlist Mode - Interface is completely separate! No ratings or reviews! */
                <div className="watchlist-mode-notice" style={{ margin: "10px 0 16px" }}>
                  <span className="notice-icon">⏱</span>
                  <div>
                    <b>Save to Watchlist (Unwatched)</b>
                    <p>
                      This title will be saved to your Watchlist. Ratings and personal reviews are locked until you have watched this story.
                    </p>
                  </div>
                </div>
              ) : (
                /* Watched Mode - Full Rating, Review, and Favorite */
                <>
                  {/* Interactive Star Rating */}
                  <div className="curate-field-group">
                    <div className="curate-field-header">
                      <label>Your Rating</label>
                      <span className="curate-rating-badge">
                        {(hoverRating || quickRating) === 5 && "★★★★★ · 5.0 Masterpiece"}
                        {(hoverRating || quickRating) === 4 && "★★★★☆ · 4.0 Great Story"}
                        {(hoverRating || quickRating) === 3 && "★★★☆☆ · 3.0 Good Watch"}
                        {(hoverRating || quickRating) === 2 && "★★☆☆☆ · 2.0 Mediocre"}
                        {(hoverRating || quickRating) === 1 && "★☆☆☆☆ · 1.0 Not for me"}
                      </span>
                    </div>
                    <div className="curate-stars-row">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          className={`star-btn ${(hoverRating || quickRating) >= star ? "active" : ""}`}
                          onClick={() => setQuickRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          title={`${star} Stars`}
                        >
                          ★
                        </button>
                      ))}
                      <span className="star-score-num">{quickRating} / 5</span>
                    </div>
                  </div>

                  {/* Personal Review & Memories */}
                  <div className="curate-field-group">
                    <div className="curate-field-header">
                      <label>Personal Review & Memories</label>
                      <span className="curate-hint">Saved to cinema page</span>
                    </div>
                    <textarea
                      className="curate-textarea"
                      rows="3"
                      value={quickNote}
                      onChange={(e) => setQuickNote(e.target.value)}
                      placeholder="Leave a thought for your future self... (What made this memorable, favorite scene, or quotes?)"
                    />
                  </div>

                  {/* Favorite Toggle Button */}
                  <div className="curate-fav-row">
                    <button
                      type="button"
                      className={`curate-fav-btn ${quickFavorite ? "active" : ""}`}
                      onClick={() => setQuickFavorite(!quickFavorite)}
                    >
                      <span className="fav-heart">{quickFavorite ? "♥" : "♡"}</span>
                      <span className="fav-text">
                        {quickFavorite ? "Favorited in your Vault" : "Mark as Favorite (♥)"}
                      </span>
                    </button>
                  </div>
                </>
              )}

              {/* Actions Footer */}
              <div className="curate-actions-footer">
                <button className="button curate-save-btn" type="submit">
                  <span>{quickWatchlist ? "Save to Watchlist ⏱" : "Save to My Watched Vault ✓"}</span>
                  <Arrow />
                </button>
                <button
                  type="button"
                  className="line-button curate-page-btn"
                  onClick={() => {
                    close();
                    nav(`/movie/${selectedCatalogItem._id || selectedCatalogItem.id}`);
                  }}
                >
                  <span>View Movie Page</span>
                  <i>↗</i>
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

                  <div className="two">
                    <label>
                      Collection Shelf
                      <select
                        value={newCinema.collectionName}
                        onChange={(e) =>
                          setNewCinema({ ...newCinema, collectionName: e.target.value })
                        }
                      >
                        <option value="">No Shelf (Unfiled)</option>
                        {availableCollections.map((c) => (
                          <option key={c} value={c}>
                            📁 {c}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label>
                      Synopsis / Description
                      <input
                        value={newCinema.description}
                        onChange={(e) =>
                          setNewCinema({ ...newCinema, description: e.target.value })
                        }
                        placeholder="Brief summary of the story..."
                      />
                    </label>
                  </div>

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
                onChange={(e) => handleInputChange(e.target.value)}
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
                      <div
                        className="cinema-poster-hover-wrap"
                        style={{ cursor: "pointer" }}
                        title={`View ${item.title} page`}
                        onClick={() => {
                          close();
                          nav(`/movie/${item._id || item.id}`);
                        }}
                      >
                        <img className="cinema-result-poster" src={item.file} alt={item.title} />
                        <div className="poster-enter-hint">↗</div>
                      </div>
                      <div className="cinema-result-info">
                        <b
                          className="cinema-title-hover"
                          title={`View ${item.title} page`}
                          onClick={() => {
                            close();
                            nav(`/movie/${item._id || item.id}`);
                          }}
                        >
                          {item.title} <span style={{ fontSize: 11, color: "#9472dc" }}>↗</span>
                        </b>
                        <small>
                          <span className={`type-badge ${(item.type || "Movie").toLowerCase()}`}>
                            {item.type || "Movie"}
                          </span>
                          {item.year} &nbsp;·&nbsp; {item.genre}
                        </small>
                      </div>
                    </div>
                    <button
                      type="button"
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

export function CollectionModal({
  collections = [],
  close,
  name,
  setName,
  add,
  selectedCollection,
  onSelectCollection,
  onDeleteCollection,
}) {
  return (
    <div className="modal-back" onMouseDown={close}>
      <div className="collection-modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="close" onClick={close}>
          ×
        </button>
        <p className="eyebrow">YOUR SHELVES</p>
        <h2>Collections</h2>

        <div className="collection-list">
          <button
            type="button"
            className={!selectedCollection ? "active" : ""}
            onClick={() => {
              if (onSelectCollection) onSelectCollection(null);
              close();
            }}
          >
            <span>All Titles & Shelves</span>
            <i>↗</i>
          </button>

          {collections.map((c) => (
            <div key={c} className="collection-row">
              <button
                type="button"
                className={selectedCollection === c ? "active" : ""}
                onClick={() => {
                  if (onSelectCollection) onSelectCollection(c);
                  close();
                }}
              >
                <span>📁 {c}</span>
                <i>↗</i>
              </button>
              {onDeleteCollection && (
                <button
                  type="button"
                  className="shelf-delete-btn"
                  title={`Delete shelf "${c}"`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCollection(c);
                  }}
                >
                  🗑
                </button>
              )}
            </div>
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
          <button className="button" type="submit">
            Create
          </button>
        </form>
      </div>
    </div>
  );
}

export function CommunityModal({ close }) {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const nav = useNavigate();

  // Only search when user types a query; do not show existing users by default
  const fetchUsers = async (q) => {
    const trimmed = q.trim();
    if (!trimmed) {
      setUsers([]);
      setSearching(false);
      return;
    }

    try {
      setSearching(true);
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(trimmed)}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setSearching(false);
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
              autoFocus
            />

            {searching ? (
              <p style={{ color: "#888", textAlign: "center", margin: "30px 0" }}>
                Searching for cinephile...
              </p>
            ) : query.trim() ? (
              users.length > 0 ? (
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
              ) : (
                <div className="empty" style={{ margin: "30px 0" }}>
                  <b>No cinephile found matching "{query}".</b>
                  <p>Check the exact username and try again.</p>
                </div>
              )
            ) : (
              <div className="empty" style={{ margin: "30px 0" }}>
                <p style={{ color: "#7a7285", fontSize: 13 }}>
                  Type a username above to search for cinephiles.
                </p>
              </div>
            )}
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
