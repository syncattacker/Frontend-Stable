"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";

const T = {
  bg:     "rgba(10,10,10,0.92)",
  cream:  "#f0ebe0",
  mid:    "#666",
  dim:    "#444",
  border: "rgba(255,255,255,0.08)",
  borderStrong: "rgba(255,255,255,0.13)",
};

const RANK_COLORS = [
  T.cream,
  "rgba(240,235,224,0.62)",
  "rgba(240,235,224,0.40)",
  "rgba(240,235,224,0.26)",
];

const BAR_COLORS = [
  T.cream,
  "rgba(240,235,224,0.52)",
  "rgba(240,235,224,0.34)",
  "rgba(240,235,224,0.20)",
];

const getColor  = (i) => RANK_COLORS[Math.min(i, 3)];
const getBarCol = (i) => BAR_COLORS[Math.min(i, 3)];

function Counter({ value }) {
  const spring  = useSpring(value, { stiffness: 90, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString());
  const [label, setLabel] = useState(value.toLocaleString());
  useEffect(() => {
    spring.set(value);
    return display.on("change", setLabel);
  }, [value]);
  return <>{label}</>;
}

function Delta({ value }) {
  const pos = value > 0;
  return (
    <motion.span
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 0, y: -10 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "absolute", top: -16, left: "50%",
        transform: "translateX(-50%)",
        fontSize: 8, fontWeight: 700,
        fontFamily: "var(--hud-f)",
        color: pos ? "#5db87a" : "#c46060",
        pointerEvents: "none",
        whiteSpace: "nowrap",
        letterSpacing: "0.04em",
      }}
    >
      {pos ? `+${value.toLocaleString()}` : value.toLocaleString()}
    </motion.span>
  );
}

function MemberBlock({ player, rank, delta, maxPts }) {
  const pct = Math.min(Math.max(player.pts / (maxPts || 1), 0), 1);
  const col = getColor(rank);
  const bar = getBarCol(rank);

  return (
    <motion.div
      layout
      layoutId={`hud-${player.id}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "0 16px",
        height: "100%",
      }}
    >
      <span style={{
        fontFamily: "var(--hud-f)",
        fontSize: 8, fontWeight: 500,
        color: T.dim,
        letterSpacing: "0.08em",
        flexShrink: 0,
      }}>
        {String(rank + 1).padStart(2, "0")}
      </span>

      <span style={{
        fontFamily: "var(--hud-f)",
        fontSize: 11, fontWeight: 600,
        color: col,
        textTransform: "uppercase",
        letterSpacing: "0.09em",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: 88,
        flexShrink: 0,
      }}>
        {player.name}
      </span>

      <div style={{
        width: 52, height: 1,
        background: "rgba(255,255,255,0.06)",
        flexShrink: 0,
        overflow: "hidden",
      }}>
        <motion.div
          animate={{ width: `${Math.round(pct * 100)}%` }}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          style={{ height: "100%", background: bar }}
        />
      </div>

      <div style={{ position: "relative", flexShrink: 0 }}>
        <span style={{
          fontFamily: "var(--hud-f)",
          fontSize: 11, fontWeight: 700,
          color: col,
          letterSpacing: "0.02em",
        }}>
          <Counter value={player.pts} />
          <span style={{
            fontSize: 8, fontWeight: 400,
            color: T.mid,
            marginLeft: 3,
            letterSpacing: "0.1em",
          }}>
            PTS
          </span>
        </span>
        <AnimatePresence>
          {delta !== null && (
            <Delta key={`d-${player.id}-${player.pts}`} value={delta} />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function TeamHUD({ members = [], maxPts = 6000, teamName = "Squad" }) {
  const [sorted, setSorted] = useState([]);
  const [deltas, setDeltas] = useState({});
  const prevRef = useRef({});

  useEffect(() => {
    const enriched  = members.map((m) => ({ ...m, _max: maxPts }));
    const newSorted = [...enriched].sort((a, b) => b.pts - a.pts);
    const nd = {};
    newSorted.forEach((p) => {
      const prev = prevRef.current[p.id];
      if (prev !== undefined && prev !== p.pts) nd[p.id] = p.pts - prev;
      prevRef.current[p.id] = p.pts;
    });
    setSorted(newSorted);
    if (Object.keys(nd).length) {
      setDeltas(nd);
      const t = setTimeout(() => setDeltas({}), 1800);
      return () => clearTimeout(t);
    }
  }, [members, maxPts]);

  const totalPts = sorted.reduce((s, p) => s + p.pts, 0);
  if (sorted.length === 0) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        :root { --hud-f: 'JetBrains Mono', ui-monospace, monospace; }
      `}</style>

      <div style={{
        position: "fixed",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9998,
        height: 44,
        display: "flex",
        alignItems: "stretch",
        background: T.bg,
        border: `1px solid ${T.borderStrong}`,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}>

        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 14px",
          borderRight: `1px solid ${T.border}`,
          gap: 2,
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: "var(--hud-f)",
            fontSize: 7, fontWeight: 500,
            color: T.mid,
            textTransform: "uppercase",
            letterSpacing: "0.24em",
            whiteSpace: "nowrap",
          }}>
            {teamName}
          </span>
          <span style={{
            fontFamily: "var(--hud-f)",
            fontSize: 11, fontWeight: 700,
            color: "rgba(240,235,224,0.38)",
            letterSpacing: "0.02em",
          }}>
            <Counter value={totalPts} />
          </span>
        </div>

        <AnimatePresence initial={false}>
          {sorted.map((p, i) => (
            <div key={p.id} style={{ display: "flex", alignItems: "stretch" }}>
              <MemberBlock
                player={p}
                rank={i}
                delta={deltas[p.id] ?? null}
                maxPts={maxPts}
              />
              {i < sorted.length - 1 && (
                <div style={{
                  width: 1,
                  background: T.border,
                  alignSelf: "stretch",
                }} />
              )}
            </div>
          ))}
        </AnimatePresence>

      </div>
    </>
  );
}

export default TeamHUD;