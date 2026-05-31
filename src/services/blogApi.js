import API from "@/utils/axios";

export const blogApi = {
  getAllBlogs: async (page = 1, limit = 10) => {
    const response = await API.get(
      `/api/v1/resource?page=${page}&limit=${limit}`,
    );
    return response.data;
  },
  getBlogBySlug: async (slug) => {
    const response = await API.get(`/api/v1/resource/${slug}`);
    return response.data.data;
  },
  getRecentPosts: async (limit = 3) => {
    const response = await API.get(`/api/v1/resource?page=1&limit=${limit}`);
    return response.data.data;
  },
  createBlog: async (blogData) => {
    const response = await API.post("/api/v1/resource/", blogData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },
  deleteBlog: async (slug) => {
    const response = await API.delete(`/api/v1/resource/${slug}`);
    return response.data;
  },
  updateBlog: async (slug, blogData) => {
    const response = await API.patch(`/api/v1/resource/${slug}`, blogData);
    return response.data;
  },
  getUserBlogs: async (userId, username) => {
    const results = [];
    const seenSlugs = new Set();
    try {
      const approvedRes = await API.get(`/api/v1/resource?page=1&limit=100`);
      const allApproved = approvedRes.data?.data || [];
      for (const blog of allApproved) {
        const authorId = blog.author?._id || blog.author;
        const authorMatch =
          (authorId && userId && authorId.toString() === userId.toString()) ||
          (blog.author?.username &&
            username &&
            blog.author.username === username);
        if (authorMatch && !seenSlugs.has(blog.slug)) {
          seenSlugs.add(blog.slug);
          results.push({ ...blog, status: "approved" });
        }
      }
    } catch (e) {
      console.warn("Could not fetch approved blogs:", e);
    }
    try {
      const pendingRes = await API.get("/api/v1/resource/moderation/pending");
      const pendingBlogs =
        pendingRes.data?.data || pendingRes.data?.resources || [];
      for (const blog of pendingBlogs) {
        const authorId = blog.author?._id || blog.author;
        const authorMatch =
          (authorId && userId && authorId.toString() === userId.toString()) ||
          (blog.author?.username &&
            username &&
            blog.author.username === username);
        if (authorMatch && !seenSlugs.has(blog.slug)) {
          seenSlugs.add(blog.slug);
          results.push({ ...blog, status: blog.status || "pending" });
        }
      }
    } catch (e) {
      if (e?.response?.status !== 403) {
        console.warn("Could not fetch pending blogs:", e);
      }
    }

    return results.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
  },
  getPendingResources: async () => {
    const response = await API.get("/api/v1/resource/moderation/pending");
    return response.data;
  },
  approveResource: async (slug) => {
    const response = await API.patch(
      `/api/v1/resource/moderation/approve/${slug}`,
    );
    return response.data;
  },
  rejectResource: async (slug, reason) => {
    const response = await API.patch(
      `/api/v1/resource/moderation/reject/${slug}`,
      { reason },
    );
    return response.data;
  },
};
