'use client';

import React, { useState } from 'react';

const T = { cream: "#fefce8", muted: "#a1a1aa", border: "rgba(254,252,232,0.12)" };
const navItems = ["All", "Technical", "Tutorials", "Updates", "Career"];

const KnowledgeBaseCategories = ({ activeTab, setActiveTab }) => {
    const [hovered, setHovered] = useState(null);

    return (
        <div style={{ display: "flex", overflowX: "auto" }}>
            {navItems.map((item) => {
                const isActive = activeTab === item;
                return (
                    <button
                        key={item}
                        onClick={() => setActiveTab(item)}
                        onMouseEnter={() => setHovered(item)}
                        onMouseLeave={() => setHovered(null)}
                        style={{
                            padding: "16px 20px",
                            background: "transparent",
                            border: "none",
                            borderBottom: `1px solid ${isActive ? T.cream : "transparent"}`,
                            color: isActive ? T.cream : hovered === item ? T.cream : T.muted,
                            fontFamily: "Outfit, sans-serif",
                            fontSize: "10px",
                            textTransform: "uppercase",
                            letterSpacing: "0.18em",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                        }}
                    >
                        {item}
                    </button>
                );
            })}
        </div>
    );
};

export default KnowledgeBaseCategories;