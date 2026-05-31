'use client'; // ← only change needed

import React from 'react';
import { Twitter } from 'lucide-react';

const TweetCard = ({ name, handle, text, avatar }) => (
    <div className="p-8 h-full flex flex-col hover:bg-white/[0.02] transition-colors relative group">
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-gray-700 group-hover:border-gray-400 transition-colors"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-gray-700 group-hover:border-gray-400 transition-colors"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-gray-700 group-hover:border-gray-400 transition-colors"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-gray-700 group-hover:border-gray-400 transition-colors"></div>

        <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded bg-black border border-gray-700 flex items-center justify-center p-2">
                    <span className="text-white text-xl font-bold">{avatar}</span>
                </div>
                <div>
                    <h4 className="text-white font-medium">{name}</h4>
                    <span className="text-gray-500 text-sm">@{handle}</span>
                </div>
            </div>
            <Twitter size={20} className="text-gray-600" />
        </div>
        <p className="text-gray-400 text-sm leading-relaxed flex-1" dangerouslySetInnerHTML={{ __html: text }} />
    </div>
);

const KnowledgeBaseSeenOn = () => {
    return (
        <div className="border-t border-purple-900/40 mt-0">
            <div className="border-b border-gray-800 p-16 md:p-24 flex flex-col items-center justify-center">
                <div className="flex items-center gap-4 mb-8">
                    <span className="text-gray-500 font-bold tracking-widest text-xs">..</span>
                    <span className="text-[10px] md:text-xs font-mono tracking-widest text-white uppercase">JOIN THE</span>
                </div>

                <div className="relative inline-block border border-gray-700/50 p-8 md:p-10">
                    <h2 className="text-6xl md:text-8xl lg:text-9xl font-sans font-medium text-white tracking-wide">
                        <span className="font-mono tracking-tight text-white/50">CTF</span> Revolution
                    </h2>
                    <div className="absolute top-[-1px] left-[-1px] w-4 h-4 bg-[#0a0a0c] border-b border-r border-gray-700/50"></div>
                    <div className="absolute bottom-[-1px] right-[-1px] w-4 h-4 bg-[#0a0a0c] border-t border-l border-gray-700/50"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 border-b border-gray-800">
                <div className="lg:col-span-1 border-r border-gray-800 p-8 md:p-12 flex items-center lg:items-start justify-center lg:justify-start">
                    <span className="text-[10px] md:text-xs font-mono tracking-widest text-white uppercase block pt-8">
                        AS SEEN ON:
                    </span>
                </div>

                <div className="lg:col-span-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                        <div className="md:border-r border-b md:border-b-0 border-gray-800">
                            <TweetCard
                                avatar="⛓️"
                                name="BNB Chain"
                                handle="BNBCHAIN"
                                text='We asked <span class="text-white hover:underline cursor-pointer">@gopwnit</span> to explain Web3 Security: "A secure smart contract is fundamentally resilient against re-entrancy attacks."'
                            />
                        </div>
                        <div>
                            <TweetCard
                                avatar="♦️"
                                name="Tron Dao"
                                handle="trondao"
                                text='This collaboration with <span class="text-white hover:underline cursor-pointer">@gopwnit</span> is a game-changer for the <span class="text-white">#TRON</span> community!'
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KnowledgeBaseSeenOn;