"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconShield,
  IconTarget,
  IconSettings,
  IconAlertTriangle,
  IconMessageCircle,
  IconHeart,
  IconX,
  IconDeviceGamepad2,
  IconFlag,
  IconBan,
  IconChevronRight,
  IconCircleCheck,
  IconArrowUpRight,
} from "@tabler/icons-react";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AnimatedBlurBg from "@/components/home/AnimatedBlurBg";

// ─── THEME ────────────────────────────────────────────────────────────────────
const T = {
  bg: "#0A0A0A",
  cream: "#fefce8",
  muted: "#a1a1aa",
  border: "rgba(254,252,232,0.08)",
  borderHover: "rgba(254,252,232,0.18)",
};

// Fonts (Bebas Neue, Outfit, DM Sans) are loaded once, site-wide, in the root layout.
if (typeof document !== "undefined" && !document.getElementById("coc-styles")) {
  const style = document.createElement("style");
  style.id = "coc-styles";
  style.textContent = `
    .coc-bebas  { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.03em; }
    .font-roundo { font-family: 'DM Sans', sans-serif; }
    .coc-body   { font-family: 'Outfit', sans-serif; }

    .coc-card {
      background: rgba(254,252,232,0.02);
      border: 1px solid rgba(254,252,232,0.08);
      transition: background 0.2s, border-color 0.2s;
      cursor: pointer;
    }
    .coc-card:hover {
      background: rgba(254,252,232,0.04);
      border-color: rgba(254,252,232,0.18);
    }

    .coc-modal-card {
      background: rgba(254,252,232,0.02);
      border: 1px solid rgba(254,252,232,0.07);
      transition: border-color 0.2s;
    }
    .coc-modal-card:hover { border-color: rgba(254,252,232,0.16); }

    .coc-tag {
      font-family: 'DM Sans', sans-serif;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: rgba(254,252,232,0.3);
    }

    .coc-scrollbar { scrollbar-width: none; }
    .coc-scrollbar::-webkit-scrollbar { display: none; }

    .coc-row-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      background: rgba(254,252,232,0.02);
      border: 1px solid rgba(254,252,232,0.06);
      transition: background 0.15s;
    }
    .coc-row-item:hover { background: rgba(254,252,232,0.05); }
  `;
  document.head.appendChild(style);
}

// ─── SHARED HELPERS ───────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <div style={{ width: 16, height: 1, background: "rgba(254,252,232,0.15)" }} />
      <span className="coc-tag">{children}</span>
    </div>
  );
}

function ModalHeader({ num, title }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
      <div
        style={{
          width: 44, height: 44, flexShrink: 0,
          background: "rgba(254,252,232,0.04)",
          border: "1px solid rgba(254,252,232,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <span
          className="font-roundo"
          style={{ fontSize: 16, fontWeight: 800, color: T.cream, opacity: 0.7 }}
        >
          {num}
        </span>
      </div>
      <h3
        className="font-roundo"
        style={{ fontSize: 26, fontWeight: 800, color: T.cream, margin: 0, letterSpacing: "-0.02em" }}
      >
        {title}
      </h3>
    </div>
  );
}

function GuidelineRow({ text }) {
  return (
    <div className="coc-row-item">
      <div
        style={{
          width: 4, height: 4,
          background: T.cream, opacity: 0.25, flexShrink: 0,
        }}
      />
      <span className="coc-body" style={{ fontSize: 13, color: T.muted }}>
        {text}
      </span>
    </div>
  );
}

function GuidelineCard({ title, description, icon: Icon }) {
  return (
    <div className="coc-modal-card" style={{ padding: 18 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        {Icon && (
          <div style={{ marginTop: 2, flexShrink: 0, opacity: 0.4 }}>
            <Icon size={15} color={T.cream} />
          </div>
        )}
        <div>
          <h5
            className="font-roundo"
            style={{ fontSize: 13, fontWeight: 700, color: T.cream, margin: "0 0 6px" }}
          >
            {title}
          </h5>
          <p
            className="coc-body"
            style={{ fontSize: 12, color: T.muted, margin: 0, lineHeight: 1.65 }}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── SECTION CARD ─────────────────────────────────────────────────────────────

function SectionCard({ section, onClick }) {
  const Icon = section.icon;
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
      onClick={onClick}
      className="coc-card coc-body"
      style={{ padding: 24, display: "flex", flexDirection: "column", height: "100%" }}
    >
      {/* Top row */}
      <div
        style={{
          display: "flex", alignItems: "flex-start",
          justifyContent: "space-between", marginBottom: 20,
        }}
      >
        <div
          style={{
            width: 38, height: 38, flexShrink: 0,
            background: "rgba(254,252,232,0.04)",
            border: `1px solid ${T.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Icon size={17} color={T.cream} style={{ opacity: 0.6 }} />
        </div>
        <span
          className="font-roundo"
          style={{ fontSize: 11, fontWeight: 700, color: "rgba(254,252,232,0.12)", letterSpacing: "0.04em" }}
        >
          {section.number}
        </span>
      </div>

      {/* Text */}
      <div style={{ flex: 1 }}>
        <h3
          className="font-roundo"
          style={{ fontSize: 15, fontWeight: 700, color: T.cream, margin: "0 0 8px", letterSpacing: "-0.01em" }}
        >
          {section.title}
        </h3>
        <p className="coc-body" style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, margin: 0 }}>
          {section.summary}
        </p>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: 20, paddingTop: 16,
          borderTop: "1px solid rgba(254,252,232,0.05)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}
      >
        <span className="coc-tag">View Standards</span>
        <div
          style={{
            width: 28, height: 28,
            border: "1px solid rgba(254,252,232,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <IconChevronRight size={13} color="rgba(254,252,232,0.3)" />
        </div>
      </div>
    </motion.div>
  );
}

// ─── MODAL SHELL ──────────────────────────────────────────────────────────────

function Modal({ children, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
      }}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "absolute", inset: 0,
          background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)",
        }}
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 16 }}
        transition={{ duration: 0.2 }}
        className="coc-body"
        style={{
          position: "relative", width: "100%", maxWidth: 780,
          maxHeight: "88vh", display: "flex", flexDirection: "column",
          background: "#111",
          border: "1px solid rgba(254,252,232,0.1)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.8)",
          overflow: "hidden",
        }}
      >
        {/* Modal header bar */}
        <div
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "16px 24px",
            borderBottom: "1px solid rgba(254,252,232,0.06)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 6, height: 6,
                background: T.cream, opacity: 0.3,
              }}
            />
            <span className="coc-tag">Conduct Protocol</span>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32,
              border: "1px solid rgba(254,252,232,0.08)",
              background: "rgba(254,252,232,0.03)",
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", transition: "all 0.15s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(254,252,232,0.08)";
              e.currentTarget.style.borderColor = "rgba(254,252,232,0.2)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(254,252,232,0.03)";
              e.currentTarget.style.borderColor = "rgba(254,252,232,0.08)";
            }}
          >
            <IconX size={14} color={T.cream} style={{ opacity: 0.5 }} />
          </button>
        </div>

        {/* Scrollable body */}
        <div
          className="coc-scrollbar"
          style={{ padding: "28px 28px 36px", overflowY: "auto", flex: 1 }}
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
}

// ─── MODAL CONTENT ────────────────────────────────────────────────────────────

function renderModalContent(sectionId) {
  switch (sectionId) {

    case "principles":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <ModalHeader num="01" title="General Principles" />
          <p className="coc-body" style={{ fontSize: 14, color: T.muted, lineHeight: 1.75, margin: 0, maxWidth: 560 }}>
            Welcome to{" "}
            <strong style={{ color: T.cream, fontWeight: 600 }}>gopwnit</strong>.
            Our platform is built for cybersecurity enthusiasts to learn, play, and host
            challenges in a secure, ethical, and respectful environment.
          </p>
          <div>
            <SectionLabel>Core Values</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                "Respect all users, hosts, and organizers",
                "No abuse, harassment, or hate speech",
                "Maintain platform integrity and security",
                "Follow ethical hacking and cybersecurity laws",
                "Do not exploit or abuse platform systems",
                "Report vulnerabilities responsibly",
              ].map((text, i) => <GuidelineRow key={i} text={text} />)}
            </div>
          </div>
        </div>
      );

    case "players":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <ModalHeader num="02" title="CTF Players" />
          <p className="coc-body" style={{ fontSize: 14, color: T.muted, lineHeight: 1.75, margin: 0 }}>
            Expectations for all participants in Capture The Flag challenges.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <GuidelineCard
              title="Fair Play Standards"
              description="Compete honestly without brute-force attacks or exploiting unintended platform vulnerabilities."
              icon={IconDeviceGamepad2}
            />
            <GuidelineCard
              title="Scope Boundaries"
              description="Stay within challenge scope — attack only designated targets, never platform infrastructure."
              icon={IconTarget}
            />
            <GuidelineCard
              title="No Spoilers Policy"
              description="Protect the integrity of challenges by not sharing flags or solutions during active events."
              icon={IconFlag}
            />
          </div>
        </div>
      );

    case "hosts":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <ModalHeader num="03" title="CTF Hosts" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <GuidelineCard
              title="Fair Challenge Design"
              description="Create balanced, educational challenges that test skill without being harmful or misleading."
            />
            <GuidelineCard
              title="Data Protection"
              description="Never misuse player data or inject malicious content into hosted challenges."
            />
            <GuidelineCard
              title="Inclusive Content"
              description="Avoid offensive, discriminatory, or biased themes that could harm the community."
            />
            <GuidelineCard
              title="Stability"
              description="Design challenges that don't negatively impact platform performance or resource availability."
            />
          </div>
        </div>
      );

    case "prohibited":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <ModalHeader num="04" title="Prohibited Actions" />
          <div
            style={{
              padding: 24,
              background: "rgba(239,68,68,0.04)",
              border: "1px solid rgba(239,68,68,0.15)",
            }}
          >
            <p
              className="font-roundo"
              style={{
                fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                letterSpacing: "0.13em", color: "rgba(239,68,68,0.7)", margin: "0 0 16px",
              }}
            >
              Strictly Forbidden
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                "Platform exploitation or privilege escalation",
                "Automated disruption or bot attacks",
                "Using gopwnit to target external systems",
                "Identity fraud or impersonation",
                "Sharing private data of other users",
                "Resource flooding or system abuse",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <IconBan size={13} color="rgba(239,68,68,0.6)" style={{ flexShrink: 0 }} />
                  <span className="coc-body" style={{ fontSize: 13, color: T.muted }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "consequences":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <ModalHeader num="05" title="Consequences" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              {
                label: "Account Actions",
                text: "Suspension, termination, or shadow-banning based on violation severity.",
                danger: false,
              },
              {
                label: "Content Removal",
                text: "Deletion of hosted challenges or user-generated materials.",
                danger: false,
              },
              {
                label: "Achievement Forfeiture",
                text: "Loss of leaderboard rankings, certificates, and earned rewards.",
                danger: true,
              },
              {
                label: "Legal Referral",
                text: "Escalation to law enforcement for criminal or destructive activities.",
                danger: true,
              },
            ].map(({ label, text, danger }) => (
              <div
                key={label}
                className="coc-modal-card"
                style={{
                  padding: 18,
                  borderColor: danger ? "rgba(239,68,68,0.12)" : undefined,
                  background: danger ? "rgba(239,68,68,0.03)" : undefined,
                }}
              >
                <p
                  className="font-roundo"
                  style={{
                    fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                    letterSpacing: "0.13em", margin: "0 0 8px",
                    color: danger ? "rgba(239,68,68,0.65)" : "rgba(254,252,232,0.4)",
                  }}
                >
                  {label}
                </p>
                <p
                  className="coc-body"
                  style={{ fontSize: 13, color: T.muted, margin: 0, lineHeight: 1.6 }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      );

    case "reporting":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <ModalHeader num="06" title="Reporting Protocol" />

          {/* Email CTA */}
          <div
            style={{
              padding: 24, textAlign: "center",
              background: "rgba(254,252,232,0.02)",
              border: "1px solid rgba(254,252,232,0.1)",
            }}
          >
            <p
              className="font-roundo"
              style={{
                fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                letterSpacing: "0.12em", color: "rgba(254,252,232,0.3)", margin: "0 0 6px",
              }}
            >
              Submit a Breach Report
            </p>
            <p
              className="coc-body"
              style={{ fontSize: 13, color: T.muted, margin: "0 0 16px" }}
            >
              Maintain anonymity while helping secure our community.
            </p>
            <a
              href="mailto:support@gopwnit.com"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 800,
                color: T.cream, textDecoration: "none",
                background: "rgba(254,252,232,0.05)",
                border: "1px solid rgba(254,252,232,0.12)",
                padding: "10px 20px", transition: "all 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(254,252,232,0.09)";
                e.currentTarget.style.borderColor = "rgba(254,252,232,0.22)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "rgba(254,252,232,0.05)";
                e.currentTarget.style.borderColor = "rgba(254,252,232,0.12)";
              }}
            >
              support@gopwnit.com
              <IconArrowUpRight size={14} />
            </a>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div className="coc-modal-card" style={{ padding: 18 }}>
              <p
                className="font-roundo"
                style={{
                  fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: "0.13em", color: "rgba(254,252,232,0.35)", margin: "0 0 10px",
                }}
              >
                What to Include
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  "Detailed description of the incident",
                  "Involved usernames or IDs",
                  "Proof of violation — screenshots or logs",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="coc-body"
                    style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: T.muted }}
                  >
                    <span
                      style={{
                        marginTop: 5, width: 4, height: 4,
                        background: "rgba(254,252,232,0.2)", flexShrink: 0,
                      }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="coc-modal-card" style={{ padding: 18 }}>
              <p
                className="font-roundo"
                style={{
                  fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: "0.13em", color: "rgba(254,252,232,0.35)", margin: "0 0 10px",
                }}
              >
                Process
              </p>
              <p className="coc-body" style={{ fontSize: 13, color: T.muted, margin: 0, lineHeight: 1.65 }}>
                Every report is reviewed within 24–48 hours by our internal Integrity Team.
                Retaliation against reporters is strictly prohibited.
              </p>
            </div>
          </div>
        </div>
      );

    case "commitment":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <ModalHeader num="07" title="Our Commitment" />
          <div
            style={{
              padding: 22,
              background: "rgba(254,252,232,0.02)",
              border: "1px solid rgba(254,252,232,0.08)",
            }}
          >
            <h4
              className="font-roundo"
              style={{ fontSize: 19, fontWeight: 800, color: T.cream, margin: "0 0 10px", letterSpacing: "-0.02em" }}
            >
              Building The Future
            </h4>
            <p className="coc-body" style={{ fontSize: 14, color: T.muted, lineHeight: 1.75, margin: 0 }}>
              gopwnit is dedicated to fostering a{" "}
              <strong style={{ color: T.cream, fontWeight: 600 }}>safe, inclusive world</strong>{" "}
              where talent and ethics meet. We continuously improve our systems to reflect
              the latest in platform safety.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              "Safety-first platform moderation",
              "Inclusion for all skill levels",
              "Promotion of ethical hacking standards",
              "Continuous policy evolution",
            ].map((text, i) => (
              <div key={i} className="coc-row-item">
                <IconCircleCheck size={14} color={T.cream} style={{ opacity: 0.4, flexShrink: 0 }} />
                <span className="coc-body" style={{ fontSize: 13, color: T.muted }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      );

    default:
      return null;
  }
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function CodeOfConduct() {
  const [activeModal, setActiveModal] = useState(null);

  const openModal  = (id) => { setActiveModal(id); document.body.style.overflow = "hidden"; };
  const closeModal = ()   => { setActiveModal(null); document.body.style.overflow = ""; };

  const sections = [
    {
      id: "principles",
      title: "General Principles",
      icon: IconShield,
      summary: "Core values and fundamental principles for all platform users.",
      number: "01",
    },
    {
      id: "players",
      title: "CTF Players",
      icon: IconTarget,
      summary: "Guidelines and expectations for participants in CTF challenges.",
      number: "02",
    },
    {
      id: "hosts",
      title: "CTF Hosts",
      icon: IconSettings,
      summary: "Responsibilities and standards for challenge creators and organizers.",
      number: "03",
    },
    {
      id: "prohibited",
      title: "Prohibited Actions",
      icon: IconBan,
      summary: "Strictly forbidden actions that violate platform integrity.",
      number: "04",
    },
    {
      id: "consequences",
      title: "Consequences",
      icon: IconAlertTriangle,
      summary: "Enforcement actions and penalties for conduct violations.",
      number: "05",
    },
    {
      id: "reporting",
      title: "Reporting",
      icon: IconMessageCircle,
      summary: "How to report misconduct and platform abuse safely.",
      number: "06",
    },
    {
      id: "commitment",
      title: "Our Commitment",
      icon: IconHeart,
      summary: "gopwnit's dedication to fostering a safe and inclusive community.",
      number: "07",
    },
  ];

  return (
    <div
      className="coc-body"
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: T.bg, color: T.cream }}
    >
      <Navbar />

      {/* Background — untouched */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <AnimatedBlurBg />
      </div>

      <main style={{ position: "relative", zIndex: 10, flex: 1, paddingTop: 120 }}>

        <section style={{ padding: "64px 28px 48px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1
                className="coc-bebas"
                style={{
                  fontSize: "clamp(56px, 10vw, 100px)",
                  color: T.cream, lineHeight: 0.92,
                  margin: "0 0 22px", letterSpacing: "-0.02em",
                }}
              >
                CODE OF<br />CONDUCT
              </h1>

              <p
                className="coc-body"
                style={{ fontSize: 15, color: T.muted, lineHeight: 1.75, maxWidth: 520, margin: "0 0 36px" }}
              >
                We believe in a secure, ethical, and respectful environment where
                cybersecurity enthusiasts can learn, play, and host challenges with integrity.
              </p>

              {/* Meta row */}
              <div
                style={{
                  display: "flex", flexWrap: "wrap", gap: "8px 32px",
                  paddingTop: 20, borderTop: "1px solid rgba(254,252,232,0.06)",
                }}
              >
                {[
                  { label: "Last Updated", value: "July 29, 2025"     },
                  { label: "Version",      value: "1.0.0 (Global)"    },
                  { label: "Contact",      value: "support@gopwnit.com" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <span className="coc-tag" style={{ display: "block", marginBottom: 4 }}>{label}</span>
                    <span className="font-roundo" style={{ fontSize: 13, fontWeight: 600, color: T.cream }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── CARDS GRID ───────────────────────────────────────────────────── */}
        <section style={{ padding: "0 28px 80px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 14,
              }}
            >
              {sections.map((section) => (
                <SectionCard
                  key={section.id}
                  section={section}
                  onClick={() => openModal(section.id)}
                />
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />

      {/* ── MODAL ────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeModal && (
          <Modal onClose={closeModal}>
            {renderModalContent(activeModal)}
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}