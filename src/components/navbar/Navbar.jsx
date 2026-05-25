"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import logo from "@/img/white.svg";
import "./Navbar.css";
import Image from "next/image";

const TOKENS = {
  border: "rgba(255, 255, 255, 0.07)",
  borderFocus: "rgba(232, 228, 217, 0.2)",
  textPrimary: "#E8E4D9",
  textMuted: "#6b6b6b",
  bgDeep: "#0A0A0A",
};

const Navbar = ({ onOpenSignUp }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleButtonClick = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      onOpenSignUp();
    }
  };

  const navbarVariants = {
    hidden: { y: -100, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        damping: 25,
        stiffness: 120,
      },
    },
  };

  const navbarHover = {
    scale: 1.01,
    y: -2,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  };

  const itemVariants = {
    rest: { scale: 1, color: TOKENS.textMuted },
    hover: {
      scale: 1.03,
      color: TOKENS.textPrimary,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    tap: { scale: 0.95 },
  };

  const menuVariants = {
    closed: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } },
    open: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3, staggerChildren: 0.07, delayChildren: 0.1 },
    },
  };

  const menuItemVariants = {
    closed: { opacity: 0, y: -10 },
    open: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      className="fixed top-4 left-0 right-0 z-50 px-4 py-2 font-outfit"
      variants={navbarVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Desktop navbar pill */}
      <motion.div
        className="navbar-container max-w-3xl mx-auto rounded-full bg-black/60 backdrop-blur-xl border px-6 py-3 flex items-center justify-between transition-all duration-300"
        whileHover={navbarHover}
        style={{ borderColor: TOKENS.border }}
      >
        {/* Logo */}
        <motion.div
          className="flex items-center space-x-2"
          variants={itemVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
        >
          <Image src={logo} alt="Logo" className="h-9 w-auto" />
        </motion.div>

        {/* Nav links */}
        <motion.div className="hidden md:flex items-center space-x-6" style={{ color: TOKENS.textMuted }}>
          {[
            { label: "Home", path: "/" },
            { label: "Blog", path: "/blog" },
            { label: "About Us", path: "/reviewboard" },
            { label: "Support", path: "/support" },
          ].map(({ label, path }) => (
            <motion.button
              key={label}
              className="text-sm tracking-wide transition-colors duration-200 font-outfit"
              variants={itemVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              onClick={() => router.push(path)}
            >
              {label}
            </motion.button>
          ))}
        </motion.div>

        {/* CTA Button — Desktop */}
        {!isAuthenticated && (
          <motion.button
            className="hidden md:flex cta-button text-xs font-bold uppercase tracking-widest py-2 px-6 items-center gap-2 transition-all duration-300 relative overflow-hidden"
            style={{ color: TOKENS.textPrimary, background: "transparent" }}
            variants={itemVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            onClick={onOpenSignUp}
          >
            <div className="animated-border" />
            <span className="z-10 relative">Register</span>
            <ArrowRight size={14} className="z-10 relative" style={{ color: TOKENS.textMuted }} />
          </motion.button>
        )}

        {isAuthenticated && (
          <motion.button
            className="hidden md:flex cta-button text-xs font-bold uppercase tracking-widest py-2 px-6 items-center gap-2 transition-all duration-300 relative overflow-hidden"
            style={{ color: TOKENS.textPrimary, background: "transparent" }}
            variants={itemVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            onClick={handleButtonClick}
          >
            <div className="animated-border" />
            <span className="z-10 relative">Dashboard</span>
            <ArrowRight size={14} className="z-10 relative" style={{ color: TOKENS.textMuted }} />
          </motion.button>
        )}

        {/* Hamburger — Mobile */}
        <motion.button
          className="md:hidden"
          variants={itemVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          onClick={toggleMenu}
          style={{ color: TOKENS.textPrimary }}
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" style={{ color: TOKENS.textMuted }} />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </motion.button>
      </motion.div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="absolute top-20 left-0 right-0 px-4 z-40"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <motion.div
              className="max-w-2xl mx-auto backdrop-blur-2xl border rounded-none p-4 shadow-2xl"
              style={{
                background: "rgba(10,10,10,0.95)",
                borderColor: TOKENS.border,
              }}
            >
              <motion.nav className="flex flex-col space-y-1">
                {[
                  { label: "Home", action: () => { toggleMenu(); router.push("/"); } },
                  { label: "Blog", action: () => { toggleMenu(); router.push("/blog"); } },
                  { label: "About Us", action: () => { toggleMenu(); router.push("/reviewboard"); } },
                  { label: "Support", action: () => { toggleMenu(); router.push("/support"); } },
                ].map(({ label, action }) => (
                  <motion.button
                    key={label}
                    className="py-3 px-4 text-sm text-left transition-colors duration-200 font-outfit"
                    style={{ color: TOKENS.textMuted, borderBottom: `1px solid ${TOKENS.border}` }}
                    variants={menuItemVariants}
                    onClick={action}
                    onMouseEnter={e => e.currentTarget.style.color = TOKENS.textPrimary}
                    onMouseLeave={e => e.currentTarget.style.color = TOKENS.textMuted}
                  >
                    {label}
                  </motion.button>
                ))}

                {/* Mobile CTA */}
                {!isAuthenticated && (
                  <motion.button
                    className="cta-button text-xs font-bold uppercase tracking-widest py-3 px-6 flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden mt-2"
                    style={{ color: TOKENS.textPrimary }}
                    variants={menuItemVariants}
                    onClick={onOpenSignUp}
                  >
                    <div className="animated-border" />
                    <span className="z-10 relative">Register</span>
                    <ArrowRight size={14} className="z-10 relative" style={{ color: TOKENS.textMuted }} />
                  </motion.button>
                )}

                {isAuthenticated && (
                  <motion.button
                    className="cta-button text-xs font-bold uppercase tracking-widest py-3 px-6 flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden mt-2"
                    style={{ color: TOKENS.textPrimary }}
                    variants={menuItemVariants}
                    onClick={() => router.push("/dashboard")}
                  >
                    <div className="animated-border" />
                    <span className="z-10 relative">Dashboard</span>
                    <ArrowRight size={14} className="z-10 relative" style={{ color: TOKENS.textMuted }} />
                  </motion.button>
                )}
              </motion.nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Navbar;

// "use client";

// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import { useRouter } from "next/navigation";
// import { motion, AnimatePresence } from "framer-motion";
// import { IconArrowRight, IconX, IconMenu2 } from "@tabler/icons-react";
// import logo from "@/img/white.svg";
// import Image from "next/image";

// const T = {
//   bg: "#0A0A0A",
//   cream: "#fefce8",
//   muted: "#a1a1aa",
//   border: "rgba(254,252,232,0.12)",
//   borderHover: "rgba(254,252,232,0.22)",
// };

// const navLinks = [
//   { label: "Home", path: "/" },
//   { label: "Blog", path: "/blog" },
//   { label: "About Us", path: "/reviewboard" },
//   { label: "Support", path: "/support" },
// ];

// const Navbar = ({ onOpenSignUp }) => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const router = useRouter();
//   const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

//   const handleCTA = () => isAuthenticated ? router.push("/dashboard") : onOpenSignUp();
//   const ctaLabel = isAuthenticated ? "Dashboard" : "Register";

//   return (
//     <>
//       {/* ── Desktop & Mobile bar ── */}
//       <motion.header
//         initial={{ y: -16, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
//         className="fixed top-0 left-0 right-0 z-50"
//         style={{ borderBottom: `1px solid ${T.border}`, background: T.bg }}
//       >
//         <div
//           className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between"
//           style={{ height: "52px" }}
//         >
//           {/* Logo */}
//           <button
//             onClick={() => router.push("/")}
//             className="flex items-center shrink-0"
//           >
//             <Image src={logo} alt="gopwnit" className="h-7 w-auto" />
//           </button>

//           {/* Nav links — desktop */}
//           <nav className="hidden md:flex items-center gap-8">
//             {navLinks.map(({ label, path }) => (
//               <button
//                 key={label}
//                 onClick={() => router.push(path)}
//                 className="text-[11px] uppercase tracking-[0.18em] transition-colors duration-200"
//                 style={{ color: T.muted, fontFamily: "Outfit, sans-serif" }}
//                 onMouseEnter={e => e.currentTarget.style.color = T.cream}
//                 onMouseLeave={e => e.currentTarget.style.color = T.muted}
//               >
//                 {label}
//               </button>
//             ))}
//           </nav>

//           {/* Right side */}
//           <div className="flex items-center gap-4">
//             {/* CTA — desktop */}
//             <button
//               onClick={handleCTA}
//               className="hidden md:flex items-center gap-2 text-[10px] uppercase tracking-widest px-4 py-1.5 transition-all duration-200"
//               style={{
//                 fontFamily: "Outfit, sans-serif",
//                 color: T.bg,
//                 background: T.cream,
//                 borderRadius: "2px",
//               }}
//               onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
//               onMouseLeave={e => e.currentTarget.style.opacity = "1"}
//             >
//               {ctaLabel}
//               <IconArrowRight size={12} />
//             </button>

//             {/* Hamburger — mobile */}
//             <button
//               className="md:hidden flex items-center justify-center w-8 h-8 transition-all"
//               style={{ color: T.muted, border: `1px solid ${T.border}`, borderRadius: "2px" }}
//               onClick={() => setIsMenuOpen(o => !o)}
//               aria-label="Toggle menu"
//               onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.color = T.cream; }}
//               onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; }}
//             >
//               {isMenuOpen
//                 ? <IconX size={15} />
//                 : <IconMenu2 size={15} />
//               }
//             </button>
//           </div>
//         </div>
//       </motion.header>

//       {/* ── Mobile menu ── */}
//       <AnimatePresence>
//         {isMenuOpen && (
//           <motion.div
//             key="mobile-menu"
//             initial={{ opacity: 0, y: -8 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -8 }}
//             transition={{ duration: 0.2, ease: "easeOut" }}
//             className="fixed top-[52px] left-0 right-0 z-40"
//             style={{ background: T.bg, borderBottom: `1px solid ${T.border}` }}
//           >
//             <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex flex-col gap-0">
//               {navLinks.map(({ label, path }, i) => (
//                 <button
//                   key={label}
//                   onClick={() => { router.push(path); setIsMenuOpen(false); }}
//                   className="text-left text-[11px] uppercase tracking-[0.18em] py-3 transition-colors duration-200"
//                   style={{
//                     color: T.muted,
//                     fontFamily: "Outfit, sans-serif",
//                     borderBottom: `1px solid ${T.border}`,
//                   }}
//                   onMouseEnter={e => e.currentTarget.style.color = T.cream}
//                   onMouseLeave={e => e.currentTarget.style.color = T.muted}
//                 >
//                   {label}
//                 </button>
//               ))}

//               {/* Mobile CTA */}
//               <button
//                 onClick={() => { handleCTA(); setIsMenuOpen(false); }}
//                 className="mt-4 flex items-center justify-center gap-2 py-2.5 text-[10px] uppercase tracking-widest transition-all"
//                 style={{
//                   fontFamily: "Outfit, sans-serif",
//                   background: T.cream,
//                   color: T.bg,
//                   borderRadius: "2px",
//                 }}
//               >
//                 {ctaLabel}
//                 <IconArrowRight size={12} />
//               </button>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* ── Spacer so page content clears the fixed bar ── */}
//       <div style={{ height: "52px" }} />
//     </>
//   );
// };

// export default Navbar;