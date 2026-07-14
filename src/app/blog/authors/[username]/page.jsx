import Link from "next/link";
import { notFound } from "next/navigation";
import {
  IconBrandLinkedin,
  IconBrandGithub,
  IconBrandInstagram,
  IconTrophy,
  IconFlag,
  IconCalendar,
} from "@tabler/icons-react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { getPublicProfile, getPostsByAuthor } from "@/lib/blogServer";

const T = {
  bg: "#0A0A0A",
  cream: "#fefce8",
  muted: "#a1a1aa",
  border: "rgba(254,252,232,0.08)",
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long" });
}

export async function generateMetadata({ params }) {
  const { username } = await params;
  const profile = await getPublicProfile(username);

  if (!profile) return { title: "Author Not Found" };

  return {
    title: `${profile.user.username} — Author`,
    description: `Articles by ${profile.user.username} on gopwnit.`,
  };
}

export default async function AuthorPage({ params }) {
  const { username } = await params;
  const profile = await getPublicProfile(username);

  if (!profile) notFound();

  const { user, ctf } = profile;
  const posts = await getPostsByAuthor(username);

  const socials = [
    { icon: IconBrandLinkedin, href: user.linkedIn, label: "LinkedIn" },
    { icon: IconBrandGithub, href: user.github, label: "GitHub" },
    { icon: IconBrandInstagram, href: user.instagram, label: "Instagram" },
  ].filter((s) => s.href);

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: user.username,
    url: `https://gopwnit.com/blog/authors/${user.username}`,
    sameAs: socials.map((s) => s.href),
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ background: T.bg, color: T.cream }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <Navbar />

      <main className="flex-1 pt-32">
        <section className="px-7 py-16">
          <div className="max-w-3xl mx-auto">
            <p className="font-outfit text-[11px] font-bold uppercase tracking-[0.3em] mb-5" style={{ color: T.muted }}>
              Author
            </p>
            <h1 className="font-outfit text-4xl md:text-5xl font-black mb-4" style={{ color: T.cream }}>
              {user.username}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <IconCalendar size={14} style={{ color: T.muted }} />
                <span className="font-outfit text-[12px]" style={{ color: T.muted }}>
                  On gopwnit since {formatDate(user.createdAt)}
                </span>
              </div>
              {user.isVerified && (
                <span className="font-outfit text-[10px] uppercase tracking-widest px-2 py-1 border" style={{ color: T.cream, borderColor: "rgba(254,252,232,0.2)" }}>
                  Verified
                </span>
              )}
            </div>

            {socials.length > 0 && (
              <div className="flex gap-2 mb-10">
                {socials.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 flex items-center justify-center border transition-all duration-150"
                    style={{ borderColor: T.border, color: T.muted }}
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            )}

            {ctf?.totalSolved > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-12">
                <div className="p-5 border text-center" style={{ borderColor: T.border, background: "rgba(254,252,232,0.02)" }}>
                  <IconTrophy size={16} style={{ color: T.muted, margin: "0 auto 8px" }} />
                  <div className="font-outfit text-lg font-black" style={{ color: T.cream }}>{ctf.rank}</div>
                  <div className="font-outfit text-[10px] uppercase tracking-widest" style={{ color: T.muted }}>Rank</div>
                </div>
                <div className="p-5 border text-center" style={{ borderColor: T.border, background: "rgba(254,252,232,0.02)" }}>
                  <IconFlag size={16} style={{ color: T.muted, margin: "0 auto 8px" }} />
                  <div className="font-outfit text-lg font-black" style={{ color: T.cream }}>{ctf.totalSolved}</div>
                  <div className="font-outfit text-[10px] uppercase tracking-widest" style={{ color: T.muted }}>Challenges Solved</div>
                </div>
                <div className="p-5 border text-center" style={{ borderColor: T.border, background: "rgba(254,252,232,0.02)" }}>
                  <IconFlag size={16} style={{ color: T.muted, margin: "0 auto 8px" }} />
                  <div className="font-outfit text-lg font-black" style={{ color: T.cream }}>{ctf.totalPoints}</div>
                  <div className="font-outfit text-[10px] uppercase tracking-widest" style={{ color: T.muted }}>Points</div>
                </div>
              </div>
            )}

            <span className="font-outfit text-[10px] font-bold uppercase tracking-[0.3em] block mb-6" style={{ color: T.muted }}>
              Articles
            </span>
            {posts.length === 0 ? (
              <p className="font-outfit text-[13px]" style={{ color: T.muted }}>No published articles yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {posts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="p-5 border transition-colors duration-200 hover:border-white/20"
                    style={{ borderColor: T.border, background: "rgba(254,252,232,0.02)" }}
                  >
                    <h3 className="font-outfit text-[14px] font-bold mb-1" style={{ color: T.cream }}>{post.title}</h3>
                    <p className="font-outfit text-[12px]" style={{ color: T.muted }}>{post.description}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
