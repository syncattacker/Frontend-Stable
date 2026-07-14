const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getPublishedPosts(page = 1, limit = 12) {
  if (!BACKEND_URL) return { data: [], total: 0, pages: 0 };

  try {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/resource?page=${page}&limit=${limit}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) return { data: [], total: 0, pages: 0 };
    const json = await res.json();
    return {
      data: json.data || [],
      total: json.total || 0,
      pages: json.pages || 0,
    };
  } catch {
    return { data: [], total: 0, pages: 0 };
  }
}

export async function getPostBySlug(slug) {
  if (!BACKEND_URL) return null;

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/resource/${slug}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

export async function getPublicProfile(username) {
  if (!BACKEND_URL) return null;

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/public/${username}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.profile || null;
  } catch {
    return null;
  }
}

export async function getPostsByAuthor(username, limit = 100) {
  const { data } = await getPublishedPosts(1, limit);
  return data.filter((post) => post.author?.username === username);
}
