"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  IconClock,
  IconPackage,
  IconColumns,
  IconCheck,
  IconMapPin,
  IconServer,
  IconSettings,
  IconShieldCheck,
  IconRocket,
  IconClipboardCheck,
  IconUsersGroup,
  IconTrophy,
  IconChartBar,
  IconCertificate,
  IconSparkles,
  IconMail,
  IconPhone,
  IconWorld,
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

const PHILOSOPHY = [
  {
    n: "01",
    icon: IconClock,
    title: "Duration-Based",
    desc: "Pick your event length. 8 hours or 48 hours — the price scales with time, not headcount.",
  },
  {
    n: "02",
    icon: IconPackage,
    title: "Everything Included",
    desc: "Infrastructure, monitoring, leaderboard, certificates, support. All in the price. No add-ons.",
  },
  {
    n: "03",
    icon: IconColumns,
    title: "Two Clear Options",
    desc: "Bring your own challenges (Platform Hosting) or let us build everything (Managed CTF). Your call.",
  },
];

const PLATFORM_PACKAGES = [
  { name: "Rookie", duration: "Up to 8–10 Hours", price: "₹14,999" },
  { name: "Hacker", duration: "Up to 12 Hours", price: "₹19,999", popular: true },
  { name: "Elite", duration: "Up to 18 Hours", price: "₹24,499" },
  { name: "Legend", duration: "Up to 24 Hours", price: "₹28,499" },
  { name: "Master", duration: "Up to 48 Hours", price: "₹31,999" },
];

const PLATFORM_INCLUDED = [
  "Dedicated CTF event environment",
  "Event setup & configuration",
  "Secure CTF infrastructure",
  "Challenge deployment",
  "Registration portal",
  "Team & participant management",
  "Live scoreboard & dynamic leaderboard",
  "Real-time event monitoring",
  "Remote technical support",
  "Winner verification",
  "Digital certificates",
  "Event analytics & report",
  "Basic event branding",
  "Infrastructure management & backup",
];

const MANAGED_PACKAGES = [
  { name: "Rookie", duration: "Up to 8–10 Hours", price: "₹21,999" },
  { name: "Hacker", duration: "Up to 12 Hours", price: "₹26,999", popular: true },
  { name: "Elite", duration: "Up to 18 Hours", price: "₹31,499" },
  { name: "Legend", duration: "Up to 24 Hours", price: "₹35,499" },
  { name: "Master", duration: "Up to 48 Hours", price: "₹38,999" },
];

const MANAGED_EXTRA = [
  "Custom CTF design for your audience",
  "Custom challenge development",
  "Challenge testing & validation",
  "Per-user HMAC flag generation",
  "Multi-tier difficulty balancing",
  "Hint configuration & progressive reveal",
  "Challenge quality assurance",
  "End-to-end event planning",
  "Solution documentation",
  "6 challenge categories covered",
];

const ONSITE_FEATURES = [
  "On-site event monitoring",
  "Live technical assistance",
  "Immediate issue resolution",
  "Participant support",
  "Organizer coordination",
];

const FINE_PRINT = [
  "Prices are exclusive of applicable taxes (GST, if applicable).",
  "Every package includes remote technical support during the event.",
  "Pricing is based solely on the selected event duration — not participant count.",
  "Events requiring specialized infrastructure (AD labs, cloud labs, VPN, custom VMs, attack-defense) will be quoted separately.",
  "Event duration begins from the official start time.",
  "Extensions beyond the booked duration are billed only after client approval.",
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

function PricingTable({ packages }) {
  return (
    <div className="border" style={{ borderColor: T.border }}>
      {/* header row */}
      <div
        className="hidden sm:grid grid-cols-[1.4fr_1.6fr_1fr] px-6 py-3.5 border-b"
        style={{ borderColor: T.border, background: "rgba(254,252,232,0.02)" }}
      >
        {["Package", "Event Duration", "Price"].map((h, i) => (
          <span
            key={h}
            className={`font-outfit text-[10px] font-bold uppercase tracking-[0.25em] ${i === 2 ? "text-right" : ""}`}
            style={{ color: T.muted }}
          >
            {h}
          </span>
        ))}
      </div>

      {packages.map((p, i) => (
        <div
          key={p.name}
          className="grid grid-cols-2 sm:grid-cols-[1.4fr_1.6fr_1fr] items-center px-6 py-5 gap-y-1"
          style={{
            borderTop: i === 0 ? "none" : `1px solid ${T.border}`,
            background: p.popular ? "rgba(254,252,232,0.045)" : "transparent",
          }}
        >
          <div className="flex items-center gap-2.5">
            <span className="font-outfit text-[15px] font-bold" style={{ color: T.cream }}>
              {p.name}
            </span>
            {p.popular && (
              <span
                className="font-outfit text-[8.5px] font-bold uppercase tracking-[0.2em] px-2 py-0.5"
                style={{ background: T.cream, color: "#0A0A0A" }}
              >
                Most Popular
              </span>
            )}
          </div>

          <span className="font-outfit text-[12.5px] order-3 sm:order-none col-span-2 sm:col-span-1" style={{ color: T.muted }}>
            {p.duration}
          </span>

          <span
            className="font-outfit text-[17px] font-black text-right"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.02em", color: T.cream }}
          >
            {p.price}
          </span>
        </div>
      ))}
    </div>
  );
}

function FeatureList({ items, columns = 2 }) {
  return (
    <div className={`grid gap-x-6 gap-y-2.5 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
      {items.map((f) => (
        <div key={f} className="flex items-start gap-2.5">
          <IconCheck size={14} color={T.cream} style={{ opacity: 0.6, marginTop: 2, flexShrink: 0 }} />
          <span className="font-outfit text-[12.5px] leading-relaxed" style={{ color: T.muted }}>
            {f}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function PricingPage() {
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
                Services &amp; Pricing — 2026
              </motion.p>
              <motion.h1
                variants={fadeUp}
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(48px, 8vw, 84px)", lineHeight: 0.95, color: T.cream }}
              >
                CTF HOSTING.<br />DONE RIGHT.
              </motion.h1>
              <motion.p variants={fadeUp} className="font-outfit text-[15px] leading-relaxed max-w-lg mt-5" style={{ color: T.muted }}>
                Simple pricing. No per-user fees. No hidden charges. Just pick your
                event duration and go.
              </motion.p>
              <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#pricing"
                  className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-widest font-outfit"
                  style={{ background: T.cream, color: "#0A0A0A" }}
                >
                  See Pricing <IconArrowRight size={14} />
                </a>
                <a
                  href="mailto:gopwnit@gmail.com?subject=CTF%20Event%20Enquiry"
                  className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-widest font-outfit border"
                  style={{ color: T.cream, borderColor: "rgba(254,252,232,0.25)" }}
                >
                  Talk To Us
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Philosophy */}
        <section className="px-7 py-14 border-t" style={{ borderColor: T.border }}>
          <div className="max-w-5xl mx-auto">
            <SectionHead
              eyebrow="Our Pricing Philosophy"
              title="Your Cost Shouldn't Depend On Headcount"
              sub="Every other platform charges per user — the more successful your event, the more it costs. We think that's backwards. Our pricing is based on one thing: how long your event runs."
            />
            <div className="grid sm:grid-cols-3 gap-3">
              {PHILOSOPHY.map(({ n, icon: Icon, title, desc }) => (
                <div key={title} className="p-6 border relative" style={{ borderColor: T.border, background: "rgba(254,252,232,0.02)" }}>
                  <span className="font-outfit text-[11px] font-bold absolute top-5 right-5" style={{ color: "rgba(254,252,232,0.15)" }}>{n}</span>
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

        {/* Option A — Platform Hosting */}
        <section id="pricing" className="px-7 py-14 border-t" style={{ borderColor: T.border }}>
          <div className="max-w-5xl mx-auto">
            <SectionHead
              eyebrow="Option A"
              title="Platform Hosting"
              sub="You provide the challenges. We provide the platform and manage your event."
            />
            <PricingTable packages={PLATFORM_PACKAGES} />

            <div className="mt-8 p-6 md:p-8 border" style={{ borderColor: T.border, background: "rgba(254,252,232,0.02)" }}>
              <div className="flex items-center gap-2.5 mb-6">
                <IconServer size={16} color={T.cream} style={{ opacity: 0.55 }} />
                <span className="font-outfit text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: T.muted }}>
                  Included In Every Package
                </span>
              </div>
              <FeatureList items={PLATFORM_INCLUDED} columns={2} />
            </div>
          </div>
        </section>

        {/* Option B — Managed CTF */}
        <section className="px-7 py-14 border-t" style={{ borderColor: T.border }}>
          <div className="max-w-5xl mx-auto">
            <SectionHead
              eyebrow="Option B — Full Service"
              title="Managed CTF"
              sub="We design, build, host, and manage your complete CTF event. End to end."
            />
            <PricingTable packages={MANAGED_PACKAGES} />

            <div className="mt-8 p-6 md:p-8 border" style={{ borderColor: T.border, background: "rgba(254,252,232,0.02)" }}>
              <div className="flex items-center gap-2.5 mb-6">
                <IconSparkles size={16} color={T.cream} style={{ opacity: 0.55 }} />
                <span className="font-outfit text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: T.muted }}>
                  Everything In Platform Hosting, Plus
                </span>
              </div>
              <FeatureList items={MANAGED_EXTRA} columns={2} />
            </div>
          </div>
        </section>

        {/* Add-on — On-Site Support */}
        <section className="px-7 py-14 border-t" style={{ borderColor: T.border }}>
          <div className="max-w-5xl mx-auto">
            <SectionHead eyebrow="Add-On" title="On-Site Support" />
            <div className="border p-6 md:p-8 flex flex-col md:flex-row gap-8 md:items-center" style={{ borderColor: T.border, background: "rgba(254,252,232,0.02)" }}>
              <div className="md:w-72 md:shrink-0 md:border-r md:pr-8" style={{ borderColor: T.border }}>
                <div className="w-10 h-10 flex items-center justify-center mb-4 border" style={{ borderColor: "rgba(254,252,232,0.08)", background: "rgba(254,252,232,0.03)" }}>
                  <IconMapPin size={17} color={T.cream} style={{ opacity: 0.55 }} />
                </div>
                <p className="font-outfit text-[13px] leading-relaxed mb-4" style={{ color: T.muted }}>
                  Need a GoPwnit engineer at your venue? We&rsquo;ll be there.
                </p>
                <div className="flex items-baseline gap-2">
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 34, lineHeight: 1, color: T.cream }}>₹5,000</span>
                  <span className="font-outfit text-[12px]" style={{ color: T.muted }}>per event</span>
                </div>
                <p className="font-outfit text-[11px] leading-relaxed mt-2" style={{ color: "rgba(161,161,170,0.75)" }}>
                  + Actual travel &amp; accommodation costs, billed at actuals — no markups.
                </p>
              </div>
              <div className="flex-1">
                <FeatureList items={ONSITE_FEATURES} columns={2} />
              </div>
            </div>
          </div>
        </section>

        {/* Fine print */}
        <section className="px-7 py-14 border-t" style={{ borderColor: T.border }}>
          <div className="max-w-5xl mx-auto">
            <SectionHead eyebrow="Fine Print" title="No Surprises" />
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
              {FINE_PRINT.map((line) => (
                <div key={line} className="flex items-start gap-2.5">
                  <span className="font-outfit" style={{ color: "rgba(254,252,232,0.3)" }}>—</span>
                  <span className="font-outfit text-[12.5px] leading-relaxed" style={{ color: T.muted }}>{line}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Get started / contact */}
        <section className="px-7 py-16 border-t" style={{ borderColor: T.border }}>
          <div className="max-w-5xl mx-auto">
            <div className="p-8 md:p-10 border" style={{ borderColor: T.border, background: "rgba(254,252,232,0.02)" }}>
              <span className="font-outfit text-[10px] font-bold uppercase tracking-[0.3em] block mb-4" style={{ color: T.muted }}>
                Get Started
              </span>
              <h3 className="font-outfit text-2xl md:text-3xl font-black uppercase tracking-tight mb-3" style={{ color: T.cream }}>
                Let&rsquo;s Talk.
              </h3>
              <p className="font-outfit text-[13.5px] leading-relaxed max-w-lg mb-8" style={{ color: T.muted }}>
                No pitch deck. No sales funnel. Just a conversation about your event
                and whether we&rsquo;re the right fit. Drop us a message — we usually
                respond within a few hours.
              </p>

              <div className="grid sm:grid-cols-3 gap-3">
                <a href="mailto:gopwnit@gmail.com" className="flex items-center gap-3 p-4 border group transition-colors" style={{ borderColor: T.border, background: "rgba(254,252,232,0.02)" }}>
                  <IconMail size={17} color={T.cream} style={{ opacity: 0.55 }} />
                  <div>
                    <p className="font-outfit text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: T.muted }}>Email</p>
                    <p className="font-outfit text-[12.5px] font-bold" style={{ color: T.cream }}>gopwnit@gmail.com</p>
                  </div>
                </a>
                <a href="tel:+918630173936" className="flex items-center gap-3 p-4 border" style={{ borderColor: T.border, background: "rgba(254,252,232,0.02)" }}>
                  <IconPhone size={17} color={T.cream} style={{ opacity: 0.55 }} />
                  <div>
                    <p className="font-outfit text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: T.muted }}>Phone</p>
                    <p className="font-outfit text-[12.5px] font-bold" style={{ color: T.cream }}>+91-8630173936</p>
                  </div>
                </a>
                <Link href="/" className="flex items-center gap-3 p-4 border" style={{ borderColor: T.border, background: "rgba(254,252,232,0.02)" }}>
                  <IconWorld size={17} color={T.cream} style={{ opacity: 0.55 }} />
                  <div>
                    <p className="font-outfit text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: T.muted }}>Web</p>
                    <p className="font-outfit text-[12.5px] font-bold" style={{ color: T.cream }}>www.gopwnit.com</p>
                  </div>
                </Link>
              </div>
            </div>

            <p className="font-outfit text-[13px] text-center mt-8 max-w-3xl mx-auto" style={{ color: T.muted }}>
              Want to run your own event first?{" "}
              <Link href="/host-a-ctf" className="underline decoration-white/20 hover:text-yellow-50" style={{ color: T.cream }}>
                See how hosting works
              </Link>
              .
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}