import React from "react";
import { ArrowRight } from "@phosphor-icons/react";

const TOKENS = {
    brand: "#a855f7",
    border: "rgba(255, 255, 255, 0.03)",
};

const AuxButton = ({ children, primary = true, onClick }) => (
    <button
        onClick={onClick}
        className={`group relative flex items-center gap-3 px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm font-outfit transition-all duration-300 overflow-hidden ${primary ? 'text-white' : 'text-white border'}`}
        style={primary ? { background: TOKENS.brand } : { borderColor: TOKENS.border }}
    >
        {primary && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />}
        <span className="relative z-10">{children}</span>
        <ArrowRight className="relative z-10 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
    </button>
);

const CTAStrip = ({ onOpenSignUp }) => {
    return (
        <section className="py-32 relative z-10 overflow-hidden border-t" style={{ borderColor: TOKENS.border, background: '#020205' }}>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[1000px] h-[500px] rounded-[100%] absolute blur-[150px] opacity-30" style={{ background: `radial-gradient(ellipse, ${TOKENS.brand}, transparent)` }} />
            </div>
            <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
                <h2 className="text-6xl md:text-8xl font-black font-outfit uppercase tracking-tighter mb-8 text-white drop-shadow-2xl">
                    Ignite Your <br /> <span style={{ color: TOKENS.brand }}>Potential.</span>
                </h2>
                <div className="flex justify-center mt-12">
                    <AuxButton primary={true} onClick={onOpenSignUp}>Start Your Journey</AuxButton>
                </div>
            </div>
        </section>
    );
};

export default CTAStrip;
