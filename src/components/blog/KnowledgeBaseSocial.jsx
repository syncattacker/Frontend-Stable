'use client'; // ← added

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image'; // ← was regular <img>

// ⚠️ SVG import ke liye 2 options:
// Option 1 (easy): f2.svg ko /public/f2.svg mein rakho, phir src="/f2.svg" use karo
// Option 2: next.config.js mein @svgr/webpack configure karo

const SocialCard = ({ subtitle, title, cta, members, link, titleColor = "text-white", arrowColor = "text-gray-500" }) => (
    <a href={link} target="_blank" rel="noreferrer" className="flex flex-col justify-center items-center h-full group hover:bg-white/[0.02] transition-colors p-10 md:p-14 relative z-20">
        <span className="text-xs font-mono tracking-[0.2em] text-gray-500 uppercase mb-8">{subtitle}</span>

        <h3 className={`text-5xl md:text-[56px] font-bold mb-10 flex items-center gap-4 transition-colors ${titleColor} group-hover:opacity-80`}>
            {title} <ArrowUpRight size={28} className={`${arrowColor} transition-colors`} strokeWidth={2} />
        </h3>

        {members ? (
            <div className="border border-gray-700/50 px-6 py-2.5 flex items-center gap-2 relative bg-black/40">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gray-400"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gray-400"></div>
                <span className="text-white font-bold text-sm md:text-base">{members.count}</span>
                <span className="text-gray-500 text-xs font-mono tracking-widest uppercase">{members.label}</span>
            </div>
        ) : (
            <div className="border border-gray-700/50 px-8 py-3 relative hover:border-gray-500 transition-colors bg-black/40">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gray-400"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gray-400"></div>
                <span className="text-gray-300 text-xs font-mono tracking-widest uppercase">{cta}</span>
            </div>
        )}
    </a>
);

const KnowledgeBaseSocial = () => {
    return (
        <div className="border-t border-purple-900/40 relative mt-24 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 relative z-10">

                <div className="md:border-r border-b border-purple-900/40 min-h-[350px] relative">
                    <SocialCard subtitle="JOIN OUR" title="Telegram" titleColor="text-green-500" arrowColor="text-green-500" members={{ count: "195K+", label: "MEMBERS" }} link="#" />
                </div>

                <div className="border-b border-purple-900/40 min-h-[350px] relative">
                    <SocialCard subtitle="HOP INTO" title="Discord" titleColor="text-white" members={{ count: "45K+", label: "MEMBERS" }} link="https://discord.gg/4Mb6xXce8q" />
                </div>

                <div className="md:border-r border-purple-900/40 min-h-[350px] border-b md:border-b-0 relative">
                    <SocialCard subtitle="FOLLOW OUR" title="Twitter" titleColor="text-white" members={{ count: "1M+", label: "FOLLOWERS" }} link="#" />
                </div>

                <div className="min-h-[350px] relative">
                    <SocialCard subtitle="DROP US A MESSAGE" title="Contact" titleColor="text-white" cta="LET'S TALK!" link="#" />
                </div>

                {/* Center Badge */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-40 h-40 rounded-[2.5rem] bg-[#111] z-30 shadow-[0_0_80px_rgba(236,72,153,0.15)]">
                    <div
                        className="absolute inset-0 rounded-[2.5rem] p-[2px] bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600"
                        style={{ WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }}
                    />
                    <div
                        className="absolute inset-2 rounded-[2rem] opacity-30"
                        style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '12px 12px' }}
                    />

                    {/* ← Option 1: public folder use karo */}
                    <img
                        src="/f2.svg"
                        alt="logo"
                        className="w-16 h-16 object-contain z-40 brightness-200"
                        style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.8))' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default KnowledgeBaseSocial;