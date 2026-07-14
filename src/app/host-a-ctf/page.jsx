"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  IconSchool,
  IconBuildingCommunity,
  IconBriefcase,
  IconFileDescription,
  IconClipboardCheck,
  IconRocket,
  IconUsersGroup,
  IconTrophy,
  IconBrandDiscord,
  IconShieldCheck,
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

const AUDIENCES = [
  { icon: IconSchool, title: "Colleges", desc: "Run a campus CTF as a club event, a placement-prep exercise, or a flagship fest activity." },
  { icon: IconBuildingCommunity, title: "Clubs & communities", desc: "Give your security or CS club a real competitive event without building infrastructure from scratch." },
  { icon: IconBriefcase, title: "Companies", desc: "Run internal security training as a competition, or host a public CTF as a recruiting and brand exercise." },
];

const STEPS = [
  { icon: IconFileDescription, title: "Submit your event", desc: "Name, venue, format (solo or team), dates, and participant cap — through a short request form." },
  { icon: IconClipboardCheck, title: "We review it", desc: "Every hosted season is checked by our team before it's approved — quality control on challenge content and event details." },
  { icon: IconRocket, title: "You publish and run it", desc: "Once approved, open registration, add co-organizers, and go live. We handle the infrastructure underneath." },
];

const INCLUDED = [
  { icon: IconUsersGroup, title: "Team & solo formats", desc: "Configure your season as team-based or individual competition." },
  { icon: IconTrophy, title: "Live leaderboard", desc: "Scores update in real time as participants solve challenges — no manual grading." },
  { icon: IconBrandDiscord, title: "Discord integration", desc: "Connect a webhook to push event announcements straight to your community." },
  { icon: IconShieldCheck, title: "Built-in anti-abuse", desc: "Device-bound sessions and rate limiting run under every hosted season, not just ours." },
];

const CASE_STUDIES = [
  {
    image: "/gallery/glaMock.jpg",
    name: "GLAU Mock CTF",
    date: "22 January 2026",
    format: "Solo",
    participants: "300+ participants",
  },
  {
    image: "/gallery/pentest.jpg",
    name: "Pentest Showdown",
    date: "30 January 2026",
    format: "Solo",
    participants: "300+ participants",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
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

export default function HostACtfPage() {
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
                Host A CTF
              </motion.p>
              <motion.h1
                variants={fadeUp}
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(48px, 8vw, 84px)", lineHeight: 0.95, color: T.cream }}
              >
                WE RUN THE<br />INFRASTRUCTURE.
              </motion.h1>
              <motion.p variants={fadeUp} className="font-outfit text-[15px] leading-relaxed max-w-lg mt-5" style={{ color: T.muted }}>
                Bring the challenges and the people. Leaderboards, team management,
                and event hosting are already built — you don&rsquo;t need to write a
                line of code to run a real CTF competition.
              </motion.p>
              <motion.div variants={fadeUp} className="mt-8">
                <a
                  href="mailto:support@gopwnit.com?subject=Hosting%20a%20CTF%20on%20gopwnit"
                  className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-widest font-outfit"
                  style={{ background: T.cream, color: "#0A0A0A" }}
                >
                  Start a Hosting Request <IconArrowRight size={14} />
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Who it's for */}
        <section className="px-7 py-14 border-t" style={{ borderColor: T.border }}>
          <div className="max-w-5xl mx-auto">
            <SectionHead eyebrow="Who It's For" title="Built For Organizers, Not Just Players" />
            <div className="grid sm:grid-cols-3 gap-3">
              {AUDIENCES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="p-6 border" style={{ borderColor: T.border, background: "rgba(254,252,232,0.02)" }}>
                  <div className="w-10 h-10 flex items-center justify-center mb-4 border" style={{ borderColor: "rgba(254,252,232,0.08)", background: "rgba(254,252,232,0.03)" }}>
                    <Icon size={17} color={T.cream} style={{ opacity: 0.55 }} />
                  </div>
                  <h3 className="font-outfit text-[13.5px] font-bold mb-2" style={{ color: T.cream }}>{title}</h3>
                  <p className="font-outfit text-[12.5px] leading-relaxed" style={{ color: T.muted }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="px-7 py-14 border-t" style={{ borderColor: T.border }}>
          <div className="max-w-5xl mx-auto">
            <SectionHead eyebrow="How It Works" title="Three Steps To Launch" />
            <div className="grid sm:grid-cols-3 gap-3">
              {STEPS.map(({ icon: Icon, title, desc }, i) => (
                <div key={title} className="p-6 border relative" style={{ borderColor: T.border, background: "rgba(254,252,232,0.02)" }}>
                  <span className="font-outfit text-[11px] font-bold absolute top-5 right-5" style={{ color: "rgba(254,252,232,0.15)" }}>0{i + 1}</span>
                  <div className="w-10 h-10 flex items-center justify-center mb-4 border" style={{ borderColor: "rgba(254,252,232,0.08)", background: "rgba(254,252,232,0.03)" }}>
                    <Icon size={17} color={T.cream} style={{ opacity: 0.55 }} />
                  </div>
                  <h3 className="font-outfit text-[13.5px] font-bold mb-2" style={{ color: T.cream }}>{title}</h3>
                  <p className="font-outfit text-[12.5px] leading-relaxed" style={{ color: T.muted }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What's included */}
        <section className="px-7 py-14 border-t" style={{ borderColor: T.border }}>
          <div className="max-w-5xl mx-auto">
            <SectionHead eyebrow="What's Included" title="You Don't Build Any Of This" />
            <div className="grid sm:grid-cols-2 gap-3">
              {INCLUDED.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4 p-6 border" style={{ borderColor: T.border, background: "rgba(254,252,232,0.02)" }}>
                  <div className="w-10 h-10 flex items-center justify-center border flex-shrink-0" style={{ borderColor: "rgba(254,252,232,0.08)", background: "rgba(254,252,232,0.03)" }}>
                    <Icon size={17} color={T.cream} style={{ opacity: 0.55 }} />
                  </div>
                  <div>
                    <h3 className="font-outfit text-[13.5px] font-bold mb-1.5" style={{ color: T.cream }}>{title}</h3>
                    <p className="font-outfit text-[12.5px] leading-relaxed" style={{ color: T.muted }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Case studies */}
        <section className="px-7 py-14 border-t" style={{ borderColor: T.border }}>
          <div className="max-w-5xl mx-auto">
            <SectionHead
              eyebrow="Already Hosted"
              title="Two Events In, ~1,000 Players Deep"
              sub="Both were solo-format competitions with 300+ participants each — our first live events, not hypotheticals."
            />
            <div className="grid sm:grid-cols-2 gap-3">
              {CASE_STUDIES.map((cs) => (
                <div key={cs.name} className="relative group overflow-hidden h-64 border" style={{ borderColor: T.border }}>
                  <Image src={cs.image} alt={`${cs.name} CTF competition on gopwnit, ${cs.date}`} fill className="object-cover grayscale" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6" style={{ background: "linear-gradient(to top, rgba(10,10,10,0.95), rgba(10,10,10,0.3))" }}>
                    <h4 className="font-outfit text-xl font-black uppercase mb-1" style={{ color: T.cream }}>{cs.name}</h4>
                    <p className="font-outfit text-[12px] mb-2" style={{ color: T.muted }}>{cs.date}</p>
                    <div className="flex gap-2">
                      <span className="font-outfit text-[10px] uppercase tracking-widest px-2.5 py-1 border" style={{ color: T.cream, borderColor: "rgba(254,252,232,0.25)" }}>{cs.format}</span>
                      <span className="font-outfit text-[10px] uppercase tracking-widest px-2.5 py-1 border" style={{ color: T.cream, borderColor: "rgba(254,252,232,0.25)" }}>{cs.participants}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-7 py-16 border-t" style={{ borderColor: T.border }}>
          <div className="max-w-5xl mx-auto p-8 md:p-10 border flex flex-col md:flex-row md:items-center gap-6 justify-between" style={{ borderColor: T.border, background: "rgba(254,252,232,0.02)" }}>
            <div>
              <h3 className="font-outfit text-xl font-black uppercase tracking-tight mb-2" style={{ color: T.cream }}>
                Ready to run your own event?
              </h3>
              <p className="font-outfit text-[13px]" style={{ color: T.muted }}>
                Email us with your event idea — we&rsquo;ll walk you through the rest.
              </p>
            </div>
            <a
              href="mailto:support@gopwnit.com?subject=Hosting%20a%20CTF%20on%20gopwnit"
              className="flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-widest shrink-0 font-outfit"
              style={{ background: T.cream, color: "#0A0A0A" }}
            >
              support@gopwnit.com <IconArrowRight size={14} />
            </a>
          </div>
          <p className="font-outfit text-[13px] text-center mt-8 max-w-3xl mx-auto" style={{ color: T.muted }}>
            See the full feature set on{" "}
            <Link href="/platform" className="underline decoration-white/20 hover:text-yellow-50" style={{ color: T.cream }}>
              the Platform page
            </Link>
            .
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
