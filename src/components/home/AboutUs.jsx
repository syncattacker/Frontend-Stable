"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {ArrowRight} from "@phosphor-icons/react";
import Image from "next/image";
import logo from "@/img/svgg.svg";

const TOKENS = {
  brand: "#a855f7",
  brandHover: "#c084fc",
  accent: "#1e1b4b",
  bgDeep: "#020205",
  bgLayer: "rgba(255, 255, 255, 0.01)",
  glassBg: "rgba(8, 8, 12, 0.6)",
  border: "rgba(255, 255, 255, 0.03)",
  borderFocus: "rgba(168, 85, 247, 0.25)",
  textPrimary: "#FFFFFF",
  textMuted: "#94a3b8",
};

const AmbientGlow = ({
  color = TOKENS.brand,
  opacity = 0.1,
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
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
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
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        ...style,
      }}
      className={`relative rounded-3xl transition-shadow duration-300 hover:shadow-[0_20px_60px_rgba(168,85,247,0.1)] group ${className}`}
    >
      <div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 50%, rgba(168,85,247,0.05) 100%)",
          transform: "translateZ(1px)",
        }}
      />
      <div style={{ transform: "translateZ(30px)" }}>{children}</div>
    </motion.div>
  );
};

const AboutUs = () => {
  const mainRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    mouseX.set(clientX);
    mouseY.set(clientY);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="w-full relative text-white font-roundo overflow-hidden py-24 px-6"
      style={{ background: TOKENS.bgDeep }}
    >
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <AmbientGlow
            color={TOKENS.brand}
            opacity={0.12}
            className="-top-48 -left-48"
          />
          <AmbientGlow
            color={TOKENS.accent}
            opacity={0.08}
            className="bottom-0 -right-64"
          />
        </div>

        <TiltCard
          className="p-12 md:p-20 border backdrop-blur-3xl overflow-hidden relative z-10"
          style={{ background: TOKENS.glassBg, borderColor: TOKENS.border }}
        >
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-3/5 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-8 inline-flex items-center gap-3 backdrop-blur-xl rounded-full px-5 py-2 border border-white/5 bg-white/5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7] animate-pulse" />
                <span
                  className="text-xs font-bold tracking-[0.3em] uppercase opacity-80"
                  style={{ color: TOKENS.brand }}
                >
                  Our Mission
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-5xl md:text-7xl font-black font-outfit uppercase tracking-tighter mb-8 leading-[0.9] text-white"
              >
                Empowering <br />
                <span style={{ color: TOKENS.brand }}>Professionals.</span>
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-6"
              >
                <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-light">
                  At{" "}
                  <span className="font-bold" style={{ color: TOKENS.brand }}>
                    gopwnit
                  </span>
                  , we're building the most realistic and hands-on offensive
                  security platform in the world.
                </p>
                <p className="text-lg text-zinc-400 leading-relaxed max-w-2xl">
                  Our mission is to equip the next generation of security
                  experts with actual, real-world skills through immersive labs,
                  collaborative CTF challenges, and a community-driven learning
                  environment.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mt-12 flex flex-wrap justify-center lg:justify-start gap-6"
              >
                <button className="flex items-center gap-3 text-sm font-black uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 bg-[#a855f7] hover:bg-[#c084fc] text-white shadow-xl shadow-purple-950/20 group">
                  Join The Community
                  <ArrowRight
                    size={16}
                    weight="bold"
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="w-full lg:w-2/5 flex justify-center"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-[#a855f7]/20 rounded-full blur-[80px] group-hover:bg-[#a855f7]/30 transition-colors" />
                <Image
                  src={logo}
                  alt="GoPwnit Logo"
                  width={320}
                  height={320}
                  className="relative z-10 transition-transform duration-500 group-hover:scale-105 drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]"
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
