import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { getPostBySlug } from "@/lib/blogServer";

const T = {
  bg: "#0A0A0A",
  cream: "#fefce8",
  muted: "#a1a1aa",
  border: "rgba(254,252,232,0.08)",
};

const SITE_URL = "https://gopwnit.com";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Article Not Found" };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.coverImage ? [post.coverImage] : undefined,
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const isJsonContent =
    typeof post.content === "string" &&
    (post.content.startsWith("{") || post.content.startsWith("["));

  const authorName = post.author?.username || "gopwnit";
  const authorUrl = post.author?.username
    ? `${SITE_URL}/blog/authors/${post.author.username}`
    : SITE_URL;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: post.coverImage || undefined,
    datePublished: post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    author: { "@type": "Person", name: authorName, url: authorUrl },
    publisher: { "@type": "Organization", name: "GOPWNIT", logo: { "@type": "ImageObject", url: `${SITE_URL}/gallery/hacking.png` } },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ background: T.bg, color: T.cream }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Navbar />

      <main className="flex-1 pt-32">
        <article className="px-7 pb-24">
          <div className="max-w-2xl mx-auto">
            <Link href="/blog" className="font-outfit text-[12px] uppercase tracking-widest mb-8 inline-block" style={{ color: T.muted }}>
              &larr; All Articles
            </Link>

            {post.category && (
              <span className="font-outfit text-[9px] uppercase tracking-widest px-2 py-1 border inline-block mb-5" style={{ color: T.muted, borderColor: T.border }}>
                {post.category}
              </span>
            )}

            <h1 className="font-outfit text-3xl md:text-5xl font-black leading-tight mb-5" style={{ color: T.cream }}>
              {post.title}
            </h1>

            <div className="flex items-center gap-3 mb-10 pb-10 border-b" style={{ borderColor: T.border }}>
              {post.author?.username ? (
                <Link href={`/blog/authors/${post.author.username}`} className="font-outfit text-[13px] font-semibold hover:underline" style={{ color: T.cream }}>
                  {post.author.username}
                </Link>
              ) : (
                <span className="font-outfit text-[13px] font-semibold" style={{ color: T.cream }}>gopwnit</span>
              )}
              <span style={{ color: T.muted }}>&middot;</span>
              <span className="font-outfit text-[13px]" style={{ color: T.muted }}>
                {formatDate(post.createdAt)}
              </span>
            </div>

            {post.coverImage && (
              <div className="relative h-72 mb-10 border overflow-hidden" style={{ borderColor: T.border }}>
                {/* eslint-disable-next-line @next/next/no-img-element -- dynamic S3 URL, unknown host to safelist for next/image */}
                <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
              </div>
            )}

            {isJsonContent ? (
              <p className="font-outfit text-[14px] leading-relaxed" style={{ color: T.muted }}>
                {post.description}
              </p>
            ) : (
              <div
                className="gopwnit-article-prose"
                dangerouslySetInnerHTML={{ __html: post.content || "<p>Content unavailable.</p>" }}
              />
            )}
          </div>
        </article>
      </main>

      <Footer />

      <style>{`
        .gopwnit-article-prose {
          font-family: 'Outfit', sans-serif;
          font-size: 15px;
          line-height: 1.8;
          color: rgba(254,252,232,0.75);
        }
        .gopwnit-article-prose h1,
        .gopwnit-article-prose h2,
        .gopwnit-article-prose h3 {
          color: #fefce8;
          font-weight: 700;
          margin: 32px 0 16px;
        }
        .gopwnit-article-prose p { margin: 0 0 18px; }
        .gopwnit-article-prose a { color: #fefce8; text-underline-offset: 3px; }
        .gopwnit-article-prose strong { color: #fefce8; font-weight: 600; }
        .gopwnit-article-prose ul, .gopwnit-article-prose ol { margin: 0 0 18px; padding-left: 22px; }
        .gopwnit-article-prose li { margin-bottom: 8px; }
        .gopwnit-article-prose blockquote {
          border-left: 2px solid rgba(254,252,232,0.2);
          padding-left: 16px;
          margin: 0 0 18px;
          color: rgba(254,252,232,0.6);
        }
        .gopwnit-article-prose code {
          background: rgba(254,252,232,0.06);
          padding: 2px 6px;
          border-radius: 2px;
          font-size: 0.9em;
        }
        .gopwnit-article-prose img {
          max-width: 100%;
          border: 1px solid rgba(254,252,232,0.12);
          margin: 24px 0;
        }
      `}</style>
    </div>
  );
}
