'use client';

import React from 'react';

const T = { cream: "#fefce8", muted: "#a1a1aa", border: "rgba(254,252,232,0.12)" };

const KnowledgeBaseHeader = () => (
    <div style={{ padding: "72px 80px 64px", borderBottom: `1px solid ${T.border}`, fontFamily: "Outfit, sans-serif" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>

            {/* Eyebrow */}
            <p style={{ fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: T.muted, marginBottom: "28px" }}>
                Vol. 01 · Resource Hub
            </p>

            {/* Title */}
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3.5rem, 8vw, 6.5rem)", letterSpacing: "-0.03em", lineHeight: 0.92, color: T.cream, textTransform: "uppercase", marginBottom: "32px" }}>
                Intelligence<br />Briefings
            </h1>

            {/* Subtitle */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                <div style={{ width: "24px", height: "1px", background: T.cream, marginTop: "10px", flexShrink: 0 }} />
                <p style={{ fontSize: "14px", color: T.muted, lineHeight: 1.65, maxWidth: "480px" }}>
                    Deep dives into the adversarial mindset. Master exploitation, defensive architecture, and modern threat landscapes.
                </p>
            </div>

        </div>
    </div>
);

export default KnowledgeBaseHeader;