import { getPublishedPosts } from "@/lib/blogServer";

const SITE_URL = "https://gopwnit.com";

export default async function sitemap() {
  const now = new Date();

  const routes = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/platform", priority: 0.8, changeFrequency: "monthly" },
    { path: "/host-a-ctf", priority: 0.9, changeFrequency: "monthly" },
    { path: "/events", priority: 0.7, changeFrequency: "weekly" },
    { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
    { path: "/about", priority: 0.6, changeFrequency: "monthly" },
    { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
    { path: "/security", priority: 0.5, changeFrequency: "monthly" },
    { path: "/support", priority: 0.5, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.5, changeFrequency: "monthly" },
    { path: "/press", priority: 0.4, changeFrequency: "monthly" },
    { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/code-of-conduct", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
    { path: "/cookies", priority: 0.2, changeFrequency: "yearly" },
  ];

  const staticEntries = routes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const { data: posts } = await getPublishedPosts(1, 100);
  const postEntries = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt || post.createdAt || now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticEntries, ...postEntries];
}
