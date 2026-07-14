"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconShield,
  IconLock,
  IconEye,
  IconUsers,
  IconServer,
  IconClock,
  IconMail,
  IconCircleCheck,
  IconX,
  IconChevronRight,
} from "@tabler/icons-react";

import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import AnimatedBlurBg from "@/components/home/AnimatedBlurBg";

// Fonts (Bebas Neue, Outfit, DM Sans) are loaded once, site-wide, in the root layout.
if (typeof document !== "undefined" && !document.getElementById("pp-font-classes")) {
  const s = document.createElement("style");
  s.id = "pp-font-classes";
  s.textContent = `
    .pp-bebas  { font-family: 'Bebas Neue', sans-serif; letter-spacing: -0.02em; }
    .pp-roundo { font-family: 'DM Sans', sans-serif; }
    .pp-body   { font-family: 'Outfit', sans-serif; }
    .pp-scrollbar { scrollbar-width: none; }
    .pp-scrollbar::-webkit-scrollbar { display: none; }
  `;
  document.head.appendChild(s);
}

// ─── SECTIONS DATA ────────────────────────────────────────────────────────────
const sections = [
  {
    id: "intro",
    number: "01",
    title: "Introduction",
    summary:
      "Our commitment to protecting your privacy and overview of our practices.",
    icon: IconShield,
  },
  {
    id: "collect",
    number: "02",
    title: "Information We Collect",
    summary: "Details about the personal information we gather and store.",
    icon: IconEye,
  },
  {
    id: "use",
    number: "03",
    title: "How We Use Your Info",
    summary: "Legitimate business purposes for processing your data.",
    icon: IconUsers,
  },
  {
    id: "cookies",
    number: "04",
    title: "Cookies & Tracking",
    summary: "Essential cookies only, no third-party tracking or advertising.",
    icon: IconLock,
  },
  {
    id: "sharing",
    number: "05",
    title: "Data Sharing",
    summary:
      "Zero data commercialization policy with trusted infrastructure partners.",
    icon: IconServer,
  },
  {
    id: "social",
    number: "06",
    title: "Social Auth Services",
    summary: "Current proprietary authentication and future considerations.",
    icon: IconUsers,
  },
  {
    id: "retention",
    number: "07",
    title: "Data Retention",
    summary: "Account deletion rights and mandatory retention policies.",
    icon: IconClock,
  },
  {
    id: "rights",
    number: "08",
    title: "Privacy Rights",
    summary: "Comprehensive controls over your personal information.",
    icon: IconShield,
  },
  {
    id: "updates",
    number: "09",
    title: "Policy Updates",
    summary: "Change management procedures and notification methods.",
    icon: IconClock,
  },
  {
    id: "contact",
    number: "10",
    title: "Contact & DPO",
    summary: "How to reach us for privacy-related inquiries and concerns.",
    icon: IconMail,
  },
];

// ─── SECTION CARD ─────────────────────────────────────────────────────────────
function SectionCard({ section, onClick }) {
  const Icon = section.icon;
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0 },
      }}
      onClick={onClick}
      className="pp-body group flex flex-col h-full p-6 border border-white/[0.07] bg-white/[0.02]
                 hover:bg-white/[0.04] hover:border-white/[0.16] transition-all duration-200 cursor-pointer"
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-5">
        <div className="w-9 h-9 flex items-center justify-center border border-white/[0.08] bg-white/[0.03] flex-shrink-0">
          <Icon size={16} color="#fefce8" style={{ opacity: 0.55 }} />
        </div>
        <span className="pp-roundo text-[11px] font-bold text-white/[0.1] tracking-wide">
          {section.number}
        </span>
      </div>

      {/* Text */}
      <div className="flex-1">
        <h3 className="pp-roundo text-[15px] font-bold text-yellow-50 mb-2 tracking-tight">
          {section.title}
        </h3>
        <p className="pp-body text-[13px] text-zinc-500 leading-relaxed">
          {section.summary}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-white/[0.05] flex items-center justify-between">
        <span className="pp-roundo text-[10px] font-bold uppercase tracking-[0.13em] text-white/[0.28]">
          Read Protocol
        </span>
        <div className="w-7 h-7 flex items-center justify-center border border-white/[0.07]">
          <IconChevronRight size={12} color="rgba(254,252,232,0.3)" />
        </div>
      </div>
    </motion.div>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
function Modal({ children, onClose }) {
  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-[10px]"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 16 }}
        transition={{ duration: 0.2 }}
        className="pp-body relative w-full max-w-3xl max-h-[88vh] flex flex-col
                   bg-[#111] border border-white/[0.1] overflow-hidden"
        style={{ boxShadow: "0 40px 80px rgba(0,0,0,0.8)" }}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-[5px] h-[5px] rounded-full bg-yellow-50 opacity-30" />
            <span className="pp-roundo text-[10px] font-bold uppercase tracking-[0.14em] text-white/30">
              Section Protocol Content
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border border-white/[0.08]
                       bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 transition-all"
          >
            <IconX size={13} color="#fefce8" style={{ opacity: 0.5 }} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="pp-scrollbar overflow-y-auto flex-1 p-7">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

// ─── SHARED MODAL HELPERS ─────────────────────────────────────────────────────

function ModalHeader({ num, title }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div
        className="w-11 h-11 flex-shrink-0 flex items-center justify-center
                      border border-white/[0.1] bg-white/[0.04]"
      >
        <span className="pp-roundo text-[15px] font-[800] text-yellow-50 opacity-70">
          {num}
        </span>
      </div>
      <h3 className="pp-roundo text-[24px] font-[800] text-yellow-50 tracking-tight leading-tight">
        {title}
      </h3>
    </div>
  );
}

function InfoRow({ text }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
      <div className="w-1 h-1 rounded-full bg-yellow-50 opacity-25 flex-shrink-0" />
      <span className="pp-body text-[13px] text-zinc-400">{text}</span>
    </div>
  );
}

function InfoCard({ title, description }) {
  return (
    <div className="p-5 border border-white/[0.07] bg-white/[0.02] hover:border-white/[0.15] transition-colors">
      <h5 className="pp-roundo text-[12px] font-[700] text-yellow-50 mb-2 uppercase tracking-wide">
        {title}
      </h5>
      <p className="pp-body text-[12px] text-zinc-500 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function ServiceCard({ name, purpose, region }) {
  return (
    <div className="p-5 border border-white/[0.07] bg-white/[0.02] space-y-3">
      <div>
        <h5 className="pp-roundo text-[13px] font-[700] text-yellow-50">
          {name}
        </h5>
        <span className="pp-roundo text-[9px] font-[700] uppercase tracking-[0.13em] text-zinc-600">
          {region}
        </span>
      </div>
      <p className="pp-body text-[12px] text-zinc-500 leading-relaxed">
        {purpose}
      </p>
    </div>
  );
}

function RetentionItem({ item, purpose }) {
  return (
    <div className="p-4 border border-white/[0.06] bg-white/[0.01]">
      <div className="pp-roundo text-[13px] font-[600] text-yellow-50 mb-1">
        {item}
      </div>
      <div className="pp-body text-[11px] text-zinc-600">{purpose}</div>
    </div>
  );
}

function RightCard({ title, description }) {
  return (
    <div className="p-5 border border-white/[0.07] bg-white/[0.02] hover:border-white/[0.15] transition-colors">
      <h5 className="pp-roundo text-[12px] font-[700] text-yellow-50 mb-2 uppercase tracking-wide">
        {title}
      </h5>
      <p className="pp-body text-[12px] text-zinc-500 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="pp-roundo text-[10px] font-[700] uppercase tracking-[0.14em] text-white/30">
        {children}
      </span>
    </div>
  );
}

// ─── MODAL CONTENT ────────────────────────────────────────────────────────────
function renderModalContent(sectionId) {
  switch (sectionId) {
    case "intro":
      return (
        <div className="space-y-6">
          <ModalHeader num="01" title="Introduction" />
          <p className="pp-body text-[14px] text-zinc-400 leading-relaxed max-w-xl">
            gopwnit is operated by GOPWNIT, a partnership firm registered in India,
            and is committed to protecting and respecting your privacy. This
            Privacy Policy outlines our practices regarding the collection, use,
            storage, and protection of personal information when you utilize our
            cybersecurity learning platform and CTF services. By accessing or
            using our platform, you acknowledge that you have read, understood,
            and agree to be bound by the terms set forth in this policy.
          </p>
        </div>
      );

    case "collect":
      return (
        <div className="space-y-8">
          <ModalHeader num="02" title="Information We Collect" />
          <p className="pp-body text-[14px] text-zinc-400 leading-relaxed">
            We collect and process the following categories of personal
            information to provide our services effectively:
          </p>
          {[
            {
              label: "Account Information",
              items: [
                "Email address (primary identifier)",
                "Full legal name",
                "Username and display preferences",
                "Account creation timestamp",
              ],
            },
            {
              label: "Technical Data",
              items: [
                "IP address and geolocation data",
                "User agent and browser specifications",
                "Device type and operating system",
                "Session duration and access patterns",
              ],
            },
            {
              label: "Platform Activity",
              items: [
                "CTF challenge submissions and scores",
                "Course enrollment and progress data",
                "Learning path completions",
                "Community interactions",
              ],
            },
            {
              label: "Optional Metadata",
              items: [
                "Professional social profiles (GitHub, LinkedIn)",
                "Profile avatar and customization",
                "Educational background",
                "Professional experience",
              ],
            },
          ].map(({ label, items }) => (
            <div key={label}>
              <SectionLabel>{label}</SectionLabel>
              <div className="grid grid-cols-2 gap-2">
                {items.map((text) => (
                  <InfoRow key={text} text={text} />
                ))}
              </div>
            </div>
          ))}
        </div>
      );

    case "use":
      return (
        <div className="space-y-8">
          <ModalHeader num="03" title="Usage Protocol" />
          <p className="pp-body text-[14px] text-zinc-400 leading-relaxed">
            We process your personal information for the following legitimate
            business purposes:
          </p>
          <div className="grid grid-cols-2 gap-3">
            <InfoCard
              title="Identity & Security"
              description="Secure user authentication, session management, and account verification to ensure authorized access."
            />
            <InfoCard
              title="Threat Mitigation"
              description="Detection and prevention of malicious activities including bypass attempts and suspicious behavioral patterns."
            />
            <InfoCard
              title="Optimization"
              description="Provision of personalized learning experiences, performance analytics, and feature improvements."
            />
            <InfoCard
              title="Integrity"
              description="Maintenance of competition standards, prevention of cheating, and leaderboard accuracy."
            />
          </div>
          <div className="p-5 border border-white/[0.1] bg-white/[0.02]">
            <span className="pp-roundo text-[10px] font-[700] uppercase tracking-[0.13em] text-white/30 block mb-2">
              Transparency Commitment
            </span>
            <p className="pp-body text-[13px] text-zinc-400 leading-relaxed">
              All data processing activities are logged and accessible through
              your account dashboard. We maintain detailed audit trails for
              security and compliance purposes.
            </p>
          </div>
        </div>
      );

    case "cookies":
      return (
        <div className="space-y-6">
          <ModalHeader num="04" title="Cookies & Tracking" />
          <div className="p-5 border border-white/[0.08] bg-white/[0.02]">
            <h4 className="pp-roundo text-[14px] font-[700] text-yellow-50 mb-4">
              Essential Tokens Only
            </h4>
            <p className="pp-body text-[13px] text-zinc-400 leading-relaxed mb-5">
              We utilize technologies{" "}
              <strong className="text-yellow-50/80 font-semibold">
                exclusively for essential platform functionality
              </strong>
              :
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                "Authentication state management",
                "Session security validation",
                "Platform preference storage",
                "Security monitoring",
              ].map((t) => (
                <InfoRow key={t} text={t} />
              ))}
            </div>
          </div>
          <div className="p-5 border border-red-500/[0.12] bg-red-500/[0.03]">
            <h4 className="pp-roundo text-[14px] font-[700] text-red-400/80 mb-4">
              Restricted Activities
            </h4>
            <div className="space-y-3">
              {[
                "Third-party advertising cookies",
                "Cross-site tracking mechanisms",
                "Behavioral profiling for marketing",
                "Social media tracking pixels",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-red-500/50 flex-shrink-0" />
                  <span className="pp-body text-[13px] text-zinc-500">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "sharing":
      return (
        <div className="space-y-6">
          <ModalHeader num="05" title="Data Sharing" />
          <div className="p-5 border border-white/[0.1] bg-white/[0.02]">
            <h4 className="pp-roundo text-[18px] font-[800] text-yellow-50 mb-3 tracking-tight">
              Zero Commercialization
            </h4>
            <p className="pp-body text-[14px] text-zinc-400 leading-relaxed">
              gopwnit{" "}
              <strong className="text-yellow-50/80 font-semibold">
                does not sell, rent, or lease
              </strong>{" "}
              your personal information. Your data is not a revenue source.
            </p>
          </div>
          <div>
            <SectionLabel>Infrastructure Partners</SectionLabel>
            <div className="grid grid-cols-2 gap-3">
              <ServiceCard
                name="Amazon Web Services"
                purpose="Secure storage of user content and platform assets with enterprise-grade encryption"
                region="Global Data Residency"
              />
              <ServiceCard
                name="Fly.io Infrastructure"
                purpose="Backend application hosting and database management with edge optimization"
                region="Primary: Mumbai, India"
              />
            </div>
          </div>
        </div>
      );

    case "social":
      return (
        <div className="space-y-6">
          <ModalHeader num="06" title="Social Auth" />
          <div className="p-5 border border-white/[0.08] bg-white/[0.02]">
            <h4 className="pp-roundo text-[14px] font-[700] text-yellow-50 mb-3">
              Auth Model
            </h4>
            <p className="pp-body text-[13px] text-zinc-400 leading-relaxed mb-5">
              gopwnit currently employs a{" "}
              <strong className="text-yellow-50/80 font-semibold">
                proprietary authentication system
              </strong>{" "}
              and does not integrate with third-party social providers.
            </p>
            <div className="p-4 border border-white/[0.08] bg-white/[0.02]">
              <span className="pp-roundo text-[10px] font-[700] uppercase tracking-[0.13em] text-white/30 block mb-4">
                Future Considerations
              </span>
              <div className="space-y-3">
                {[
                  "Advance notice to all users",
                  "Explicit policy updates",
                  "Maintaining choice of login methods",
                  "Granular permission controls",
                ].map((text) => (
                  <div key={text} className="flex items-center gap-3">
                    <IconCircleCheck
                      size={13}
                      color="#fefce8"
                      style={{ opacity: 0.35 }}
                    />
                    <span className="pp-body text-[13px] text-zinc-400">
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );

    case "retention":
      return (
        <div className="space-y-6">
          <ModalHeader num="07" title="Data Retention" />
          <div>
            <SectionLabel>Deletion Protocols</SectionLabel>
            <p className="pp-body text-[14px] text-zinc-400 leading-relaxed">
              Users may request complete account deletion at any time via
              settings. Requests are processed within 30 days of verification.
            </p>
          </div>
          <div className="p-5 border border-white/[0.08] bg-white/[0.02]">
            <h4 className="pp-roundo text-[13px] font-[700] text-yellow-50 mb-4 uppercase tracking-wide">
              Mandatory Security Retention
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <RetentionItem
                item="Email Address"
                purpose="Verification and security"
              />
              <RetentionItem item="Legal Name" purpose="Compliance reporting" />
              <RetentionItem item="Platform ID" purpose="Abuse prevention" />
              <RetentionItem
                item="Audit Logs"
                purpose="Security investigations"
              />
            </div>
          </div>
        </div>
      );

    case "rights":
      return (
        <div className="space-y-6">
          <ModalHeader num="08" title="Privacy Rights" />
          <div className="grid grid-cols-3 gap-3">
            <RightCard
              title="Data Access"
              description="Request a complete copy of your personal metadata."
            />
            <RightCard
              title="Correction"
              description="Update inaccurate information through your dashboard."
            />
            <RightCard
              title="Deletion"
              description="Request data purging with security retention limits."
            />
            <RightCard
              title="Limitation"
              description="Restrict processing while maintaining security."
            />
            <RightCard
              title="Portability"
              description="Receive data in a portable, interoperable format."
            />
            <RightCard
              title="Objection"
              description="Object to specific processing based on context."
            />
          </div>
          <div className="p-6 border border-white/[0.1] bg-white/[0.02] text-center">
            <h4 className="pp-roundo text-[17px] font-[800] text-yellow-50 mb-4 tracking-tight">
              Exercise Your Rights
            </h4>
            <a
              href="mailto:support@gopwnit.com"
              className="pp-roundo text-[15px] font-[800] text-yellow-50 opacity-70 hover:opacity-100
                         transition-opacity underline decoration-white/20"
            >
              support@gopwnit.com
            </a>
            <p className="pp-roundo text-[10px] font-[700] uppercase tracking-[0.13em] text-zinc-600 mt-3">
              Include "Privacy Request" in subject line
            </p>
          </div>
        </div>
      );

    case "updates":
      return (
        <div className="space-y-6">
          <ModalHeader num="09" title="Policy Updates" />
          <div className="p-5 border border-white/[0.08] bg-white/[0.02]">
            <SectionLabel>Change Management</SectionLabel>
            <div className="grid grid-cols-2 gap-5 mt-2">
              <div className="space-y-3">
                <span className="pp-roundo text-[9px] font-[700] uppercase tracking-[0.12em] px-2 py-1 bg-white/[0.05] border border-white/[0.08] text-zinc-500">
                  Minor
                </span>
                <h5 className="pp-roundo text-[14px] font-[700] text-yellow-50">
                  Clarifications
                </h5>
                <p className="pp-body text-[12px] text-zinc-500 leading-relaxed">
                  Formatting, contact updates, or non-material improvements.
                </p>
              </div>
              <div className="space-y-3">
                <span className="pp-roundo text-[9px] font-[700] uppercase tracking-[0.12em] px-2 py-1 bg-white/[0.05] border border-white/[0.08] text-yellow-50/50">
                  Major
                </span>
                <h5 className="pp-roundo text-[14px] font-[700] text-yellow-50">
                  Substantive
                </h5>
                <p className="pp-body text-[12px] text-zinc-500 leading-relaxed">
                  New collection practices or material rights modifications.
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: IconMail, text: "Email notifications for major updates" },
              { icon: IconShield, text: "In-platform security announcements" },
              { icon: IconClock, text: "30-day advance notice for changes" },
              { icon: IconCircleCheck, text: "Comprehensive version history" },
            ].map(({ icon: Icon, text }, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3 border border-white/[0.06] bg-white/[0.02]"
              >
                <Icon
                  size={14}
                  color="#fefce8"
                  style={{ opacity: 0.35, flexShrink: 0 }}
                />
                <span className="pp-body text-[12px] text-zinc-400">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      );

    case "contact":
      return (
        <div className="space-y-6">
          <ModalHeader num="10" title="Contact & DPO" />
          <div className="p-6 border border-white/[0.1] bg-white/[0.02] text-center">
            <h4 className="pp-roundo text-[18px] font-[800] text-yellow-50 mb-2 tracking-tight">
              Privacy Response Team
            </h4>
            <p className="pp-body text-[13px] text-zinc-500 mb-5">
              Direct channel for data protection concerns
            </p>
            <a
              href="mailto:support@gopwnit.com"
              className="pp-roundo text-[20px] font-[800] text-yellow-50 opacity-65 hover:opacity-100
                         transition-opacity underline decoration-white/15"
            >
              support@gopwnit.com
            </a>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-5 border border-white/[0.07] bg-white/[0.02]">
              <span className="pp-roundo text-[10px] font-[700] uppercase tracking-[0.13em] text-white/25 block mb-4">
                Response Timeframes
              </span>
              <div className="space-y-3">
                {[
                  { label: "General", time: "48–72 Hours" },
                  { label: "Rights Requests", time: "30 Days" },
                  { label: "Security", time: "24 Hours" },
                ].map(({ label, time }) => (
                  <div
                    key={label}
                    className="flex justify-between items-center"
                  >
                    <span className="pp-body text-[13px] text-zinc-500">
                      {label}
                    </span>
                    <span className="pp-roundo text-[12px] font-[700] text-yellow-50 opacity-60">
                      {time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-5 border border-white/[0.07] bg-white/[0.02]">
              <span className="pp-roundo text-[10px] font-[700] uppercase tracking-[0.13em] text-white/25 block mb-3">
                DPDP Act Compliance
              </span>
              <p className="pp-body text-[12px] text-zinc-500 leading-relaxed">
                Adhering to the Digital Personal Data Protection Act, 2023
                (India) and international standards. Providing safe,
                transparent, and sovereign data management for all cybersecurity
                learners.
              </p>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function PrivacyPolicy() {
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (id) => {
    setActiveModal(id);
    document.body.style.overflow = "hidden";
  };
  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = "";
  };

  return (
    <div className="pp-body flex flex-col min-h-screen bg-[#0A0A0A] text-yellow-50">
      <Navbar />

      {/* Background — untouched */}
      <div className="fixed inset-0 z-0">
        <AnimatedBlurBg />
      </div>

      <main className="relative z-10 flex-grow pt-32">
        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="px-7 py-16 md:py-24">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-5"
            >
              {/* Main heading — Bebas only here */}
              <h1 className="pp-bebas text-[clamp(52px,9vw,96px)] text-yellow-50 leading-[0.92]">
                PRIVACY
                <br />
                PROTOCOL
              </h1>

              <p className="pp-body text-[15px] text-zinc-500 leading-relaxed max-w-lg">
                Platform integrity and user privacy are the cornerstones of the
                gopwnit ecosystem. This protocol outlines how we safeguard your
                digital identity.
              </p>

              {/* Meta */}
              <div className="flex flex-wrap gap-x-8 gap-y-2 pt-5 border-t border-white/[0.06]">
                {[
                  { label: "Effective Date", value: "July 28, 2025" },
                  { label: "Version", value: "1.0.0 (Stable)" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <span className="pp-roundo text-[10px] font-bold uppercase tracking-[0.13em] text-white/25 block mb-1">
                      {label}
                    </span>
                    <span className="pp-roundo text-[13px] font-semibold text-yellow-50">
                      {value}
                    </span>
                  </div>
                ))}
                <div>
                  <span className="pp-roundo text-[10px] font-bold uppercase tracking-[0.13em] text-white/25 block mb-1">
                    Status
                  </span>
                  <span className="pp-roundo text-[11px] font-bold uppercase tracking-wide text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                    Active
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── CARDS GRID ───────────────────────────────────────────────────── */}
        <section className="px-7 pb-24">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
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
          <Modal onClose={closeModal}>{renderModalContent(activeModal)}</Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
