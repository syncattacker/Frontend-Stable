"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import logo from "@/img/f2.svg";
import "./Navbar.css";
import Image from "next/image";

const Navbar = ({ onOpenSignUp }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
const router = useRouter();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleButtonClick = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      onOpenSignUp();
    }
  };

  const navbarVariants = {
    hidden: {
      y: -100,
      opacity: 0,
      scale: 0.9,
    },
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
    scale: 1.02,
    y: -2,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  };

  const itemVariants = {
    rest: {
      scale: 1,
      color: "rgba(255, 255, 255, 0.7)",
    },
    hover: {
      scale: 1.05,
      color: "#FFFFFF",
      textShadow: "0 0 8px rgba(168, 85, 247, 0.4)",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
    open: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.07,
        delayChildren: 0.1,
      },
    },
  };

  const menuItemVariants = {
    closed: {
      opacity: 0,
      y: -10,
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      className="fixed top-4 left-0 right-0 z-50 px-4 py-2 font-outfit"
      variants={navbarVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="navbar-container max-w-3xl mx-auto rounded-full bg-black/40 backdrop-blur-xl border border-white/10 px-5 py-2 flex items-center justify-between shadow-2xl transition-all duration-300"
        whileHover={navbarHover}
        transition={{ duration: 0.3 }}
        style={{
          boxShadow: "0 10px 40px rgba(168, 85, 247, 0.15)",
          borderColor: "rgba(168, 85, 247, 0.2)"
        }}
      >
        <motion.div
          className="flex items-center space-x-2"
          variants={itemVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
        >
          <Image src={logo} alt="Logo" className="h-9 w-auto" />
        </motion.div>

        <motion.div className="hidden md:flex items-center space-x-6 text-gray-200">
          <motion.button
            className="hover:text-white transition-colors duration-200"
            variants={itemVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            onClick={() => router.push("/")}
          >
            Home
          </motion.button>
          <motion.button
            className="hover:text-white transition-colors duration-200"
            variants={itemVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            onClick={() => router.push("/blog")}
          >
            Blog
          </motion.button>
          <motion.button
            className="hover:text-white transition-colors duration-200"
            variants={itemVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            onClick={() => router.push("/reviewboard")}
          >
            About Us
          </motion.button>
          <motion.button
            className="hover:text-white transition-colors duration-200"
            variants={itemVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            onClick={() => router.push("/support")}
          >
            Support
          </motion.button>
        </motion.div>

        {!isAuthenticated && (
          <motion.button
            className="hidden md:flex cta-button backdrop-blur-sm border-0 text-white rounded-full py-2 px-6 items-center space-x-1 transition-all duration-300 text-sm relative overflow-hidden"
            variants={itemVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            onClick={onOpenSignUp}
          >
            <div className="animated-border"></div>
            <span className="z-10 relative">Register</span>
            <motion.div>
              <ArrowRight size={16} className="text-[#a855f7] z-10 relative" />
            </motion.div>
          </motion.button>
        )}

        {isAuthenticated && (
          <motion.button
            className="hidden md:flex cta-button backdrop-blur-sm border-0 text-white rounded-full py-2 px-6 items-center space-x-1 transition-all duration-300 text-sm relative overflow-hidden"
            variants={itemVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            onClick={() => handleButtonClick()}
          >
            <div className="animated-border"></div>
            <span className="z-10 relative">Dashboard</span>
            <motion.div>
              <ArrowRight size={16} className="text-[#a855f7] z-10 relative" />
            </motion.div>
          </motion.button>
        )}

        <motion.button
          className="md:hidden text-white"
          variants={itemVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          onClick={toggleMenu}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-[#a855f7]" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </motion.button>
      </motion.div>

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
              className="max-w-2xl mx-auto bg-[#08080c]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-2xl"
              style={{
                boxShadow: "0 10px 40px rgba(168, 85, 247, 0.15)",
                borderColor: "rgba(168, 85, 247, 0.2)"
              }}
            >
              <motion.nav className="flex flex-col space-y-3">
                <motion.button
                  className="text-gray-200 hover:text-white py-2 px-4 rounded-lg hover:bg-[#a855f7]/10 transition-colors duration-200 text-left"
                  variants={menuItemVariants}
                >
                  Home
                </motion.button>
                <motion.button
                  className="text-gray-200 hover:text-white py-2 px-4 rounded-lg hover:bg-[#a855f7]/10 transition-colors duration-200 text-left"
                  variants={menuItemVariants}
                  onClick={() => { toggleMenu(); router.push("/support"); }}
                >
                  Support
                </motion.button>

                {/* Register Button - Mobile - Show when not authenticated */}
                {!isAuthenticated && (
                  <motion.button
                    className="cta-button backdrop-blur-sm border-0 text-white rounded-full py-2 px-6 flex items-center justify-center space-x-1 transition-all duration-300 text-sm relative overflow-hidden mt-2"
                    variants={menuItemVariants}
                    onClick={onOpenSignUp}
                  >
                    <div className="animated-border"></div>
                    <span className="z-10 relative">Register</span>
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight
                        size={16}
                        className="text-[#a855f7] z-10 relative"
                      />
                    </motion.div>
                  </motion.button>
                )}

                {isAuthenticated && (
                  <motion.button
                    className="cta-button backdrop-blur-sm border-0 text-white rounded-full py-2 px-6 flex items-center justify-center space-x-1 transition-all duration-300 text-sm relative overflow-hidden mt-2"
                    variants={menuItemVariants}
                    onClick={() => router.push("/dashboard")}
                  >
                    <div className="animated-border"></div>
                    <span className="z-10 relative">Dashboard</span>
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight
                        size={16}
                        className="text-[#a855f7] z-10 relative"
                      />
                    </motion.div>
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