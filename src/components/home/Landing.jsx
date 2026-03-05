"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Image from "next/image";
import AnimatedBlurBg from "./AnimatedBlurBg";
import Navbar from "./../navbar/Navbar";
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
  brand: "#a855f7",
  brandHover: "#c084fc",
  accent: "#1e1b4b",
  bgDeep: "#020205",
  bgLayer: "rgba(255, 255, 255, 0.01)",
  glassBg: "rgba(8, 8, 12, 0.6)",
  border: "rgba(255, 255, 255, 0.03)",
  borderFocus: "rgba(168, 85, 247, 0.25)",
  textPrimary: "#FFFFFF",
  textMuted: "#94a3b8",
};

const STATS = [
  { value: "10,000+", label: "Learners Trained" },
  { value: "500+", label: "Real-World Labs" },
  { value: "Global", label: "CTF Competitions" },
];

const ROADMAP = [
  { title: "Beginner Foundations", desc: "Linux, Networking, Scripts" },
  { title: "Web App Security", desc: "OWASP Top 10, XSS, SQLi" },
  { title: "Penetration Testing", desc: "Recon, Enumeration, Exploitation" },
  { title: "Advanced Exploitation", desc: "BinExp, Reverse Engineering, AD" },
];

const FEATURES = [
  {
    icon: <IconTerminal2  size={28} weight="duotone" stroke={1.5}  />,
    title: "Interactive Hacking Labs",
    desc: "Practice real vulnerabilities in safe environments.",
  },
  {
    icon: <IconTrophy size={28} weight="duotone" stroke={1.5}  />,
    title: "Capture The Flag Challenges",
    desc: "Test your skills with real-world scenarios.",
  },
  {
    icon: <IconRoad size={28} weight="duotone" stroke={1.5}  />,
    title: "Structured Learning Paths",
    desc: "Step-by-step cybersecurity roadmap.",
  },
  {
    icon: <IconCrosshair size={28} weight="duotone" stroke={1.5}  />,
    title: "Skill-Based Ranking System",
    desc: "Track progress and compete globally.",
  },
  {
    icon: <IconShieldCheck size={28} weight="duotone" stroke={1.5}  />,
    title: "Host Your Own Events",
    desc: "Any organization can host their own CTF events on our platform.",
  },
];

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
      style={{ color: TOKENS.brand }}
    >
      {number}
    </div>
    <div className="h-px w-12 bg-white/20"></div>
    <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-white/60 font-outfit">
      {title}
    </h3>
  </div>
);

const AmbientGlow = ({ color = TOKENS.brand, opacity = 0.1, className = "" }) => (
  <div
    className={`absolute w-[600px] h-[600px] rounded-full mix-blend-screen filter blur-[100px] pointer-events-none z-0 ${className}`}
    style={{
      background: `radial-gradient(circle, ${color}, transparent 75%)`,
      opacity,
    }}
  />
);

const AuxButton = ({ children, primary = true, onClick }) => (
  <button
    onClick={onClick}
    className={`group relative flex items-center gap-3 px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm font-outfit transition-all duration-300 overflow-hidden ${
      primary ? "text-white" : "text-white border"
    }`}
    style={primary ? { background: TOKENS.brand } : { borderColor: TOKENS.border }}
  >
    {primary && (
      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
    )}
    <span className="relative z-10">{children}</span>
    <IconArrowRight
      size={16}
      weight="bold"
      className="relative z-10 -rotate-45 group-hover:rotate-0 transition-transform duration-300"
    />
  </button>
);

const InfiniteMarquee = () => (
  <div
    className="w-full overflow-hidden bg-[#b14eff] py-4 relative z-20 border-y border-white/10"
    style={{ transform: "rotate(-2deg) scale(1.05)" }}
  >
    <motion.div
      className="flex whitespace-nowrap gap-12 items-center text-black font-black uppercase tracking-widest text-xl font-outfit"
      animate={{ x: [0, -1000] }}
      transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
    >
      {[...Array(6)].map((_, i) => (
        <span key={i} className="flex items-center gap-12">
          <span>Real-World Labs</span>
          <span className="w-2 h-2 rounded-full bg-black" />
          <span>Global CTFs</span>
          <span className="w-2 h-2 rounded-full bg-black" />
          <span>Learn Ethical Hacking</span>
          <span className="w-2 h-2 rounded-full bg-black" />
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
      className={`relative rounded-3xl transition-shadow duration-300 hover:shadow-[0_20px_40px_rgba(177,78,255,0.15)] group ${className}`}
    >
      <div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            "linear-linear(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%, rgba(177,78,255,0.05) 100%)",
          transform: "translateZ(1px)",
        }}
      />
      <div style={{ transform: "translateZ(30px)" }}>{children}</div>
    </motion.div>
  );
};

export default function Landing({ onOpenSignUp, onOpenLogin }) {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const router = useRouter();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const handleExploitNow = () => {
    if (isAuthenticated) {
      router.push("/labs");
    } else {
      onOpenLogin();
    }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="min-h-screen text-white font-roundo overflow-x-hidden antialiased selection:bg-[#a855f7] selection:text-white"
      style={{ background: TOKENS.bgDeep }}
    >
            <Navbar onOpenSignUp={onOpenSignUp} onOpenLogin={onOpenLogin} />
      {/* HERO */}
      <section
        ref={heroRef}
        className="relative min-h-[95vh] flex flex-col justify-center pt-32 pb-20 z-10 text-center cursor-none md:cursor-default"
      >
        <div className="absolute inset-0 z-0">
          <AnimatedBlurBg />
          <motion.div
            className="pointer-events-none absolute inset-0 z-10 hidden md:block"
            style={{
              background: `radial-linear(600px circle at ${mouseX}px ${mouseY}px, rgba(168, 85, 247, 0.08), transparent 80%)`,
            }}
          />
        </div>

        <div className="container mx-auto px-6 relative z-10 flex-1 flex flex-col justify-center items-center h-full">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-7xl w-full flex flex-col items-center"
          >
            <motion.div
              variants={fadeUp}
              className="mb-8 font-outfit overflow-hidden inline-flex items-center gap-3 backdrop-blur-xl rounded-full px-5 py-2 border"
              style={{
                borderColor: TOKENS.borderFocus,
                background: "rgba(168, 85, 247, 0.05)",
              }}
            >
              <IconBolt
                size={12}
                weight="fill"
                className="animate-pulse"
                style={{ color: TOKENS.brand }}
              />
              <span
                className="text-xs font-bold tracking-[0.3em] uppercase opacity-80"
                style={{ color: TOKENS.brand }}
              >
                New Exploitation Labs Available
              </span>
            </motion.div>

            <motion.h1
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="text-4xl md:text-6xl lg:text-[5.5rem] font-black leading-[1.1] tracking-tighter uppercase mb-10 font-outfit drop-shadow-2xl brightness-110"
            >
              <motion.span variants={fadeUp} className="block whitespace-nowrap">
                Master Cybersecurity
              </motion.span>
              <motion.span variants={fadeUp} className="block whitespace-nowrap">
                Through{" "}
                <span
                  className="text-transparent bg-clip-text drop-shadow-none"
                  style={{
                    backgroundImage: `linear-linear(to right, ${TOKENS.brand}, ${TOKENS.accent})`,
                    WebkitBackgroundClip: "text",
                  }}
                >
                  Real-World
                </span>
              </motion.span>
              <motion.span variants={fadeUp} className="block whitespace-nowrap">
                Labs.
              </motion.span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg md:text-xl text-zinc-300 font-medium leading-relaxed max-w-2xl mx-auto mb-12 drop-shadow-md"
            >
              Step out of theory. Break into real-world hacking environments,
              learn offensive security, and engage in global CTF challenge arenas.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-wrap justify-center gap-4"
            >
              <AuxButton primary={true} onClick={onOpenSignUp}>
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

      {/* STATS */}
      <section className="py-20 relative z-10 border-b border-white/5 bg-black/20 backdrop-blur-lg">
        <div className="container mx-auto px-6 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-5xl mx-auto">
            {STATS.map((stat, i) => (
              <div key={i} className="space-y-2">
                <div
                  className="text-5xl md:text-6xl font-black font-outfit"
                  style={{ color: TOKENS.brand }}
                >
                  {stat.value}
                </div>
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400 font-outfit">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES BENTO */}
      <section className="py-32 relative z-10 overflow-hidden">
        <AmbientGlow
          color={TOKENS.brand}
          opacity={0.12}
          className="-top-48 -right-48"
        />
        <AmbientGlow
          color={TOKENS.accent}
          opacity={0.08}
          className="bottom-0 -left-64"
        />
        <div className="container mx-auto px-6 relative z-10">
          <SectionMarker number="01" title="Platform Capabilities" align="center" />
          <h2 className="text-4xl md:text-5xl font-black font-outfit text-center uppercase tracking-tight mb-16 max-w-3xl mx-auto">
            Everything you need to{" "}
            <span style={{ color: TOKENS.brand }}>become elite.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {FEATURES.map((feat, i) => (
              <TiltCard
                key={i}
                className={`p-10 border ${
                  i === 0
                    ? "lg:col-span-2 lg:row-span-2"
                    : i === 4
                    ? "lg:col-span-2"
                    : ""
                }`}
                style={{
                  background: TOKENS.glassBg,
                  borderColor: TOKENS.border,
                  borderWidth: "1px",
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-8"
                  style={{
                    color: TOKENS.brand,
                    borderColor: TOKENS.borderFocus,
                  }}
                >
                  {feat.icon}
                </div>
                <h3
                  className={`font-black uppercase tracking-tight font-outfit mb-4 ${
                    i === 0 ? "text-4xl" : "text-2xl"
                  }`}
                >
                  {feat.title}
                </h3>
                <p
                  className={`text-zinc-400 leading-relaxed ${
                    i === 0 ? "text-lg max-w-md" : "text-sm"
                  }`}
                >
                  {feat.desc}
                </p>

                {i === 0 && (
                  <div
                    className="mt-8 flex items-center gap-3 text-sm font-bold tracking-widest uppercase font-outfit"
                    style={{ color: TOKENS.brand }}
                  >
                    <span>Learn More</span>
                    <IconArrowRight size={18} weight="bold" />
                  </div>
                )}
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="py-32 relative z-10 bg-black/40 border-y border-white/5 overflow-hidden">
        <AmbientGlow
          color="#3B82F6"
          opacity={0.07}
          className="top-1/2 -translate-y-1/2 -right-64"
        />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
        <div className="container mx-auto px-6 relative z-10 max-w-5xl">
          <SectionMarker number="02" title="The Skill Path" align="center" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            {ROADMAP.map((step, i) => (
              <TiltCard
                key={i}
                className="p-8 md:p-12 border flex flex-col md:flex-row items-center gap-8 md:gap-16 justify-between group"
                style={{ background: TOKENS.glassBg, borderColor: TOKENS.border }}
              >
                <div className="flex items-center gap-6 md:gap-12 shrink-0 w-full md:w-auto">
                  <h2 className="text-6xl md:text-8xl font-black font-outfit text-white/15 group-hover:text-white/10 transition-colors uppercase tracking-tight">
                    0{i + 1}
                  </h2>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-black font-outfit uppercase tracking-tight mb-2">
                      {step.title}
                    </h3>
                    <p className="text-zinc-400">{step.desc}</p>
                  </div>
                </div>
                <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-full border border-white/10 group-hover:bg-[#b14eff] group-hover:border-[#b14eff] transition-all shrink-0">
                  <IconArrowRight
                    size={24}
                    weight="bold"
                    className="text-white opacity-50 group-hover:opacity-100 group-hover:-rotate-45 transition-all"
                  />
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-32 relative z-10 overflow-hidden">
        <AmbientGlow
          color={TOKENS.brand}
          opacity={0.1}
          className="top-0 -left-64"
        />
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <SectionMarker number="03" title="Learner Feedback" align="center" />
          <h2 className="text-4xl md:text-5xl font-black font-outfit text-center uppercase tracking-tight mb-16">
            Proven by{" "}
            <span style={{ color: TOKENS.brand }}>Professionals.</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <TiltCard
              className="p-10 border"
              style={{ background: TOKENS.glassBg, borderColor: TOKENS.border }}
            >
              <div className="text-5xl text-purple-500/30 mb-6 font-serif">"</div>
              <p className="text-xl text-zinc-300 italic mb-8 font-light">
                "Best platform to learn ethical hacking practically. The transition
                from theory to popping actual shells on the labs is seamless."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-500 to-blue-500" />
                <div>
                  <h5 className="font-bold font-outfit text-lg">Alex M.</h5>
                  <p className="text-sm text-zinc-500 font-outfit uppercase tracking-widest">
                    Security Analyst
                  </p>
                </div>
              </div>
            </TiltCard>
            <TiltCard
              className="p-10 border"
              style={{ background: TOKENS.glassBg, borderColor: TOKENS.border }}
            >
              <div className="text-5xl text-purple-500/30 mb-6 font-serif">"</div>
              <p className="text-xl text-zinc-300 italic mb-8 font-light">
                "Real labs helped me understand vulnerabilities deeply. I went from
                struggling with HTB boxes to ranking high in seasonal CTFs."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-500 to-pink-500" />
                <div>
                  <h5 className="font-bold font-outfit text-lg">Sarah T.</h5>
                  <p className="text-sm text-zinc-500 font-outfit uppercase tracking-widest">
                    Penetration Tester
                  </p>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      <section className="py-32 relative z-10 overflow-hidden bg-black/20">
        <AmbientGlow
          color={TOKENS.accent}
          opacity={0.1}
          className="-bottom-32 -right-32"
        />
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <SectionMarker number="04" title="Platform Moments" align="center" />
          <h2 className="text-4xl md:text-5xl font-black font-outfit text-center uppercase tracking-tight mb-16">
            Experience The <span style={{ color: TOKENS.brand }}>Vibe.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative group overflow-hidden rounded-3xl border border-white/10 h-72"
            >
              <Image
                src="/gallery/glaMock.jpg"
                alt="Hacking Abstract"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                <h4 className="text-2xl font-black font-outfit uppercase">
                  GLAU - Mock CTF
                </h4>
                <p className="text-zinc-400 text-sm">
                  22nd January, 2026
                </p>
              </div>
            </motion.div>

            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative group overflow-hidden rounded-3xl border border-white/10 h-72"
            >
              <Image
                src="/gallery/pentest.jpg"
                alt="CTF Competition"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                <h4 className="text-2xl font-black font-outfit uppercase">
                  Pentest Showdown
                </h4>
                <p className="text-zinc-400 text-sm">
                  30th January, 2026
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}