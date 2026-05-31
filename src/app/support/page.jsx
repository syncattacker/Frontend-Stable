"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  IconMessageCircle,
  IconCircleCheck,
  IconFileText,
  IconCamera,
  IconArrowRight,
  IconMail,
  IconShield,
  IconClock,
  IconAlertTriangle,
} from "@tabler/icons-react";
import Navbar from "@/components/navbar/Navbar";

// ─── THEME ────────────────────────────────────────────────────────────────────
const T = {
  bg: "#0A0A0A",
  cream: "#fefce8",
  muted: "#a1a1aa",
  border: "rgba(254,252,232,0.08)",
  borderHover: "rgba(254,252,232,0.18)",
};

if (typeof document !== "undefined" && !document.getElementById("sp-styles")) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap";
  document.head.appendChild(link);

  const style = document.createElement("style");
  style.id = "sp-styles";
  style.textContent = `
    .sp-bebas  { font-family: 'Bebas Neue', sans-serif; letter-spacing: -0.02em; }
    .sp-roundo { font-family: 'DM Sans', sans-serif; }
    .sp-body   { font-family: 'Outfit', sans-serif; }

    .sp-tag {
      font-family: 'DM Sans', sans-serif;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: rgba(254,252,232,0.3);
    }

    .sp-card {
      background: rgba(254,252,232,0.02);
      border: 1px solid rgba(254,252,232,0.08);
      transition: background 0.2s, border-color 0.2s;
    }
    .sp-card:hover {
      background: rgba(254,252,232,0.04);
      border-color: rgba(254,252,232,0.16);
    }

    .sp-btn-ghost {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: 'DM Sans', sans-serif;
      font-size: 12px;
      font-weight: 700;
      background: rgba(254,252,232,0.04);
      border: 1px solid rgba(254,252,232,0.1);
      color: rgba(254,252,232,0.7);
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
    }
    .sp-btn-ghost:hover {
      background: rgba(254,252,232,0.08);
      border-color: rgba(254,252,232,0.2);
      color: #fefce8;
    }

    .sp-link {
      font-family: 'DM Sans', sans-serif;
      font-size: 11px;
      font-weight: 600;
      color: rgba(254,252,232,0.35);
      text-decoration: none;
      transition: color 0.15s;
      letter-spacing: 0.04em;
    }
    .sp-link:hover { color: #fefce8; }

    .sp-divider { border: none; border-top: 1px solid rgba(254,252,232,0.06); }
  `;
  document.head.appendChild(style);
}

const steps = [
  {
    number: "01",
    title: "Join Our Discord",
    icon: IconMessageCircle,
    description: "Connect with our community and access real-time support channels.",
    details: [
      "Click the link to join our official Discord server",
      "Verify your account to access all channels",
      "Introduce yourself in #general",
    ],
    link: { href: "https://discord.com/invite/4Mb6xXce8q", label: "Join Discord Server" },
  },
  {
    number: "02",
    title: "Open a Ticket",
    icon: IconFileText,
    description: "Navigate to the dedicated support section and create a ticket.",
    details: [
      "Locate the Support category in the server",
      "Click to open or create a new ticket",
      "Select the appropriate issue type",
    ],
  },
  {
    number: "03",
    title: "Describe Your Issue",
    icon: IconCircleCheck,
    description: "Provide clear, detailed information so our team can help you fast.",
    details: [
      "Describe the issue clearly and concisely",
      "Include steps to reproduce the problem",
      "Provide your registered username or email",
    ],
  },
  {
    number: "04",
    title: "Submit Evidence",
    icon: IconCamera,
    description: "Attach screenshots or recordings for faster resolution.",
    details: [
      "Ensure evidence is clear and readable",
      "Mask any sensitive personal data",
      "Verify accuracy before submitting",
    ],
  },
];

const responsibilities = [
  "Submit only one ticket per issue to avoid duplicates",
  "Maintain professional and respectful communication",
  "Provide accurate and complete information",
  "Respond promptly to follow-up questions",
  "Update the ticket if the issue is resolved",
];

const infoCards = [
  {
    icon: IconClock,
    title: "Response Time",
    content: "Support requests are reviewed based on priority and complexity. Response times may vary depending on current workload.",
  },
  {
    icon: IconMail,
    title: "Alternative Contact",
    content: "Email us directly at support@gopwnit.com or visit gopwnit.com for more resources.",
    email: "support@gopwnit.com",
  },
  {
    icon: IconShield,
    title: "Policy Compliance",
    content: "Non-compliance with support procedures may result in delayed or rejected requests. Please follow all guidelines.",
  },
  {
    icon: IconAlertTriangle,
    title: "Priority Support",
    content: "Critical issues affecting service availability receive highest priority. Tag your ticket appropriately.",
  },
];

// ─── ANIMATION VARIANTS ───────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

// ─── STEP CARD ────────────────────────────────────────────────────────────────
function StepCard({ number, title, icon: Icon, description, details, link }) {
  return (
    <motion.div
      variants={fadeUp}
      className="sp-card sp-body"
      style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16, height: "100%" }}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{
          width: 36, height: 36,
          background: "rgba(254,252,232,0.04)",
          border: `1px solid ${T.border}`,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Icon size={16} color={T.cream} style={{ opacity: 0.55 }} />
        </div>
        <span className="sp-roundo" style={{ fontSize: 11, fontWeight: 700, color: "rgba(254,252,232,0.1)", letterSpacing: "0.04em" }}>
          {number}
        </span>
      </div>

      {/* Step label */}
      <div>
        <span className="sp-tag" style={{ display: "block", marginBottom: 6 }}>Step {number}</span>
        <h3 className="sp-roundo" style={{ fontSize: 15, fontWeight: 700, color: T.cream, margin: 0, letterSpacing: "-0.01em" }}>
          {title}
        </h3>
      </div>

      {/* Description */}
      <p className="sp-body" style={{ fontSize: 13, color: T.muted, lineHeight: 1.65, margin: 0 }}>
        {description}
      </p>

      {/* Details */}
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        {details.map((d, i) => (
          <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{ marginTop: 5, width: 4, height: 4, borderRadius: "50%", background: "rgba(254,252,232,0.2)", flexShrink: 0 }} />
            <span className="sp-body" style={{ fontSize: 12, color: T.muted, lineHeight: 1.6 }}>{d}</span>
          </li>
        ))}
      </ul>

      {/* Optional link */}
      {link && (
        <div style={{ marginTop: "auto", paddingTop: 8 }}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="sp-btn-ghost"
            style={{ padding: "8px 14px" }}
          >
            {link.label}
            <IconArrowRight size={13} />
          </a>
        </div>
      )}
    </motion.div>
  );
}

// ─── INFO CARD ────────────────────────────────────────────────────────────────
function InfoCard({ icon: Icon, title, content, email }) {
  return (
    <motion.div
      variants={fadeUp}
      className="sp-card sp-body"
      style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}
    >
      <div style={{
        width: 34, height: 34,
        background: "rgba(254,252,232,0.03)",
        border: `1px solid ${T.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={15} color={T.cream} style={{ opacity: 0.45 }} />
      </div>
      <h3 className="sp-roundo" style={{ fontSize: 13, fontWeight: 700, color: T.cream, margin: 0 }}>
        {title}
      </h3>
      <p className="sp-body" style={{ fontSize: 12, color: T.muted, lineHeight: 1.65, margin: 0 }}>
        {content}
      </p>
      {email && (
        <a href={`mailto:${email}`} className="sp-body" style={{
          fontSize: 12, fontWeight: 600, color: "rgba(254,252,232,0.5)",
          textDecoration: "none", transition: "color 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.color = T.cream}
        onMouseLeave={e => e.currentTarget.style.color = "rgba(254,252,232,0.5)"}
        >
          {email}
        </a>
      )}
    </motion.div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function SupportPage({ onOpenSignUp }) {
  return (
    <div className="sp-body" style={{ minHeight: "100vh", background: T.bg, color: T.cream, overflowX: "hidden" }}>
      <Navbar onOpenSignUp={onOpenSignUp} />

      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "128px 28px 80px", position: "relative", zIndex: 10 }}>

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <motion.section
          variants={stagger} initial="hidden" animate="visible"
          style={{ marginBottom: 72 }}
        >
          <motion.div variants={fadeUp} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 24, height: 1, background: "rgba(254,252,232,0.2)" }} />
            <span className="sp-tag">Support Center</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="sp-bebas"
            style={{ fontSize: "clamp(52px, 9vw, 96px)", color: T.cream, lineHeight: 0.92, margin: "0 0 20px" }}
          >
            WE'RE HERE<br />TO HELP YOU.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="sp-body"
            style={{ fontSize: 15, color: T.muted, maxWidth: 480, lineHeight: 1.75, margin: 0 }}
          >
            Get technical assistance, report issues, or receive guidance through our comprehensive support system.
          </motion.p>
        </motion.section>

        {/* ── DISCORD CTA ──────────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 72 }}
        >
          <div
            className="sp-card"
            style={{ padding: "32px 28px", display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "center" }}
          >
            <div>
              <span className="sp-tag" style={{ display: "block", marginBottom: 10 }}>Primary Support Channel</span>
              <h2 className="sp-roundo" style={{ fontSize: 22, fontWeight: 800, color: T.cream, margin: "0 0 10px", letterSpacing: "-0.02em" }}>
                Join Our Discord
              </h2>
              <p className="sp-body" style={{ fontSize: 13, color: T.muted, lineHeight: 1.7, margin: "0 0 20px", maxWidth: 440 }}>
                Access instant support, connect with our community, and get real-time assistance from our team.
              </p>
              <a
                href="https://discord.com/invite/4Mb6xXce8q"
                target="_blank"
                rel="noopener noreferrer"
                className="sp-btn-ghost"
                style={{ padding: "10px 18px", fontSize: 13 }}
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                </svg>
                Join Discord Server
              </a>
            </div>

            {/* Live status pills */}
            <div className="sp-card" style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: 10, minWidth: 180 }}>
              {[
                { label: "Active Support Team",   dot: "#22c55e" },
                { label: "Community Assistance",  dot: "rgba(254,252,232,0.4)" },
                { label: "Real-time Updates",     dot: "rgba(254,252,232,0.25)" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: item.dot, flexShrink: 0 }} />
                  <span className="sp-body" style={{ fontSize: 12, color: T.muted }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ── STEPS ────────────────────────────────────────────────────────── */}
        <section style={{ marginBottom: 72 }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: 32 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <div style={{ width: 24, height: 1, background: "rgba(254,252,232,0.2)" }} />
              <span className="sp-tag">Process</span>
            </div>
            <h2 className="sp-roundo" style={{ fontSize: 22, fontWeight: 800, color: T.cream, margin: "0 0 8px", letterSpacing: "-0.02em" }}>
              Support Process
            </h2>
            <p className="sp-body" style={{ fontSize: 13, color: T.muted, margin: 0 }}>
              Follow these steps to get the help you need.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}
          >
            {steps.map((step, i) => (
              <StepCard key={i} {...step} />
            ))}
          </motion.div>
        </section>

        {/* ── RESPONSIBILITIES + INFO CARDS ─────────────────────────────────── */}
        <section style={{ marginBottom: 64 }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 3fr", gap: 20, alignItems: "start" }}>

            {/* Responsibilities */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="sp-card"
              style={{ padding: 24, position: "sticky", top: 28 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{ width: 2, height: 18, background: T.cream, opacity: 0.2 }} />
                <h3 className="sp-roundo" style={{ fontSize: 14, fontWeight: 700, color: T.cream, margin: 0 }}>
                  Your Responsibilities
                </h3>
              </div>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 12 }}>
                {responsibilities.map((item, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <span style={{ marginTop: 6, width: 4, height: 4, borderRadius: "50%", background: "rgba(254,252,232,0.2)", flexShrink: 0 }} />
                    <span className="sp-body" style={{ fontSize: 12, color: T.muted, lineHeight: 1.65 }}>{item}</span>
                  </li>
                ))}
              </ul>

              <hr className="sp-divider" style={{ marginBottom: 20 }} />

              <a
                href="mailto:support@gopwnit.com"
                className="sp-btn-ghost"
                style={{ padding: "9px 14px", width: "100%", justifyContent: "center" }}
              >
                <IconMail size={14} />
                Email Support
              </a>
            </motion.div>

            {/* Info cards */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
            >
              {infoCards.map((card, i) => (
                <InfoCard key={i} {...card} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────────────────────────── */}
        <footer style={{
          paddingTop: 20,
          borderTop: "1px solid rgba(254,252,232,0.06)",
          display: "flex", flexWrap: "wrap",
          alignItems: "center", justifyContent: "space-between",
          gap: 12,
        }}>
          <span className="sp-body" style={{ fontSize: 11, color: "rgba(254,252,232,0.2)" }}>
            © 2026 gopwnit — Support Documentation
          </span>
          <div style={{ display: "flex", gap: 20 }}>
            <Link href="/privacy-policy" className="sp-link">Privacy Policy</Link>
            <Link href="/code-of-conduct" className="sp-link">Code of Conduct</Link>
          </div>
        </footer>

      </div>
    </div>
  );
}