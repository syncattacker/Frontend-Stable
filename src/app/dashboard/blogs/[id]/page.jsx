'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/footer/Footer';
import { blogApi } from '@/services/blogApi';
import ArticleCard from '@/components/blog/ArticleCard';
import { useSelector } from 'react-redux';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

/* ─── design tokens ──────────────────────────────────────────── */
const T = {
    bg:          "#000000",
    cream:       "#fefce8",
    muted:       "#a1a1aa",
    border:      "rgba(254,252,232,0.12)",
    borderHover: "rgba(254,252,232,0.22)",
    card:        "#111111",
    inputBg:     "#0f0f0f",
};

/* ─── Spinner ────────────────────────────────────────────────── */
const Spinner = ({ size = 28 }) => (
    <div style={{
        width: size, height: size, borderRadius: "50%",
        border: `1.5px solid ${T.border}`,
        borderTop: `1.5px solid ${T.cream}`,
        animation: "spin 0.75s linear infinite",
        flexShrink: 0,
    }} />
);

/* ─── Icon: ArrowLeft ────────────────────────────────────────── */
const ArrowLeftIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M19 12H5M12 5l-7 7 7 7"/>
    </svg>
);

/* ─── Icon: Trash ────────────────────────────────────────────── */
const TrashIcon = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
        <path d="M10 11v6M14 11v6"/>
        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
    </svg>
);

/* ════════════════════════════════════════════════════════════════
   PAGE
════════════════════════════════════════════════════════════════ */
export default function ArticleDetailPage() {
    const { id }   = useParams();
    const router   = useRouter();

    const [article,         setArticle]         = useState(null);
    const [relatedArticles, setRelatedArticles] = useState([]);
    const [error,           setError]           = useState(false);
    const [isLoading,       setIsLoading]       = useState(true);
    const [isDeleting,      setIsDeleting]      = useState(false);

    const { user: currentUser } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const data = await blogApi.getBlogBySlug(id);
                setArticle(data);

                if (data.author) {
                    const response = await blogApi.getAllBlogs(1, 10);
                    const related  = response.data
                        .filter(a => a.author?._id === data.author?._id && a.slug !== data.slug)
                        .slice(0, 2);
                    setRelatedArticles(related);
                }
            } catch (err) {
                console.error("Article not found:", err);
                setError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticle();
        window.scrollTo(0, 0);
    }, [id]);

    const isAuthor = currentUser && article && (() => {
        if (currentUser.role === 'creator' || currentUser.isCreator) return true;
        const currentId  = (currentUser._id || currentUser.id || '').toString();
        const authorId   = (article.author?._id || (typeof article.author === 'string' ? article.author : '')).toString();
        const authorUser = article.author?.username;
        return (
            (currentId && authorId && currentId === authorId) ||
            (currentUser.username && authorUser && currentUser.username === authorUser)
        );
    })();

    const handleDelete = async () => {
        if (!window.confirm("Delete this article? This cannot be undone.")) return;
        setIsDeleting(true);
        try {
            await blogApi.deleteBlog(article.slug);
            router.push('/dashboard/blogs');
        } catch (err) {
            console.error("Failed to delete article:", err);
            alert("Failed to delete the article. Please try again.");
            setIsDeleting(false);
        }
    };

    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
        }).toUpperCase();

    const authorName = article?.author?.username
        || article?.author?.name
        || (typeof article?.author === 'string' ? article.author : null)
        || "Author";

    /* ── Error ─────────────────────────────────────────────── */
    if (error) {
        return (
            <div style={{ background: T.bg, minHeight: "100vh", fontFamily: "Outfit, sans-serif", color: T.cream }}>
                <Navbar />
                <div style={{
                    maxWidth: "520px",
                    margin: "160px auto 0",
                    padding: "48px",
                    border: `1px solid ${T.border}`,
                    borderRadius: "2px",
                    textAlign: "left",
                }}>
                    <p style={{ fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: T.muted, marginBottom: "20px" }}>
                        GoPwnIt / Knowledge Base / Error
                    </p>

                    <h1 style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "clamp(2.5rem, 6vw, 3.5rem)",
                        letterSpacing: "-0.03em",
                        color: T.cream,
                        marginBottom: "20px",
                        lineHeight: 0.95,
                        textTransform: "uppercase",
                    }}>
                        Article<br />Not Found
                    </h1>

                    <div style={{ width: "100%", height: "1px", background: T.border, marginBottom: "28px" }} />

                    <p style={{ fontSize: "14px", color: T.muted, lineHeight: 1.65, marginBottom: "36px" }}>
                        The requested article could not be retrieved. It may have been removed or the link is incorrect.
                    </p>

                    <GhostButton onClick={() => router.push('/dashboard/blogs')}>
                        <ArrowLeftIcon />
                        Back to Knowledge Base
                    </GhostButton>
                </div>
                <GlobalStyles />
            </div>
        );
    }

    /* ── Loading ───────────────────────────────────────────── */
    if (isLoading || !article) {
        return (
            <div style={{
                background: T.bg, minHeight: "100vh",
                fontFamily: "Outfit, sans-serif", color: T.cream,
                display: "flex", flexDirection: "column",
            }}>
                <Navbar />
                <div style={{
                    flex: 1, display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: "20px",
                }}>
                    <Spinner size={28} />
                    <p style={{
                        fontSize: "9px", letterSpacing: "0.22em",
                        textTransform: "uppercase", color: T.muted,
                    }}>
                        Loading article...
                    </p>
                </div>
                <GlobalStyles />
            </div>
        );
    }

    /* ── Main page ─────────────────────────────────────────── */
    return (
        <div style={{ background: T.bg, minHeight: "100vh", color: T.cream, fontFamily: "Outfit, sans-serif" }}>

            <Navbar />

            <main style={{ paddingTop: "80px" }}>

                {/* ════════════════════════════════════════
                    HEADER — breadcrumb + nav controls
                ════════════════════════════════════════ */}
                <div style={{
                    padding: "20px 80px",
                    borderBottom: `1px solid ${T.border}`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}>
                    {/* Back link */}
                    <button
                        onClick={() => router.push('/dashboard/blogs')}
                        onMouseEnter={e => e.currentTarget.style.color = T.cream}
                        onMouseLeave={e => e.currentTarget.style.color = T.muted}
                        style={{
                            display: "flex", alignItems: "center", gap: "8px",
                            color: T.muted, background: "transparent", border: "none",
                            fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.18em",
                            cursor: "pointer", fontFamily: "Outfit, sans-serif",
                        }}
                    >
                        <ArrowLeftIcon />
                        Knowledge Base
                    </button>

                    {/* Breadcrumb path (center) */}
                    <p style={{
                        fontSize: "9px", letterSpacing: "0.22em",
                        textTransform: "uppercase", color: T.muted,
                        position: "absolute", left: "50%", transform: "translateX(-50%)",
                    }}>
                        GoPwnIt / Knowledge Base / Article
                    </p>

                    {/* Delete */}
                    {isAuthor && (
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = "rgba(239,68,68,0.5)";
                                e.currentTarget.style.color = "#f87171";
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = "rgba(239,68,68,0.25)";
                                e.currentTarget.style.color = "rgba(239,68,68,0.7)";
                            }}
                            style={{
                                display: "flex", alignItems: "center", gap: "7px",
                                border: "1px solid rgba(239,68,68,0.25)",
                                color: "rgba(239,68,68,0.7)",
                                background: "transparent",
                                padding: "6px 14px", borderRadius: "2px",
                                fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.18em",
                                cursor: isDeleting ? "not-allowed" : "pointer",
                                fontFamily: "Outfit, sans-serif",
                                opacity: isDeleting ? 0.5 : 1,
                            }}
                        >
                            {isDeleting
                                ? <><Spinner size={11} /> Deleting...</>
                                : <><TrashIcon /> Delete</>
                            }
                        </button>
                    )}
                </div>


                {/* ════════════════════════════════════════
                    HERO — article title & meta
                    Mirrors: Privacy Protocol hero pattern
                ════════════════════════════════════════ */}
                <section style={{
                    padding: "72px 80px 64px",
                    borderBottom: `1px solid ${T.border}`,
                    maxWidth: "1280px",
                    margin: "0 auto",
                }}>

                    {/* Category badge */}
                    {article.category && (
                        <div style={{ marginBottom: "28px" }}>
                            <span style={{
                                display: "inline-block",
                                border: `1px solid ${T.borderHover}`,
                                color: T.muted,
                                padding: "4px 10px",
                                borderRadius: "2px",
                                fontSize: "9px",
                                textTransform: "uppercase",
                                letterSpacing: "0.2em",
                                fontFamily: "Outfit, sans-serif",
                            }}>
                                {article.category}
                            </span>
                        </div>
                    )}

                    {/* Bebas Neue title */}
                    <h1 style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: "clamp(3rem, 7vw, 5.5rem)",
                        letterSpacing: "-0.03em",
                        lineHeight: 0.93,
                        color: T.cream,
                        textTransform: "uppercase",
                        marginBottom: "40px",
                        maxWidth: "900px",
                    }}>
                        {article.title}
                    </h1>

                    {/* Subtitle/excerpt if available */}
                    {article.excerpt && (
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "48px" }}>
                            <div style={{ width: "24px", height: "1px", background: T.cream, marginTop: "10px", flexShrink: 0 }} />
                            <p style={{ fontSize: "14px", color: T.muted, lineHeight: 1.65, maxWidth: "600px" }}>
                                {article.excerpt}
                            </p>
                        </div>
                    )}

                    {/* Divider */}
                    <div style={{ width: "100%", height: "1px", background: T.border, marginBottom: "40px" }} />

                    {/* Meta info row — PUBLISHED / AUTHOR / READING TIME */}
                    <div style={{ display: "flex", gap: "64px", alignItems: "flex-start", flexWrap: "wrap" }}>

                        <div>
                            <p style={{ fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: T.muted, marginBottom: "8px" }}>
                                Published
                            </p>
                            <p style={{ fontFamily: "monospace", fontSize: "13px", color: T.cream, lineHeight: 1 }}>
                                {formatDate(article.createdAt)}
                            </p>
                        </div>

                        <div>
                            <p style={{ fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: T.muted, marginBottom: "8px" }}>
                                Author
                            </p>
                            <p style={{ fontFamily: "monospace", fontSize: "13px", color: T.cream, lineHeight: 1 }}>
                                {authorName.toUpperCase()}
                            </p>
                        </div>

                        {article.category && (
                            <div>
                                <p style={{ fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: T.muted, marginBottom: "8px" }}>
                                    Category
                                </p>
                                <p style={{ fontFamily: "monospace", fontSize: "13px", color: T.cream, lineHeight: 1 }}>
                                    {article.category.toUpperCase()}
                                </p>
                            </div>
                        )}

                    </div>
                </section>


                {/* ════════════════════════════════════════
                    COVER IMAGE
                ════════════════════════════════════════ */}
                {(article.coverImage || article.image) && (
                    <div style={{
                        maxWidth: "1280px",
                        margin: "0 auto",
                        padding: "0 80px",
                        borderBottom: `1px solid ${T.border}`,
                    }}>
                        <div style={{
                            border: `1px solid ${T.border}`,
                            borderRadius: "2px",
                            overflow: "hidden",
                            margin: "48px 0",
                        }}>
                            <img
                                src={article.coverImage || article.image}
                                alt={article.title}
                                style={{ width: "100%", height: "auto", maxHeight: "560px", objectFit: "cover", display: "block" }}
                            />
                        </div>
                    </div>
                )}


                {/* ════════════════════════════════════════
                    ARTICLE CONTENT
                ════════════════════════════════════════ */}
                <section style={{
                    maxWidth: "1280px",
                    margin: "0 auto",
                    padding: "64px 80px",
                    display: "flex",
                    gap: "80px",
                    alignItems: "flex-start",
                    borderBottom: `1px solid ${T.border}`,
                }}>

                    {/* Content body (left, ~70%) */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <ContentRenderer content={article.content} />
                    </div>

                    {/* Sticky article index (right, ~260px) */}
                    <aside style={{ width: "240px", flexShrink: 0, position: "sticky", top: "100px" }}>
                        <div style={{
                            border: `1px solid ${T.border}`,
                            borderRadius: "2px",
                            overflow: "hidden",
                        }}>
                            <div style={{
                                padding: "12px 16px",
                                borderBottom: `1px solid ${T.border}`,
                                background: T.card,
                            }}>
                                <p style={{ fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: T.muted }}>
                                    Article Info
                                </p>
                            </div>

                            {[
                                { label: "Author",    value: authorName.toUpperCase(), mono: true },
                                { label: "Published", value: formatDate(article.createdAt), mono: true },
                                { label: "Category",  value: article.category || "—",   mono: false },
                            ].map((row, i, arr) => (
                                <div key={row.label} style={{
                                    padding: "14px 16px",
                                    borderBottom: i < arr.length - 1 ? `1px solid ${T.border}` : "none",
                                }}>
                                    <p style={{ fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: T.muted, marginBottom: "5px" }}>
                                        {row.label}
                                    </p>
                                    <p style={{
                                        fontSize: "11px",
                                        fontFamily: row.mono ? "monospace" : "Outfit, sans-serif",
                                        color: T.cream,
                                        lineHeight: 1.4,
                                        wordBreak: "break-word",
                                    }}>
                                        {row.value}
                                    </p>
                                </div>
                            ))}

                            {/* Delete — compact danger in sidebar if author */}
                            {isAuthor && (
                                <div style={{ padding: "14px 16px", borderTop: `1px solid ${T.border}` }}>
                                    <button
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.borderColor = "rgba(239,68,68,0.5)";
                                            e.currentTarget.style.color = "#f87171";
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.borderColor = "rgba(239,68,68,0.25)";
                                            e.currentTarget.style.color = "rgba(239,68,68,0.7)";
                                        }}
                                        style={{
                                            width: "100%",
                                            display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
                                            border: "1px solid rgba(239,68,68,0.25)",
                                            color: "rgba(239,68,68,0.7)",
                                            background: "transparent",
                                            padding: "8px 14px", borderRadius: "2px",
                                            fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.18em",
                                            cursor: isDeleting ? "not-allowed" : "pointer",
                                            fontFamily: "Outfit, sans-serif",
                                        }}
                                    >
                                        {isDeleting ? <><Spinner size={10} />Deleting</> : <><TrashIcon />Delete</>}
                                    </button>
                                </div>
                            )}
                        </div>
                    </aside>

                </section>


                {/* ════════════════════════════════════════
                    RELATED ARTICLES
                ════════════════════════════════════════ */}
                <section style={{
                    maxWidth: "1280px",
                    margin: "0 auto",
                    padding: "0 80px 120px",
                }}>

                    {/* Section header */}
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "18px 0",
                        borderBottom: `1px solid ${T.border}`,
                        marginBottom: "0",
                    }}>
                        <p style={{ fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: T.muted }}>
                            More by {authorName.toUpperCase()}
                        </p>
                        <p style={{ fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: T.muted }}>
                            {relatedArticles.length} article{relatedArticles.length !== 1 ? "s" : ""}
                        </p>
                    </div>

                    {relatedArticles.length > 0 ? (
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(2, 1fr)",
                            border: `1px solid ${T.border}`,
                            borderTop: "none",
                        }}>
                            {relatedArticles.map((rel, idx) => (
                                <RelatedCard
                                    key={rel.id}
                                    article={rel}
                                    index={idx}
                                    total={relatedArticles.length}
                                    onClick={() => router.push(`/blogs/${rel.slug}`)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div style={{
                            padding: "48px 0",
                            borderBottom: `1px solid ${T.border}`,
                        }}>
                            <p style={{ fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: T.muted }}>
                                No other articles by this author.
                            </p>
                        </div>
                    )}
                </section>

            </main>

            <Footer />
            <GlobalStyles />
        </div>
    );
}


/* ─── Ghost button ───────────────────────────────────────────── */
function GhostButton({ onClick, children }) {
    return (
        <button
            onClick={onClick}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = T.borderHover;
                e.currentTarget.style.color = T.cream;
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = T.border;
                e.currentTarget.style.color = T.muted;
            }}
            style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                border: `1px solid ${T.border}`, color: T.muted,
                background: "transparent", padding: "10px 20px", borderRadius: "2px",
                fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.18em",
                cursor: "pointer", fontFamily: "Outfit, sans-serif",
            }}
        >
            {children}
        </button>
    );
}


/* ─── Related article card wrapper ───────────────────────────── */
function RelatedCard({ article, index, total, onClick }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                cursor: "pointer",
                background: hovered ? T.card : "transparent",
                borderRight: index % 2 === 0 && total > 1 ? `1px solid ${T.border}` : "none",
                transition: "background 0.15s ease",
                position: "relative",
            }}
        >
            <span style={{
                position: "absolute", top: "16px", right: "16px",
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "11px", letterSpacing: "0.1em",
                color: T.border, lineHeight: 1, userSelect: "none",
            }}>
                {String(index + 1).padStart(2, "0")}
            </span>
            <ArticleCard article={article} />
        </div>
    );
}


/* ─── Content renderer ───────────────────────────────────────── */
const ContentRenderer = ({ content }) => {
    const isJson = typeof content === 'string' && (content.startsWith('{') || content.startsWith('['));

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({ HTMLAttributes: { style: "max-width:100%;border:1px solid rgba(254,252,232,0.12);border-radius:2px;margin:24px 0;display:block;" } }),
        ],
        content: (() => {
            if (isJson) { try { return JSON.parse(content); } catch { return content; } }
            return content;
        })(),
        editable: false,
        editorProps: {
            attributes: { class: "gopwnit-prose focus:outline-none" },
        },
    });

    if (!isJson) {
        return (
            <article
                className="gopwnit-prose"
                dangerouslySetInnerHTML={{ __html: content || '<p>Content missing or failed to load.</p>' }}
            />
        );
    }

    return <EditorContent editor={editor} />;
};


/* ─── Global styles ──────────────────────────────────────────── */
function GlobalStyles() {
    return (
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500&display=swap');

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            * { box-sizing: border-box; }

            ::selection {
                background: rgba(254,252,232,0.12);
                color: #fefce8;
            }

            /* ── Article prose — GoPwnIt cream/muted palette ── */
            .gopwnit-prose {
                font-family: Outfit, sans-serif;
                font-size: 15px;
                line-height: 1.75;
                color: ${T.muted};
                max-width: none;
                margin-bottom: 0;
            }
            .gopwnit-prose h1,
            .gopwnit-prose h2,
            .gopwnit-prose h3,
            .gopwnit-prose h4 {
                font-family: 'Bebas Neue', sans-serif;
                letter-spacing: -0.02em;
                color: ${T.cream};
                text-transform: uppercase;
                line-height: 1;
                margin: 48px 0 20px;
            }
            .gopwnit-prose h1 { font-size: 2.8rem; }
            .gopwnit-prose h2 { font-size: 2.2rem; }
            .gopwnit-prose h3 { font-size: 1.8rem; }
            .gopwnit-prose h4 { font-size: 1.4rem; }
            .gopwnit-prose p  { margin: 0 0 20px; }
            .gopwnit-prose a  { color: ${T.cream}; text-underline-offset: 3px; }
            .gopwnit-prose strong { color: ${T.cream}; font-weight: 500; }
            .gopwnit-prose em     { font-style: italic; }
            .gopwnit-prose ul,
            .gopwnit-prose ol {
                padding-left: 20px;
                margin: 0 0 20px;
                display: flex;
                flex-direction: column;
                gap: 6px;
            }
            .gopwnit-prose li::marker { color: ${T.muted}; }
            .gopwnit-prose blockquote {
                border-left: 1px solid ${T.borderHover};
                margin: 28px 0;
                padding: 12px 20px;
                color: ${T.muted};
                font-style: italic;
            }
            .gopwnit-prose code {
                font-family: monospace;
                font-size: 12px;
                background: ${T.card};
                border: 1px solid ${T.border};
                border-radius: 2px;
                padding: 2px 6px;
                color: ${T.cream};
            }
            .gopwnit-prose pre {
                background: ${T.card};
                border: 1px solid ${T.border};
                border-radius: 2px;
                padding: 20px 24px;
                overflow-x: auto;
                margin: 24px 0;
            }
            .gopwnit-prose pre code {
                background: none;
                border: none;
                padding: 0;
                font-size: 13px;
            }
            .gopwnit-prose hr {
                border: none;
                border-top: 1px solid ${T.border};
                margin: 40px 0;
            }
            .gopwnit-prose img {
                max-width: 100%;
                border: 1px solid ${T.border};
                border-radius: 2px;
                display: block;
                margin: 24px 0;
            }
        `}</style>
    );
}