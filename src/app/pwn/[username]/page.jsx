"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Target, AlertTriangle } from "lucide-react";
import {
  RiInstagramLine as FaInstagram,
  RiLinkedinLine as FaLinkedin,
  RiGithubLine as FaGithub,
} from "@remixicon/react";
import API from "@/utils/axios";
import tick from "@/img/tick.svg";

/* ═══════════════════════════════════════════════════════════════
   DESIGN TOKENS — matches /profile
═══════════════════════════════════════════════════════════════ */
const T = {
  bg: "#0f0f0f",
  surface: "#191919",
  surface2: "#222222",
  cream: "#f0ebe0",
  mid: "#888888",
  muted: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.09)",
  bHover: "rgba(255,255,255,0.22)",
  okText: "#5db87a",
  warnText: "#c49a3a",
  errText: "#c46060",
};

const CELLS = ["#161616", "#1c2a1e", "#2a4030", "#3d6b4a", T.okText];

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .up { background: ${T.bg}; min-height: 100vh; font-family: 'Outfit', sans-serif; color: ${T.cream}; }

  .up-tab {
    background: none; border: none; border-bottom: 1.5px solid transparent;
    color: ${T.mid}; cursor: pointer; font-family: 'Outfit', sans-serif;
    font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase;
    padding: 13px 18px; transition: color .15s, border-color .15s;
    white-space: nowrap;
  }
  .up-tab:hover { color: #bbb; }
  .up-tab.active { color: ${T.cream}; border-bottom-color: ${T.cream}; }

  .btn-g {
    background: none; border: 1px solid ${T.border}; color: ${T.mid};
    cursor: pointer; font-family: 'Outfit', sans-serif; font-size: 9px;
    letter-spacing: 0.18em; text-transform: uppercase; padding: 7px 14px;
    display: inline-flex; align-items: center; gap: 5px;
    transition: border-color .15s, color .15s;
  }
  .btn-g:hover { border-color: ${T.bHover}; color: ${T.cream}; }

  .card { border: 1px solid ${T.border}; overflow: hidden; }
  .lrow { border-bottom: 1px solid ${T.muted}; transition: background .12s; }
  .lrow:last-child { border-bottom: none; }
  .lrow:hover { background: ${T.surface}; }

  .sg3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: ${T.border}; }
  .sc  { background: ${T.bg}; padding: 20px 24px; }

  .acell { border: none; cursor: pointer; display: block; transition: opacity .12s; }
  .acell:hover { opacity: .6; }

  .up-a { text-decoration: none; transition: color .15s; }
  .up-a:hover { color: ${T.cream} !important; }

  .tab-scroll { overflow-x: auto; scrollbar-width: none; }
  .tab-scroll::-webkit-scrollbar { display: none; }

  @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  .mq-inner { display: flex; width: max-content; animation: marquee 30s linear infinite; }
  .mq-inner:hover { animation-play-state: paused; }

  .pbar  { height: 1px; background: ${T.muted}; width: 100%; }
  .pfill { height: 1px; background: ${T.cream}; transition: width .4s; }

  @keyframes spin   { to { transform: rotate(360deg); } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(5px); } to { opacity:1; transform:none; } }
  .fade-up { animation: fadeUp .22s ease both; }
  .spin    { animation: spin .8s linear infinite; }
`;

/* ═══════════════════════════════════════════════════════════════
   PRIMITIVES
═══════════════════════════════════════════════════════════════ */
const Micro = ({ children, style = {} }) => (
  <p
    style={{
      fontFamily: "'Outfit',sans-serif",
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
      fontFamily: "'Bebas Neue',sans-serif",
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

const Pill = ({ children, color = T.mid }) => (
  <span
    style={{
      fontFamily: "'Outfit',sans-serif",
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
            height: "12px",
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

/* Read-only avatar — public profiles don't expose a stored avatar URL, so
   this always shows initials on the same visual chrome as the private
   AvatarBlock, minus the click-to-upload affordance. */
const AvatarCircle = ({ username, size = 92 }) => {
  const initials = username ? username.slice(0, 2).toUpperCase() : "??";
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `1px solid ${T.border}`,
        background: T.surface2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: size * 0.32 + "px",
          color: T.mid,
        }}
      >
        {initials}
      </span>
    </div>
  );
};

const StatsTicker = ({ items }) => {
  const doubled = [...items, ...items];
  return (
    <div
      style={{
        overflow: "hidden",
        background: T.surface,
        borderTop: `1px solid ${T.border}`,
        borderBottom: `1px solid ${T.border}`,
        userSelect: "none",
      }}
    >
      <div className="mq-inner">
        {doubled.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "10px 40px",
              borderRight: `1px solid ${T.border}`,
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: "1.35rem",
                color: T.cream,
                lineHeight: 1,
              }}
            >
              {item.value}
            </span>
            <span
              style={{
                fontFamily: "'Outfit',sans-serif",
                fontSize: "9px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: T.mid,
              }}
            >
              {item.label}
            </span>
            <span style={{ color: T.border, fontSize: "10px" }}>◆</span>
          </div>
        ))}
      </div>
    </div>
  );
};

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

export default function PublicProfilePage() {
  const { username } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("ctf");
  const [userTimezone, setUserTimezone] = useState(null);

  useEffect(() => {
    setUserTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  useEffect(() => {
    if (!username) return;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await API.get(`/api/v1/public/${username}`);
        setProfileData(res.data.data);
      } catch (err) {
        if (err.response?.status === 404) setError("User not found");
        else setError(err.response?.data?.detail || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, [username]);

  /* ── Social links ── */
  const renderSocialLinks = () => {
    const links = [
      { platform: "github", url: profileData?.user?.github, Icon: FaGithub },
      {
        platform: "instagram",
        url: profileData?.user?.instagram,
        Icon: FaInstagram,
      },
      {
        platform: "linkedIn",
        url: profileData?.user?.linkedIn,
        Icon: FaLinkedin,
      },
    ].filter((l) => l.url?.trim());

    if (links.length === 0) return null;

    return (
      <div style={{ display: "flex", gap: "10px" }}>
        {links.map(({ platform, url, Icon }) => (
          <a
            key={platform}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="up-a"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "30px",
              height: "30px",
              border: `1px solid ${T.border}`,
              color: T.mid,
            }}
          >
            <Icon size={14} />
          </a>
        ))}
      </div>
    );
  };

  /* ── Activity data ── */
  const formatDateKey = (d, tz) =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);

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
    profileData?.userActivity?.reduce((s, a) => s + (a.contributions || 0), 0) ||
    0;
  const activeDays =
    new Set(
      profileData?.userActivity?.map(
        (i) => `${i._id.year}-${i._id.month}-${i._id.day}`,
      ),
    ).size || 0;

  /* ═══ ACTIVITY GRAPH ═══════════════════════════════════════ */
  const ActivityGraph = () => {
    const [sel, setSel] = useState(null);
    const data = generateActivityData();
    const weeks = [];
    for (let i = 0; i < data.length; i += 7) weeks.push(data.slice(i, i + 7));
    const MN = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const WD = ["S", "M", "T", "W", "T", "F", "S"];
    const monthGroups = (() => {
      const g = [];
      let cur = null, curI = null, curW = [];
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
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: "11px", color: T.mid }}>
              {sel.count} contributions ·{" "}
              {new Date(sel.date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </p>
          ) : (
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: "10px", color: T.border }}>
              Click a cell to inspect
            </p>
          )
        }
      >
        <div style={{ overflowX: "auto" }}>
          <div style={{ display: "flex", gap: "3px", minWidth: "max-content" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px", paddingTop: "18px", marginRight: "2px" }}>
              {WD.map((d, i) => (
                <div
                  key={i}
                  style={{
                    width: "10px",
                    height: "12px",
                    fontFamily: "'Outfit',sans-serif",
                    fontSize: "8px",
                    color: T.mid,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {i % 2 === 1 ? d : ""}
                </div>
              ))}
            </div>
            {monthGroups.map((g, gi) => (
              <div key={gi} style={{ display: "flex", flexDirection: "column" }}>
                <p
                  style={{
                    fontFamily: "'Outfit',sans-serif",
                    fontSize: "8px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: T.mid,
                    height: "16px",
                    lineHeight: "16px",
                  }}
                >
                  {MN[g.m]}
                </p>
                <div style={{ display: "flex", gap: "2px" }}>
                  {g.w.map((week, wi) => (
                    <div key={wi} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      {week.map((day, di) => (
                        <button
                          key={di}
                          className="acell"
                          onClick={() => setSel(day)}
                          style={{
                            width: "12px",
                            height: "12px",
                            background: CELLS[day.level],
                            outline: sel?.date === day.date ? `1px solid ${T.cream}` : "none",
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
        <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "14px", justifyContent: "flex-end" }}>
          <Micro style={{ marginRight: "2px" }}>Less</Micro>
          {CELLS.map((col, i) => (
            <div key={i} style={{ width: "10px", height: "10px", background: col }} />
          ))}
          <Micro style={{ marginLeft: "2px" }}>More</Micro>
        </div>
      </Section>
    );
  };

  /* ═══ TAB: CTF ══════════════════════════════════════════════ */
  const renderCTFDetails = () => {
    const totalDiff = Object.values(profileData?.ctf?.difficultyBreakdown || {}).reduce((s, c) => s + c, 0);
    const totalCat = Object.values(profileData?.ctf?.categoriesCompleted || {}).reduce((s, c) => s + c, 0);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div className="sg3 card">
          {[
            {
              label: "Rank",
              value: profileData?.ctf?.rank === "Unranked" ? "NuB" : `#${profileData?.ctf?.rank}`,
            },
            { label: "Points", value: profileData?.ctf?.totalPoints?.toLocaleString() || "0" },
            { label: "Solved", value: String(profileData?.ctf?.totalSolved || "0") },
          ].map((s) => (
            <div key={s.label} className="sc">
              <Micro style={{ marginBottom: "8px" }}>{s.label}</Micro>
              <Display size="3rem">{s.value}</Display>
            </div>
          ))}
        </div>

        <Section label="Difficulty Breakdown">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px" }}>
            {Object.entries(profileData?.ctf?.difficultyBreakdown || {}).map(([d, cnt]) => (
              <div key={d} style={{ border: `1px solid ${T.border}`, padding: "18px 20px" }}>
                <Display size="2.6rem" style={{ color: diffColor(d) }}>{cnt}</Display>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: "8px" }}>
                  <Micro>{d}</Micro>
                  <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", color: T.mid }}>
                    {totalDiff > 0 ? Math.round((cnt / totalDiff) * 100) : 0}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section label="Categories">
          {Object.entries(profileData?.ctf?.categoriesCompleted || {}).filter(([, c]) => c > 0).length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <Target size={26} color={T.border} style={{ margin: "0 auto 10px", display: "block" }} />
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: "13px", color: T.mid }}>
                No challenges solved yet
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {Object.entries(profileData?.ctf?.categoriesCompleted || {})
                .filter(([, c]) => c > 0)
                .map(([cat, cnt]) => (
                  <div key={cat}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "7px" }}>
                      <Micro>{cat}</Micro>
                      <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", color: T.mid }}>{cnt}</p>
                    </div>
                    <div className="pbar">
                      <div className="pfill" style={{ width: `${totalCat > 0 ? (cnt / totalCat) * 100 : 0}%` }} />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </Section>

        {profileData?.ctf?.solved?.length > 0 && (
          <Section label="Recent Challenges" bodyPad="0">
            {profileData.ctf.solved.map((c, i) => (
              <div
                key={i}
                className="lrow"
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 24px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: diffColor(c.difficulty), flexShrink: 0 }} />
                  <div>
                    <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: "13px", color: T.cream }}>{c.name}</p>
                    <Micro>{c.category}</Micro>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "12px", color: T.cream }}>{c.points} pts</p>
                  <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: "10px", color: T.mid }}>{formatDate(c.solvedAt)}</p>
                </div>
              </div>
            ))}
          </Section>
        )}
      </div>
    );
  };

  /* ═══ TAB: ACTIVITY ═════════════════════════════════════════ */
  const renderActivityDetails = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <ActivityGraph />
      <div className="sg3 card">
        {[
          { label: "Total Activity", value: String(totalActivity) },
          { label: "Active Days", value: String(activeDays) },
          { label: "Day Streak", value: String(profileData?.streak || 0) },
        ].map((s) => (
          <div key={s.label} className="sc">
            <Micro style={{ marginBottom: "8px" }}>{s.label}</Micro>
            <Display size="2.4rem">{s.value}</Display>
          </div>
        ))}
      </div>
    </div>
  );

  const TABS = [
    { id: "ctf", label: "CTF" },
    { id: "activity", label: "Activity" },
  ];

  /* ═══ LOADING / ERROR ══════════════════════════════════════ */
  if (loading)
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="up" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div
              className="spin"
              style={{ width: "22px", height: "22px", border: `1px solid ${T.border}`, borderTopColor: T.cream, borderRadius: "50%", margin: "0 auto 14px" }}
            />
            <Micro>Loading profile</Micro>
          </div>
        </div>
      </>
    );

  if (error)
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="up" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <AlertTriangle size={26} color={T.errText} style={{ margin: "0 auto 12px", display: "block" }} />
            <Display size="1.6rem" style={{ marginBottom: "8px" }}>{error}</Display>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: "12px", color: T.mid, marginBottom: "20px" }}>
              The profile you're looking for doesn't exist or couldn't be loaded.
            </p>
            <a href="/" className="btn-g">Return Home</a>
          </div>
        </div>
      </>
    );

  /* ═══ TICKER DATA ═══════════════════════════════════════════ */
  const tickerItems = [
    {
      value: profileData?.ctf?.rank === "Unranked" ? "UNRANKED" : `#${profileData?.ctf?.rank}`,
      label: "Global Rank",
    },
    { value: profileData?.ctf?.totalPoints?.toLocaleString() || "0", label: "Total Points" },
    { value: String(profileData?.ctf?.totalSolved || 0), label: "Challenges Solved" },
    { value: String(profileData?.streak || 0), label: "Day Streak" },
    { value: String(activeDays), label: "Active Days" },
  ];

  /* ═══ MAIN RENDER ═══════════════════════════════════════════ */
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="up">
        {/* ────────────── HEADER BLOCK ────────────── */}
        <div style={{ borderBottom: `1px solid ${T.border}` }}>
          <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "48px 32px 32px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "24px", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Micro style={{ marginBottom: "20px" }}>GoPwnIt / Profile</Micro>

                <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", flexWrap: "wrap", marginBottom: "10px" }}>
                  <h1
                    style={{
                      fontFamily: "'Bebas Neue',sans-serif",
                      fontSize: "clamp(3.5rem, 8vw, 5.8rem)",
                      color: T.cream,
                      lineHeight: 0.88,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {profileData?.user?.username || "Unknown"}
                  </h1>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingBottom: "6px" }}>
                    <span style={{ fontSize: "1.2rem", lineHeight: 1 }}>
                      {getCountryFlag(profileData?.user?.country)}
                    </span>
                    {profileData?.user?.isVerified && (
                      <Image src={tick} alt="Verified" width={16} height={16} />
                    )}
                  </div>
                </div>

                <p
                  style={{
                    fontFamily: "'Outfit',sans-serif",
                    fontSize: "11px",
                    letterSpacing: "0.18em",
                    color: T.mid,
                    textTransform: "uppercase",
                    marginBottom: "22px",
                  }}
                >
                  Member since {formatJoinDate(profileData?.user?.createdAt)}
                  {profileData?.user?.country ? ` · ${profileData.user.country}` : ""}
                </p>

                <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {[
                      {
                        label: profileData?.ctf?.rank === "Unranked" ? "Unranked" : `Rank #${profileData?.ctf?.rank}`,
                        color: T.cream,
                      },
                      {
                        label: `${profileData?.ctf?.totalPoints?.toLocaleString() || 0} pts`,
                        color: T.mid,
                      },
                    ].map((p, i) => (
                      <Pill key={i} color={p.color}>{p.label}</Pill>
                    ))}
                  </div>
                  {renderSocialLinks()}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                <AvatarCircle username={profileData?.user?.username} size={92} />
              </div>
            </div>
          </div>

          <StatsTicker items={tickerItems} />

          <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "0 32px" }}>
            <div className="tab-scroll" style={{ display: "flex" }}>
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
          </div>
        </div>

        {/* ────────────── TAB CONTENT ────────────── */}
        <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "32px" }}>
          {activeTab === "ctf" && renderCTFDetails()}
          {activeTab === "activity" && renderActivityDetails()}
        </div>
      </div>
    </>
  );
}
