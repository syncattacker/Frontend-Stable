import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { getPublishedPosts } from "@/lib/blogServer";

const T = {
  bg: "#0A0A0A",
  cream: "#fefce8",
  muted: "#a1a1aa",
  border: "rgba(254,252,232,0.08)",
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function BlogPage() {
  const { data: posts } = await getPublishedPosts(1, 24);

  return (
    <div className="flex flex-col min-h-screen" style={{ background: T.bg, color: T.cream }}>
      <Navbar />

      <main className="flex-1 pt-32">
        <section className="px-7 py-16 md:py-20">
          <div className="max-w-3xl mx-auto">
            <p className="font-outfit text-[11px] font-bold uppercase tracking-[0.3em] mb-5" style={{ color: T.muted }}>
              Blog
            </p>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(48px, 8vw, 80px)", lineHeight: 0.95, color: T.cream }}>
              WRITE-UPS &amp;<br />GUIDES.
            </h1>
            <p className="font-outfit text-[15px] leading-relaxed max-w-lg mt-5" style={{ color: T.muted }}>
              CTF write-ups, hosting guides, and cybersecurity learning content
              from the gopwnit team and community.
            </p>
          </div>
        </section>

        <section className="px-7 pb-24">
          <div className="max-w-5xl mx-auto">
            {posts.length === 0 ? (
              <div className="p-10 border text-center" style={{ borderColor: T.border, background: "rgba(254,252,232,0.02)" }}>
                <p className="font-outfit text-[14px]" style={{ color: T.muted }}>
                  No articles published yet — check back soon, or follow our{" "}
                  <a href="https://discord.gg/4Mb6xXce8q" target="_blank" rel="noopener noreferrer" className="underline decoration-white/20 hover:text-yellow-50" style={{ color: T.cream }}>
                    Discord
                  </a>{" "}
                  for updates.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {posts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="flex flex-col border transition-colors duration-200 hover:border-white/20"
                    style={{ borderColor: T.border, background: "rgba(254,252,232,0.02)" }}
                  >
                    {post.coverImage && (
                      <div className="relative h-40 border-b overflow-hidden" style={{ borderColor: T.border }}>
                        {/* eslint-disable-next-line @next/next/no-img-element -- dynamic S3 URL, unknown host to safelist for next/image */}
                        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-5 flex flex-col flex-1">
                      {post.category && (
                        <span className="font-outfit text-[9px] uppercase tracking-widest px-2 py-1 border self-start mb-3" style={{ color: T.muted, borderColor: T.border }}>
                          {post.category}
                        </span>
                      )}
                      <h2 className="font-outfit text-[15px] font-bold mb-2 leading-snug" style={{ color: T.cream }}>
                        {post.title}
                      </h2>
                      <p className="font-outfit text-[12.5px] leading-relaxed flex-1" style={{ color: T.muted }}>
                        {post.description}
                      </p>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t" style={{ borderColor: T.border }}>
                        <span className="font-outfit text-[11px]" style={{ color: T.muted }}>
                          {post.author?.username || "gopwnit"}
                        </span>
                        <span className="font-outfit text-[11px]" style={{ color: "rgba(254,252,232,0.3)" }}>
                          {formatDate(post.createdAt)}
                        </span>
                      </div>
                    </div>
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
