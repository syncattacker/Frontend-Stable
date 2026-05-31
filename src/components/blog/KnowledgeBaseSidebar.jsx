'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { blogApi } from '@/services/blogApi';

const T = {
    cream: "#fefce8", muted: "#a1a1aa",
    border: "rgba(254,252,232,0.12)", borderHover: "rgba(254,252,232,0.22)",
    card: "#111111", bg: "#000000",
};

const fmtDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase();

const KnowledgeBaseSidebar = () => {
    const router = useRouter();
    const [recentPosts, setRecentPosts] = useState([]);
    const [subHover, setSubHover] = useState(false);
    const [hoveredId, setHoveredId] = useState(null);

    useEffect(() => {
        blogApi.getRecentPosts(4)
            .then(data => setRecentPosts(data))
            .catch(err => console.error("Failed to fetch recent posts", err));
    }, []);

    const section = (label, children) => (
        <div style={{ border: `1px solid ${T.border}`, borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ padding: "12px 20px", borderBottom: `1px solid ${T.border}`, background: T.card }}>
                <p style={{ fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: T.muted, fontFamily: "Outfit, sans-serif" }}>
                    {label}
                </p>
            </div>
            {children}
        </div>
    );

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontFamily: "Outfit, sans-serif" }}>

            {section("Recent Intel",
                <>
                    {recentPosts.map((post, idx) => (
                        <div
                            key={post.id}
                            onClick={() => router.push(`/dashboard/blog/${post.slug}`)}
                            onMouseEnter={() => setHoveredId(post.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            style={{
                                padding: "14px 20px",
                                borderBottom: idx < recentPosts.length - 1 ? `1px solid ${T.border}` : "none",
                                cursor: "pointer",
                                background: hoveredId === post.id ? T.card : "transparent",
                            }}
                        >
                            <p style={{ fontSize: "12px", color: hoveredId === post.id ? T.cream : T.muted, lineHeight: 1.5, marginBottom: "5px" }}>
                                {post.title}
                            </p>
                            <span style={{ fontFamily: "monospace", fontSize: "9px", color: T.border }}>
                                {fmtDate(post.createdAt)}
                            </span>
                        </div>
                    ))}
                </>
            )}

            {section("Stay Ahead",
                <div style={{ padding: "16px 20px" }}>
                    <p style={{ fontSize: "12px", color: T.muted, lineHeight: 1.7, marginBottom: "14px" }}>
                        Join 10k+ researchers receiving weekly exploitation deep dives.
                    </p>
                    <button
                        onMouseEnter={() => setSubHover(true)}
                        onMouseLeave={() => setSubHover(false)}
                        style={{
                            width: "100%", padding: "10px 16px",
                            background: T.cream, color: T.bg,
                            border: "none", borderRadius: "2px",
                            fontSize: "10px", textTransform: "uppercase",
                            letterSpacing: "0.18em", cursor: "pointer",
                            fontFamily: "Outfit, sans-serif", fontWeight: 500,
                            opacity: subHover ? 0.85 : 1,
                        }}
                    >
                        Subscribe to Brief
                    </button>
                </div>
            )}

        </div>
    );
};

export default KnowledgeBaseSidebar;