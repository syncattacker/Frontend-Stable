"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  RiAddLine as PlusIcon,
  RiPencilLine as PencilIcon,
  RiDeleteBinLine as TrashIcon,
  RiEyeLine as EyeIcon,
  RiEyeOffLine as EyeSlashIcon,
  RiUploadCloud2Line as DocumentArrowUpIcon,
  RiCloseLine as XMarkIcon,
  RiUserLine as UserIcon,
  RiTrophyLine as TrophyIcon,
  RiFlagLine as FlagIcon,
  RiArrowRightUpLine as ArrowTopRightOnSquareIcon,
  RiGroupLine as UsersIcon,
  RiPlayLine as PlayIcon,
  RiStopLine as StopIcon,
  RiGlobalLine as GlobeAltIcon,
  RiPauseLine as PauseIcon,
  RiCheckboxCircleLine as CheckCircleIcon,
  RiLockLine as LockClosedIcon,
  RiLockUnlockLine as LockOpenIcon,
  RiArrowUpSLine,
  RiArrowDownSLine,
  RiFilter3Line,
  RiSortAsc,
  RiSortDesc,
} from "@remixicon/react";
import API from "@/utils/axios";
import { showToast } from "@/utils/toast.jsx";
import watermark from "@/img/white.svg";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import UserStats from "@/components/season/UserStats";
import { withAuth } from "@/utils/withAuth";

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

const CHALLENGE_CATEGORIES = [
  "Cryptography",
  "Forensics",
  "Reverse Engineering",
  "Binary Exploitation",
  "Web Exploitation",
  "OSINT",
  "Miscellaneous",
  "System / Privilege Escalation",
  "Mobile",
  "OT / Firmware",
  "Network",
  "Blockchain",
  "AI / ML",
  "Steganography",
  "Social Engineering",
  "Programming",
  "Other",
];

const Spinner = ({ size = 14, dark = false }) => (
  <div
    className="animate-spin shrink-0"
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      border: `1.5px solid ${dark ? "rgba(0,0,0,0.15)" : T.border}`,
      borderTopColor: dark ? T.bg : T.cream,
    }}
  />
);

const Eyebrow = ({ children, style: s = {} }) => (
  <p
    className="text-[9px] uppercase tracking-[0.2em]"
    style={{ color: T.muted, fontFamily: "Outfit, sans-serif", ...s }}
  >
    {children}
  </p>
);

const PageHeader = ({ crumb, title, sub }) => (
  <div className="mb-8">
    <Eyebrow>{crumb}</Eyebrow>
    <h1
      className="uppercase leading-none mt-1"
      style={{
        color: T.cream,
        fontFamily: "Bebas Neue, sans-serif",
        fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
        letterSpacing: "-0.03em",
      }}
    >
      {title}
    </h1>
    {sub && (
      <div className="flex items-center gap-3 mt-2">
        <div className="h-px w-6" style={{ background: T.cream }} />
        <p
          className="text-sm"
          style={{ color: T.muted, fontFamily: "Outfit, sans-serif" }}
        >
          {sub}
        </p>
      </div>
    )}
  </div>
);

const EmptyState = ({ icon: Icon, title, desc, action }) => (
  <div className="flex items-center justify-center min-h-[30vh]">
    <div className="text-center">
      {Icon && (
        <Icon className="h-8 w-8 mx-auto mb-3" style={{ color: T.muted }} />
      )}
      <p
        className="text-[11px] uppercase tracking-widest mb-1"
        style={{ color: T.muted, fontFamily: "Outfit, sans-serif" }}
      >
        {title}
      </p>
      {desc && (
        <p
          className="text-xs mt-1 max-w-xs mx-auto"
          style={{ color: T.muted, fontFamily: "Outfit, sans-serif" }}
        >
          {desc}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  </div>
);

const LoadingState = ({ label = "Loading..." }) => (
  <div className="flex items-center justify-center min-h-[30vh]">
    <div className="text-center">
      <div
        className="w-8 h-8 border border-current border-t-transparent rounded-full animate-spin mx-auto mb-4"
        style={{ color: T.muted }}
      />
      <p
        className="text-[11px] uppercase tracking-widest"
        style={{ color: T.muted, fontFamily: "Outfit, sans-serif" }}
      >
        {label}
      </p>
    </div>
  </div>
);

const StatusBadge = ({ children, color = "muted" }) => {
  const map = {
    green: ["rgba(74,222,128,0.35)", "#4ade80"],
    red: ["rgba(239,68,68,0.35)", "#f87171"],
    yellow: ["rgba(250,204,21,0.35)", "#facc15"],
    cream: [T.borderHover, T.cream],
    muted: [T.border, T.muted],
  };
  const [b, t] = map[color] || map.muted;
  return (
    <span
      className="text-[9px] uppercase tracking-widest px-2 py-1 inline-block"
      style={{
        border: `1px solid ${b}`,
        color: t,
        borderRadius: "2px",
        fontFamily: "Outfit, sans-serif",
      }}
    >
      {children}
    </span>
  );
};

const PrimaryBtn = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`px-5 py-2 text-[10px] uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 ${className}`}
    style={{
      background: T.cream,
      color: T.bg,
      borderRadius: "2px",
      fontFamily: "Outfit, sans-serif",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
  >
    {children}
  </button>
);

const GhostBtn = ({ children, danger = false, className = "", ...props }) => (
  <button
    {...props}
    className={`px-5 py-2 text-[10px] uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 ${className}`}
    style={{
      border: `1px solid ${danger ? "rgba(239,68,68,0.25)" : T.border}`,
      color: danger ? "rgba(239,68,68,0.7)" : T.muted,
      borderRadius: "2px",
      fontFamily: "Outfit, sans-serif",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = danger
        ? "rgba(239,68,68,0.5)"
        : T.borderHover;
      e.currentTarget.style.color = danger ? "#f87171" : T.cream;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = danger
        ? "rgba(239,68,68,0.25)"
        : T.border;
      e.currentTarget.style.color = danger ? "rgba(239,68,68,0.7)" : T.muted;
    }}
  >
    {children}
  </button>
);

const BanBtn = ({ isBanned, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="text-[10px] uppercase tracking-widest px-3 py-1.5 transition-all disabled:opacity-30 flex items-center gap-1.5"
    style={{
      border: `1px solid ${isBanned ? "rgba(74,222,128,0.3)" : "rgba(239,68,68,0.25)"}`,
      color: isBanned ? "#4ade80" : "rgba(239,68,68,0.7)",
      borderRadius: "2px",
      fontFamily: "Outfit, sans-serif",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = isBanned
        ? "rgba(74,222,128,0.6)"
        : "rgba(239,68,68,0.5)";
      e.currentTarget.style.color = isBanned ? "#4ade80" : "#f87171";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = isBanned
        ? "rgba(74,222,128,0.3)"
        : "rgba(239,68,68,0.25)";
      e.currentTarget.style.color = isBanned
        ? "#4ade80"
        : "rgba(239,68,68,0.7)";
    }}
  >
    {disabled ? <Spinner size={11} /> : isBanned ? "Unban" : "Ban"}
  </button>
);

const CustomSelect = ({
  value,
  onChange,
  options,
  placeholder = "Select...",
  disabled = false,
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find(
    (o) => (typeof o === "string" ? o : o.value) === value,
  );
  const label = selected
    ? typeof selected === "string"
      ? selected
      : selected.label
    : placeholder;

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      style={{ fontFamily: "Outfit, sans-serif" }}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-all disabled:opacity-40"
        style={{ ...inputStyle, color: selected ? T.cream : T.muted }}
        onMouseEnter={(e) =>
          !disabled && (e.currentTarget.style.borderColor = T.borderHover)
        }
        onMouseLeave={(e) =>
          !disabled && (e.currentTarget.style.borderColor = T.border)
        }
      >
        <span className="truncate">{label}</span>
        <svg
          className="w-3 h-3 shrink-0 ml-2 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{
            color: T.muted,
            transform: open ? "rotate(180deg)" : "rotate(0)",
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {open && (
        <div
          className="absolute z-50 w-full mt-px max-h-56 overflow-y-auto"
          style={{
            background: T.bg,
            border: `1px solid ${T.borderHover}`,
            borderRadius: "2px",
          }}
        >
          {options.map((opt, i) => {
            const val = typeof opt === "string" ? opt : opt.value;
            const lbl = typeof opt === "string" ? opt : opt.label;
            const active = val === value;
            return (
              <button
                key={i}
                type="button"
                className="w-full text-left px-4 py-2 text-sm transition-all"
                style={{
                  color: active ? T.cream : T.muted,
                  background: active ? "rgba(254,252,232,0.05)" : "transparent",
                  borderBottom:
                    i < options.length - 1 ? `1px solid ${T.border}` : "none",
                  fontFamily: "Outfit, sans-serif",
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.background = T.card;
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = "transparent";
                }}
                onClick={() => {
                  onChange(val);
                  setOpen(false);
                }}
              >
                <div className="flex items-center justify-between">
                  <span>{lbl}</span>
                  {active && (
                    <div
                      className="w-1 h-1 rounded-full"
                      style={{ background: T.cream }}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const SortHeader = ({ label, field, sortBy, sortDir, onSort }) => {
  const active = sortBy === field;
  return (
    <button
      onClick={() => onSort(field)}
      className="flex items-center gap-2 py-[4px] transition-all"
      style={{ fontFamily: "Outfit, sans-serif" }}
    >
      <span
        className="text-[12px] font-semibold tracking-[0.18em] transition-colors"
        style={{ color: active ? T.cream : T.muted }}
      >
        {label}
      </span>
      <div className="flex gap-1">
        <span
          className="text-[12px] font-bold transition-colors"
          style={{
            color:
              active && sortDir === "asc" ? T.cream : "rgba(161,161,170,0.5)",
          }}
        >
          ↑
        </span>
        <span
          className="text-[12px] font-bold transition-colors"
          style={{
            color:
              active && sortDir === "desc" ? T.cream : "rgba(161,161,170,0.5)",
          }}
        >
          ↓
        </span>
      </div>
    </button>
  );
};
const Modal = ({
  title,
  onClose,
  children,
  wide = false,
  disabled = false,
}) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ background: "rgba(0,0,0,0.88)" }}
  >
    <div
      className={`w-full flex flex-col max-h-[92vh] ${wide ? "max-w-5xl" : "max-w-md"}`}
      style={{
        background: T.bg,
        border: `1px solid ${T.border}`,
        borderRadius: "2px",
      }}
    >
      <div
        className="flex items-center justify-between px-5 py-3 shrink-0"
        style={{ borderBottom: `1px solid ${T.border}` }}
      >
        <h3
          className="text-sm uppercase tracking-widest"
          style={{ color: T.cream, fontFamily: "Outfit, sans-serif" }}
        >
          {title}
        </h3>
        <button
          onClick={onClose}
          disabled={disabled}
          className="transition-all disabled:opacity-30"
          style={{ color: T.muted }}
          onMouseEnter={(e) => (e.currentTarget.style.color = T.cream)}
          onMouseLeave={(e) => (e.currentTarget.style.color = T.muted)}
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="overflow-y-auto flex-1">{children}</div>
    </div>
  </div>
);

const ModalFooter = ({ children }) => (
  <div
    className="flex justify-end gap-2 px-5 py-4 shrink-0"
    style={{ borderTop: `1px solid ${T.border}` }}
  >
    {children}
  </div>
);

const diffColor = (d = "") =>
  d === "easy" ? "#4ade80" : d === "medium" ? "#facc15" : "#f87171";
const DIFF_ORDER = { easy: 1, medium: 2, hard: 3 };

export default withAuth(function SeasonStudio() {
  const router = useRouter();
  const params = useParams();
  const slugFromUrl = params?.slug;
  const [seasons, setSeasons] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [teamsData, setTeamsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [challenges, setChallenges] = useState([]);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [permissions, setPermissions] = useState([]);
  const [tagInput, setTagInput] = React.useState("");
  const [seasonMode, setSeasonMode] = useState("solo");
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [revealedFlag, setRevealedFlag] = useState(null);
  const [banningTeamId, setBanningTeamId] = useState("");
  const [banningUserId, setBanningUserId] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  const [pausingSeason, setPausingSeason] = useState(false);
  const [showFlagValue, setShowFlagValue] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [webhookLoading, setWebhookLoading] = useState(false);
  const [participantsData, setParticipantsData] = useState([]);
  const [revealFlagModal, setRevealFlagModal] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState(null);
  const [challengeLoading, setChallengeLoading] = useState(false);
  const [publishingSeason, setPublishingSeason] = useState(false);
  const [deletingSeasonSlug, setDeletingSeasonSlug] = useState("");
  const [participantsError, setParticipantsError] = useState(null);
  const [revealFlagPassword, setRevealFlagPassword] = useState("");
  const [revealFlagLoading, setRevealFlagLoading] = useState(false);
  const [isDiscordConnected, setIsDiscordConnected] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [revealFlagChallenge, setRevealFlagChallenge] = useState(null);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [deleteSeasonLoading, setDeleteSeasonLoading] = useState(false);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [sendingNotification, setSendingNotification] = useState(false);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [deletingAdminUsername, setDeletingAdminUsername] = useState("");
  const [showParticipantModal, setShowParticipantModal] = useState(false);
  const [showDeleteSeasonModal, setShowDeleteSeasonModal] = useState(false);
  const [bulkVisibilityLoading, setBulkVisibilityLoading] = useState(false);
  const [newMember, setNewMember] = useState({ username: "", role: "viewer" });
  const [adminsData, setAdminsData] = useState({ organizer: null, admins: [] });
  const [showBulkVisibilityModal, setShowBulkVisibilityModal] = useState(false);
  const [showWebhookSuccessModal, setShowWebhookSuccessModal] = useState(false);
  const [showExportComingSoonModal, setShowExportComingSoonModal] =
    useState(false);

  const [seasonData, setSeasonData] = useState({
    name: "",
    description: "",
    timing: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    published: false,
    slug: "",
  });
  const ROLES = ["admin", "challenge_manager", "moderator", "viewer"];
  const ITEMS_PER_PAGE = 15;

  const [bulkVisibilityForm, setBulkVisibilityForm] = useState({
    difficulty: "",
    isVisible: true,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSeason]);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const [challengeForm, setChallengeForm] = useState({
    name: "",
    category: "",
    difficulty: "Easy",
    points: 100,
    flagFormat: "GPI{...}",
    flag: "",
    description: "",
    tags: [],
    file: null,
  });

  const [notificationForm, setNotificationForm] = useState({
    type: "ANNOUNCEMENT",
    message: "",
  });

  // ── Challenge sort & filter ──
  const [challengeSortBy, setChallengeSortBy] = useState("name");
  const [challengeSortDir, setChallengeSortDir] = useState("asc");
  const [challengeFilterDiff, setChallengeFilterDiff] = useState("");
  const [challengeFilterCat, setChallengeFilterCat] = useState("");

  const can = (p) => Array.isArray(permissions) && permissions.includes(p);

  const fetchAdminContext = async () => {
    if (!selectedSeason?.slug) return;
    try {
      const res = await API.get(
        `/api/v1/seasons/${selectedSeason.slug}/admin-context`,
      );
      setPermissions(res.data.permissions || []);
    } catch (e) {
      console.error("Error fetching admin context:", e);
      setPermissions([]);
    }
  };

  const toggleParticipantBan = async (participant) => {
    if (!selectedSeason) return;

    const action = participant.isBanned ? "unban" : "ban";
    if (!confirm(`Are you sure you want to ${action} ${participant.username}?`))
      return;

    setBanningUserId(participant.userId || participant.username);
    try {
      const response = await API.patch(
        `/api/v1/organizer/${selectedSeason.slug}/participant/toggle-ban`,
        {
          username: participant.username,
          seasonSlug: selectedSeason.slug,
          ban: !participant.isBanned,
        },
      );

      if (response.data.success) {
        if (seasonMode === "solo") {
          setParticipantsData((prev) =>
            prev.map((p) =>
              p.username === participant.username
                ? { ...p, isBanned: response.data.isBanned }
                : p,
            ),
          );
        } else {
          setTeamsData((prev) =>
            prev.map((team) => ({
              ...team,
              members: team.members.map((m) =>
                m.username === participant.username
                  ? { ...m, isBanned: response.data.isBanned }
                  : m,
              ),
            })),
          );
        }
        showToast("success", response.data.message);
        if (
          selectedParticipant &&
          selectedParticipant.name === participant.username
        ) {
          setSelectedParticipant((prev) => ({
            ...prev,
            status: response.data.isBanned ? "banned" : "active",
          }));
        }
      } else {
        showToast(
          "error",
          response.data.message || "Failed to update participant status",
        );
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    } finally {
      setBanningUserId("");
    }
  };

  const toggleTeamBan = async (team) => {
    if (!selectedSeason) return;

    const action = team.isBanned ? "unban" : "ban";
    if (!confirm(`Are you sure you want to ${action} team "${team.teamName}"?`))
      return;

    setBanningTeamId(team.teamId);
    try {
      const response = await API.patch(
        `/api/v1/organizer/${selectedSeason.slug}/team/toggle-ban`,
        {
          teamId: team.teamId,
          seasonSlug: selectedSeason.slug,
          ban: !team.isBanned,
        },
      );

      if (response.data.success) {
        setTeamsData((prev) =>
          prev.map((t) =>
            t.teamId === team.teamId
              ? { ...t, isBanned: response.data.isBanned }
              : t,
          ),
        );
        showToast("success", response.data.message);
      } else {
        showToast(
          "error",
          response.data.message || "Failed to update team status",
        );
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    } finally {
      setBanningTeamId("");
    }
  };

  const revealFlag = async () => {
    if (!selectedSeason || !revealFlagChallenge || !revealFlagPassword) return;
    setRevealFlagLoading(true);
    try {
      const response = await API.post(
        `/api/v1/organizer/${selectedSeason.slug}/challenges/${revealFlagChallenge.slug}/reveal-flag`,
        { password: revealFlagPassword },
      );
      if (response.data.success) {
        setRevealedFlag(response.data.data.flag);
        setShowFlagValue(false);
      } else {
        showToast("error", response.data.message || "Failed to reveal flag");
      }
    } catch (error) {
      showToast(
        "error",
        error.response?.data?.message || "Incorrect password or unauthorized",
      );
    } finally {
      setRevealFlagLoading(false);
    }
  };

  const openRevealFlagModal = (challenge) => {
    setRevealFlagChallenge(challenge);
    setRevealFlagPassword("");
    setRevealedFlag(null);
    setShowFlagValue(false);
    setRevealFlagModal(true);
  };

  const closeRevealFlagModal = () => {
    setRevealFlagModal(false);
    setRevealFlagChallenge(null);
    setRevealFlagPassword("");
    setRevealedFlag(null);
    setShowFlagValue(false);
  };

  const fetchAdmins = async () => {
    if (!selectedSeason?.slug) return;
    setAdminLoading(true);
    try {
      const response = await API.get(
        `/api/v1/organizer/${selectedSeason.slug}/admins`,
      );
      if (response.data.success) setAdminsData(response.data.data);
    } catch (error) {
      showToast(
        "error",
        error.response?.data?.message || "Failed to fetch admins",
      );
    } finally {
      setAdminLoading(false);
    }
  };

  const sendNotification = async () => {
    if (!selectedSeason || !notificationForm.message.trim()) {
      showToast("error", "Please provide a notification message");
      return;
    }
    setSendingNotification(true);
    try {
      const response = await API.post(
        `/api/v1/seasons/notifications/${selectedSeason.slug}`,
        {
          type: notificationForm.type,
          message: notificationForm.message.trim(),
        },
      );
      if (response.data.success) {
        showToast("success", "Notification sent successfully!");
        setNotificationForm({ type: "ANNOUNCEMENT", message: "" });
      } else {
        showToast(
          "error",
          response.data.message || "Failed to send notification",
        );
      }
    } catch (error) {
      showToast(
        "error",
        error.response?.data?.message || "Failed to send notification",
      );
    } finally {
      setSendingNotification(false);
    }
  };

  const handleDeleteAdmin = async (username) => {
    if (!selectedSeason?.slug || !username) return;
    if (!confirm(`Are you sure you want to remove ${username} as an admin?`))
      return;
    setDeletingAdminUsername(username);
    try {
      const response = await API.delete(
        `/api/v1/organizer/${selectedSeason.slug}/admins`,
        { data: { username } },
      );
      if (response.data.success) {
        showToast(
          "success",
          response.data.message || "Admin removed successfully",
        );
        fetchAdmins();
      }
    } catch (error) {
      showToast(
        "error",
        error.response?.data?.message || "Failed to remove admin",
      );
    } finally {
      setDeletingAdminUsername("");
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMember.username.trim()) return;
    setAddingAdmin(true);
    try {
      const response = await API.post(
        `/api/v1/organizer/${selectedSeason.slug}/admins`,
        { username: newMember.username.trim(), role: newMember.role },
      );
      if (response.data.success) {
        showToast("success", response.data.message);
        setNewMember({ username: "", role: "viewer" });
        fetchAdmins();
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    } finally {
      setAddingAdmin(false);
    }
  };

  useEffect(() => {
    if (selectedSeason && activeTab === 3) fetchAdmins();
  }, [selectedSeason, activeTab]);

  const fetchParticipants = async () => {
    if (!selectedSeason) return;
    setParticipantsLoading(true);
    setParticipantsError(null);
    try {
      const response = await API.get(
        `/api/v1/organizer/${selectedSeason.slug}/participants`,
      );
      if (response.data.success) {
        if (response.data.mode === "team") {
          setTeamsData(response.data.teams || []);
          setParticipantsData([]);
          setSeasonMode("team");
        } else {
          setParticipantsData(response.data.participants || []);
          setTeamsData([]);
          setSeasonMode("solo");
        }
      } else {
        setParticipantsError("Failed to fetch participants");
      }
    } catch (error) {
      setParticipantsError(
        error.response?.data?.message || "Error loading participants",
      );
    } finally {
      setParticipantsLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedSeason) return;
    fetchAdminContext();
  }, [selectedSeason]);

  useEffect(() => {
    if (!selectedSeason || permissions.length === 0) return;
    if (can("participant.view")) fetchParticipants();
  }, [selectedSeason, permissions]);

  const tabs = React.useMemo(() => {
    return [
      { id: 0, name: "Season Details" },
      can("challenge.view") && { id: 1, name: "CTF Challenges" },
      can("participant.view") && { id: 2, name: "Participants" },
      can("admin.manage") && { id: 3, name: "Admins" },
      can("notification.send") && { id: 4, name: "Send Notification" },
      can("score.view") && { id: 5, name: "User Stats" },
    ].filter(Boolean);
  }, [permissions]);

  const fetchSeasons = async () => {
    setLoading(true);
    try {
      const response = await API.get("api/v1/seasons/editable");
      if (response.data.success) {
        const allSeasons = [
          ...response.data.data.pending,
          ...response.data.data.approved,
        ];
        setSeasons(allSeasons);

        const target = slugFromUrl
          ? allSeasons.find((s) => s.slug === slugFromUrl)
          : response.data.data.approved[0];

        if (target) handleSeasonSelect(target);
      }
    } catch (error) {
      console.error("Error fetching seasons:", error);
    } finally {
      setLoading(false);
    }
  };

  const openRegistration = async () => {
    if (!selectedSeason) return;
    setRegistrationLoading(true);
    try {
      const response = await API.patch(
        `/api/v1/organizer/${selectedSeason.slug}/registration`,
      );
      if (response.data.success) {
        setSelectedSeason((prev) => ({ ...prev, isRegistrationOpen: true }));
        setSeasons((prev) =>
          prev.map((s) =>
            s.slug === selectedSeason.slug
              ? { ...s, isRegistrationOpen: true }
              : s,
          ),
        );
        showToast("success", response.data.message);
      } else {
        showToast(
          "error",
          response.data.message || "Failed to open registration",
        );
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    } finally {
      setRegistrationLoading(false);
    }
  };

  const closeRegistration = async () => {
    if (!selectedSeason) return;
    setRegistrationLoading(true);
    try {
      const response = await API.patch(
        `/api/v1/organizer/${selectedSeason.slug}/registration`,
      );
      if (response.data.success) {
        setSelectedSeason((prev) => ({ ...prev, isRegistrationOpen: false }));
        setSeasons((prev) =>
          prev.map((s) =>
            s.slug === selectedSeason.slug
              ? { ...s, isRegistrationOpen: false }
              : s,
          ),
        );
        showToast("success", response.data.message);
      } else {
        showToast(
          "error",
          response.data.message || "Failed to close registration",
        );
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    } finally {
      setRegistrationLoading(false);
    }
  };

  const fetchChallenges = async (seasonSlug) => {
    if (!seasonSlug) return;
    setChallengeLoading(true);
    try {
      const response = await API.get(
        `/api/v1/organizer/${seasonSlug}/challenges`,
      );
      if (response.data.success) setChallenges(response.data.challenges || []);
    } catch (error) {
      setChallenges([]);
    } finally {
      setChallengeLoading(false);
    }
  };

  useEffect(() => {
    fetchSeasons();
  }, []);

  const handleSeasonSelect = (season) => {
    setSelectedSeason(season);
    const startDate = season.startDate ? new Date(season.startDate) : null;
    const endDate = season.endDate ? new Date(season.endDate) : null;
    setWebhookUrl("");
    setIsDiscordConnected(season.isDiscordConnected || false);
    setSeasonData({
      name: season.name,
      description: season.description || "",
      timing: "",
      startDate: startDate ? startDate.toISOString().split("T")[0] : "",
      endDate: endDate ? endDate.toISOString().split("T")[0] : "",
      startTime:
        season.startTime ||
        (startDate ? startDate.toTimeString().slice(0, 5) : ""),
      endTime:
        season.endTime || (endDate ? endDate.toTimeString().slice(0, 5) : ""),
      published: season.isPublished,
      isRegistrationOpen: season.isRegistrationOpen,
      isPaused: season.isPaused || false,
      slug: season.slug,
    });
    fetchChallenges(season.slug);
  };

  const updateWebhook = async () => {
    if (!selectedSeason) return;
    setWebhookLoading(true);
    try {
      const response = await API.patch(
        `/api/v1/organizer/${selectedSeason.slug}/webhook`,
        { discordWebhookUrl: webhookUrl },
      );
      if (response.data.success) {
        showToast("success", response.data.message || "Webhook updated");
        setShowWebhookSuccessModal(true);
        setIsDiscordConnected(true);
      } else {
        showToast("error", response.data.message || "Failed to update webhook");
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    } finally {
      setWebhookLoading(false);
    }
  };

  const formatDisplayDate = (isoString) => {
    if (!isoString) return "—";
    return new Date(isoString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDisplayTime = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const publishSeason = async () => {
    if (!selectedSeason) return;
    setPublishingSeason(true);
    try {
      const response = await API.patch(
        `/api/v1/organizer/${selectedSeason.slug}/publish`,
      );
      if (response.data.success) {
        setSeasonData((prev) => ({ ...prev, published: true }));
        setSelectedSeason((prev) => ({ ...prev, isPublished: true }));
        setSeasons((prev) =>
          prev.map((s) =>
            s.slug === selectedSeason.slug ? { ...s, isPublished: true } : s,
          ),
        );
        showToast("success", response.data.message);
      } else {
        showToast("error", response.data.message || "Unknown error");
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    } finally {
      setPublishingSeason(false);
    }
  };

  const pauseSeason = async () => {
    if (!selectedSeason) return;
    setPausingSeason(true);
    try {
      const response = await API.patch(
        `/api/v1/organizer/${selectedSeason.slug}/pause`,
      );
      if (response.data.success) {
        const { isPaused } = response.data;
        setSeasonData((prev) => ({ ...prev, isPaused }));
        setSelectedSeason((prev) => ({ ...prev, isPaused }));
        setSeasons((prev) =>
          prev.map((s) =>
            s.slug === selectedSeason.slug ? { ...s, isPaused } : s,
          ),
        );
        showToast("success", response.data.message);
      } else {
        showToast("error", response.data.message || "Unknown error");
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    } finally {
      setPausingSeason(false);
    }
  };

  const exportData = async () => {
    setShowExportComingSoonModal(true);
  };

  const uploadFileToS3 = async (seasonSlug, file) => {
    const presignResponse = await API.post(
      `/api/v1/organizer/${seasonSlug}/challenge/upload-url`,
      { filename: file.name },
    );
    const { uploadUrl, fileKey } = presignResponse.data.data;
    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
    });
    if (!uploadResponse.ok) throw new Error("File upload to S3 failed");
    return fileKey;
  };

  const saveChallenge = async () => {
    if (!selectedSeason) {
      showToast("error", "Please select a season first");
      return;
    }
    setChallengeLoading(true);
    if (challengeForm.flag) {
      const formatPattern = challengeForm.flagFormat.replace(/\{[^}]*\}/, "{}");
      const flagPattern = challengeForm.flag.replace(/\{[^}]*\}/, "{}");
      if (formatPattern !== flagPattern) {
        showToast("error", "Flag format and flag value must match");
        return;
      }
    }
    try {
      let fileKey = null;
      if (challengeForm.file)
        fileKey = await uploadFileToS3(selectedSeason.slug, challengeForm.file);
      const payload = {
        name: challengeForm.name || `${challengeForm.category} Challenge`,
        description: challengeForm.description,
        category: challengeForm.category,
        difficulty: challengeForm.difficulty.toLowerCase(),
        points: Number(challengeForm.points),
        flagFormat: challengeForm.flagFormat,
        tags: challengeForm.tags,
        fileKey,
      };
      if (challengeForm.flag) payload.flag = challengeForm.flag;
      let response;
      if (editingChallenge) {
        payload.challengeSlug = editingChallenge.slug;
        response = await API.patch(
          `/api/v1/organizer/${selectedSeason.slug}/challenge`,
          payload,
          { headers: { "Content-Type": "application/json" } },
        );
      } else {
        response = await API.post(
          `/api/v1/organizer/${selectedSeason.slug}/challenge`,
          payload,
          { headers: { "Content-Type": "application/json" } },
        );
      }
      if (response.data.success) {
        fetchChallenges(selectedSeason.slug);
        setShowChallengeModal(false);
        resetChallengeForm();
        showToast(
          "success",
          editingChallenge
            ? "Challenge updated successfully"
            : "Challenge created successfully",
        );
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    } finally {
      setChallengeLoading(false);
    }
  };

  const resetChallengeForm = () => {
    setChallengeForm({
      name: "",
      category: "",
      difficulty: "Easy",
      points: 100,
      flagFormat: "GPI{...}",
      flag: "",
      description: "",
      tags: [],
      file: null,
    });
    setEditingChallenge(null);
  };

  const handleChallengeFormChange = (e) => {
    const { name, value } = e.target;
    setChallengeForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setChallengeForm((prev) => ({ ...prev, file: e.target.files[0] || null }));
  };

  const openNewChallengeModal = () => {
    setChallengeForm({
      name: "",
      category: "",
      difficulty: "Easy",
      points: 100,
      flagFormat: "GPI{...}",
      flag: "",
      description: "",
      tags: [],
      file: null,
    });
    setEditingChallenge(null);
    setShowChallengeModal(true);
  };

  const openEditChallengeModal = (challenge) => {
    setChallengeForm({
      name: challenge.name || "",
      category: challenge.category || "",
      difficulty: challenge.difficulty
        ? challenge.difficulty.charAt(0).toUpperCase() +
          challenge.difficulty.slice(1)
        : "Easy",
      points: challenge.points || 100,
      flagFormat: challenge.flagFormat || "GPI{...}",
      flag: challenge.flag || "",
      description: challenge.description || "",
      tags: challenge.tags || [],
      file: null,
    });
    setEditingChallenge(challenge);
    setShowChallengeModal(true);
  };

  const deleteSeason = async () => {
    if (!selectedSeason) return;
    setDeleteSeasonLoading(true);
    try {
      const response = await API.delete(
        `/api/v1/organizer/${selectedSeason.slug}/delete`,
      );
      if (response.status === 204 || response.data?.success) {
        setSeasons((prev) =>
          prev.filter((s) => s.slug !== selectedSeason.slug),
        );
        setSelectedSeason(null);
        setSeasonData({
          name: "",
          description: "",
          timing: "",
          startDate: "",
          endDate: "",
          startTime: "",
          endTime: "",
          published: false,
          slug: "",
        });
        setChallenges([]);
        setParticipantsData([]);
        setTeamsData([]);
        setShowDeleteSeasonModal(false);
        setDeletingSeasonSlug("");
        showToast("success", "Season deleted successfully");
        setActiveTab(0);
      } else {
        showToast("error", response.data?.message || "Failed to delete season");
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    } finally {
      setDeleteSeasonLoading(false);
    }
  };

  const deleteChallenge = async (challenge) => {
    if (!selectedSeason) return;
    if (
      !confirm(
        "Are you sure you want to delete this challenge? This action cannot be undone.",
      )
    )
      return;
    setChallengeLoading(true);
    try {
      const response = await API.delete(
        `/api/v1/organizer/${selectedSeason.slug}/challenge`,
        { data: { challengeSlug: challenge.slug } },
      );
      if (response.status === 204) {
        setChallenges((prev) => prev.filter((c) => c.slug !== challenge.slug));
        showToast("success", "Challenge deleted successfully!");
      } else {
        showToast("error", "Failed to delete challenge");
      }
    } catch (error) {
      showToast(
        "error",
        error.response?.data?.message ||
          error.message ||
          "Failed to delete challenge",
      );
    } finally {
      setChallengeLoading(false);
    }
  };

  const toggleVisibility = async (challenge) => {
    if (!selectedSeason) return;
    setChallengeLoading(true);
    try {
      const response = await API.patch(
        `/api/v1/organizer/${selectedSeason.slug}/challenge/visibility`,
        {
          slug: challenge.slug,
          seasonSlug: selectedSeason.slug,
          isVisible: !challenge.isVisible,
        },
        { headers: { "Content-Type": "application/json" } },
      );
      if (response.data.success) {
        setChallenges((prev) =>
          prev.map((c) =>
            c.slug === challenge.slug ? { ...c, isVisible: !c.isVisible } : c,
          ),
        );
        showToast("success", response.data.message);
      } else {
        showToast("error", response.data.message || "Unknown error");
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    } finally {
      setChallengeLoading(false);
    }
  };

  const handleBulkVisibilityToggle = async () => {
    if (!selectedSeason || !bulkVisibilityForm.difficulty) return;
    setBulkVisibilityLoading(true);
    try {
      const response = await API.patch(
        `/api/v1/organizer/${selectedSeason.slug}/challenge/visibility`,
        {
          difficulty: bulkVisibilityForm.difficulty.toLowerCase(),
          seasonSlug: selectedSeason.slug,
          isVisible: bulkVisibilityForm.isVisible,
        },
        { headers: { "Content-Type": "application/json" } },
      );
      if (response.data.success) {
        setChallenges((prev) =>
          prev.map((c) =>
            c.difficulty.toLowerCase() ===
            bulkVisibilityForm.difficulty.toLowerCase()
              ? { ...c, isVisible: bulkVisibilityForm.isVisible }
              : c,
          ),
        );
        showToast("success", response.data.message);
        setShowBulkVisibilityModal(false);
        setBulkVisibilityForm({ difficulty: "", isVisible: true });
      } else {
        showToast("error", response.data.message || "Unknown error");
      }
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    } finally {
      setBulkVisibilityLoading(false);
    }
  };

  const viewParticipant = (participant) => {
    setSelectedParticipant({
      id: participant.userId || participant.username,
      name: participant.username,
      email: participant.email,
      status: participant.isBanned ? "banned" : "active",
      joinDate: participant.joinedAt,
      solves: participant.solves || [],
      _raw: participant,
    });
    setShowParticipantModal(true);
  };

  const removeFile = () =>
    setChallengeForm((prev) => ({ ...prev, file: null }));
  const filteredSoloParticipants = (participantsData || []).filter((p) =>
    p.username?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredTeams = (teamsData || []).filter((team) => {
    const q = searchTerm.toLowerCase();
    return (
      team.teamName?.toLowerCase().includes(q) ||
      team.members?.some((m) => m.username?.toLowerCase().includes(q))
    );
  });

  const totalSoloPages = Math.ceil(
    filteredSoloParticipants.length / ITEMS_PER_PAGE,
  );
  const paginatedSoloParticipants = filteredSoloParticipants.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const totalTeamPages = Math.ceil(filteredTeams.length / ITEMS_PER_PAGE);
  const paginatedTeams = filteredTeams.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const totalParticipantCount =
    seasonMode === "solo"
      ? participantsData.length
      : teamsData.flatMap((t) => t.members).length;

  const activeCount =
    seasonMode === "solo"
      ? participantsData.filter((p) => !p.isBanned).length
      : teamsData.flatMap((t) => t.members).filter((m) => !m.isBanned).length;

  const bannedCount =
    seasonMode === "solo"
      ? participantsData.filter((p) => p.isBanned).length
      : teamsData.flatMap((t) => t.members).filter((m) => m.isBanned).length;

  const hasParticipants =
    seasonMode === "solo" ? participantsData.length > 0 : teamsData.length > 0;

  // ── Challenge sort toggle ──
  const handleChallengeSort = (field) => {
    if (challengeSortBy === field) {
      setChallengeSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setChallengeSortBy(field);
      setChallengeSortDir("asc");
    }
  };

  // ── Filtered & sorted challenges ──
  const processedChallenges = useMemo(() => {
    let list = [...challenges];
    if (challengeFilterDiff)
      list = list.filter(
        (c) => c.difficulty?.toLowerCase() === challengeFilterDiff,
      );
    if (challengeFilterCat)
      list = list.filter((c) => c.category === challengeFilterCat);
    list.sort((a, b) => {
      const dir = challengeSortDir === "asc" ? 1 : -1;
      if (challengeSortBy === "name")
        return dir * (a.name || "").localeCompare(b.name || "");
      if (challengeSortBy === "difficulty")
        return (
          dir *
          ((DIFF_ORDER[a.difficulty] || 0) - (DIFF_ORDER[b.difficulty] || 0))
        );
      if (challengeSortBy === "points")
        return dir * ((a.points || 0) - (b.points || 0));
      if (challengeSortBy === "category")
        return dir * (a.category || "").localeCompare(b.category || "");
      return 0;
    });
    return list;
  }, [
    challenges,
    challengeSortBy,
    challengeSortDir,
    challengeFilterDiff,
    challengeFilterCat,
  ]);

  const activeChallengeCategories = useMemo(
    () => [...new Set(challenges.map((c) => c.category).filter(Boolean))],
    [challenges],
  );

  return (
    <div
      className="h-screen w-full flex flex-col overflow-hidden"
      style={{
        background: T.bg,
        color: T.cream,
        fontFamily: "Outfit, sans-serif",
      }}
    >
      {/* ── TOP NAV ── */}
      <header style={{ borderBottom: `1px solid ${T.border}` }}>
        <div className="px-6 h-12 flex items-center justify-between">
          <div className="flex items-center">
            {[
              {
                label: "Leaderboard",
                onClick: () =>
                  selectedSeason?.slug &&
                  router.push(
                    `/dashboard/seasons/${selectedSeason.slug}/leaderboard`,
                  ),
                disabled: !selectedSeason?.slug,
              },
              {
                label: "Profile",
                onClick: () => router.push("/dashboard/profile"),
              },
              {
                label: "Challenges",
                onClick: () =>
                  selectedSeason?.slug &&
                  router.push(
                    `/dashboard/seasons/${selectedSeason.slug}/challenges`,
                  ),
                disabled: !selectedSeason?.slug,
              },
              {
                label: "Create Season",
                onClick: () => router.push("/dashboard/host-your-event"),
              },
            ].map(({ label, onClick, disabled }, i, arr) => (
              <React.Fragment key={label}>
                <button
                  onClick={onClick}
                  disabled={disabled}
                  className="px-4 py-2 text-xs tracking-wide transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ color: T.muted, fontFamily: "Outfit, sans-serif" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = T.cream)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = T.muted)}
                >
                  {label}
                </button>
                {i < arr.length - 1 && (
                  <div
                    className="w-px h-3.5"
                    style={{ background: T.border }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
          <Image
            src={watermark}
            alt="GoPwnIt"
            height={28}
            className="w-auto opacity-90"
            priority
          />
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-49px)]">
        {/* ── SIDEBAR (untouched) ── */}
        <aside className="w-70 shrink-0 bg-[#0A0A0A] border-r border-[rgba(254,252,232,0.12)] min-h-screen sticky top-0 h-screen overflow-y-auto">
          <nav className="p-6">
            <div className="space-y-0.5">
              <h3 className="text-[9px] font-outfit text-[#a1a1aa] uppercase tracking-[0.25em] px-2 mb-3">
                Season Studio
              </h3>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2.5 text-left transition-colors duration-150 rounded-none border-l-2 text-xs tracking-wide ${activeTab === tab.id ? "border-[#fefce8] text-[#fefce8] bg-[#111111]" : "border-transparent text-[#a1a1aa] hover:text-[#fefce8] hover:bg-[#111111]"}`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
            <div className="my-6 h-px bg-[rgba(254,252,232,0.12)]" />
            {selectedSeason && (
              <div className="space-y-3">
                <h3 className="text-[9px] text-[#a1a1aa] uppercase tracking-[0.25em] px-2 mb-3">
                  Season Controls
                </h3>
                <div className="space-y-1.5">
                  {can("season.publish") && (
                    <button
                      onClick={publishSeason}
                      disabled={publishingSeason || seasonData.published}
                      className="w-full flex items-center gap-3 px-3 py-2.5 bg-[#fefce8] text-[#0A0A0A] text-xs tracking-wide uppercase font-medium transition-opacity duration-150 rounded-none disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <GlobeAltIcon className="h-3.5 w-3.5 shrink-0" />
                      <span>
                        {publishingSeason
                          ? "Publishing..."
                          : seasonData.published
                            ? "Published"
                            : "Publish Season"}
                      </span>
                    </button>
                  )}
                  {can("season.pause") && (
                    <button
                      onClick={pauseSeason}
                      disabled={pausingSeason || !seasonData.published}
                      className="w-full flex items-center gap-3 px-3 py-2.5 border border-[rgba(254,252,232,0.12)] hover:border-[rgba(254,252,232,0.22)] text-[#a1a1aa] hover:text-[#fefce8] text-xs tracking-wide uppercase font-medium transition-colors duration-150 rounded-none disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {selectedSeason?.isPaused ? (
                        <PlayIcon className="h-3.5 w-3.5 shrink-0" />
                      ) : (
                        <PauseIcon className="h-3.5 w-3.5 shrink-0" />
                      )}
                      <span>
                        {pausingSeason
                          ? selectedSeason?.isPaused
                            ? "Resuming..."
                            : "Pausing..."
                          : selectedSeason?.isPaused
                            ? "Resume Season"
                            : "Pause Season"}
                      </span>
                    </button>
                  )}
                  {can("season.registration.toggle") && (
                    <button
                      onClick={openRegistration}
                      disabled={
                        registrationLoading ||
                        selectedSeason?.isRegistrationOpen
                      }
                      className="w-full flex items-center gap-3 px-3 py-2.5 border border-[rgba(254,252,232,0.12)] hover:border-[rgba(254,252,232,0.22)] text-[#a1a1aa] hover:text-[#fefce8] text-xs tracking-wide uppercase font-medium transition-colors duration-150 rounded-none disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <PlayIcon className="h-3.5 w-3.5 shrink-0" />
                      <span>
                        {registrationLoading
                          ? "Processing..."
                          : selectedSeason?.isRegistrationOpen
                            ? "Registration Open"
                            : "Open Registration"}
                      </span>
                    </button>
                  )}
                  {can("season.registration.toggle") && (
                    <button
                      onClick={closeRegistration}
                      disabled={
                        registrationLoading ||
                        !selectedSeason?.isRegistrationOpen
                      }
                      className="w-full flex items-center gap-3 px-3 py-2.5 border border-[rgba(254,252,232,0.12)] hover:border-[rgba(254,252,232,0.22)] text-[#a1a1aa] hover:text-[#fefce8] text-xs tracking-wide uppercase font-medium transition-colors duration-150 rounded-none disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <StopIcon className="h-3.5 w-3.5 shrink-0" />
                      <span>
                        {registrationLoading
                          ? "Processing..."
                          : !selectedSeason?.isRegistrationOpen
                            ? "Registration Closed"
                            : "Close Registration"}
                      </span>
                    </button>
                  )}
                  <button
                    onClick={exportData}
                    disabled={
                      registrationLoading || !selectedSeason || !hasParticipants
                    }
                    className="w-full flex items-center gap-3 px-3 py-2.5 border border-[rgba(254,252,232,0.12)] hover:border-[rgba(254,252,232,0.22)] text-[#a1a1aa] hover:text-[#fefce8] text-xs tracking-wide uppercase font-medium transition-colors duration-150 rounded-none disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <svg
                      className="h-3.5 w-3.5 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span>
                      {!hasParticipants
                        ? "No Data to Export"
                        : "Export User Data"}
                    </span>
                  </button>
                  {can("season.delete") && (
                    <button
                      onClick={() => {
                        setDeletingSeasonSlug(selectedSeason.slug);
                        setShowDeleteSeasonModal(true);
                      }}
                      disabled={!selectedSeason}
                      className="w-full flex items-center gap-3 px-3 py-2.5 border border-red-900/50 hover:border-red-700/70 text-red-500 hover:text-red-400 text-xs tracking-wide uppercase font-medium transition-colors duration-150 rounded-none disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <TrashIcon className="h-3.5 w-3.5 shrink-0" />
                      <span>Delete Season</span>
                    </button>
                  )}
                  <button
                    onClick={() =>
                      router.push(`/dashboard/seasons/${selectedSeason.slug}`)
                    }
                    className="w-full flex items-center gap-3 px-3 py-2.5 bg-[#fefce8] text-[#0A0A0A] text-xs tracking-wide uppercase font-medium transition-opacity duration-150 rounded-none disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Go To Dashboard
                  </button>
                </div>
              </div>
            )}
          </nav>
        </aside>

        <main className="flex-1 min-w-0 px-10 py-6 overflow-y-auto">
          {activeTab === 0 && (
            <div className="w-full max-w-[1400px]">
              <PageHeader
                crumb="Season Studio / Overview"
                title="Season Details"
                sub={selectedSeason?.name}
              />
              {loading ? (
                <LoadingState label="Loading season details..." />
              ) : seasons.length === 0 ? (
                <EmptyState
                  icon={TrophyIcon}
                  title="No seasons available"
                  desc="Contact your administrator to create seasons"
                />
              ) : !selectedSeason ? (
                <EmptyState
                  icon={FlagIcon}
                  title="Select a season"
                  desc="Choose a season from the dropdown above"
                />
              ) : (
                <>
                  <div
                    className="grid grid-cols-2 lg:grid-cols-4 gap-px mb-6"
                    style={{ border: `1px solid ${T.border}` }}
                  >
                    <div className="p-5" style={{ background: T.card }}>
                      <Eyebrow>Season Name</Eyebrow>
                      <p
                        className="text-2xl leading-none mt-2"
                        style={{
                          fontFamily: "Bebas Neue, sans-serif",
                          color: T.cream,
                        }}
                      >
                        {seasonData.name}
                      </p>
                    </div>
                    <div className="p-5" style={{ background: T.card }}>
                      <Eyebrow>Status</Eyebrow>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <StatusBadge
                          color={selectedSeason.isApproved ? "cream" : "muted"}
                        >
                          {selectedSeason.isApproved ? "Approved" : "Pending"}
                        </StatusBadge>
                        {seasonData.published && (
                          <StatusBadge color="muted">Published</StatusBadge>
                        )}
                        {selectedSeason?.isPaused && (
                          <StatusBadge color="yellow">Paused</StatusBadge>
                        )}
                      </div>
                    </div>
                    <div className="p-5" style={{ background: T.card }}>
                      <Eyebrow>Start</Eyebrow>
                      <p className="text-sm mt-2" style={{ color: T.cream }}>
                        {formatDisplayDate(selectedSeason.startDate)}
                      </p>
                      {selectedSeason.startDate && (
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: T.muted, fontFamily: "monospace" }}
                        >
                          {formatDisplayTime(selectedSeason.startDate)}
                        </p>
                      )}
                    </div>
                    <div className="p-5" style={{ background: T.card }}>
                      <Eyebrow>End</Eyebrow>
                      <p className="text-sm mt-2" style={{ color: T.cream }}>
                        {formatDisplayDate(selectedSeason.endDate)}
                      </p>
                      {selectedSeason.endDate && (
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: T.muted, fontFamily: "monospace" }}
                        >
                          {formatDisplayTime(selectedSeason.endDate)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      border: `1px solid ${T.border}`,
                      borderRadius: "2px",
                    }}
                  >
                    <div
                      className="flex items-center justify-between px-5 py-4"
                      style={{ borderBottom: `1px solid ${T.border}` }}
                    >
                      <Eyebrow>Registration</Eyebrow>
                      <StatusBadge
                        color={
                          selectedSeason?.isRegistrationOpen ? "green" : "muted"
                        }
                      >
                        {selectedSeason?.isRegistrationOpen ? "Open" : "Closed"}
                      </StatusBadge>
                    </div>
                    <div
                      className="px-5 py-4"
                      style={{ borderBottom: `1px solid ${T.border}` }}
                    >
                      <Eyebrow>Description</Eyebrow>
                      <p
                        className="text-sm leading-relaxed whitespace-pre-wrap mt-2"
                        style={{
                          color: selectedSeason.description ? T.cream : T.muted,
                        }}
                      >
                        {selectedSeason.description ||
                          "No description available"}
                      </p>
                    </div>
                    {can("integration.discord.manage") && (
                      <div className="px-5 py-4">
                        <Eyebrow>Discord Integration</Eyebrow>
                        <div className="mt-3">
                          {isDiscordConnected && (
                            <div className="flex items-center gap-2 mb-3">
                              <CheckCircleIcon
                                className="h-3.5 w-3.5"
                                style={{ color: "#4ade80" }}
                              />
                              <span
                                className="text-xs"
                                style={{ color: "#4ade80" }}
                              >
                                Connected
                              </span>
                            </div>
                          )}
                          <div className="flex">
                            <input
                              type="text"
                              value={webhookUrl}
                              onChange={(e) => setWebhookUrl(e.target.value)}
                              disabled={webhookLoading}
                              placeholder={
                                isDiscordConnected
                                  ? "Enter new webhook URL"
                                  : "Enter Discord webhook URL"
                              }
                              className="flex-1 px-4 py-2 text-sm placeholder-zinc-600"
                              style={{
                                ...inputStyle,
                                borderRight: "none",
                                borderRadius: "2px 0 0 2px",
                              }}
                              onFocus={(e) =>
                                (e.target.style.borderColor = T.borderHover)
                              }
                              onBlur={(e) =>
                                (e.target.style.borderColor = T.border)
                              }
                            />
                            <PrimaryBtn
                              onClick={updateWebhook}
                              disabled={webhookLoading || !webhookUrl.trim()}
                              style={{ borderRadius: "0 2px 2px 0" }}
                            >
                              {webhookLoading ? (
                                <Spinner size={11} dark />
                              ) : isDiscordConnected ? (
                                "Update"
                              ) : (
                                "Connect"
                              )}
                            </PrimaryBtn>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ══ TAB 1 · CTF CHALLENGES ════════════════════════════════════════ */}
          {activeTab === 1 && (
            <div className="w-full max-w-[1400px]">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
                <PageHeader
                  crumb="Season Studio / Challenges"
                  title="CTF Challenges"
                  sub={selectedSeason?.name}
                />
                <div className="flex gap-2 shrink-0">
                  {selectedSeason && (
                    <GhostBtn
                      onClick={() => setShowBulkVisibilityModal(true)}
                      disabled={!selectedSeason || challenges.length === 0}
                    >
                      <EyeIcon className="h-3.5 w-3.5" /> Bulk
                    </GhostBtn>
                  )}
                  {can("challenge.create") && (
                    <PrimaryBtn
                      onClick={openNewChallengeModal}
                      disabled={!selectedSeason}
                    >
                      <PlusIcon className="h-3.5 w-3.5" /> New
                    </PrimaryBtn>
                  )}
                </div>
              </div>

              {!selectedSeason ? (
                <EmptyState
                  icon={FlagIcon}
                  title="Select a season first"
                  desc="Go to Season Details to pick a season."
                />
              ) : challengeLoading ? (
                <LoadingState label="Loading challenges..." />
              ) : challenges.length === 0 ? (
                <EmptyState
                  icon={FlagIcon}
                  title="No challenges yet"
                  desc="Create your first challenge to get started."
                  action={
                    can("challenge.create") && (
                      <PrimaryBtn onClick={openNewChallengeModal}>
                        <PlusIcon className="h-3.5 w-3.5" /> Create
                      </PrimaryBtn>
                    )
                  }
                />
              ) : (
                <>
                  {/* ── Filter bar ── */}
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <div className="flex items-center gap-1.5 mr-1">
                      <RiFilter3Line
                        className="w-3 h-3"
                        style={{ color: T.muted }}
                      />
                      <Eyebrow>Filter</Eyebrow>
                    </div>
                    <CustomSelect
                      value={challengeFilterDiff}
                      onChange={setChallengeFilterDiff}
                      placeholder="All Difficulties"
                      options={[
                        { value: "", label: "All Difficulties" },
                        { value: "easy", label: "Easy" },
                        { value: "medium", label: "Medium" },
                        { value: "hard", label: "Hard" },
                      ]}
                      className="w-40"
                    />
                    <CustomSelect
                      value={challengeFilterCat}
                      onChange={setChallengeFilterCat}
                      placeholder="All Categories"
                      options={[
                        { value: "", label: "All Categories" },
                        ...activeChallengeCategories.map((c) => ({
                          value: c,
                          label: c,
                        })),
                      ]}
                      className="w-52"
                    />
                    {(challengeFilterDiff || challengeFilterCat) && (
                      <button
                        onClick={() => {
                          setChallengeFilterDiff("");
                          setChallengeFilterCat("");
                        }}
                        className="text-[10px] uppercase tracking-widest px-3 py-1.5 transition-all"
                        style={{
                          color: T.muted,
                          fontFamily: "Outfit, sans-serif",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = T.cream)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = T.muted)
                        }
                      >
                        Clear filters
                      </button>
                    )}
                    <span
                      className="ml-auto text-[10px] uppercase tracking-widest"
                      style={{
                        color: T.muted,
                        fontFamily: "Outfit, sans-serif",
                      }}
                    >
                      {processedChallenges.length} of {challenges.length}
                    </span>
                  </div>

                  {/* ── Table ── */}
                  <div
                    style={{
                      border: `1px solid ${T.border}`,
                      borderRadius: "2px",
                    }}
                  >
                    {/* Column headers — sortable */}
                    <div
                      className="grid items-center px-5 py-3 gap-6"
                      style={{
                        gridTemplateColumns: "1fr 10rem 7rem 5rem 7rem",
                        borderBottom: `1px solid ${T.border}`,
                      }}
                    >
                      <SortHeader
                        label="Challenge"
                        field="name"
                        sortBy={challengeSortBy}
                        sortDir={challengeSortDir}
                        onSort={handleChallengeSort}
                      />
                      <SortHeader
                        label="Category"
                        field="category"
                        sortBy={challengeSortBy}
                        sortDir={challengeSortDir}
                        onSort={handleChallengeSort}
                      />
                      <SortHeader
                        label="Difficulty"
                        field="difficulty"
                        sortBy={challengeSortBy}
                        sortDir={challengeSortDir}
                        onSort={handleChallengeSort}
                      />
                      <SortHeader
                        label="Pts"
                        field="points"
                        sortBy={challengeSortBy}
                        sortDir={challengeSortDir}
                        onSort={handleChallengeSort}
                      />
                      <Eyebrow style={{ textAlign: "right" }}>Actions</Eyebrow>
                    </div>

                    {/* Rows */}
                    {processedChallenges.map((ch) => (
                      <div
                        key={ch.slug}
                        className="grid items-center px-5 py-3.5 gap-6 transition-all"
                        style={{
                          gridTemplateColumns: "1fr 10rem 7rem 5rem 7rem",
                          borderBottom: `1px solid ${T.border}`,
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = T.card)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        {/* Challenge name + desc */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p
                              className="text-sm truncate"
                              style={{ color: T.cream }}
                            >
                              {ch.name}
                            </p>
                            {ch.isVisible === false && (
                              <StatusBadge color="red">Hidden</StatusBadge>
                            )}
                          </div>
                          <p
                            className="text-xs mt-0.5 truncate"
                            style={{ color: T.muted }}
                          >
                            {ch.description || "No description"}
                          </p>
                        </div>

                        {/* Category badge */}
                        <div>
                          <span
                            className="text-[9px] uppercase tracking-widest px-2.5 py-1 inline-block"
                            style={{
                              border: `1px solid ${T.border}`,
                              color: T.muted,
                              borderRadius: "2px",
                              fontFamily: "Outfit, sans-serif",
                            }}
                          >
                            {ch.category}
                          </span>
                        </div>

                        {/* Difficulty */}
                        <span
                          className="text-xs font-medium uppercase tracking-wider"
                          style={{
                            color: diffColor(ch.difficulty),
                            fontFamily: "Outfit, sans-serif",
                          }}
                        >
                          {ch.difficulty?.toUpperCase()}
                        </span>

                        {/* Points */}
                        <span
                          className="text-xl leading-none tabular-nums"
                          style={{
                            color: T.cream,
                            fontFamily: "Bebas Neue, sans-serif",
                          }}
                        >
                          {ch.points}
                        </span>

                        {/* Actions */}
                        <div className="flex items-center gap-1 justify-end">
                          {can("challenge.update") && (
                            <button
                              onClick={() => openEditChallengeModal(ch)}
                              disabled={challengeLoading}
                              className="p-2 transition-all"
                              style={{ color: T.muted }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.color = T.cream)
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.color = T.muted)
                              }
                              title="Edit"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                          )}
                          {can("challenge.update") && (
                            <button
                              onClick={() => toggleVisibility(ch)}
                              disabled={challengeLoading}
                              className="p-2 transition-all"
                              style={{ color: T.muted }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.color = T.cream)
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.color = T.muted)
                              }
                              title={ch.isVisible !== false ? "Hide" : "Show"}
                            >
                              {ch.isVisible !== false ? (
                                <EyeIcon className="h-4 w-4" />
                              ) : (
                                <EyeSlashIcon className="h-4 w-4" />
                              )}
                            </button>
                          )}
                          {can("flag.view") && (
                            <button
                              onClick={() => openRevealFlagModal(ch)}
                              disabled={challengeLoading}
                              className="p-2 transition-all"
                              style={{ color: T.muted }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.color = T.cream)
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.color = T.muted)
                              }
                              title="Reveal Flag"
                            >
                              <FlagIcon className="h-4 w-4" />
                            </button>
                          )}
                          {can("challenge.delete") && (
                            <button
                              onClick={() => deleteChallenge(ch)}
                              disabled={challengeLoading}
                              className="p-2 transition-all"
                              style={{ color: "rgba(239,68,68,0.5)" }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.color = "#f87171")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.color =
                                  "rgba(239,68,68,0.5)")
                              }
                              title="Delete"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Empty filtered state */}
                    {processedChallenges.length === 0 && (
                      <div className="py-14 text-center">
                        <Eyebrow>No challenges match your filters</Eyebrow>
                      </div>
                    )}

                    {/* Footer */}
                    <div
                      className="flex items-center justify-between px-5 py-2.5"
                      style={{
                        borderTop:
                          processedChallenges.length > 0
                            ? "none"
                            : `1px solid ${T.border}`,
                      }}
                    >
                      <Eyebrow>
                        {processedChallenges.length} challenge
                        {processedChallenges.length !== 1 ? "s" : ""}
                        {challengeFilterDiff || challengeFilterCat
                          ? ` (filtered from ${challenges.length})`
                          : ""}
                      </Eyebrow>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 2 && (
            <div className="w-full max-w-[1400px]">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
                <PageHeader
                  crumb="Season Studio / Participants"
                  title="Participants"
                  sub={
                    selectedSeason
                      ? `${selectedSeason.name} · ${seasonMode === "team" ? "Team Mode" : "Solo Mode"}`
                      : undefined
                  }
                />
                {selectedSeason && hasParticipants && (
                  <div className="relative shrink-0">
                    <svg
                      className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{ color: T.muted }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <input
                      type="text"
                      placeholder={
                        seasonMode === "team"
                          ? "Search team or user..."
                          : "Search username..."
                      }
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 pr-4 py-2 text-sm w-52 placeholder-zinc-600"
                      style={inputStyle}
                      onFocus={(e) =>
                        (e.target.style.borderColor = T.borderHover)
                      }
                      onBlur={(e) => (e.target.style.borderColor = T.border)}
                    />
                  </div>
                )}
              </div>

              {!selectedSeason ? (
                <EmptyState icon={UsersIcon} title="Select a season first" />
              ) : participantsLoading ? (
                <LoadingState label="Loading participants..." />
              ) : participantsError ? (
                <div className="flex flex-col items-center gap-3 min-h-[20vh] justify-center">
                  <p className="text-xs" style={{ color: "#f87171" }}>
                    {participantsError}
                  </p>
                  <GhostBtn danger onClick={fetchParticipants}>
                    Try Again
                  </GhostBtn>
                </div>
              ) : !hasParticipants ? (
                <EmptyState
                  icon={UsersIcon}
                  title="No participants yet"
                  desc="Participants will appear here once they join."
                />
              ) : (
                <>
                  <div
                    className="flex items-center gap-6 px-4 py-3 mb-4"
                    style={{
                      background: T.card,
                      border: `1px solid ${T.border}`,
                      borderRadius: "2px",
                    }}
                  >
                    <span className="text-xs" style={{ color: T.muted }}>
                      {searchTerm
                        ? `${seasonMode === "team" ? filteredTeams.length + " teams" : filteredSoloParticipants.length + " users"} found`
                        : seasonMode === "team"
                          ? `${teamsData.length} Teams · ${totalParticipantCount} Members`
                          : `Total: ${totalParticipantCount}`}
                    </span>
                    <div className="flex items-center gap-4 ml-auto">
                      {[
                        ["Active", activeCount, "#4ade80"],
                        ["Banned", bannedCount, "#f87171"],
                      ].map(([l, c, clr]) => (
                        <span
                          key={l}
                          className="flex items-center gap-1.5 text-[10px]"
                          style={{ color: T.muted }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: clr }}
                          />
                          {l}: <span style={{ color: clr }}>{c}</span>
                        </span>
                      ))}
                      {seasonMode === "team" && (
                        <span
                          className="flex items-center gap-1.5 text-[10px]"
                          style={{ color: T.muted }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: "#facc15" }}
                          />
                          Banned Teams:{" "}
                          <span style={{ color: "#facc15" }}>
                            {(teamsData || []).filter((t) => t.isBanned).length}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  {seasonMode === "solo" && (
                    <div
                      style={{
                        border: `1px solid ${T.border}`,
                        borderRadius: "2px",
                      }}
                    >
                      <div
                        className="grid px-5 py-2.5 gap-4"
                        style={{
                          gridTemplateColumns: "1.2fr 1.8fr 6rem 8rem auto",
                          borderBottom: `1px solid ${T.border}`,
                        }}
                      >
                        {["Username", "Email", "Status", "Joined", ""].map(
                          (h, i) => (
                            <Eyebrow key={i}>{h}</Eyebrow>
                          ),
                        )}
                      </div>
                      {paginatedSoloParticipants.map((p, i) => (
                        <div
                          key={`${p.username}-${i}`}
                          className="grid items-center px-5 py-3 gap-4 transition-all"
                          style={{
                            gridTemplateColumns: "1.2fr 1.8fr 6rem 8rem auto",
                            borderBottom: `1px solid ${T.border}`,
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = T.card)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          <p className="text-sm" style={{ color: T.cream }}>
                            {p.username}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: T.muted, fontFamily: "monospace" }}
                          >
                            {p.email}
                          </p>
                          <StatusBadge color={p.isBanned ? "red" : "green"}>
                            {p.isBanned ? "Banned" : "Active"}
                          </StatusBadge>
                          <p
                            className="text-xs"
                            style={{ color: T.muted, fontFamily: "monospace" }}
                          >
                            {new Date(p.joinedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <div className="flex items-center gap-1.5 justify-end">
                            <GhostBtn
                              onClick={() => viewParticipant(p)}
                              className="!px-3 !py-1"
                            >
                              View
                            </GhostBtn>
                            {can("participant.ban") && (
                              <BanBtn
                                isBanned={p.isBanned}
                                onClick={() => toggleParticipantBan(p)}
                                disabled={
                                  banningUserId === (p.userId || p.username)
                                }
                              />
                            )}
                          </div>
                        </div>
                      ))}
                      <div
                        className="flex items-center justify-between px-5 py-3"
                        style={{ borderTop: `1px solid ${T.border}` }}
                      >
                        <Eyebrow>
                          Page {currentPage} of {totalSoloPages || 1}
                        </Eyebrow>
                        <div className="flex gap-1.5">
                          <GhostBtn
                            onClick={() => setCurrentPage((p) => p - 1)}
                            disabled={currentPage === 1}
                            className="!px-3 !py-1.5"
                          >
                            ← Prev
                          </GhostBtn>
                          <GhostBtn
                            onClick={() => setCurrentPage((p) => p + 1)}
                            disabled={
                              currentPage === totalSoloPages ||
                              totalSoloPages === 0
                            }
                            className="!px-3 !py-1.5"
                          >
                            Next →
                          </GhostBtn>
                        </div>
                      </div>
                    </div>
                  )}

                  {seasonMode === "team" && (
                    <div className="space-y-3">
                      {paginatedTeams.map((team) => (
                        <div
                          key={team.teamId}
                          style={{
                            border: `1px solid ${team.isBanned ? "rgba(239,68,68,0.3)" : T.border}`,
                            borderRadius: "2px",
                          }}
                        >
                          <div
                            className="flex items-center justify-between px-5 py-3"
                            style={{
                              borderBottom: `1px solid ${team.isBanned ? "rgba(239,68,68,0.2)" : T.border}`,
                              background: team.isBanned
                                ? "rgba(239,68,68,0.03)"
                                : T.card,
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <UsersIcon
                                className="h-3.5 w-3.5 shrink-0"
                                style={{ color: T.muted }}
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span
                                    className="text-sm"
                                    style={{ color: T.cream }}
                                  >
                                    {team.teamName}
                                  </span>
                                  {team.isLocked ? (
                                    <span
                                      className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 flex items-center gap-1"
                                      style={{
                                        border: `1px solid ${T.border}`,
                                        color: T.muted,
                                        borderRadius: "2px",
                                      }}
                                    >
                                      <LockClosedIcon className="h-2.5 w-2.5" />
                                      Locked
                                    </span>
                                  ) : (
                                    <span
                                      className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 flex items-center gap-1"
                                      style={{
                                        border: `1px solid ${T.border}`,
                                        color: T.muted,
                                        borderRadius: "2px",
                                      }}
                                    >
                                      <LockOpenIcon className="h-2.5 w-2.5" />
                                      Open
                                    </span>
                                  )}
                                  {team.isBanned && (
                                    <StatusBadge color="red">
                                      Banned
                                    </StatusBadge>
                                  )}
                                </div>
                                <p
                                  className="text-[10px] mt-0.5"
                                  style={{ color: T.muted }}
                                >
                                  {team.members.length} member
                                  {team.members.length !== 1 ? "s" : ""}
                                </p>
                              </div>
                            </div>
                            {can("participant.ban") && (
                              <BanBtn
                                isBanned={team.isBanned}
                                onClick={() => toggleTeamBan(team)}
                                disabled={banningTeamId === team.teamId}
                              />
                            )}
                          </div>
                          <div
                            className="grid px-5 py-2 gap-4"
                            style={{
                              gridTemplateColumns: "1.2fr 1.8fr 6rem auto",
                              borderBottom: `1px solid ${T.border}`,
                            }}
                          >
                            {["Username", "Email", "Status", ""].map((h, i) => (
                              <Eyebrow key={i}>{h}</Eyebrow>
                            ))}
                          </div>
                          {team.members.map((m) => (
                            <div
                              key={m.userId}
                              className="grid items-center px-5 py-2.5 gap-4 transition-all"
                              style={{
                                gridTemplateColumns: "1.2fr 1.8fr 6rem auto",
                                borderBottom: `1px solid ${T.border}`,
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.background = T.card)
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.background =
                                  "transparent")
                              }
                            >
                              <p className="text-sm" style={{ color: T.cream }}>
                                {m.username}
                              </p>
                              <p
                                className="text-xs"
                                style={{
                                  color: T.muted,
                                  fontFamily: "monospace",
                                }}
                              >
                                {m.email}
                              </p>
                              <StatusBadge color={m.isBanned ? "red" : "green"}>
                                {m.isBanned ? "Banned" : "Active"}
                              </StatusBadge>
                              <div className="flex items-center gap-1.5 justify-end">
                                <GhostBtn
                                  onClick={() => viewParticipant(m)}
                                  className="!px-3 !py-1"
                                >
                                  View
                                </GhostBtn>
                                {can("participant.ban") && (
                                  <BanBtn
                                    isBanned={m.isBanned}
                                    onClick={() => toggleParticipantBan(m)}
                                    disabled={banningUserId === m.userId}
                                  />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                      <div className="flex items-center justify-between px-2 py-3">
                        <Eyebrow>
                          Page {currentPage} of {totalTeamPages || 1}
                        </Eyebrow>
                        <div className="flex gap-1.5">
                          <GhostBtn
                            onClick={() => setCurrentPage((p) => p - 1)}
                            disabled={currentPage === 1}
                            className="!px-3 !py-1.5"
                          >
                            ← Prev
                          </GhostBtn>
                          <GhostBtn
                            onClick={() => setCurrentPage((p) => p + 1)}
                            disabled={
                              currentPage === totalTeamPages ||
                              totalTeamPages === 0
                            }
                            className="!px-3 !py-1.5"
                          >
                            Next →
                          </GhostBtn>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ══ TAB 3 · ADMINS ═════════════════════════════════════════════════ */}
          {can("admin.manage") && activeTab === 3 && (
            <div className="w-full max-w-[1400px]">
              <PageHeader
                crumb="Season Studio / Admins"
                title="Access Control"
                sub={selectedSeason?.name}
              />
              {can("admin.manage") && (
                <div className="mb-8">
                  <form
                    onSubmit={handleAddMember}
                    className="flex"
                    style={{
                      border: `1px solid ${T.border}`,
                      borderRadius: "2px",
                    }}
                  >
                    <input
                      type="text"
                      value={newMember.username}
                      onChange={(e) =>
                        setNewMember((p) => ({
                          ...p,
                          username: e.target.value,
                        }))
                      }
                      placeholder="Username"
                      disabled={addingAdmin}
                      required
                      className="flex-1 px-4 py-2.5 text-sm placeholder-zinc-600"
                      style={{
                        ...inputStyle,
                        borderRight: `1px solid ${T.border}`,
                        border: "none",
                        borderRadius: 0,
                      }}
                      onFocus={(e) => (e.target.style.background = T.card)}
                      onBlur={(e) => (e.target.style.background = T.inputBg)}
                    />
                    <div
                      className="shrink-0"
                      style={{ borderRight: `1px solid ${T.border}` }}
                    >
                      <CustomSelect
                        value={newMember.role}
                        onChange={(val) =>
                          setNewMember((p) => ({ ...p, role: val }))
                        }
                        disabled={addingAdmin}
                        options={[
                          { value: "admin", label: "Admin" },
                          {
                            value: "challenge_manager",
                            label: "Challenge Manager",
                          },
                          { value: "moderator", label: "Moderator" },
                          { value: "viewer", label: "Viewer" },
                        ]}
                        className="w-44"
                      />
                    </div>
                    <PrimaryBtn
                      type="submit"
                      disabled={addingAdmin || !newMember.username.trim()}
                      style={{ borderRadius: "0 2px 2px 0" }}
                    >
                      {addingAdmin ? (
                        <>
                          <Spinner size={11} dark /> Assigning
                        </>
                      ) : (
                        "Assign →"
                      )}
                    </PrimaryBtn>
                  </form>
                </div>
              )}
              {adminLoading ? (
                <LoadingState />
              ) : !selectedSeason ? (
                <EmptyState icon={UserIcon} title="Select a season first" />
              ) : (
                <>
                  {adminsData.organizer && (
                    <div className="mb-6">
                      <div
                        className="px-5 py-2"
                        style={{ borderBottom: `1px solid ${T.border}` }}
                      >
                        <Eyebrow>Organizer</Eyebrow>
                      </div>
                      <div
                        className="flex items-center justify-between px-5 py-4"
                        style={{ borderBottom: `1px solid ${T.border}` }}
                      >
                        <div className="flex items-center gap-4">
                          <span
                            className="text-xl leading-none w-7"
                            style={{
                              color: T.border,
                              fontFamily: "Bebas Neue, sans-serif",
                            }}
                          >
                            01
                          </span>
                          <div>
                            <p className="text-sm" style={{ color: T.cream }}>
                              {adminsData.organizer.username}
                            </p>
                            <p
                              className="text-xs mt-0.5"
                              style={{
                                color: T.muted,
                                fontFamily: "monospace",
                              }}
                            >
                              {adminsData.organizer.email}
                            </p>
                          </div>
                        </div>
                        <span
                          className="text-[9px] uppercase tracking-widest px-3 py-1"
                          style={{
                            background: T.cream,
                            color: T.bg,
                            borderRadius: "2px",
                          }}
                        >
                          Organizer
                        </span>
                      </div>
                    </div>
                  )}
                  <div
                    style={{
                      border: `1px solid ${T.border}`,
                      borderRadius: "2px",
                    }}
                  >
                    <div
                      className="grid px-5 py-2.5 gap-4"
                      style={{
                        gridTemplateColumns: "2rem 1fr 1fr auto auto",
                        borderBottom: `1px solid ${T.border}`,
                      }}
                    >
                      {["#", "Username", "Email", "Role", ""].map((h, i) => (
                        <Eyebrow key={i}>{h}</Eyebrow>
                      ))}
                    </div>
                    {adminsData.admins && adminsData.admins.length > 0 ? (
                      adminsData.admins.map((admin, i) => (
                        <div
                          key={i}
                          className="grid gap-4 items-center px-5 py-3.5 transition-all"
                          style={{
                            gridTemplateColumns: "2rem 1fr 1fr auto auto",
                            borderBottom: `1px solid ${T.border}`,
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = T.card)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          <span
                            className="text-sm tabular-nums"
                            style={{ color: T.border }}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <p className="text-sm" style={{ color: T.cream }}>
                            {admin.username}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: T.muted, fontFamily: "monospace" }}
                          >
                            {admin.email}
                          </p>
                          <span
                            className="text-[9px] uppercase tracking-widest px-2 py-1 justify-self-start"
                            style={{
                              border: `1px solid ${T.border}`,
                              color: T.muted,
                              borderRadius: "2px",
                            }}
                          >
                            {admin.role === "challenge_manager"
                              ? "Ch. Manager"
                              : admin.role}
                          </span>
                          {can("admin.manage") && (
                            <button
                              onClick={() => handleDeleteAdmin(admin.username)}
                              disabled={
                                deletingAdminUsername === admin.username
                              }
                              className="text-[10px] uppercase tracking-widest px-3 py-1 transition-all disabled:opacity-30 justify-self-end flex items-center gap-1.5"
                              style={{
                                border: "1px solid rgba(239,68,68,0.25)",
                                color: "rgba(239,68,68,0.6)",
                                borderRadius: "2px",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor =
                                  "rgba(239,68,68,0.5)";
                                e.currentTarget.style.color = "#f87171";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor =
                                  "rgba(239,68,68,0.25)";
                                e.currentTarget.style.color =
                                  "rgba(239,68,68,0.6)";
                              }}
                            >
                              {deletingAdminUsername === admin.username ? (
                                <Spinner size={11} />
                              ) : (
                                "Remove"
                              )}
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="py-14 text-center">
                        <Eyebrow>No admins assigned yet</Eyebrow>
                      </div>
                    )}
                    {adminsData.admins?.length > 0 && (
                      <div className="flex justify-end px-5 py-2.5">
                        <Eyebrow>
                          {adminsData.admins.length} member
                          {adminsData.admins.length !== 1 ? "s" : ""}
                        </Eyebrow>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ══ TAB 4 · NOTIFICATIONS ══════════════════════════════════════════ */}
          {can("notification.send") && activeTab === 4 && (
            <div className="w-full max-w-5xl">
              <PageHeader
                crumb="Season Studio / Notifications"
                title="Send Notification"
                sub={selectedSeason?.name}
              />
              {!selectedSeason ? (
                <EmptyState
                  title="Select a season first"
                  desc="Go to Season Details to pick a season."
                />
              ) : (
                <div
                  style={{
                    border: `1px solid ${T.border}`,
                    borderRadius: "2px",
                  }}
                >
                  <div className="grid grid-cols-2 md:grid-cols-4">
                    {[
                      { value: "ANNOUNCEMENT", label: "Announcement" },
                      { value: "HINT", label: "Hint" },
                      { value: "BAN", label: "Ban" },
                      { value: "WAVE-RELEASE", label: "Wave Release" },
                    ].map((type) => (
                      <button
                        key={type.value}
                        onClick={() =>
                          setNotificationForm((p) => ({
                            ...p,
                            type: type.value,
                          }))
                        }
                        disabled={sendingNotification}
                        className="relative px-4 py-3 text-[10px] uppercase tracking-widest text-left transition-all disabled:opacity-30"
                        style={{
                          background:
                            notificationForm.type === type.value
                              ? "rgba(254,252,232,0.05)"
                              : "transparent",
                          borderRight: `1px solid ${T.border}`,
                          borderBottom: `1px solid ${T.border}`,
                          color:
                            notificationForm.type === type.value
                              ? T.cream
                              : T.muted,
                          fontFamily: "Outfit, sans-serif",
                        }}
                      >
                        {type.label}
                        {notificationForm.type === type.value && (
                          <div
                            className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
                            style={{ background: T.cream }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                  {notificationForm.type === "BAN" && (
                    <div
                      className="px-4 py-3"
                      style={{
                        borderBottom: `1px solid ${T.border}`,
                        background: "rgba(239,68,68,0.03)",
                      }}
                    >
                      <p
                        className="text-[10px] uppercase tracking-widest mb-1"
                        style={{ color: "#f87171" }}
                      >
                        Warning
                      </p>
                      <p className="text-xs" style={{ color: T.muted }}>
                        This will send a ban notification. Make sure your
                        message is clear.
                      </p>
                    </div>
                  )}
                  {notificationForm.type === "HINT" && (
                    <div
                      className="px-4 py-3"
                      style={{
                        borderBottom: `1px solid ${T.border}`,
                        background: "rgba(250,204,21,0.03)",
                      }}
                    >
                      <p className="text-xs" style={{ color: T.muted }}>
                        This will send a hint to all participants.
                      </p>
                    </div>
                  )}
                  {notificationForm.type === "WAVE-RELEASE" && (
                    <div
                      className="px-4 py-3"
                      style={{ borderBottom: `1px solid ${T.border}` }}
                    >
                      <p className="text-xs" style={{ color: T.muted }}>
                        Notify participants about a new wave of challenges.
                      </p>
                    </div>
                  )}
                  <textarea
                    value={notificationForm.message}
                    onChange={(e) =>
                      setNotificationForm((p) => ({
                        ...p,
                        message: e.target.value,
                      }))
                    }
                    disabled={sendingNotification}
                    rows={16}
                    placeholder="Enter your notification message here..."
                    className="w-full px-4 py-3 text-sm resize-none placeholder-zinc-600"
                    style={{ ...inputStyle, border: "none", borderRadius: 0 }}
                    onFocus={(e) => (e.target.style.background = T.card)}
                    onBlur={(e) => (e.target.style.background = T.inputBg)}
                  />
                  <div
                    className="flex justify-end gap-2 px-4 py-3"
                    style={{ borderTop: `1px solid ${T.border}` }}
                  >
                    <GhostBtn
                      onClick={() =>
                        setNotificationForm({
                          type: "ANNOUNCEMENT",
                          message: "",
                        })
                      }
                      disabled={sendingNotification}
                    >
                      Clear
                    </GhostBtn>
                    <PrimaryBtn
                      onClick={sendNotification}
                      disabled={
                        sendingNotification || !notificationForm.message.trim()
                      }
                    >
                      {sendingNotification ? (
                        <>
                          <Spinner size={11} dark /> Sending
                        </>
                      ) : (
                        "Send →"
                      )}
                    </PrimaryBtn>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 5 && selectedSeason && (
            <UserStats seasonSlug={selectedSeason.slug} />
          )}
        </main>
      </div>

      {/* ══════════════ MODALS ══════════════════════════════════════════════ */}

      {showDeleteSeasonModal && (
        <Modal
          title="Delete Season"
          onClose={() => {
            setShowDeleteSeasonModal(false);
            setDeletingSeasonSlug("");
          }}
          disabled={deleteSeasonLoading}
        >
          <div className="p-5 space-y-4">
            <div
              className="p-4"
              style={{
                border: "1px solid rgba(239,68,68,0.25)",
                background: "rgba(239,68,68,0.03)",
                borderRadius: "2px",
              }}
            >
              <p
                className="text-[10px] uppercase tracking-widest mb-2"
                style={{ color: "#f87171" }}
              >
                Warning — this action cannot be undone
              </p>
              <p className="text-xs leading-relaxed" style={{ color: T.muted }}>
                Deleting this season will permanently remove all challenges,
                participant data, leaderboard history, and analytics.
              </p>
            </div>
            <div
              className="p-4"
              style={{
                border: `1px solid ${T.border}`,
                background: T.inputBg,
                borderRadius: "2px",
              }}
            >
              <Eyebrow>Season to delete</Eyebrow>
              <p
                className="text-lg leading-none mt-1"
                style={{ fontFamily: "Bebas Neue, sans-serif", color: T.cream }}
              >
                {selectedSeason?.name}
              </p>
            </div>
          </div>
          <ModalFooter>
            <GhostBtn
              onClick={() => {
                setShowDeleteSeasonModal(false);
                setDeletingSeasonSlug("");
              }}
              disabled={deleteSeasonLoading}
            >
              Cancel
            </GhostBtn>
            <GhostBtn
              danger
              onClick={deleteSeason}
              disabled={deleteSeasonLoading}
            >
              {deleteSeasonLoading ? (
                <>
                  <Spinner size={11} /> Deleting
                </>
              ) : (
                "Delete Season"
              )}
            </GhostBtn>
          </ModalFooter>
        </Modal>
      )}

      {/* Challenge Create / Edit — uses CustomSelect */}
      {showChallengeModal && (
        <Modal
          title={editingChallenge ? "Edit Challenge" : "Create Challenge"}
          onClose={() => setShowChallengeModal(false)}
          wide
          disabled={challengeLoading}
        >
          <div className="p-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Eyebrow>Configuration</Eyebrow>
                <div>
                  <Eyebrow>Challenge Name</Eyebrow>
                  <input
                    type="text"
                    name="name"
                    value={challengeForm.name}
                    onChange={handleChallengeFormChange}
                    disabled={challengeLoading}
                    placeholder="Enter challenge name"
                    className="w-full px-4 py-2.5 text-sm mt-1.5 placeholder-zinc-600"
                    style={inputStyle}
                    onFocus={(e) =>
                      (e.target.style.borderColor = T.borderHover)
                    }
                    onBlur={(e) => (e.target.style.borderColor = T.border)}
                  />
                </div>
                <div>
                  <Eyebrow>Category *</Eyebrow>
                  <div className="mt-1.5">
                    <CustomSelect
                      value={challengeForm.category}
                      onChange={(val) =>
                        setChallengeForm((p) => ({ ...p, category: val }))
                      }
                      disabled={challengeLoading}
                      placeholder="Select Category"
                      options={CHALLENGE_CATEGORIES.map((c) => ({
                        value: c,
                        label: c,
                      }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Eyebrow>Difficulty</Eyebrow>
                    <div className="mt-1.5">
                      <CustomSelect
                        value={challengeForm.difficulty}
                        onChange={(val) =>
                          setChallengeForm((p) => ({ ...p, difficulty: val }))
                        }
                        disabled={challengeLoading}
                        options={["Easy", "Medium", "Hard"].map((d) => ({
                          value: d,
                          label: d,
                        }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Eyebrow>Points</Eyebrow>
                    <input
                      type="number"
                      name="points"
                      value={challengeForm.points}
                      onChange={handleChallengeFormChange}
                      disabled={challengeLoading}
                      min="1"
                      placeholder="100"
                      className="w-full px-4 py-2.5 text-sm mt-1.5 placeholder-zinc-600"
                      style={inputStyle}
                      onFocus={(e) =>
                        (e.target.style.borderColor = T.borderHover)
                      }
                      onBlur={(e) => (e.target.style.borderColor = T.border)}
                    />
                  </div>
                </div>
                <div>
                  <Eyebrow>Tags</Eyebrow>
                  <div className="flex flex-wrap gap-1 mt-1.5 mb-1.5">
                    {challengeForm.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="flex items-center gap-1 text-[10px] px-2 py-0.5"
                        style={{
                          border: `1px solid ${T.border}`,
                          color: T.muted,
                          borderRadius: "2px",
                        }}
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() =>
                            setChallengeForm((p) => ({
                              ...p,
                              tags: p.tags.filter((_, i) => i !== idx),
                            }))
                          }
                          style={{ color: T.muted }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (["Enter", ",", "Tab"].includes(e.key)) {
                        e.preventDefault();
                        const v = tagInput.trim();
                        if (v && !challengeForm.tags.includes(v)) {
                          setChallengeForm((p) => ({
                            ...p,
                            tags: [...p.tags, v.replace(/\s+/g, "-")],
                          }));
                          setTagInput("");
                        }
                      }
                    }}
                    placeholder="Type tag and press Enter"
                    className="w-full px-4 py-2.5 text-sm placeholder-zinc-600"
                    style={inputStyle}
                    onFocus={(e) =>
                      (e.target.style.borderColor = T.borderHover)
                    }
                    onBlur={(e) => (e.target.style.borderColor = T.border)}
                  />
                </div>
                <div>
                  <Eyebrow>Flag Format</Eyebrow>
                  <input
                    type="text"
                    name="flagFormat"
                    value={challengeForm.flagFormat}
                    onChange={handleChallengeFormChange}
                    disabled={challengeLoading}
                    placeholder="flag{...}"
                    className="w-full px-4 py-2.5 text-sm mt-1.5 placeholder-zinc-600"
                    style={inputStyle}
                    onFocus={(e) =>
                      (e.target.style.borderColor = T.borderHover)
                    }
                    onBlur={(e) => (e.target.style.borderColor = T.border)}
                  />
                </div>
                <div>
                  <Eyebrow>
                    Flag Answer{!editingChallenge ? " *" : " (Optional)"}
                  </Eyebrow>
                  <input
                    type="text"
                    name="flag"
                    value={challengeForm.flag}
                    onChange={handleChallengeFormChange}
                    disabled={challengeLoading}
                    placeholder="flag{example_flag}"
                    className="w-full px-4 py-2.5 text-sm mt-1.5 placeholder-zinc-600"
                    style={inputStyle}
                    onFocus={(e) =>
                      (e.target.style.borderColor = T.borderHover)
                    }
                    onBlur={(e) => (e.target.style.borderColor = T.border)}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <Eyebrow>Content</Eyebrow>
                <div>
                  <Eyebrow>Description *</Eyebrow>
                  <textarea
                    name="description"
                    value={challengeForm.description}
                    onChange={handleChallengeFormChange}
                    disabled={challengeLoading}
                    rows={10}
                    placeholder="Provide detailed instructions and context..."
                    required
                    className="w-full px-4 py-2.5 text-sm mt-1.5 resize-none placeholder-zinc-600"
                    style={inputStyle}
                    onFocus={(e) =>
                      (e.target.style.borderColor = T.borderHover)
                    }
                    onBlur={(e) => (e.target.style.borderColor = T.border)}
                  />
                </div>
                <div>
                  <Eyebrow>Challenge File (Optional)</Eyebrow>
                  {challengeForm.file ? (
                    <div
                      className="flex items-center justify-between px-4 py-2.5 mt-1.5"
                      style={{
                        border: `1px solid ${T.border}`,
                        background: T.inputBg,
                        borderRadius: "2px",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <DocumentArrowUpIcon
                          className="h-3.5 w-3.5"
                          style={{ color: T.muted }}
                        />
                        <span className="text-sm" style={{ color: T.cream }}>
                          {challengeForm.file.name}
                        </span>
                      </div>
                      <button
                        onClick={removeFile}
                        disabled={challengeLoading}
                        className="transition-all"
                        style={{ color: T.muted }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "#f87171")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = T.muted)
                        }
                      >
                        <XMarkIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <label
                      className="flex flex-col items-center justify-center py-10 cursor-pointer mt-1.5 transition-all"
                      style={{
                        border: `1px dashed ${T.border}`,
                        borderRadius: "2px",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.borderColor = T.borderHover)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.borderColor = T.border)
                      }
                    >
                      <DocumentArrowUpIcon
                        className="h-6 w-6 mb-2"
                        style={{ color: T.muted }}
                      />
                      <span
                        className="text-[10px] uppercase tracking-widest"
                        style={{ color: T.muted }}
                      >
                        Upload File
                      </span>
                      <input
                        id="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        disabled={challengeLoading}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>
          <ModalFooter>
            <GhostBtn
              onClick={() => setShowChallengeModal(false)}
              disabled={challengeLoading}
            >
              Cancel
            </GhostBtn>
            <PrimaryBtn
              onClick={saveChallenge}
              disabled={
                challengeLoading ||
                !challengeForm.category ||
                !challengeForm.description ||
                (!challengeForm.flag && !editingChallenge)
              }
            >
              {challengeLoading ? (
                <>
                  <Spinner size={11} dark /> Saving
                </>
              ) : editingChallenge ? (
                "Update →"
              ) : (
                "Create →"
              )}
            </PrimaryBtn>
          </ModalFooter>
        </Modal>
      )}

      {/* Bulk Visibility — uses CustomSelect */}
      {showBulkVisibilityModal && (
        <Modal
          title="Bulk Visibility"
          onClose={() => {
            setShowBulkVisibilityModal(false);
            setBulkVisibilityForm({ difficulty: "", isVisible: true });
          }}
          disabled={bulkVisibilityLoading}
        >
          <div className="p-5 space-y-5">
            <div>
              <Eyebrow>Difficulty Level</Eyebrow>
              <div className="mt-1.5">
                <CustomSelect
                  value={bulkVisibilityForm.difficulty}
                  onChange={(val) =>
                    setBulkVisibilityForm((p) => ({ ...p, difficulty: val }))
                  }
                  disabled={bulkVisibilityLoading}
                  placeholder="Choose difficulty..."
                  options={[
                    { value: "easy", label: "Easy" },
                    { value: "medium", label: "Medium" },
                    { value: "hard", label: "Hard" },
                  ]}
                />
              </div>
            </div>
            <div>
              <Eyebrow>Visibility Action</Eyebrow>
              <div className="mt-2 space-y-px">
                {[
                  { val: true, label: "Make Visible — Show challenges" },
                  { val: false, label: "Make Hidden — Hide challenges" },
                ].map(({ val, label }) => (
                  <label
                    key={String(val)}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-all"
                    style={{
                      border: `1px solid ${bulkVisibilityForm.isVisible === val ? T.borderHover : T.border}`,
                      background:
                        bulkVisibilityForm.isVisible === val
                          ? "rgba(254,252,232,0.03)"
                          : "transparent",
                      borderRadius: "2px",
                    }}
                  >
                    <input
                      type="radio"
                      name="visibilityAction"
                      checked={bulkVisibilityForm.isVisible === val}
                      onChange={() =>
                        setBulkVisibilityForm((p) => ({ ...p, isVisible: val }))
                      }
                      disabled={bulkVisibilityLoading}
                      style={{ accentColor: T.cream }}
                    />
                    <span className="text-sm" style={{ color: T.cream }}>
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            {bulkVisibilityForm.difficulty && (
              <div
                className="px-4 py-3"
                style={{
                  border: "1px solid rgba(250,204,21,0.25)",
                  background: "rgba(250,204,21,0.03)",
                  borderRadius: "2px",
                }}
              >
                <p className="text-xs" style={{ color: T.muted }}>
                  This will {bulkVisibilityForm.isVisible ? "show" : "hide"} all{" "}
                  <strong style={{ color: T.cream }}>
                    {bulkVisibilityForm.difficulty}
                  </strong>{" "}
                  challenges.
                </p>
              </div>
            )}
          </div>
          <ModalFooter>
            <GhostBtn
              onClick={() => {
                setShowBulkVisibilityModal(false);
                setBulkVisibilityForm({ difficulty: "", isVisible: true });
              }}
              disabled={bulkVisibilityLoading}
            >
              Cancel
            </GhostBtn>
            <PrimaryBtn
              onClick={handleBulkVisibilityToggle}
              disabled={bulkVisibilityLoading || !bulkVisibilityForm.difficulty}
            >
              {bulkVisibilityLoading ? (
                <>
                  <Spinner size={11} dark /> Processing
                </>
              ) : (
                "Apply →"
              )}
            </PrimaryBtn>
          </ModalFooter>
        </Modal>
      )}

      {/* Reveal Flag */}
      {revealFlagModal && revealFlagChallenge && (
        <Modal
          title="Reveal Flag"
          onClose={closeRevealFlagModal}
          disabled={revealFlagLoading}
        >
          <div className="p-5 space-y-4">
            <div
              className="p-4"
              style={{
                border: `1px solid ${T.border}`,
                background: T.inputBg,
                borderRadius: "2px",
              }}
            >
              <Eyebrow>Challenge</Eyebrow>
              <p
                className="text-lg leading-none mt-1"
                style={{ fontFamily: "Bebas Neue, sans-serif", color: T.cream }}
              >
                {revealFlagChallenge.name}
              </p>
              <span
                className="text-[9px] uppercase tracking-widest mt-1 inline-block"
                style={{ color: T.muted }}
              >
                {revealFlagChallenge.category}
              </span>
            </div>
            {!revealedFlag ? (
              <>
                <div
                  className="px-4 py-3"
                  style={{
                    border: "1px solid rgba(250,204,21,0.25)",
                    background: "rgba(250,204,21,0.03)",
                    borderRadius: "2px",
                  }}
                >
                  <p className="text-xs" style={{ color: T.muted }}>
                    Enter your account password to reveal the flag.
                  </p>
                </div>
                <div>
                  <Eyebrow>Account Password</Eyebrow>
                  <input
                    type="password"
                    value={revealFlagPassword}
                    onChange={(e) => setRevealFlagPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && revealFlagPassword.trim())
                        revealFlag();
                    }}
                    disabled={revealFlagLoading}
                    placeholder="Enter your password"
                    autoFocus
                    className="w-full px-4 py-2.5 text-sm mt-1.5 placeholder-zinc-600"
                    style={inputStyle}
                    onFocus={(e) =>
                      (e.target.style.borderColor = T.borderHover)
                    }
                    onBlur={(e) => (e.target.style.borderColor = T.border)}
                  />
                </div>
              </>
            ) : (
              <div
                className="p-4"
                style={{
                  border: "1px solid rgba(74,222,128,0.3)",
                  background: "rgba(74,222,128,0.03)",
                  borderRadius: "2px",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircleIcon
                    className="h-3.5 w-3.5"
                    style={{ color: "#4ade80" }}
                  />
                  <Eyebrow style={{ color: "#4ade80" }}>Flag Revealed</Eyebrow>
                </div>
                <div className="flex items-center gap-2">
                  <code
                    className="text-sm flex-1 break-all"
                    style={{ color: T.cream, fontFamily: "monospace" }}
                  >
                    {showFlagValue
                      ? revealedFlag
                      : "•".repeat(Math.min(revealedFlag.length, 32))}
                  </code>
                  <button
                    onClick={() => setShowFlagValue((p) => !p)}
                    className="transition-all"
                    style={{ color: T.muted }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = T.cream)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = T.muted)
                    }
                  >
                    {showFlagValue ? (
                      <EyeSlashIcon className="h-3.5 w-3.5" />
                    ) : (
                      <EyeIcon className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
          <ModalFooter>
            <GhostBtn
              onClick={closeRevealFlagModal}
              disabled={revealFlagLoading}
            >
              {revealedFlag ? "Close" : "Cancel"}
            </GhostBtn>
            {!revealedFlag && (
              <PrimaryBtn
                onClick={revealFlag}
                disabled={revealFlagLoading || !revealFlagPassword.trim()}
              >
                {revealFlagLoading ? (
                  <>
                    <Spinner size={11} dark /> Verifying
                  </>
                ) : (
                  "Reveal →"
                )}
              </PrimaryBtn>
            )}
          </ModalFooter>
        </Modal>
      )}

      {showWebhookSuccessModal && (
        <Modal
          title="Webhook Connected"
          onClose={() => setShowWebhookSuccessModal(false)}
        >
          <div className="p-8 flex flex-col items-center gap-3 text-center">
            <CheckCircleIcon className="h-8 w-8" style={{ color: "#4ade80" }} />
            <p
              className="text-lg leading-none"
              style={{ fontFamily: "Bebas Neue, sans-serif", color: T.cream }}
            >
              Discord Connected
            </p>
            <p className="text-xs" style={{ color: T.muted }}>
              Webhook successfully connected.
            </p>
          </div>
          <ModalFooter>
            <PrimaryBtn
              onClick={() => setShowWebhookSuccessModal(false)}
              className="w-full justify-center"
            >
              Close
            </PrimaryBtn>
          </ModalFooter>
        </Modal>
      )}

      {showExportComingSoonModal && (
        <Modal
          title="Export Data"
          onClose={() => setShowExportComingSoonModal(false)}
        >
          <div className="p-10 flex flex-col items-center gap-4 text-center">
            <div
              className="w-12 h-12 flex items-center justify-center"
              style={{
                border: `1px solid ${T.border}`,
                borderRadius: "2px",
                background: T.inputBg,
              }}
            >
              <DocumentArrowUpIcon
                className="h-5 w-5"
                style={{ color: T.muted }}
              />
            </div>
            <div>
              <p
                className="text-2xl leading-none mb-2"
                style={{
                  fontFamily: "Bebas Neue, sans-serif",
                  color: T.cream,
                  letterSpacing: "0.05em",
                }}
              >
                Coming Soon
              </p>
              <p
                className="text-xs max-w-xs"
                style={{ color: T.muted, fontFamily: "Outfit, sans-serif" }}
              >
                Data export is currently under development. Check back soon.
              </p>
            </div>
            <div
              className="w-full mt-2 px-4 py-3 flex items-center gap-3"
              style={{
                border: `1px solid ${T.border}`,
                background: T.inputBg,
                borderRadius: "2px",
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: T.muted }}
              />
              <p
                className="text-[10px] uppercase tracking-widest text-left"
                style={{ color: T.muted, fontFamily: "Outfit, sans-serif" }}
              >
                Feature in progress — stay tuned for updates
              </p>
            </div>
          </div>
          <ModalFooter>
            <PrimaryBtn
              onClick={() => setShowExportComingSoonModal(false)}
              className="w-full justify-center"
            >
              Got It
            </PrimaryBtn>
          </ModalFooter>
        </Modal>
      )}

      {showParticipantModal && selectedParticipant && (
        <Modal
          title="Participant Details"
          onClose={() => setShowParticipantModal(false)}
          wide
        >
          <div className="p-5 space-y-5">
            <div
              className="flex items-end justify-between pb-4"
              style={{ borderBottom: `1px solid ${T.border}` }}
            >
              <div>
                <p
                  className="text-2xl leading-none"
                  style={{
                    fontFamily: "Bebas Neue, sans-serif",
                    color: T.cream,
                  }}
                >
                  @{selectedParticipant.name}
                </p>
                <p
                  className="text-xs mt-1"
                  style={{ color: T.muted, fontFamily: "monospace" }}
                >
                  {selectedParticipant.email}
                </p>
              </div>
              <StatusBadge
                color={
                  selectedParticipant.status === "active" ? "green" : "red"
                }
              >
                {selectedParticipant.status}
              </StatusBadge>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="space-y-4">
                <Eyebrow>Account Info</Eyebrow>
                {selectedParticipant.joinDate && (
                  <div
                    className="p-4"
                    style={{
                      border: `1px solid ${T.border}`,
                      background: T.inputBg,
                      borderRadius: "2px",
                    }}
                  >
                    <Eyebrow>Registered</Eyebrow>
                    <p
                      className="text-sm mt-1"
                      style={{ color: T.cream, fontFamily: "monospace" }}
                    >
                      {new Date(
                        selectedParticipant.joinDate,
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <Eyebrow>
                  Challenge Solves ({selectedParticipant.solves?.length || 0})
                </Eyebrow>
                <div
                  className="mt-2 max-h-64 overflow-y-auto"
                  style={{
                    border: `1px solid ${T.border}`,
                    borderRadius: "2px",
                  }}
                >
                  {selectedParticipant.solves?.length > 0 ? (
                    selectedParticipant.solves.map((s, i) => (
                      <div
                        key={i}
                        className="px-4 py-2.5"
                        style={{
                          borderBottom: `1px solid ${T.border}`,
                          background: T.inputBg,
                        }}
                      >
                        <p className="text-sm" style={{ color: T.cream }}>
                          {s.challengeName}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          {s.category && (
                            <span
                              className="text-[10px]"
                              style={{ color: T.muted }}
                            >
                              {s.category}
                            </span>
                          )}
                          {s.difficulty && (
                            <span
                              className="text-[10px]"
                              style={{ color: diffColor(s.difficulty) }}
                            >
                              {s.difficulty.toUpperCase()}
                            </span>
                          )}
                          {s.points && (
                            <span
                              className="text-[10px]"
                              style={{
                                color: T.muted,
                                fontFamily: "monospace",
                              }}
                            >
                              {s.points}pts
                            </span>
                          )}
                          <span
                            className="text-[10px] ml-auto"
                            style={{ color: T.muted, fontFamily: "monospace" }}
                          >
                            {new Date(s.solvedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-10 text-center">
                      <Eyebrow>No challenges solved yet</Eyebrow>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <ModalFooter>
            <GhostBtn onClick={() => setShowParticipantModal(false)}>
              Close
            </GhostBtn>
            {can("participant.ban") && selectedParticipant._raw && (
              <BanBtn
                isBanned={selectedParticipant.status === "banned"}
                onClick={() => toggleParticipantBan(selectedParticipant._raw)}
                disabled={
                  banningUserId ===
                  (selectedParticipant._raw?.userId ||
                    selectedParticipant._raw?.username)
                }
              />
            )}
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
});
