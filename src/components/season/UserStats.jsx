"use client";

import { useEffect, useState } from "react";
import {
  IconClock,
  IconFlag,
  IconCircleCheck,
  IconCircleX,
  IconSearch,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import API from "@/utils/axios";

const T = {
  bg: "#000",
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
  outline: "none",
};

const PageHeader = ({ usernameInput, setUsernameInput, onSubmit }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
    <div>
      <p
        className="text-[10px] uppercase tracking-[0.18em] mb-1"
        style={{ color: T.muted, fontFamily: "Outfit, sans-serif" }}
      >
        Organizer Panel
      </p>
      <h1
        className="text-4xl sm:text-5xl uppercase leading-none"
        style={{
          fontFamily: "Bebas Neue, sans-serif",
          color: T.cream,
          letterSpacing: "-0.03em",
        }}
      >
        User Statistics
      </h1>
    </div>

    <form onSubmit={onSubmit} className="flex gap-2">
      <div className="relative">
        <IconSearch
          size={13}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: T.muted }}
        />
        <input
          type="text"
          placeholder="Enter username..."
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          className="pl-8 pr-4 py-2 text-sm w-52 placeholder-zinc-600"
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = T.borderHover)}
          onBlur={(e) => (e.target.style.borderColor = T.border)}
        />
      </div>
      <button
        type="submit"
        className="px-5 py-2 text-[10px] uppercase tracking-widest transition-all"
        style={{
          background: T.cream,
          color: T.bg,
          borderRadius: "2px",
          fontFamily: "Outfit, sans-serif",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        Search
      </button>
    </form>
  </div>
);

const StatCard = ({ label, value, icon: Icon }) => (
  <div
    className="p-5 flex flex-col gap-3"
    style={{
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: "2px",
    }}
  >
    <div className="flex items-center justify-between">
      <span
        className="text-[9px] uppercase tracking-[0.2em]"
        style={{ color: T.muted, fontFamily: "Outfit, sans-serif" }}
      >
        {label}
      </span>
      <Icon size={13} style={{ color: T.muted }} />
    </div>
    <p
      className="text-2xl leading-none"
      style={{ color: T.cream, fontFamily: "Bebas Neue, sans-serif" }}
    >
      {value}
    </p>
  </div>
);

export default function UserStats({ seasonSlug }) {
  const [usernameInput, setUsernameInput] = useState("");
  const [currentUsername, setCurrentUsername] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [userData, setUserData] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 20;

  const fetchUserStats = async (username) => {
    if (!username || !seasonSlug) return;
    setLoading(true);
    try {
      const response = await API.get(
        `/api/v1/organizer/${seasonSlug}/user/${username}/stats`,
      );
      if (response.data.success) {
        setUserData(response.data.userData);
        setAttempts(response.data.attempts);
        setCurrentPage(1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserStats(currentUsername);
  }, [currentUsername, seasonSlug]);

  const handleUsernameSearch = (e) => {
    e.preventDefault();
    const trimmed = usernameInput.trim();
    if (trimmed) {
      setCurrentUsername(trimmed);
      fetchUserStats(trimmed);
    }
  };

  const filteredAttempts = attempts.filter((a) => {
    const matchSearch =
      a.challenge?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.submittedFlag?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filterStatus === "all" || a.status === filterStatus;
    return matchSearch && matchFilter;
  });

  const totalPages = Math.ceil(filteredAttempts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAttempts = filteredAttempts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const formatToLocalTime = (ts) => {
    if (!ts) return "N/A";
    return new Intl.DateTimeFormat(undefined, {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(new Date(ts));
  };

  const sharedProps = {
    usernameInput,
    setUsernameInput,
    onSubmit: handleUsernameSearch,
  };

  /* ── Loading ── */
  if (loading)
    return (
      <div
        className="min-h-[60vh] flex flex-col"
        style={{
          background: T.bg,
          color: T.cream,
          fontFamily: "Outfit, sans-serif",
        }}
      >
        <PageHeader {...sharedProps} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div
              className="w-8 h-8 border border-current border-t-transparent rounded-full animate-spin mx-auto mb-4"
              style={{ color: T.muted }}
            />
            <p
              className="text-[11px] uppercase tracking-widest"
              style={{ color: T.muted }}
            >
              Loading statistics...
            </p>
          </div>
        </div>
      </div>
    );

  /* ── No username entered ── */
  if (!currentUsername)
    return (
      <div
        style={{
          background: T.bg,
          color: T.cream,
          fontFamily: "Outfit, sans-serif",
        }}
      >
        <PageHeader {...sharedProps} />
        <div className="flex items-center justify-center min-h-[30vh]">
          <p
            className="text-[11px] uppercase tracking-widest"
            style={{ color: T.muted }}
          >
            Enter a username to view statistics
          </p>
        </div>
      </div>
    );

  /* ── No data found ── */
  if (!userData)
    return (
      <div
        style={{
          background: T.bg,
          color: T.cream,
          fontFamily: "Outfit, sans-serif",
        }}
      >
        <PageHeader {...sharedProps} />
        <div className="flex items-center justify-center min-h-[30vh]">
          <div className="text-center">
            <IconCircleX
              size={32}
              style={{ color: T.muted }}
              className="mx-auto mb-3"
            />
            <p
              className="text-[11px] uppercase tracking-widest"
              style={{ color: T.muted }}
            >
              No data found for this user
            </p>
          </div>
        </div>
      </div>
    );

  /* ── Main view ── */
  return (
    <div
      style={{
        background: T.bg,
        color: T.cream,
        fontFamily: "Outfit, sans-serif",
      }}
    >
      <PageHeader {...sharedProps} />

      {/* ── Stat cards ── */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-px mb-6"
        style={{ border: `1px solid ${T.border}` }}
      >
        <StatCard label="Username" value={userData.username} icon={IconFlag} />
        <StatCard
          label="Total Attempts"
          value={userData.totalAttempts}
          icon={IconClock}
        />
        <StatCard
          label="Solved"
          value={userData.solvedChallenges}
          icon={IconCircleCheck}
        />
        <StatCard
          label="Success Rate"
          value={`${userData.successRate}%`}
          icon={IconCircleX}
        />
      </div>

      {/* ── Filters ── */}
      <div
        className="p-4 mb-4 flex flex-col sm:flex-row gap-3"
        style={{
          background: T.card,
          border: `1px solid ${T.border}`,
          borderRadius: "2px",
        }}
      >
        <div className="relative flex-1">
          <IconSearch
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: T.muted }}
          />
          <input
            type="text"
            placeholder="Search by challenge or flag..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-8 pr-4 py-2 text-sm placeholder-zinc-600"
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = T.borderHover)}
            onBlur={(e) => (e.target.style.borderColor = T.border)}
          />
        </div>

        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="appearance-none pl-4 pr-9 py-2 text-sm cursor-pointer"
            style={{ ...inputStyle, color: T.cream }}
          >
            <option value="all" style={{ background: T.card }}>
              All Attempts
            </option>
            <option value="success" style={{ background: T.card }}>
              Success
            </option>
            <option value="failed" style={{ background: T.card }}>
              Failed
            </option>
          </select>
          <svg
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ color: T.muted }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* ── Table ── */}
      <div style={{ border: `1px solid ${T.border}`, borderRadius: "2px" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                {[
                  "Timestamp",
                  "Challenge",
                  "Category",
                  "Flag Submitted",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left py-3 px-4 text-[9px] uppercase tracking-[0.2em]"
                    style={{ color: T.muted, fontFamily: "Outfit, sans-serif" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedAttempts.map((attempt, i) => (
                <tr
                  key={i}
                  style={{ borderBottom: `1px solid ${T.border}` }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = T.card)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <td className="py-3 px-4">
                    <div
                      className="flex items-center gap-2 text-xs"
                      style={{ color: T.muted, fontFamily: "monospace" }}
                    >
                      <IconClock size={12} style={{ color: T.muted }} />
                      {formatToLocalTime(attempt.timestamp)}
                    </div>
                  </td>
                  <td
                    className="py-3 px-4 text-sm"
                    style={{ color: T.cream, fontFamily: "Outfit, sans-serif" }}
                  >
                    {attempt.challenge}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className="text-[9px] uppercase tracking-widest px-2 py-1"
                      style={{
                        color: T.muted,
                        border: `1px solid ${T.border}`,
                        borderRadius: "2px",
                        fontFamily: "Outfit, sans-serif",
                      }}
                    >
                      {attempt.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <code
                      className="text-xs px-2 py-1"
                      style={{
                        color: T.cream,
                        background: T.inputBg,
                        border: `1px solid ${T.border}`,
                        borderRadius: "2px",
                        fontFamily: "monospace",
                      }}
                    >
                      {attempt.submittedFlag}
                    </code>
                  </td>
                  <td className="py-3 px-4">
                    {attempt.status === "success" ? (
                      <span
                        className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest"
                        style={{
                          color: T.cream,
                          fontFamily: "Outfit, sans-serif",
                        }}
                      >
                        <IconCircleCheck size={13} /> Success
                      </span>
                    ) : (
                      <span
                        className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest"
                        style={{
                          color: T.muted,
                          fontFamily: "Outfit, sans-serif",
                        }}
                      >
                        <IconCircleX size={13} /> Failed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {filteredAttempts.length === 0 && (
          <div className="py-14 text-center">
            <p
              className="text-[11px] uppercase tracking-widest"
              style={{ color: T.muted }}
            >
              No attempts match your filters
            </p>
          </div>
        )}

        {/* ── Pagination ── */}
        {filteredAttempts.length > 0 && (
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderTop: `1px solid ${T.border}` }}
          >
            <p
              className="text-[10px] uppercase tracking-widest"
              style={{ color: T.muted, fontFamily: "Outfit, sans-serif" }}
            >
              {startIndex + 1}–
              {Math.min(startIndex + itemsPerPage, filteredAttempts.length)} of{" "}
              {filteredAttempts.length}
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center transition-all disabled:opacity-30"
                style={{
                  border: `1px solid ${T.border}`,
                  borderRadius: "2px",
                  color: T.muted,
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== 1) {
                    e.currentTarget.style.borderColor = T.borderHover;
                    e.currentTarget.style.color = T.cream;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = T.border;
                  e.currentTarget.style.color = T.muted;
                }}
              >
                <IconChevronLeft size={13} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    totalPages <= 5 ||
                    p === 1 ||
                    p === totalPages ||
                    (p >= currentPage - 1 && p <= currentPage + 1),
                )
                .map((page, i, arr) => (
                  <div key={page} className="flex items-center">
                    {i > 0 && arr[i - 1] !== page - 1 && (
                      <span
                        className="px-1 text-[10px]"
                        style={{ color: T.muted }}
                      >
                        …
                      </span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 flex items-center justify-center text-[11px] transition-all"
                      style={{
                        borderRadius: "2px",
                        fontFamily: "Outfit, sans-serif",
                        border: `1px solid ${currentPage === page ? T.borderHover : T.border}`,
                        background:
                          currentPage === page ? T.cream : "transparent",
                        color: currentPage === page ? T.bg : T.muted,
                      }}
                    >
                      {page}
                    </button>
                  </div>
                ))}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center transition-all disabled:opacity-30"
                style={{
                  border: `1px solid ${T.border}`,
                  borderRadius: "2px",
                  color: T.muted,
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== totalPages) {
                    e.currentTarget.style.borderColor = T.borderHover;
                    e.currentTarget.style.color = T.cream;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = T.border;
                  e.currentTarget.style.color = T.muted;
                }}
              >
                <IconChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
