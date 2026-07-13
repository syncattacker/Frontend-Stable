"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconFileText,
  IconUserCheck,
  IconGavel,
  IconCopyright,
  IconTrophy,
  IconRefresh,
  IconBan,
  IconShieldX,
  IconScale,
  IconMail,
  IconX,
  IconChevronRight,
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

const sections = [
  { id: "acceptance", number: "01", title: "Acceptance of Terms", summary: "What agreeing to these terms means when you use gopwnit.", icon: IconFileText },
  { id: "accounts", number: "02", title: "Eligibility & Accounts", summary: "Who can register, and your responsibilities as an account holder.", icon: IconUserCheck },
  { id: "acceptable-use", number: "03", title: "Acceptable Use", summary: "What's allowed on the platform, and what isn't.", icon: IconGavel },
  { id: "content", number: "04", title: "Content & Challenge IP", summary: "Ownership of challenges, write-ups, and other content you create.", icon: IconCopyright },
  { id: "hosting", number: "05", title: "Hosting Seasons & Events", summary: "Terms specific to organizers who host their own CTF seasons.", icon: IconTrophy },
  { id: "availability", number: "06", title: "Availability & Changes", summary: "Our right to modify or discontinue features, and why.", icon: IconRefresh },
  { id: "termination", number: "07", title: "Termination", summary: "When and how accounts can be suspended or closed.", icon: IconBan },
  { id: "liability", number: "08", title: "Disclaimers & Liability", summary: "The legal boundaries of what gopwnit is responsible for.", icon: IconShieldX },
  { id: "law", number: "09", title: "Governing Law", summary: "Jurisdiction and how disputes are handled.", icon: IconScale },
  { id: "contact", number: "10", title: "Changes & Contact", summary: "How we notify you of updates, and how to reach us.", icon: IconMail },
];

function SectionCard({ section, onClick }) {
  const Icon = section.icon;
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
      onClick={onClick}
      className="group flex flex-col h-full p-6 border cursor-pointer transition-all duration-200"
      style={{ borderColor: T.border, background: "rgba(254,252,232,0.02)" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(254,252,232,0.04)";
        e.currentTarget.style.borderColor = "rgba(254,252,232,0.16)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(254,252,232,0.02)";
        e.currentTarget.style.borderColor = T.border;
      }}
    >
      <div className="flex items-start justify-between mb-5">
        <div className="w-9 h-9 flex items-center justify-center border flex-shrink-0" style={{ borderColor: "rgba(254,252,232,0.08)", background: "rgba(254,252,232,0.03)" }}>
          <Icon size={16} color="#fefce8" style={{ opacity: 0.55 }} />
        </div>
        <span className="font-outfit text-[11px] font-bold tracking-wide" style={{ color: "rgba(254,252,232,0.1)" }}>
          {section.number}
        </span>
      </div>
      <div className="flex-1">
        <h3 className="font-outfit text-[15px] font-bold mb-2 tracking-tight text-yellow-50">{section.title}</h3>
        <p className="font-outfit text-[13px] leading-relaxed" style={{ color: T.muted }}>{section.summary}</p>
      </div>
      <div className="mt-5 pt-4 border-t flex items-center justify-between" style={{ borderColor: "rgba(254,252,232,0.05)" }}>
        <span className="font-outfit text-[10px] font-bold uppercase tracking-[0.13em]" style={{ color: "rgba(254,252,232,0.28)" }}>
          Read Clause
        </span>
        <div className="w-7 h-7 flex items-center justify-center border" style={{ borderColor: "rgba(254,252,232,0.07)" }}>
          <IconChevronRight size={12} color="rgba(254,252,232,0.3)" />
        </div>
      </div>
    </motion.div>
  );
}

function Modal({ children, onClose }) {
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-[10px]"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 16 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-[#111] border overflow-hidden"
        style={{ borderColor: "rgba(254,252,232,0.1)", boxShadow: "0 40px 80px rgba(0,0,0,0.8)" }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0" style={{ borderColor: "rgba(254,252,232,0.06)" }}>
          <span className="font-outfit text-[10px] font-bold uppercase tracking-[0.14em] text-white/30">Terms of Service</span>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border transition-all"
            style={{ borderColor: "rgba(254,252,232,0.08)", background: "rgba(254,252,232,0.03)" }}
          >
            <IconX size={13} color="#fefce8" style={{ opacity: 0.5 }} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-7">{children}</div>
      </motion.div>
    </div>
  );
}

function ModalHeader({ num, title }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="w-11 h-11 flex-shrink-0 flex items-center justify-center border" style={{ borderColor: "rgba(254,252,232,0.1)", background: "rgba(254,252,232,0.04)" }}>
        <span className="font-outfit text-[15px] font-extrabold text-yellow-50 opacity-70">{num}</span>
      </div>
      <h3 className="font-outfit text-[22px] font-extrabold text-yellow-50 tracking-tight leading-tight">{title}</h3>
    </div>
  );
}

function P({ children }) {
  return <p className="font-outfit text-[13.5px] text-zinc-400 leading-relaxed mb-4 last:mb-0">{children}</p>;
}

function List({ items }) {
  return (
    <ul className="space-y-2 mb-4">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="mt-2 w-1 h-1 rounded-full bg-yellow-50 opacity-25 flex-shrink-0" />
          <span className="font-outfit text-[13px] text-zinc-400 leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function renderModalContent(id) {
  switch (id) {
    case "acceptance":
      return (
        <div>
          <ModalHeader num="01" title="Acceptance of Terms" />
          <P>
            These Terms of Service govern your access to and use of gopwnit, operated by
            GOPWNIT, a partnership firm registered in India. By creating an account or
            otherwise using the platform, you agree to be bound by these terms and by our{" "}
            <Link href="/privacy-policy" className="underline decoration-white/20 hover:text-yellow-50">Privacy Policy</Link>
            {" "}and{" "}
            <Link href="/code-of-conduct" className="underline decoration-white/20 hover:text-yellow-50">Code of Conduct</Link>.
          </P>
          <P>If you do not agree to these terms, do not create an account or use the platform.</P>
        </div>
      );
    case "accounts":
      return (
        <div>
          <ModalHeader num="02" title="Eligibility & Accounts" />
          <List
            items={[
              "You must provide accurate registration information and keep it up to date.",
              "You are responsible for maintaining the security of your account and password.",
              "One account per person. Automated or bulk account creation is not permitted.",
              "You must be legally able to enter into a binding agreement in your jurisdiction to register.",
            ]}
          />
          <P>Notify us immediately at support@gopwnit.com if you suspect unauthorized access to your account.</P>
        </div>
      );
    case "acceptable-use":
      return (
        <div>
          <ModalHeader num="03" title="Acceptable Use" />
          <P>
            Full conduct standards live in our{" "}
            <Link href="/code-of-conduct" className="underline decoration-white/20 hover:text-yellow-50">Code of Conduct</Link>.
            In short, you agree not to:
          </P>
          <List
            items={[
              "Attack, probe, or attempt to bypass platform infrastructure outside a designated challenge scope.",
              "Share flags, solutions, or spoilers during an active competition.",
              "Use gopwnit to target systems outside the platform without authorization.",
              "Impersonate another user or misrepresent your affiliation with any organization.",
              "Interfere with the platform's availability through automated abuse or resource flooding.",
            ]}
          />
        </div>
      );
    case "content":
      return (
        <div>
          <ModalHeader num="04" title="Content & Challenge IP" />
          <P>
            You retain ownership of challenges, write-ups, blog posts, and other content
            you create and submit to gopwnit. By publishing content on the platform, you
            grant gopwnit a non-exclusive, worldwide license to host, display, and
            distribute that content as part of operating the service.
          </P>
          <P>
            You are responsible for ensuring you have the rights to any content you upload,
            including challenge files, images, and written material. Do not submit content
            that infringes another party&rsquo;s intellectual property.
          </P>
        </div>
      );
    case "hosting":
      return (
        <div>
          <ModalHeader num="05" title="Hosting Seasons & Events" />
          <P>Organizers who host a CTF season on gopwnit additionally agree that:</P>
          <List
            items={[
              "Hosted seasons are reviewed and must be approved before becoming publicly visible.",
              "Challenge content must comply with our Code of Conduct's standards for hosts — fair, educational, and free of malicious payloads.",
              "Organizers are responsible for the accuracy of event details (dates, venue, participant limits) they submit.",
              "gopwnit may pause, unpublish, or remove a hosted season that violates these terms or the Code of Conduct.",
            ]}
          />
        </div>
      );
    case "availability":
      return (
        <div>
          <ModalHeader num="06" title="Availability & Changes" />
          <P>
            We work to keep gopwnit available and reliable, but we do not guarantee
            uninterrupted access. Features, challenge categories, and platform tools may
            be added, changed, or removed as the product evolves. We will communicate
            material changes through the platform or by email where practical.
          </P>
        </div>
      );
    case "termination":
      return (
        <div>
          <ModalHeader num="07" title="Termination" />
          <P>
            You may delete your account at any time through your account settings. We may
            suspend or terminate accounts that violate these terms or the Code of Conduct,
            with severity-appropriate action ranging from a warning to permanent
            termination, consistent with the enforcement standards described in our{" "}
            <Link href="/code-of-conduct" className="underline decoration-white/20 hover:text-yellow-50">Code of Conduct</Link>.
          </P>
        </div>
      );
    case "liability":
      return (
        <div>
          <ModalHeader num="08" title="Disclaimers & Liability" />
          <P>
            gopwnit is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. Educational
            labs and challenges are designed for a safe, contained environment, but we
            make no warranty that the platform will be error-free or uninterrupted.
          </P>
          <P>
            To the fullest extent permitted by law, GOPWNIT and its team are not liable
            for indirect, incidental, or consequential damages arising from your use of
            the platform. Nothing in these terms limits liability that cannot be excluded
            under applicable Indian law.
          </P>
        </div>
      );
    case "law":
      return (
        <div>
          <ModalHeader num="09" title="Governing Law" />
          <P>
            These terms are governed by the laws of India. Any dispute arising from your
            use of gopwnit will be subject to the exclusive jurisdiction of the courts of
            India.
          </P>
        </div>
      );
    case "contact":
      return (
        <div>
          <ModalHeader num="10" title="Changes & Contact" />
          <P>
            We may update these terms from time to time. Material changes will be
            announced on the platform with reasonable advance notice, consistent with the
            update process described in our{" "}
            <Link href="/privacy-policy" className="underline decoration-white/20 hover:text-yellow-50">Privacy Policy</Link>.
          </P>
          <P>
            Questions about these terms? Email{" "}
            <a href="mailto:support@gopwnit.com" className="underline decoration-white/20 hover:text-yellow-50" style={{ color: "#fefce8" }}>
              support@gopwnit.com
            </a>.
          </P>
        </div>
      );
    default:
      return null;
  }
}

export default function TermsPage() {
  const [activeModal, setActiveModal] = useState(null);
  const openModal = (id) => setActiveModal(id);
  const closeModal = () => setActiveModal(null);

  return (
    <div className="flex flex-col min-h-screen" style={{ background: T.bg, color: T.cream }}>
      <Navbar />

      <div className="fixed inset-0 z-0">
        <AnimatedBlurBg />
      </div>

      <main className="relative z-10 flex-1 pt-32">
        <section className="px-7 py-16 md:py-20">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-5">
              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(52px,9vw,96px)", lineHeight: 0.92, color: T.cream }}>
                TERMS OF<br />SERVICE
              </h1>
              <p className="font-outfit text-[15px] leading-relaxed max-w-lg" style={{ color: T.muted }}>
                The rules that govern your use of gopwnit — for players, organizers, and
                everyone in between.
              </p>
              <div className="flex flex-wrap gap-x-8 gap-y-2 pt-5 border-t" style={{ borderColor: "rgba(254,252,232,0.06)" }}>
                {[{ label: "Effective Date", value: "12 July 2026" }, { label: "Version", value: "1.0.0" }].map(({ label, value }) => (
                  <div key={label}>
                    <span className="font-outfit text-[10px] font-bold uppercase tracking-[0.13em] text-white/25 block mb-1">{label}</span>
                    <span className="font-outfit text-[13px] font-semibold text-yellow-50">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="px-7 pb-24">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
            >
              {sections.map((section) => (
                <SectionCard key={section.id} section={section} onClick={() => openModal(section.id)} />
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />

      <AnimatePresence>
        {activeModal && <Modal onClose={closeModal}>{renderModalContent(activeModal)}</Modal>}
      </AnimatePresence>
    </div>
  );
}
