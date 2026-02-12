
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import AdminNavbar from "./AdminNavbar";
import UserNavbar from "../UserComponents/UserNavbar";
import API_BASE_URL from "../apiConfig";
import axios from "axios";
import "./ViewArticle.css";

/** Inline SVG fallback for broken/missing images (no network needed) */
const FALLBACK_IMG =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'>
       <rect width='100%' height='100%' fill='#e5e7eb'/>
       <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
             font-family='Arial, Helvetica, sans-serif' font-size='18' fill='#6b7280'>
         Image unavailable
       </text>
     </svg>`
  );

/** Debounce helper for search */
function useDebouncedValue(value, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

const ViewArticle = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("userData") || "null");

  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewArticle, setViewArticle] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Modal focus (safe)
  const modalRef = useRef(null);

  const debouncedQuery = useDebouncedValue(searchQuery, 250);

  useEffect(() => {
    fetchArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_BASE_URL}/api/articles`);
      setArticles(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setArticles([]);
      setError("Failed to load articles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getArticleId = (a) => a?.articleId ?? a?.id;

  const handleEdit = (article) => {
    const id = getArticleId(article);
    navigate(`/articles/edit/${id}`, { state: article });
  };

  const askDelete = (article) => {
    setSelectedArticle(article);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedArticle) return;
    try {
      setLoading(true);
      const id = getArticleId(selectedArticle);
      const token = storedUser?.token;

      await axios.delete(`${API_BASE_URL}/api/articles/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      await fetchArticles();
      setDeleteModalOpen(false);
      setSelectedArticle(null);
    } catch (err) {
      console.error(err);
      setError("Delete failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedArticle(null);
  };

  const truncate = (text, max = 220) =>
    (text ?? "").length > max ? `${text.substring(0, max)}…` : text ?? "";

  const norm = (v) => (typeof v === "string" ? v : v == null ? "" : String(v));
  const includesCI = (h, n) =>
    norm(h).toLowerCase().includes(norm(n).trim().toLowerCase());

  const filteredArticles = useMemo(() => {
    const q = debouncedQuery.trim();
    if (!q) return articles;
    return articles.filter((a) => {
      const { title, category, author } = a || {};
      return includesCI(title, q) || includesCI(category, q) || includesCI(author, q);
    });
  }, [articles, debouncedQuery]);

  const hasAnyFromDB = articles.length > 0;
  const hasFilter = debouncedQuery.trim().length > 0;
  const hasFiltered = filteredArticles.length > 0;

  /** Close popup/modal on Escape */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (viewArticle) setViewArticle(null);
        if (deleteModalOpen) closeDeleteModal();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewArticle, deleteModalOpen]);

  /** Safe focus for delete modal (valid :not selector, guarded) */
  useEffect(() => {
    if (!deleteModalOpen || !modalRef.current) return;
    const focusableSelector = [
      'button:not([tabindex="-1"]):not([disabled])',
      'a[href]:not([tabindex="-1"])',
      'input:not([type="hidden"]):not([disabled]):not([tabindex="-1"])',
      'select:not([disabled]):not([tabindex="-1"])',
      'textarea:not([disabled]):not([tabindex="-1"])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(",");
    const id = requestAnimationFrame(() => {
      try {
        (modalRef.current.querySelector(focusableSelector) || modalRef.current)?.focus();
      } catch (e) {
        console.warn("Modal focus skipped:", e);
      }
    });
    return () => cancelAnimationFrame(id);
  }, [deleteModalOpen]);

  return (
    <>
      {storedUser?.role === "Admin" ? <AdminNavbar /> : <UserNavbar />}

      <div className="view-container">
        <div className="container container--fixed4">
          <div className="page-header">
            <h2 className="view-title">Articles</h2>
            <div className="tools">
              <input
                className="uva-search"
                type="text"
                placeholder="Search by title, category, or author…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search articles"
              />
            </div>
          </div>

          {!loading && error && (
            <div className="alert error" role="alert" aria-live="assertive">
              {error}
            </div>
          )}

          <div className="card-grid card-grid--fixed4">
            {loading &&
              Array.from({ length: 8 }).map((_, i) => (
                <div className="article-card-item skeleton" key={`sk-${i}`}>
                  <div className="sk-img" />
                  <div className="sk-line short" />
                  <div className="sk-line" />
                  <div className="sk-line" />
                  <div className="sk-actions" />
                </div>
              ))}

            {!loading && !error && !hasAnyFromDB && !hasFilter && (
              <div className="grid-full empty">
                <h3>No articles yet</h3>
                <p>Start by adding your first article from the admin panel.</p>
              </div>
            )}

            {!loading && !error && hasAnyFromDB && !hasFiltered && hasFilter && (
              <div className="grid-full empty">
                <h3>No matches for “{debouncedQuery}”</h3>
                <p>Try a different keyword or clear the search.</p>
              </div>
            )}

            {!loading &&
              !error &&
              hasFiltered &&
              filteredArticles.map((a) => {
                const key = getArticleId(a) ?? `${a.title}-${a.author}`;
                const imgSrc = a?.articleImage ?? a?.image ?? FALLBACK_IMG;

                return (
                  <article className="article-card-item article-card-item--tall" key={key}>
                    <img
                      src={imgSrc}
                      alt={a?.title || "Article"}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMG;
                      }}
                    />

                    <div className="card-body">
                      <h3 title={a?.title} className="card-title">
                        {a?.title}
                      </h3>

                      <div className="badge-row">
                        <span className="badge category-badge">
                          {a?.category ?? "Uncategorized"}
                        </span>
                        <span className="badge author-badge">
                          {a?.author ?? "Unknown"}
                        </span>
                      </div>

                      {/* Fixed-height, clamped preview to keep Read more aligned */}
                      <p className="card-text">{truncate(a?.content)}</p>

                      {/* Read more button OUTSIDE the paragraph for clean flow */}
                      <button
                        className="read-more"
                        onClick={() => setViewArticle(a)}
                        aria-haspopup="dialog"
                        aria-controls="article-dialog"
                      >
                        Read more
                      </button>

                      {/* Actions pinned to the bottom for perfect alignment */}
                      <div className="card-actions">
                        <button
                          className="icon-btn"
                          onClick={() => handleEdit(a)}
                          aria-label={`Edit ${a?.title || "article"}`}
                          title="Edit"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className="icon-btn delete-icon"
                          onClick={() => askDelete(a)}
                          aria-label={`Delete ${a?.title || "article"}`}
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
          </div>
        </div>
      </div>

      {/* READ MORE POPUP */}
      {viewArticle && (
        <div
          className="popup-backdrop"
          onClick={() => setViewArticle(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Article details"
          id="article-dialog"
        >
          <div
            className="popup-card-popup-b"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-btn"
              onClick={() => setViewArticle(null)}
              aria-label="Close"
              title="Close"
            >
              ×
            </button>

            <img
              src={viewArticle?.articleImage ?? viewArticle?.image ?? FALLBACK_IMG}
              alt={viewArticle?.title || "Article image"}
              onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
            />
            <h2 className="popup-title">{viewArticle?.title}</h2>

            <div className="badge-row center">
              {viewArticle?.category && (
                <span className="badge category-badge">{viewArticle.category}</span>
              )}
              {viewArticle?.author && (
                <span className="badge author-badge">{viewArticle.author}</span>
              )}
            </div>

            <p className="popup-text">{viewArticle?.content}</p>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModalOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card" ref={modalRef} tabIndex={-1}>
            <h3 className="modal-text">Delete this article?</h3>
            <p className="modal-sub">This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-danger" onClick={confirmDelete}>
                Yes, delete
              </button>
              <button className="btn btn-secondary" onClick={closeDeleteModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewArticle;
