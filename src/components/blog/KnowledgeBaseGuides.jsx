'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const T = { cream: "#fefce8", muted: "#a1a1aa", border: "rgba(254,252,232,0.12)", borderHover: "rgba(254,252,232,0.22)", card: "#111111", bg: "#000000" };

const GuideItem = ({ guide, borderLeft }) => {
    const router = useRouter();
    const [hovered, setHovered] = useState(false);

    return (
        <div
            onClick={() => router.push(`/dashboard/blog/${guide.id}`)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                padding: "32px 28px",
                borderBottom: `1px solid ${T.border}`,
                borderLeft: borderLeft ? `1px solid ${T.border}` : "none",
                background: hovered ? T.card : "transparent",
                cursor: "pointer",
            }}
        >
            <p style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "0.12em", color: T.muted, textTransform: "uppercase", marginBottom: "12px" }}>
                {guide.date} · {guide.category}
            </p>
            <h3 style={{ fontFamily: "Outfit, sans-serif", fontSize: "14px", color: hovered ? T.cream : T.muted, lineHeight: 1.5, fontWeight: 400 }}>
                {guide.title}
            </h3>
        </div>
    );
};

const KnowledgeBaseGuides = ({ guides }) => (
    <div style={{ borderTop: `1px solid ${T.border}`, marginTop: "64px" }}>

        {/* Header */}
        <div style={{ padding: "48px 28px 40px" }}>
            <div style={{ position: "relative", display: "inline-block", border: `1px solid ${T.border}`, padding: "10px 24px" }}>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", color: T.cream, letterSpacing: "-0.02em", lineHeight: 1 }}>
                    Guides
                </h2>
                {/* Corner cuts */}
                <div style={{ position: "absolute", top: -1, left: -1, width: 12, height: 12, background: T.bg, borderBottom: `1px solid ${T.border}`, borderRight: `1px solid ${T.border}` }} />
                <div style={{ position: "absolute", bottom: -1, right: -1, width: 12, height: 12, background: T.bg, borderTop: `1px solid ${T.border}`, borderLeft: `1px solid ${T.border}` }} />
            </div>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", borderTop: `1px solid ${T.border}` }}>

            {/* Sidebar label */}
            <div style={{ borderRight: `1px solid ${T.border}`, padding: "28px" }}>
                <p style={{ fontFamily: "Outfit, sans-serif", fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: T.muted }}>
                    Learn with us
                </p>
            </div>

            {/* Guides list */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}>
                {guides.map((guide, idx) => (
                    <GuideItem key={guide.id} guide={guide} borderLeft={idx % 2 !== 0} />
                ))}
            </div>
        </div>

        <div style={{ height: "1px", background: T.border }} />
    </div>
);

export default KnowledgeBaseGuides;