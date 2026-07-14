"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Image from "next/image";
import AnimatedBlurBg from "./AnimatedBlurBg";
import GridBackdrop from "./GridBackdrop";
import HeroCodeDecor from "./HeroCodeDecor";
import Navbar from "../navbar/Navbar";
import Link from "next/link";
import { useAuthModal } from "@/providers/AuthModalProvider";
import abhishek from "@/img/team/Abhishek.webp";
import {
  IconTerminal2,
  IconTrophy,
  IconShieldCheck,
  IconRoad,
  IconCrosshair,
  IconArrowRight,
  IconBolt,
} from "@tabler/icons-react";

const TOKENS = {
  brand: "#E8E4D9",
  brandHover: "#FFFFFF",
  accent: "#1a1a1a",
  bgDeep: "#0A0A0A",
  bgLayer: "rgba(255,255,255,0.01)",
  glassBg: "rgba(14, 14, 14, 0.85)",
  border: "rgba(255, 255, 255, 0.07)",
  borderFocus: "rgba(232, 228, 217, 0.2)",
  textPrimary: "#E8E4D9",
  textMuted: "#6b6b6b",  
};

const ROADMAP = [
  { title: "Beginner Foundations", desc: "Linux, Networking, Scripts" },
  { title: "Web App Security", desc: "OWASP Top 10, XSS, SQLi" },
  { title: "Penetration Testing", desc: "Recon, Enumeration, Exploitation" },
  { title: "Advanced Exploitation", desc: "BinExp, Reverse Engineering, AD" },
];

const FEATURES = [
  {
    icon: <IconTerminal2 size={24} stroke={1.5} />,
    title: "Interactive Hacking Labs",
    desc: "Practice real vulnerabilities in sandboxed environments — no setup, no waiting, just a terminal and a target.",
    href: "/platform",
    cta: "See the labs",
  },
  {
    icon: <IconTrophy size={24} stroke={1.5} />,
    title: "Capture The Flag Challenges",
    desc: "Ten categories, from web exploitation to binary exploitation — real challenges, not multiple-choice quizzes.",
    href: "/platform",
    cta: "See all categories",
  },
  {
    icon: <IconRoad size={24} stroke={1.5} />,
    title: "Structured Learning Paths",
    desc: "From Linux basics to Active Directory attacks — a clear path, not a random pile of challenges.",
    href: "/platform",
    cta: "See the path",
  },
  {
    icon: <IconCrosshair size={24} stroke={1.5} />,
    title: "Skill-Based Ranking System",
    desc: "Live leaderboards for solo and team play — your score updates the instant you solve.",
    href: "/platform",
    cta: "See how scoring works",
  },
  {
    icon: <IconShieldCheck size={24} stroke={1.5} />,
    title: "Host Your Own CTF",
    desc: "Colleges, clubs, and companies host real competitions on gopwnit — team management and live leaderboards included.",
    href: "/host-a-ctf",
    cta: "See how hosting works",
  },
];

const HOME_FAQS = [
  {
    q: "Is gopwnit free to use?",
    a: "Yes. Core training content — hacking labs, CTF challenges, and season participation — is free to access.",
  },
  {
    q: "Do I need prior experience to start?",
    a: "No. The learning path starts with beginner foundations before progressing through web app security, penetration testing, and advanced exploitation.",
  },
  {
    q: "Can my college, club, or company host a CTF on gopwnit?",
    a: "Yes — any organization can host its own CTF season on the platform, with team management, live leaderboards, and challenge hosting handled for you.",
  },
  {
    q: "Is my data stored in India?",
    a: "Yes. Our infrastructure is hosted out of India, and we handle personal data in line with the Digital Personal Data Protection Act, 2023 (India).",
  },
  {
    q: "Is gopwnit affiliated with other platforms like HTB or TryHackMe?",
    a: "No. gopwnit is an independent platform, built and operated by GOPWNIT, a partnership firm based in India.",
  },
];

const HOME_FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HOME_FAQS.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const SectionMarker = ({ number, title, align = "left" }) => (
  <div
    className={`flex items-center gap-4 mb-12 ${
      align === "center" ? "justify-center" : ""
    }`}
  >
    <div
      className="text-sm font-black tracking-[0.2em] font-outfit"
      style={{ color: TOKENS.textMuted }}
    >
      {number}
    </div>
    <div className="h-px w-12" style={{ background: "rgba(255,255,255,0.12)" }}></div>
    <h3 className="text-sm font-bold tracking-[0.2em] uppercase font-outfit" style={{ color: TOKENS.textMuted }}>
      {title}
    </h3>
  </div>
);

const AmbientGlow = ({ color = "#E8E4D9", opacity = 0.03, className = "" }) => (
  <div
    className={`absolute w-[600px] h-[600px] rounded-full mix-blend-screen filter blur-[120px] pointer-events-none z-0 ${className}`}
    style={{
      background: `radial-gradient(circle, ${color}, transparent 75%)`,
      opacity,
    }}
  />
);

const AuxButton = ({ children, primary = true, onClick }) => (
  <button
    onClick={onClick}
    className={`group relative flex items-center gap-3 px-8 py-4 rounded-none font-bold uppercase tracking-widest text-xs font-outfit transition-all duration-300 overflow-hidden`}
    style={
      primary
        ? {
            background: TOKENS.brand,
            color: "#0A0A0A",
          }
        : {
            background: "transparent",
            color: TOKENS.brand,
            border: `1px solid rgba(232,228,217,0.2)`,
          }
    }
  >
    {primary && (
      <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" style={{ background: "#FFFFFF" }} />
    )}
    <span className="relative z-10">{children}</span>
    <IconArrowRight
      size={14}
      className="relative z-10 -rotate-45 group-hover:rotate-0 transition-transform duration-300"
    />
  </button>
);

const InfiniteMarquee = () => (
  <div
    className="w-full overflow-hidden py-4 relative z-20"
    style={{
      background: TOKENS.brand,
      borderTop: "1px solid rgba(255,255,255,0.05)",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
      transform: "rotate(-1.5deg) scale(1.04)",
    }}
  >
    <motion.div
      className="flex whitespace-nowrap gap-12 items-center font-black uppercase tracking-widest text-base font-outfit"
      style={{ color: "#0A0A0A" }}
      animate={{ x: [0, -1000] }}
      transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
    >
      {[...Array(6)].map((_, i) => (
        <span key={i} className="flex items-center gap-12">
          <span>Real-World Labs</span>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#0A0A0A" }} />
          <span>Live CTF Competitions</span>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#0A0A0A" }} />
          <span>Learn Ethical Hacking</span>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#0A0A0A" }} />
          <span>Host Your Own Event</span>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#0A0A0A" }} />
        </span>
      ))}
    </motion.div>
  </div>
);

const TiltCard = ({ children, className = "", style = {} }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", ...style }}
      className={`relative transition-shadow duration-300 group ${className}`}
    >
      <div style={{ transform: "translateZ(30px)" }}>{children}</div>
    </motion.div>
  );
};

export default function Landing() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const router = useRouter();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { openSignUp, openLogin } = useAuthModal();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const handleExploitNow = () => {
    if (isAuthenticated) {
      router.push("/dashboard/labs");
    } else {
      openLogin();
    }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="min-h-screen overflow-x-hidden antialiased selection:bg-white selection:text-black"
      style={{ background: TOKENS.bgDeep, color: TOKENS.textPrimary, fontFamily: "'Outfit', sans-serif" }}
    >
      <GridBackdrop />
      <Navbar />
      <section
        ref={heroRef}
        className="relative min-h-[95vh] flex flex-col justify-center pt-32 pb-20 z-10 text-center"
      >
        <div className="absolute inset-0 z-0">
          <AnimatedBlurBg />
        </div>
        <HeroCodeDecor />

        <div className="container mx-auto px-6 relative z-10 flex-1 flex flex-col justify-center items-center h-full">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-7xl w-full flex flex-col items-center"
          >
            {/* Badge */}
            <motion.div
              variants={fadeUp}
              className="mb-10 font-outfit inline-flex items-center gap-3 px-5 py-2"
              style={{
                border: `1px solid rgba(232,228,217,0.15)`,
                background: "rgba(232,228,217,0.04)",
              }}
            >
              <IconBolt
                size={11}
                className="animate-pulse"
                style={{ color: TOKENS.textMuted }}
              />
              <span
                className="text-xs font-bold tracking-[0.3em] uppercase"
                style={{ color: TOKENS.textMuted }}
              >
                2 Live Events &middot; 300+ Players Each
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="text-5xl md:text-7xl lg:text-[6rem] font-black leading-[1.0] tracking-tighter uppercase mb-10 font-outfit"
              style={{ color: TOKENS.textPrimary }}
            >
              <motion.span variants={fadeUp} className="block whitespace-nowrap">
                Where
              </motion.span>
              <motion.span variants={fadeUp} className="block whitespace-nowrap">
                <span
                  className="text-transparent bg-clip-text"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${TOKENS.brand}, rgba(232,228,217,0.4))`,
                    WebkitBackgroundClip: "text",
                  }}
                >
                  Hackers
                </span>
              </motion.span>
              <motion.span variants={fadeUp} className="block whitespace-nowrap">
                Are Made.
              </motion.span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-base md:text-lg font-medium leading-relaxed max-w-xl mx-auto mb-12"
              style={{ color: TOKENS.textMuted }}
            >
              Practice real vulnerabilities in hands-on labs, compete in live CTF
              competitions, and{" "}
              <Link href="/host-a-ctf" className="underline decoration-white/20 hover:text-white transition-colors" style={{ color: TOKENS.textPrimary }}>
                host your own event
              </Link>
              {" "}— the platform where offensive security skills are built, not just studied.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-wrap justify-center gap-4"
            >
              <AuxButton primary={true} onClick={openSignUp}>
                Start Free Training
              </AuxButton>
              <AuxButton primary={false} onClick={handleExploitNow}>
                Exploit Now
              </AuxButton>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* MARQUEE */}
      <InfiniteMarquee />

      {/* FEATURES BENTO */}
      <section className="py-32 relative z-10 overflow-hidden">
        <AmbientGlow color="#ffffff" opacity={0.025} className="-top-48 -right-48" />
        <div className="container mx-auto px-6 relative z-10">
          <SectionMarker number="01" title="Platform Capabilities" align="center" />
          <h2
            className="text-4xl md:text-5xl font-black font-outfit text-center uppercase tracking-tight mb-16 max-w-3xl mx-auto"
            style={{ color: TOKENS.textPrimary }}
          >
            Everything you need to{" "}
            <span style={{ color: TOKENS.textMuted }}>become elite.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px max-w-6xl mx-auto" style={{ background: TOKENS.border }}>
            {FEATURES.map((feat, i) => (
              <Link
                key={i}
                href={feat.href}
                className={`block group ${
                  i === 0
                    ? "lg:col-span-2 lg:row-span-2"
                    : i === 4
                    ? "lg:col-span-2"
                    : ""
                }`}
              >
                <TiltCard
                  className="p-10 h-full"
                  style={{
                    background: TOKENS.bgDeep,
                  }}
                >
                  {/* Icon — no background, no border */}
                  <div
                    className="mb-8"
                    style={{ color: TOKENS.textMuted }}
                  >
                    {feat.icon}
                  </div>
                  <h3
                    className={`font-black uppercase tracking-tight font-outfit mb-4 ${
                      i === 0 ? "text-4xl" : "text-xl"
                    }`}
                    style={{ color: TOKENS.textPrimary }}
                  >
                    {feat.title}
                  </h3>
                  <p
                    className={`leading-relaxed ${i === 0 ? "text-base max-w-md" : "text-sm"}`}
                    style={{ color: TOKENS.textMuted }}
                  >
                    {feat.desc}
                  </p>

                  <div className="mt-8 flex items-center gap-3 text-xs font-bold tracking-widest uppercase font-outfit transition-colors text-[#6b6b6b] group-hover:text-[#E8E4D9]">
                    <span>{feat.cta}</span>
                    <IconArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </TiltCard>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section
        className="py-32 relative z-10 overflow-hidden"
        style={{ borderTop: `1px solid ${TOKENS.border}`, borderBottom: `1px solid ${TOKENS.border}` }}
      >
        <div className="container mx-auto px-6 relative z-10 max-w-5xl">
          <SectionMarker number="02" title="The Skill Path" align="center" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px mt-16" style={{ background: TOKENS.border }}>
            {ROADMAP.map((step, i) => (
              <TiltCard
                key={i}
                className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-16 justify-between group"
                style={{ background: TOKENS.bgDeep }}
              >
                <div className="flex items-center gap-6 md:gap-12 shrink-0 w-full md:w-auto">
                  <h2
                    className="text-6xl md:text-8xl font-black font-outfit uppercase tracking-tight transition-colors"
                    style={{ color: "rgba(232,228,217,0.08)" }}
                  >
                    0{i + 1}
                  </h2>
                  <div>
                    <h3
                      className="text-2xl md:text-3xl font-black font-outfit uppercase tracking-tight mb-2"
                      style={{ color: TOKENS.textPrimary }}
                    >
                      {step.title}
                    </h3>
                    <p style={{ color: TOKENS.textMuted }}>{step.desc}</p>
                  </div>
                </div>
                <div
                  className="hidden md:flex items-center justify-center w-12 h-12 transition-all shrink-0 group-hover:bg-white/10"
                  style={{ border: `1px solid ${TOKENS.border}` }}
                >
                  <IconArrowRight
                    size={18}
                    className="transition-all group-hover:-rotate-45"
                    style={{ color: TOKENS.textMuted }}
                  />
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDER NOTE */}
      <section className="py-32 relative z-10 overflow-hidden">
        <div className="container mx-auto px-6 max-w-3xl relative z-10">
          <SectionMarker number="03" title="From Our Founder" align="center" />
          <h2
            className="text-4xl md:text-5xl font-black font-outfit text-center uppercase tracking-tight mb-16"
            style={{ color: TOKENS.textPrimary }}
          >
            Why We&rsquo;re{" "}
            <span style={{ color: TOKENS.textMuted }}>Building This.</span>
          </h2>

          <TiltCard className="p-10 md:p-14" style={{ background: TOKENS.bgDeep, border: `1px solid ${TOKENS.border}` }}>
            <div className="text-5xl mb-6 font-serif" style={{ color: "rgba(232,228,217,0.15)" }}>&ldquo;</div>
            <p className="text-lg md:text-xl italic mb-8 font-light leading-relaxed" style={{ color: TOKENS.textMuted }}>
              &ldquo;We built gopwnit because we wanted the hands-on, real-world security
              training we struggled to find as students &mdash; labs and CTFs that teach
              you how systems actually break, not just theory. Every challenge on
              this platform is one we&rsquo;d want to solve ourselves.&rdquo;
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden relative shrink-0">
                <Image src={abhishek} alt="Abhishek Soni" fill className="object-cover" />
              </div>
              <div>
                <h5 className="font-bold font-outfit" style={{ color: TOKENS.textPrimary }}>Abhishek Soni</h5>
                <p className="text-xs uppercase tracking-widest font-outfit" style={{ color: TOKENS.textMuted }}>
                  Founder, gopwnit
                </p>
              </div>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* GALLERY */}
      <section
        className="py-32 relative z-10 overflow-hidden"
        style={{ borderTop: `1px solid ${TOKENS.border}` }}
      >
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <SectionMarker number="04" title="Platform Moments" align="center" />
          <h2
            className="text-4xl md:text-5xl font-black font-outfit text-center uppercase tracking-tight mb-16"
            style={{ color: TOKENS.textPrimary }}
          >
            Experience The{" "}
            <span style={{ color: TOKENS.textMuted }}>Vibe.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ background: TOKENS.border }}>
            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative group overflow-hidden h-72"
            >
              <Image
                src="/gallery/glaMock.jpg"
                alt="Students competing at the GLAU Mock CTF, hosted on gopwnit, January 2026"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 grayscale"
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8"
                style={{ background: "linear-gradient(to top, rgba(10,10,10,0.9), transparent)" }}
              >
                <h4
                  className="text-2xl font-black font-outfit uppercase"
                  style={{ color: TOKENS.textPrimary }}
                >
                  GLAU - Mock CTF
                </h4>
                <p className="text-sm" style={{ color: TOKENS.textMuted }}>
                  22nd January, 2026
                </p>
              </div>
            </motion.div>

            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative group overflow-hidden h-72"
            >
              <Image
                src="/gallery/pentest.jpg"
                alt="Participants at the Pentest Showdown CTF competition on gopwnit, January 2026"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 grayscale"
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8"
                style={{ background: "linear-gradient(to top, rgba(10,10,10,0.9), transparent)" }}
              >
                <h4
                  className="text-2xl font-black font-outfit uppercase"
                  style={{ color: TOKENS.textPrimary }}
                >
                  Pentest Showdown
                </h4>
                <p className="text-sm" style={{ color: TOKENS.textMuted }}>
                  30th January, 2026
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        className="py-32 relative z-10 overflow-hidden"
        style={{ borderTop: `1px solid ${TOKENS.border}` }}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_FAQ_JSON_LD) }}
        />
        <div className="container mx-auto px-6 max-w-3xl relative z-10">
          <SectionMarker number="05" title="Common Questions" align="center" />
          <h2
            className="text-4xl md:text-5xl font-black font-outfit text-center uppercase tracking-tight mb-16"
            style={{ color: TOKENS.textPrimary }}
          >
            Before You{" "}
            <span style={{ color: TOKENS.textMuted }}>Start.</span>
          </h2>

          <div className="flex flex-col">
            {HOME_FAQS.map((item, i) => (
              <motion.div
                key={item.q}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="py-6"
                style={{ borderBottom: i < HOME_FAQS.length - 1 ? `1px solid ${TOKENS.border}` : "none" }}
              >
                <h3 className="text-base font-bold font-outfit mb-2" style={{ color: TOKENS.textPrimary }}>
                  {item.q}
                </h3>
                <p className="text-sm leading-relaxed font-outfit" style={{ color: TOKENS.textMuted }}>
                  {item.a}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest font-outfit"
              style={{ color: TOKENS.textPrimary }}
            >
              See all questions <IconArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}