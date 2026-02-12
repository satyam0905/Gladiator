
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../apiConfig";
import AdminNavbar from "../AdminComponents/AdminNavbar";
import UserNavbar from "./UserNavbar";
import './UserViewArticle.css'

const FALLBACK_IMG =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'>
    <rect width='100%' height='100%' fill='#e5e7eb'/>
    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
      font-family='Arial' font-size='18' fill='#6b7280'>
      Image unavailable
    </text>
  </svg>`);

function UserViewArticle() {
  const storedUser = JSON.parse(localStorage.getItem("userData"));
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewArticle, setViewArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_BASE_URL}/api/articles`);
      setArticles(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setError("Failed to load articles.");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const norm = (v) => (typeof v === "string" ? v : v == null ? "" : String(v));
  const includesCI = (h, n) =>
    norm(h).toLowerCase().includes(norm(n).trim().toLowerCase());

  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return articles;
    return articles.filter((a) =>
      includesCI(a.title, searchQuery) ||
      includesCI(a.category, searchQuery) ||
      includesCI(a.author, searchQuery)
    );
  }, [articles, searchQuery]);

  const truncate = (text, max = 220) =>
    (text ?? "").length > max ? `${text.substring(0, max)}…` : text ?? "";

  return (
    <>
      {storedUser?.role === "Admin" ? <AdminNavbar /> : <UserNavbar />}

      <div className="view-container user-view">
        <div className="container container--fixed4">

          <div className="page-header">
            <h2 className="view-title">Articles</h2>
            <input
              className="uva-search"
              type="text"
              placeholder="Search by title, category, or author…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {error && <div className="alert error">{error}</div>}

          <div className="card-grid card-grid--fixed4">

            {loading &&
              Array.from({ length: 6 }).map((_, i) => (
                <div className="article-card-item skeleton" key={i}>
                  <div className="sk-img" />
                  <div className="sk-line short" />
                  <div className="sk-line" />
                </div>
              ))}

            {!loading &&
              filteredArticles.map((a) => (
                <article className="article-card-item" key={a.articleId ?? a.id}>
                  <img
                    src={a.articleImage ?? a.image ?? FALLBACK_IMG}
                    alt={a.title}
                    onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
                  />

                  <div className="card-body">
                    <h3 className="card-title">{a.title}</h3>

                    <div className="badge-row">
                      <span className="badge category-badge">{a.category}</span>
                      <span className="badge author-badge">{a.author}</span>
                    </div>

                    <p className="card-text">{truncate(a.content)}</p>

                    <button
                      className="read-more"
                      onClick={() => setViewArticle(a)}
                    >
                      Read more
                    </button>
                  </div>
                </article>
              ))}
          </div>
        </div>
      </div>

     
      {viewArticle && (
        <div className="popup-backdrop" onClick={() => setViewArticle(null)}>
          <div className="popup-card-popup-b" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setViewArticle(null)}>×</button>

            <img
              src={viewArticle.articleImage ?? viewArticle.image ?? FALLBACK_IMG}
              alt={viewArticle.title}
            />

            <h2 className="popup-title">{viewArticle.title}</h2>

            <div className="badge-row center">
              <span className="badge category-badge">{viewArticle.category}</span>
              <span className="badge author-badge">{viewArticle.author}</span>
            </div>

            <p className="popup-text">{viewArticle.content}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default UserViewArticle;
