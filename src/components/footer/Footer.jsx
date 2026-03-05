"use client";

import Image from "next/image";
import Link from "next/link";
import { Instagram, Linkedin } from "lucide-react";
import logo from "@/img/f2.svg";

const footerData = {
  links: [
    { id: 1, name: "Home", href: "/", external: false },
    { id: 2, name: "About Us", href: "/reviewboard", external: false },
    { id: 3, name: "API Documentation", href: "https://docs.gopwnit.com", external: true },
    { id: 4, name: "Tool Documentation", href: "#", external: false },
    { id: 5, name: "System Status", href: "#", external: false },
  ],
  development: [
    { id: 1, name: "Bug Bounty", href: "#", external: false },
    { id: 2, name: "Become a Creator", href: "#", external: false },
    { id: 3, name: "GitHub", href: "https://github.com/GoPWNIt", external: true },
  ],
  community: [
    { id: 1, name: "Discord", href: "https://discord.gg/4Mb6xXce8q", external: true },
    { id: 2, name: "WhatsApp", href: "https://chat.whatsapp.com/CpS6ajvaWeY1gHkHUutRrw", external: true },
  ],
  policies: [
    { id: 1, name: "Cookie Policy", href: "#", external: false },
    { id: 2, name: "Privacy Policy", href: "/privacy-policy", external: false },
    { id: 3, name: "Code of Conduct", href: "/code-of-conduct", external: false },
  ],
  copyright: {
    year: "2025",
    company: "Copyright by gopwnit",
    text: "All rights reserved.",
  },
};

const TOKENS = {
  brand: "#a855f7",
  brandHover: "#c084fc",
  accent: "#1e1b4b",
  bgDeep: "#020205",
  border: "rgba(255, 255, 255, 0.05)",
};

const NavLink = ({ href, external, children, className }) => {
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
};

const Footer = () => {
  return (
    <footer
      className="relative mt-auto w-full py-20 px-6 overflow-hidden bg-[#020205] border-t font-outfit"
      style={{ borderColor: TOKENS.border }}
    >
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#a855f7]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#1e1b4b]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12">
          {/* Logo + Socials */}
          <div className="sm:col-span-2 md:col-span-1 flex flex-col space-y-8">
            <Image
              src={logo}
              alt="GoPWNIt"
              width={120}
              height={48}
              className="brightness-110"
            />

            <div className="flex space-x-3">
              {[
                {
                  icon: Instagram,
                  href: "https://www.instagram.com/gopwnit.india",
                },
                {
                  icon: Linkedin,
                  href: "https://www.linkedin.com/company/gopwnit/",
                },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-[#a855f7]/50 hover:bg-[#a855f7]/5 hover:scale-110 transition-all duration-300"
                >
                  <s.icon size={16} className="text-zinc-400" />
                </a>
              ))}
            </div>
          </div>

          {/* Links, Development, Community */}
          {[
            { title: "Links", items: footerData.links },
            { title: "Development", items: footerData.development },
            { title: "Community", items: footerData.community },
          ].map((sec, i) => (
            <div key={i}>
              <h3 className="text-white text-sm font-black uppercase tracking-[0.2em] mb-6 font-outfit">
                {sec.title}
              </h3>
              <ul className="space-y-4">
                {sec.items.map((item) => (
                  <li key={item.id}>
                    <NavLink
                      href={item.href}
                      external={item.external}
                      className="text-zinc-400 text-sm font-medium hover:text-[#a855f7] transition-colors"
                    >
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Policies */}
          <div className="lg:col-span-2">
            <h3 className="text-white text-sm font-black uppercase tracking-[0.2em] mb-6 font-outfit">
              Policies
            </h3>
            <ul className="space-y-4">
              {footerData.policies.map((p) => (
                <li key={p.id}>
                  <NavLink
                    href={p.href}
                    external={p.external}
                    className="text-zinc-400 text-sm font-medium hover:text-[#a855f7] transition-colors"
                  >
                    {p.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-20 pt-8 border-t border-white/5 text-center text-zinc-500 text-xs font-medium tracking-widest uppercase">
          © {footerData.copyright.year} {footerData.copyright.company}.{" "}
          {footerData.copyright.text}
        </div>
      </div>

    </footer>
  );
};

export default Footer;