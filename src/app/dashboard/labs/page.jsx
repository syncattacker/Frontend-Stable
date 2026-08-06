"use client";

// ─── Imports · Theme · Fonts · DIFF · TiltCard ─────────────────────────────
// Player-facing page for the non-season global CTF ("Labs"). Same visual
// language and instance-launch UX as
// dashboard/seasons/[slug]/challenges/page.jsx, but considerably simpler:
// this collection has no team system, no hints, no first-blood/solve-count
// tracking, and no season scoping — every field that doesn't exist on
// models/challenge.model.js's player view (toPlayerView() in
// controllers/challenge.controller.js) is simply not rendered here.

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  IconX,
  IconCircleCheck,
  IconArrowLeft,
  IconFlag,
  IconChevronRight,
  IconTag,
  IconLoader2,
  IconPlayerPlay,
  IconPlayerStop,
  IconExternalLink,
  IconClock,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { showToast } from "@/utils/toast.jsx";
import API from "@/utils/axios";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { withAuth } from "@/utils/withAuth";
import { useSocket } from "@/sockets/SocketProvider";

const T = {
  bg: "#0A0A0A",
  cream: "#fefce8",
  muted: "#a1a1aa",
  border: "rgba(254,252,232,0.1)",
  borderHover: "rgba(254,252,232,0.22)",
};

if (typeof document !== "undefined" && !document.getElementById("ctf-fonts")) {
  const l = document.createElement("link");
  l.id = "ctf-fonts";
  l.rel = "stylesheet";
  l.href =
    "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap";
  document.head.appendChild(l);

  const s = document.createElement("style");
  s.id = "ctf-styles";
  s.textContent = `
    .ctf-bebas  { font-family:'Bebas Neue',sans-serif; letter-spacing:-0.03em; }
    .ctf-roundo { font-family:'DM Sans',sans-serif; }
    .ctf-body   { font-family:'Outfit',sans-serif; }
    .ctf-mono   { font-family:'Outfit',monospace; }
    .ctf-scroll { scrollbar-width:none; }
    .ctf-scroll::-webkit-scrollbar { display:none; }
    .ctf-prose p  { margin:0; }
    .ctf-prose ul { padding-left:1rem; }
    .ctf-prose code { font-size:11px; background:rgba(254,252,232,0.06); padding:1px 5px; }
  `;
  document.head.appendChild(s);
}

const DIFF = {
  easy: {
    label: "Easy",
    tw: "text-emerald-400 bg-emerald-400/10 border-emerald-400/25",
  },
  medium: {
    label: "Medium",
    tw: "text-amber-400  bg-amber-400/10  border-amber-400/25",
  },
  hard: {
    label: "Hard",
    tw: "text-red-400    bg-red-400/10    border-red-400/25",
  },
  default: {
    label: "Unknown",
    tw: "text-zinc-500   bg-zinc-700/10   border-zinc-700/20",
  },
};
const getDiff = (d) => DIFF[(d || "").toLowerCase()] || DIFF.default;

// ─── TILT CARD ────────────────────────────────────────────────────────────
const TiltCard = ({ children, className, onClick }) => {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-60, 60], [5, -5]), {
    stiffness: 300,
    damping: 28,
  });
  const ry = useSpring(useTransform(mx, [-60, 60], [-5, 5]), {
    stiffness: 300,
    damping: 28,
  });

  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set(e.clientX - r.left - r.width / 2);
    my.set(e.clientY - r.top - r.height / 2);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileTap={{ scale: 0.985 }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─── LIVE COUNTDOWN ─────────────────────────────────────────────────────────
const InstanceCountdown = ({ expiresAt }) => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diffMs = new Date(expiresAt).getTime() - now;
  if (diffMs <= 0) return <span>Expiring…</span>;
  const mins = Math.floor(diffMs / 60000);
  const secs = Math.floor((diffMs % 60000) / 1000);
  return (
    <span>
      {mins}m {secs.toString().padStart(2, "0")}s left
    </span>
  );
};

// Same pairing with the backend's estimatedReadySeconds
// (controllers/challenge.instance.controller.js) as Season's identical
// component — see that file's comment for why this exists instead of an
// indefinite spinner.
const ProvisioningElapsed = ({ launchedAt, estimatedSeconds }) => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const elapsedSec = Math.max(
    0,
    Math.floor((now - new Date(launchedAt).getTime()) / 1000),
  );
  const estimate = estimatedSeconds || 30;
  const runningLate = elapsedSec > estimate;
  return (
    <span>
      {elapsedSec}s elapsed
      {runningLate
        ? " — taking longer than usual, still working on it"
        : ` (usually ready in ~${estimate}s)`}
    </span>
  );
};

// ─── PAGE ───────────────────────────────────────────────────────────────────

export default withAuth(function Labs() {
  const router = useRouter();

  const [challenges, setChallenges] = useState([]);
  const [solvedChallenges, setSolvedChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [flagInput, setFlagInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const { socket } = useSocket();

  // Ephemeral per-challenge instances, keyed by challengeSlug — same shape
  // as the Season page's instances map.
  const [instances, setInstances] = useState({});
  const [instanceActionSlug, setInstanceActionSlug] = useState(null);
  const instancesRef = useRef(instances);
  useEffect(() => {
    instancesRef.current = instances;
  }, [instances]);

  const groupedChallenges = useMemo(() => {
    const map = challenges.reduce((acc, c) => {
      (acc[c.category] = acc[c.category] || []).push(c);
      return acc;
    }, {});
    return Object.entries(map).map(([category, challenges]) => ({
      category,
      challenges,
    }));
  }, [challenges]);

  useEffect(() => {
    const update = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const fetchSolved = useCallback(async (signal) => {
    try {
      const r = await API.get("/api/v1/ctf/solved", {
        withCredentials: true,
        signal,
      });
      setSolvedChallenges(r.data?.data?.solvedChallenges || []);
    } catch (err) {
      if (err.name === "CanceledError") return;
      // 404 = no CTF profile yet for this user — treat as "nothing solved"
      // rather than surfacing an error for what's a normal new-player state.
      setSolvedChallenges([]);
    }
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const [res] = await Promise.all([
          API.get("/api/v1/ctf/", {
            withCredentials: true,
            signal: ctrl.signal,
          }),
          fetchSolved(ctrl.signal),
        ]);
        setChallenges(res.data?.data?.challenges || []);
      } catch (err) {
        if (err.name === "CanceledError") return;
        const msg = err.response?.data?.detail || "Failed to load challenges.";
        setError(msg);
        showToast("error", msg);
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, [fetchSolved]);

  const total = groupedChallenges.reduce((t, g) => t + g.challenges.length, 0);
  const solved = groupedChallenges.reduce(
    (t, g) =>
      t + g.challenges.filter((c) => solvedChallenges.includes(c.slug)).length,
    0,
  );
  const pct = total > 0 ? Math.round((solved / total) * 100) : 0;

  useEffect(() => {
    if (total > 0 && solved === total && !showConfetti) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, solved]);

  const handleSelect = useCallback(
    (ch) => {
      if (solvedChallenges.includes(ch.slug)) {
        showToast("info", "Already solved!");
        return;
      }
      setSelectedChallenge(ch);
      setFlagInput("");
    },
    [solvedChallenges],
  );

  const submitFlag = useCallback(async () => {
    if (!selectedChallenge || !flagInput.trim() || submitting) return;
    setSubmitting(true);
    try {
      const r = await API.post(
        "/api/v1/ctf/submit/flag",
        { slug: selectedChallenge.slug, flag: flagInput.trim() },
        { withCredentials: true },
      );
      showToast(
        "success",
        typeof r.data?.data?.totalPoints === "number"
          ? `Flag correct! Total: ${r.data.data.totalPoints} pts`
          : "Flag correct! Challenge solved!",
      );
      const next = [...solvedChallenges, selectedChallenge.slug];
      setSolvedChallenges(next);
      if (next.length === total && total > 0) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
      setFlagInput("");
      setSelectedChallenge(null);
    } catch (err) {
      showToast("error", err.response?.data?.detail || "Wrong flag!");
    } finally {
      setSubmitting(false);
    }
  }, [selectedChallenge, flagInput, submitting, solvedChallenges, total]);

  const fetchMyInstance = useCallback(async (challengeSlug) => {
    try {
      const r = await API.get(`/api/v1/ctf/${challengeSlug}/instance/mine`, {
        withCredentials: true,
      });
      setInstances((prev) => ({
        ...prev,
        [challengeSlug]: r.data?.data?.instance || null,
      }));
    } catch {
      // non-fatal — instance panel just won't populate until retried
    }
  }, []);

  // Same fallback-poller reasoning as the Season page's pollInstanceUntil —
  // socket events cover the common case, this is what keeps the UI honest
  // if one's ever missed, and specifically for destroy, avoids re-enabling
  // Launch before the old instance is genuinely gone.
  const pollInstanceUntil = useCallback(
    async (challengeSlug, isDone, { intervalMs = 2000, maxAttempts = 40 } = {}) => {
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        await new Promise((resolve) => setTimeout(resolve, intervalMs));
        let current;
        try {
          const r = await API.get(`/api/v1/ctf/${challengeSlug}/instance/mine`, {
            withCredentials: true,
          });
          current = r.data?.data?.instance || null;
        } catch {
          continue;
        }
        setInstances((prev) => ({ ...prev, [challengeSlug]: current }));
        if (isDone(current)) return current;
      }
      return undefined;
    },
    [],
  );

  const handleLaunchInstance = useCallback(
    async (challengeSlug) => {
      if (instanceActionSlug) return;
      setInstanceActionSlug(challengeSlug);
      try {
        const r = await API.post(
          `/api/v1/ctf/${challengeSlug}/instance/launch`,
          {},
          { withCredentials: true },
        );
        setInstances((prev) => ({ ...prev, [challengeSlug]: r.data.data }));
        if (r.data.data?.status === "pending") {
          await pollInstanceUntil(
            challengeSlug,
            (inst) => !inst || inst.status !== "pending",
          );
        }
      } catch (err) {
        showToast(
          "error",
          err.response?.data?.detail || "Failed to launch instance",
        );
      } finally {
        setInstanceActionSlug(null);
      }
    },
    [instanceActionSlug, pollInstanceUntil],
  );

  const handleDestroyInstance = useCallback(
    async (challengeSlug) => {
      if (instanceActionSlug) return;
      setInstanceActionSlug(challengeSlug);
      try {
        await API.post(
          `/api/v1/ctf/${challengeSlug}/instance/destroy`,
          {},
          { withCredentials: true },
        );
        await pollInstanceUntil(challengeSlug, (inst) =>
          !inst ||
          ["destroyed", "expired", "crashed", "failed"].includes(inst.status),
        );
      } catch (err) {
        showToast(
          "error",
          err.response?.data?.detail || "Failed to destroy instance",
        );
      } finally {
        setInstanceActionSlug(null);
      }
    },
    [instanceActionSlug, pollInstanceUntil],
  );

  useEffect(() => {
    if (!selectedChallenge?.instancingEnabled) return;
    fetchMyInstance(selectedChallenge.slug);
  }, [selectedChallenge, fetchMyInstance]);

  // Instance lifecycle events arrive on the user's own room (user:<username>,
  // already auto-joined on socket connect — see server.js), same as Season's
  // equivalent effect, just without a joinSeason room to also manage here.
  useEffect(() => {
    if (!socket) return;
    const handleInstanceEvent = (payload) => {
      const entry = Object.entries(instancesRef.current).find(
        ([, inst]) => inst?.instanceId === payload?.instanceId,
      );
      if (!entry) return;
      fetchMyInstance(entry[0]);
    };
    socket.on("instanceReady", handleInstanceEvent);
    socket.on("instanceExpiring", handleInstanceEvent);
    socket.on("instanceExpired", handleInstanceEvent);
    return () => {
      socket.off("instanceReady", handleInstanceEvent);
      socket.off("instanceExpiring", handleInstanceEvent);
      socket.off("instanceExpired", handleInstanceEvent);
    };
  }, [socket, fetchMyInstance]);

  return (
    <div
      className="ctf-body relative min-h-screen"
      style={{ background: T.bg, color: T.cream }}
    >
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          opacity: 0.025,
          backgroundImage: `linear-gradient(${T.cream} 1px,transparent 1px),linear-gradient(90deg,${T.cream} 1px,transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={380}
          recycle={false}
          gravity={0.28}
          colors={["#fefce8", "#fef9c3", "#fde68a", "#fbbf24", "#ffffff", "#a1a1aa"]}
          style={{ position: "fixed", top: 0, left: 0, zIndex: 9999, pointerEvents: "none" }}
        />
      )}

      <div className="relative z-10 border-b" style={{ borderColor: T.border }}>
        <div
          className="absolute inset-0 bg-linear-to-b"
          style={{ background: `linear-gradient(to bottom, ${T.bg}cc, ${T.bg})` }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 pt-10 pb-12">
          <div className="flex items-center justify-between mb-12">
            <motion.button
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 }}
              onClick={() => router.push("/dashboard")}
              className="ctf-roundo flex items-center gap-2 px-4 py-2 text-[12px] font-semibold transition-all"
              style={{
                border: `1px solid ${T.border}`,
                background: "rgba(254,252,232,0.03)",
                color: T.muted,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = T.borderHover;
                e.currentTarget.style.color = T.cream;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = T.border;
                e.currentTarget.style.color = T.muted;
              }}
            >
              <IconArrowLeft size={13} /> Dashboard
            </motion.button>
          </div>

          <motion.h1
            className="ctf-bebas text-center"
            style={{
              fontSize: "clamp(52px,10vw,96px)",
              color: T.cream,
              lineHeight: 0.9,
              marginBottom: 16,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            Labs
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.38 }}
            className="ctf-body text-center text-[13px] max-w-md mx-auto leading-relaxed mb-8"
            style={{ color: T.muted }}
          >
            Practice challenges, always open — no season, no schedule.
          </motion.p>

          {total > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.44 }}
              className="max-w-sm mx-auto"
            >
              <div className="flex justify-between mb-2">
                <span className="ctf-roundo text-[11px] font-semibold" style={{ color: T.muted }}>
                  {solved}/{total} solved
                </span>
                <span
                  className="ctf-roundo text-[11px] font-bold"
                  style={{ color: T.cream, opacity: 0.65 }}
                >
                  {pct}%
                </span>
              </div>
              <div className="h-px overflow-hidden" style={{ background: "rgba(254,252,232,0.08)" }}>
                <motion.div
                  className="h-full"
                  style={{ background: T.cream, opacity: 0.7 }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ delay: 0.62, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── CHALLENGES GRID ─────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-16">
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
        >
          <div className="w-px h-5" style={{ background: "rgba(254,252,232,0.2)" }} />
          <h2
            className="ctf-roundo text-[13px] font-bold uppercase tracking-[0.12em]"
            style={{ color: "rgba(254,252,232,0.45)" }}
          >
            All Challenges
          </h2>
          {total > 0 && (
            <span className="ctf-roundo ml-auto text-[11px] font-bold tabular-nums" style={{ color: T.muted }}>
              {solved}/{total}
            </span>
          )}
        </motion.div>

        {loading && (
          <div className="flex flex-col items-center gap-4 py-32">
            <IconLoader2 size={20} style={{ color: "rgba(254,252,232,0.25)" }} className="animate-spin" />
            <p className="ctf-body text-[12px]" style={{ color: T.muted }}>
              Loading challenges…
            </p>
          </div>
        )}

        {!loading && !error && groupedChallenges.length === 0 && (
          <div className="text-center py-32">
            <p className="ctf-roundo text-[14px] font-semibold mb-2" style={{ color: "rgba(254,252,232,0.5)" }}>
              No challenges available yet
            </p>
            <p className="ctf-body text-[12px]" style={{ color: T.muted }}>
              Check back soon.
            </p>
          </div>
        )}

        {!loading && !error && groupedChallenges.length > 0 && (
          <div className="space-y-10">
            {groupedChallenges.map((group, gi) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.07 * gi, duration: 0.45 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="flex items-center gap-2 px-3 py-1.5"
                    style={{ border: `1px solid ${T.border}`, background: "rgba(254,252,232,0.02)" }}
                  >
                    <IconTag size={11} style={{ color: "rgba(254,252,232,0.3)" }} />
                    <span className="ctf-roundo text-[12px] font-semibold" style={{ color: "rgba(254,252,232,0.6)" }}>
                      {group.category}
                    </span>
                    <span className="ctf-roundo text-[10px]" style={{ color: T.muted }}>
                      {group.challenges.length}
                    </span>
                  </div>
                  <div className="flex-1 h-px" style={{ background: "rgba(254,252,232,0.05)" }} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {group.challenges.map((ch, ci) => {
                    const isSolved = solvedChallenges.includes(ch.slug);
                    const diff = getDiff(ch.difficulty);
                    return (
                      <motion.div
                        key={ch.slug}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.04 * ci + 0.05 * gi }}
                      >
                        <TiltCard
                          onClick={() => handleSelect(ch)}
                          className="relative h-full cursor-pointer group"
                        >
                          <div
                            className="relative h-full flex flex-col p-5 transition-all duration-200"
                            style={{
                              background: isSolved ? "rgba(52,211,153,0.04)" : "rgba(254,252,232,0.02)",
                              border: `1px solid ${isSolved ? "rgba(52,211,153,0.18)" : T.border}`,
                            }}
                            onMouseEnter={(e) => {
                              if (!isSolved) e.currentTarget.style.borderColor = T.borderHover;
                            }}
                            onMouseLeave={(e) => {
                              if (!isSolved) e.currentTarget.style.borderColor = T.border;
                            }}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`ctf-roundo px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide border ${diff.tw}`}>
                                  {diff.label}
                                </span>
                                <span
                                  className="ctf-roundo px-2 py-0.5 text-[10px] uppercase tracking-wide"
                                  style={{ border: `1px solid ${T.border}`, color: "rgba(254,252,232,0.35)" }}
                                >
                                  {ch.category}
                                </span>
                              </div>
                              {isSolved ? (
                                <IconCircleCheck size={15} className="text-emerald-400 flex-shrink-0" />
                              ) : (
                                <IconChevronRight
                                  size={13}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                  style={{ color: "rgba(254,252,232,0.3)" }}
                                />
                              )}
                            </div>

                            <h3
                              className="ctf-roundo text-[14px] font-bold mb-1 leading-snug transition-colors"
                              style={{ color: isSolved ? "rgba(52,211,153,0.8)" : T.cream }}
                            >
                              {ch.name}
                            </h3>

                            <p
                              className="ctf-body text-[10px] mb-3 uppercase tracking-[0.12em]"
                              style={{ color: "rgba(254,252,232,0.25)" }}
                            >
                              by <span style={{ color: "rgba(254,252,232,0.45)" }}>{ch.creator}</span>
                            </p>

                            <div
                              className="ctf-body ctf-prose text-[11px] leading-relaxed line-clamp-3 flex-1 mb-4"
                              style={{ color: T.muted }}
                            >
                              <ReactMarkdown>{ch.description}</ReactMarkdown>
                            </div>

                            <div className="pt-3 space-y-2.5" style={{ borderTop: "1px solid rgba(254,252,232,0.06)" }}>
                              {ch.tags?.length > 0 && (
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  {ch.tags.slice(0, 3).map((t, i) => (
                                    <span
                                      key={i}
                                      className="ctf-roundo px-2 py-0.5 text-[9px] uppercase tracking-wide"
                                      style={{ border: "1px solid rgba(254,252,232,0.07)", color: T.muted }}
                                    >
                                      {t}
                                    </span>
                                  ))}
                                  {ch.tags.length > 3 && (
                                    <span className="ctf-roundo text-[9px]" style={{ color: "rgba(254,252,232,0.25)" }}>
                                      +{ch.tags.length - 3}
                                    </span>
                                  )}
                                </div>
                              )}
                              <div className="flex items-center justify-between gap-3">
                                <span
                                  className="ctf-roundo text-[15px] font-black tabular-nums"
                                  style={{ color: isSolved ? "rgba(52,211,153,0.65)" : T.cream }}
                                >
                                  {ch.points}
                                  <span className="text-[10px] font-normal ml-1" style={{ color: T.muted }}>
                                    pts
                                  </span>
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelect(ch);
                                  }}
                                  className="ctf-roundo text-[11px] font-bold px-4 py-1.5 transition-all"
                                  style={
                                    isSolved
                                      ? {
                                          border: "1px solid rgba(52,211,153,0.2)",
                                          background: "rgba(52,211,153,0.06)",
                                          color: "rgba(52,211,153,0.7)",
                                          cursor: "default",
                                        }
                                      : {
                                          border: `1px solid ${T.border}`,
                                          background: "rgba(254,252,232,0.04)",
                                          color: "rgba(254,252,232,0.6)",
                                        }
                                  }
                                  onMouseEnter={(e) => {
                                    if (!isSolved) {
                                      e.currentTarget.style.borderColor = T.borderHover;
                                      e.currentTarget.style.color = T.cream;
                                      e.currentTarget.style.background = "rgba(254,252,232,0.08)";
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!isSolved) {
                                      e.currentTarget.style.borderColor = T.border;
                                      e.currentTarget.style.color = "rgba(254,252,232,0.6)";
                                      e.currentTarget.style.background = "rgba(254,252,232,0.04)";
                                    }
                                  }}
                                >
                                  {isSolved ? "✓ Solved" : "Attempt"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </TiltCard>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="relative z-10 py-8 text-center" style={{ borderTop: "1px solid rgba(254,252,232,0.05)" }}>
        <p className="ctf-body text-[11px]" style={{ color: "rgba(254,252,232,0.15)" }}>
          © 2025 gopwnit. All rights reserved.
        </p>
      </div>

      {/* ── CHALLENGE MODAL ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedChallenge &&
          (() => {
            const diff = getDiff(selectedChallenge.difficulty);
            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ background: "rgba(5,5,5,0.88)", backdropFilter: "blur(14px)" }}
                onClick={() => setSelectedChallenge(null)}
              >
                <motion.div
                  initial={{ y: 28, opacity: 0, scale: 0.97 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 28, opacity: 0, scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 300, damping: 26 }}
                  className="ctf-scroll relative max-w-2xl w-full max-h-[88vh] overflow-y-auto"
                  style={{ background: "#111", border: `1px solid ${T.border}`, boxShadow: "0 40px 80px rgba(0,0,0,0.8)" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-7">
                    <div className="flex items-start gap-4 mb-7">
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h2 className="ctf-roundo text-[22px] font-black leading-tight" style={{ color: T.cream }}>
                            {selectedChallenge.name}
                          </h2>
                          <button
                            onClick={() => setSelectedChallenge(null)}
                            className="w-8 h-8 flex-shrink-0 flex items-center justify-center transition-all"
                            style={{
                              border: `1px solid ${T.border}`,
                              background: "rgba(254,252,232,0.03)",
                              color: "rgba(254,252,232,0.4)",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = T.borderHover;
                              e.currentTarget.style.color = T.cream;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = T.border;
                              e.currentTarget.style.color = "rgba(254,252,232,0.4)";
                            }}
                          >
                            <IconX size={13} />
                          </button>
                        </div>

                        <p
                          className="ctf-body text-[11px] mb-3 uppercase tracking-[0.12em]"
                          style={{ color: "rgba(254,252,232,0.25)" }}
                        >
                          crafted by <span style={{ color: "rgba(254,252,232,0.55)" }}>{selectedChallenge.creator}</span>
                        </p>

                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className={`ctf-roundo px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide border ${diff.tw}`}>
                            {diff.label}
                          </span>
                          <span
                            className="ctf-roundo px-2.5 py-0.5 text-[10px] font-bold"
                            style={{
                              border: `1px solid ${T.border}`,
                              background: "rgba(254,252,232,0.04)",
                              color: "rgba(254,252,232,0.6)",
                            }}
                          >
                            {selectedChallenge.points} pts
                          </span>
                          <span
                            className="ctf-roundo px-2.5 py-0.5 text-[10px]"
                            style={{
                              border: "1px solid rgba(254,252,232,0.07)",
                              background: "rgba(254,252,232,0.02)",
                              color: T.muted,
                            }}
                          >
                            {selectedChallenge.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <p
                          className="ctf-roundo text-[10px] font-bold uppercase tracking-[0.14em] mb-3"
                          style={{ color: "rgba(254,252,232,0.25)" }}
                        >
                          Description
                        </p>
                        <div
                          className="ctf-body ctf-prose p-5 text-[13px] leading-relaxed"
                          style={{
                            background: "rgba(254,252,232,0.02)",
                            border: "1px solid rgba(254,252,232,0.07)",
                            color: "rgba(254,252,232,0.7)",
                          }}
                        >
                          <ReactMarkdown>{selectedChallenge.description}</ReactMarkdown>
                        </div>
                      </div>

                      {selectedChallenge.instancingEnabled &&
                        (() => {
                          const inst = instances[selectedChallenge.slug];
                          const acting = instanceActionSlug === selectedChallenge.slug;
                          const isLive = inst && !["expired", "destroyed"].includes(inst.status);
                          return (
                            <div>
                              <p
                                className="ctf-roundo text-[10px] font-bold uppercase tracking-[0.14em] mb-3"
                                style={{ color: "rgba(254,252,232,0.25)" }}
                              >
                                Instance
                              </p>
                              <div
                                className="p-5 space-y-3"
                                style={{ background: "rgba(254,252,232,0.02)", border: "1px solid rgba(254,252,232,0.07)" }}
                              >
                                {!isLive && (
                                  <div className="flex items-center justify-between gap-3">
                                    <p className="ctf-body text-[12px]" style={{ color: T.muted }}>
                                      Launch a private, isolated instance of this challenge
                                      {selectedChallenge.instancingTtlMinutes
                                        ? ` (lasts up to ${selectedChallenge.instancingTtlMinutes} min)`
                                        : ""}
                                      .
                                    </p>
                                    <button
                                      onClick={() => handleLaunchInstance(selectedChallenge.slug)}
                                      disabled={acting}
                                      className="ctf-roundo flex-shrink-0 flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold transition-all disabled:opacity-50"
                                      style={{ background: T.cream, color: T.bg }}
                                    >
                                      {acting ? (
                                        <IconLoader2 size={13} className="animate-spin" />
                                      ) : (
                                        <IconPlayerPlay size={13} />
                                      )}
                                      Launch
                                    </button>
                                  </div>
                                )}

                                {inst?.status === "pending" && (
                                  <div className="flex items-center gap-2">
                                    <IconLoader2 size={14} className="animate-spin" style={{ color: T.muted }} />
                                    <span className="ctf-body text-[12px]" style={{ color: T.muted }}>
                                      Provisioning your instance…{" "}
                                      <ProvisioningElapsed
                                        launchedAt={inst.launchedAt}
                                        estimatedSeconds={inst.estimatedReadySeconds}
                                      />
                                    </span>
                                  </div>
                                )}

                                {inst?.status === "running" && (
                                  <>
                                    <div className="flex items-center justify-between gap-3 flex-wrap">
                                      <a
                                        href={inst.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ctf-mono flex items-center gap-1.5 text-[12px] break-all"
                                        style={{ color: "rgba(52,211,153,0.8)" }}
                                      >
                                        <IconExternalLink size={13} />
                                        {inst.url}
                                      </a>
                                      <button
                                        onClick={() => handleDestroyInstance(selectedChallenge.slug)}
                                        disabled={acting}
                                        className="ctf-roundo flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold transition-all disabled:opacity-50"
                                        style={{
                                          border: "1px solid rgba(239,68,68,0.3)",
                                          background: "rgba(239,68,68,0.06)",
                                          color: "rgba(239,68,68,0.75)",
                                        }}
                                      >
                                        {acting ? (
                                          <IconLoader2 size={13} className="animate-spin" />
                                        ) : (
                                          <IconPlayerStop size={13} />
                                        )}
                                        Destroy
                                      </button>
                                    </div>
                                    <div className="ctf-body flex items-center gap-1.5 text-[11px]" style={{ color: T.muted }}>
                                      <IconClock size={12} />
                                      <InstanceCountdown expiresAt={inst.expiresAt} />
                                    </div>
                                  </>
                                )}

                                {["crashed", "failed"].includes(inst?.status) && (
                                  <div className="space-y-3">
                                    <div
                                      className="flex items-center gap-2 text-[12px]"
                                      style={{ color: "rgba(239,68,68,0.75)" }}
                                    >
                                      <IconAlertTriangle size={14} />
                                      {inst.lastError || "The instance failed to start."}
                                    </div>
                                    <button
                                      onClick={() => handleLaunchInstance(selectedChallenge.slug)}
                                      disabled={acting}
                                      className="ctf-roundo flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold transition-all disabled:opacity-50"
                                      style={{ background: T.cream, color: T.bg }}
                                    >
                                      {acting ? (
                                        <IconLoader2 size={13} className="animate-spin" />
                                      ) : (
                                        <IconPlayerPlay size={13} />
                                      )}
                                      Relaunch
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })()}

                      {selectedChallenge.tags?.length > 0 && (
                        <div>
                          <p
                            className="ctf-roundo text-[10px] font-bold uppercase tracking-[0.14em] mb-3"
                            style={{ color: "rgba(254,252,232,0.25)" }}
                          >
                            Tags
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {selectedChallenge.tags.map((t, i) => (
                              <span
                                key={i}
                                className="ctf-roundo px-2.5 py-0.5 text-[10px]"
                                style={{
                                  border: "1px solid rgba(254,252,232,0.07)",
                                  background: "rgba(254,252,232,0.02)",
                                  color: T.muted,
                                }}
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <p
                          className="ctf-roundo text-[10px] font-bold uppercase tracking-[0.14em] mb-3"
                          style={{ color: "rgba(254,252,232,0.25)" }}
                        >
                          Submit Flag
                        </p>

                        <div
                          className="flex items-center gap-2 px-4 py-2.5 mb-3"
                          style={{ border: "1px solid rgba(254,252,232,0.07)", background: "rgba(254,252,232,0.02)" }}
                        >
                          <IconFlag size={11} style={{ color: "rgba(254,252,232,0.2)", flexShrink: 0 }} />
                          <code className="ctf-mono text-[11px]" style={{ color: "rgba(254,252,232,0.35)" }}>
                            {selectedChallenge.flagFormat || "flag{...}"}
                          </code>
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={flagInput}
                            autoFocus
                            onChange={(e) => setFlagInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && submitFlag()}
                            placeholder="Enter your flag…"
                            className="ctf-body flex-1 px-4 py-2.5 text-[13px] transition-all outline-none"
                            style={{ background: "rgba(254,252,232,0.03)", border: `1px solid ${T.border}`, color: T.cream }}
                            onFocus={(e) => (e.target.style.borderColor = T.borderHover)}
                            onBlur={(e) => (e.target.style.borderColor = T.border)}
                          />
                          <button
                            onClick={submitFlag}
                            disabled={!flagInput.trim() || submitting}
                            className="ctf-roundo px-6 py-2.5 text-[12px] font-bold flex items-center gap-2 transition-all active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{ background: T.cream, color: T.bg }}
                            onMouseEnter={(e) => {
                              if (!submitting && flagInput.trim()) e.currentTarget.style.background = "#fef9c3";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = T.cream;
                            }}
                          >
                            {submitting ? <IconLoader2 size={14} className="animate-spin" /> : "Submit"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })()}
      </AnimatePresence>
    </div>
  );
});
