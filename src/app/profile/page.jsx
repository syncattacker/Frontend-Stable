"use client";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import API from "@/utils/axios";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Shield,
  Crown,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Globe,
  Calendar,
  Target,
  Check,
  Edit,
  Lock,
  X,
  Activity,
  TrendingUp,
  Zap,
  Copy,
  Share2,
  FileText,
  Trash2,
  PenLine,
  Loader2,
  ExternalLink,
} from "lucide-react";
import {
  RiInstagramLine as FaInstagram,
  RiLinkedinLine as FaLinkedin,
  RiGithubLine as FaGithub,
} from "@remixicon/react";
import { showToast } from "@/utils/toast.jsx";
import { useRouter } from "next/navigation";
import { logout } from "@/store/authSlice";
import Image from "next/image";
import tick from "@/img/tick.svg";

/* ─────────────────────────────────────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────────────────────────────────────── */
const T = {
  bg: "#060606",
  cream: "#ede9df",
  mid: "#5a5a5a",
  muted: "#2e2e2e",
  border: "#1c1c1c",
  surface: "#0c0c0c",
  ok: "#3d6b4a",
  warn: "#7a6230",
  err: "#6b3535",
  okText: "#6aad82",
  warnText: "#c4993a",
  errText: "#c46060",
};

/* ─────────────────────────────────────────────────────────────────────────────
   GLOBAL CSS — injected once as <style>
   Handles hover states, transitions, and anything inline styles can't do.
───────────────────────────────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* Root */
  .up { background: ${T.bg}; min-height: 100vh; font-family: 'Outfit', sans-serif; color: ${T.cream}; }

  /* Tabs */
  .up-tab {
    background: none; border: none; border-bottom: 1px solid transparent;
    color: ${T.mid}; cursor: pointer; font-family: 'Outfit', sans-serif;
    font-size: 9px; letter-spacing: 0.24em; text-transform: uppercase;
    padding: 11px 20px; margin-bottom: -1px; transition: color 0.15s, border-color 0.15s;
    white-space: nowrap;
  }
  .up-tab:hover { color: #888; }
  .up-tab.active { color: ${T.cream}; border-bottom-color: ${T.cream}; }

  /* Ghost button */
  .btn-g {
    background: none; border: 1px solid ${T.border}; color: ${T.mid};
    cursor: pointer; font-family: 'Outfit', sans-serif; font-size: 9px;
    letter-spacing: 0.18em; text-transform: uppercase; padding: 7px 14px;
    display: inline-flex; align-items: center; gap: 5px;
    transition: border-color 0.15s, color 0.15s;
  }
  .btn-g:hover:not(:disabled) { border-color: ${T.mid}; color: ${T.cream}; }
  .btn-g:disabled { opacity: 0.3; cursor: not-allowed; }

  /* Primary button */
  .btn-p {
    background: ${T.cream}; border: 1px solid ${T.cream}; color: ${T.bg};
    cursor: pointer; font-family: 'Outfit', sans-serif; font-size: 9px;
    letter-spacing: 0.18em; text-transform: uppercase; padding: 7px 14px;
    display: inline-flex; align-items: center; gap: 5px;
    transition: opacity 0.15s;
  }
  .btn-p:hover:not(:disabled) { opacity: 0.82; }
  .btn-p:disabled { opacity: 0.3; cursor: not-allowed; }

  /* Danger button */
  .btn-d {
    background: none; border: 1px solid ${T.err}; color: ${T.errText};
    cursor: pointer; font-family: 'Outfit', sans-serif; font-size: 9px;
    letter-spacing: 0.18em; text-transform: uppercase; padding: 7px 14px;
    display: inline-flex; align-items: center; gap: 5px;
    transition: opacity 0.15s;
  }
  .btn-d:hover:not(:disabled) { opacity: 0.78; }
  .btn-d:disabled { opacity: 0.3; cursor: not-allowed; }

  /* Icon button */
  .ibtn {
    background: none; border: 1px solid ${T.border}; color: ${T.mid};
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    width: 30px; height: 30px; text-decoration: none;
    transition: border-color 0.15s, color 0.15s;
  }
  .ibtn:hover { border-color: ${T.mid}; color: ${T.cream}; }
  .ibtn.danger { border-color: ${T.err}; color: ${T.errText}; }
  .ibtn.danger:hover { opacity: 0.75; }

  /* Input */
  .up-input {
    background: ${T.surface}; border: 1px solid ${T.border}; color: ${T.cream};
    font-family: 'Outfit', sans-serif; font-size: 13px;
    padding: 10px 14px; width: 100%; outline: none;
    transition: border-color 0.15s;
  }
  .up-input:focus { border-color: ${T.mid}; }

  /* Card — just a border box, no background fill */
  .card { border: 1px solid ${T.border}; overflow: hidden; }

  /* List rows */
  .lrow { border-bottom: 1px solid ${T.muted}; transition: background 0.12s; }
  .lrow:last-child { border-bottom: none; }
  .lrow:hover { background: ${T.surface}; }

  /* Stat grid — 1px gap shows grid background as dividers */
  .sg3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: ${T.border}; }
  .sg4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: ${T.border}; }
  .sg2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; background: ${T.border}; }
  .sc  { background: ${T.bg}; padding: 20px 24px; }

  /* Filter pills */
  .fpill {
    background: none; border: 1px solid ${T.border}; color: ${T.mid};
    cursor: pointer; font-family: 'Outfit', sans-serif; font-size: 9px;
    letter-spacing: 0.16em; text-transform: uppercase; padding: 6px 14px;
    transition: all 0.15s;
  }
  .fpill:hover { border-color: ${T.mid}; color: #888; }
  .fpill.on { background: ${T.cream}; border-color: ${T.cream}; color: ${T.bg}; }

  /* Activity cell */
  .acell {
    border: none; cursor: pointer; display: block;
    transition: opacity 0.12s;
  }
  .acell:hover { opacity: 0.65; }

  /* Anchor */
  .up-a { text-decoration: none; transition: color 0.15s; }
  .up-a:hover { color: ${T.cream} !important; }

  /* Filter row scroll */
  .tab-scroll { overflow-x: auto; scrollbar-width: none; }
  .tab-scroll::-webkit-scrollbar { display: none; }

  /* Keyframes */
  @keyframes spin    { to { transform: rotate(360deg); } }
  @keyframes fadeUp  { from { opacity:0; transform:translateY(5px); } to { opacity:1; transform:none; } }
  .fade-up { animation: fadeUp 0.22s ease both; }
  .spin    { animation: spin 0.8s linear infinite; }

  /* Setting rows */
  .srow {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 24px; border-bottom: 1px solid ${T.muted};
  }
  .srow:last-child { border-bottom: none; }

  /* Progress */
  .pbar { height: 1px; background: ${T.muted}; width: 100%; }
  .pfill { height: 1px; background: ${T.cream}; transition: width 0.4s ease; }

  /* Header stat strip */
  .hstat { border-right: 1px solid ${T.border}; padding: 20px 28px; }
  .hstat:last-child { border-right: none; }

  /* Social link hover */
  .social-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 13px 24px; border-bottom: 1px solid ${T.muted};
    transition: background 0.12s;
  }
  .social-row:last-child { border-bottom: none; }
  .social-row:hover { background: ${T.surface}; }
`;

/* ─────────────────────────────────────────────────────────────────────────────
   PRIMITIVE COMPONENTS
───────────────────────────────────────────────────────────────────────────── */
const Micro = ({ children, style = {} }) => (
  <p
    style={{
      fontFamily: "'Outfit', sans-serif",
      fontSize: "9px",
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      color: T.mid,
      ...style,
    }}
  >
    {children}
  </p>
);

const Display = ({ children, size = "2.8rem", style = {} }) => (
  <p
    style={{
      fontFamily: "'Bebas Neue', sans-serif",
      fontSize: size,
      color: T.cream,
      lineHeight: 1,
      letterSpacing: "-0.01em",
      ...style,
    }}
  >
    {children}
  </p>
);

const Rule = ({ style = {} }) => (
  <div style={{ height: "1px", background: T.border, ...style }} />
);

const Pill = ({ children, color = T.mid }) => (
  <span
    style={{
      fontFamily: "'Outfit', sans-serif",
      fontSize: "9px",
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color,
      border: `1px solid ${color}`,
      padding: "2px 8px",
    }}
  >
    {children}
  </span>
);

/* Card with an accent-bar header */
const Section = ({ label, action, children, bodyPad = "24px" }) => (
  <div className="card fade-up">
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 24px",
        borderBottom: `1px solid ${T.border}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span
          style={{
            display: "block",
            width: "2px",
            height: "13px",
            background: T.cream,
            flexShrink: 0,
          }}
        />
        <Micro>{label}</Micro>
      </div>
      {action && <div>{action}</div>}
    </div>
    <div style={{ padding: bodyPad }}>{children}</div>
  </div>
);

/* Info row used inside Account Information */
const InfoRow = ({ icon: Icon, label, children, last }) => (
  <div
    style={{
      display: "flex",
      gap: "14px",
      alignItems: "flex-start",
      paddingBottom: last ? 0 : "16px",
      marginBottom: last ? 0 : "16px",
      borderBottom: last ? "none" : `1px solid ${T.muted}`,
    }}
  >
    {Icon && (
      <Icon size={13} color={T.mid} style={{ marginTop: 3, flexShrink: 0 }} />
    )}
    <div>
      <Micro style={{ marginBottom: "4px" }}>{label}</Micro>
      <div
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: "13px",
          color: T.cream,
        }}
      >
        {children}
      </div>
    </div>
  </div>
);

/* Modal shell */
const Modal = ({ title, onClose, children }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 70,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px",
      background: "rgba(0,0,0,0.93)",
    }}
  >
    <div
      className="card fade-up"
      style={{ maxWidth: "460px", width: "100%", background: T.bg }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 24px",
          borderBottom: `1px solid ${T.border}`,
        }}
      >
        <Display size="1.8rem">{title}</Display>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: T.mid,
            display: "flex",
            padding: "2px",
          }}
        >
          <X size={15} />
        </button>
      </div>
      <div style={{ padding: "24px" }}>{children}</div>
    </div>
  </div>
);

/* Labelled input */
const Field = ({ label, error, textarea, rows, ...props }) => (
  <div style={{ marginBottom: "18px" }}>
    <Micro style={{ marginBottom: "7px" }}>{label}</Micro>
    {textarea ? (
      <textarea
        rows={rows || 3}
        className="up-input"
        style={{ resize: "none" }}
        {...props}
      />
    ) : (
      <input className="up-input" {...props} />
    )}
    {error && (
      <p
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: "11px",
          color: T.errText,
          marginTop: "5px",
        }}
      >
        {error}
      </p>
    )}
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   ACTIVITY CELL PALETTE — pure monochrome scale
───────────────────────────────────────────────────────────────────────────── */
const CELLS = ["#111111", "#1e1e1e", "#383838", "#686868", T.cream];

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
const UserProfile = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  /* State */
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socialLinks, setSocialLinks] = useState({
    linkedIn: "",
    github: "",
    instagram: "",
  });
  const [deletingBlogSlug, setDeletingBlogSlug] = useState(null);
  const [isEditingSocials, setIsEditingSocials] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [courseFilter, setCourseFilter] = useState("all");
  const [showEditUsernameModal, setShowEditUsernameModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [userTimezone, setUserTimezone] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "Weak",
    color: T.errText,
  });
  const [toastMessage, setToastMessage] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [confirmationPhrase, setConfirmationPhrase] = useState("");

  /* Effects */
  useEffect(() => {
    setUserTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/api/v1/users/unified-profile");
        if (res.data.success) {
          setProfileData(res.data.profile);
          setNewUsername(res.data.profile.user.username);
          setSocialLinks({
            linkedIn: res.data.profile.user.linkedIn || "",
            github: res.data.profile.user.github || "",
            instagram: res.data.profile.user.instagram || "",
          });
        } else setError("Failed to load profile");
      } catch {
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (toastMessage) {
      const t = setTimeout(() => setToastMessage(null), 3200);
      return () => clearTimeout(t);
    }
  }, [toastMessage]);

  /* Helpers */
  const formatDateKey = (d, tz) =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);

  const convertToUserTimezone = (ds, tz) => {
    if (!tz) return new Date(ds);
    try {
      return new Date(new Date(ds).toLocaleString("en-US", { timeZone: tz }));
    } catch {
      return new Date(ds);
    }
  };

  const formatDate = (ts) =>
    ts
      ? new Date(ts).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "—";
  const formatJoinDate = (ts) =>
    ts
      ? new Date(ts).toLocaleDateString("en-US", {
          year: "2-digit",
          month: "long",
        })
      : "—";

  const getCountryFlag = (c) =>
    ({
      India: "🇮🇳",
      USA: "🇺🇸",
      UK: "🇬🇧",
      Canada: "🇨🇦",
      Australia: "🇦🇺",
      Germany: "🇩🇪",
      France: "🇫🇷",
      Japan: "🇯🇵",
      China: "🇨🇳",
      Russia: "🇷🇺",
      Pakistan: "🇵🇰",
    })[c] || "🌍";

  const diffColor = (d) =>
    d === "Easy"
      ? T.okText
      : d === "Medium"
        ? T.warnText
        : d === "Hard"
          ? T.errText
          : T.mid;

  /* Activity data */
  const generateActivityData = () => {
    const map = {};
    for (const a of profileData?.userActivity || []) {
      const key = `${a._id.year}-${a._id.month.padStart(2, "0")}-${a._id.day.padStart(2, "0")}`;
      map[key] = (map[key] || 0) + a.contributions;
    }
    const today = new Date();
    const tz = userTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    return Array.from({ length: 365 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (364 - i));
      const key = formatDateKey(d, tz);
      const cnt = map[key] || 0;
      return {
        date: key,
        count: cnt,
        level: cnt === 0 ? 0 : cnt <= 2 ? 1 : cnt <= 5 ? 2 : cnt <= 10 ? 3 : 4,
      };
    });
  };

  const totalActivity =
    profileData?.userActivity?.reduce(
      (s, a) => s + (a.contributions || 0),
      0,
    ) || 0;
  const activeDays =
    new Set(
      profileData?.userActivity?.map(
        (i) => `${i._id.year}-${i._id.month}-${i._id.day}`,
      ),
    ).size || 0;

  const calculateStreak = () => {
    if (!profileData?.userActivity?.length) return 0;
    const sorted = [...profileData.userActivity].sort(
      (a, b) =>
        new Date(`${b._id.year}-${b._id.month}-${b._id.day}`) -
        new Date(`${a._id.year}-${a._id.month}-${a._id.day}`),
    );
    let streak = 0;
    const cur = userTimezone
      ? convertToUserTimezone(new Date().toISOString(), userTimezone)
      : new Date();
    for (const a of sorted) {
      const diff = Math.floor(
        (cur - new Date(`${a._id.year}-${a._id.month}-${a._id.day}`)) /
          86400000,
      );
      if (diff === streak) streak++;
      else if (diff > streak) break;
    }
    return streak;
  };

  /* Handlers */
  const handleCopyProfileLink = async () => {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}/pwn/${profileData?.user?.username}`;
    let ok = false;
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(url);
        ok = true;
      } catch {}
    }
    if (!ok) {
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.style.cssText = "position:absolute;left:-9999px";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        ok = true;
      } catch {}
      document.body.removeChild(ta);
    }
    if (ok) {
      setIsCopied(true);
      showToast("success", "Link copied");
      setTimeout(() => setIsCopied(false), 2000);
    } else showToast("error", "Failed to copy");
  };

  const handleSocialLinkChange = (e) =>
    setSocialLinks({ ...socialLinks, [e.target.name]: e.target.value });

  const handleUpdateSocials = async (e) => {
    e.preventDefault();
    try {
      await API.patch("/auth/update-social-links", socialLinks);
      showToast("success", "Social links updated");
      setIsEditingSocials(false);
      const r = await API.get("/api/v1/users/unified-profile");
      if (r.data.success) setProfileData(r.data.profile);
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed");
    }
  };

  const handleEditUsername = async (e) => {
    e.preventDefault();
    setIsUpdatingUsername(true);
    setUsernameError("");
    if (!newUsername.trim()) {
      setUsernameError("Username cannot be empty");
      setIsUpdatingUsername(false);
      return;
    }
    try {
      await API.patch(
        "/auth/update-username",
        { newUsername },
        { withCredentials: true },
      );
      showToast("success", "Username updated");
      setShowEditUsernameModal(false);
      const r = await API.get("/api/v1/users/unified-profile");
      if (r.data.success) setProfileData(r.data.profile);
    } catch (err) {
      setUsernameError(err.response?.data?.message || "Failed");
    } finally {
      setIsUpdatingUsername(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
    if (name === "newPassword") calcStrength(value);
  };

  const calcStrength = (pw) => {
    if (!pw) {
      setPasswordStrength({ score: 0, label: "Weak", color: T.errText });
      return;
    }
    const s = [
      pw.length >= 8,
      pw.length >= 12,
      /[A-Z]/.test(pw),
      /[a-z]/.test(pw),
      /[0-9]/.test(pw),
      /[^A-Za-z0-9]/.test(pw),
    ].filter(Boolean).length;
    setPasswordStrength(
      s <= 2
        ? { score: s, label: "Weak", color: T.errText }
        : s <= 4
          ? { score: s, label: "Medium", color: T.warnText }
          : { score: s, label: "Strong", color: T.okText },
    );
  };

  const validatePasswordForm = () => {
    const e = { currentPassword: "", newPassword: "" };
    let ok = true;
    if (!passwordForm.currentPassword) {
      e.currentPassword = "Required";
      ok = false;
    }
    if (
      !/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(
        passwordForm.newPassword,
      )
    ) {
      e.newPassword = "8+ chars, uppercase, number & special char";
      ok = false;
    }
    setErrors(e);
    return ok;
  };

  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;
    try {
      const res = await API.patch(
        "/auth/update-password",
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        { withCredentials: true },
      );
      setToastMessage({
        type: "success",
        text: res.data.message || "Password updated",
      });
      setPasswordForm({ currentPassword: "", newPassword: "" });
      setShowChangePasswordModal(false);
      dispatch(logout());
      router.push("/");
    } catch (err) {
      setToastMessage({
        type: "error",
        text: err.response?.data?.message || "Failed",
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await API.delete("/auth/delete", {
        data: {
          reason: deleteReason.trim() || null,
          confirmation: confirmationPhrase,
        },
      });
      if (res.status === 200) {
        alert("Account deleted");
        window.location.href = "/";
      } else alert("Failed to delete account");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const handleDeleteUserBlog = async (slug) => {
    if (!window.confirm("Delete this article? Cannot be undone.")) return;
    setDeletingBlogSlug(slug);
    try {
      await API.delete(`/api/v1/resource/${slug}`, { withCredentials: true });
      setProfileData((p) => ({
        ...p,
        articles: p.articles.filter((b) => b.slug !== slug),
      }));
      showToast("success", "Article deleted");
    } catch {
      showToast("error", "Failed to delete");
    } finally {
      setDeletingBlogSlug(null);
    }
  };

  const requiredPhrase = `gopwnit/delete/${profileData?.user?.username || ""}`;

  /* ── ACTIVITY GRAPH ──────────────────────────────────────────────────────── */
  const ActivityGraph = () => {
    const [sel, setSel] = useState(null);
    const data = generateActivityData();
    const weeks = [];
    for (let i = 0; i < data.length; i += 7) weeks.push(data.slice(i, i + 7));
    const MN = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const WD = ["S", "M", "T", "W", "T", "F", "S"];

    const monthGroups = (() => {
      const g = [];
      let cur = null,
        curI = null,
        curW = [];
      for (let i = 0; i < weeks.length; i++) {
        const m = new Date(weeks[i][0].date).getMonth();
        if (cur === null) {
          cur = m;
          curI = i;
        }
        if (m !== cur) {
          g.push({ m: cur, i: curI, w: curW });
          cur = m;
          curI = i;
          curW = [];
        }
        curW.push(weeks[i]);
      }
      if (curW.length) g.push({ m: cur, i: curI, w: curW });
      return g;
    })();

    return (
      <Section
        label="Contribution Graph"
        action={
          sel ? (
            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "11px",
                color: T.mid,
              }}
            >
              {sel.count} contributions ·{" "}
              {new Date(sel.date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </p>
          ) : (
            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "10px",
                color: T.muted,
                letterSpacing: "0.08em",
              }}
            >
              Click a cell to inspect
            </p>
          )
        }
      >
        <div style={{ overflowX: "auto" }}>
          <div style={{ display: "flex", gap: "3px", minWidth: "max-content" }}>
            {/* Weekday labels */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2px",
                paddingTop: "18px",
                marginRight: "2px",
              }}
            >
              {WD.map((d, i) => (
                <div
                  key={i}
                  style={{
                    width: "10px",
                    height: "12px",
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: "8px",
                    color: T.muted,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {i % 2 === 1 ? d : ""}
                </div>
              ))}
            </div>
            {/* Month groups */}
            {monthGroups.map((g, gi) => (
              <div
                key={gi}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <p
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: "8px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: T.muted,
                    height: "16px",
                    lineHeight: "16px",
                  }}
                >
                  {MN[g.m]}
                </p>
                <div style={{ display: "flex", gap: "2px" }}>
                  {g.w.map((week, wi) => (
                    <div
                      key={wi}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      {week.map((day, di) => (
                        <button
                          key={di}
                          className="acell"
                          onClick={() => setSel(day)}
                          style={{
                            width: "12px",
                            height: "12px",
                            background: CELLS[day.level],
                            outline:
                              sel?.date === day.date
                                ? `1px solid ${T.cream}`
                                : "none",
                            outlineOffset: "1px",
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Legend */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            marginTop: "14px",
            justifyContent: "flex-end",
          }}
        >
          <Micro style={{ marginRight: "2px" }}>Less</Micro>
          {CELLS.map((col, i) => (
            <div
              key={i}
              style={{ width: "10px", height: "10px", background: col }}
            />
          ))}
          <Micro style={{ marginLeft: "2px" }}>More</Micro>
        </div>
      </Section>
    );
  };

  /* ── TAB DEFINITIONS ─────────────────────────────────────────────────────── */
  const TABS = [
    { id: "personal", label: "Personal" },
    { id: "ctf", label: "CTF" },
    { id: "courses", label: "Courses" },
    { id: "activity", label: "Activity" },
    { id: "socials", label: "Socials" },
    { id: "myblogs", label: "Blogs" },
  ];

  /* ── PERSONAL ────────────────────────────────────────────────────────────── */
  const renderPersonalDetails = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Section label="Account Information">
        <InfoRow icon={User} label="Username">
          {profileData?.user?.username || "—"}
        </InfoRow>
        <InfoRow icon={Mail} label="Email">
          <span style={{ marginRight: "10px" }}>
            {profileData?.user?.email || "—"}
          </span>
          {profileData?.user?.isVerified && (
            <Pill color={T.okText}>Verified</Pill>
          )}
        </InfoRow>
        <InfoRow icon={User} label="Full Name">
          {profileData?.user?.fullName || "Not provided"}
        </InfoRow>
        <InfoRow icon={Globe} label="Country">
          {profileData?.user?.country || "Not specified"}
        </InfoRow>
        <InfoRow icon={Calendar} label="Member Since" last>
          {formatJoinDate(profileData?.user?.createdAt)}
        </InfoRow>
      </Section>

      <Section label="Account Status">
        {[
          {
            Icon: Shield,
            label: "Account Status",
            val: profileData?.user?.isBanned ? "Banned" : "Active",
            c: profileData?.user?.isBanned ? T.errText : T.okText,
          },
          {
            Icon: CheckCircle,
            label: "Email Verification",
            val: profileData?.user?.isVerified ? "Verified" : "Pending",
            c: profileData?.user?.isVerified ? T.okText : T.warnText,
          },
          { Icon: Crown, label: "Plan", val: "Free", c: T.mid },
        ].map(({ Icon, label, val, c }, i, arr) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "13px 0",
              borderBottom:
                i < arr.length - 1 ? `1px solid ${T.muted}` : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Icon size={13} color={T.mid} />
              <p
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "13px",
                  color: T.mid,
                }}
              >
                {label}
              </p>
            </div>
            <Pill color={c}>{val}</Pill>
          </div>
        ))}
      </Section>

      <Section label="Account Settings" bodyPad="0">
        {[
          {
            label: "Change username",
            onClik: () => {
              setNewUsername(profileData?.user?.username || "");
              setShowEditUsernameModal(true);
            },
            danger: false,
          },
          {
            label: "Change password",
            onClik: () => setShowChangePasswordModal(true),
            danger: false,
          },
          {
            label: "Delete account",
            onClik: () => setShowDeleteAccountModal(true),
            danger: true,
          },
        ].map(({ label, onClik, danger }) => (
          <div key={label} className="srow">
            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "13px",
                color: T.mid,
              }}
            >
              {label}
            </p>
            <button className={danger ? "btn-d" : "btn-g"} onClick={onClik}>
              {danger ? "Delete" : "Change"}
            </button>
          </div>
        ))}
      </Section>
    </div>
  );

  /* ── CTF ─────────────────────────────────────────────────────────────────── */
  const renderCTFDetails = () => {
    const totalDiff = Object.values(
      profileData?.ctf?.difficultyBreakdown || {},
    ).reduce((s, c) => s + c, 0);
    const totalCat = Object.values(
      profileData?.ctf?.categoriesCompleted || {},
    ).reduce((s, c) => s + c, 0);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Hero stats */}
        <div className="sg3 card">
          {[
            {
              label: "Rank",
              value:
                profileData?.ctf?.rank === "Unranked"
                  ? "NuB"
                  : `#${profileData?.ctf?.rank}`,
            },
            {
              label: "Points",
              value: profileData?.ctf?.totalPoints?.toLocaleString() || "0",
            },
            {
              label: "Solved",
              value: String(profileData?.ctf?.totalSolved || "0"),
            },
          ].map((s) => (
            <div key={s.label} className="sc">
              <Micro style={{ marginBottom: "8px" }}>{s.label}</Micro>
              <Display size="3rem">{s.value}</Display>
            </div>
          ))}
        </div>

        {/* Difficulty */}
        <Section label="Difficulty Breakdown">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: "12px",
            }}
          >
            {Object.entries(profileData?.ctf?.difficultyBreakdown || {}).map(
              ([d, cnt]) => (
                <div
                  key={d}
                  style={{
                    border: `1px solid ${T.border}`,
                    padding: "18px 20px",
                  }}
                >
                  <Display size="2.6rem" style={{ color: diffColor(d) }}>
                    {cnt}
                  </Display>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginTop: "8px",
                    }}
                  >
                    <Micro>{d}</Micro>
                    <p
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "10px",
                        color: T.mid,
                      }}
                    >
                      {totalDiff > 0 ? Math.round((cnt / totalDiff) * 100) : 0}%
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </Section>

        {/* Categories */}
        <Section label="Categories">
          {Object.entries(profileData?.ctf?.categoriesCompleted || {}).filter(
            ([, c]) => c > 0,
          ).length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <Target
                size={26}
                color={T.muted}
                style={{ margin: "0 auto 10px", display: "block" }}
              />
              <p
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "13px",
                  color: T.mid,
                }}
              >
                No challenges solved yet
              </p>
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              {Object.entries(profileData?.ctf?.categoriesCompleted || {})
                .filter(([, c]) => c > 0)
                .map(([cat, cnt]) => (
                  <div key={cat}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "7px",
                      }}
                    >
                      <Micro>{cat}</Micro>
                      <p
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "10px",
                          color: T.mid,
                        }}
                      >
                        {cnt}
                      </p>
                    </div>
                    <div className="pbar">
                      <div
                        className="pfill"
                        style={{
                          width: `${totalCat > 0 ? (cnt / totalCat) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </Section>

        {/* Recent challenges */}
        {profileData?.ctf?.solved?.length > 0 && (
          <Section label="Recent Challenges" bodyPad="0">
            {profileData.ctf.solved.map((c, i) => (
              <div
                key={i}
                className="lrow"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "13px 24px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <div
                    style={{
                      width: "5px",
                      height: "5px",
                      borderRadius: "50%",
                      background: diffColor(c.difficulty),
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <p
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: "13px",
                        color: T.cream,
                      }}
                    >
                      {c.name}
                    </p>
                    <Micro>{c.category}</Micro>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "12px",
                      color: T.cream,
                    }}
                  >
                    {c.points} pts
                  </p>
                  <p
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: "10px",
                      color: T.mid,
                    }}
                  >
                    {formatDate(c.solvedAt)}
                  </p>
                </div>
              </div>
            ))}
          </Section>
        )}
      </div>
    );
  };

  /* ── COURSES ─────────────────────────────────────────────────────────────── */
  const renderCourseDetails = () => {
    const all = profileData?.enrolledCourses || [];
    const completed = all.filter((c) => c.isCompleted);
    const inProg = all.filter((c) => !c.isCompleted);
    const filtered =
      courseFilter === "completed"
        ? completed
        : courseFilter === "incomplete"
          ? inProg
          : all;

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Stats */}
        <div className="sg4 card">
          {[
            { label: "Total", value: String(all.length) },
            { label: "Completed", value: String(completed.length) },
            { label: "In Progress", value: String(inProg.length) },
            {
              label: "Completion",
              value: `${all.length > 0 ? Math.round((completed.length / all.length) * 100) : 0}%`,
            },
          ].map((s) => (
            <div key={s.label} className="sc">
              <Micro style={{ marginBottom: "8px" }}>{s.label}</Micro>
              <Display size="2.4rem">{s.value}</Display>
            </div>
          ))}
        </div>

        {/* List with filters */}
        <Section
          label="Courses"
          action={
            <div style={{ display: "flex", gap: "6px" }}>
              {[
                ["all", "All"],
                ["completed", "Done"],
                ["incomplete", "Active"],
              ].map(([id, lbl]) => (
                <button
                  key={id}
                  onClick={() => setCourseFilter(id)}
                  className={`fpill${courseFilter === id ? " on" : ""}`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          }
          bodyPad="0"
        >
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <BookOpen
                size={26}
                color={T.muted}
                style={{ margin: "0 auto 10px", display: "block" }}
              />
              <p
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "13px",
                  color: T.mid,
                }}
              >
                No courses to show
              </p>
            </div>
          ) : (
            filtered.map((course) => (
              <div
                key={course.slug}
                className="lrow"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "14px 24px",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    flexShrink: 0,
                    overflow: "hidden",
                    border: `1px solid ${T.border}`,
                  }}
                >
                  <img
                    src={course.image}
                    alt={course.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: "13px",
                      color: T.cream,
                      marginBottom: "4px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {course.title}
                  </p>
                  <Micro>Enrolled {formatDate(course.enrolledAt)}</Micro>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    flexShrink: 0,
                  }}
                >
                  <Pill color={course.isCompleted ? T.okText : T.warnText}>
                    {course.isCompleted ? "Completed" : "Active"}
                  </Pill>
                  <button
                    className="btn-g"
                    onClick={() => router.push(`/learning/${course.slug}`)}
                  >
                    {course.isCompleted ? "Review" : "Continue"}
                  </button>
                </div>
              </div>
            ))
          )}
        </Section>
      </div>
    );
  };

  /* ── ACTIVITY ────────────────────────────────────────────────────────────── */
  const renderActivityDetails = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <ActivityGraph />

      <div className="sg4 card">
        {[
          {
            label: "Total Activity",
            value: String(totalActivity),
            Icon: Activity,
          },
          { label: "Active Days", value: String(activeDays), Icon: Calendar },
          {
            label: "Avg Daily",
            value: String(
              activeDays > 0 ? Math.round(totalActivity / activeDays) : 0,
            ),
            Icon: Zap,
          },
          {
            label: "Streak",
            value: String(calculateStreak()),
            Icon: TrendingUp,
          },
        ].map((s) => (
          <div
            key={s.label}
            className="sc"
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Micro>{s.label}</Micro>
              <s.Icon size={12} color={T.muted} />
            </div>
            <Display size="2.4rem">{s.value}</Display>
          </div>
        ))}
      </div>

      <Section label="Recent Activity" bodyPad="0">
        {profileData?.recentActivity?.length > 0 ? (
          profileData.recentActivity.map((a, i) => (
            <div
              key={i}
              className="lrow"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "13px 24px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <CheckCircle size={12} color={T.muted} />
                <div>
                  <p
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: "13px",
                      color: T.cream,
                    }}
                  >
                    {a.type}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: "11px",
                      color: T.mid,
                    }}
                  >
                    {a.description}
                  </p>
                </div>
              </div>
              <p
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "10px",
                  color: T.mid,
                }}
              >
                {new Date(a.timestamp).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "13px",
              color: T.mid,
              textAlign: "center",
              padding: "48px",
            }}
          >
            No recent activity
          </p>
        )}
      </Section>
    </div>
  );

  /* ── SOCIALS ─────────────────────────────────────────────────────────────── */
  const renderSocialsSection = () => {
    const SOCIALS = [
      { id: "linkedIn", label: "LinkedIn", Icon: FaLinkedin },
      { id: "github", label: "GitHub", Icon: FaGithub },
      { id: "instagram", label: "Instagram", Icon: FaInstagram },
    ];
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Section label="Share Profile">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                minWidth: 0,
              }}
            >
              <Share2 size={13} color={T.mid} />
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "11px",
                  color: T.mid,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {typeof window !== "undefined"
                  ? `${window.location.origin}/pwn/${profileData?.user?.username}`
                  : ""}
              </p>
            </div>
            <button className="btn-g" onClick={handleCopyProfileLink}>
              {isCopied ? (
                <>
                  <Check size={11} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={11} />
                  Copy
                </>
              )}
            </button>
          </div>
        </Section>

        <Section
          label="Social Links"
          action={
            !isEditingSocials && (
              <button
                className="btn-g"
                onClick={() => setIsEditingSocials(true)}
              >
                <Edit size={11} /> Edit
              </button>
            )
          }
          bodyPad={isEditingSocials ? "24px" : "0"}
        >
          {isEditingSocials ? (
            <form onSubmit={handleUpdateSocials}>
              {SOCIALS.map(({ id, label, Icon }) => (
                <div key={id} style={{ marginBottom: "16px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "7px",
                    }}
                  >
                    <Icon size={12} color={T.mid} />
                    <Micro>{label}</Micro>
                  </div>
                  <input
                    type="url"
                    name={id}
                    value={socialLinks[id]}
                    onChange={handleSocialLinkChange}
                    placeholder={`https://${id}.com/...`}
                    className="up-input"
                  />
                </div>
              ))}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "flex-end",
                  marginTop: "8px",
                }}
              >
                <button
                  type="button"
                  className="btn-g"
                  onClick={() => {
                    setIsEditingSocials(false);
                    setSocialLinks({
                      linkedIn: profileData?.user?.linkedIn || "",
                      github: profileData?.user?.github || "",
                      instagram: profileData?.user?.instagram || "",
                    });
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-p">
                  Save
                </button>
              </div>
            </form>
          ) : (
            SOCIALS.map(({ id, label, Icon }) => (
              <div key={id} className="social-row">
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <Icon size={13} color={T.mid} />
                  <p
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: "13px",
                      color: T.mid,
                    }}
                  >
                    {label}
                  </p>
                </div>
                {profileData?.user?.[id] ? (
                  <a
                    href={profileData.user[id]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="up-a"
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: "11px",
                      color: T.mid,
                    }}
                  >
                    {profileData.user[id].length > 32
                      ? profileData.user[id].slice(0, 32) + "…"
                      : profileData.user[id]}
                  </a>
                ) : (
                  <p
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: "11px",
                      color: T.muted,
                    }}
                  >
                    Not set
                  </p>
                )}
              </div>
            ))
          )}
        </Section>
      </div>
    );
  };

  /* ── BLOGS ───────────────────────────────────────────────────────────────── */
  const renderMyBlogs = () => {
    const blogs = profileData?.articles || [];
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
            <Display size="4rem">{blogs.length}</Display>
            <Micro>{blogs.length === 1 ? "Article" : "Articles"}</Micro>
          </div>
          <button
            className="btn-p"
            onClick={() => router.push("/dashboard/blogs/creator")}
          >
            <PenLine size={11} /> New Article
          </button>
        </div>

        {blogs.length === 0 ? (
          <div
            className="card"
            style={{ textAlign: "center", padding: "72px 0" }}
          >
            <FileText
              size={26}
              color={T.muted}
              style={{ margin: "0 auto 12px", display: "block" }}
            />
            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "13px",
                color: T.mid,
              }}
            >
              No articles yet
            </p>
          </div>
        ) : (
          <div className="card">
            {blogs.map((blog, i) => (
              <div
                key={blog.slug}
                className="lrow"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "15px 24px",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: "14px",
                      color: T.cream,
                      marginBottom: "6px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {blog.title}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: "10px",
                        color: T.mid,
                      }}
                    >
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                    <Pill
                      color={
                        blog.status === "approved"
                          ? T.okText
                          : blog.status === "rejected"
                            ? T.errText
                            : T.warnText
                      }
                    >
                      {blog.status}
                    </Pill>
                    <p
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: "10px",
                        color: T.mid,
                      }}
                    >
                      {blog.views} views
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "5px", flexShrink: 0 }}>
                  <a
                    href={`/blogs/${blog.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ibtn"
                  >
                    <ExternalLink size={13} />
                  </a>
                  <button
                    className="ibtn"
                    onClick={() =>
                      router.push(`/dashboard/blogs/creator/${blog.slug}`)
                    }
                  >
                    <PenLine size={13} />
                  </button>
                  <button
                    className="ibtn danger"
                    onClick={() => handleDeleteUserBlog(blog.slug)}
                    disabled={deletingBlogSlug === blog.slug}
                  >
                    {deletingBlogSlug === blog.slug ? (
                      <Loader2 size={13} className="spin" />
                    ) : (
                      <Trash2 size={13} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  /* ── LOADING / ERROR ─────────────────────────────────────────────────────── */
  if (loading)
    return (
      <>
        <style>{CSS}</style>
        <div
          className="up"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              className="spin"
              style={{
                width: "22px",
                height: "22px",
                border: `1px solid ${T.border}`,
                borderTopColor: T.cream,
                borderRadius: "50%",
                margin: "0 auto 14px",
              }}
            />
            <Micro>Loading profile</Micro>
          </div>
        </div>
      </>
    );

  if (error)
    return (
      <>
        <style>{CSS}</style>
        <div
          className="up"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <AlertTriangle
              size={26}
              color={T.errText}
              style={{ margin: "0 auto 12px", display: "block" }}
            />
            <Display size="1.6rem" style={{ marginBottom: "8px" }}>
              Error
            </Display>
            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "12px",
                color: T.mid,
                marginBottom: "20px",
              }}
            >
              {error}
            </p>
            <button className="btn-g" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        </div>
      </>
    );

  /* ── MAIN RENDER ─────────────────────────────────────────────────────────── */
  return (
    <>
      <style>{CSS}</style>

      <motion.div
        className="up"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.28 }}
      >
        <div
          style={{
            maxWidth: "1080px",
            margin: "0 auto",
            padding: "52px 32px 96px",
          }}
        >
          {/* ── PROFILE HEADER ─────────────────────────────────────────────── */}
          <header style={{ marginBottom: "52px" }}>
            {/* Name + quick action */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "16px",
                marginBottom: "10px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "14px" }}
              >
                <h1
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(3.8rem, 9vw, 7rem)",
                    color: T.cream,
                    lineHeight: 0.9,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {profileData?.user?.username || "Unknown"}
                </h1>
                <span style={{ fontSize: "1.3rem", lineHeight: 1 }}>
                  {getCountryFlag(profileData?.user?.country)}
                </span>
                {profileData?.user?.isVerified && (
                  <Image
                    src={tick}
                    alt="Verified"
                    width={16}
                    height={16}
                    style={{ marginBottom: "4px" }}
                  />
                )}
              </div>
              <button
                className="btn-g"
                onClick={() => router.push("/dashboard/blogs/creator")}
                style={{ marginBottom: "6px" }}
              >
                <PenLine size={11} /> New Article
              </button>
            </div>

            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "10px",
                letterSpacing: "0.2em",
                color: T.mid,
                textTransform: "uppercase",
                marginBottom: "28px",
              }}
            >
              Member since {formatJoinDate(profileData?.user?.createdAt)}
            </p>

            {/* Horizontal rule */}
            <Rule />

            {/* Stat strip — connected cells */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, auto) 1fr",
                borderLeft: `1px solid ${T.border}`,
              }}
            >
              {[
                {
                  label: "Rank",
                  value:
                    profileData?.ctf?.rank === "Unranked"
                      ? "NuB"
                      : `#${profileData?.ctf?.rank}`,
                },
                {
                  label: "Score",
                  value: profileData?.ctf?.totalPoints?.toLocaleString() || "0",
                },
                {
                  label: "Solved",
                  value: String(profileData?.ctf?.totalSolved || "0"),
                },
                { label: "Plan", value: "Free" },
              ].map((s) => (
                <div key={s.label} className="hstat">
                  <Micro style={{ marginBottom: "7px" }}>{s.label}</Micro>
                  <Display size="1.7rem">{s.value}</Display>
                </div>
              ))}
              {/* Filler cell — keeps left border */}
              <div style={{ borderRight: `1px solid ${T.border}` }} />
            </div>
            <Rule />
          </header>

          {/* ── TABS ───────────────────────────────────────────────────────── */}
          <div
            className="tab-scroll"
            style={{
              borderBottom: `1px solid ${T.border}`,
              marginBottom: "36px",
              display: "flex",
            }}
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`up-tab${activeTab === t.id ? " active" : ""}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ── TAB CONTENT ────────────────────────────────────────────────── */}
          <div key={activeTab} className="fade-up">
            {activeTab === "personal" && renderPersonalDetails()}
            {activeTab === "ctf" && renderCTFDetails()}
            {activeTab === "courses" && renderCourseDetails()}
            {activeTab === "activity" && renderActivityDetails()}
            {activeTab === "socials" && renderSocialsSection()}
            {activeTab === "myblogs" && renderMyBlogs()}
          </div>
        </div>

        {/* ── MODALS ─────────────────────────────────────────────────────────── */}
        {showEditUsernameModal && (
          <Modal
            title="Change Username"
            onClose={() => setShowEditUsernameModal(false)}
          >
            <form onSubmit={handleEditUsername}>
              <Field
                label="New Username"
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                error={usernameError}
              />
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  className="btn-g"
                  onClick={() => setShowEditUsernameModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-p"
                  disabled={isUpdatingUsername}
                >
                  {isUpdatingUsername ? "Saving…" : "Update"}
                </button>
              </div>
            </form>
          </Modal>
        )}

        {showChangePasswordModal && (
          <Modal
            title="Change Password"
            onClose={() => setShowChangePasswordModal(false)}
          >
            <form onSubmit={handleSubmitPasswordChange}>
              <Field
                label="Current Password"
                type={showPassword ? "text" : "password"}
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                error={errors.currentPassword}
              />
              <Field
                label="New Password"
                type={showPassword ? "text" : "password"}
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                error={errors.newPassword}
              />
              {/* Strength bar */}
              <div style={{ marginBottom: "18px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "7px",
                  }}
                >
                  <Micro>Strength</Micro>
                  <p
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: "9px",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: passwordStrength.color,
                    }}
                  >
                    {passwordStrength.label}
                  </p>
                </div>
                <div className="pbar">
                  <div
                    className="pfill"
                    style={{
                      width: `${(passwordStrength.score / 6) * 100}%`,
                      background: passwordStrength.color,
                    }}
                  />
                </div>
              </div>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "22px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                <p
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: "12px",
                    color: T.mid,
                  }}
                >
                  Show passwords
                </p>
              </label>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  className="btn-g"
                  onClick={() => setShowChangePasswordModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-p">
                  <Lock size={11} /> Update
                </button>
              </div>
            </form>
          </Modal>
        )}

        {showDeleteAccountModal && (
          <Modal
            title="Delete Account"
            onClose={() => setShowDeleteAccountModal(false)}
          >
            <div
              style={{
                border: `1px solid ${T.err}`,
                padding: "12px 16px",
                display: "flex",
                gap: "10px",
                marginBottom: "22px",
              }}
            >
              <AlertTriangle
                size={13}
                color={T.errText}
                style={{ flexShrink: 0, marginTop: "1px" }}
              />
              <p
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "12px",
                  color: T.errText,
                }}
              >
                Permanent. All data will be deleted and cannot be recovered.
              </p>
            </div>
            <Field
              label="Reason (optional)"
              textarea
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              placeholder="Help us improve…"
            />
            <div style={{ marginBottom: "22px" }}>
              <Micro style={{ marginBottom: "7px" }}>
                Type{" "}
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: T.errText,
                  }}
                >
                  {requiredPhrase}
                </span>{" "}
                to confirm
              </Micro>
              <input
                type="text"
                value={confirmationPhrase}
                onChange={(e) => setConfirmationPhrase(e.target.value)}
                className="up-input"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "12px",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                gap: "8px",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                className="btn-g"
                onClick={() => setShowDeleteAccountModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-d"
                disabled={confirmationPhrase !== requiredPhrase}
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </Modal>
        )}

        {/* ── TOAST ─────────────────────────────────────────────────────────── */}
        {toastMessage && (
          <div
            className="card fade-up"
            style={{
              position: "fixed",
              bottom: "24px",
              right: "24px",
              zIndex: 80,
              padding: "12px 20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: T.bg,
              borderColor: toastMessage.type === "success" ? T.ok : T.err,
            }}
          >
            {toastMessage.type === "success" ? (
              <CheckCircle size={13} color={T.okText} />
            ) : (
              <AlertTriangle size={13} color={T.errText} />
            )}
            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "13px",
                color: T.cream,
              }}
            >
              {toastMessage.text}
            </p>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default UserProfile;
