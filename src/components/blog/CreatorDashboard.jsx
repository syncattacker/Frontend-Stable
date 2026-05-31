"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import TiptapEditor from "@/components/blog/TiptapEditor";
import { blogApi } from "@/services/blogApi";
import { useRouter, useParams } from "next/navigation";

/* ─── design tokens ──────────────────────────────────────────── */
const T = {
  bg: "#000000",
  cream: "#fefce8",
  muted: "#a1a1aa",
  border: "rgba(254,252,232,0.12)",
  borderHover: "rgba(254,252,232,0.22)",
  card: "#111111",
  inputBg: "#0f0f0f",
};

const inputStyle = {
  background: T.inputBg,
  border: `1px solid ${T.border}`,
  borderRadius: "2px",
  color: T.cream,
  fontFamily: "Outfit, sans-serif",
  fontSize: "14px",
  outline: "none",
  width: "100%",
  padding: "10px 16px",
};

const categories = ["Technical", "Tutorials", "Updates", "Career"];

/* ════════════════════════════════════════════════════════════════
   SUB-COMPONENTS
════════════════════════════════════════════════════════════════ */

/* ─── Spinner (dark variant for cream bg) ────────────────────── */
const Spinner = ({ size = 14, onCream = false }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      border: `1.5px solid ${onCream ? "rgba(0,0,0,0.15)" : T.border}`,
      borderTop: `1.5px solid ${onCream ? T.bg : T.cream}`,
      animation: "gpw-spin 0.75s linear infinite",
      flexShrink: 0,
    }}
  />
);

/* ─── Icons ──────────────────────────────────────────────────── */
const ImageIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <rect x="3" y="3" width="18" height="18" rx="1" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);
const UploadIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
  </svg>
);
const ChevronIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/* ─── Custom Select ──────────────────────────────────────────── */
function CustomSelect({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        onMouseEnter={(e) =>
          (e.currentTarget.style.borderColor = T.borderHover)
        }
        onMouseLeave={(e) => {
          if (!open) e.currentTarget.style.borderColor = T.border;
        }}
        style={{
          ...inputStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          borderColor: open ? T.borderHover : T.border,
          textAlign: "left",
        }}
      >
        <span>{value}</span>
        <span style={{ color: T.muted, display: "flex" }}>
          <ChevronIcon />
        </span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 2px)",
            left: 0,
            right: 0,
            background: T.bg,
            border: `1px solid ${T.borderHover}`,
            borderRadius: "2px",
            zIndex: 100,
            overflow: "hidden",
          }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = T.card)}
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  opt === value ? T.card : "transparent")
              }
              style={{
                width: "100%",
                padding: "10px 16px",
                background: opt === value ? T.card : "transparent",
                border: "none",
                color: opt === value ? T.cream : T.muted,
                fontFamily: "Outfit, sans-serif",
                fontSize: "13px",
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span
                style={{
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  background: opt === value ? T.cream : "transparent",
                  flexShrink: 0,
                }}
              />
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Field Row ──────────────────────────────────────────────── */
function FieldRow({ label, children, noBorderBottom = false }) {
  return (
    <div
      style={{
        padding: "20px 28px",
        borderBottom: noBorderBottom ? "none" : `1px solid ${T.border}`,
      }}
    >
      <p
        style={{
          fontFamily: "Outfit, sans-serif",
          fontSize: "9px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: T.muted,
          marginBottom: "10px",
        }}
      >
        {label}
      </p>
      {children}
    </div>
  );
}

/* ─── Image Upload Zone ──────────────────────────────────────── */
function ImageUpload({
  value,
  target,
  onChange,
  height = 140,
  banner = false,
}) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        width: "100%",
        height: `${height}px`,
        border: `1px dashed ${hover ? T.borderHover : T.border}`,
        borderRadius: "2px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        overflow: "hidden",
        background: T.inputBg,
      }}
    >
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onChange(e, target)}
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0,
          cursor: "pointer",
          zIndex: 2,
        }}
      />

      {value ? (
        <img
          src={typeof value === "string" ? value : URL.createObjectURL(value)}
          alt="Preview"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 1,
            opacity: hover ? 1 : 0.8,
          }}
        />
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            color: hover ? T.muted : "rgba(161,161,170,0.3)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          {banner ? <UploadIcon /> : <ImageIcon />}
          <p
            style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "9px",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
            }}
          >
            {banner ? "Upload Banner" : "Upload Thumbnail"}
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── Global styles ──────────────────────────────────────────── */
function GlobalStyles() {
  return (
    <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500&display=swap');
            @keyframes gpw-spin { to { transform: rotate(360deg); } }
            * { box-sizing: border-box; }
            ::selection { background: rgba(254,252,232,0.12); color: #fefce8; }
            .placeholder-zinc-600::placeholder { color: rgba(161,161,170,0.4); }
        `}</style>
  );
}

export default function CreatorDashboard() {
  const router = useRouter();
  const { slug } = useParams();
  const isEditMode = !!slug;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(isEditMode);
  const [formData, setFormData] = useState({
    title: "",
    category: categories[0],
    description: "",
    content: "",
    image: "",
    coverImage: "",
  });

  useEffect(() => {
    if (!isEditMode) return;
    const fetchBlog = async () => {
      try {
        const data = await blogApi.getBlogBySlug(slug);
        setFormData({
          title: data.title || "",
          category: data.category || categories[0],
          description: data.description || "",
          content: data.content || "",
          image: data.image || "",
          coverImage: data.coverImage || "",
        });
      } catch (err) {
        console.error("Failed to load blog for editing:", err);
        alert(
          "Failed to load blog post. It may not exist or you may not have permission.",
        );
        router.push("/creator");
      } finally {
        setIsLoadingEdit(false);
      }
    };
    fetchBlog();
  }, [slug, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleEditorChange = (html) =>
    setFormData((prev) => ({ ...prev, content: html }));
  const handleImageUpload = (e, target) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Please select an image smaller than 2MB.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [target]: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.description) {
      alert(
        "Please fill out all required fields (Title, Description, and Content)",
      );
      return;
    }
    setIsSubmitting(true);
    try {
      const formPayload = new FormData();

      formPayload.append("title", formData.title);
      formPayload.append("category", formData.category);
      formPayload.append("description", formData.description);
      formPayload.append("content", formData.content);

      if (formData.image) {
        formPayload.append("image", formData.image);
      }

      if (formData.coverImage) {
        formPayload.append("coverImage", formData.coverImage);
      }
      if (isEditMode) {
        await blogApi.updateBlog(slug, formPayload);
      } else {
        const res = await blogApi.createBlog(formPayload);
      }
    } catch (error) {
      console.error(error);
      alert(
        isEditMode
          ? "Failed to update. Please try again."
          : "Failed to publish. Check your connection.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Loading ──────────────────────────────────────────────── */
  if (isLoadingEdit) {
    return (
      <div
        style={{
          background: T.bg,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        <Spinner size={28} />
        <p
          style={{
            fontFamily: "Outfit, sans-serif",
            fontSize: "9px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: T.muted,
          }}
        >
          Loading Article...
        </p>
        <GlobalStyles />
      </div>
    );
  }

  /* ── Main page ────────────────────────────────────────────── */
  return (
    <div
      style={{
        background: T.bg,
        minHeight: "100vh",
        color: T.cream,
        fontFamily: "Outfit, sans-serif",
      }}
    >
      <main style={{ paddingTop: "40px" }}>
        <section
          style={{
            padding: "0px 40px 20px",
            borderBottom: `1px solid ${T.border}`,
          }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "32px",
                flexWrap: "wrap",
              }}
            >
              <h1
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(3rem, 7vw, 5.5rem)",
                  letterSpacing: "-0.03em",
                  lineHeight: 0.92,
                  color: T.cream,
                  textTransform: "uppercase",
                }}
              >
                Creator Studio
              </h1>
            </div>

            {/* Divider */}
            <div
              style={{
                width: "100%",
                height: "1px",
                background: T.border,
                margin: "20px 0",
              }}
            />

            {/* Meta row */}
            <div
              style={{
                display: "flex",
                gap: "64px",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: T.muted,
                    marginBottom: "8px",
                  }}
                >
                  Mode
                </p>
                <p
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1.6rem",
                    color: T.cream,
                    letterSpacing: "-0.01em",
                    lineHeight: 1,
                  }}
                >
                  {isEditMode ? "Editing" : "Authoring"}
                </p>
              </div>

              <div>
                <p
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: T.muted,
                    marginBottom: "8px",
                  }}
                >
                  Category
                </p>
                <p
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1.6rem",
                    color: T.cream,
                    letterSpacing: "-0.01em",
                    lineHeight: 1,
                  }}
                >
                  {formData.category}
                </p>
              </div>

              {isEditMode && formData.title && (
                <div>
                  <p
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: T.muted,
                      marginBottom: "8px",
                    }}
                  >
                    Article
                  </p>
                  <p
                    style={{
                      fontFamily: "monospace",
                      fontSize: "13px",
                      color: T.cream,
                      lineHeight: 1.3,
                      maxWidth: "400px",
                    }}
                  >
                    {formData.title.toUpperCase()}
                  </p>
                </div>
              )}

              <div>
                <p
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: T.muted,
                    marginBottom: "8px",
                  }}
                >
                  Type
                </p>
                <p
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1.6rem",
                    color: T.cream,
                    letterSpacing: "-0.01em",
                    lineHeight: 1,
                  }}
                >
                  {isEditMode ? "Edit Mode" : "New Article"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 80px 120px",
          }}
        >
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "flex",
                borderBottom: `1px solid ${T.border}`,
                border: `1px solid ${T.border}`,
                borderTop: "none",
              }}
            >
              {/* Left: text fields */}
              <div style={{ flex: 1, borderRight: `1px solid ${T.border}` }}>
                <FieldRow label="Headline *">
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter article title..."
                    className="placeholder-zinc-600"
                    onFocus={(e) =>
                      (e.target.style.borderColor = T.borderHover)
                    }
                    onBlur={(e) => (e.target.style.borderColor = T.border)}
                    style={{ ...inputStyle, fontSize: "16px" }}
                  />
                </FieldRow>

                <FieldRow label="Category *">
                  <CustomSelect
                    value={formData.category}
                    onChange={(val) =>
                      setFormData((prev) => ({ ...prev, category: val }))
                    }
                    options={categories}
                  />
                </FieldRow>

                <FieldRow label="Brief Abstract *" noBorderBottom>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Summary visible on the article card..."
                    rows={5}
                    className="placeholder-zinc-600"
                    onFocus={(e) =>
                      (e.target.style.borderColor = T.borderHover)
                    }
                    onBlur={(e) => (e.target.style.borderColor = T.border)}
                    style={{
                      ...inputStyle,
                      resize: "vertical",
                      lineHeight: 1.7,
                    }}
                  />
                </FieldRow>
              </div>

              {/* Right: image uploads */}
              <div style={{ width: "280px", flexShrink: 0 }}>
                <FieldRow label="Article Thumbnail">
                  <ImageUpload
                    value={formData.image}
                    target="image"
                    onChange={handleImageUpload}
                    height={130}
                  />
                </FieldRow>

                <FieldRow label="Banner (Cover Image)" noBorderBottom>
                  <ImageUpload
                    value={formData.coverImage}
                    target="coverImage"
                    onChange={handleImageUpload}
                    height={170}
                    banner
                  />
                </FieldRow>
              </div>
            </div>

            {/* ── Content editor ────────────────────────── */}
            <div
              style={{
                border: `1px solid ${T.border}`,
                borderTop: "none",
              }}
            >
              {/* Editor header row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 28px",
                  borderBottom: `1px solid ${T.border}`,
                }}
              >
                <p
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: T.muted,
                    fontFamily: "Outfit, sans-serif",
                  }}
                >
                  Article Content *
                </p>
                <p
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "rgba(254,252,232,0.12)",
                    fontFamily: "Outfit, sans-serif",
                  }}
                >
                  Rich Text
                </p>
              </div>

              <div style={{ padding: "28px" }}>
                <TiptapEditor
                  content={formData.content}
                  onChange={handleEditorChange}
                />
              </div>
            </div>

            {/* ── Submit bar ───────────────────────────── */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 0",
                borderBottom: `1px solid ${T.border}`,
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              <p
                style={{
                  fontSize: "12px",
                  color: T.muted,
                  maxWidth: "380px",
                  lineHeight: 1.6,
                  fontFamily: "Outfit, sans-serif",
                }}
              >
                {isEditMode
                  ? "Changes will be applied immediately after saving."
                  : "By publishing you agree to the community guidelines."}
              </p>

              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                {/* Ghost cancel */}
                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => router.push(`/blog/${slug}`)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = T.borderHover;
                      e.currentTarget.style.color = T.cream;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = T.border;
                      e.currentTarget.style.color = T.muted;
                    }}
                    style={{
                      border: `1px solid ${T.border}`,
                      color: T.muted,
                      background: "transparent",
                      padding: "10px 20px",
                      borderRadius: "2px",
                      fontSize: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "0.18em",
                      cursor: "pointer",
                      fontFamily: "Outfit, sans-serif",
                    }}
                  >
                    Cancel
                  </button>
                )}

                {/* Primary submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) e.currentTarget.style.opacity = "0.85";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: T.cream,
                    color: T.bg,
                    border: "none",
                    padding: "10px 24px",
                    borderRadius: "2px",
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    fontFamily: "Outfit, sans-serif",
                    fontWeight: 500,
                    opacity: isSubmitting ? 0.4 : 1,
                  }}
                >
                  {isSubmitting && <Spinner size={12} onCream />}
                  {isSubmitting
                    ? isEditMode
                      ? "Updating..."
                      : "Publishing..."
                    : isEditMode
                      ? "Update Article"
                      : "Publish Article"}
                </button>
              </div>
            </div>
          </form>
        </section>
      </main>

      <Footer />
      <GlobalStyles />
    </div>
  );
}
