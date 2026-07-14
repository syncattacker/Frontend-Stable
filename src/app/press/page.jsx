"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { IconMail, IconCopy, IconArrowRight } from "@tabler/icons-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AnimatedBlurBg from "@/components/home/AnimatedBlurBg";
import logo from "@/img/white.svg";
import abhishek from "@/img/team/Abhishek.webp";
import aadityaGoyal from "@/img/team/my.webp";
import arjun from "@/img/team/arjunn.webp";

const T = {
  bg: "#0A0A0A",
  cream: "#fefce8",
  muted: "#a1a1aa",
  border: "rgba(254,252,232,0.08)",
};

const ONE_LINER =
  "gopwnit is a cybersecurity skills platform where individuals learn offensive security through hands-on labs and CTF competitions, and organizations host their own CTF events — built and hosted in India.";

const BOILERPLATE =
  "gopwnit is operated by GOPWNIT, a partnership firm based in India. The platform combines hands-on hacking labs, ten categories of CTF challenges, and structured learning paths for individual users, alongside hosting infrastructure — team management, live leaderboards, and Discord integration — for organizations running their own competitions. gopwnit has hosted two live CTF events, GLAU Mock CTF and Pentest Showdown, with 300+ participants each.";

const FOUNDERS = [
  { name: "Abhishek Soni", role: "Founder", image: abhishek },
  { name: "Aaditya Goyal", role: "Chief Technology Officer", image: aadityaGoyal },
  { name: "Arjun Chauhan", role: "Communication and Marketing Officer", image: arjun },
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

function CopyBlock({ text }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <div className="p-6 border relative" style={{ borderColor: T.border, background: "rgba(254,252,232,0.02)" }}>
      <p className="font-outfit text-[13.5px] leading-relaxed pr-10" style={{ color: T.muted }}>{text}</p>
      <button
        onClick={() => {
          navigator.clipboard?.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        aria-label="Copy to clipboard"
        className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center border transition-all"
        style={{ borderColor: T.border, color: T.muted }}
      >
        <IconCopy size={14} />
      </button>
      {copied && (
        <span className="absolute top-5 right-14 font-outfit text-[10px] uppercase tracking-widest" style={{ color: T.cream }}>
          Copied
        </span>
      )}
    </div>
  );
}

export default function PressPage() {
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
                Press Kit
              </motion.p>
              <motion.h1
                variants={fadeUp}
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(48px, 8vw, 80px)", lineHeight: 0.95, color: T.cream }}
              >
                FOR JOURNALISTS<br />&amp; PARTNERS.
              </motion.h1>
              <motion.p variants={fadeUp} className="font-outfit text-[15px] leading-relaxed max-w-lg mt-5" style={{ color: T.muted }}>
                Everything you need to write about or reference gopwnit accurately.
                Need something not here? Email us.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Logo */}
        <section className="px-7 pb-14">
          <div className="max-w-5xl mx-auto">
            <span className="font-outfit text-[10px] font-bold uppercase tracking-[0.3em] block mb-6" style={{ color: T.muted }}>Logo</span>
            <div className="p-12 border flex items-center justify-center" style={{ borderColor: T.border, background: "#050505" }}>
              <Image src={logo} alt="gopwnit logo" className="h-12 w-auto" />
            </div>
            <p className="font-outfit text-[12px] mt-3" style={{ color: T.muted }}>
              For a light-background or vector variant, email{" "}
              <a href="mailto:support@gopwnit.com" className="underline decoration-white/20 hover:text-yellow-50" style={{ color: T.cream }}>support@gopwnit.com</a>.
            </p>
          </div>
        </section>

        {/* Copy */}
        <section className="px-7 pb-14">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-4">
            <div>
              <span className="font-outfit text-[10px] font-bold uppercase tracking-[0.3em] block mb-6" style={{ color: T.muted }}>One-Liner</span>
              <CopyBlock text={ONE_LINER} />
            </div>
            <div>
              <span className="font-outfit text-[10px] font-bold uppercase tracking-[0.3em] block mb-6" style={{ color: T.muted }}>Boilerplate</span>
              <CopyBlock text={BOILERPLATE} />
            </div>
          </div>
        </section>

        {/* Founders */}
        <section className="px-7 pb-14 border-t pt-14" style={{ borderColor: T.border }}>
          <div className="max-w-5xl mx-auto">
            <span className="font-outfit text-[10px] font-bold uppercase tracking-[0.3em] block mb-6" style={{ color: T.muted }}>Founders</span>
            <div className="grid sm:grid-cols-3 gap-3">
              {FOUNDERS.map((f) => (
                <div key={f.name} className="p-6 border flex items-center gap-4" style={{ borderColor: T.border, background: "rgba(254,252,232,0.02)" }}>
                  <div className="relative w-14 h-14 flex-shrink-0 overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
                    <Image src={f.image} alt={f.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-outfit text-[13.5px] font-bold" style={{ color: T.cream }}>{f.name}</h3>
                    <p className="font-outfit text-[11px]" style={{ color: T.muted }}>{f.role}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="font-outfit text-[12px] mt-4" style={{ color: T.muted }}>
              Full bios and photos on the{" "}
              <Link href="/about" className="underline decoration-white/20 hover:text-yellow-50" style={{ color: T.cream }}>About page</Link>.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="px-7 py-14 border-t" style={{ borderColor: T.border }}>
          <div className="max-w-5xl mx-auto p-8 md:p-10 border flex flex-col md:flex-row md:items-center gap-6 justify-between" style={{ borderColor: T.border, background: "rgba(254,252,232,0.02)" }}>
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 flex items-center justify-center border flex-shrink-0" style={{ borderColor: "rgba(254,252,232,0.1)", background: "rgba(254,252,232,0.04)" }}>
                <IconMail size={18} color={T.cream} style={{ opacity: 0.6 }} />
              </div>
              <div>
                <h3 className="font-outfit text-[16px] font-bold mb-2" style={{ color: T.cream }}>Media inquiries</h3>
                <p className="font-outfit text-[13px] leading-relaxed max-w-md" style={{ color: T.muted }}>
                  For interviews, quotes, or anything not covered here.
                </p>
              </div>
            </div>
            <a
              href="mailto:support@gopwnit.com?subject=Press%20Inquiry"
              className="flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-widest shrink-0 font-outfit"
              style={{ background: T.cream, color: "#0A0A0A" }}
            >
              support@gopwnit.com <IconArrowRight size={14} />
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
