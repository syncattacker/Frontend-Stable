"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import AnimatedBlurBg from "@/components/home/AnimatedBlurBg";
import watermark from "@/img/white.svg";

const T = {
  bg: "#0A0A0A",
  cream: "#F0EDE6",
  muted: "#888880",
  border: "rgba(255,255,255,0.12)",
  borderFocus: "rgba(232,228,217,0.30)",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.12, delayChildren: 0.05 } },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const NotFound = ({ onOpenSignUp, onOpenLogin }) => {
  const router = useRouter();

  return (
    <div
      className="flex flex-col min-h-screen text-white selection:bg-white/10 selection:text-white"
      style={{ background: T.bg, fontFamily: "'Outfit', sans-serif" }}
    >
      <Navbar onOpenSignUp={onOpenSignUp} onOpenLogin={onOpenLogin} />

      {/* Background */}
      <div className="fixed inset-0 z-0">
        <AnimatedBlurBg />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" />
      </div>

      <motion.main
        className="relative z-10 grow flex items-center justify-center px-4 pt-32 pb-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
          <Image src={watermark} alt="gopwnit" fill className="object-contain" priority={false} />
        </div>

        <div className="max-w-2xl w-full relative z-10">

          {/* Top label */}
          <motion.div variants={itemVariants} className="mb-8">
            <span
              className="text-[10px] font-bold tracking-[0.28em] uppercase"
              style={{ color: T.muted, fontFamily: "'Outfit', sans-serif" }}
            >
              Error — GOPWNIT / NOT FOUND
            </span>
          </motion.div>

          {/* Divider */}
          <motion.div
            variants={itemVariants}
            className="mb-8"
            style={{ height: "1px", background: T.border }}
          />

          {/* 404 heading */}
          <motion.div variants={itemVariants} className="mb-2">
            <h1
              className="leading-none tracking-tight text-transparent bg-clip-text"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(6rem, 20vw, 14rem)",
                backgroundImage: `linear-gradient(180deg, ${T.cream} 0%, rgba(240,237,230,0.25) 100%)`,
              }}
            >
              404
            </h1>
          </motion.div>

          {/* Subheading */}
          <motion.div variants={itemVariants} className="mb-6">
            <h2
              className="uppercase leading-none"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(1.8rem, 5vw, 3rem)",
                color: T.muted,
                letterSpacing: "0.06em",
              }}
            >
              Page Not Found
            </h2>
          </motion.div>

          {/* Body copy */}
          <motion.div variants={itemVariants} className="mb-12 max-w-sm">
            <p
              className="text-[13px] leading-relaxed"
              style={{ color: T.muted, fontFamily: "'Outfit', sans-serif" }}
            >
              The page you&apos;re looking for has vanished into the digital void.
              It may have been moved, deleted, or never existed.
            </p>
          </motion.div>

          {/* Divider */}
          <motion.div
            variants={itemVariants}
            className="mb-8"
            style={{ height: "1px", background: T.border }}
          />

          {/* Buttons */}
          <motion.div variants={itemVariants} className="flex items-center gap-3">
            <motion.button
              onClick={() => router.push("/dashboard")}
              className="py-3.5 px-8 font-black uppercase tracking-[0.18em] text-[11px] transition-all duration-200"
              style={{
                background: T.cream,
                color: T.bg,
                fontFamily: "'Outfit', sans-serif",
                border: `1px solid ${T.cream}`,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#FFFFFF"; e.currentTarget.style.borderColor = "#FFFFFF"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = T.cream; e.currentTarget.style.borderColor = T.cream; }}
              whileTap={{ scale: 0.98 }}
            >
              Go Back
            </motion.button>

            <motion.button
              onClick={() => router.push("/")}
              className="py-3.5 px-8 font-bold uppercase tracking-[0.18em] text-[11px] transition-all duration-200"
              style={{
                background: "transparent",
                color: T.muted,
                fontFamily: "'Outfit', sans-serif",
                border: `1px solid ${T.border}`,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.borderFocus; e.currentTarget.style.color = T.cream; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; }}
              whileTap={{ scale: 0.98 }}
            >
              Return Home
            </motion.button>
          </motion.div>

          {/* Footer note */}
          <motion.div variants={itemVariants} className="mt-16">
            <p
              className="text-[14px] tracking-[0.14em]"
              style={{ color: "rgba(255,255,255,0.15)", fontFamily: "'Outfit', sans-serif" }}
            >
              Need help?{" "}
              <a
                href="mailto:gopwnit@gmail.com"
                className="transition-colors duration-150"
                style={{ color: T.muted }}
                onMouseEnter={(e) => { e.currentTarget.style.color = T.cream; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = T.muted; }}
              >
                gopwnit@gmail.com
              </a>
            </p>
          </motion.div>

        </div>
      </motion.main>

      <Footer />
    </div>
  );
};

export default NotFound;