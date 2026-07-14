// Decorative floating CTF/hacker fragments for the hero's empty side gutters on
// wide screens. Purely atmospheric: pointer-events-none, aria-hidden, xl-only,
// and disabled under prefers-reduced-motion. Monochrome to match the palette —
// faint cream monospace + a few glass "category" chips. Real 3D via perspective
// on the container + per-item rotate/translateZ; a nested element handles the
// vertical float so the two transforms never clobber each other.

const MONO =
  "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace";

// side: which gutter · top: vertical position · off: inset from the edge
// z/ry/rx: 3D depth + tilt · float: which drift keyframe · dur/delay: timing
const ITEMS = [
  // ── left gutter ──
  { side: "left", top: "16%", off: "3.5%", z: -60, ry: 16, rx: -5, float: 1, dur: 7, delay: 0, kind: "code", text: "$ nmap -sV 10.10.14.7", size: 13, op: 0.26 },
  { side: "left", top: "34%", off: "8%", z: -160, ry: 22, rx: -3, float: 3, dur: 9, delay: 1.2, kind: "code", text: "0x7ffe  48 65 6c 6c 6f", size: 11, op: 0.16 },
  { side: "left", top: "50%", off: "2.5%", z: 20, ry: 12, rx: -6, float: 2, dur: 8, delay: 0.6, kind: "chip", label: "Web Exploitation" },
  { side: "left", top: "68%", off: "6%", z: -110, ry: 18, rx: -2, float: 1, dur: 8.5, delay: 2, kind: "code", text: "flag{r3al_sk1lls}", size: 13, op: 0.3 },
  { side: "left", top: "82%", off: "4%", z: -40, ry: 14, rx: -4, float: 3, dur: 7.5, delay: 1.6, kind: "code", text: "[+] root shell obtained", size: 11, op: 0.18 },
  // ── right gutter ──
  { side: "right", top: "18%", off: "3%", z: 10, ry: 14, rx: -5, float: 2, dur: 8, delay: 0.4, kind: "chip", label: "Cryptography" },
  { side: "right", top: "33%", off: "7%", z: -150, ry: 20, rx: -3, float: 1, dur: 9.5, delay: 1.8, kind: "code", text: "SELECT * FROM users--", size: 11, op: 0.16 },
  { side: "right", top: "50%", off: "3.5%", z: -50, ry: 16, rx: -6, float: 3, dur: 7, delay: 0.9, kind: "code", text: "nc pwn.gopwnit 1337", size: 13, op: 0.26 },
  { side: "right", top: "66%", off: "8%", z: -120, ry: 22, rx: -2, float: 2, dur: 8.5, delay: 2.2, kind: "code", text: "sha256: 9f2c…a1e4", size: 11, op: 0.17 },
  { side: "right", top: "80%", off: "2.5%", z: 20, ry: 12, rx: -4, float: 1, dur: 8, delay: 1.3, kind: "chip", label: "Binary Exploitation" },
];

const Chip = ({ label }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 13px",
      border: "1px solid rgba(255,255,255,0.09)",
      background: "rgba(255,255,255,0.025)",
      backdropFilter: "blur(3px)",
      WebkitBackdropFilter: "blur(3px)",
      borderRadius: 2,
      fontFamily: MONO,
      fontSize: 10.5,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: "rgba(232,228,217,0.42)",
      whiteSpace: "nowrap",
    }}
  >
    <span
      style={{
        width: 5,
        height: 5,
        borderRadius: "50%",
        background: "rgba(232,228,217,0.4)",
        flexShrink: 0,
      }}
    />
    {label}
  </div>
);

const HeroCodeDecor = () => (
  <div
    className="hidden xl:block absolute inset-0 z-[1] pointer-events-none overflow-hidden"
    aria-hidden="true"
    style={{ perspective: "1200px" }}
  >
    {ITEMS.map((it, i) => (
      <div
        key={i}
        className="hcd-item"
        style={{
          position: "absolute",
          top: it.top,
          [it.side]: it.off,
          transform: `rotateY(${it.side === "left" ? it.ry : -it.ry}deg) rotateX(${it.rx}deg) translateZ(${it.z}px)`,
          opacity: it.kind === "chip" ? 1 : it.op,
        }}
      >
        <div style={{ animation: `hcd-float-${it.float} ${it.dur}s ease-in-out ${it.delay}s infinite` }}>
          {it.kind === "chip" ? (
            <Chip label={it.label} />
          ) : (
            <span
              style={{
                fontFamily: MONO,
                fontSize: it.size,
                letterSpacing: "0.02em",
                color: "rgba(232,228,217,0.85)",
                whiteSpace: "nowrap",
              }}
            >
              {it.text}
            </span>
          )}
        </div>
      </div>
    ))}

    <style>{`
      @keyframes hcd-float-1 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
      @keyframes hcd-float-2 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-24px); } }
      @keyframes hcd-float-3 { 0%,100% { transform: translateY(-9px); } 50% { transform: translateY(11px); } }
      @media (prefers-reduced-motion: reduce) {
        .hcd-item > div { animation: none !important; }
      }
    `}</style>
  </div>
);

export default HeroCodeDecor;
