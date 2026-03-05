"use client";

import React, { useState, useEffect } from "react";
import {
  Shield,
  Target,
  Settings,
  AlertTriangle,
  MessageCircle,
  Heart,
  X,
  Gamepad2,
  Flag,
  Ban,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
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

export default function CodeOfConduct({ onOpenSignUp, onOpenLogin }) {
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
    document.body.style.overflow = "";
  };

  const sections = [
    {
      id: "principles",
      title: "General Principles",
      icon: Shield,
      summary: "Core values and fundamental principles for all platform users.",
      number: "01",
    },
    {
      id: "players",
      title: "CTF Players",
      icon: Target,
      summary:
        "Guidelines and expectations for participants in CTF challenges.",
      number: "02",
    },
    {
      id: "hosts",
      title: "CTF Hosts",
      icon: Settings,
      summary:
        "Responsibilities and standards for challenge creators and organizers.",
      number: "03",
    },
    {
      id: "prohibited",
      title: "Prohibited Actions",
      icon: Ban,
      summary: "Strictly forbidden actions that violate platform integrity.",
      number: "04",
    },
    {
      id: "consequences",
      title: "Consequences",
      icon: AlertTriangle,
      summary: "Enforcement actions and penalties for conduct violations.",
      number: "05",
    },
    {
      id: "reporting",
      title: "Reporting",
      icon: MessageCircle,
      summary: "How to report misconduct and platform abuse safely.",
      number: "06",
    },
    {
      id: "commitment",
      title: "Our Commitment",
      icon: Heart,
      summary:
        "gopwnit's dedication to fostering a safe and inclusive community.",
      number: "07",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#020205] text-white font-outfit selection:bg-purple-500/30 selection:text-purple-200">
      <Navbar onOpenSignUp={onOpenSignUp} onOpenLogin={onOpenLogin} />

      <div className="fixed inset-0 z-0">
        <AnimatedBlurBg />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      </div>

      <main className="relative z-10 grow pt-32">
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
                <span className="text-xs font-black uppercase tracking-[0.3em] text-purple-400">
                  Community Standards
                </span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9]">
                Code Of <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-white to-purple-600">
                  Conduct
                </span>
              </h1>
              <p className="max-w-2xl text-zinc-400 text-lg md:text-xl font-medium leading-relaxed">
                We believe in a secure, ethical, and respectful environment
                where cybersecurity enthusiasts can learn, play, and host
                challenges with integrity.
              </p>

              <div className="pt-8 flex flex-wrap gap-8 text-sm border-t border-white/5 max-w-2xl">
                <div>
                  <span className="block text-zinc-500 uppercase tracking-widest text-[10px] font-black mb-1">
                    Last Updated
                  </span>
                  <span className="font-bold text-white">July 29, 2025</span>
                </div>
                <div>
                  <span className="block text-zinc-500 uppercase tracking-widest text-[10px] font-black mb-1">
                    Version
                  </span>
                  <span className="font-bold text-white">1.0.0 (Global)</span>
                </div>
                <div>
                  <span className="block text-zinc-500 uppercase tracking-widest text-[10px] font-black mb-1">
                    Contact
                  </span>
                  <span className="font-bold text-white">
                    gopwnit@gmail.com
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
              variants={{
                visible: { transition: { staggerChildren: 0.05 } },
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {sections.map((section) => (
                <SectionCard
                  key={section.id}
                  section={section}
                  onClick={() => openModal(section.id)}
                />
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />

      <AnimatePresence>
        {activeModal && (
          <Modal onClose={closeModal}>{renderModalContent(activeModal)}</Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function SectionCard({ section, onClick }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      onClick={onClick}
      className="group relative p-8 rounded-4xl border transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
      style={{
        background: T.glassCard,
        borderColor: T.border,
      }}
      whileHover={{
        y: -8,
        borderColor: T.brandBorder,
        background: "rgba(20, 20, 35, 0.6)",
      }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-2xl rounded-full pointer-events-none group-hover:bg-purple-500/10 transition-colors" />

      <div className="flex items-center justify-between mb-8">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300"
          style={{
            background: "rgba(255,255,255,0.03)",
            borderColor: "rgba(255,255,255,0.05)",
          }}
        >
          <section.icon size={20} className="text-purple-400" />
        </div>
        <span className="text-2xl font-black text-white/10 tracking-tighter group-hover:text-purple-500/20 transition-colors">
          {section.number}
        </span>
      </div>

      <div className="grow">
        <h3 className="text-xl font-black uppercase tracking-tight text-white mb-3 group-hover:text-purple-400 transition-colors">
          {section.title}
        </h3>
        <p className="text-zinc-400 text-sm leading-relaxed mb-8">
          {section.summary}
        </p>
      </div>

      <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:text-purple-400 transition-colors">
          View Standards
        </span>
        <div className="w-8 h-8 rounded-full flex items-center justify-center border border-white/5 group-hover:border-purple-500/30 group-hover:bg-purple-500/10 transition-all">
          <ChevronRight
            size={14}
            className="text-zinc-500 group-hover:text-purple-400"
          />
        </div>
      </div>
    </motion.div>
  );
}

function Modal({ children, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-10">
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
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-purple-500/50 to-transparent" />

        <div className="flex items-center justify-between p-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-400">
              Conduct Protocol Content
            </h2>
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

// Helper Components
function ModalHeader({ num, title }) {
  return (
    <div className="flex items-center gap-6 mb-12">
      <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
        <span className="text-3xl font-black text-purple-400">{num}</span>
      </div>
      <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
        {title}
      </h3>
    </div>
  );
}

function GuidelineItem({ text }) {
  return (
    <div className="group flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-white/2 hover:bg-white/4 transition-all">
      <div className="w-1.5 h-1.5 rounded-full bg-purple-500/40 group-hover:bg-purple-500 transition-colors" />
      <span className="text-zinc-300 text-sm font-medium">{text}</span>
    </div>
  );
}

function GuidelineCard({ title, description, icon: Icon }) {
  return (
    <div className="p-6 rounded-2xl border border-white/5 bg-white/2 hover:border-purple-500/20 transition-all">
      <div className="flex items-start gap-4">
        {Icon && <Icon className="w-5 h-5 mt-1 text-purple-400" />}
        <div>
          <h5 className="font-black uppercase tracking-tight text-white mb-2">
            {title}
          </h5>
          <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

function renderModalContent(sectionId) {
  switch (sectionId) {
    case "principles":
      return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ModalHeader num="01" title="General Principles" />
          <p className="text-xl leading-relaxed text-zinc-300 max-w-3xl">
            Welcome to{" "}
            <span className="text-purple-400 font-bold">gopwnit</span>. Our
            platform is built for cybersecurity enthusiasts to learn, play, and
            host challenges in a secure, ethical, and respectful environment.
          </p>

          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-purple-400 mb-6 flex items-center gap-3">
              <div className="w-8 h-px bg-purple-500/30" /> Core Values
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <GuidelineItem text="Respect all users, hosts, and organizers" />
              <GuidelineItem text="No abuse, harassment, or hate speech" />
              <GuidelineItem text="Maintain platform integrity and security" />
              <GuidelineItem text="Follow ethical hacking and cybersecurity laws" />
              <GuidelineItem text="Do not exploit or abuse platform systems" />
              <GuidelineItem text="Report vulnerabilities responsibly" />
            </div>
          </div>
        </div>
      );

    case "players":
      return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ModalHeader num="02" title="CTF Players" />
          <p className="text-xl text-zinc-400">
            Expectations for participants in Capture The Flag challenges:
          </p>

          <div className="space-y-6">
            <GuidelineCard
              title="Fair Play Standards"
              description="Compete honestly without brute-force attacks or exploiting unintended platform vulnerabilities."
              icon={Gamepad2}
            />
            <GuidelineCard
              title="Scope Boundaries"
              description="Stay within challenge scope - attack only designated targets, never platform infrastructure."
              icon={Target}
            />
            <GuidelineCard
              title="No Spoilers Policy"
              description="Protect the integrity of challenges by not sharing flags or solutions during active events."
              icon={Flag}
            />
          </div>
        </div>
      );

    case "hosts":
      return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ModalHeader num="03" title="CTF Hosts" />
          <div className="grid md:grid-cols-2 gap-6">
            <GuidelineCard
              title="Fair Challenge Design"
              description="Create balanced, educational challenges that test skill without being harmful or misleading."
            />
            <GuidelineCard
              title="Data Protection"
              description="Never misuse player data or inject malicious content into hosted challenges."
            />
            <GuidelineCard
              title="Inclusive Content"
              description="Avoid offensive, discriminatory, or biased themes that could harm the community."
            />
            <GuidelineCard
              title="Stability"
              description="Design challenges that don't negatively impact platform performance or resource availability."
            />
          </div>
        </div>
      );

    case "prohibited":
      return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ModalHeader num="04" title="Prohibited Actions" />
          <div className="p-10 rounded-[2.5rem] border border-red-500/20 bg-red-500/2">
            <h4 className="text-2xl font-black uppercase tracking-tight text-red-500 mb-6">
              Strictly Forbidden
            </h4>
            <div className="grid md:grid-cols-2 gap-6 text-zinc-300">
              {[
                "Platform exploitation or privilege escalation",
                "Automated disruption or bot attacks",
                "Using gopwnit to target external systems",
                "Identity fraud or impersonation",
                "Sharing private data of other users",
                "Resource flooding or system abuse",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Ban size={14} className="text-red-500" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "consequences":
      return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ModalHeader num="05" title="Consequences" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-8 rounded-4xl border border-white/5 bg-white/2">
              <h5 className="font-black text-white mb-4 uppercase tracking-widest text-[10px]">
                Account Actions
              </h5>
              <p className="text-sm text-zinc-400 capitalize">
                Suspension, Termination, or Shadow-banning based on violation
                severity.
              </p>
            </div>
            <div className="p-8 rounded-4xl border border-white/5 bg-white/2">
              <h5 className="font-black text-white mb-4 uppercase tracking-widest text-[10px]">
                Content Removal
              </h5>
              <p className="text-sm text-zinc-400 capitalize">
                Deletion of hosted challenges or user-generated materials.
              </p>
            </div>
            <div className="p-8 rounded-4xl border border-red-500/10 bg-red-500/1">
              <h5 className="font-black text-red-500 mb-4 uppercase tracking-widest text-[10px]">
                Achievement Forfeiture
              </h5>
              <p className="text-sm text-zinc-400 capitalize">
                Loss of leaderboard rankings, certs, and earned rewa`1rds.
              </p>
            </div>
            <div className="p-8 rounded-4xl border border-red-500/10 bg-red-500/1">
              <h5 className="font-black text-red-500 mb-4 uppercase tracking-widest text-[10px]">
                Legal Referral
              </h5>
              <p className="text-sm text-zinc-400 capitalize">
                Escalation to law enforcement for criminal or destructive
                activities.
              </p>
            </div>
          </div>
        </div>
      );

    case "reporting":
      return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ModalHeader num="06" title="Reporting Protocol" />
          <div className="p-12 rounded-[3rem] border border-purple-500/20 bg-purple-500/2 text-center">
            <h4 className="text-3xl font-black uppercase tracking-tighter text-white mb-4">
              Submit Breach Report
            </h4>
            <p className="text-lg text-zinc-400 mb-8">
              Maintain anonymity while helping secure our borders.
            </p>
            <a
              href="mailto:gopwnit@gmail.com"
              className="text-3xl md:text-5xl font-black text-purple-400 transition-colors underline decoration-purple-500/20"
            >
              gopwnit@gmail.com
            </a>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-8 rounded-4xl border border-white/5 bg-white/2">
              <h5 className="font-black text-white mb-4 uppercase tracking-widest text-[10px]">
                What to Include
              </h5>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>• Detailed description of incident</li>
                <li>• Involved usernames or IDs</li>
                <li>• Proof of violation (Screenshots/Logs)</li>
              </ul>
            </div>
            <div className="p-8 rounded-4xl border border-white/5 bg-white/2">
              <h5 className="font-black text-white mb-4 uppercase tracking-widest text-[10px]">
                Process
              </h5>
              <p className="text-sm text-zinc-400">
                Every report is reviewed within 24-48 hours by our internal
                Integrity Team. Retaliation is strictly prohibited.
              </p>
            </div>
          </div>
        </div>
      );

    case "commitment":
      return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ModalHeader num="07" title="Our Commitment" />
          <div className="p-10 rounded-[2.5rem] border border-purple-500/20 bg-purple-500/3">
            <h4 className="text-4xl font-black uppercase tracking-tighter text-white mb-4">
              Building The Future
            </h4>
            <p className="text-xl text-zinc-300 leading-relaxed">
              gopwnit is dedicated to{" "}
              <strong className="text-purple-400">
                fostering a safe, inclusive world
              </strong>{" "}
              where talent and ethics meet. We continuously improve our systems
              to reflect the latest in platform safety.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Safety-first platform moderation",
              "Inclusion for all skill levels",
              "Promotion of ethical hacking standards",
              "Continuous policy evolution",
            ].map((text, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-5 rounded-2xl border border-white/5 bg-white/1"
              >
                <CheckCircle size={18} className="text-purple-400" />
                <span className="text-sm text-zinc-300 font-medium">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      );

    default:
      return null;
  }
}