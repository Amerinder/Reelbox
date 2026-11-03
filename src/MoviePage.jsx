import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Arrow, Mark } from "./App.jsx";

export default function MoviePage() {
  const { id } = useParams();
  const nav = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userEntry, setUserEntry] = useState(null);

  // User review form state
  const [myRating, setMyRating] = useState(5);
  const [myNote, setMyNote] = useState("");
  const [myFavorite, setMyFavorite] = useState(false);
  const [myWatchlist, setMyWatchlist] = useState(false);
  const [myCollection, setMyCollection] = useState("");
  const [collections, setCollections] = useState([
    "Late Night",
    "Mind Benders",
    "Comfort Movies",
    "Weekend Picks",
  ]);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("reelbox_user");
    let currentUser = null;
    if (saved) {
      try {
        currentUser = JSON.parse(saved);
        setUser(currentUser);
      } catch {}
    }
    fetchMovieDetail(currentUser?.name);
    fetch("/api/collections")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          setCollections(data.map((c) => c.name));
        }
      })
      .catch(() => {});
  }, [id]);

  const fetchMovieDetail = async (username) => {
    try {
      setLoading(true);
      const queryUser = username || user?.name ? `?username=${encodeURIComponent(username || user?.name)}` : "";
      const res = await fetch(`/api/movies/${encodeURIComponent(id)}${queryUser}`);
      if (res.ok) {
        const result = await res.json();
        setData(result);
        setUserEntry(result.userEntry || null);

        if (result.userEntry) {
          setMyRating(result.userEntry.rating || 5);
          setMyNote(result.userEntry.note || "");
          setMyFavorite(Boolean(result.userEntry.favorite));
          setMyWatchlist(Boolean(result.userEntry.watchlist));
          setMyCollection(result.userEntry.collectionName || "");
        } else {
          setMyFavorite(false);
          setMyWatchlist(false);
          setMyNote("");
          setMyRating(5);
          setMyCollection("");
        }
      }
    } catch (err) {
      console.error("Failed to load movie:", err);
    } finally {
      setLoading(false);
    }
  };

  const isWatched = userEntry && !userEntry.watchlist;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    setReviewMessage("");

    try {
      const payload = {
        username: user?.name || "demo",
        userId: user?.id,
        rating: Number(myRating),
        note: myNote.trim(),
        favorite: myFavorite,
        watchlist: false,
        collectionName: myCollection,
      };

      const res = await fetch(`/api/movies/${encodeURIComponent(id)}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setReviewMessage("Your review and rating were saved!");
        fetchMovieDetail(); // Refresh community reviews list
      } else {
        const err = await res.json();
        setReviewMessage(err.message || "Failed to post review");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      setReviewMessage("Network error submitting review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleMarkAsWatched = async () => {
    setSubmittingReview(true);
    setReviewMessage("");
    try {
      const payload = {
        username: user?.name || "demo",
        userId: user?.id,
        rating: myRating || 5,
        note: myNote.trim(),
        favorite: myFavorite,
        watchlist: false,
        collectionName: myCollection || "",
      };

      const res = await fetch(`/api/movies/${encodeURIComponent(id)}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setReviewMessage("✓ Marked as watched! Rating and review unlocked.");
        fetchMovieDetail();
      } else {
        const err = await res.json();
        setReviewMessage(err.message || "Failed to mark watched");
      }
    } catch (err) {
      console.error("Mark watched error:", err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleSaveToWatchlist = async () => {
    try {
      const payload = {
        username: user?.name || "demo",
        userId: user?.id,
        rating: 0,
        note: "",
        favorite: false,
        watchlist: true,
        collectionName: myCollection || "",
      };

      const res = await fetch(`/api/movies/${encodeURIComponent(id)}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setReviewMessage("⏱ Saved to your Watchlist (unwatched)!");
        fetchMovieDetail();
      }
    } catch (err) {
      console.error("Watchlist toggle error:", err);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isWatched) {
      alert("Please mark as watched before favoriting.");
      return;
    }
    const nextVal = !myFavorite;
    setMyFavorite(nextVal);
    try {
      await fetch(`/api/movies/${encodeURIComponent(id)}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user?.name || "demo",
          userId: user?.id,
          rating: myRating,
          note: myNote,
          favorite: nextVal,
          watchlist: false,
        }),
      });
      fetchMovieDetail();
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  const handleRemoveFromReelbox = async () => {
    const confirmed = window.confirm(`Remove "${movie.title}" from your Reelbox?`);
    if (!confirmed) return;

    try {
      const targetId = userEntry?._id || movie._id;
      const res = await fetch(`/api/movies/${encodeURIComponent(targetId)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setUserEntry(null);
        setMyFavorite(false);
        setMyWatchlist(false);
        setMyNote("");
        setMyRating(5);
        setMyCollection("");
        setReviewMessage("Removed from your Reelbox.");
        fetchMovieDetail();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to remove title");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (loading) {
    return (
      <main className="movie-page">
        <header className="library-head">
          <Mark />
          <button className="back-link" onClick={() => nav(-1)}>
            ← Back
          </button>
        </header>
        <div className="movie-page-content empty" style={{ marginTop: 80 }}>
          <p>Loading cinema page...</p>
        </div>
      </main>
    );
  }

  if (!data || !data.movie) {
    return (
      <main className="movie-page">
        <header className="library-head">
          <Mark />
          <button className="back-link" onClick={() => nav(-1)}>
            ← Back
          </button>
        </header>
        <div className="movie-page-content empty" style={{ marginTop: 80 }}>
          <h2>Title not found</h2>
          <p>We couldn't locate this cinema entry.</p>
          <button className="button" onClick={() => nav("/collection")}>
            Return to Collection <Arrow />
          </button>
        </div>
      </main>
    );
  }

  const { movie, stats, reviews } = data;

  return (
    <main className="movie-page">
      <header className="library-head">
        <Mark />
        <div className="library-links">
          <button onClick={() => nav("/")}>Home</button>
          <button onClick={() => nav("/collection")}>My Collection</button>
        </div>
        <button className="back-link" onClick={() => nav(-1)} style={{ marginLeft: "auto" }}>
          ← Back to library
        </button>
      </header>

      <div className="movie-page-content">
        {/* Main Cinema Overview */}
        <section className="movie-hero-grid">
          <div className="movie-poster-wrap">
            <img src={movie.file} alt={movie.title} />
          </div>

          <div className="movie-meta-wrap">
            <div className="format-row">
              <span className={`type-badge ${(movie.type || "Movie").toLowerCase()}`}>
                {movie.type || "Movie"}
              </span>
              <span className="movie-year-genre">
                {movie.year} &nbsp;·&nbsp; {movie.genre}
              </span>
            </div>

            <h1 className="movie-title">{movie.title}</h1>

            {/* Community Rating Banner */}
            <div className="rating-overview-banner">
              <div className="big-stars">
                {"★".repeat(Math.round(stats.avgRating || 5))}
                <span>{"★".repeat(5 - Math.round(stats.avgRating || 5))}</span>
              </div>
              <b className="avg-rating-text">{stats.avgRating} out of 5</b>
              <span className="rating-count-text">
                ({stats.totalReviews} global {stats.totalReviews === 1 ? "review" : "reviews"})
              </span>
            </div>

            <p className="movie-synopsis">{movie.description}</p>

            <div className="movie-action-buttons">
              {isWatched ? (
                <>
                  <button
                    type="button"
                    className={`line-button ${myFavorite ? "selected" : ""}`}
                    onClick={handleToggleFavorite}
                  >
                    {myFavorite ? "♥ In Favorites" : "♡ Add to Favorites"}
                  </button>
                  <button
                    type="button"
                    className="line-button"
                    onClick={handleSaveToWatchlist}
                  >
                    ⏱ Move to Watchlist
                  </button>
                  <button
                    type="button"
                    className="line-button"
                    style={{ borderColor: "#ef444455", color: "#f87171" }}
                    onClick={handleRemoveFromReelbox}
                  >
                    🗑 Remove
                  </button>
                </>
              ) : myWatchlist ? (
                <>
                  <button
                    type="button"
                    className="unwatched-unlock-btn"
                    onClick={handleMarkAsWatched}
                  >
                    ✓ Mark as Watched
                  </button>
                  <button
                    type="button"
                    className="line-button selected"
                    onClick={handleRemoveFromReelbox}
                    title="Click to remove from Watchlist"
                  >
                    ⏱ In Watchlist (Remove 🗑)
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="unwatched-unlock-btn"
                    onClick={handleMarkAsWatched}
                  >
                    ✓ Mark as Watched
                  </button>
                  <button
                    type="button"
                    className="line-button"
                    onClick={handleSaveToWatchlist}
                  >
                    + Add to Watchlist
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* User Review Box */}
        <section className="user-review-section">
          <div className="user-review-card">
            <p className="eyebrow">YOUR CINEMA DIARY</p>
            <h3>Write or Update Your Review</h3>

            {!isWatched ? (
              <div className="unwatched-review-gate">
                <div className="gate-icon">{myWatchlist ? "⏱" : "🔒"}</div>
                <h3>{myWatchlist ? "In Your Watchlist (Unwatched)" : `Have you watched ${movie.title}?`}</h3>
                <p>
                  {myWatchlist
                    ? "You have saved this story to your Watchlist. Ratings and personal reviews are locked until you have watched it."
                    : "Ratings and reviews are reserved for stories you have watched. Mark this title as watched to unlock your rating and personal review."}
                </p>
                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 14 }}>
                  <button
                    type="button"
                    className="unwatched-unlock-btn"
                    onClick={handleMarkAsWatched}
                    disabled={submittingReview}
                  >
                    {submittingReview ? "Unlocking..." : "✓ Mark as Watched — Unlock Review"}
                  </button>
                  {!myWatchlist && (
                    <button
                      type="button"
                      className="line-button"
                      style={{ borderRadius: 99 }}
                      onClick={handleSaveToWatchlist}
                    >
                      + Save to Watchlist
                    </button>
                  )}
                  {myWatchlist && (
                    <button
                      type="button"
                      className="line-button"
                      style={{ borderColor: "#ef444455", color: "#f87171", borderRadius: 99 }}
                      onClick={handleRemoveFromReelbox}
                    >
                      🗑 Remove from Watchlist
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit}>
                <div className="review-inputs-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <label>
                    Your Rating:
                    <select
                      value={myRating}
                      onChange={(e) => setMyRating(+e.target.value)}
                    >
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>
                          {n} Stars ({"★".repeat(n)})
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Collection Shelf:
                    <select
                      value={myCollection}
                      onChange={(e) => setMyCollection(e.target.value)}
                    >
                      <option value="">No Shelf (Unfiled)</option>
                      {collections.map((c) => (
                        <option key={c} value={c}>
                          📁 {c}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label>
                  Your Thoughts & Memories:
                  <textarea
                    rows="3"
                    value={myNote}
                    onChange={(e) => setMyNote(e.target.value)}
                    placeholder="How did this film make you feel? What stood out about the direction, story, or performances?"
                  />
                </label>

                {reviewMessage && <p className="review-feedback">{reviewMessage}</p>}

                <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginTop: 8 }}>
                  <button className="button" type="submit" disabled={submittingReview}>
                    {submittingReview ? "Saving..." : "Submit Review"} <Arrow />
                  </button>
                  <button
                    type="button"
                    className="line-button"
                    style={{ borderColor: "#ef444455", color: "#f87171" }}
                    onClick={handleRemoveFromReelbox}
                  >
                    🗑 Remove from My Reelbox
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* Amazon-Style Community Reviews */}
        <section className="community-reviews-section">
          <div className="reviews-header-block">
            <h2>Community Reviews & Ratings</h2>
            <p>Read what fellow cinephiles have to say about {movie.title}.</p>
          </div>

          {reviews && reviews.length > 0 ? (
            <div className="reviews-grid">
              {reviews.map((rev) => (
                <div key={rev._id} className="amazon-review-card">
                  <div className="review-user-row">
                    <div className="reviewer-avatar">
                      {rev.username ? rev.username.slice(0, 2).toUpperCase() : "RB"}
                    </div>
                    <div>
                      <b className="reviewer-name">{rev.username}</b>
                      <span className="verified-badge">✓ Verified Cinephile</span>
                    </div>
                  </div>

                  <div className="review-stars-row">
                    <span className="stars-gold">
                      {"★".repeat(rev.rating || 5)}
                    </span>
                    <span className="stars-muted">
                      {"★".repeat(5 - (rev.rating || 5))}
                    </span>
                    <span className="review-date">
                      Reviewed on {new Date(rev.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="review-body">
                    {rev.note ? (
                      <p>“{rev.note}”</p>
                    ) : (
                      <p className="no-text-review">Rated {rev.rating} stars without a written review.</p>
                    )}
                  </div>

                  <div className="review-footer-tags">
                    {rev.collectionName && <span className="review-tag shelf" style={{ background: "#9472dc24", color: "#b99eff", borderColor: "#9472dc" }}>📁 {rev.collectionName}</span>}
                    {rev.favorite && <span className="review-tag fav">♥ Favorite</span>}
                    {rev.watchlist && <span className="review-tag watch">In Watchlist</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty">
              <b>No community reviews yet.</b>
              <p>Be the first cinephile to leave your thoughts!</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

