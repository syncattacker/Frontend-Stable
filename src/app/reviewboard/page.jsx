"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { Linkedin, Mail, X } from "lucide-react";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import aadityaGoyal from "@/img/team/my.webp";
import arjun from "@/img/team/arjunn.webp";
import abhishek from "@/img/team/Abhishek.webp";

const TOKENS = {
  brand: "#a855f7",
  brandHover: "#c084fc",
  accent: "#1e1b4b",
  bgDeep: "#020205",
  glassBg: "rgba(8, 8, 12, 0.6)",
  border: "rgba(255, 255, 255, 0.03)",
  borderFocus: "rgba(168, 85, 247, 0.25)",
};

const reviews = [
  {
    id: 3,
    name: "Abhishek Soni",
    position: "Founder",
    image: abhishek,
    review: "Spearheads operational efficiency, manages cross-functional workflows, and ensures seamless execution of organizational initiatives and security programs.",
    linkedin: "https://www.linkedin.com/in/abhishek-soni-89b518250/",
    email: "mailto:sharmay728@gmail.com",
    badge: "FOUNDER",
    expertise: ["Operations", "Strategy", "Execution"],
  },
  {
    id: 1,
    name: "Aaditya Goyal",
    position: "Chief Technology Officer",
    image: aadityaGoyal,
    review: "Leads technology strategy, drives research and innovation, and oversees technical development and training throughout the organization.",
    linkedin: "https://linkedin.com/in/aadityagoyal-net/",
    email: "mailto:aadityagoyalofficial@gmail.com",
    badge: "CTO",
    expertise: ["Development", "Research", "Innovation"],
  },
  {
    id: 2,
    name: "Arjun Chauhan",
    position: "Communication and Marketing Officer",
    image: arjun,
    review: "Drives outreach, builds brand presence, and ensures clear communication across the cybersecurity community.",
    linkedin: "https://linkedin.com/in/geeky-arjun/",
    email: "mailto:arjun.chauhan.hero@gmail.com",
    badge: "CMO",
    expertise: ["Public Relations", "Strategic Communication"],
  },
];

const AmbientGlow = ({ color = TOKENS.brand, opacity = 0.1, className = "" }) => (
  <div
    className={`absolute w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] rounded-full mix-blend-screen filter blur-[100px] sm:blur-[150px] pointer-events-none ${className}`}
    style={{ background: `radial-gradient(circle, ${color}, transparent 75%)`, opacity }}
  />
);

const TiltCard = ({ children, className = "", style = {}, onClick }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  return (
    <motion.div
      onClick={onClick}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", ...style }}
      className={`relative rounded-2xl sm:rounded-3xl transition-shadow duration-300 hover:shadow-[0_20px_60px_rgba(168,85,247,0.1)] group h-full ${className}`}
    >
      <div
        className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 50%, rgba(168,85,247,0.05) 100%)",
          transform: "translateZ(1px)",
        }}
      />
      <div style={{ transform: "translateZ(30px)" }}>{children}</div>
    </motion.div>
  );
};

const MemberCard = ({ member, onSelect }) => (
  <TiltCard
    onClick={() => onSelect(member)}
    className="p-6 sm:p-8 lg:p-10 border overflow-hidden cursor-pointer h-full"
    style={{ background: TOKENS.glassBg, borderColor: TOKENS.border }}
  >
    <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-[#a855f7] text-white text-[9px] sm:text-[10px] font-black tracking-widest px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-lg font-outfit uppercase z-20">
      {member.badge}
    </div>

    <div className="flex flex-col items-center text-center h-full justify-between">
      <div className="relative mb-6 sm:mb-8">
        <div className="absolute inset-0 bg-[#a855f7]/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full border border-white/10 p-1 bg-white/5 overflow-hidden drop-shadow-2xl">
          <Image src={member.image} alt={member.name} fill className="object-cover rounded-full" />
        </div>
        <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-3 h-3 sm:w-4 sm:h-4 bg-[#a855f7] rounded-full border-2 border-black shadow-lg">
          <div className="w-full h-full bg-[#a855f7] rounded-full animate-ping opacity-75" />
        </div>
      </div>

      <h3 className="text-lg sm:text-xl lg:text-2xl font-black font-outfit uppercase tracking-tight text-white mb-1.5 sm:mb-2 group-hover:text-[#c084fc] transition-colors leading-tight">
        {member.name}
      </h3>
      <p className="text-[#a855f7] text-[10px] sm:text-xs font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase mb-4 sm:mb-6 font-outfit leading-relaxed px-2">
        {member.position}
      </p>

      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-5 sm:mb-8 justify-center">
        {member.expertise.map((skill, idx) => (
          <span key={idx} className="text-[9px] sm:text-[10px] uppercase font-black tracking-widest bg-white/5 text-zinc-400 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-white/5">
            {skill}
          </span>
        ))}
      </div>

      <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed line-clamp-3 font-medium px-1">
        {member.review}
      </p>

      <div className="flex gap-3 sm:gap-4 mt-6 sm:mt-8">
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(member.linkedin, "_blank", "noopener,noreferrer"); }}
          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-[#a855f7] hover:border-[#a855f7] transition-all group/social"
          aria-label={`${member.name} LinkedIn`}
        >
          <Linkedin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400 group-hover/social:text-white transition-colors" />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = member.email; }}
          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-white/10 bg-white/5 hover:bg-[#a855f7] hover:border-[#a855f7] transition-all group/social"
          aria-label={`Email ${member.name}`}
        >
          <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-400 group-hover/social:text-white transition-colors" />
        </button>
      </div>
    </div>
  </TiltCard>
);

const MemberModal = ({ member, onClose }) => {
  return (
    <AnimatePresence>
      {member && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-6"
          style={{ zIndex: 200 }}
          onClick={onClose}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
            style={{ zIndex: 201 }}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 60 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 60 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative bg-[#08080c] border border-white/10 w-full sm:max-w-xl rounded-t-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 md:p-10 shadow-2xl overflow-hidden"
            style={{ zIndex: 200 }}
            onClick={(e) => e.stopPropagation()}
          >
            <AmbientGlow color={TOKENS.brand} opacity={0.1} className="-top-48 -right-48" />

            <div className="flex justify-center mb-4 sm:hidden">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            <div className="relative z-10 text-center">
              <div className="relative mb-4 sm:mb-6 w-24 h-24 sm:w-32 sm:h-32 mx-auto">
                <div className="absolute inset-0 bg-[#a855f7]/30 rounded-full blur-3xl" />
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-[#a855f7]/30 p-1.5 bg-white/5 mx-auto overflow-hidden">
                  <Image src={member.image} alt={member.name} fill className="object-cover rounded-full" />
                </div>
                <div className="absolute -top-1 -right-1 bg-[#a855f7] text-white text-[9px] sm:text-[10px] font-black tracking-widest px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-lg z-20 font-outfit uppercase">
                  {member.badge}
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black font-outfit uppercase tracking-tight text-white mb-1.5 sm:mb-2 leading-tight">
                {member.name}
              </h3>
              <p className="text-[#a855f7] font-bold text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase mb-4 sm:mb-5 font-outfit leading-relaxed px-4">
                {member.position}
              </p>

              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6 justify-center">
                {member.expertise.map((skill, idx) => (
                  <span key={idx} className="text-[10px] sm:text-xs font-black tracking-widest uppercase bg-white/5 text-zinc-300 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full border border-white/10 backdrop-blur-sm">
                    {skill}
                  </span>
                ))}
              </div>

              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-5 sm:mb-7 font-light italic px-2">
                &quot;{member.review}&quot;
              </p>

              <div className="flex flex-row flex-wrap justify-center gap-3 sm:gap-4">
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-black uppercase tracking-widest text-xs font-outfit transition-all bg-[#a855f7] hover:bg-[#c084fc] text-white shadow-xl shadow-purple-950/20 active:scale-95"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>Connect</span>
                </a>
                <a
                  href={member.email}
                  className="flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-black uppercase tracking-widest text-xs font-outfit transition-all border border-white/10 text-white hover:bg-white/5 active:scale-95"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ReviewBoard = ({ onOpenSignUp }) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  return (
    <div
      onMouseMove={(e) => { mouseX.set(e.clientX); mouseY.set(e.clientY); }}
      className="min-h-screen text-white font-roundo overflow-x-hidden antialiased selection:bg-[#a855f7] selection:text-white"
      style={{ background: TOKENS.bgDeep }}
    >
      <Navbar onOpenSignUp={onOpenSignUp} />

      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <AmbientGlow color={TOKENS.brand} opacity={0.08} className="top-0 -left-24 sm:-left-48" />
        <AmbientGlow color={TOKENS.accent} opacity={0.05} className="bottom-0 -right-24 sm:-right-48" />
        <motion.div
          className="pointer-events-none absolute inset-0 z-10 hidden md:block"
          style={{
            background: `radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(168, 85, 247, 0.04), transparent 80%)`,
          }}
        />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 relative z-10">
        <header className="text-center mb-14 sm:mb-20 lg:mb-24 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 sm:mb-8 inline-flex items-center gap-2 sm:gap-3 backdrop-blur-xl rounded-full px-4 sm:px-5 py-1.5 sm:py-2 border border-white/5 bg-white/5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7] animate-pulse" />
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase opacity-80" style={{ color: TOKENS.brand }}>
              Visionary Board
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-outfit uppercase tracking-tighter mb-6 sm:mb-8 leading-[0.9] text-white drop-shadow-2xl"
          >
            Meet Our{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: `linear-gradient(to right, ${TOKENS.brand}, ${TOKENS.brandHover})`, WebkitBackgroundClip: "text" }}
            >
              Visionaries.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg lg:text-xl text-zinc-400 font-light leading-relaxed max-w-2xl mx-auto px-4 sm:px-0"
          >
            Pioneering leaders driving innovation with{" "}
            <span className="text-white font-medium">integrity</span>,{" "}
            <span className="text-white font-medium">excellence</span>, and{" "}
            <span className="text-white font-medium">unwavering vision</span>.
          </motion.p>
        </header>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.12 } },
            hidden: {},
          }}
          className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {reviews.map((member) => (
            <motion.div
              key={member.id}
              className="h-full"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
              }}
            >
              <MemberCard member={member} onSelect={setSelectedMember} />
            </motion.div>
          ))}
        </motion.div>
      </main>

      <MemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />

      <Footer />
    </div>
  );
};

export default ReviewBoard;