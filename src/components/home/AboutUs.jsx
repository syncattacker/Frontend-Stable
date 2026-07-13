"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";
import Image from "next/image";
import logo from "@/img/svgg.svg";

const TOKENS = {
  brand: "#E8E4D9",
  brandHover: "#FFFFFF",
  accent: "#1a1a1a",
  bgDeep: "#0A0A0A",
  bgLayer: "rgba(255, 255, 255, 0.01)",
  glassBg: "rgba(14, 14, 14, 0.85)",
  border: "rgba(255, 255, 255, 0.07)",
  borderFocus: "rgba(232, 228, 217, 0.2)",
  textPrimary: "#E8E4D9",
  textMuted: "#6b6b6b",
};

const AmbientGlow = ({
  color = "#ffffff",
  opacity = 0.025,
  className = "",
}) => (
  <div
    className={`absolute w-150 h-150 rounded-full mix-blend-screen filter blur-[150px] pointer-events-none z-0 ${className}`}
    style={{
      background: `radial-gradient(circle, ${color}, transparent 75%)`,
      opacity,
    }}
  />
);

const TiltCard = ({ children, className = "", style = {} }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", ...style }}
      className={`relative transition-shadow duration-300 group ${className}`}
    >
      <div style={{ transform: "translateZ(30px)" }}>{children}</div>
    </motion.div>
  );
};

const AboutUs = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="w-full relative overflow-hidden py-24 px-6"
      style={{ background: TOKENS.bgDeep, color: TOKENS.textPrimary }}
    >
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <AmbientGlow color="#ffffff" opacity={0.02} className="-top-48 -left-48" />
          <AmbientGlow color="#ffffff" opacity={0.015} className="bottom-0 -right-64" />
        </div>

        <TiltCard
          className="p-12 md:p-20 border overflow-hidden relative z-10"
          style={{ background: TOKENS.glassBg, borderColor: TOKENS.border }}
        >
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* TEXT SIDE */}
            <div className="w-full lg:w-3/5 text-center lg:text-left">

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-8 inline-flex items-center gap-3 px-5 py-2"
                style={{
                  border: `1px solid ${TOKENS.borderFocus}`,
                  background: "rgba(232,228,217,0.04)",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: TOKENS.textMuted }}
                />
                <span
                  className="text-xs font-bold tracking-[0.3em] uppercase font-outfit"
                  style={{ color: TOKENS.textMuted }}
                >
                  Our Mission
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-5xl md:text-7xl font-black font-outfit uppercase tracking-tighter mb-8 leading-[0.9]"
                style={{ color: TOKENS.textPrimary }}
              >
                Empowering <br />
                <span style={{ color: TOKENS.textMuted }}>Professionals.</span>
              </motion.h2>

              {/* Body */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-6"
              >
                <p
                  className="text-xl md:text-2xl leading-relaxed font-light"
                  style={{ color: "rgba(232,228,217,0.7)" }}
                >
                  At{" "}
                  <span className="font-bold" style={{ color: TOKENS.textPrimary }}>
                    gopwnit
                  </span>
                  , we're building the most realistic and hands-on offensive
                  security platform in the world.
                </p>
                <p
                  className="text-lg leading-relaxed max-w-2xl"
                  style={{ color: TOKENS.textMuted }}
                >
                  Our mission is to equip the next generation of security
                  experts with actual, real-world skills through immersive labs,
                  collaborative CTF challenges, and a community-driven learning
                  environment.
                </p>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mt-12 flex flex-wrap justify-center lg:justify-start gap-6"
              >
                <a
                  href="https://discord.gg/4Mb6xXce8q"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-xs font-black uppercase tracking-widest px-8 py-4 transition-all duration-300 overflow-hidden relative"
                  style={{
                    background: TOKENS.brand,
                    color: "#0A0A0A",
                  }}
                >
                  <div
                    className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
                    style={{ background: "#FFFFFF" }}
                  />
                  <span className="relative z-10">Join The Community</span>
                  <ArrowRight
                    size={14}
                    weight="bold"
                    className="relative z-10 group-hover:translate-x-1 transition-transform"
                  />
                </a>
              </motion.div>
            </div>

            {/* LOGO SIDE */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="w-full lg:w-2/5 flex justify-center"
            >
              <div className="relative group">
                {/* Subtle white glow instead of purple */}
                <div
                  className="absolute inset-0 rounded-full blur-[80px] transition-opacity duration-500 opacity-20 group-hover:opacity-30"
                  style={{ background: "rgba(232,228,217,0.3)" }}
                />
                <Image
                  src={logo}
                  alt="GoPwnit Logo"
                  width={320}
                  height={320}
                  className="relative z-10 transition-transform duration-500 group-hover:scale-105"
                  style={{ filter: "brightness(0.9) grayscale(0.3)" }}
                />
              </div>
            </motion.div>
          </div>
        </TiltCard>
      </div>
    </div>
  );
};

export default AboutUs;