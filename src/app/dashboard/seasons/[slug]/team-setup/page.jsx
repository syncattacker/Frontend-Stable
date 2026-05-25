"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import copy from "copy-to-clipboard";
import {
  RiAddLine,
  RiArrowRightLine,
  RiVipCrownLine,
  RiLoginBoxLine,
  RiLogoutBoxLine,
  RiUserUnfollowLine,
  RiFileCopyLine,
  RiShieldLine,
  RiFlashlightLine,
  RiLockLine,
  RiCheckLine,
  RiLoader4Line,
  RiArrowRightSLine,
  RiGroupLine,
  RiLink,
  RiTimeLine,
  RiUserLine,
} from "@remixicon/react";
import API from "@/utils/axios";
import { showToast } from "@/utils/Toast";
import BoxLoader from "@/components/loaders/BoxLoader";
import { withAuth } from "@/utils/withAuth";

/* ─── Color tokens ─────────────────────────────────────────── */
const T = {
  bg: "#0A0A0A",
  cream: "#fefce8",
  muted: "#a1a1aa",
  mutedLight: "#a1a1aa",
  border: "rgba(254,252,232,0.12)",
  borderHover: "rgba(254,252,232,0.22)",
};

/* ─── Tiny helpers ──────────────────────────────────────────── */
const Spinner = ({ size = 16 }) => (
  <RiLoader4Line
    className="animate-spin shrink-0"
    style={{ width: size, height: size }}
  />
);

const Avatar = ({ name = "?", isOwner = false }) => (
  <div
    className="w-8 h-8 flex items-center justify-center font-black uppercase text-xs shrink-0"
    style={
      isOwner
        ? { background: T.cream, color: "#000" }
        : { background: "rgba(254,252,232,0.07)", color: "rgba(254,252,232,0.35)" }
    }
  >
    {name[0]}
  </div>
);

/* thin horizontal rule */
const Rule = () => (
  <div style={{ height: 1, background: T.border, width: "100%" }} />
);

/* ─── Feature bullet ────────────────────────────────────────── */
const FeatureLine = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-3">
    <Icon style={{ width: 14, height: 14, color: "rgba(254,252,232,0.25)", flexShrink: 0 }} />
    <span style={{ fontSize: 13, color: "rgba(254,252,232,0.4)", fontFamily: "'Outfit', sans-serif" }}>
      {text}
    </span>
  </div>
);

/* ─── Input ─────────────────────────────────────────────────── */
const Field = ({ label, hint, error, mono = false, ...props }) => (
  <div>
    {label && (
      <label
        className="block mb-1.5"
        style={{
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(254,252,232,0.25)",
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        {label}
      </label>
    )}
    <input
      {...props}
      className={`w-full text-sm px-4 py-3 outline-none transition-all ${mono ? "font-mono" : ""}`}
      style={{
        background: "rgba(254,252,232,0.03)",
        color: T.cream,
        border: `1px solid ${T.border}`,
        fontFamily: mono ? "monospace" : "'Outfit', sans-serif",
        ...props.style,
      }}
      onFocus={(e) => {
        e.target.style.borderColor = "rgba(254,252,232,0.4)";
        e.target.style.background = "rgba(254,252,232,0.05)";
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.target.style.borderColor = T.border;
        e.target.style.background = "rgba(254,252,232,0.03)";
        props.onBlur?.(e);
      }}
    />
    {error && (
      <p className="text-xs text-red-500 mt-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
        {error}
      </p>
    )}
    {hint && !error && (
      <p className="mt-1" style={{ fontSize: 10, color: "rgba(254,252,232,0.15)", fontFamily: "'Outfit', sans-serif" }}>
        {hint}
      </p>
    )}
  </div>
);

/* ─── Primary button ────────────────────────────────────────── */
const PrimaryBtn = ({ loading, disabled, children, ...props }) => (
  <button
    {...props}
    disabled={loading || disabled}
    className="flex items-center justify-center gap-2 w-full py-3 text-sm font-black tracking-wide transition-all"
    style={{
      background: loading || disabled ? "rgba(254,252,232,0.07)" : T.cream,
      color: loading || disabled ? "rgba(254,252,232,0.2)" : "#000",
      cursor: loading || disabled ? "not-allowed" : "pointer",
      fontFamily: "'Outfit', sans-serif",
      letterSpacing: "0.08em",
    }}
  >
    {loading ? <Spinner size={15} /> : children}
  </button>
);

/* ─── Ghost button ──────────────────────────────────────────── */
const GhostBtn = ({ children, style, ...props }) => (
  <button
    {...props}
    className="flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all"
    style={{
      color: "rgba(254,252,232,0.4)",
      border: `1px solid ${T.border}`,
      fontFamily: "'Outfit', sans-serif",
      letterSpacing: "0.08em",
      ...style,
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = T.borderHover;
      e.currentTarget.style.color = T.cream;
      props.onMouseEnter?.(e);
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = T.border;
      e.currentTarget.style.color = "rgba(254,252,232,0.4)";
      props.onMouseLeave?.(e);
    }}
  >
    {children}
  </button>
);

/* ─── Label chip ─────────────────────────────────────────────── */
const Chip = ({ children }) => (
  <span
    style={{
      fontSize: 9,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: "rgba(254,252,232,0.3)",
      border: `1px solid rgba(254,252,232,0.1)`,
      padding: "2px 7px",
      fontFamily: "'Outfit', sans-serif",
    }}
  >
    {children}
  </span>
);

/* ══════════════════════════════════════════════════════════════
   Main component
══════════════════════════════════════════════════════════════ */
const TeamSetup = () => {
  const { slug } = useParams();
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [team, setTeam] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  const [createName, setCreateName] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  const [inviteToken, setInviteToken] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState("");

  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");
  const [inviteExpiresIn, setInviteExpiresIn] = useState("");
  const [copied, setCopied] = useState(false);

  const [kickLoading, setKickLoading] = useState("");
  const [kickError, setKickError] = useState("");

  const [leaveLoading, setLeaveLoading] = useState(false);
  const [leaveError, setLeaveError] = useState("");
  const [confirmLeave, setConfirmLeave] = useState(false);

  const [lockLoading, setLockLoading] = useState(false);
  const [lockError, setLockError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get(`/api/v1/seasons/${slug}/team/me`);
        const data = res?.team || res?.data?.team || null;
        if (data) {
          setTeam(data);
          setIsOwner(data.isOwner || false);
          setCurrentUser(data.currentUser || null);
        }
      } catch {}
      finally { setChecking(false); }
    })();
  }, [slug]);

  const copyToClipboard = (url) => {
    copy(url);
    setCopied(true);
    showToast("success", "Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!createName.trim()) { setCreateError("Team name is required"); return; }
    setCreateLoading(true); setCreateError("");
    try {
      const res = await API.post(`/api/v1/seasons/${slug}/team/create`, { name: createName.trim() });
      const data = res?.team || res?.data?.team;
      if (data) {
        setTeam(data); setIsOwner(data.isOwner ?? true); setCurrentUser(data.currentUser || null);
        showToast("success", res?.data?.message || "Team created!");
      } else {
        const msg = res?.data?.message || "Failed to create team";
        setCreateError(msg); showToast("error", msg);
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Something went wrong";
      setCreateError(msg); showToast("error", msg);
    } finally { setCreateLoading(false); }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!inviteToken.trim()) { setJoinError("Invite token is required"); return; }
    setJoinLoading(true); setJoinError("");
    try {
      const res = await API.post(`/api/v1/seasons/${slug}/team/invite/accept`, { token: inviteToken.trim() });
      if (res?.success || res?.data?.success) {
        showToast("success", res?.data?.message || "Joined team!");
        const teamRes = await API.get(`/api/v1/seasons/${slug}/team/me`);
        const data = teamRes?.team || teamRes?.data?.team;
        if (data) { setTeam(data); setIsOwner(data.isOwner || false); setCurrentUser(data.currentUser || null); }
      } else {
        const msg = res?.data?.message || "Failed to join team";
        setJoinError(msg); showToast("error", msg);
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Something went wrong";
      setJoinError(msg); showToast("error", msg);
    } finally { setJoinLoading(false); }
  };

  const handleInvite = async () => {
    setInviteLoading(true); setInviteError("");
    try {
      const res = await API.post(`/api/v1/seasons/${slug}/team/invite`, {});
      const url = res?.inviteUrl || res?.data?.inviteUrl;
      const expires = res?.expiresIn || res?.data?.expiresIn;
      if (url) {
        setInviteUrl(url); setInviteExpiresIn(expires);
        showToast("success", res?.data?.message || "Invite generated!");
      } else {
        const msg = res?.data?.message || "Failed to generate invite";
        setInviteError(msg); showToast("error", msg);
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Something went wrong";
      setInviteError(msg); showToast("error", msg);
    } finally { setInviteLoading(false); }
  };

  const handleKick = async (username) => {
    setKickLoading(username); setKickError("");
    try {
      const res = await API.post(`/api/v1/seasons/${slug}/team/kick`, { username });
      if (res?.success || res?.data?.success) {
        setTeam((prev) => ({ ...prev, members: prev.members.filter((m) => (typeof m === "string" ? m : m.username) !== username) }));
        showToast("success", res?.data?.message || "Member removed");
      } else {
        const msg = res?.data?.message || "Failed to kick member";
        setKickError(msg); showToast("error", msg);
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Something went wrong";
      setKickError(msg); showToast("error", msg);
    } finally { setKickLoading(""); }
  };

  const handleLeave = async () => {
    setLeaveLoading(true); setLeaveError("");
    try {
      const res = await API.post(`/api/v1/seasons/${slug}/team/leave`, {});
      if (res?.success || res?.data?.success) {
        showToast("success", res?.data?.message || "You left the team");
        setTeam(null); setIsOwner(false); setCurrentUser(null); setConfirmLeave(false);
      } else {
        const msg = res?.data?.message || "Failed to leave team";
        setLeaveError(msg); showToast("error", msg);
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Something went wrong";
      setLeaveError(msg); showToast("error", msg);
    } finally { setLeaveLoading(false); }
  };

  const handleLock = async () => {
    setLockLoading(true); setLockError("");
    try {
      const res = await API.post(`/api/v1/seasons/${slug}/team/lock`, {});
      if (res?.success || res?.data?.success) {
        setTeam((prev) => ({ ...prev, isLocked: true }));
        showToast("success", res?.data?.message || "Team locked");
        if (res?.data?.redirect) router.push(res.data.redirect);
      } else {
        const msg = res?.data?.message || "Failed to lock team";
        setLockError(msg); showToast("error", msg);
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Something went wrong";
      setLockError(msg); showToast("error", msg);
    } finally { setLockLoading(false); }
  };

  /* ── Loading screen ── */
  if (checking) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: T.bg }}
      >
        <BoxLoader />
        <p
          style={{
            fontSize: 10,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(254,252,232,0.2)",
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          Checking status
        </p>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════
     VIEW A — No team yet
  ══════════════════════════════════════════════════════════ */
  if (!team) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ background: T.bg, color: T.cream, fontFamily: "'Outfit', sans-serif" }}
      >
        {/* ── Hero header ── */}
        <header className="px-10 pt-10 pb-10" style={{ borderBottom: `1px solid ${T.border}` }}>
          {/* breadcrumb */}
          <p
            className="mb-8"
            style={{
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(254,252,232,0.3)",
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            {slug} / Team Setup
          </p>

          {/* Main heading — Bebas only here */}
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(50px, 6vw, 80px)",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              color: T.cream,
              marginBottom: "1.2rem",
            }}
          >
            Build your
            <br />
            <span style={{ color: "rgba(254,252,232,0.35)" }}>Squad.</span>
          </h1>

          <p
            style={{
              fontSize: 14,
              maxWidth: 380,
              lineHeight: 1.7,
              color: "rgba(254,252,232,0.38)",
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            Create a team and lead the charge, or join an existing one with an invite token.
          </p>
        </header>

        {/* ── Two panels ── */}
        <div className="flex-1 flex flex-col lg:flex-row">

          {/* LEFT — Create */}
          <div className="flex-1 px-10 py-12" style={{ borderRight: `1px solid ${T.border}` }}>
            <p
              style={{
                fontSize: 10,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "rgba(254,252,232,0.18)",
                marginBottom: 6,
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              01
            </p>
            <h2
              style={{
                fontFamily: "'Roundo', sans-serif",
                fontSize: 22,
                fontWeight: 700,
                color: T.cream,
                marginBottom: 6,
              }}
            >
              Create a Team
            </h2>
            <p
              style={{
                fontSize: 13,
                color: "rgba(254,252,232,0.35)",
                maxWidth: 300,
                lineHeight: 1.65,
                marginBottom: 32,
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              You'll be the owner. Invite others, manage members, and lock the roster when ready.
            </p>

            <div className="space-y-3 mb-10">
              {[
                { icon: RiLink, text: "Generate invite links instantly" },
                { icon: RiUserUnfollowLine, text: "Remove members anytime" },
                { icon: RiShieldLine, text: "Appear on the leaderboard" },
              ].map((f) => <FeatureLine key={f.text} {...f} />)}
            </div>

            <form onSubmit={handleCreate} className="max-w-sm space-y-3">
              <Field
                label="Team Name"
                placeholder="e.g. ByteBandits"
                value={createName}
                maxLength={32}
                onChange={(e) => { setCreateName(e.target.value); if (createError) setCreateError(""); }}
                error={createError}
                hint={`${createName.length}/32`}
              />
              <PrimaryBtn loading={createLoading} disabled={!createName.trim()}>
                <span>Create Team</span>
                <RiArrowRightLine style={{ width: 15, height: 15 }} />
              </PrimaryBtn>
            </form>
          </div>

          {/* RIGHT — Join */}
          <div className="flex-1 px-10 py-12">
            <p
              style={{
                fontSize: 10,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "rgba(254,252,232,0.18)",
                marginBottom: 6,
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              02
            </p>
            <h2
              style={{
                fontFamily: "'Roundo', sans-serif",
                fontSize: 22,
                fontWeight: 700,
                color: T.cream,
                marginBottom: 6,
              }}
            >
              Join a Team
            </h2>
            <p
              style={{
                fontSize: 13,
                color: "rgba(254,252,232,0.35)",
                maxWidth: 300,
                lineHeight: 1.65,
                marginBottom: 32,
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              Got an invite token? Paste it below. Tokens are single-use and expire automatically.
            </p>

            <div className="space-y-3 mb-10">
              {[
                { icon: RiTimeLine, text: "Tokens expire after a short time" },
                { icon: RiShieldLine, text: "Each token is unique and secure" },
                { icon: RiGroupLine, text: "Join instantly — no approval needed" },
              ].map((f) => <FeatureLine key={f.text} {...f} />)}
            </div>

            <form onSubmit={handleJoin} className="max-w-sm space-y-3">
              <Field
                label="Invite Token"
                placeholder="Paste token here…"
                value={inviteToken}
                mono
                onChange={(e) => { setInviteToken(e.target.value); if (joinError) setJoinError(""); }}
                error={joinError}
                hint="Single-use · expires automatically"
              />
              <PrimaryBtn loading={joinLoading} disabled={!inviteToken.trim()}>
                <span>Join Team</span>
                <RiArrowRightLine style={{ width: 15, height: 15 }} />
              </PrimaryBtn>
            </form>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer
          className="px-10 py-4 flex items-center justify-between"
          style={{ borderTop: `1px solid rgba(254,252,232,0.07)` }}
        >
          <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(254,252,232,0.18)", fontFamily: "'Outfit', sans-serif" }}>
            {slug} — Team Setup
          </span>
          <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(254,252,232,0.18)", fontFamily: "'Outfit', sans-serif" }}>
            © 2025 gopwnit
          </span>
        </footer>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════
     VIEW B — Has a team
  ══════════════════════════════════════════════════════════ */
  const memberList = team.members || [];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: T.bg, color: T.cream, fontFamily: "'Outfit', sans-serif" }}
    >
      {/* ── Top bar ── */}
      <header
        className="px-8 py-5 flex items-center justify-between gap-6 flex-wrap"
        style={{ borderBottom: `1px solid ${T.border}` }}
      >
        {/* Team identity */}
        <div className="flex items-center gap-4">
          {/* Large avatar */}
          <div
            className="w-11 h-11 flex items-center justify-center font-black text-lg shrink-0"
            style={{ background: T.cream, color: "#000", fontFamily: "'Roundo', sans-serif" }}
          >
            {team.name[0]}
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1
                style={{
                  fontFamily: "'Roundo', sans-serif",
                  fontSize: 20,
                  fontWeight: 800,
                  color: T.cream,
                  lineHeight: 1,
                }}
              >
                {team.name}
              </h1>
              {team.isLocked && <Chip>Locked</Chip>}
              {isOwner && <Chip>Owner</Chip>}
            </div>
            <p style={{ fontSize: 11, color: "rgba(254,252,232,0.25)", marginTop: 4, fontFamily: "'Outfit', sans-serif" }}>
              {memberList.length} member{memberList.length !== 1 ? "s" : ""} · {slug}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isOwner && !team.isLocked && (
            <GhostBtn onClick={handleInvite} disabled={inviteLoading}>
              {inviteLoading ? <Spinner size={13} /> : <RiAddLine style={{ width: 14, height: 14 }} />}
              Invite
            </GhostBtn>
          )}
          <button
            onClick={() => router.push(`/seasons/${slug}/challenges`)}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold tracking-wide transition-all"
            style={{ background: T.cream, color: "#000", fontFamily: "'Outfit', sans-serif", letterSpacing: "0.08em" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(254,252,232,0.85)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = T.cream)}
          >
            Challenges
            <RiArrowRightSLine style={{ width: 15, height: 15 }} />
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex-1 flex flex-col lg:flex-row">

        {/* Members list */}
        <div className="flex-1 lg:flex-[2]" style={{ borderRight: `1px solid ${T.border}` }}>
          {/* Section label */}
          <div
            className="px-8 py-4 flex items-center gap-2.5"
            style={{ borderBottom: `1px solid ${T.border}` }}
          >
            <span
              style={{
                fontSize: 10,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(254,252,232,0.22)",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              Members
            </span>
            <span style={{ fontSize: 10, color: "rgba(254,252,232,0.18)", fontFamily: "'Outfit', sans-serif" }}>
              {memberList.length}
            </span>
          </div>

          {/* Rows */}
          {memberList.map((member, idx) => {
            const memberName = typeof member === "string" ? member : member.username;
            const isOwnerMember = idx === 0;
            const isMe = memberName === currentUser;
            return (
              <div
                key={memberName}
                className="flex items-center justify-between px-8 py-4 group transition-colors"
                style={{ borderBottom: `1px solid rgba(254,252,232,0.05)` }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(254,252,232,0.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div className="flex items-center gap-3.5">
                  <Avatar name={memberName} isOwner={isOwnerMember} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 13, fontWeight: 600, color: T.cream, fontFamily: "'Outfit', sans-serif" }}>
                        {memberName}
                      </span>
                      {isMe && (
                        <span style={{ fontSize: 10, color: "rgba(254,252,232,0.2)", fontFamily: "'Outfit', sans-serif" }}>
                          you
                        </span>
                      )}
                    </div>
                    <span
                      style={{
                        fontSize: 9,
                        textTransform: "uppercase",
                        letterSpacing: "0.15em",
                        color: "rgba(254,252,232,0.22)",
                        fontFamily: "'Outfit', sans-serif",
                      }}
                    >
                      {isOwnerMember ? "Owner" : "Member"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isOwnerMember && (
                    <RiVipCrownLine style={{ width: 13, height: 13, color: "rgba(254,252,232,0.18)" }} />
                  )}
                  {isOwner && !isOwnerMember && (
                    <button
                      onClick={() => handleKick(memberName)}
                      disabled={kickLoading === memberName}
                      className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 text-xs text-red-600 hover:text-red-400 transition-all"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      {kickLoading === memberName
                        ? <Spinner size={12} />
                        : <RiUserUnfollowLine style={{ width: 13, height: 13 }} />}
                      Kick
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {kickError && (
            <p className="text-xs text-red-500 px-8 py-3" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {kickError}
            </p>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="lg:w-72 xl:w-80 flex flex-col divide-y" style={{ borderColor: T.border }}>

          {/* Invite URL block */}
          {isOwner && !team.isLocked && (
            <div className="px-7 py-6">
              <div className="flex items-center gap-2 mb-4">
                <RiFlashlightLine style={{ width: 13, height: 13, color: "rgba(254,252,232,0.25)" }} />
                <p
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(254,252,232,0.25)",
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  Invite Link
                </p>
                {inviteUrl && inviteExpiresIn && (
                  <span
                    className="ml-auto"
                    style={{ fontSize: 10, color: "rgba(254,252,232,0.18)", fontFamily: "'Outfit', sans-serif" }}
                  >
                    exp. {inviteExpiresIn}
                  </span>
                )}
              </div>

              {inviteUrl ? (
                <div
                  className="flex items-center gap-0"
                  style={{ border: `1px solid ${T.border}` }}
                >
                  <code
                    className="flex-1 text-[10px] font-mono px-3 py-2.5 truncate"
                    style={{ color: "rgba(254,252,232,0.38)", background: "rgba(254,252,232,0.02)" }}
                  >
                    {inviteUrl}
                  </code>
                  <button
                    onClick={() => copyToClipboard(inviteUrl)}
                    className="px-3 py-2.5 transition-all shrink-0"
                    style={{
                      color: copied ? "#22c55e" : "rgba(254,252,232,0.28)",
                      borderLeft: `1px solid ${T.border}`,
                    }}
                  >
                    {copied
                      ? <RiCheckLine style={{ width: 14, height: 14 }} />
                      : <RiFileCopyLine style={{ width: 14, height: 14 }} />}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleInvite}
                  disabled={inviteLoading}
                  className="flex items-center gap-2 text-xs transition-all disabled:opacity-40"
                  style={{
                    color: "rgba(254,252,232,0.35)",
                    fontFamily: "'Outfit', sans-serif",
                    letterSpacing: "0.06em",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = T.cream)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(254,252,232,0.35)")}
                >
                  {inviteLoading ? <Spinner size={13} /> : <RiAddLine style={{ width: 14, height: 14 }} />}
                  Generate invite link
                </button>
              )}

              {inviteError && (
                <p className="text-xs text-red-500 mt-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {inviteError}
                </p>
              )}
            </div>
          )}

          {/* Team info */}
          <div className="px-7 py-6">
            <div className="flex items-center justify-between mb-5">
              <p
                style={{
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(254,252,232,0.22)",
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                Team Info
              </p>
              {isOwner && !team.isLocked && (
                <button
                  onClick={handleLock}
                  disabled={lockLoading}
                  className="flex items-center gap-1.5 text-xs transition-all disabled:opacity-40"
                  style={{ color: "rgba(254,252,232,0.28)", fontFamily: "'Outfit', sans-serif" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = T.cream)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(254,252,232,0.28)")}
                >
                  {lockLoading ? <Spinner size={12} /> : <RiLockLine style={{ width: 13, height: 13 }} />}
                  Lock Team
                </button>
              )}
            </div>

            <div className="space-y-3.5">
              {[
                { label: "Season", value: slug },
                { label: "Members", value: memberList.length },
                { label: "Status", value: team.isLocked ? "Locked" : "Open" },
                { label: "Your Role", value: isOwner ? "Owner" : "Member" },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-center">
                  <span style={{ fontSize: 12, color: "rgba(254,252,232,0.25)", fontFamily: "'Outfit', sans-serif" }}>
                    {row.label}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(254,252,232,0.65)", fontFamily: "'Outfit', sans-serif" }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
            {lockError && (
              <p className="text-xs text-red-500 mt-3" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {lockError}
              </p>
            )}
          </div>

          {/* Danger zone — leave team */}
          {!isOwner && (
            <div className="px-7 py-6">
              <p
                style={{
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(254,252,232,0.13)",
                  marginBottom: 16,
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                Danger Zone
              </p>
              {!confirmLeave ? (
                <button
                  onClick={() => setConfirmLeave(true)}
                  className="flex items-center gap-2 text-xs text-red-700 hover:text-red-400 transition-all"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  <RiLogoutBoxLine style={{ width: 13, height: 13 }} />
                  Leave Team
                </button>
              ) : (
                <div className="space-y-4">
                  <p style={{ fontSize: 13, color: "rgba(254,252,232,0.45)", fontFamily: "'Outfit', sans-serif", lineHeight: 1.5 }}>
                    Leave{" "}
                    <span style={{ color: T.cream, fontWeight: 700 }}>{team.name}</span>?
                  </p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleLeave}
                      disabled={leaveLoading}
                      className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-300 transition-all disabled:opacity-40"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      {leaveLoading ? <Spinner size={12} /> : <RiLogoutBoxLine style={{ width: 13, height: 13 }} />}
                      Yes, Leave
                    </button>
                    <button
                      onClick={() => setConfirmLeave(false)}
                      className="text-xs transition-all"
                      style={{ color: "rgba(254,252,232,0.22)", fontFamily: "'Outfit', sans-serif" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(254,252,232,0.5)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(254,252,232,0.22)")}
                    >
                      Cancel
                    </button>
                  </div>
                  {leaveError && (
                    <p className="text-xs text-red-500" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      {leaveError}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer
        className="px-8 py-4 flex items-center justify-between"
        style={{ borderTop: `1px solid rgba(254,252,232,0.06)` }}
      >
        <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(254,252,232,0.13)", fontFamily: "'Outfit', sans-serif" }}>
          {slug} — Team
        </span>
        <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(254,252,232,0.13)", fontFamily: "'Outfit', sans-serif" }}>
          © 2025 gopwnit
        </span>
      </footer>
    </div>
  );
};

export default withAuth(TeamSetup);