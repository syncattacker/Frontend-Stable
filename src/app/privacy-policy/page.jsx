"use client";

import React, { useState, useEffect } from "react";
import {
  Shield, Lock, Eye, Users, Server, Clock, Mail, CheckCircle, X, ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import AnimatedBlurBg from "@/components/home/AnimatedBlurBg";

const T = {
  brand: "#a855f7",
  brandDim: "rgba(168, 85, 247, 0.1)",
  brandBorder: "rgba(168, 85, 247, 0.2)",
  bg: "#020205",
  glass: "rgba(8, 8, 12, 0.7)",
  glassCard: "rgba(15, 15, 25, 0.4)",
  border: "rgba(255, 255, 255, 0.05)",
  muted: "#94a3b8",
};

export default function PrivacyPolicy({ onOpenSignUp, onOpenLogin }) {
  const [activeModal, setActiveModal] = useState(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openModal = (sectionId) => {
    setActiveModal(sectionId);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = "unset";
  };

  const sections = [
    { id: "intro",     number: "01", title: "Introduction",            summary: "Our commitment to protecting your privacy and overview of our practices.",                    icon: Shield  },
    { id: "collect",   number: "02", title: "Information We Collect",  summary: "Details about the personal information we gather and store.",                                icon: Eye     },
    { id: "use",       number: "03", title: "How We Use Your Info",    summary: "Legitimate business purposes for processing your data.",                                      icon: Users   },
    { id: "cookies",   number: "04", title: "Cookies & Tracking",      summary: "Essential cookies only, no third-party tracking or advertising.",                            icon: Lock    },
    { id: "sharing",   number: "05", title: "Data Sharing",            summary: "Zero data commercialization policy with trusted infrastructure partners.",                   icon: Server  },
    { id: "social",    number: "06", title: "Social Auth Services",    summary: "Current proprietary authentication and future considerations.",                              icon: Users   },
    { id: "retention", number: "07", title: "Data Retention",          summary: "Account deletion rights and mandatory retention policies.",                                  icon: Clock   },
    { id: "rights",    number: "08", title: "Privacy Rights",          summary: "Comprehensive controls over your personal information.",                                     icon: Shield  },
    { id: "updates",   number: "09", title: "Policy Updates",          summary: "Change management procedures and notification methods.",                                     icon: Clock   },
    { id: "contact",   number: "10", title: "Contact & DPO",           summary: "How to reach us for privacy-related inquiries and concerns.",                               icon: Mail    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#020205] text-white font-outfit selection:bg-purple-500/30 selection:text-purple-200">
      <Navbar onOpenSignUp={onOpenSignUp} onOpenLogin={onOpenLogin} />

      <div className="fixed inset-0 z-0">
        <AnimatedBlurBg />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      </div>

      <main className="relative z-10 flex-grow pt-32">
        {/* Header */}
        <section className="px-6 py-20 md:py-32">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <div className="h-px w-8 bg-purple-500/40" />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-purple-400">Legal Framework</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9]">
                Privacy <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-white to-purple-600">
                  Protocol
                </span>
              </h1>
              <p className="max-w-2xl text-zinc-400 text-lg md:text-xl font-medium leading-relaxed">
                Platform integrity and user privacy are the cornerstones of the gopwnit ecosystem.
                This protocol outlines how we safeguard your digital identity.
              </p>

              <div className="pt-8 flex flex-wrap gap-8 text-sm border-t border-white/5 max-w-2xl">
                <div>
                  <span className="block text-zinc-500 uppercase tracking-widest text-[10px] font-black mb-1">Effective Date</span>
                  <span className="font-bold text-white">July 28, 2025</span>
                </div>
                <div>
                  <span className="block text-zinc-500 uppercase tracking-widest text-[10px] font-black mb-1">Version</span>
                  <span className="font-bold text-white">1.0.0 (Stable)</span>
                </div>
                <div>
                  <span className="block text-zinc-500 uppercase tracking-widest text-[10px] font-black mb-1">Status</span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="px-6 pb-32">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
        {activeModal && (
          <Modal onClose={closeModal}>
            {renderModalContent(activeModal)}
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}


function SectionCard({ section, onClick }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      onClick={onClick}
      className="group relative p-8 rounded-[2rem] border transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
      style={{ background: T.glassCard, borderColor: T.border }}
      whileHover={{ y: -8, borderColor: T.brandBorder, background: "rgba(20, 20, 35, 0.6)" }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[40px] rounded-full pointer-events-none group-hover:bg-purple-500/10 transition-colors" />

      <div className="flex items-center justify-between mb-8">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300"
          style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.05)" }}>
          <section.icon size={20} className="text-purple-400" />
        </div>
        <span className="text-2xl font-black text-white/10 tracking-tighter group-hover:text-purple-500/20 transition-colors">
          {section.number}
        </span>
      </div>

      <div className="flex-grow">
        <h3 className="text-xl font-black uppercase tracking-tight text-white mb-3 group-hover:text-purple-400 transition-colors">
          {section.title}
        </h3>
        <p className="text-zinc-400 text-sm leading-relaxed mb-8">{section.summary}</p>
      </div>

      <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:text-purple-400 transition-colors">Read Protocol</span>
        <div className="w-8 h-8 rounded-full flex items-center justify-center border border-white/5 group-hover:border-purple-500/30 group-hover:bg-purple-500/10 transition-all">
          <ChevronRight size={14} className="text-zinc-500 group-hover:text-purple-400" />
        </div>
      </div>
    </motion.div>
  );
}

function Modal({ children, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-5xl max-h-full overflow-hidden rounded-[2.5rem] border shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col"
        style={{ background: "#08080c", borderColor: T.brandBorder }}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

        <div className="flex items-center justify-between p-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-400">Section Protocol Content</h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-red-500/20 text-zinc-500 hover:text-red-400 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-8 md:p-12 overflow-y-auto no-scrollbar scroll-smooth">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

function ModalHeader({ num, title }) {
  return (
    <div className="flex items-center gap-6 mb-12">
      <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
        <span className="text-3xl font-black text-purple-400">{num}</span>
      </div>
      <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">{title}</h3>
    </div>
  );
}

function InfoItem({ text }) {
  return (
    <div className="group flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
      <div className="w-1.5 h-1.5 rounded-full bg-purple-500/40 group-hover:bg-purple-500 transition-colors" />
      <span className="text-zinc-300 text-sm font-medium">{text}</span>
    </div>
  );
}

function InfoCard({ title, description }) {
  return (
    <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-purple-500/20 transition-all">
      <h5 className="font-black uppercase tracking-tight text-white mb-2">{title}</h5>
      <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function ServiceCard({ name, purpose, region }) {
  return (
    <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] space-y-4">
      <div className="flex flex-col">
        <h5 className="font-black uppercase tracking-tight text-purple-400">{name}</h5>
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1">{region}</span>
      </div>
      <p className="text-zinc-400 text-sm leading-relaxed">{purpose}</p>
    </div>
  );
}

function RetentionItem({ item, purpose }) {
  return (
    <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01]">
      <div className="font-bold text-white text-sm mb-1">{item}</div>
      <div className="text-zinc-500 text-xs">{purpose}</div>
    </div>
  );
}

function RightCard({ title, description }) {
  return (
    <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-purple-500/20 transition-all">
      <h5 className="font-black uppercase tracking-tight text-purple-400 mb-3">{title}</h5>
      <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function renderModalContent(sectionId) {
  switch (sectionId) {
    case "intro":
      return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ModalHeader num="01" title="Introduction" />
          <p className="text-xl leading-relaxed text-zinc-300 max-w-3xl">
            gopwnit is committed to protecting and respecting your privacy. This Privacy Policy outlines
            our practices regarding the collection, use, storage, and protection of personal information
            when you utilize our cybersecurity learning platform and CTF services. By accessing or using
            our platform, you acknowledge that you have read, understood, and agree to be bound by the
            terms set forth in this policy.
          </p>
        </div>
      );

    case "collect":
      return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ModalHeader num="02" title="Information We Collect" />
          <p className="text-xl text-zinc-400">
            We collect and process the following categories of personal information to provide our services effectively:
          </p>
          <div className="space-y-12">
            {[
              { label: "Account Information", items: ["Email address (primary identifier)", "Full legal name", "Username and display preferences", "Account creation timestamp"] },
              { label: "Technical Data",      items: ["IP address and geolocation data", "User agent and browser specifications", "Device type and operating system", "Session duration and access patterns"] },
              { label: "Platform Activity",   items: ["CTF challenge submissions and scores", "Course enrollment and progress data", "Learning path completions", "Community interactions"] },
              { label: "Optional Metadata",   items: ["Professional social profiles (GitHub, LinkedIn)", "Profile avatar and customization", "Educational background", "Professional experience"] },
            ].map(({ label, items }) => (
              <div key={label}>
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-purple-400 mb-6 flex items-center gap-3">
                  <div className="w-8 h-[1px] bg-purple-500/30" /> {label}
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {items.map((text) => <InfoItem key={text} text={text} />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "use":
      return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ModalHeader num="03" title="Usage Protocol" />
          <p className="text-xl text-zinc-400">We process your personal information for the following legitimate business purposes:</p>
          <div className="grid md:grid-cols-2 gap-6">
            <InfoCard title="Identity & Security"  description="Secure user authentication, session management, and account verification to ensure authorized access." />
            <InfoCard title="Threat Mitigation"    description="Detection and prevention of malicious activities including bypass attempts and suspicious behavioral patterns." />
            <InfoCard title="Optimization"         description="Provision of personalized learning experiences, performance analytics, and feature improvements." />
            <InfoCard title="Integrity"            description="Maintenance of competition standards, prevention of cheating, and leaderboard accuracy." />
          </div>
          <div className="p-8 rounded-[2rem] bg-purple-500/5 border border-purple-500/20">
            <p className="text-sm text-zinc-300 leading-relaxed">
              <strong className="text-purple-400 uppercase tracking-widest text-[10px] block mb-2">Transparency Commitment</strong>
              All data processing activities are logged and accessible through your account dashboard.
              We maintain detailed audit trails for security and compliance purposes.
            </p>
          </div>
        </div>
      );

    case "cookies":
      return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ModalHeader num="04" title="Cookies & Tracking" />
          <div className="space-y-12">
            <div className="p-10 rounded-[2.5rem] border border-white/5 bg-white/[0.01]">
              <h4 className="text-xl font-black uppercase tracking-tight text-white mb-6">Essential Tokens Only</h4>
              <p className="text-lg mb-8 text-zinc-400 leading-relaxed">
                We utilize technologies <strong className="text-white font-bold">exclusively for essential platform functionality</strong>:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {["Authentication state management", "Session security validation", "Platform preference storage", "Security monitoring"].map((t) => <InfoItem key={t} text={t} />)}
              </div>
            </div>
            <div className="p-10 rounded-[2.5rem] border border-red-500/10 bg-red-500/[0.02]">
              <h4 className="text-xl font-black uppercase tracking-tight text-red-400 mb-6">Restricted Activities</h4>
              <div className="space-y-4">
                {["Third-party advertising cookies", "Cross-site tracking mechanisms", "Behavioral profiling for marketing", "Social media tracking pixels"].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-zinc-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500/40" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );

    case "sharing":
      return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ModalHeader num="05" title="Data Sharing" />
          <div className="space-y-12">
            <div className="p-10 rounded-[2.5rem] border border-purple-500/20 bg-purple-500/[0.03]">
              <h4 className="text-3xl font-black uppercase tracking-tighter text-white mb-4">Zero Commercialization</h4>
              <p className="text-xl text-zinc-300 leading-relaxed">
                gopwnit <strong className="text-purple-400 font-bold">does not sell, rent, or lease</strong> your personal information. Your data is not a revenue source.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-purple-400 mb-8 flex items-center gap-3">
                <div className="w-8 h-[1px] bg-purple-500/30" /> Infrastructure Partners
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                <ServiceCard name="Amazon Web Services" purpose="Secure storage of user content and platform assets with enterprise-grade encryption" region="Global Data Residency" />
                <ServiceCard name="Fly.io Infrastructure" purpose="Backend application hosting and database management with edge optimization" region="Primary: Mumbai, India" />
              </div>
            </div>
          </div>
        </div>
      );

    case "social":
      return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ModalHeader num="06" title="Social Auth" />
          <div className="p-10 rounded-[2.5rem] border border-white/5 bg-white/[0.01]">
            <h4 className="text-2xl font-black uppercase tracking-tight text-white mb-6">Auth Model</h4>
            <p className="text-lg mb-8 text-zinc-400 leading-relaxed">
              gopwnit currently employs a <strong className="text-purple-400 font-bold">proprietary authentication system</strong> and does not integrate with third-party social providers.
            </p>
            <div className="p-8 rounded-[2rem] bg-purple-500/5 border border-purple-500/20">
              <h5 className="font-black uppercase tracking-widest text-[10px] text-purple-400 mb-6">Future Considerations</h5>
              <div className="space-y-4">
                {["Advance notice to all users", "Explicit policy updates", "Maintaining choice of login methods", "Granular permission controls"].map((text) => (
                  <div key={text} className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-zinc-300">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );

    case "retention":
      return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ModalHeader num="07" title="Data Retention" />
          <div className="space-y-12">
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-purple-400 mb-6">Deletion Protocols</h4>
              <p className="text-xl leading-relaxed text-zinc-300">
                Users may request complete account deletion at any time via settings.
                Requests are processed within 30 days of verification.
              </p>
            </div>
            <div className="p-10 rounded-[2.5rem] border border-white/5 bg-white/[0.01]">
              <h4 className="text-xl font-black uppercase tracking-tight text-white mb-6">Mandatory Security Retention</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <RetentionItem item="Email Address" purpose="Verification and security" />
                <RetentionItem item="Legal Name"    purpose="Compliance reporting" />
                <RetentionItem item="Platform ID"   purpose="Abuse prevention" />
                <RetentionItem item="Audit Logs"    purpose="Security investigations" />
              </div>
            </div>
          </div>
        </div>
      );

    case "rights":
      return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ModalHeader num="08" title="Privacy Rights" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RightCard title="Data Access"  description="Request a complete copy of your personal metadata." />
            <RightCard title="Correction"   description="Update inaccurate information through your dashboard." />
            <RightCard title="Deletion"     description="Request data purging with security retention limits." />
            <RightCard title="Limitation"   description="Restrict processing while maintaining security." />
            <RightCard title="Portability"  description="Receive data in a portable, interoperable format." />
            <RightCard title="Objection"    description="Object to specific processing based on context." />
          </div>
          <div className="p-10 rounded-[2.5rem] border border-purple-500/40 bg-purple-500/[0.05] text-center">
            <h4 className="text-2xl font-black uppercase tracking-tighter text-white mb-6">Exercise Your Rights</h4>
            <div className="flex flex-col items-center gap-6">
              <Mail className="w-12 h-12 text-purple-400" />
              <a href="mailto:gopwnit@gmail.com" className="text-2xl font-black text-purple-400 hover:text-white transition-colors underline decoration-purple-500/30">
                gopwnit@gmail.com
              </a>
              <p className="text-sm text-zinc-500 uppercase tracking-widest font-bold">Include &quot;Privacy Request&quot; in subject line</p>
            </div>
          </div>
        </div>
      );

    case "updates":
      return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ModalHeader num="09" title="Policy Updates" />
          <div className="space-y-12">
            <div className="p-10 rounded-[3rem] border border-white/5 bg-white/[0.01]">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-purple-400 mb-8">Change Management</h4>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <span className="px-3 py-1 rounded bg-zinc-800 text-zinc-400 text-[10px] font-black uppercase tracking-widest">Minor</span>
                  <h5 className="text-lg font-bold text-white">Clarifications</h5>
                  <p className="text-sm text-zinc-500">Formatting, contact updates, or non-material improvements.</p>
                </div>
                <div className="space-y-4">
                  <span className="px-3 py-1 rounded bg-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-widest">Major</span>
                  <h5 className="text-lg font-bold text-white">Substantive</h5>
                  <p className="text-sm text-zinc-500">New collection practices or material rights modifications.</p>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { icon: Mail,         text: "Email notifications for major updates" },
                { icon: Shield,       text: "In-platform security announcements" },
                { icon: Clock,        text: "30-day advance notice for changes" },
                { icon: CheckCircle,  text: "Comprehensive version history" },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-4 p-5 rounded-2xl border border-white/5 bg-white/[0.01]">
                  <Icon size={18} className="text-purple-400" />
                  <span className="text-sm text-zinc-300 font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "contact":
      return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ModalHeader num="10" title="Contact & DPO" />
          <div className="p-12 rounded-[3rem] border border-purple-500/20 bg-purple-500/[0.02] text-center">
            <h4 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">Privacy Response Team</h4>
            <p className="text-lg text-zinc-400 mb-8">Direct channel for data protection concerns</p>
            <a href="mailto:gopwnit@gmail.com" className="text-3xl md:text-5xl font-black text-purple-400 hover:text-white transition-colors underline decoration-purple-500/20">
              gopwnit@gmail.com
            </a>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-8 rounded-[2.5rem] border border-white/5 bg-white/[0.01]">
              <h5 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-6">SLY Timeframes</h5>
              <div className="space-y-4">
                {[
                  { label: "General",         time: "48-72 Hours" },
                  { label: "Rights Requests", time: "30 Days"     },
                  { label: "Security",        time: "24 Hours"    },
                ].map(({ label, time }) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-zinc-400 text-sm">{label}</span>
                    <span className="font-bold text-purple-400 text-sm">{time}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-blue-500/5 border border-blue-500/20">
              <h5 className="text-xs font-black uppercase tracking-[0.3em] text-blue-400 mb-4">DPDP Act Compliance</h5>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Adhering to the Digital Personal Data Protection Act, 2023 (India) and international standards.
                Providing safe, transparent, and sovereign data management for all cybersecurity learners.
              </p>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}