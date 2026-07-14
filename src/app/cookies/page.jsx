"use client";

import React from "react";
import { motion } from "framer-motion";
import { IconCircleCheck, IconBan } from "@tabler/icons-react";
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

const ESSENTIAL = [
  "Authentication state management",
  "Session security validation",
  "Platform preference storage",
  "Security monitoring",
];

const RESTRICTED = [
  "Third-party advertising cookies",
  "Cross-site tracking mechanisms",
  "Behavioral profiling for marketing",
  "Social media tracking pixels",
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export default function CookiesPage() {
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
                Cookie Policy
              </motion.p>
              <motion.h1
                variants={fadeUp}
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(48px, 8vw, 76px)", lineHeight: 0.95, color: T.cream }}
              >
                ESSENTIAL. NOTHING ELSE.
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="font-outfit text-[15px] leading-relaxed max-w-lg mt-5"
                style={{ color: T.muted }}
              >
                We use cookies exclusively to keep gopwnit working and secure. No
                advertising networks, no cross-site trackers, no behavioral profiling —
                consistent with the{" "}
                <Link href="/privacy-policy" className="underline decoration-white/20 hover:text-yellow-50">
                  full Privacy Policy
                </Link>
                .
              </motion.p>
            </motion.div>
          </div>
        </section>

        <section className="px-7 pb-20">
          <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-6 border"
              style={{ borderColor: T.border, background: "rgba(254,252,232,0.02)" }}
            >
              <h3 className="font-outfit text-[13px] font-bold uppercase tracking-widest mb-5" style={{ color: T.cream }}>
                What We Use
              </h3>
              <div className="space-y-3">
                {ESSENTIAL.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <IconCircleCheck size={15} style={{ color: T.cream, opacity: 0.4, flexShrink: 0 }} />
                    <span className="font-outfit text-[13px]" style={{ color: T.muted }}>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 border"
              style={{ borderColor: "rgba(239,68,68,0.15)", background: "rgba(239,68,68,0.03)" }}
            >
              <h3 className="font-outfit text-[13px] font-bold uppercase tracking-widest mb-5" style={{ color: "rgba(239,68,68,0.75)" }}>
                What We Don&rsquo;t Use
              </h3>
              <div className="space-y-3">
                {RESTRICTED.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <IconBan size={14} style={{ color: "rgba(239,68,68,0.55)", flexShrink: 0 }} />
                    <span className="font-outfit text-[13px]" style={{ color: T.muted }}>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="font-outfit text-[12.5px] mt-8 max-w-3xl mx-auto"
            style={{ color: T.muted }}
          >
            Questions about cookies or your data?{" "}
            <a href="mailto:support@gopwnit.com" className="underline decoration-white/20 hover:text-yellow-50" style={{ color: T.cream, opacity: 0.75 }}>
              support@gopwnit.com
            </a>
          </motion.p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
