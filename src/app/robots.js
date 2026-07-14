export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/dashboard/*",
        "/profile",
        "/season-studio",
        "/season-studio/*",
        "/season/",
        "/season/*",
        "/forgot-password",
        "/reset-password",
      ],
    },
    sitemap: "https://gopwnit.com/sitemap.xml",
  };
}
