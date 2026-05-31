"use client";

import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { IconBrandLinkedin, IconMail, IconX } from "@tabler/icons-react";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import aadityaGoyal from "@/img/team/my.webp";
import arjun from "@/img/team/arjunn.webp";
import abhishek from "@/img/team/Abhishek.webp";

const T = {
  bg: "#0A0A0A",
  cream: "#fefce8",
  muted: "#a1a1aa",
  mutedLight: "#a1a1aa",
  border: "rgba(254,252,232,0.2)",
  borderHover: "rgba(254,252,232,0.22)",
};

const reviews = [
  {
    id: 3,
    name: "Abhishek Soni",
    position: "Founder",
    image: abhishek,
    review:
      "Spearheads operational efficiency, manages cross-functional workflows, and ensures seamless execution of organizational initiatives and security programs.",
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
    review:
      "Leads technology strategy, drives research and innovation, and oversees technical development and training throughout the organization.",
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
    review:
      "Drives outreach, builds brand presence, and ensures clear communication across the cybersecurity community.",
    linkedin: "https://linkedin.com/in/geeky-arjun/",
    email: "mailto:arjun.chauhan.hero@gmail.com",
    badge: "CMO",
    expertise: ["Public Relations", "Strategic Communication"],
  },
];

/* ── Subtle tilt card ──────────────────────────────────────────── */
const TiltCard = ({ children, className = "", style = {}, onClick }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(useSpring(y), [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(useSpring(x), [-0.5, 0.5], ["-5deg", "5deg"]);

  return (
    <motion.div
      onClick={onClick}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left) / r.width - 0.5);
        y.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", ...style }}
      className={`relative group h-full ${className}`}
    >
      {children}
    </motion.div>
  );
};

/* ── Member card ───────────────────────────────────────────────── */
const MemberCard = ({ member, onSelect }) => (
  <TiltCard onClick={() => onSelect(member)} className="cursor-pointer">
    <div
      className="h-full flex flex-col items-center text-center p-7 sm:p-9 border transition-all duration-300"
      style={{
        background: "#111111",
        borderColor: T.border,
        borderRadius: "2px",
      }}
    >
      {/* Badge */}
      <div
        className="self-end text-[9px] font-bold tracking-[0.25em] uppercase mb-6"
        style={{ color: T.muted, fontFamily: "Outfit, sans-serif" }}
      >
        {member.badge}
      </div>

      {/* Avatar */}
      <div className="relative mb-6">
        <div
          className="w-20 h-20 sm:w-24 sm:h-24 overflow-hidden"
          style={{ borderRadius: "2px", border: `1px solid ${T.border}` }}
        >
          <Image
            src={member.image}
            alt={member.name}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Name */}
      <h3
        className="text-2xl sm:text-3xl uppercase mb-1 leading-none"
        style={{
          color: T.cream,
          fontFamily: "Roundo, sans-serif",
          letterSpacing: "-0.01em",
        }}
      >
        {member.name}
      </h3>

      {/* Position */}
      <p
        className="text-[10px] uppercase tracking-[0.2em] mb-5"
        style={{ color: T.muted, fontFamily: "Outfit, sans-serif" }}
      >
        {member.position}
      </p>

      {/* Divider */}
      <div
        className="w-8 mb-5"
        style={{ height: "1px", background: T.border }}
      />

      {/* Expertise tags */}
      <div className="flex flex-wrap gap-1.5 justify-center mb-5">
        {member.expertise.map((skill, idx) => (
          <span
            key={idx}
            className="text-[9px] uppercase tracking-widest px-2.5 py-1"
            style={{
              color: T.muted,
              border: `1px solid ${T.border}`,
              borderRadius: "2px",
              fontFamily: "Outfit, sans-serif",
            }}
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Review */}
      <p
        className="text-xs sm:text-sm leading-relaxed line-clamp-3 flex-1"
        style={{ color: T.muted, fontFamily: "Outfit, sans-serif" }}
      >
        {member.review}
      </p>

      {/* Social */}
      <div className="flex gap-3 mt-7">
        {[
          {
            icon: <IconBrandLinkedin size={15} />,
            href: member.linkedin,
            label: `${member.name} LinkedIn`,
            action: (e) => {
              e.stopPropagation();
              window.open(member.linkedin, "_blank", "noopener,noreferrer");
            },
          },
          {
            icon: <IconMail size={15} />,
            href: member.email,
            label: `Email ${member.name}`,
            action: (e) => {
              e.stopPropagation();
              window.location.href = member.email;
            },
          },
        ].map(({ icon, label, action }, i) => (
          <button
            key={i}
            onClick={action}
            aria-label={label}
            className="w-8 h-8 flex items-center justify-center transition-all duration-200"
            style={{
              border: `1px solid ${T.border}`,
              borderRadius: "2px",
              color: T.muted,
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = T.cream;
              e.currentTarget.style.color = T.cream;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = T.border;
              e.currentTarget.style.color = T.muted;
            }}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  </TiltCard>
);

/* ── Modal ─────────────────────────────────────────────────────── */
const MemberModal = ({ member, onClose }) => (
  <AnimatePresence>
    {member && (
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-6"
        style={{
          background: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(8px)",
          zIndex: 200,
        }}
        onClick={onClose}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center transition-all"
          style={{
            border: `1px solid ${T.border}`,
            borderRadius: "2px",
            color: T.muted,
            zIndex: 201,
          }}
          aria-label="Close"
        >
          <IconX size={15} />
        </button>

        <motion.div
          key="modal"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          className="relative w-full sm:max-w-md p-8 sm:p-10 overflow-hidden"
          style={{
            background: "#111111",
            border: `1px solid ${T.border}`,
            borderRadius: "2px",
            zIndex: 200,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag handle (mobile) */}
          <div className="flex justify-center mb-6 sm:hidden">
            <div className="w-8 h-px" style={{ background: T.border }} />
          </div>

          <div className="text-center">
            {/* Avatar */}
            <div
              className="relative w-24 h-24 mx-auto mb-5 overflow-hidden"
              style={{ border: `1px solid ${T.border}`, borderRadius: "2px" }}
            >
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Badge */}
            <div
              className="text-[9px] uppercase tracking-[0.25em] mb-3"
              style={{ color: T.muted, fontFamily: "Outfit, sans-serif" }}
            >
              {member.badge}
            </div>

            {/* Name */}
            <h3
              className="text-3xl sm:text-4xl uppercase mb-1 leading-none"
              style={{ color: T.cream, fontFamily: "Roundo, sans-serif" }}
            >
              {member.name}
            </h3>

            {/* Position */}
            <p
              className="text-[10px] uppercase tracking-[0.2em] mb-6"
              style={{ color: T.muted, fontFamily: "Outfit, sans-serif" }}
            >
              {member.position}
            </p>

            {/* Divider */}
            <div
              className="w-8 mx-auto mb-6"
              style={{ height: "1px", background: T.border }}
            />

            {/* Expertise */}
            <div className="flex flex-wrap gap-1.5 justify-center mb-6">
              {member.expertise.map((skill, idx) => (
                <span
                  key={idx}
                  className="text-[9px] uppercase tracking-widest px-3 py-1"
                  style={{
                    color: T.muted,
                    border: `1px solid ${T.border}`,
                    borderRadius: "2px",
                    fontFamily: "Outfit, sans-serif",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Review */}
            <p
              className="text-sm leading-relaxed mb-7"
              style={{ color: T.muted, fontFamily: "Outfit, sans-serif" }}
            >
              {member.review}
            </p>

            {/* Actions */}
            <div className="flex justify-center gap-3">
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 text-[10px] uppercase tracking-widest transition-all duration-200"
                style={{
                  color: T.bg,
                  background: T.cream,
                  borderRadius: "2px",
                  fontFamily: "Outfit, sans-serif",
                }}
              >
                <IconBrandLinkedin size={13} />
                Connect
              </a>
              <a
                href={member.email}
                className="flex items-center gap-2 px-5 py-2.5 text-[10px] uppercase tracking-widest transition-all duration-200"
                style={{
                  color: T.cream,
                  border: `1px solid ${T.border}`,
                  borderRadius: "2px",
                  fontFamily: "Outfit, sans-serif",
                }}
              >
                <IconMail size={13} />
                Email
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ── Page ──────────────────────────────────────────────────────── */
const ReviewBoard = ({ onOpenSignUp }) => {
  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <div
      className="min-h-screen overflow-x-hidden antialiased"
      style={{ background: T.bg, color: T.cream }}
    >
      <Navbar onOpenSignUp={onOpenSignUp} />

      <main className="container mx-auto px-5 sm:px-8 lg:px-12 py-28 sm:py-36">
        {/* Header */}
        <header className="mb-16 sm:mb-24 max-w-3xl">
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[10px] uppercase tracking-[0.3em] mb-6"
            style={{ color: T.muted, fontFamily: "Outfit, sans-serif" }}
          >
            Visionary Board
          </motion.p>

          {/* Hero heading — Bebas Neue */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="text-6xl sm:text-8xl md:text-9xl uppercase leading-none mb-6"
            style={{
              fontFamily: "Bebas Neue, sans-serif",
              color: T.cream,
              letterSpacing: "-0.03em",
            }}
          >
            Meet Our
            <br />
            <span style={{ color: T.muted }}>Visionaries.</span>
          </motion.h1>

          {/* Thin rule */}
          <div
            className="w-12 mb-6"
            style={{ height: "1px", background: T.border }}
          />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16 }}
            className="text-sm sm:text-base leading-relaxed max-w-xl"
            style={{ color: T.muted, fontFamily: "Outfit, sans-serif" }}
          >
            Pioneering leaders driving innovation with integrity, excellence,
            and unwavering vision.
          </motion.p>
        </header>

        {/* Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
            hidden: {},
          }}
          className="grid gap-px grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          style={{ border: `1px solid ${T.border}` }}
        >
          {reviews.map((member) => (
            <motion.div
              key={member.id}
              className="h-full"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              <MemberCard member={member} onSelect={setSelectedMember} />
            </motion.div>
          ))}
        </motion.div>
      </main>

      <MemberModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
      <Footer />
    </div>
  );
};

export default ReviewBoard;
