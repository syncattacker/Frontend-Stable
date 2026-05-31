"use client";

import React, { useState, useEffect, useRef } from "react";
import ArticleCard from "@/components/blog/ArticleCard";
import KnowledgeBaseSidebar from "@/components/blog/KnowledgeBaseSidebar";
import { blogApi } from "@/services/blogApi";

const T = {
  bg: "#000000",
  cream: "#fefce8",
  muted: "#a1a1aa",
  border: "rgba(254,252,232,0.12)",
  borderHover: "rgba(254,252,232,0.22)",
  card: "#111111",
  inputBg: "#0f0f0f",
};

const CATEGORIES = ["All", "Guides", "Tutorials", "News", "Updates", "Tools"];

function CategoryTabs({ active, setActive }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
      {CATEGORIES.map((cat) => {
        const isActive = active === cat;
        return (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.color = T.cream;
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.color = T.muted;
            }}
            style={{
              padding: "16px 20px",
              background: "transparent",
              border: "none",
              borderBottom: isActive
                ? `1px solid ${T.cream}`
                : "1px solid transparent",
              color: isActive ? T.cream : T.muted,
              fontFamily: "Outfit, sans-serif",
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              cursor: "pointer",
              transition: "color 0.15s ease, border-color 0.15s ease",
            }}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}

/* ─── article skeleton card ──────────────────────────────────── */
function SkeletonCard({ index }) {
  return (
    <div
      style={{
        padding: "28px",
        background: T.card,
        borderRight: index % 2 === 0 ? `1px solid ${T.border}` : "none",
        borderBottom: `1px solid ${T.border}`,
        minHeight: "220px",
        animation: "pulse 1.4s ease-in-out infinite",
        animationDelay: `${index * 0.08}s`,
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            background: T.border,
            borderRadius: "2px",
          }}
        />
        <div
          style={{
            width: "24px",
            height: "12px",
            background: T.border,
            borderRadius: "2px",
          }}
        />
      </div>
      <div style={{ flex: 1 }} />
      <div
        style={{
          width: "60%",
          height: "12px",
          background: T.border,
          borderRadius: "2px",
        }}
      />
      <div
        style={{
          width: "90%",
          height: "9px",
          background: T.border,
          borderRadius: "2px",
        }}
      />
      <div
        style={{
          width: "75%",
          height: "9px",
          background: T.border,
          borderRadius: "2px",
        }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   PAGE
════════════════════════════════════════════════════════════════ */
export default function KnowledgeBasePage() {
  const [allArticles, setAllArticles] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(12);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [loadHover, setLoadHover] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    blogApi
      .getAllBlogs(1, visibleCount)
      .then((res) => {
        if (res.success) {
          setAllArticles(res.data);
          setPagination({ total: res.total, pages: res.pages });
        }
      })
      .catch((err) => console.error("Failed to fetch articles:", err))
      .finally(() => setIsLoading(false));
  }, [visibleCount]);

  const filteredArticles =
    activeCategory === "All"
      ? allArticles
      : allArticles.filter((a) => a.category === activeCategory);

  const displayedArticles = filteredArticles.slice(0, visibleCount);
  const canLoadMore = allArticles.length < pagination.total;

  const handleCategoryChange = (tab) => {
    setActiveCategory(tab);
    setVisibleCount(12);
  };

  return (
    <div
      style={{
        background: T.bg,
        minHeight: "100vh",
        color: T.cream,
        fontFamily: "Outfit, sans-serif",
      }}
    >
      <main style={{ paddingTop: "40px" }}>
        <section
          style={{
            padding: "0px 40px 20px",
            borderBottom: `1px solid ${T.border}`,
          }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h1
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(3rem, 7vw, 5.5rem)",
                letterSpacing: "-0.03em",
                lineHeight: 0.92,
                color: T.cream,
                textTransform: "uppercase",
                marginBottom: "10px",
              }}
            >
              Knowledge
              <br />
              Base
            </h1>

            {/* Subtitle with dash */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "14px",
                marginBottom: "38px",
              }}
            >
              <p
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontSize: "14px",
                  lineHeight: 1.65,
                  color: T.muted,
                  maxWidth: "520px",
                }}
              >
                Deep dives, tactical guides, and technical insights from the
                GoPwnIt ecosystem. Everything you need to understand the
                platform.
              </p>
            </div>

            <div
              style={{
                width: "100%",
                height: "1px",
                background: T.border,
                marginBottom: "20px",
              }}
            />

            <div
              style={{ display: "flex", gap: "64px", alignItems: "flex-start" }}
            >
              <div>
                <p
                  style={{
                    fontFamily: "Outfit, sans-serif",
                    fontSize: "9px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: T.muted,
                    marginBottom: "8px",
                  }}
                >
                  Total Articles
                </p>
                <p
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1.6rem",
                    color: T.cream,
                    letterSpacing: "-0.01em",
                    lineHeight: 1,
                  }}
                >
                  {isLoading ? "—" : pagination.total}
                </p>
              </div>

              <div>
                <p
                  style={{
                    fontFamily: "Outfit, sans-serif",
                    fontSize: "9px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: T.muted,
                    marginBottom: "8px",
                  }}
                >
                  Category
                </p>
                <p
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1.6rem",
                    color: T.cream,
                    letterSpacing: "-0.01em",
                    lineHeight: 1,
                  }}
                >
                  {activeCategory}
                </p>
              </div>

              <div>
                <p
                  style={{
                    fontFamily: "Outfit, sans-serif",
                    fontSize: "9px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: T.muted,
                    marginBottom: "8px",
                  }}
                >
                  Status
                </p>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#4ade80",
                      flexShrink: 0,
                    }}
                  />
                  <p
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "1.6rem",
                      color: "#4ade80",
                      letterSpacing: "-0.01em",
                      lineHeight: 1,
                    }}
                  >
                    Active
                  </p>
                </div>
              </div>

              <div>
                <p
                  style={{
                    fontFamily: "Outfit, sans-serif",
                    fontSize: "9px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: T.muted,
                    marginBottom: "8px",
                  }}
                >
                  Showing
                </p>
                <p
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1.6rem",
                    color: T.cream,
                    letterSpacing: "-0.01em",
                    lineHeight: 1,
                  }}
                >
                  {isLoading
                    ? "—"
                    : `${displayedArticles.length} / ${pagination.total}`}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          style={{ borderBottom: `1px solid ${T.border}`, padding: "0 80px" }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <CategoryTabs
              active={activeCategory}
              setActive={handleCategoryChange}
            />
          </div>
        </section>
        
        <section
          style={{
            padding: "0 80px 120px",
            maxWidth: "1280px",
            margin: "0 auto",
          }}
        >
          <div style={{ display: "flex", gap: "0", alignItems: "flex-start" }}>
            {/* ── Articles grid (left) ── */}
            <div
              style={{
                flex: 1,
                minWidth: 0,
                borderRight: `1px solid ${T.border}`,
              }}
            >
              {/* Column header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "18px 28px",
                  borderBottom: `1px solid ${T.border}`,
                }}
              >
                <p
                  style={{
                    fontFamily: "Outfit, sans-serif",
                    fontSize: "9px",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: T.muted,
                  }}
                >
                  Articles
                </p>
                {!isLoading && (
                  <p
                    style={{
                      fontFamily: "Outfit, sans-serif",
                      fontSize: "9px",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: T.muted,
                    }}
                  >
                    {displayedArticles.length} of {pagination.total}
                  </p>
                )}
              </div>

              {/* Loading state */}
              {isLoading ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                  }}
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} index={i} />
                  ))}
                </div>
              ) : filteredArticles.length === 0 ? (
                /* Empty state */
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "100px 40px",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      border: `1px solid ${T.border}`,
                      borderRadius: "2px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* Search icon */}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={T.muted}
                      strokeWidth="1.5"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                  </div>
                  <p
                    style={{
                      fontFamily: "Outfit, sans-serif",
                      fontSize: "9px",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: T.muted,
                    }}
                  >
                    No articles in this category
                  </p>
                </div>
              ) : (
                <>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                    }}
                  >
                    {displayedArticles.map((article, idx) => (
                      <ArticleCardWrapper
                        key={article._id || article.id || article.slug || idx}
                        article={article}
                        index={idx}
                        total={displayedArticles.length}
                      />
                    ))}
                  </div>

                  {/* Load more */}
                  {canLoadMore && (
                    <div
                      style={{
                        padding: "28px",
                        borderTop: `1px solid ${T.border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "Outfit, sans-serif",
                          fontSize: "9px",
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          color: T.muted,
                        }}
                      >
                        Showing {displayedArticles.length} of {pagination.total}
                      </p>
                      <button
                        onClick={() => setVisibleCount((prev) => prev + 10)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = T.borderHover;
                          e.currentTarget.style.color = T.cream;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = T.border;
                          e.currentTarget.style.color = T.muted;
                        }}
                        style={{
                          border: `1px solid ${T.border}`,
                          color: T.muted,
                          background: "transparent",
                          padding: "8px 20px",
                          borderRadius: "2px",
                          fontSize: "10px",
                          textTransform: "uppercase",
                          letterSpacing: "0.18em",
                          cursor: "pointer",
                          fontFamily: "Outfit, sans-serif",
                        }}
                      >
                        Load More
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ── Sidebar (right, fixed width) ── */}
            <aside style={{ width: "300px", flexShrink: 0 }}>
              {/* Sidebar header */}
              <div
                style={{
                  padding: "18px 28px",
                  borderBottom: `1px solid ${T.border}`,
                }}
              >
                <p
                  style={{
                    fontFamily: "Outfit, sans-serif",
                    fontSize: "9px",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: T.muted,
                  }}
                >
                  Resources
                </p>
              </div>

              {/* Sidebar content — sticky */}
              <div style={{ position: "sticky", top: "100px" }}>
                <KnowledgeBaseSidebar />
              </div>
            </aside>
          </div>
        </section>
      </main>

      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500&display=swap');

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.35; }
                    50%       { opacity: 0.6; }
                }
                * { box-sizing: border-box; }
                ::selection {
                    background: rgba(254,252,232,0.15);
                    color: #fefce8;
                }
            `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   ARTICLE CARD WRAPPER
   Wraps ArticleCard with the GoPwnIt card shell matching
   the icon-box + numbered-index pattern from the screenshot
   ─────────────────────────────────────────────────────────────── */
function ArticleCardWrapper({ article, index, total }) {
  const [hovered, setHovered] = useState(false);
  const isLastRow = index >= total - (total % 2 === 0 ? 2 : 1);
  const isRightCol = index % 2 !== 0;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? T.card : "transparent",
        borderRight: !isRightCol ? `1px solid ${T.border}` : "none",
        borderBottom: !isLastRow ? `1px solid ${T.border}` : "none",
        transition: "background 0.15s ease",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Numbered index (top-right) — like "01", "02" in screenshot */}
      <span
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "11px",
          letterSpacing: "0.1em",
          color: T.border,
          lineHeight: 1,
          userSelect: "none",
          tabularNums: "tabular-nums",
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Inner article card */}
      <ArticleCard article={article} />
    </div>
  );
}
