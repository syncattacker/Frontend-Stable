"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AnimatedBlurBg from "@/components/home/AnimatedBlurBg";

const T = {
  bg: "#0A0A0A",
  cream: "#fefce8",
  muted: "#a1a1aa",
  border: "rgba(254,252,232,0.08)",
};

const FAQS = [
  {
    q: "Is gopwnit free to use?",
    a: "Yes. Core training content — hacking labs, CTF challenges, and season participation — is free to access.",
  },
  {
    q: "Do I need prior experience to start?",
    a: "No. The learning path starts with beginner foundations (Linux, networking, scripting) before progressing through web app security, penetration testing, and advanced exploitation.",
  },
  {
    q: "What challenge categories are available?",
    a: "Cryptography, Forensics, Reverse Engineering, Binary Exploitation, Web Exploitation, OSINT, Miscellaneous, System / Privilege Escalation, Mobile, and Hardware / IoT.",
  },
  {
    q: "How does scoring and the leaderboard work?",
    a: "Each challenge carries a point value based on difficulty. Solving a challenge adds its points to your score in real time, tracked separately for solo and team leaderboards within each season.",
  },
  {
    q: "Can I compete solo, or do I need a team?",
    a: "Both are supported. Seasons are configured as either solo or team format by the organizer hosting that event.",
  },
  {
    q: "Is my data stored in India?",
    a: "Yes. Our infrastructure is hosted out of India, and we handle personal data in line with the Digital Personal Data Protection Act, 2023 (India). See our Privacy Policy for details.",
  },
  {
    q: "What happens if I delete my account?",
    a: "Account deletion requests are processed within 30 days of verification, subject to a limited set of records we retain for security and compliance — see our Privacy Policy for the full breakdown.",
  },
  {
    q: "Can my college, club, or company host a CTF on gopwnit?",
    a: "Yes — any organization can host its own CTF season on the platform, with team management, live leaderboards, and challenge hosting handled for you.",
  },
  {
    q: "Are hosted CTF events reviewed before they go live?",
    a: "Yes. Every hosted season is reviewed by our team before it becomes publicly visible or open for registration.",
  },
  {
    q: "Is gopwnit affiliated with other platforms like HTB or TryHackMe?",
    a: "No. gopwnit is an independent platform, built and operated by GOPWNIT, a partnership firm based in India.",
  },
  {
    q: "How is my password protected?",
    a: "Your password is encrypted in transit and hashed before storage — we never store or transmit it as plain text.",
  },
  {
    q: "What if I find a security vulnerability?",
    a: "Please report it responsibly — see our Security page and security.txt for our disclosure process and contact details.",
  },
  {
    q: "Can I contribute content or write for gopwnit?",
    a: "Yes — creators can publish articles and guides through the platform. Submissions go through a moderation review before publishing.",
  },
  {
    q: "How do I report a Code of Conduct violation?",
    a: "Email us with a description of the incident, involved usernames, and any evidence. See the Code of Conduct for the full reporting process.",
  },
  {
    q: "What's the difference between labs and CTF seasons?",
    a: "Labs are ongoing, individual practice environments you can use anytime. Seasons are time-boxed competitive events — hosted by us or by an organization — with a leaderboard and a defined start and end.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function FaqPage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: T.bg, color: T.cream }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />
      <Navbar />

      <div className="fixed inset-0 z-0">
        <AnimatedBlurBg />
      </div>

      <main className="relative z-10 flex-1 pt-32">
        <section className="px-7 py-16 md:py-20">
          <div className="max-w-3xl mx-auto">
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.p
                variants={fadeUp}
                className="font-outfit text-[11px] font-bold uppercase tracking-[0.3em] mb-5"
                style={{ color: T.muted }}
              >
                Frequently Asked Questions
              </motion.p>
              <motion.h1
                variants={fadeUp}
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(48px, 8vw, 76px)", lineHeight: 0.95, color: T.cream }}
              >
                QUESTIONS,<br />ANSWERED.
              </motion.h1>
            </motion.div>
          </div>
        </section>

        <section className="px-7 pb-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={stagger}
            className="max-w-3xl mx-auto flex flex-col"
          >
            {FAQS.map((item, i) => (
              <motion.div
                key={item.q}
                variants={fadeUp}
                className="py-6"
                style={{ borderBottom: i < FAQS.length - 1 ? `1px solid ${T.border}` : "none" }}
              >
                <h2 className="font-outfit text-[15px] font-bold mb-2.5" style={{ color: T.cream }}>
                  {item.q}
                </h2>
                <p className="font-outfit text-[13.5px] leading-relaxed" style={{ color: T.muted }}>
                  {item.a}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-outfit text-[13px] text-center mt-10"
            style={{ color: T.muted }}
          >
            Didn&rsquo;t find your answer?{" "}
            <Link href="/contact" className="underline decoration-white/20 hover:text-yellow-50" style={{ color: T.cream }}>
              Contact us
            </Link>
            .
          </motion.p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
