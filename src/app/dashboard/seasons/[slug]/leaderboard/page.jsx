"use client";

import { useState, useEffect, useMemo } from "react";
import {
  RiTrophyLine,
  RiCalendarLine,
  RiMedalLine,
  RiArrowLeftLine,
  RiGroupLine,
  RiUser3Line,
  RiBarChartBoxLine,
  RiFlashlightLine,
  RiSignalTowerLine,
} from "@remixicon/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import API from "@/utils/axios";
import BoxLoader from "@/components/loaders/BoxLoader";
import { useParams, useRouter } from "next/navigation";
import { useSocket } from "@/sockets/SocketProvider";
import { withAuth } from "@/utils/withAuth";

// ─── THEME ────────────────────────────────────────────────────────────────────
const T = {
  bg: "#0A0A0A",
  cream: "#fefce8",
  muted: "#a1a1aa",
  border: "rgba(254,252,232,0.12)",
  borderHover: "rgba(254,252,232,0.22)",
  card: "#111111",
};

const LINE_COLORS = [
  "#7c52ff",
  "#a78bfa",
  "#38bdf8",
  "#818cf8",
  "#c084fc",
  "#60a5fa",
  "#e879f9",
  "#34d399",
  "#f472b6",
  "#fb923c",
];

function formatTimestamp(t) {
  return new Date(t).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}
function fmtFull(ts) {
  const d = new Date(ts);
  return (
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
    " " +
    d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
  );
}

function buildChartData(entries, seasonStartTime) {
  const valid = (entries || []).filter(
    (e) =>
      Array.isArray(e.scoreHistory) &&
      e.scoreHistory.length > 0 &&
      e.totalPoints > 0,
  );
  if (!valid.length) return { data: [], players: [] };

  const tsSet = new Set();
  if (seasonStartTime) tsSet.add(new Date(seasonStartTime).getTime());
  valid.forEach((e) =>
    e.scoreHistory.forEach((s) => tsSet.add(new Date(s.timestamp).getTime())),
  );
  const allTs = [...tsSet].sort((a, b) => a - b);

  const players = [...valid].sort((a, b) => {
    if (a.totalPoints !== b.totalPoints) return b.totalPoints - a.totalPoints;
    const aF = a.firstSolve ? new Date(a.firstSolve).getTime() : Infinity;
    const bF = b.firstSolve ? new Date(b.firstSolve).getTime() : Infinity;
    return aF - bF;
  });

  const playerHistories = players.map((p) =>
    [...p.scoreHistory].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    ),
  );

  function scoreAt(i, ts) {
    let score = 0;
    for (const s of playerHistories[i]) {
      if (new Date(s.timestamp).getTime() <= ts) score = s.totalAtTime;
      else break;
    }
    return score;
  }

  const data = allTs.map((ts) => {
    const row = { ts, time_label: formatTimestamp(ts), time_full: fmtFull(ts) };
    players.forEach((p, i) => {
      row[p.teamName || p.username] = scoreAt(i, ts);
    });
    return row;
  });

  return {
    data,
    players: players.map((p, i) => ({
      name: p.teamName || p.username,
      rank: p.rank ?? i + 1,
      color: LINE_COLORS[i % LINE_COLORS.length],
    })),
  };
}

// ─── CUSTOM TOOLTIP (keep colored) ───────────────────────────────────────────
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const timeFull = payload[0]?.payload?.time_full || "";
  return (
    <div
      style={{
        background: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: 2,
        padding: "10px 14px",
        fontFamily: "Outfit, sans-serif",
        minWidth: 185,
      }}
    >
      <div
        style={{
          color: T.muted,
          fontSize: 9,
          marginBottom: 8,
          letterSpacing: ".2em",
          textTransform: "uppercase",
        }}
      >
        {timeFull}
      </div>
      {[...payload]
        .filter((e) => e.value > 0)
        .sort((a, b) => b.value - a.value)
        .map((entry, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 5,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: entry.color,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                color: T.muted,
                flex: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: 11,
              }}
            >
              {entry.name}
            </span>
            <span style={{ color: T.cream, fontWeight: 700, fontSize: 12 }}>
              {entry.value.toLocaleString()} pts
            </span>
          </div>
        ))}
    </div>
  );
};

const CustomXTick = ({ x, y, payload }) => {
  if (!payload?.value) return null;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={12}
        textAnchor="end"
        transform="rotate(-35)"
        fill={T.muted}
        fillOpacity={0.5}
        fontSize={10}
        fontFamily="Outfit, sans-serif"
      >
        {payload.value}
      </text>
    </g>
  );
};

// ─── SCORE GRAPH ─────────────────────────────────────────────────────────────
const ScoreGraph = ({ currentData, seasonStartTime, seasonEndTime }) => {
  const [hiddenPlayers, setHiddenPlayers] = useState(new Set());
  const { data, players } = useMemo(
    () =>
      buildChartData(currentData?.slice(0, 10), seasonStartTime, seasonEndTime),
    [currentData, seasonStartTime, seasonEndTime],
  );
  const togglePlayer = (name) => {
    setHiddenPlayers((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  return (
    <div
      style={{
        flex: "0 0 63%",
        background: T.card,
        border: `1px solid ${T.border}`,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* header */}
      <div
        style={{
          borderBottom: `1px solid ${T.border}`,
          padding: "10px 18px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "Outfit, sans-serif",
            fontSize: 9,
            color: T.muted,
            textTransform: "uppercase",
            letterSpacing: "0.25em",
          }}
        >
          Score Progression
        </span>
      </div>

      {/* chart */}
      <div
        style={{
          flex: "1 1 0",
          minWidth: 0,
          width: "100%",
          padding: "12px 12px 0 0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {!data.length ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              fontFamily: "Outfit, sans-serif",
              fontSize: 12,
              color: T.muted,
            }}
          >
            No solve data yet — graph populates as solves come in
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 24, left: 0, bottom: 64 }}
            >
              <CartesianGrid
                strokeDasharray="3 6"
                stroke={T.border}
                vertical={false}
              />
              <XAxis
                dataKey="time_label"
                tick={<CustomXTick />}
                tickLine={{ stroke: T.border }}
                axisLine={{ stroke: T.border }}
                height={68}
                interval={0}
              />
              <YAxis
                tick={{
                  fill: T.muted,
                  fontSize: 11,
                  fontFamily: "Outfit, sans-serif",
                }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) =>
                  v >= 1000 ? (v / 1000).toFixed(1) + "k" : v
                }
                width={48}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: T.border,
                  strokeWidth: 1,
                  strokeDasharray: "3 5",
                }}
              />
              {players.map((p) => (
                <Line
                  key={p.name}
                  type="monotone"
                  dataKey={p.name}
                  stroke={p.color}
                  strokeWidth={p.rank === 1 ? 2.8 : p.rank <= 3 ? 2.2 : 1.5}
                  dot={{
                    r: 3.5,
                    fill: p.color,
                    stroke: T.bg,
                    strokeWidth: 1.5,
                  }}
                  activeDot={{
                    r: 6,
                    fill: p.color,
                    stroke: T.bg,
                    strokeWidth: 2,
                  }}
                  hide={hiddenPlayers.has(p.name)}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* legend */}
      {players.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "5px 8px",
            padding: "10px 18px 13px",
            borderTop: `1px solid ${T.border}`,
          }}
        >
          {players.map((p) => {
            const hidden = hiddenPlayers.has(p.name);
            return (
              <button
                key={p.name}
                onClick={() => togglePlayer(p.name)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 11,
                  fontFamily: "Outfit, sans-serif",
                  color: hidden ? T.muted : T.cream,
                  background: "transparent",
                  border: `1px solid ${hidden ? T.border : T.borderHover}`,
                  borderRadius: 2,
                  padding: "4px 10px",
                  cursor: "pointer",
                  opacity: hidden ? 0.4 : 1,
                  transition: "all .15s",
                }}
              >
                <span
                  style={{
                    width: 16,
                    height: 2,
                    borderRadius: 2,
                    background: hidden ? T.muted : p.color,
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                {p.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const SeasonLeaderboard = () => {
  const [soloData, setSoloData] = useState([]);
  const [teamsData, setTeamsData] = useState([]);
  const [seasonStartTime, setSeasonStartTime] = useState(null);
  const [seasonEndTime, setSeasonEndTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("solo");
  const { slug } = useParams();
  const router = useRouter();
  const { socket } = useSocket();

  const fetchLeaderboard = async () => {
    if (!slug) {
      setError("Season slug not found in URL");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const r = await API.get(`/api/v1/seasons/${slug}/leaderboard`);
      if (r.data.success) {
        setSoloData(r.data.solo || []);
        setTeamsData(r.data.teams || []);
        setSeasonStartTime(r.data.seasonStartTime || null);
        setSeasonEndTime(r.data.seasonEndTime || null);
      } else {
        setError("Failed to fetch leaderboard data");
      }
    } catch (err) {
      setError("Error fetching data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [slug]);

  useEffect(() => {
    if (!socket) return;
    const onUpdate = async (data) => {
      if (!data || data.seasonSlug !== slug) return;
      await fetchLeaderboard();
    };
    socket.on("leaderboardUpdated", onUpdate);
    socket.emit("joinSeason", slug);
    return () => {
      socket.off("leaderboardUpdated", onUpdate);
      socket.emit("leaveSeason", slug);
    };
  }, [socket, slug]);

  useEffect(() => {
    if (!loading && soloData.length === 0 && teamsData.length > 0)
      setActiveTab("teams");
  }, [loading, soloData, teamsData]);

  const currentData = activeTab === "solo" ? soloData : teamsData;
  const podiumOrder = [currentData[1], currentData[0], currentData[2]];
  const podiumHeights = [120, 168, 96];

  if (loading)
    return (
      <div
        style={{
          background: T.bg,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <BoxLoader />
          <p
            style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: 9,
              color: T.muted,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              marginTop: 16,
            }}
          >
            Loading Leaderboard
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div
        style={{
          background: T.bg,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p
          style={{
            fontFamily: "Outfit, sans-serif",
            fontSize: 13,
            color: T.muted,
          }}
        >
          {error}
        </p>
      </div>
    );

  return (
    <div
      style={{
        background: T.bg,
        minHeight: "100vh",
        color: T.cream,
        fontFamily: "Outfit, sans-serif",
      }}
    >
      {/* subtle grid */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          opacity: 0.025,
          backgroundImage: `linear-gradient(${T.cream} 1px,transparent 1px),linear-gradient(90deg,${T.cream} 1px,transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />
      <button
        onClick={() => router.push(`/dashboard/seasons/${slug}/challenges`)}
        className="fixed bottom-6 right-6 z-50 text-black hover:text-black/70 flex items-center gap-2 px-3 py-1 text-xs tracking-[0.15em] transition-colors duration-150"
        style={{
          background: "white",
          border: `1px solid ${T.border}`,
          borderRadius: 2,
          fontFamily: "Outfit, sans-serif",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = T.borderHover;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = T.border;
        }}
      >
        <RiArrowLeftLine className="w-3.5 h-3.5" /> Back to Challenges
      </button>
      <div className="relative z-10 max-w-350 mx-auto px-6 py-10">
        <div className="mb-10 flex items-start justify-between">
          <div>
            <p
              style={{
                fontSize: 9,
                color: T.muted,
                textTransform: "uppercase",
                letterSpacing: "0.25em",
                marginBottom: 10,
              }}
            >
              Season Rankings · Live
            </p>
            <h1
              style={{
                fontFamily: "Bebas Neue, sans-serif",
                fontSize: "clamp(48px,8vw,80px)",
                color: T.cream,
                lineHeight: 0.92,
                letterSpacing: "-0.03em",
              }}
            >
              Leaderboard
            </h1>
            <p
              style={{
                fontSize: 11,
                color: T.muted,
                marginTop: 10,
                fontFamily: "Outfit, sans-serif",
              }}
            >
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
              {" · "}
              {new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
              })}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: 1,
              background: T.card,
              border: `1px solid ${T.border}`,
              borderRadius: 2,
              padding: 2,
              marginTop: 4,
            }}
          >
            {[
              {
                id: "solo",
                Icon: RiUser3Line,
                label: "Solo",
                count: soloData.length,
              },
              {
                id: "teams",
                Icon: RiGroupLine,
                label: "Teams",
                count: teamsData.length,
              },
            ].map(({ id, Icon, label, count }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 16px",
                  fontSize: 11,
                  fontFamily: "Outfit, sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  borderRadius: 2,
                  border: "none",
                  cursor: "pointer",
                  transition: "all .15s",
                  background: activeTab === id ? T.cream : "transparent",
                  color: activeTab === id ? T.bg : T.muted,
                }}
              >
                <Icon style={{ width: 13, height: 13 }} />
                {label}
                <span
                  style={{
                    fontSize: 9,
                    padding: "1px 5px",
                    borderRadius: 2,
                    background:
                      activeTab === id
                        ? "rgba(0,0,0,0.15)"
                        : "rgba(254,252,232,0.06)",
                    color: activeTab === id ? T.bg : T.muted,
                  }}
                >
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 1, marginBottom: 1, height: 420 }}>
          <ScoreGraph
            currentData={currentData}
            seasonStartTime={seasonStartTime}
            seasonEndTime={seasonEndTime}
          />

          {/* podium */}
          <div
            style={{
              flex: "1 1 0%",
              background: T.card,
              border: `1px solid ${T.border}`,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                borderBottom: `1px solid ${T.border}`,
                padding: "10px 18px",
              }}
            >
              <span
                style={{
                  fontSize: 9,
                  color: T.muted,
                  textTransform: "uppercase",
                  letterSpacing: "0.25em",
                }}
              >
                Podium
              </span>
            </div>

            {currentData.length > 0 ? (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: "16px 20px 0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  {podiumOrder.map((entry, i) => {
                    if (!entry) return <div key={i} style={{ flex: 1 }} />;
                    const h = podiumHeights[i];
                    const isFirst = i === 1;
                    return (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <p
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: T.cream,
                            textAlign: "center",
                            marginBottom: 2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            width: "100%",
                            padding: "0 4px",
                          }}
                        >
                          {entry.teamName || entry.username}
                        </p>
                        <p
                          style={{
                            fontSize: 11,
                            color: T.muted,
                            textAlign: "center",
                            marginBottom: 6,
                          }}
                        >
                          {entry.totalPoints.toLocaleString()} pts
                        </p>
                        <div
                          style={{
                            width: "100%",
                            height: h,
                            background: isFirst
                              ? T.cream
                              : "rgba(254,252,232,0.08)",
                            border: `1px solid ${isFirst ? T.cream : T.border}`,
                            display: "flex",
                            alignItems: "flex-end",
                            justifyContent: "center",
                            paddingBottom: 10,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: isFirst ? T.bg : T.muted,
                              textTransform: "uppercase",
                              letterSpacing: "0.1em",
                            }}
                          >
                            {["2nd", "1st", "3rd"][i]}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div
                  style={{
                    height: 8,
                    background: `rgba(254,252,232,0.06)`,
                    borderTop: `1px solid ${T.border}`,
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    color: T.muted,
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                  }}
                >
                  No participants yet
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── RANKINGS TABLE ── */}
        {currentData.length > 0 && (
          <div className="mb-16" style={{ marginTop: 1 }}>
            {/* table header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "3rem 1fr 7rem 8rem",
                padding: "8px 20px",
                background: T.card,
                borderBottom: `1px solid ${T.border}`,
                border: `1px solid ${T.border}`,
              }}
            >
              {[
                "#",
                activeTab === "teams" ? "Team" : "Player",
                "Score",
                "First Blood",
              ].map((h, i) => (
                <div
                  key={h}
                  style={{
                    fontSize: 9,
                    color: T.muted,
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    textAlign: i >= 2 ? "right" : "left",
                  }}
                >
                  {h}
                </div>
              ))}
            </div>

            {/* rows */}
            <div style={{ border: `1px solid ${T.border}`, borderTop: "none" }}>
              {currentData.map((entry, index) => {
                const isTop3 = index < 3;
                return (
                  <div
                    key={entry.username || entry.teamName || index}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "3rem 1fr 7rem 8rem",
                      alignItems: "center",
                      padding: "12px 20px",
                      borderBottom: `1px solid ${T.border}`,
                      borderLeft: isTop3
                        ? `2px solid ${T.cream}`
                        : `2px solid transparent`,
                      background: isTop3
                        ? "rgba(254,252,232,0.03)"
                        : "transparent",
                      transition: "background .15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(254,252,232,0.04)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = isTop3
                        ? "rgba(254,252,232,0.03)"
                        : "transparent")
                    }
                  >
                    {/* rank */}
                    <div>
                      {isTop3 ? (
                        <RiTrophyLine
                          style={{
                            width: 14,
                            height: 14,
                            color: [
                              "#fefce8",
                              "rgba(254,252,232,0.6)",
                              "rgba(254,252,232,0.4)",
                            ][index],
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            fontSize: 12,
                            color: `rgba(254,252,232,0.2)`,
                            fontWeight: 700,
                          }}
                        >
                          {entry.rank || index + 1}
                        </span>
                      )}
                    </div>

                    {/* name */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          minWidth: 0,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: T.cream,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {entry.teamName || entry.username}
                        </span>
                        <span
                          style={{
                            fontSize: 9,
                            padding: "1px 6px",
                            flexShrink: 0,
                            border: `1px solid ${T.border}`,
                            color: T.muted,
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                          }}
                        >
                          #{entry.rank || index + 1}
                        </span>
                      </div>
                      {activeTab === "teams" && entry.members?.length > 0 && (
                        <div
                          style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
                        >
                          {entry.members.map((m, mi) => (
                            <span
                              key={mi}
                              style={{
                                fontSize: 10,
                                color: `rgba(254,252,232,0.3)`,
                              }}
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* score */}
                    <div style={{ textAlign: "right" }}>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: T.cream,
                        }}
                      >
                        {entry.totalPoints.toLocaleString()}
                      </span>
                      <span
                        style={{ fontSize: 10, color: T.muted, marginLeft: 3 }}
                      >
                        pts
                      </span>
                    </div>

                    {/* first blood */}
                    <div style={{ textAlign: "right" }}>
                      {entry.firstSolve ? (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            fontSize: 10,
                            padding: "2px 8px",
                            border: `1px solid ${T.border}`,
                            color: T.muted,
                            fontFamily: "monospace",
                          }}
                        >
                          <RiFlashlightLine style={{ width: 10, height: 10 }} />
                          {formatTimestamp(
                            new Date(entry.firstSolve).getTime(),
                          )}
                        </span>
                      ) : (
                        <span
                          style={{
                            color: `rgba(254,252,232,0.12)`,
                            fontSize: 12,
                          }}
                        >
                          —
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* count footer */}
            <div
              style={{
                padding: "8px 20px",
                borderTop: "none",
                border: `1px solid ${T.border}`,
                borderTop: `1px solid ${T.border}`,
                background: T.card,
              }}
            >
              <span
                style={{
                  fontSize: 9,
                  color: T.muted,
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                }}
              >
                {currentData.length} participants
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default withAuth(SeasonLeaderboard);
