"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  IconTerminal2,
  IconFlag,
  IconRoad,
  IconTrophy,
  IconUsersGroup,
  IconArrowRight,
} from "@tabler/icons-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AnimatedBlurBg from "@/components/home/AnimatedBlurBg";

const T = {
  bg: "#0A0A0A",
  cream: "#fefce8",
  muted: "#a1a1aa",
  border: "rgba(254,252,232,0.08)",
};

const CATEGORIES = [
  "Cryptography", "Forensics", "Reverse Engineering", "Binary Exploitation",
  "Web Exploitation", "OSINT", "Miscellaneous", "System / Privilege Escalation",
  "Mobile", "Hardware / IoT",
];

const ROADMAP = [
  { n: "01", title: "Beginner Foundations", desc: "Linux, networking, and scripting basics." },
  { n: "02", title: "Web App Security", desc: "OWASP Top 10, XSS, SQL injection, and more." },
  { n: "03", title: "Penetration Testing", desc: "Reconnaissance, enumeration, and exploitation." },
  { n: "04", title: "Advanced Exploitation", desc: "Binary exploitation, reverse engineering, Active Directory." },
];

const ORGANIZER_ROLES = ["Admin", "Challenge Manager", "Moderator", "Viewer"];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

function SectionHead({ eyebrow, title, sub }) {
  return (
    <div className="max-w-2xl mb-10">
      <span className="font-outfit text-[10px] font-bold uppercase tracking-[0.3em] block mb-4" style={{ color: T.muted }}>
        {eyebrow}
      </span>
      <h2 className="font-outfit text-3xl md:text-4xl font-black uppercase tracking-tight mb-3" style={{ color: T.cream }}>
        {title}
      </h2>
      {sub && (
        <p className="font-outfit text-[14px] leading-relaxed" style={{ color: T.muted }}>
          {sub}
        </p>
      )}
    </div>
  );
}

export default function PlatformPage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: T.bg, color: T.cream }}>
      <Navbar />

      <div className="fixed inset-0 z-0">
        <AnimatedBlurBg />
      </div>

      <main className="relative z-10 flex-1 pt-32">
        {/* Hero */}
        <section className="px-7 py-16 md:py-20">
          <div className="max-w-3xl mx-auto">
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.p variants={fadeUp} className="font-outfit text-[11px] font-bold uppercase tracking-[0.3em] mb-5" style={{ color: T.muted }}>
                The Platform
              </motion.p>
              <motion.h1
                variants={fadeUp}
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(48px, 8vw, 80px)", lineHeight: 0.95, color: T.cream }}
              >
                ONE PLATFORM.<br />EVERYTHING SHARP.
              </motion.h1>
              <motion.p variants={fadeUp} className="font-outfit text-[15px] leading-relaxed max-w-lg mt-5" style={{ color: T.muted }}>
                Labs to practice in, challenges to prove yourself against, and the
                infrastructure to run a competition for someone else.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* 01 Labs */}
        <section className="px-7 py-14 border-t" style={{ borderColor: T.border }}>
          <div className="max-w-5xl mx-auto">
            <SectionHead
              eyebrow="01 — Practice"
              title="Interactive Hacking Labs"
              sub="Contained, safe environments to practice real vulnerabilities — available any time, not just during a live event."
            />
            <div className="flex items-center gap-4 p-6 border" style={{ borderColor: T.border, background: "rgba(254,252,232,0.02)" }}>
              <div className="w-11 h-11 flex items-center justify-center border flex-shrink-0" style={{ borderColor: "rgba(254,252,232,0.1)", background: "rgba(254,252,232,0.04)" }}>
                <IconTerminal2 size={18} color={T.cream} style={{ opacity: 0.6 }} />
              </div>
              <p className="font-outfit text-[13.5px] leading-relaxed" style={{ color: T.muted }}>
                Labs are ongoing — solve at your own pace, revisit them anytime,
                and use them to build the fundamentals the roadmap below builds on.
              </p>
            </div>
          </div>
        </section>

        {/* 02 Challenge categories */}
        <section className="px-7 py-14 border-t" style={{ borderColor: T.border }}>
          <div className="max-w-5xl mx-auto">
            <SectionHead
              eyebrow="02 — Compete"
              title="CTF Challenges, Ten Categories Deep"
              sub="Every challenge on gopwnit falls into one of ten categories, spanning the full breadth of offensive security."
            />
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid grid-cols-2 md:grid-cols-5 gap-2"
            >
              {CATEGORIES.map((cat) => (
                <motion.div
                  key={cat}
                  variants={fadeUp}
                  className="p-4 border text-center"
                  style={{ borderColor: T.border, background: "rgba(254,252,232,0.02)" }}
                >
                  <IconFlag size={14} style={{ color: T.muted, margin: "0 auto 8px" }} />
                  <span className="font-outfit text-[11.5px] font-semibold" style={{ color: T.cream }}>{cat}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* 03 Roadmap */}
        <section className="px-7 py-14 border-t" style={{ borderColor: T.border }}>
          <div className="max-w-5xl mx-auto">
            <SectionHead
              eyebrow="03 — Learn"
              title="A Structured Learning Path"
              sub="Not sure where to start? The path runs from Linux basics to Active Directory exploitation."
            />
            <div className="grid sm:grid-cols-2 gap-3">
              {ROADMAP.map((step) => (
                <div key={step.n} className="flex items-start gap-4 p-6 border" style={{ borderColor: T.border, background: "rgba(254,252,232,0.02)" }}>
                  <span className="font-outfit text-2xl font-black" style={{ color: "rgba(254,252,232,0.15)" }}>{step.n}</span>
                  <div>
                    <h3 className="font-outfit text-[14px] font-bold mb-1" style={{ color: T.cream }}>{step.title}</h3>
                    <p className="font-outfit text-[12.5px] leading-relaxed" style={{ color: T.muted }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 04 Ranking */}
        <section className="px-7 py-14 border-t" style={{ borderColor: T.border }}>
          <div className="max-w-5xl mx-auto">
            <SectionHead
              eyebrow="04 — Track"
              title="Live, Skill-Based Ranking"
              sub="Solve a challenge, watch your score move. Leaderboards run separately for solo and team competitions within each season."
            />
            <div className="flex items-center gap-4 p-6 border" style={{ borderColor: T.border, background: "rgba(254,252,232,0.02)" }}>
              <div className="w-11 h-11 flex items-center justify-center border flex-shrink-0" style={{ borderColor: "rgba(254,252,232,0.1)", background: "rgba(254,252,232,0.04)" }}>
                <IconTrophy size={18} color={T.cream} style={{ opacity: 0.6 }} />
              </div>
              <p className="font-outfit text-[13.5px] leading-relaxed" style={{ color: T.muted }}>
                Points are set by challenge difficulty and added to your score the
                moment you solve — no waiting for a manual grade or a batch update.
              </p>
            </div>
          </div>
        </section>

        {/* 05 Hosting */}
        <section className="px-7 py-14 border-t" style={{ borderColor: T.border }}>
          <div className="max-w-5xl mx-auto">
            <SectionHead
              eyebrow="05 — Host"
              title="Tools To Run Your Own Event"
              sub="Any college, club, or company can host a CTF season on gopwnit — the infrastructure is already built."
            />
            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              <div className="p-6 border" style={{ borderColor: T.border, background: "rgba(254,252,232,0.02)" }}>
                <div className="w-9 h-9 flex items-center justify-center mb-4 border" style={{ borderColor: "rgba(254,252,232,0.08)", background: "rgba(254,252,232,0.03)" }}>
                  <IconUsersGroup size={16} color={T.cream} style={{ opacity: 0.55 }} />
                </div>
                <h3 className="font-outfit text-[13px] font-bold mb-2" style={{ color: T.cream }}>Co-organizer roles</h3>
                <p className="font-outfit text-[12.5px] leading-relaxed mb-3" style={{ color: T.muted }}>
                  Bring in help without handing over full control:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {ORGANIZER_ROLES.map((r) => (
                    <span key={r} className="font-outfit text-[10px] uppercase tracking-widest px-2.5 py-1 border" style={{ color: T.muted, borderColor: T.border }}>
                      {r}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-6 border" style={{ borderColor: T.border, background: "rgba(254,252,232,0.02)" }}>
                <div className="w-9 h-9 flex items-center justify-center mb-4 border" style={{ borderColor: "rgba(254,252,232,0.08)", background: "rgba(254,252,232,0.03)" }}>
                  <IconFlag size={16} color={T.cream} style={{ opacity: 0.55 }} />
                </div>
                <h3 className="font-outfit text-[13px] font-bold mb-2" style={{ color: T.cream }}>Reviewed before launch</h3>
                <p className="font-outfit text-[12.5px] leading-relaxed" style={{ color: T.muted }}>
                  Every hosted season is reviewed by our team before it goes public
                  or opens for registration — quality control, not a rubber stamp.
                </p>
              </div>
            </div>
            <Link
              href="/host-a-ctf"
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-widest font-outfit"
              style={{ background: T.cream, color: "#0A0A0A" }}
            >
              See how hosting works <IconArrowRight size={14} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
