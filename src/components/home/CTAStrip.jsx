"use client";

import React from "react";
import { IconArrowRight as ArrowRight } from "@tabler/icons-react";
import { useAuthModal } from "@/providers/AuthModalProvider";

const TOKENS = {
  brand: "#E8E4D9",
  brandHover: "#FFFFFF",
  bgDeep: "#0A0A0A",
  border: "rgba(255, 255, 255, 0.07)",
  textPrimary: "#E8E4D9",
  textMuted: "#6b6b6b",
};

const AuxButton = ({ children, primary = true, onClick }) => (
  <button
    onClick={onClick}
    className={`group relative flex items-center gap-3 px-8 py-4 rounded-none font-bold uppercase tracking-widest text-xs font-outfit transition-all duration-300 overflow-hidden`}
    style={
      primary
        ? { background: TOKENS.brand, color: "#0A0A0A" }
        : { background: "transparent", color: TOKENS.brand, border: `1px solid rgba(232,228,217,0.2)` }
    }
  >
    {primary && (
      <div
        className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
        style={{ background: "#FFFFFF" }}
      />
    )}
    <span className="relative z-10">{children}</span>
    <ArrowRight
      size={14}
      className="relative z-10 -rotate-45 group-hover:rotate-0 transition-transform duration-300"
    />
  </button>
);

const CTAStrip = () => {
  const { openSignUp } = useAuthModal();

  return (
    <section
      className="py-32 relative z-10 overflow-hidden"
      style={{ borderTop: `1px solid ${TOKENS.border}`, background: TOKENS.bgDeep }}
    >
      {/* Subtle ambient glow — white instead of purple */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[900px] h-[400px] rounded-[100%] absolute blur-[160px] opacity-10"
          style={{ background: `radial-gradient(ellipse, #ffffff, transparent)` }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
        <h2
          className="text-6xl md:text-8xl font-black font-outfit uppercase tracking-tighter mb-8 leading-[0.95]"
          style={{ color: TOKENS.textPrimary }}
        >
          Ignite Your <br />
          <span style={{ color: TOKENS.textMuted }}>Potential.</span>
        </h2>

        <div className="flex justify-center mt-12">
          <AuxButton primary={true} onClick={openSignUp}>
            Start Your Journey
          </AuxButton>
        </div>
      </div>
    </section>
  );
};

export default CTAStrip;