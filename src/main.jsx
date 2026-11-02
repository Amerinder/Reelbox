import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import "./style.css";

const posters = [
  [
    "l_the-dark-knight-movie-poster_96214dbd.jpg",
    "The Dark Knight",
    "2008",
    "Crime · Drama",
  ],
  [
    "xl_the-odyssey-movie-poster_81db230a.jpg",
    "The Odyssey",
    "2026",
    "Adventure · Epic",
  ],
  ["images.jpg", "Saiyaara", "2025", "Romance · Drama"],
  ["images (1).jpg", "Interstellar", "2014", "Sci-Fi · Drama"],
  ["images (2).jpg", "Inception", "2010", "Sci-Fi · Thriller"],
  ["images (3).jpg", "The Godfather", "1972", "Crime · Drama"],
  ["images (4).jpg", "La La Land", "2016", "Romance · Musical"],
  ["images (5).jpg", "Whiplash", "2014", "Drama · Music"],
  ["images (6).jpg", "Dune", "2021", "Sci-Fi · Adventure"],
  ["images (7).jpg", "Parasite", "2019", "Thriller · Drama"],
  ["images (8).jpg", "The Grand Budapest Hotel", "2014", "Comedy · Drama"],
  [
    "images (9).jpg",
    "Everything Everywhere All at Once",
    "2022",
    "Fantasy · Drama",
  ],
].map(([file, title, year, genre], i) => ({
  id: i + 1,
  file: `/Posters/${file}`,
  title,
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

function Mark() {
  return (
    <Link className="mark" to="/">
      <span>R</span>REELBOX
    </Link>
  );
}
function Arrow() {
  return <span className="arrow">↗</span>;
}
function PosterWall({ dim = false }) {
  const cols = [posters.slice(0, 4), posters.slice(4, 8), posters.slice(8, 12)];
  return (
    <div className={`poster-wall ${dim ? "dim" : ""}`}>
      {cols.map((col, i) => (
        <div className={`poster-column ${i === 1 ? "down" : "up"}`} key={i}>
          <div className="poster-track">
            {[...col, ...col, ...col].map((m, k) => (
              <img key={k} src={m.file} alt="" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
function Landing() {
  return (
    <main className="landing">
      <section className="hero">
        <PosterWall />
        <nav>
          <Mark />
          <div className="nav-links">
            <a href="#how">The collection</a>
            <Link to="/login">Sign in</Link>
            <Link className="tiny-button" to="/signup">
              Get started
            </Link>
          </div>
        </nav>
        <div className="hero-copy">
          <p className="eyebrow">PERSONAL CINEMA, CURATED</p>
          <h1>
            Your movies.
            <br />
            <i>Your memories.</i>
          </h1>
          {/* <p className="lede">
            A quiet home for the stories worth keeping — your favorites, future
            watches, and the feelings they leave behind.
          </p> */}
          <p className="lede">
            Reelbox helps you save, organize, and revisit the movies you love — with
            your own ratings, notes, watchlist, and collections.
          </p>
          <div className="hero-actions">
            <Link className="button" to="/signup">
              Build your Reelbox <Arrow />
            </Link>
            <a className="text-link" href="#preview">
              Explore the collection <Arrow />
            </a>
          </div>
        </div>
        <div className="hero-caption">
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
            title="Watchlist"
            text="Keep the next great story close."
          />
          <Feature
            n="02"
            title="Favorites"
            text="Hold on to the films you never outgrow."
          />
          <Feature
            n="03"
            title="Collections"
            text="Make shelves for every version of you."
          />
          <Feature
            n="04"
            title="Memories"
            text="Leave a note for your future self."
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
            {posters.slice(0, 6).map((m) => (
              <img key={m.id} src={m.file} alt={m.title} />
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
        <Link className="button" to="/signup">
          Create your Reelbox <Arrow />
        </Link>
      </section>
      <footer>
        <Mark />
        <p>Your movies. Your memories.</p>
        <small>© 2026 Reelbox</small>
        <div>Privacy&nbsp;&nbsp; Terms&nbsp;&nbsp; Contact</div>
      </footer>
    </main>
  );
}
function Feature({ n, title, text }) {
  return (
    <article>
      <span>{n}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}
function Auth({ signup = false }) {
  const nav = useNavigate(),
    [values, setValues] = useState({ name: "", pass: "" }),
    [error, setError] = useState("");
  function submit(e) {
    e.preventDefault();
    if (!values.name.trim() || !values.pass.trim())
      return setError("Please fill in both fields to continue.");
    nav("/collection");
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
            ? "A home for every movie you want to remember."
            : "Sign in to return to the stories you love."}
        </p>
        <form onSubmit={submit}>
          <label>
            Email or username
            <input
              value={values.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
              placeholder="you@example.com"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={values.pass}
              onChange={(e) => setValues({ ...values, pass: e.target.value })}
              placeholder="••••••••"
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button className="button" type="submit">
            {signup ? "Create Reelbox" : "Sign in"} <Arrow />
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
function MovieCard({ movie, onClick }) {
  return (
    <button className="movie-card" onClick={() => onClick(movie)}>
      <img loading="lazy" src={movie.file} alt={movie.title} />
      <span className="movie-overlay">
        <b>{movie.title}</b>
        <small>
          {"★".repeat(movie.rating)} <em>{movie.year}</em>
        </small>
        <small>{movie.genre}</small>
      </span>
    </button>
  );
}
function Collection() {
  const [movies, setMovies] = useState(posters),
    [selected, setSelected] = useState(null),
    [query, setQuery] = useState(""),
    [tab, setTab] = useState("All"),
    [add, setAdd] = useState(false),
    [newMovie, setNewMovie] = useState({
      title: "",
      year: "",
      genre: "",
      file: "",
      rating: 5,
      note: "",
    }),
    [collections, setCollections] = useState([
      "Late Night",
      "Mind Benders",
      "Comfort Movies",
      "Weekend Picks",
    ]),
    [newCollection, setNewCollection] = useState(""),
    [collectionOpen, setCollectionOpen] = useState(false);
  const filtered = useMemo(
    () =>
      movies.filter(
        (m) =>
          m.title.toLowerCase().includes(query.toLowerCase()) &&
          (tab === "All" ||
            (tab === "Favorites" && m.favorite) ||
            (tab === "Watchlist" && m.watchlist)),
      ),
    [movies, query, tab],
  );
  const toggle = (key, id) =>
    setMovies((ms) =>
      ms.map((m) => (m.id === id ? { ...m, [key]: !m[key] } : m)),
    );
  function addMovie(e) {
    e.preventDefault();
    if (!newMovie.title || !newMovie.file) return;
    setMovies([
      {
        ...newMovie,
        id: Date.now(),
        year: newMovie.year || "2026",
        genre: newMovie.genre || "Unfiled",
        watchlist: false,
        favorite: false,
      },
      ...movies,
    ]);
    setAdd(false);
  }
  return (
    <main className="library">
      <header className="library-head">
        <Mark />
        <div className="library-links">
          <button>Home</button>
          <button className="active">My Collection</button>
          <button onClick={() => setTab("Watchlist")}>Watchlist</button>
          <button onClick={() => setTab("Favorites")}>Favorites</button>
          <button onClick={() => setCollectionOpen(true)}>Collections</button>
        </div>
        <button className="profile">
          AM <span>⌄</span>
        </button>
      </header>
      <div className="library-content">
        <section className="collection-hero">
          <div>
            <p className="eyebrow">YOUR PERSONAL CINEMA</p>
            <h1>
              Your <i>collection.</i>
            </h1>
            <p>The stories you’ve watched, loved, and want to remember.</p>
          </div>
          <button onClick={() => setAdd(true)} className="button">
            ＋ Add movie
          </button>
        </section>
        <section className="stat-row">
          <div>
            <b>{movies.length.toString().padStart(2, "0")}</b>
            <span>Movies</span>
          </div>
          <div>
            <b>
              {movies
                .filter((m) => m.favorite)
                .length.toString()
                .padStart(2, "0")}
            </b>
            <span>Favorites</span>
          </div>
          <div>
            <b>
              {movies
                .filter((m) => m.watchlist)
                .length.toString()
                .padStart(2, "0")}
            </b>
            <span>Watchlist</span>
          </div>
          <div>
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
          </div>
          <label className="search">
            ⌕{" "}
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your collection..."
            />
          </label>
        </section>
        <Shelf
          title={tab === "All" ? "Recently added" : tab}
          movies={filtered}
          onClick={setSelected}
        />
        {tab === "All" && (
          <>
            <Shelf
              title="Favorites"
              movies={movies.filter((m) => m.favorite)}
              onClick={setSelected}
            />
            <Shelf
              title="Watchlist"
              movies={movies.filter((m) => m.watchlist)}
              onClick={setSelected}
            />
          </>
        )}
      </div>
      {selected && (
        <MovieModal
          movie={selected}
          close={() => setSelected(null)}
          toggle={toggle}
        />
      )}{" "}
      {add && (
        <AddModal
          state={newMovie}
          setState={setNewMovie}
          close={() => setAdd(false)}
          submit={addMovie}
        />
      )}{" "}
      {collectionOpen && (
        <CollectionModal
          collections={collections}
          close={() => setCollectionOpen(false)}
          name={newCollection}
          setName={setNewCollection}
          add={() => {
            if (newCollection.trim())
              setCollections([...collections, newCollection.trim()]);
            setNewCollection("");
          }}
        />
      )}
    </main>
  );
}
function Shelf({ title, movies, onClick }) {
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
            <MovieCard movie={m} key={m.id} onClick={onClick} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <b>Nothing queued yet.</b>
          <p>Find a story worth adding.</p>
        </div>
      )}
    </section>
  );
}
function MovieModal({ movie, close, toggle }) {
  return (
    <div className="modal-back" onMouseDown={close}>
      <div className="movie-modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="close" onClick={close}>
          ×
        </button>
        <img src={movie.file} alt={movie.title} />
        <div>
          <p className="eyebrow">IN YOUR REELBOX</p>
          <h2>{movie.title}</h2>
          <p className="meta">
            {movie.year} &nbsp;·&nbsp; {movie.genre}
          </p>
          <p className="stars">
            {"★".repeat(movie.rating)}
            <span>{"★".repeat(5 - movie.rating)}</span>
          </p>
          <blockquote>“{movie.note}”</blockquote>
          <button
            className={`line-button ${movie.favorite ? "selected" : ""}`}
            onClick={() => toggle("favorite", movie.id)}
          >
            {movie.favorite ? "♥ In Favorites" : "♡ Add to Favorites"}
          </button>
          <button
            className={`line-button ${movie.watchlist ? "selected" : ""}`}
            onClick={() => toggle("watchlist", movie.id)}
          >
            {movie.watchlist ? "✓ In Watchlist" : "+ Add to Watchlist"}
          </button>
        </div>
      </div>
    </div>
  );
}
function AddModal({ state, setState, close, submit }) {
  function preview(e) {
    const file = e.target.files?.[0];
    if (file) setState({ ...state, file: URL.createObjectURL(file) });
  }
  return (
    <div className="modal-back">
      <form className="add-modal" onSubmit={submit}>
        <button type="button" className="close" onClick={close}>
          ×
        </button>
        <p className="eyebrow">A NEW MEMORY</p>
        <h2>Add a movie</h2>
        <div className="add-content">
          <label className="upload">
            {state.file ? (
              <img src={state.file} alt="Preview" />
            ) : (
              <>
                <span>＋</span>
                <b>Upload poster</b>
                <small>JPG, PNG or WEBP</small>
              </>
            )}
            <input type="file" accept="image/*" onChange={preview} />
          </label>
          <div className="form-fields">
            <label>
              Movie title
              <input
                required
                value={state.title}
                onChange={(e) => setState({ ...state, title: e.target.value })}
              />
            </label>
            <div className="two">
              <label>
                Year
                <input
                  value={state.year}
                  onChange={(e) => setState({ ...state, year: e.target.value })}
                />
              </label>
              <label>
                Genre
                <input
                  value={state.genre}
                  onChange={(e) =>
                    setState({ ...state, genre: e.target.value })
                  }
                />
              </label>
            </div>
            <label>
              Your rating
              <select
                value={state.rating}
                onChange={(e) =>
                  setState({ ...state, rating: +e.target.value })
                }
              >
                {[5, 4, 3, 2, 1].map((x) => (
                  <option key={x} value={x}>
                    {"★".repeat(x)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Personal note
              <textarea
                value={state.note}
                onChange={(e) => setState({ ...state, note: e.target.value })}
              />
            </label>
          </div>
        </div>
        <button className="button">
          Add to Reelbox <Arrow />
        </button>
      </form>
    </div>
  );
}
function CollectionModal({ collections, close, name, setName, add }) {
  return (
    <div className="modal-back">
      <div className="collection-modal">
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
          <button className="button">Create</button>
        </form>
      </div>
    </div>
  );
}
function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/signup" element={<Auth signup />} />
      <Route path="/collection" element={<Collection />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);

