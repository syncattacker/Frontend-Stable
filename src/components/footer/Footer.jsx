"use client";

import Image from "next/image";
import Link from "next/link";
import {
  IconBrandInstagram as Instagram,
  IconBrandLinkedin as Linkedin,
  IconBrandGithub as GitHub,
} from "@tabler/icons-react";
import logo from "@/img/white.svg";

const T = {
  bg: "#0A0A0A",
  cream: "#F0EDE699",
  muted: "#888880",
  border: "rgba(255,255,255,0.12)",
};

const footerData = {
  product: [
    { id: 1, name: "Platform", href: "/platform", external: false },
    { id: 2, name: "Host a CTF", href: "/host-a-ctf", external: false },
    { id: 3, name: "Events", href: "/events", external: false },
    { id: 4, name: "Blog", href: "/blog", external: false },
    { id: 5, name: "FAQ", href: "/faq", external: false },
  ],
  company: [
    { id: 1, name: "About", href: "/about", external: false },
    { id: 2, name: "Press", href: "/press", external: false },
    { id: 3, name: "Contact", href: "/contact", external: false },
    { id: 4, name: "Security", href: "/security", external: false },
  ],
  community: [
    {
      id: 1,
      name: "Discord",
      href: "https://discord.gg/4Mb6xXce8q",
      external: true,
    },
    {
      id: 2,
      name: "WhatsApp",
      href: "https://chat.whatsapp.com/CpS6ajvaWeY1gHkHUutRrw",
      external: true,
    },
    {
      id: 3,
      name: "GitHub",
      href: "https://github.com/GoPWNIt",
      external: true,
    },
    {
      id: 4,
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/gopwnit/",
      external: true,
    },
    {
      id: 5,
      name: "Instagram",
      href: "https://www.instagram.com/gopwnit.india",
      external: true,
    },
  ],
  legal: [
    { id: 1, name: "Privacy Policy", href: "/privacy-policy", external: false },
    {
      id: 2,
      name: "Code of Conduct",
      href: "/code-of-conduct",
      external: false,
    },
    { id: 3, name: "Terms of Service", href: "/terms", external: false },
    { id: 4, name: "Cookie Policy", href: "/cookies", external: false },
  ],
  copyright: {
    year: "2026",
    company: "GOPWNIT, a partnership firm",
    text: "All rights reserved.",
  },
};

const NavLink = ({ href, external, children }) => {
  const cls =
    "text-[12px] font-outfit transition-opacity duration-150 opacity-50 hover:opacity-100";
  const style = { color: T.cream };
  if (external)
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
        style={style}
      >
        {children}
      </a>
    );
  return (
    <Link href={href} className={cls} style={style}>
      {children}
    </Link>
  );
};

const ColHead = ({ children }) => (
  <h3
    className="text-[12px] font-roundo font-bold uppercase tracking-[0.22em] mb-5"
    style={{ color: T.muted }}
  >
    {children}
  </h3>
);

const Footer = () => (
  <footer
    className="relative w-full font-outfit"
    style={{ background: T.bg, borderTop: `1px solid ${T.border}` }}
  >
    <div className="mx-auto max-w-7xl px-8 py-20">
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6"
        style={{
          borderLeft: `1px solid ${T.border}`,
          borderTop: `1px solid ${T.border}`,
        }}
      >
        <div
          className="sm:col-span-2 flex flex-col justify-between p-8 gap-10"
          style={{
            borderRight: `1px solid ${T.border}`,
            borderBottom: `1px solid ${T.border}`,
          }}
        >
          <Image
            src={logo}
            alt="GoPWNIt"
            width={200}
            height={54}
            className="brightness-110"
          />

          <div>
            <p
              className="text-[15px] font-outfit leading-relaxed mb-6 max-w-50"
              style={{ color: T.muted }}
            >
              Learn offensive security through real-world labs and global CTF
              competitions.
            </p>

            {/* Social icons — square */}
            <div className="flex gap-2">
              {[
                {
                  Icon: Instagram,
                  href: "https://www.instagram.com/gopwnit.india",
                },
                {
                  Icon: Linkedin,
                  href: "https://www.linkedin.com/company/gopwnit/",
                },
                { Icon: GitHub, href: "https://github.com/GoPWNIt" },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-8 h-8 transition-all duration-150 opacity-40 hover:opacity-100"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      "rgba(240,237,230,0.30)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = T.border;
                  }}
                >
                  <Icon size={24} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          className="p-8"
          style={{
            borderRight: `1px solid ${T.border}`,
            borderBottom: `1px solid ${T.border}`,
          }}
        >
          <ColHead>Product</ColHead>
          <ul className="flex flex-col gap-3.5">
            {footerData.product.map((item) => (
              <li key={item.id}>
                <NavLink href={item.href} external={item.external}>
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Company ────────────────────────────────────── */}
        <div
          className="p-8"
          style={{
            borderRight: `1px solid ${T.border}`,
            borderBottom: `1px solid ${T.border}`,
          }}
        >
          <ColHead>Company</ColHead>
          <ul className="flex flex-col gap-3.5">
            {footerData.company.map((item) => (
              <li key={item.id}>
                <NavLink href={item.href} external={item.external}>
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Community ──────────────────────────────────── */}
        <div
          className="p-8"
          style={{
            borderRight: `1px solid ${T.border}`,
            borderBottom: `1px solid ${T.border}`,
          }}
        >
          <ColHead>Community</ColHead>
          <ul className="flex flex-col gap-3.5">
            {footerData.community.map((item) => (
              <li key={item.id}>
                <NavLink href={item.href} external={item.external}>
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Legal ──────────────────────────────────────── */}
        <div className="p-8" style={{ borderBottom: `1px solid ${T.border}` }}>
          <ColHead>Legal</ColHead>
          <ul className="flex flex-col gap-3.5">
            {footerData.legal.map((item) => (
              <li key={item.id}>
                <NavLink href={item.href} external={item.external}>
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Copyright bar ────────────────────────────────── */}
      <div
        className="flex flex-col md:flex-row items-center justify-between gap-3 pt-8 mt-0"
        style={{ borderTop: `1px solid ${T.border}` }}
      >
        <p
          className="text-[11px] font-outfit tracking-[0.15em] uppercase"
          style={{ color: T.muted }}
        >
          © {footerData.copyright.year} — {footerData.copyright.company}.{" "}
          {footerData.copyright.text}
        </p>
        <p
          className="text-[11px] font-outfit tracking-[0.15em] uppercase"
          style={{ color: T.muted, opacity: 0.5 }}
        >
          Built for the security community.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
