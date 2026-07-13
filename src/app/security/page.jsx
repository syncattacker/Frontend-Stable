"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  IconDeviceMobile,
  IconLock,
  IconGauge,
  IconUsersGroup,
  IconShieldCheck,
  IconMapPin,
  IconFlag,
  IconBug,
} from "@tabler/icons-react";
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

const PRACTICES = [
  {
    icon: IconDeviceMobile,
    title: "Device-Bound Sessions",
    desc: "Every session is tied to the device that created it. If a session is replayed from an unrecognized device, we invalidate it, log the attempt, and email you.",
  },
  {
    icon: IconLock,
    title: "Encrypted Credentials",
    desc: "Passwords are encrypted in transit and hashed before storage — we never store or transmit them as plain text.",
  },
  {
    icon: IconFlag,
    title: "Hashed Challenge Flags",
    desc: "CTF flags are hashed at rest, the same way passwords are. A database compromise alone doesn't leak challenge answers.",
  },
  {
    icon: IconGauge,
    title: "Rate Limiting",
    desc: "Every sensitive action — login, signup, flag submission, password reset — has its own rate limit to slow down abuse and brute-force attempts.",
  },
  {
    icon: IconUsersGroup,
    title: "Role-Based Access",
    desc: "Season organizers assign granular roles (admin, challenge manager, moderator, viewer) rather than all-or-nothing access to co-organizers.",
  },
  {
    icon: IconShieldCheck,
    title: "Hardened by Default",
    desc: "Standard web protections are on across the platform: strict CORS, request sanitization, and security headers on every response.",
  },
  {
    icon: IconMapPin,
    title: "India Data Residency",
    desc: "Infrastructure is hosted out of India, with data handling practices aligned to the Digital Personal Data Protection Act, 2023.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

export default function SecurityPage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: T.bg, color: T.cream }}>
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
                Security
              </motion.p>
              <motion.h1
                variants={fadeUp}
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(48px, 8vw, 80px)", lineHeight: 0.95, color: T.cream }}
              >
                HOW WE KEEP<br />THIS SECURE.
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="font-outfit text-[15px] leading-relaxed max-w-lg mt-5"
                style={{ color: T.muted }}
              >
                A cybersecurity platform holding itself to a lower standard than the one
                it teaches would be a strange thing to build. Here&rsquo;s what runs
                under the hood.
              </motion.p>
            </motion.div>
          </div>
        </section>

        <section className="px-7 pb-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={stagger}
            className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
          >
            {PRACTICES.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="p-6 border"
                style={{ borderColor: T.border, background: "rgba(254,252,232,0.02)" }}
              >
                <div className="w-9 h-9 flex items-center justify-center mb-5 border" style={{ borderColor: "rgba(254,252,232,0.08)", background: "rgba(254,252,232,0.03)" }}>
                  <Icon size={16} color={T.cream} style={{ opacity: 0.55 }} />
                </div>
                <h3 className="font-outfit text-[14px] font-bold mb-2" style={{ color: T.cream }}>{title}</h3>
                <p className="font-outfit text-[13px] leading-relaxed" style={{ color: T.muted }}>{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="px-7 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto p-8 md:p-10 border flex flex-col md:flex-row md:items-center gap-6 md:gap-10 justify-between"
            style={{ borderColor: T.border, background: "rgba(254,252,232,0.02)" }}
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 flex items-center justify-center border flex-shrink-0" style={{ borderColor: "rgba(254,252,232,0.1)", background: "rgba(254,252,232,0.04)" }}>
                <IconBug size={18} color={T.cream} style={{ opacity: 0.6 }} />
              </div>
              <div>
                <h3 className="font-outfit text-[16px] font-bold mb-2" style={{ color: T.cream }}>
                  Found a vulnerability?
                </h3>
                <p className="font-outfit text-[13px] leading-relaxed max-w-md" style={{ color: T.muted }}>
                  We run a coordinated disclosure process — report it responsibly and
                  we&rsquo;ll work with you on it. See{" "}
                  <a href="/.well-known/security.txt" className="underline decoration-white/20 hover:text-yellow-50" style={{ color: T.cream }}>
                    security.txt
                  </a>{" "}
                  for the details. There is no paid bug bounty program at this time.
                </p>
              </div>
            </div>
            <a
              href="mailto:support@gopwnit.com"
              className="px-6 py-3 text-xs font-bold uppercase tracking-widest shrink-0 text-center font-outfit"
              style={{ background: T.cream, color: "#0A0A0A" }}
            >
              Report a Vulnerability
            </a>
          </motion.div>

          <p className="font-outfit text-[13px] text-center mt-8 max-w-3xl mx-auto" style={{ color: T.muted }}>
            For how we handle your personal data, see our{" "}
            <Link href="/privacy-policy" className="underline decoration-white/20 hover:text-yellow-50" style={{ color: T.cream }}>
              Privacy Policy
            </Link>
            .
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
