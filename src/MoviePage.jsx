import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Arrow, Mark } from "./App.jsx";

export default function MoviePage() {
  const { id } = useParams();
  const nav = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // User review form state
  const [myRating, setMyRating] = useState(5);
  const [myNote, setMyNote] = useState("");
  const [myFavorite, setMyFavorite] = useState(false);
  const [myWatchlist, setMyWatchlist] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("reelbox_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {}
    }
    fetchMovieDetail();
  }, [id]);

  const fetchMovieDetail = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/movies/${encodeURIComponent(id)}`);
      if (res.ok) {
        const result = await res.json();
        setData(result);

        // Prepopulate user's existing review if any
        const savedUser = localStorage.getItem("reelbox_user");
        const currentUser = savedUser ? JSON.parse(savedUser) : null;
        if (currentUser && result.reviews) {
          const existing = result.reviews.find((r) => r.username === currentUser.name);
          if (existing) {
            setMyRating(existing.rating || 5);
            setMyNote(existing.note || "");
            setMyFavorite(existing.favorite || false);
            setMyWatchlist(existing.watchlist || false);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load movie:", err);
    } finally {
      setLoading(false);
    }
  };

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
        watchlist: myWatchlist,
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

  const handleToggleFavorite = async () => {
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
          watchlist: myWatchlist,
        }),
      });
      fetchMovieDetail();
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  const handleToggleWatchlist = async () => {
    const nextVal = !myWatchlist;
    setMyWatchlist(nextVal);
    try {
      await fetch(`/api/movies/${encodeURIComponent(id)}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user?.name || "demo",
          userId: user?.id,
          rating: myRating,
          note: myNote,
          favorite: myFavorite,
          watchlist: nextVal,
        }),
      });
      fetchMovieDetail();
    } catch (err) {
      console.error("Failed to toggle watchlist:", err);
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
              <button
                className={`line-button ${myFavorite ? "selected" : ""}`}
                onClick={handleToggleFavorite}
              >
                {myFavorite ? "♥ In Favorites" : "♡ Add to Favorites"}
              </button>
              <button
                className={`line-button ${myWatchlist ? "selected" : ""}`}
                onClick={handleToggleWatchlist}
              >
                {myWatchlist ? "✓ In Watchlist" : "+ Add to Watchlist"}
              </button>
            </div>
          </div>
        </section>

        {/* User Review Box */}
        <section className="user-review-section">
          <div className="user-review-card">
            <p className="eyebrow">YOUR CINEMA DIARY</p>
            <h3>Write or Update Your Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="review-inputs-row">
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

              <button className="button" type="submit" disabled={submittingReview}>
                {submittingReview ? "Saving..." : "Submit Review"} <Arrow />
              </button>
            </form>
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

