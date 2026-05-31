'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { blogApi } from '@/services/blogApi';

/* ─── design tokens ──────────────────────────────────────────── */
const T = {
    bg:          "#000000",
    cream:       "#fefce8",
    muted:       "#a1a1aa",
    border:      "rgba(254,252,232,0.12)",
    borderHover: "rgba(254,252,232,0.22)",
    card:        "#111111",
};

/* ─── Spinner ────────────────────────────────────────────────── */
const Spinner = ({ size = 11 }) => (
    <div style={{
        width: size, height: size, borderRadius: "50%",
        border: "1.5px solid rgba(254,252,232,0.12)",
        borderTop: "1.5px solid #fefce8",
        animation: "gpw-spin 0.75s linear infinite",
        flexShrink: 0,
    }} />
);

/* ─── Icons ──────────────────────────────────────────────────── */
const ArticleIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
    </svg>
);

const TrashIcon = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
        <path d="M10 11v6M14 11v6"/>
        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
    </svg>
);

const ArrowIcon = () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
);

/* ─── Helpers ────────────────────────────────────────────────── */
const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
    }).toUpperCase();

/* ════════════════════════════════════════════════════════════════
   ARTICLE CARD
   Matches the Privacy Protocol card pattern from the screenshot:
   icon-box (top-left) · category badge · title · description ·
   bottom bar: author + "READ ARTICLE →"
════════════════════════════════════════════════════════════════ */
const ArticleCard = ({ article }) => {
    const router       = useRouter();
    const { user: currentUser } = useSelector((state) => state.auth);

    const [isDeleting,  setIsDeleting]  = useState(false);
    const [delHover,    setDelHover]    = useState(false);
    const [arrowHover,  setArrowHover]  = useState(false);

    /* ── isAuthor check ──────────────────────────────────────── */
    const isAuthor = currentUser && article && (() => {
        if (currentUser.role === 'creator' || currentUser.isCreator) return true;
        const cId  = (currentUser._id || currentUser.id || '').toString();
        const aId  = (article.author?._id || (typeof article.author === 'string' ? article.author : '')).toString();
        const aUsr = article.author?.username;
        return (
            (cId && aId && cId === aId) ||
            (currentUser.username && aUsr && currentUser.username === aUsr)
        );
    })();

    /* ── delete ──────────────────────────────────────────────── */
    const handleDelete = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!window.confirm("Delete this article? This cannot be undone.")) return;
        setIsDeleting(true);
        try {
            await blogApi.deleteBlog(article.slug);
            router.refresh();
        } catch (err) {
            console.error("Failed to delete article:", err);
            alert("Failed to delete the article.");
            setIsDeleting(false);
        }
    };

    const authorName = (
        article.author?.username ||
        article.author?.name ||
        (typeof article.author === 'string' ? article.author : null) ||
        "Author"
    ).toUpperCase();

    /* ── render ──────────────────────────────────────────────── */
    return (
        <>
            <Link
                href={`/dashboard/blogs/${article.slug}`}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "24px 28px 20px",
                    height: "100%",
                    minHeight: "220px",
                    textDecoration: "none",
                    color: "inherit",
                    position: "relative",
                }}
            >
                {/* ── Row 1: icon box · category badge · delete ── */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "20px",
                }}>

                    {/* Icon box — matches bordered icon squares in screenshot */}
                    <div style={{
                        width: "36px",
                        height: "36px",
                        border: `1px solid ${T.border}`,
                        borderRadius: "2px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: T.muted,
                        flexShrink: 0,
                        background: T.card,
                    }}>
                        <ArticleIcon />
                    </div>

                    {/* Right cluster: badge + delete */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>

                        {/* Category status badge — border + text, NO fill */}
                        {article.category && (
                            <span style={{
                                border: `1px solid ${T.border}`,
                                color: T.muted,
                                padding: "3px 8px",
                                borderRadius: "2px",
                                fontSize: "9px",
                                textTransform: "uppercase",
                                letterSpacing: "0.2em",
                                fontFamily: "Outfit, sans-serif",
                                whiteSpace: "nowrap",
                            }}>
                                {article.category}
                            </span>
                        )}

                        {/* Delete button — danger pattern */}
                        {isAuthor && (
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                onMouseEnter={() => setDelHover(true)}
                                onMouseLeave={() => setDelHover(false)}
                                title="Delete article"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "28px",
                                    height: "28px",
                                    border: `1px solid ${delHover ? "rgba(239,68,68,0.5)" : "rgba(239,68,68,0.22)"}`,
                                    borderRadius: "2px",
                                    color: delHover ? "#f87171" : "rgba(239,68,68,0.5)",
                                    background: "transparent",
                                    cursor: isDeleting ? "not-allowed" : "pointer",
                                    flexShrink: 0,
                                    padding: 0,
                                }}
                            >
                                {isDeleting ? <Spinner size={10} /> : <TrashIcon />}
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Title ─────────────────────────────────────── */}
                <h3 style={{
                    fontFamily: "Outfit, sans-serif",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: T.cream,
                    lineHeight: 1.45,
                    marginBottom: "10px",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                }}>
                    {article.title}
                </h3>

                {/* ── Description ───────────────────────────────── */}
                <p style={{
                    fontFamily: "Outfit, sans-serif",
                    fontSize: "12px",
                    color: T.muted,
                    lineHeight: 1.7,
                    flex: 1,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    marginBottom: "20px",
                }}>
                    {article.description || "Insights and technical deep-dives from the GoPwnIt ecosystem."}
                </p>

                {/* ── Bottom bar — matches "READ PROTOCOL →" in screenshot ── */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: "14px",
                    borderTop: `1px solid ${T.border}`,
                    marginTop: "auto",
                }}>

                    {/* Author + date (left) */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span style={{
                            fontFamily: "monospace",
                            fontSize: "10px",
                            color: T.muted,
                            letterSpacing: "0.04em",
                            lineHeight: 1,
                        }}>
                            {authorName}
                        </span>
                        <span style={{
                            fontFamily: "monospace",
                            fontSize: "9px",
                            color: "rgba(254,252,232,0.25)",
                            letterSpacing: "0.04em",
                            lineHeight: 1,
                        }}>
                            {formatDate(article.createdAt)}
                        </span>
                    </div>

                    {/* "READ ARTICLE" text + arrow box (right) */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{
                            fontFamily: "Outfit, sans-serif",
                            fontSize: "9px",
                            textTransform: "uppercase",
                            letterSpacing: "0.22em",
                            color: T.muted,
                            whiteSpace: "nowrap",
                        }}>
                            Read Article
                        </span>

                        {/* Bordered arrow box — exact match of → box in screenshot */}
                        <div
                            onMouseEnter={() => setArrowHover(true)}
                            onMouseLeave={() => setArrowHover(false)}
                            style={{
                                width: "26px",
                                height: "26px",
                                border: `1px solid ${arrowHover ? T.borderHover : T.border}`,
                                borderRadius: "2px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: arrowHover ? T.cream : T.muted,
                                flexShrink: 0,
                            }}
                        >
                            <ArrowIcon />
                        </div>
                    </div>
                </div>
            </Link>

            <style>{`
                @keyframes gpw-spin { to { transform: rotate(360deg); } }
            `}</style>
        </>
    );
};

export default ArticleCard;