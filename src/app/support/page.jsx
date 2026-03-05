"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  MessageCircle, CheckCircle, FileText, Camera,
  ArrowRight, Mail, Shield, Clock, AlertTriangle
} from "lucide-react";
import Navbar from "@/components/navbar/Navbar";

const TOKENS = {
  brand: "#a855f7",
  brandHover: "#c084fc",
  bgDeep: "#020205",
  glassBg: "rgba(8, 8, 12, 0.6)",
  border: "rgba(255, 255, 255, 0.05)",
  borderFocus: "rgba(168, 85, 247, 0.25)",
  textMuted: "#94a3b8",
};

const steps = [
  {
    number: "01",
    title: "Join Our Discord",
    icon: "MessageCircle",
    description: "Connect with our community and access real-time support channels.",
    details: [
      "Click the link to join our official Discord server",
      "Verify your account to access all channels",
      "Introduce yourself in #general",
    ],
    accentColor: "#5865F2",
    link: { href: "https://discord.com/invite/4Mb6xXce8q", label: "Join Discord Server" },
  },
  {
    number: "02",
    title: "Open a Ticket",
    icon: "FileText",
    description: "Navigate to the dedicated support section and create a ticket.",
    details: [
      "Locate the Support category in the server",
      "Click to open or create a new ticket",
      "Select the appropriate issue type",
    ],
    accentColor: "#a855f7",
  },
  {
    number: "03",
    title: "Describe Your Issue",
    icon: "CheckCircle",
    description: "Provide clear, detailed information so our team can help you fast.",
    details: [
      "Describe the issue clearly and concisely",
      "Include steps to reproduce the problem",
      "Provide your registered username or email",
    ],
    accentColor: "#ec4899",
  },
  {
    number: "04",
    title: "Submit Evidence",
    icon: "Camera",
    description: "Attach screenshots or recordings for faster resolution.",
    details: [
      "Ensure evidence is clear and readable",
      "Mask any sensitive personal data",
      "Verify accuracy before submitting",
    ],
    accentColor: "#06b6d4",
  },
];

const iconMap = { MessageCircle, FileText, CheckCircle, Camera };

const responsibilities = [
  "Submit only one ticket per issue to avoid duplicates",
  "Maintain professional and respectful communication",
  "Provide accurate and complete information",
  "Respond promptly to follow-up questions",
  "Update the ticket if the issue is resolved",
];

const infoCards = [
  {
    icon: "Clock",
    title: "Response Time",
    content: "Support requests are reviewed based on priority and complexity. Response times may vary depending on current workload.",
    color: "#a855f7",
  },
  {
    icon: "Mail",
    title: "Alternative Contact",
    content: "Email us directly at support@gopwnit.com or visit gopwnit.com for more resources.",
    email: "support@gopwnit.com",
    color: "#5865F2",
  },
  {
    icon: "Shield",
    title: "Policy Compliance",
    content: "Non-compliance with support procedures may result in delayed or rejected requests. Please follow all guidelines.",
    color: "#ec4899",
  },
  {
    icon: "AlertTriangle",
    title: "Priority Support",
    content: "Critical issues affecting service availability receive highest priority. Tag your ticket appropriately.",
    color: "#f59e0b",
  },
];

const infoIconMap = { Clock, Mail, Shield, AlertTriangle };

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

function StepCard({ number, title, icon, description, details, accentColor, link }) {
  const Icon = iconMap[icon];
  return (
    <motion.div
      variants={fadeUp}
      className="relative overflow-hidden rounded-2xl p-8 border h-full"
      style={{ background: TOKENS.glassBg, borderColor: TOKENS.borderFocus }}
      whileHover={{ y: -4, boxShadow: `0 20px 40px ${accentColor}20` }}
      transition={{ duration: 0.25 }}
    >
      <div
        className="absolute top-4 right-6 text-8xl font-black select-none pointer-events-none"
        style={{ color: `${accentColor}10`, fontFamily: "outfit, sans-serif" }}
      >
        {number}
      </div>
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 border"
        style={{ color: accentColor, background: `${accentColor}12`, borderColor: `${accentColor}30` }}
      >
        {Icon && <Icon />}
      </div>
      <div className="text-xs font-bold tracking-[0.25em] uppercase mb-3" style={{ color: accentColor }}>
        Step {number}
      </div>
      <h3 className="text-xl font-black font-outfit text-white mb-3 uppercase tracking-tight">{title}</h3>
      <p className="text-sm leading-relaxed mb-4" style={{ color: TOKENS.textMuted }}>{description}</p>
      <ul className="space-y-2">
        {details.map((d, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
            <span className="mt-1" style={{ color: accentColor }}>&#8594;</span>
            <span>{d}</span>
          </li>
        ))}
      </ul>
      {link && (
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 text-sm font-bold rounded-xl px-5 py-2.5 transition-all hover:scale-[1.03]"
          style={{ background: `${accentColor}20`, border: `1px solid ${accentColor}40`, color: accentColor }}
        >
          {link.label} <ArrowRight />
        </a>
      )}
    </motion.div>
  );
}

function InfoCard({ icon, title, content, email, color }) {
  const Icon = infoIconMap[icon];
  return (
    <motion.div
      variants={fadeUp}
      className="relative rounded-2xl p-6 border"
      style={{ background: TOKENS.glassBg, borderColor: TOKENS.borderFocus }}
      whileHover={{ y: -4, borderColor: `${color}50` }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-4 border"
        style={{ color, background: `${color}12`, borderColor: `${color}30` }}
      >
        {Icon && <Icon />}
      </div>
      <h3 className="font-bold text-white font-outfit mb-2">{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: TOKENS.textMuted }}>{content}</p>
      {email && (
        <a
          href={`mailto:${email}`}
          className="mt-3 inline-block text-sm font-semibold transition-colors hover:underline"
          style={{ color }}
        >
          {email}
        </a>
      )}
    </motion.div>
  );
}

export default function SupportPage({ onOpenSignUp }) {
  return (
    <div className="min-h-screen text-white font-roundo overflow-x-hidden antialiased" style={{ background: TOKENS.bgDeep }}>
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none" style={{ background: "rgba(168,85,247,0.07)" }} />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none" style={{ background: "rgba(88,101,242,0.06)" }} />

      <Navbar onOpenSignUp={onOpenSignUp} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 relative z-10">

        {/* Hero */}
        <motion.section variants={staggerContainer} initial="hidden" animate="visible" className="text-center mb-20">
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tighter uppercase font-outfit mb-6">
            We&apos;re Here to<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${TOKENS.brand}, #5865F2)` }}>
              Help You.
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Get technical assistance, report issues, or receive guidance through our comprehensive support system.
          </motion.p>
        </motion.section>

        {/* Discord CTA */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-24"
        >
          <div
            className="relative overflow-hidden rounded-3xl p-8 sm:p-12 border"
            style={{
              background: "linear-gradient(135deg, rgba(88,101,242,0.15) 0%, rgba(88,101,242,0.05) 100%)",
              borderColor: "rgba(88,101,242,0.3)",
            }}
          >
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] pointer-events-none" style={{ background: "rgba(88,101,242,0.15)" }} />
            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div
                  className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border"
                  style={{ color: "#5865F2", background: "rgba(88,101,242,0.15)", borderColor: "rgba(88,101,242,0.3)" }}
                >
                  Primary Support Channel
                </div>
                <h2 className="text-3xl sm:text-4xl font-black font-outfit uppercase tracking-tight text-white mb-4">Join Our Discord</h2>
                <p className="text-zinc-400 mb-6 leading-relaxed">Access instant support, connect with our community, and get real-time assistance from our team.</p>
                <a
                  href="https://discord.com/invite/4Mb6xXce8q"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-white transition-all hover:scale-[1.03] hover:shadow-lg"
                  style={{ background: "#5865F2", boxShadow: "0 0 30px rgba(88,101,242,0.3)" }}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                  Join Discord Server
                </a>
              </div>
              <div className="hidden md:block">
                <div className="rounded-2xl p-6 space-y-4 border" style={{ background: "rgba(8,8,12,0.5)", borderColor: TOKENS.border }}>
                  {[
                    { color: "#22c55e", label: "Active Support Team" },
                    { color: "#5865F2", label: "Community Assistance" },
                    { color: TOKENS.brand, label: "Real-time Updates" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-zinc-400">
                      <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: item.color }} />
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Steps */}
        <section className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 border mb-4"
              style={{ borderColor: TOKENS.borderFocus, background: "rgba(168,85,247,0.05)" }}
            >
              <span className="text-xs font-bold tracking-[0.25em] uppercase" style={{ color: TOKENS.brand }}>Process</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black font-outfit uppercase tracking-tight text-white">Support Process</h2>
            <p className="text-zinc-400 mt-4">Follow these steps to get the help you need</p>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid lg:grid-cols-2 gap-6"
          >
            {steps.map((step, i) => (
              <StepCard key={i} {...step} index={i} />
            ))}
          </motion.div>
        </section>

        {/* Responsibilities + Info Cards */}
        <section className="mb-20">
          <div className="grid lg:grid-cols-5 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <div className="sticky top-28 rounded-2xl p-8 border h-fit" style={{ background: TOKENS.glassBg, borderColor: TOKENS.borderFocus }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 rounded-full" style={{ background: `linear-gradient(to bottom, ${TOKENS.brand}, transparent)` }} />
                  <h3 className="text-xl font-black font-outfit uppercase tracking-tight text-white">Your Responsibilities</h3>
                </div>
                <ul className="space-y-4">
                  {responsibilities.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-zinc-400">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: TOKENS.brand }} />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-6 border-t" style={{ borderColor: TOKENS.border }}>
                  <a
                    href="mailto:support@gopwnit.com"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02]"
                    style={{ background: "rgba(168,85,247,0.15)", border: `1px solid ${TOKENS.borderFocus}`, color: TOKENS.brand }}
                  >
                    <Mail /> Email Support
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="lg:col-span-3 grid sm:grid-cols-2 gap-6"
            >
              {infoCards.map((card, i) => (
                <InfoCard key={i} {...card} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-600" style={{ borderColor: TOKENS.border }}>
          <div>&#169; 2026 gopwnit &#8212; Support Documentation</div>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-zinc-400 transition-colors">Privacy Policy</Link>
            <Link href="/code-of-conduct" className="hover:text-zinc-400 transition-colors">Code of Conduct</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}