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
import Link from "next/link";
import { IconBrandLinkedin, IconMail, IconX, IconArrowRight } from "@tabler/icons-react";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import aadityaGoyal from "@/img/team/my.webp";
import arjun from "@/img/team/arjunn.webp";
import abhishek from "@/img/team/Abhishek.webp";

const T = {
  bg: "#0A0A0A",
  cream: "#fefce8",
  muted: "#a1a1aa",
  border: "rgba(254,252,232,0.2)",
};

const FACTS = [
  { label: "Legal Entity", value: "GOPWNIT (partnership firm)" },
  { label: "Founded", value: "30 January 2026" },
  { label: "Headquartered", value: "India" },
  { label: "Platform", value: "Cybersecurity labs & CTF competitions" },
  { label: "Team", value: "3 co-founders" },
  { label: "Data residency", value: "India (DPDP Act, 2023 compliant)" },
];

const members = [
  {
    id: 3,
    name: "Abhishek Soni",
    position: "Founder",
    image: abhishek,
    review:
      "Spearheads operational efficiency, manages cross-functional workflows, and ensures seamless execution of organizational initiatives and security programs.",
    linkedin: "https://www.linkedin.com/in/abhishek-soni-89b518250/",
    email: "mailto:support@gopwnit.com",
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
    email: "mailto:support@gopwnit.com",
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
    email: "mailto:support@gopwnit.com",
    badge: "CMO",
    expertise: ["Public Relations", "Strategic Communication"],
  },
];

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

const MemberCard = ({ member, onSelect }) => (
  <TiltCard onClick={() => onSelect(member)} className="cursor-pointer">
    <div
      className="h-full flex flex-col items-center text-center p-7 sm:p-9 border transition-all duration-300"
      style={{ background: "#111111", borderColor: T.border, borderRadius: "2px" }}
    >
      <div className="self-end text-[9px] font-bold tracking-[0.25em] uppercase mb-6 font-outfit" style={{ color: T.muted }}>
        {member.badge}
      </div>
      <div className="relative mb-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 overflow-hidden relative" style={{ borderRadius: "2px", border: `1px solid ${T.border}` }}>
          <Image src={member.image} alt={member.name} fill className="object-cover" />
        </div>
      </div>
      <h3 className="text-2xl sm:text-3xl uppercase mb-1 leading-none font-roundo" style={{ color: T.cream, letterSpacing: "-0.01em" }}>
        {member.name}
      </h3>
      <p className="text-[10px] uppercase tracking-[0.2em] mb-5 font-outfit" style={{ color: T.muted }}>
        {member.position}
      </p>
      <div className="w-8 mb-5" style={{ height: "1px", background: T.border }} />
      <div className="flex flex-wrap gap-1.5 justify-center mb-5">
        {member.expertise.map((skill, idx) => (
          <span key={idx} className="text-[9px] uppercase tracking-widest px-2.5 py-1 font-outfit" style={{ color: T.muted, border: `1px solid ${T.border}`, borderRadius: "2px" }}>
            {skill}
          </span>
        ))}
      </div>
      <p className="text-xs sm:text-sm leading-relaxed line-clamp-3 flex-1 font-outfit" style={{ color: T.muted }}>
        {member.review}
      </p>
      <div className="flex gap-3 mt-7">
        {[
          { icon: <IconBrandLinkedin size={15} />, label: `${member.name} LinkedIn`, action: (e) => { e.stopPropagation(); window.open(member.linkedin, "_blank", "noopener,noreferrer"); } },
          { icon: <IconMail size={15} />, label: `Email ${member.name}`, action: (e) => { e.stopPropagation(); window.location.href = member.email; } },
        ].map(({ icon, label, action }, i) => (
          <button
            key={i}
            onClick={action}
            aria-label={label}
            className="w-8 h-8 flex items-center justify-center transition-all duration-200"
            style={{ border: `1px solid ${T.border}`, borderRadius: "2px", color: T.muted, background: "transparent" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.cream; e.currentTarget.style.color = T.cream; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; }}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  </TiltCard>
);

const MemberModal = ({ member, onClose }) => (
  <AnimatePresence>
    {member && (
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-6"
        style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", zIndex: 200 }}
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center transition-all"
          style={{ border: `1px solid ${T.border}`, borderRadius: "2px", color: T.muted, zIndex: 201 }}
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
          style={{ background: "#111111", border: `1px solid ${T.border}`, borderRadius: "2px", zIndex: 200 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-5 overflow-hidden" style={{ border: `1px solid ${T.border}`, borderRadius: "2px" }}>
              <Image src={member.image} alt={member.name} fill className="object-cover" />
            </div>
            <div className="text-[9px] uppercase tracking-[0.25em] mb-3 font-outfit" style={{ color: T.muted }}>{member.badge}</div>
            <h3 className="text-3xl sm:text-4xl uppercase mb-1 leading-none font-roundo" style={{ color: T.cream }}>{member.name}</h3>
            <p className="text-[10px] uppercase tracking-[0.2em] mb-6 font-outfit" style={{ color: T.muted }}>{member.position}</p>
            <div className="w-8 mx-auto mb-6" style={{ height: "1px", background: T.border }} />
            <div className="flex flex-wrap gap-1.5 justify-center mb-6">
              {member.expertise.map((skill, idx) => (
                <span key={idx} className="text-[9px] uppercase tracking-widest px-3 py-1 font-outfit" style={{ color: T.muted, border: `1px solid ${T.border}`, borderRadius: "2px" }}>
                  {skill}
                </span>
              ))}
            </div>
            <p className="text-sm leading-relaxed mb-7 font-outfit" style={{ color: T.muted }}>{member.review}</p>
            <div className="flex justify-center gap-3">
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 text-[10px] uppercase tracking-widest transition-all duration-200 font-outfit" style={{ color: T.bg, background: T.cream, borderRadius: "2px" }}>
                <IconBrandLinkedin size={13} /> Connect
              </a>
              <a href={member.email} className="flex items-center gap-2 px-5 py-2.5 text-[10px] uppercase tracking-widest transition-all duration-200 font-outfit" style={{ color: T.cream, border: `1px solid ${T.border}`, borderRadius: "2px" }}>
                <IconMail size={13} /> Email
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default function AboutPage() {
  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <div className="min-h-screen overflow-x-hidden antialiased" style={{ background: T.bg, color: T.cream }}>
      <Navbar />

      <main className="container mx-auto px-5 sm:px-8 lg:px-12 py-28 sm:py-36">
        {/* Hero */}
        <header className="mb-16 sm:mb-20 max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[10px] uppercase tracking-[0.3em] mb-6 font-outfit"
            style={{ color: T.muted }}
          >
            About gopwnit
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="text-6xl sm:text-8xl md:text-9xl uppercase leading-none mb-6"
            style={{ fontFamily: "Bebas Neue, sans-serif", color: T.cream, letterSpacing: "-0.03em" }}
          >
            Built By People
            <br />
            <span style={{ color: T.muted }}>Who Play.</span>
          </motion.h1>
          <div className="w-12 mb-6" style={{ height: "1px", background: T.border }} />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16 }}
            className="text-sm sm:text-base leading-relaxed max-w-xl font-outfit"
            style={{ color: T.muted }}
          >
            gopwnit is a cybersecurity skills platform where individuals learn offensive
            security through hands-on labs and CTF competitions, and organizations host
            their own CTF events — built and hosted in India.
          </motion.p>
        </header>

        {/* Facts block */}
        <section className="mb-20 sm:mb-28">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ border: `1px solid ${T.border}`, background: T.border }}>
            {FACTS.map((fact) => (
              <div key={fact.label} className="p-6" style={{ background: T.bg }}>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] block mb-2 font-outfit" style={{ color: T.muted }}>
                  {fact.label}
                </span>
                <span className="text-base font-semibold font-outfit" style={{ color: T.cream }}>
                  {fact.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section className="mb-20 sm:mb-28 max-w-3xl">
          <span className="text-[10px] uppercase tracking-[0.3em] mb-6 block font-outfit" style={{ color: T.muted }}>
            Our Mission
          </span>
          <p className="text-xl sm:text-2xl leading-relaxed font-light font-outfit" style={{ color: "rgba(254,252,232,0.85)" }}>
            We&rsquo;re building the most realistic and hands-on offensive security
            platform we can — one that teaches real-world skills through immersive
            labs, competitive CTF challenges, and a community-driven learning
            environment, rather than theory alone.
          </p>
          <p className="text-base leading-relaxed mt-5 font-outfit" style={{ color: T.muted }}>
            gopwnit also gives colleges, clubs, and companies the infrastructure to
            host their own CTF events — team management, live leaderboards, and
            challenge hosting, without building it themselves.{" "}
            <Link href="/host-a-ctf" className="underline decoration-white/20 hover:text-yellow-50" style={{ color: T.cream }}>
              See how hosting works
            </Link>
            .
          </p>
        </section>

        {/* Team */}
        <section>
          <span className="text-[10px] uppercase tracking-[0.3em] mb-8 block font-outfit" style={{ color: T.muted }}>
            The Team
          </span>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } }, hidden: {} }}
            className="grid gap-px grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            style={{ border: `1px solid ${T.border}` }}
          >
            {members.map((member) => (
              <motion.div
                key={member.id}
                className="h-full"
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }}
              >
                <MemberCard member={member} onSelect={setSelectedMember} />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Editorial standards */}
        <section className="mt-20 sm:mt-28 max-w-3xl">
          <span className="text-[10px] uppercase tracking-[0.3em] mb-6 block font-outfit" style={{ color: T.muted }}>
            How We Write
          </span>
          <p className="text-base leading-relaxed font-outfit" style={{ color: T.muted }}>
            Articles on the{" "}
            <Link href="/blog" className="underline decoration-white/20 hover:text-yellow-50" style={{ color: T.cream }}>
              gopwnit blog
            </Link>{" "}
            are written by named team members and community contributors, each
            with a byline linking to their author page. Technical claims are
            checked against what the platform actually does before publishing,
            and corrections are made openly rather than quietly edited away.
          </p>
        </section>

        {/* CTA */}
        <section className="mt-20 sm:mt-28 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-8 sm:p-10 border" style={{ borderColor: T.border }}>
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight mb-2 font-outfit" style={{ color: T.cream }}>
              Want to work with us?
            </h3>
            <p className="text-sm font-outfit" style={{ color: T.muted }}>
              Reach out about partnerships, hosting, or joining the team.
            </p>
          </div>
          <a
            href="mailto:support@gopwnit.com"
            className="flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-widest shrink-0 font-outfit"
            style={{ background: T.cream, color: "#0A0A0A" }}
          >
            support@gopwnit.com <IconArrowRight size={14} />
          </a>
        </section>
      </main>

      <MemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />
      <Footer />
    </div>
  );
}
