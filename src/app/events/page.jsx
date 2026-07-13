"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { IconCalendarEvent, IconUsers, IconArrowRight, IconBrandDiscord } from "@tabler/icons-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AnimatedBlurBg from "@/components/home/AnimatedBlurBg";

const T = {
  bg: "#0A0A0A",
  cream: "#fefce8",
  muted: "#a1a1aa",
  border: "rgba(254,252,232,0.08)",
};

const SITE_URL = "https://gopwnit.com";

const PAST_EVENTS = [
  {
    image: "/gallery/glaMock.jpg",
    name: "GLAU Mock CTF",
    date: "22 January 2026",
    isoDate: "2026-01-22",
    format: "Solo",
    participants: "300+ participants",
    desc: "Our first live CTF competition — a solo-format event testing web, crypto, and forensics skills.",
  },
  {
    image: "/gallery/pentest.jpg",
    name: "Pentest Showdown",
    date: "30 January 2026",
    isoDate: "2026-01-30",
    format: "Solo",
    participants: "300+ participants",
    desc: "A follow-up solo competition focused on penetration testing scenarios end to end.",
  },
];

// eventAttendanceMode/location deliberately omitted — venue format (online vs.
// in-person) for these two events isn't confirmed, and schema.org data should
// only assert what's actually known.
const EVENTS_JSON_LD = PAST_EVENTS.map((ev) => ({
  "@context": "https://schema.org",
  "@type": "Event",
  name: ev.name,
  startDate: ev.isoDate,
  eventStatus: "https://schema.org/EventScheduled",
  description: ev.desc,
  organizer: { "@type": "Organization", name: "GOPWNIT", url: SITE_URL },
  image: `${SITE_URL}${ev.image}`,
}));

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export default function EventsPage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: T.bg, color: T.cream }}>
      {EVENTS_JSON_LD.map((ev, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ev) }} />
      ))}
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
                Events
              </motion.p>
              <motion.h1
                variants={fadeUp}
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(48px, 8vw, 80px)", lineHeight: 0.95, color: T.cream }}
              >
                CTFS ON<br />GOPWNIT.
              </motion.h1>
              <motion.p variants={fadeUp} className="font-outfit text-[15px] leading-relaxed max-w-lg mt-5" style={{ color: T.muted }}>
                Competitions we&rsquo;ve run, and the ones being planned. Join our
                Discord for first word on what&rsquo;s next.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Past events */}
        <section className="px-7 pb-14">
          <div className="max-w-5xl mx-auto">
            <span className="font-outfit text-[10px] font-bold uppercase tracking-[0.3em] block mb-8" style={{ color: T.muted }}>
              Past Events
            </span>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid sm:grid-cols-2 gap-3"
            >
              {PAST_EVENTS.map((ev) => (
                <motion.div key={ev.name} variants={fadeUp} className="border overflow-hidden" style={{ borderColor: T.border }}>
                  <div className="relative h-56">
                    <Image src={ev.image} alt={`${ev.name} CTF competition on gopwnit, ${ev.date}`} fill className="object-cover grayscale" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <IconCalendarEvent size={13} style={{ color: T.muted }} />
                      <span className="font-outfit text-[11px]" style={{ color: T.muted }}>{ev.date}</span>
                    </div>
                    <h3 className="font-outfit text-xl font-black uppercase mb-2" style={{ color: T.cream }}>{ev.name}</h3>
                    <p className="font-outfit text-[13px] leading-relaxed mb-4" style={{ color: T.muted }}>{ev.desc}</p>
                    <div className="flex items-center gap-2">
                      <IconUsers size={13} style={{ color: T.muted }} />
                      <span className="font-outfit text-[11px] uppercase tracking-widest" style={{ color: T.muted }}>{ev.participants} · {ev.format}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Upcoming — honest, no invented dates */}
        <section className="px-7 py-14 border-t" style={{ borderColor: T.border }}>
          <div className="max-w-5xl mx-auto">
            <span className="font-outfit text-[10px] font-bold uppercase tracking-[0.3em] block mb-8" style={{ color: T.muted }}>
              What&rsquo;s Next
            </span>
            <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between p-8 md:p-10 border" style={{ borderColor: T.border, background: "rgba(254,252,232,0.02)" }}>
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 flex items-center justify-center border flex-shrink-0" style={{ borderColor: "rgba(254,252,232,0.1)", background: "rgba(254,252,232,0.04)" }}>
                  <IconBrandDiscord size={18} color={T.cream} style={{ opacity: 0.6 }} />
                </div>
                <div>
                  <h3 className="font-outfit text-[16px] font-bold mb-2" style={{ color: T.cream }}>More events are being planned</h3>
                  <p className="font-outfit text-[13px] leading-relaxed max-w-md" style={{ color: T.muted }}>
                    We announce new seasons in our Discord first — join to be first
                    in line for registration.
                  </p>
                </div>
              </div>
              <a
                href="https://discord.gg/4Mb6xXce8q"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 text-xs font-bold uppercase tracking-widest shrink-0 text-center font-outfit"
                style={{ background: T.cream, color: "#0A0A0A" }}
              >
                Join Discord
              </a>
            </div>
            <p className="font-outfit text-[13px] text-center mt-8 max-w-3xl mx-auto" style={{ color: T.muted }}>
              Want to host your own?{" "}
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
