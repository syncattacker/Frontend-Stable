"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";

const T = {
  bg:      "#0f0f0f",
  surface: "#141414",
  cream:   "#f0ebe0",
  mid:     "#888888",
  muted:   "rgba(255,255,255,0.06)",
  border:  "rgba(255,255,255,0.09)",
};

const RANKS = [
  { num: T.cream,                   name: T.cream,                    pts: T.cream,                   bar: T.cream,                      border: "rgba(240,235,224,0.22)", bg: "rgba(240,235,224,0.04)", strip: T.cream },
  { num: "rgba(240,235,224,0.65)",  name: "rgba(240,235,224,0.65)",   pts: "rgba(240,235,224,0.55)",  bar: "rgba(240,235,224,0.55)",      border: T.border,                 bg: "transparent",            strip: "rgba(240,235,224,0.55)" },
  { num: "rgba(240,235,224,0.42)",  name: "rgba(240,235,224,0.42)",   pts: "rgba(240,235,224,0.38)",  bar: "rgba(240,235,224,0.35)",      border: T.border,                 bg: "transparent",            strip: "rgba(240,235,224,0.35)" },
  { num: "rgba(240,235,224,0.24)",  name: "rgba(240,235,224,0.28)",   pts: "rgba(240,235,224,0.22)",  bar: "rgba(240,235,224,0.18)",      border: T.border,                 bg: "transparent",            strip: "rgba(240,235,224,0.18)" },
];

const getR = (i) => RANKS[Math.min(i, 3)];

function Counter({ value }) {
  const spring  = useSpring(value, { stiffness: 80, damping: 18 });
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
      animate={{ opacity: 0, y: -18 }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "absolute", right: 10, top: 4,
        fontSize: 9, fontWeight: 700,
        fontFamily: "var(--hud-mono)",
        color: pos ? "#5db87a" : "#c46060",
        pointerEvents: "none",
      }}
    >
      {pos ? `+${value.toLocaleString()}` : value.toLocaleString()}
    </motion.span>
  );
}

function Card({ player, rank, delta }) {
  const pct = Math.min(Math.max(player.pts / (player._max || 6000), 0), 1);
  const r   = getR(rank);

  return (
    <motion.div
      layout
      layoutId={`card-${player.id}`}
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 4, transition: { duration: 0.12 } }}
      transition={{
        layout:  { type: "spring", stiffness: 400, damping: 40 },
        opacity: { duration: 0.18 },
      }}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "7px 10px",
        borderBottom: `1px solid ${T.muted}`,
        background: r.bg,
        overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", left: 0, top: "18%", bottom: "18%",
        width: 1.5, background: r.strip,
      }} />

      <span style={{
        fontFamily: "var(--hud-mono)",
        fontSize: 9, fontWeight: 700,
        color: r.num,
        width: 12, textAlign: "center", flexShrink: 0,
        letterSpacing: "0.05em",
      }}>
        {rank + 1}
      </span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "var(--hud-mono)",
          fontSize: 10, fontWeight: 600,
          color: r.name,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          marginBottom: 5,
        }}>
          {player.name}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{
            flex: 1, height: 1, borderRadius: 1,
            background: "rgba(255,255,255,0.07)", overflow: "hidden",
          }}>
            <motion.div
              animate={{ width: `${Math.round(pct * 100)}%` }}
              transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
              style={{ height: "100%", background: r.bar }}
            />
          </div>
          <span style={{
            fontFamily: "var(--hud-mono)",
            fontSize: 10, fontWeight: 600,
            color: r.pts,
            minWidth: 34, textAlign: "right",
          }}>
            <Counter value={player.pts} />
          </span>
        </div>
      </div>

      <div style={{ flexShrink: 0, textAlign: "right" }}>
        <div style={{
          fontFamily: "var(--hud-mono)",
          fontSize: 12, fontWeight: 700, lineHeight: 1,
          color: r.pts,
        }}>
          {player.solves}
        </div>
        <div style={{
          fontFamily: "var(--hud-mono)",
          fontSize: 7, letterSpacing: "0.14em",
          textTransform: "uppercase", marginTop: 2,
          color: "rgba(255,255,255,0.18)",
        }}>
          slv
        </div>
      </div>

      <AnimatePresence>
        {delta !== null && (
          <Delta key={`${player.id}-${player.pts}`} value={delta} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function posStyle(p = "top-left") {
  const base = { position: "fixed", zIndex: 9999 };
  if (p === "top-right")    return { ...base, top: 20, right: 20 };
  if (p === "bottom-left")  return { ...base, bottom: 20, left: 20 };
  if (p === "bottom-right") return { ...base, bottom: 20, right: 350 };
  return { ...base, top: 20, left: 20 };
}

export function TeamHUD({
  members  = [],
  maxPts   = 6000,
  position = "top-left",
  teamName = "Squad",
}) {
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;600;700&display=swap');
        :root { --hud-mono: 'JetBrains Mono', ui-monospace, monospace; }
      `}</style>

      <div style={{ ...posStyle(position), width: 240 }}>

        <div style={{
          display: "flex", alignItems: "center", gap: 7,
          padding: "8px 10px",
          background: T.bg,
          border: `1px solid ${T.border}`,
          borderBottom: `1px solid ${T.muted}`,
        }}>
          <span style={{
            flex: 1,
            fontFamily: "var(--hud-mono)",
            fontSize: 8, fontWeight: 700,
            color: T.mid,
            textTransform: "uppercase",
            letterSpacing: "0.22em",
          }}>
            {teamName}
          </span>
          <span style={{
            fontFamily: "var(--hud-mono)",
            fontSize: 8, fontWeight: 600,
            color: "rgba(240,235,224,0.35)",
            letterSpacing: "0.06em",
          }}>
            {sorted.length} online
          </span>
        </div>

        <div style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
          borderTop: "none",
          overflow: "hidden",
        }}>
          <AnimatePresence initial={false}>
            {sorted.map((p, i) => (
              <Card
                key={p.id}
                player={p}
                rank={i}
                delta={deltas[p.id] ?? null}
              />
            ))}
          </AnimatePresence>

          {sorted.length > 0 && (
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "6px 10px",
              borderTop: `1px solid ${T.muted}`,
            }}>
              <span style={{
                fontFamily: "var(--hud-mono)",
                fontSize: 7, fontWeight: 600,
                color: "rgba(255,255,255,0.18)",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
              }}>
                team total
              </span>
              <span style={{
                fontFamily: "var(--hud-mono)",
                fontSize: 10, fontWeight: 700,
                color: "rgba(240,235,224,0.55)",
              }}>
                <Counter value={totalPts} />
              </span>
            </div>
          )}
        </div>

      </div>
    </>
  );
}

export default TeamHUD;