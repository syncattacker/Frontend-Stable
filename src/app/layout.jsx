import "./globals.css";
import Providers from "@/providers";
import { SocketProvider } from "@/sockets/SocketProvider";
import AuthInitializer from "@/components/auth/AuthInitializer";
import { Toaster } from "sonner";

const SITE_URL = "https://gopwnit.com";
const DESCRIPTION =
  "gopwnit is a cybersecurity skills platform where individuals learn offensive security through hands-on labs and CTF competitions, and organizations host their own CTF events — built and hosted in India.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "gopwnit — Learn Offensive Security Through Real CTFs",
    template: "%s · gopwnit",
  },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "gopwnit",
    title: "gopwnit — Learn Offensive Security Through Real CTFs",
    description: DESCRIPTION,
    images: [{ url: "/gallery/hacking.png", width: 1200, height: 800, alt: "gopwnit — cybersecurity labs and CTF competitions" }],
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
    { "@type": "Person", name: "Abhishek Soni", jobTitle: "Founder", sameAs: "https://www.linkedin.com/in/abhishek-soni-89b518250/" },
    { "@type": "Person", name: "Aaditya Goyal", jobTitle: "Chief Technology Officer", sameAs: "https://linkedin.com/in/aadityagoyal-net/" },
    { "@type": "Person", name: "Arjun Chauhan", jobTitle: "Communication and Marketing Officer", sameAs: "https://linkedin.com/in/geeky-arjun/" },
  ],
  address: { "@type": "PostalAddress", addressCountry: "IN" },
  email: "support@gopwnit.com",
  sameAs: [
    "https://www.linkedin.com/company/gopwnit/",
    "https://github.com/GoPWNIt",
    "https://www.instagram.com/gopwnit.india",
  ],
};

const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "gopwnit",
  url: SITE_URL,
  description: DESCRIPTION,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@200;300;400;500;600;700;900&family=DM+Sans:wght@400;500;600;700&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }}
        />
      </head>
      <body>
        <Providers>
          <AuthInitializer />
          <SocketProvider>{children}</SocketProvider>
          <Toaster position="bottom-right" duration={3000} theme="dark" />
        </Providers>
      </body>
    </html>
  );
}
