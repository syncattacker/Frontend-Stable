"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  IconMail,
  IconShieldLock,
  IconMessageCircle,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandInstagram,
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

const CHANNELS = [
  {
    icon: IconMail,
    title: "General & Support",
    value: "support@gopwnit.com",
    href: "mailto:support@gopwnit.com",
    desc: "Account issues, questions, or anything else — this inbox routes to the whole team.",
  },
  {
    icon: IconShieldLock,
    title: "Security & Privacy",
    value: "support@gopwnit.com",
    href: "mailto:support@gopwnit.com",
    desc: "Vulnerability reports, data requests, or privacy concerns. See security.txt for our disclosure policy.",
  },
  {
    icon: IconMessageCircle,
    title: "Community",
    value: "Join our Discord",
    href: "https://discord.gg/4Mb6xXce8q",
    desc: "The fastest way to reach us in real time — also where CTF announcements happen first.",
  },
];

const SOCIALS = [
  { icon: IconBrandGithub, label: "GitHub", href: "https://github.com/GoPWNIt" },
  { icon: IconBrandLinkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/gopwnit/" },
  { icon: IconBrandInstagram, label: "Instagram", href: "https://www.instagram.com/gopwnit.india" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: T.bg, color: T.cream }}>
      <Navbar />

      <div className="fixed inset-0 z-0">
        <AnimatedBlurBg />
      </div>

      <main className="relative z-10 flex-1 pt-32">
        <section className="px-7 py-16 md:py-20">
          <div className="max-w-4xl mx-auto">
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.p
                variants={fadeUp}
                className="font-outfit text-[11px] font-bold uppercase tracking-[0.3em] mb-5"
                style={{ color: T.muted }}
              >
                Get In Touch
              </motion.p>
              <motion.h1
                variants={fadeUp}
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(52px, 9vw, 88px)", lineHeight: 0.95, color: T.cream }}
              >
                LET&rsquo;S TALK.
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="font-outfit text-[15px] leading-relaxed max-w-lg mt-5"
                style={{ color: T.muted }}
              >
                GOPWNIT is a partnership firm building gopwnit from India. Reach us directly —
                no ticket queues, no bots.
              </motion.p>
            </motion.div>
          </div>
        </section>

        <section className="px-7 pb-16">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid md:grid-cols-3 gap-3"
            >
              {CHANNELS.map(({ icon: Icon, title, value, href, desc }) => (
                <motion.a
                  key={title}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  variants={fadeUp}
                  className="block p-6 border transition-colors duration-200"
                  style={{ borderColor: T.border, background: "rgba(254,252,232,0.02)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(254,252,232,0.2)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = T.border)}
                >
                  <div
                    className="w-10 h-10 flex items-center justify-center mb-5"
                    style={{ border: `1px solid ${T.border}`, background: "rgba(254,252,232,0.03)" }}
                  >
                    <Icon size={17} color={T.cream} style={{ opacity: 0.6 }} />
                  </div>
                  <h3 className="font-outfit text-[13px] font-bold uppercase tracking-widest mb-2" style={{ color: T.cream }}>
                    {title}
                  </h3>
                  <p className="font-outfit text-[13px] font-semibold mb-3" style={{ color: T.cream, opacity: 0.75 }}>
                    {value}
                  </p>
                  <p className="font-outfit text-[12.5px] leading-relaxed" style={{ color: T.muted }}>
                    {desc}
                  </p>
                </motion.a>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-4 mt-10 pt-10"
              style={{ borderTop: `1px solid ${T.border}` }}
            >
              <span className="font-outfit text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: T.muted }}>
                Follow
              </span>
              <div className="flex gap-2">
                {SOCIALS.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 flex items-center justify-center transition-all duration-150"
                    style={{ border: `1px solid ${T.border}`, color: T.muted }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = T.cream;
                      e.currentTarget.style.borderColor = "rgba(254,252,232,0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = T.muted;
                      e.currentTarget.style.borderColor = T.border;
                    }}
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
