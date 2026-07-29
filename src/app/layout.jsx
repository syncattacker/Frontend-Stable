import "./globals.css";
import Providers from "@/providers";
import { SocketProvider } from "@/sockets/SocketProvider";
import AuthInitializer from "@/components/auth/AuthInitializer";
import ClientIntelligenceInitializer from "@/components/auth/ClientIntelligenceInitializer";
import { Toaster } from "sonner";

const SITE_URL = "https://gopwnit.com";
const DESCRIPTION =
  "gopwnit is a cybersecurity skills platform where individuals learn offensive security through hands-on labs and CTF competitions, and organizations host their own CTF events — built and hosted in India.";

const KEYWORDS = [
  "CTF platform",
  "capture the flag platform",
  "online CTF",
  "CTF challenges",
  "CTF competition",
  "CTF events",
  "CTF practice",
  "CTF for beginners",
  "CTF training",
  "CTF for students",
  "CTF writeups",
  "cybersecurity learning platform",
  "cyber security learning",
  "cybersecurity training",
  "cyber security training",
  "ethical hacking platform",
  "ethical hacking training",
  "offensive security training",
  "penetration testing training",
  "pentesting labs",
  "cybersecurity labs",
  "cyber labs",
  "hands-on cybersecurity labs",
  "interactive cybersecurity labs",
  "practical cybersecurity training",
  "gamified cybersecurity learning",
  "cyber range",
  "security learning platform",
  "hacking practice platform",
  "learn cybersecurity online",
  "learn ethical hacking",
  "learn penetration testing",
  "learn offensive security",
  "cybersecurity courses",
  "cyber security course",
  "cyber security academy",
  "cyber learning",
  "information security training",
  "cyber skills development",
  "cyber exercises",
  "security challenges",
  "hacking challenges",
  "bug bounty practice",
  "vulnerability assessment training",
  "web security training",
  "web exploitation",
  "web exploitation labs",
  "web hacking",
  "web application security",
  "OWASP practice",
  "SQL injection",
  "SQL injection lab",
  "Cross Site Scripting",
  "XSS",
  "XSS lab",
  "CSRF",
  "SSRF",
  "IDOR",
  "Remote Code Execution",
  "RCE",
  "Local File Inclusion",
  "LFI",
  "Remote File Inclusion",
  "RFI",
  "Command Injection",
  "Authentication Bypass",
  "Directory Traversal",
  "File Upload Vulnerability",
  "API Security",
  "API Hacking",
  "Secure Coding",
  "Reverse Engineering",
  "Binary Exploitation",
  "Pwn",
  "Pwnable",
  "Buffer Overflow",
  "Stack Overflow",
  "Heap Exploitation",
  "Return Oriented Programming",
  "ROP",
  "Shellcoding",
  "Assembly Challenges",
  "Cryptography",
  "Crypto Challenges",
  "Digital Forensics",
  "Memory Forensics",
  "Disk Forensics",
  "Network Forensics",
  "Malware Analysis",
  "Malware Reverse Engineering",
  "Threat Hunting",
  "Incident Response",
  "Blue Team Training",
  "Red Team Training",
  "Purple Team Training",
  "OSINT",
  "Open Source Intelligence",
  "Active Directory Security",
  "Windows Security",
  "Linux Security",
  "Privilege Escalation",
  "Linux Privilege Escalation",
  "Windows Privilege Escalation",
  "Kerberos Attacks",
  "Active Directory Labs",
  "Cloud Security",
  "AWS Security",
  "Azure Security",
  "GCP Security",
  "Kubernetes Security",
  "Docker Security",
  "Network Security",
  "Wireless Security",
  "WiFi Hacking",
  "Packet Analysis",
  "PCAP Analysis",
  "Wireshark Practice",
  "Nmap Training",
  "Metasploit Training",
  "Burp Suite Training",
  "Kali Linux Training",
  "DevSecOps",
  "Cybersecurity Assessment",
  "Security Assessment",
  "Vulnerability Assessment",
  "Security Testing",
  "Exploit Development",
  "Secure Infrastructure",
  "Capture the Flag Challenges",
  "Cyber Challenge Platform",
  "Online Cybersecurity Platform",
  "Cybersecurity Practice",
  "Ethical Hacking Labs",
  "Cybersecurity Exercises",
  "Real World Cybersecurity Labs",
  "Practical Ethical Hacking",
  "Cybersecurity Bootcamp",
  "Cybersecurity Skill Assessment",
  "Cybersecurity Certification Practice",
  "Cybersecurity Interview Preparation",
  "Cybersecurity Career Training",
  "Cybersecurity Community",
  "Cybersecurity Events",
  "Student Cybersecurity Platform",
  "University CTF",
  "College CTF",
  "Team CTF",
  "Individual CTF",
  "Live CTF",
  "Online Hacking Challenges",
  "Free Cybersecurity Labs",
  "Free CTF Platform",
  "Beginner Friendly Cybersecurity",
  "Advanced Cybersecurity Challenges",
  "Cybersecurity Learning Path",
  "Security Research",
  "Information Security",
  "Application Security",
  "Secure Development",
  "Security Automation",
  "Cyber Defense",
  "Offensive Security Labs",
  "Defensive Security Labs",
  "Security Awareness",
  "Threat Intelligence",
  "Digital Security",
  "Cybersecurity Playground",
  "Cybersecurity Sandbox",
  "Cybersecurity Simulation",
  "Cybersecurity Gamification",
  "brand authority",
  "expert-led training",
  "first-hand experience",
  "trusted cybersecurity platform",
  "original content",
  "helpful content",
  "people-first content",
  "verified by experts",
  "written by practitioners",
  "practical guides",
  "step-by-step tutorials",
  "complete walkthroughs",
  "beginner-friendly guide",
  "advanced challenge guide",
  "solution walkthrough",
  "skill-based learning",
  "real-world labs",
  "community-driven platform",
  "GoPWNIT",
  "GoPWNIT CTF",
  "GoPWNIT Platform",
  "GoPWNIT Cybersecurity",
  "GoPWNIT Learning Platform",
  "GoPWNIT Labs",
  "GoPWNIT Challenges",
  "GoPWNIT Academy",
  "GoPWNIT Events",
  "GoPWNIT Cyber Range",
  "GoPWNIT Training",
  "GoPWNIT Ethical Hacking",
  "GoPWNIT Offensive Security",
  "GoPWNIT Capture The Flag",
  "GoPWNIT Cyber Labs",
];

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "gopwnit — Learn Offensive Security Through Real CTFs",
    template: "%s · gopwnit",
  },
  description: DESCRIPTION,
  keywords: KEYWORDS,
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "gopwnit",
    title: "gopwnit — Learn Offensive Security Through Real CTFs",
    description: DESCRIPTION,
    images: [
      {
        url: "/gallery/hacking.png",
        width: 1200,
        height: 800,
        alt: "gopwnit — cybersecurity labs and CTF competitions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "gopwnit — Learn Offensive Security Through Real CTFs",
    description: DESCRIPTION,
    images: ["/gallery/hacking.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "GOPWNIT",
  alternateName: "gopwnit",
  legalName: "GOPWNIT",
  url: SITE_URL,
  logo: `${SITE_URL}/gallery/hacking.png`,
  description: DESCRIPTION,
  foundingDate: "2026-01-30",
  founders: [
    {
      "@type": "Person",
      name: "Abhishek Soni",
      jobTitle: "Founder",
      sameAs: "https://www.linkedin.com/in/abhishek-soni-89b518250/",
    },
    {
      "@type": "Person",
      name: "Aaditya Goyal",
      jobTitle: "Chief Technology Officer",
      sameAs: "https://linkedin.com/in/aadityagoyal-net/",
    },
    {
      "@type": "Person",
      name: "Arjun Chauhan",
      jobTitle: "Communication and Marketing Officer",
      sameAs: "https://linkedin.com/in/geeky-arjun/",
    },
  ],
  address: { "@type": "PostalAddress", addressCountry: "IN" },
  email: "support@gopwnit.com",
  sameAs: [
    "https://www.linkedin.com/company/gopwnit/",
    "https://github.com/GoPWNIt",
    "https://www.instagram.com/gopwnit.india",
  ],
  knowsAbout: KEYWORDS,
};

const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "gopwnit",
  url: SITE_URL,
  description: DESCRIPTION,
  keywords: KEYWORDS.join(", "),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@200;300;400;500;600;700;900&family=DM+Sans:wght@400;500;600;700&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(ORGANIZATION_JSON_LD),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }}
        />
      </head>
      <body>
        <Providers>
          <AuthInitializer />
          <ClientIntelligenceInitializer />
          <SocketProvider>{children}</SocketProvider>
          <Toaster position="bottom-right" duration={3000} theme="dark" />
        </Providers>
      </body>
    </html>
  );
}
