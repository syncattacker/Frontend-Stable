"use client";

import React, { useState, useEffect } from "react";
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
} from "@remixicon/react";
import API from "@/utils/axios";
import { showToast } from "@/utils/Toast.jsx";
import watermark from "@/img/white.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import UserStats from "@/components/season/UserStats";
import { withAuth } from "@/utils/withAuth";

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

  const exportData = async () => {};

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

  return (
    <div className="min-h-screen bg-black text-white font-outfit relative overflow-hidden">
      <div
        className="fixed inset-0 opacity-5 bg-no-repeat bg-center bg-contain pointer-events-none z-0"
        style={{
          backgroundImage: "url('/brand-watermark.svg')",
          backgroundSize: "40%",
        }}
      />

      <button
        className="fixed bottom-6 left-6 z-50 bg-linear-to-t from-white to-zinc-300 hover:from-zinc-300 hover:to-white text-black font-medium px-3 py-2 rounded-xl shadow-2xl transition-all duration-300 hover:shadow-lime-500/25"
        onClick={() => router.push("/dashboard/seasons")}
      >
        <span className="text-sm font-semibold">Go to Dashboard</span>
      </button>

      <header className="border-b border-[rgba(254,252,232,0.12)] bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => {
                if (selectedSeason?.slug)
                  router.push(
                    `/dashboard/seasons/${selectedSeason.slug}/leaderboard`,
                  );
              }}
              disabled={!selectedSeason?.slug}
              className="group flex items-center gap-2 px-4 py-2 text-[#a1a1aa] hover:text-[#fefce8] text-xs tracking-wide font-normal transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <TrophyIcon className="h-3.5 w-3.5" />
              <span>Leaderboard</span>
            </button>

            <div className="w-px h-3.5 bg-[rgba(254,252,232,0.12)]" />

            <button
              onClick={() => router.push("/dashboard/profile")}
              className="group flex items-center gap-2 px-4 py-2 text-[#a1a1aa] hover:text-[#fefce8] text-xs tracking-wide font-normal transition-colors duration-150"
            >
              <UserIcon className="h-3.5 w-3.5" />
              <span>Profile</span>
            </button>

            <div className="w-px h-3.5 bg-[rgba(254,252,232,0.12)]" />

            <button
              onClick={() =>
                router.push(
                  `/dashboard/seasons/${selectedSeason.slug}/challenges`,
                )
              }
              className="group flex items-center gap-2 px-4 py-2 text-[#a1a1aa] hover:text-[#fefce8] text-xs tracking-wide font-normal transition-colors duration-150"
            >
              <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
              <span>Challenges</span>
            </button>

            <div className="w-px h-3.5 bg-[rgba(254,252,232,0.12)]" />

            <button
              onClick={() => router.push("/dashboard/host-your-event")}
              className="group flex items-center gap-2 px-4 py-2 text-[#a1a1aa] hover:text-[#fefce8] text-xs tracking-wide font-normal transition-colors duration-150"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>Create Season</span>
            </button>
          </div>

          <Image
            src={watermark}
            alt="Platform Logo"
            height={32}
            className="w-auto opacity-90"
            priority
          />
        </div>
      </header>

      <div className="flex relative z-10 min-h-screen">
        <aside className="w-70 shrink-0 bg-[#0A0A0A] border-r border-[rgba(254,252,232,0.12)] min-h-screen">
  <nav className="p-6">
    <div className="space-y-0.5">
      <h3 className="text-[9px] font-outfit text-[#a1a1aa] uppercase tracking-[0.25em] px-2 mb-3">
        Season Studio
      </h3>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`w-full flex items-center px-3 py-2.5 text-left transition-colors duration-150 rounded-none border-l-2 text-xs tracking-wide ${
            activeTab === tab.id
              ? "border-[#fefce8] text-[#fefce8] bg-[#111111]"
              : "border-transparent text-[#a1a1aa] hover:text-[#fefce8] hover:bg-[#111111]"
          }`}
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
                {publishingSeason ? "Publishing..." : seasonData.published ? "Published" : "Publish Season"}
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
                  ? selectedSeason?.isPaused ? "Resuming..." : "Pausing..."
                  : selectedSeason?.isPaused ? "Resume Season" : "Pause Season"}
              </span>
            </button>
          )}

          {can("season.registration.toggle") && (
            <button
              onClick={openRegistration}
              disabled={registrationLoading || selectedSeason?.isRegistrationOpen}
              className="w-full flex items-center gap-3 px-3 py-2.5 border border-[rgba(254,252,232,0.12)] hover:border-[rgba(254,252,232,0.22)] text-[#a1a1aa] hover:text-[#fefce8] text-xs tracking-wide uppercase font-medium transition-colors duration-150 rounded-none disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <PlayIcon className="h-3.5 w-3.5 shrink-0" />
              <span>
                {registrationLoading ? "Processing..." : selectedSeason?.isRegistrationOpen ? "Registration Open" : "Open Registration"}
              </span>
            </button>
          )}

          {can("season.registration.toggle") && (
            <button
              onClick={closeRegistration}
              disabled={registrationLoading || !selectedSeason?.isRegistrationOpen}
              className="w-full flex items-center gap-3 px-3 py-2.5 border border-[rgba(254,252,232,0.12)] hover:border-[rgba(254,252,232,0.22)] text-[#a1a1aa] hover:text-[#fefce8] text-xs tracking-wide uppercase font-medium transition-colors duration-150 rounded-none disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <StopIcon className="h-3.5 w-3.5 shrink-0" />
              <span>
                {registrationLoading ? "Processing..." : !selectedSeason?.isRegistrationOpen ? "Registration Closed" : "Close Registration"}
              </span>
            </button>
          )}

          <button
            onClick={exportData}
            disabled={registrationLoading || !selectedSeason || !hasParticipants}
            className="w-full flex items-center gap-3 px-3 py-2.5 border border-[rgba(254,252,232,0.12)] hover:border-[rgba(254,252,232,0.22)] text-[#a1a1aa] hover:text-[#fefce8] text-xs tracking-wide uppercase font-medium transition-colors duration-150 rounded-none disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>
              {registrationLoading ? "Exporting..." : !hasParticipants ? "No Data to Export" : "Export User Data"}
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
        </div>
      </div>
    )}
  </nav>
</aside>

        <main className="flex-1 min-w-0 p-8">
          {activeTab === 0 && (
            <div className="max-w-7xl mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-1 h-12 bg-linear-to-b from-white to-zinc-300 rounded-full mr-4 shadow-sm"></div>
                  <h2 className="font-roundo text-3xl font-bold text-white drop-shadow-sm">
                    Season Details
                  </h2>
                </div>
              </div>

              <div className="bg-black border border-zinc-800/40 rounded-2xl p-8 hover:border-zinc-700/50 transition-all duration-300 shadow-2xl">
                {loading ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-zinc-400 text-lg">
                      Loading season details...
                    </p>
                  </div>
                ) : seasons.length === 0 ? (
                  <div className="text-center py-16">
                    <TrophyIcon className="h-20 w-20 text-zinc-600 mx-auto mb-4" />
                    <p className="text-zinc-400 text-xl">
                      No seasons available
                    </p>
                    <p className="text-zinc-500 text-sm mt-2">
                      Contact your administrator to create seasons
                    </p>
                  </div>
                ) : selectedSeason ? (
                  <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-xl font-roundo font-semibold text-white mb-4">
                            Basic Information
                          </h3>
                          <div className="bg-black border border-zinc-700/40 p-4 rounded-xl">
                            <label className="block text-sm font-medium text-zinc-400 mb-2">
                              Season Name
                            </label>
                            <div className="text-lg font-medium text-white">
                              {seasonData.name}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-black border border-zinc-700/40 p-4 rounded-xl">
                              <label className="block text-sm font-medium text-zinc-400 mb-2">
                                Start Date & Time
                              </label>
                              <div className="text-white font-medium">
                                {formatDisplayDate(selectedSeason.startDate)}
                              </div>
                              {selectedSeason.startDate && (
                                <div className="text-sm text-zinc-300 mt-1 font-mono bg-zinc-900/30 px-2 py-1 rounded border border-zinc-800/20 inline-block">
                                  {formatDisplayTime(selectedSeason.startDate)}
                                </div>
                              )}
                            </div>
                            <div className="bg-black border border-zinc-700/40 p-4 rounded-xl">
                              <label className="block text-sm font-medium text-zinc-400 mb-2">
                                End Date & Time
                              </label>
                              <div className="text-white font-medium">
                                {formatDisplayDate(selectedSeason.endDate)}
                              </div>
                              {selectedSeason.endDate && (
                                <div className="text-sm text-zinc-300 mt-1 font-mono bg-zinc-900/30 px-2 py-1 rounded border border-zinc-800/20 inline-block">
                                  {formatDisplayTime(selectedSeason.endDate)}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="bg-black border border-zinc-700/40 p-4 rounded-xl mb-4">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <label className="text-sm font-medium text-zinc-400">
                                Registration Status
                              </label>
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold transition-all duration-200 ${selectedSeason?.isRegistrationOpen ? "text-white bg-zinc-800/50 border border-zinc-700/50" : "text-zinc-300 border border-zinc-700/30"}`}
                              >
                                {selectedSeason?.isRegistrationOpen
                                  ? "OPEN"
                                  : "CLOSED"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-xl font-roundo font-semibold text-white mb-4">
                            Status & Details
                          </h3>
                          <div className="bg-black border border-zinc-700/40 p-4 rounded-xl mb-4">
                            <label className="block text-sm font-medium text-zinc-400 mb-3">
                              Current Status
                            </label>
                            <div className="flex flex-wrap gap-2">
                              <span
                                className={`inline-flex items-center px-4 py-1 rounded-lg text-sm font-semibold transition-all duration-200 ${selectedSeason.isApproved ? "text-white bg-zinc-800/50 border border-zinc-700/50" : "text-black bg-white border border-zinc-300"}`}
                              >
                                {selectedSeason.isApproved
                                  ? "Approved"
                                  : "Pending Approval"}
                              </span>
                              {seasonData.published && (
                                <span className="inline-flex items-center px-4 py-1 rounded-lg text-sm bg-zinc-900/40 text-zinc-200 border border-zinc-700/40">
                                  Published
                                </span>
                              )}
                              {selectedSeason?.isPaused && (
                                <span className="inline-flex items-center px-4 py-1 rounded-lg text-sm bg-zinc-900/40 text-zinc-200 border border-zinc-700/40">
                                  Paused
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="bg-black border border-zinc-700/40 p-4 rounded-xl">
                            <label className="block text-sm font-medium text-zinc-400 mb-2">
                              Description
                            </label>
                            <div className="text-white whitespace-pre-wrap">
                              {selectedSeason.description || (
                                <span className="text-zinc-500 italic">
                                  No description available
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {can("integration.discord.manage") && (
                      <div className="mt-8 bg-black border border-zinc-700/40 p-6 rounded-2xl hover:border-zinc-700/50 transition-all duration-300 shadow-xl w-full">
                        <h3 className="text-xl font-roundo font-semibold text-white mb-4">
                          Discord Webhook
                        </h3>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">
                          Webhook URL
                        </label>

                        {isDiscordConnected ? (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <CheckCircleIcon className="h-5 w-5 text-green-500" />
                              <span className="text-green-400 font-medium">
                                Discord is connected
                              </span>
                            </div>
                            <div className="flex gap-4">
                              <input
                                type="text"
                                value={webhookUrl}
                                onChange={(e) => setWebhookUrl(e.target.value)}
                                disabled={webhookLoading}
                                placeholder="Enter new webhook URL to update"
                                className="w-5/6 px-4 py-3 bg-black border border-zinc-700/40 rounded-xl focus:outline-none focus:border-zinc-600/50 text-white placeholder-zinc-500"
                              />
                              <button
                                onClick={updateWebhook}
                                disabled={webhookLoading || !webhookUrl.trim()}
                                className="w-1/6 px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {webhookLoading ? "Updating..." : "Update"}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-4">
                            <input
                              type="text"
                              value={webhookUrl}
                              onChange={(e) => setWebhookUrl(e.target.value)}
                              disabled={webhookLoading}
                              placeholder="Enter Discord webhook URL"
                              className="w-5/6 px-4 py-3 bg-black border border-zinc-700/40 rounded-xl focus:outline-none focus:border-zinc-600/50 text-white placeholder-zinc-500"
                            />
                            <button
                              onClick={updateWebhook}
                              disabled={webhookLoading || !webhookUrl.trim()}
                              className="w-1/6 px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {webhookLoading ? "Connecting..." : "Connect"}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-16">
                    <FlagIcon className="h-20 w-20 text-zinc-600 mx-auto mb-4" />
                    <p className="text-zinc-400 text-xl">
                      Select a season to view details
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div className="max-w-7xl mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-1 h-12 bg-linear-to-b from-white to-zinc-300 rounded-full mr-4 shadow-sm"></div>
                  <div>
                    <h2 className="font-roundo text-3xl font-bold text-white drop-shadow-sm">
                      CTF Challenges
                    </h2>
                    {selectedSeason && (
                      <div className="text-sm pt-2 text-zinc-400">
                        Season:{" "}
                        <span className="text-white font-semibold">
                          {selectedSeason.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {selectedSeason && (
                    <button
                      onClick={() => setShowBulkVisibilityModal(true)}
                      disabled={!selectedSeason || challenges.length === 0}
                      className="flex items-center gap-3 px-6 py-3 bg-black border border-zinc-700/50 hover:border-zinc-600/60 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      <EyeIcon className="h-5 w-5" />
                      Bulk Visibility
                    </button>
                  )}
                  {can("challenge.create") && (
                    <button
                      onClick={openNewChallengeModal}
                      disabled={!selectedSeason}
                      className="flex items-center gap-3 px-6 py-3 bg-black border border-zinc-700/50 hover:border-zinc-600/60 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      <PlusIcon className="h-5 w-5" />
                      Create New Challenge
                    </button>
                  )}
                </div>
              </div>

              {!selectedSeason ? (
                <div className="bg-black border border-zinc-800/50 rounded-2xl p-16 text-center shadow-2xl">
                  <FlagIcon className="h-24 w-24 text-zinc-600 mx-auto mb-6" />
                  <h3 className="text-2xl font-roundo font-bold text-white mb-4">
                    Select a Season First
                  </h3>
                  <p className="text-zinc-400 text-lg mb-8 max-w-md mx-auto">
                    Please select a season from the Season Details tab before
                    managing challenges.
                  </p>
                </div>
              ) : challengeLoading ? (
                <div className="bg-black border border-zinc-800/50 rounded-2xl p-16 text-center shadow-2xl">
                  <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-zinc-400 text-lg">Loading challenges...</p>
                </div>
              ) : challenges.length === 0 ? (
                <div className="bg-black border border-zinc-800/50 rounded-2xl p-16 text-center shadow-2xl">
                  <h3 className="text-2xl font-roundo font-bold text-white mb-4">
                    No Challenges Yet
                  </h3>
                  <p className="text-zinc-400 text-lg mb-8 max-w-md mx-auto">
                    Start building your CTF by creating your first challenge.
                  </p>
                  {can("challenge.create") && (
                    <button
                      onClick={openNewChallengeModal}
                      className="px-8 py-4 bg-black border border-zinc-700/50 hover:border-zinc-600/60 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      Create Your First Challenge
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {challenges.map((challenge) => (
                    <div
                      key={challenge.slug}
                      className="bg-black border border-zinc-800/50 rounded-2xl p-6 hover:border-zinc-700/50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <span className="inline-block bg-zinc-800/60 border border-zinc-700/40 text-white text-xs px-3 py-1 rounded-lg mb-3 font-semibold">
                            {challenge.category}
                          </span>
                          <h3 className="font-roundo font-bold text-white text-lg mb-2">
                            {challenge.name}
                          </h3>
                        </div>
                      </div>
                      <div className="text-sm text-zinc-300 mb-4 space-y-3 bg-zinc-900/30 border border-zinc-800/30 p-4 rounded-xl">
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-400 font-medium">
                            Difficulty:
                          </span>
                          <span
                            className={`font-semibold px-2 py-1 rounded-md text-xs ${challenge.difficulty === "easy" ? "bg-green-900/30 text-green-400 border border-green-800/20" : challenge.difficulty === "medium" ? "bg-yellow-900/30 text-yellow-400 border border-yellow-800/20" : "bg-red-900/30 text-red-400 border border-red-800/20"}`}
                          >
                            {challenge.difficulty?.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-400 font-medium">
                            Points:
                          </span>
                          <span className="text-white font-semibold bg-zinc-800/40 px-2 py-1 rounded-md text-xs border border-zinc-700/30">
                            {challenge.points}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-400 font-medium">
                            Format:
                          </span>
                          <span className="text-zinc-300 font-mono text-xs bg-zinc-800/40 px-2 py-1 rounded-md border border-zinc-700/30">
                            {challenge.flagFormat}
                          </span>
                        </div>
                      </div>
                      <div className="bg-zinc-900/30 border border-zinc-800/30 p-4 rounded-xl mb-6">
                        <label className="block text-xs font-medium text-zinc-400 mb-2">
                          Description
                        </label>
                        <p className="text-sm text-zinc-300 line-clamp-3">
                          {challenge.description || (
                            <span className="italic text-zinc-500">
                              No description provided
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          {can("challenge.update") && (
                            <button
                              onClick={() => openEditChallengeModal(challenge)}
                              disabled={challengeLoading}
                              className="text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-zinc-800/50 border border-zinc-800/30 hover:border-zinc-700/50 transition-all duration-300 disabled:opacity-50"
                              title="Edit Challenge"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                          )}
                          {can("challenge.delete") && (
                            <button
                              onClick={() => deleteChallenge(challenge)}
                              disabled={challengeLoading}
                              className="text-zinc-400 hover:text-red-400 p-2 rounded-lg hover:bg-zinc-800/50 border border-zinc-800/30 hover:border-red-800/50 transition-all duration-300 disabled:opacity-50"
                              title="Delete Challenge"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          )}
                          {can("challenge.update") && (
                            <button
                              onClick={() => toggleVisibility(challenge)}
                              disabled={challengeLoading}
                              className="text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-zinc-800/50 border border-zinc-800/30 hover:border-zinc-700/50 transition-all duration-300 disabled:opacity-50"
                              title={
                                challenge.isVisible !== false
                                  ? "Hide Challenge"
                                  : "Show Challenge"
                              }
                            >
                              {challenge.isVisible !== false ? (
                                <EyeIcon className="h-4 w-4" />
                              ) : (
                                <EyeSlashIcon className="h-4 w-4" />
                              )}
                            </button>
                          )}
                          {can("flag.view") && (
                            <button
                              onClick={() => openRevealFlagModal(challenge)}
                              disabled={challengeLoading}
                              className="text-zinc-400 hover:text-zinc-400 p-2 rounded-lg hover:bg-zinc-800/50 border border-zinc-800/30 hover:border-zinc-700/50 transition-all duration-300 disabled:opacity-50"
                              title="Reveal Flag"
                            >
                              <FlagIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showBulkVisibilityModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                  <div className="bg-black border border-zinc-800/50 rounded-2xl w-full max-w-md shadow-2xl">
                    <div className="flex justify-between items-center p-6 border-b border-zinc-800/50">
                      <h3 className="text-xl font-roundo font-bold text-white">
                        Bulk Challenge Visibility
                      </h3>
                      <button
                        onClick={() => {
                          setShowBulkVisibilityModal(false);
                          setBulkVisibilityForm({
                            difficulty: "",
                            isVisible: true,
                          });
                        }}
                        disabled={bulkVisibilityLoading}
                        className="text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-zinc-800/50 border border-zinc-800/30 hover:border-zinc-700/50 transition-colors duration-200 disabled:opacity-50"
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    </div>
                    <div className="p-6 space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-white mb-3">
                          Select Difficulty Level
                        </label>
                        <div className="relative">
                          <select
                            value={bulkVisibilityForm.difficulty}
                            onChange={(e) =>
                              setBulkVisibilityForm((prev) => ({
                                ...prev,
                                difficulty: e.target.value,
                              }))
                            }
                            disabled={bulkVisibilityLoading}
                            className="w-full px-4 py-3 pr-12 bg-black border border-zinc-700/40 rounded-xl focus:outline-none focus:border-zinc-600/50 text-white hover:border-zinc-600/60 transition-all duration-200 disabled:opacity-50 appearance-none cursor-pointer"
                            required
                          >
                            <option value="">Choose difficulty...</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                            <svg
                              className="w-5 h-5 text-zinc-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-white mb-3">
                          Visibility Action
                        </label>
                        <div className="space-y-3">
                          <label className="flex items-center p-3 rounded-xl border border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-200 cursor-pointer">
                            <input
                              type="radio"
                              name="visibilityAction"
                              checked={bulkVisibilityForm.isVisible === true}
                              onChange={() =>
                                setBulkVisibilityForm((prev) => ({
                                  ...prev,
                                  isVisible: true,
                                }))
                              }
                              disabled={bulkVisibilityLoading}
                              className="w-4 h-4 text-white bg-transparent border-2 border-zinc-700/50 focus:ring-white focus:ring-2 disabled:opacity-50"
                            />
                            <span className="ml-3 text-white font-medium">
                              Make Visible (Show challenges)
                            </span>
                          </label>
                          <label className="flex items-center p-3 rounded-xl border border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-200 cursor-pointer">
                            <input
                              type="radio"
                              name="visibilityAction"
                              checked={bulkVisibilityForm.isVisible === false}
                              onChange={() =>
                                setBulkVisibilityForm((prev) => ({
                                  ...prev,
                                  isVisible: false,
                                }))
                              }
                              disabled={bulkVisibilityLoading}
                              className="w-4 h-4 text-white bg-transparent border-2 border-zinc-700/50 focus:ring-white focus:ring-2 disabled:opacity-50"
                            />
                            <span className="ml-3 text-white font-medium">
                              Make Hidden (Hide challenges)
                            </span>
                          </label>
                        </div>
                      </div>
                      {bulkVisibilityForm.difficulty && (
                        <div className="bg-yellow-900/20 border border-yellow-800/30 rounded-xl p-4">
                          <div className="flex items-start">
                            <svg
                              className="h-5 w-5 text-yellow-400 shrink-0"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <div className="ml-3">
                              <h4 className="text-sm font-semibold text-yellow-300">
                                Confirmation Required
                              </h4>
                              <p className="text-sm text-yellow-200 mt-1">
                                Are you sure you want to{" "}
                                {bulkVisibilityForm.isVisible ? "show" : "hide"}{" "}
                                all{" "}
                                <span className="font-semibold">
                                  {bulkVisibilityForm.difficulty}
                                </span>{" "}
                                challenges?
                              </p>
                              <p className="text-xs text-yellow-300 mt-2">
                                This action will affect multiple challenges at
                                once.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end space-x-4 p-6 pt-0">
                      <button
                        onClick={() => {
                          setShowBulkVisibilityModal(false);
                          setBulkVisibilityForm({
                            difficulty: "",
                            isVisible: true,
                          });
                        }}
                        disabled={bulkVisibilityLoading}
                        className="px-6 py-3 text-sm font-semibold text-zinc-400 bg-zinc-800/50 border border-zinc-700/40 hover:border-zinc-600/50 hover:bg-zinc-800/70 rounded-xl transition-all duration-300 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleBulkVisibilityToggle}
                        disabled={
                          bulkVisibilityLoading ||
                          !bulkVisibilityForm.difficulty
                        }
                        className="px-8 py-3 text-sm font-semibold text-white bg-black border border-zinc-700/50 hover:border-zinc-600/60 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {bulkVisibilityLoading
                          ? "Processing..."
                          : "Apply Changes"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 2 && (
            <div className="max-w-7xl mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-1 h-12 bg-linear-to-b from-white to-zinc-300 rounded-full mr-4 shadow-sm"></div>
                  <div>
                    <h2 className="font-roundo text-3xl font-bold text-white drop-shadow-sm">
                      Season Participants
                    </h2>
                    {selectedSeason && (
                      <div className="flex items-center pt-2 gap-3">
                        <div className="text-sm text-zinc-400">
                          Season:{" "}
                          <span className="text-white font-semibold">
                            {selectedSeason.name}
                          </span>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${seasonMode === "team" ? "bg-blue-900/30 text-blue-300 border-blue-800/40" : "bg-zinc-800/50 text-zinc-300 border-zinc-700/40"}`}
                        >
                          {seasonMode === "team" ? (
                            <UsersIcon className="h-3 w-3" />
                          ) : (
                            <UserIcon className="h-3 w-3" />
                          )}
                          {seasonMode === "team" ? "Team Mode" : "Solo Mode"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {selectedSeason && hasParticipants && (
                  <div className="relative max-w-md">
                    <input
                      type="text"
                      placeholder={
                        seasonMode === "team"
                          ? "Search by team or username..."
                          : "Search by username..."
                      }
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 pr-12 bg-black border border-zinc-700/40 rounded-xl focus:outline-none focus:border-zinc-600/50 text-white placeholder-zinc-500 hover:border-zinc-600/60 transition-all duration-200"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-zinc-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              {!selectedSeason ? (
                <div className="bg-black border border-zinc-800/50 rounded-2xl p-16 text-center shadow-2xl">
                  <UsersIcon className="h-24 w-24 text-zinc-600 mx-auto mb-6" />
                  <h3 className="text-2xl font-roundo font-bold text-white mb-4">
                    Select a Season First
                  </h3>
                  <p className="text-zinc-400 text-lg max-w-md mx-auto">
                    Please select a season from the Season Details tab to view
                    participants.
                  </p>
                </div>
              ) : participantsLoading ? (
                <div className="bg-black border border-zinc-800/50 rounded-2xl p-16 text-center shadow-2xl">
                  <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-zinc-400 text-lg">
                    Loading participants...
                  </p>
                </div>
              ) : participantsError ? (
                <div className="bg-black border border-zinc-800/50 rounded-2xl p-8 text-center shadow-2xl">
                  <div className="text-red-400 text-6xl mb-4">⚠️</div>
                  <h3 className="text-xl font-roundo font-bold text-zinc-300 mb-2">
                    Error Loading Participants
                  </h3>
                  <p className="text-red-400 mb-6">{participantsError}</p>
                  <button
                    onClick={fetchParticipants}
                    className="px-6 py-3 bg-black border border-red-700/50 hover:border-red-600/60 text-red-400 hover:text-red-300 rounded-xl font-semibold transition-all duration-300"
                  >
                    Try Again
                  </button>
                </div>
              ) : !hasParticipants ? (
                <div className="bg-black border border-zinc-800/50 rounded-2xl p-16 text-center shadow-2xl">
                  <h3 className="text-2xl font-roundo font-bold text-white mb-4">
                    No Participants Yet
                  </h3>
                  <p className="text-zinc-400 text-lg max-w-md mx-auto">
                    Participants will appear here once they join your CTF
                    season.
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-black border border-zinc-800/50 rounded-2xl px-6 py-4 hover:border-zinc-700/50 transition-all duration-300 shadow-2xl">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <h3 className="text-lg font-roundo font-semibold text-white">
                        {searchTerm
                          ? `Found: ${seasonMode === "team" ? filteredTeams.length + " teams" : filteredSoloParticipants.length + " participants"} matching "${searchTerm}"`
                          : seasonMode === "team"
                            ? `${teamsData.length} Teams · ${totalParticipantCount} Members`
                            : `Total Participants: ${totalParticipantCount}`}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-zinc-400">
                        <span className="flex items-center gap-2 bg-zinc-800/50 px-3 py-1 rounded-lg border border-zinc-700/40">
                          <div className="w-3 h-3 rounded-full bg-green-400"></div>
                          Active:{" "}
                          <span className="text-white font-semibold">
                            {activeCount}
                          </span>
                        </span>
                        <span className="flex items-center gap-2 bg-zinc-800/50 px-3 py-1 rounded-lg border border-zinc-700/40">
                          <div className="w-3 h-3 rounded-full bg-red-400"></div>
                          Banned:{" "}
                          <span className="text-white font-semibold">
                            {bannedCount}
                          </span>
                        </span>
                        {seasonMode === "team" && (
                          <span className="flex items-center gap-2 bg-zinc-800/50 px-3 py-1 rounded-lg border border-zinc-700/40">
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            Banned Teams:{" "}
                            <span className="text-white font-semibold">
                              {teamsData.filter((t) => t.isBanned).length}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {seasonMode === "solo" && (
                    <div className="bg-black border border-zinc-800/50 rounded-2xl overflow-hidden shadow-2xl">
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead className="bg-zinc-900/30 border-b border-zinc-800/50">
                            <tr>
                              <th className="px-4 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                                Participant
                              </th>
                              <th className="px-4 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                                Email Address
                              </th>
                              <th className="px-4 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-4 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                                Join Date
                              </th>
                              <th className="px-4 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-800/50">
                            {paginatedSoloParticipants.map(
                              (participant, index) => (
                                <tr
                                  key={`${participant.username}-${index}`}
                                  className="hover:bg-zinc-900/30 transition-colors duration-200"
                                >
                                  <td className="px-4 py-6 whitespace-nowrap">
                                    <div className="text-base font-semibold text-white">
                                      {participant.username}
                                    </div>
                                  </td>
                                  <td className="px-4 py-6 whitespace-nowrap">
                                    <div className="text-sm text-zinc-300 bg-zinc-900/30 px-3 py-1 rounded-lg border border-zinc-800/30 inline-block">
                                      {participant.email}
                                    </div>
                                  </td>
                                  <td className="px-4 py-6 whitespace-nowrap">
                                    <span
                                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-lg border ${!participant.isBanned ? "bg-green-900/30 text-green-400 border-green-800/30" : "bg-red-900/30 text-red-400 border-red-800/30"}`}
                                    >
                                      {!participant.isBanned
                                        ? "Active"
                                        : "Banned"}
                                    </span>
                                  </td>
                                  <td className="px-4 py-6 whitespace-nowrap">
                                    <div className="text-sm text-zinc-400 bg-zinc-900/30 px-3 py-1 rounded-lg border border-zinc-800/30 inline-block font-mono">
                                      {new Date(
                                        participant.joinedAt,
                                      ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                      })}
                                    </div>
                                  </td>
                                  <td className="px-4 py-6 whitespace-nowrap text-sm font-medium space-x-3">
                                    <button
                                      onClick={() =>
                                        viewParticipant(participant)
                                      }
                                      className="text-white hover:text-zinc-300 px-4 py-2 bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600/60 hover:bg-zinc-800/70 rounded-lg transition-all duration-300"
                                    >
                                      View Details
                                    </button>
                                    {can("participant.ban") && (
                                      <button
                                        onClick={() =>
                                          toggleParticipantBan(participant)
                                        }
                                        disabled={
                                          banningUserId ===
                                          (participant.userId ||
                                            participant.username)
                                        }
                                        className={`px-4 py-2 border rounded-lg transition-all duration-300 disabled:opacity-50 ${participant.isBanned ? "text-green-400 hover:text-green-300 bg-green-900/20 border-green-800/40 hover:border-green-700/60 hover:bg-green-900/30" : "text-red-400 hover:text-red-300 bg-red-900/20 border-red-800/40 hover:border-red-700/60 hover:bg-red-900/30"}`}
                                      >
                                        {banningUserId ===
                                        (participant.userId ||
                                          participant.username)
                                          ? "Processing..."
                                          : participant.isBanned
                                            ? "Unban User"
                                            : "Ban User"}
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ),
                            )}
                          </tbody>
                        </table>
                      </div>
                      <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800/50">
                        <span className="text-sm text-zinc-300">
                          Page {currentPage} of {totalSoloPages || 1}
                        </span>
                        <div className="flex gap-3">
                          <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
                            className="px-4 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-white disabled:opacity-40"
                          >
                            Previous
                          </button>
                          <button
                            disabled={
                              currentPage === totalSoloPages ||
                              totalSoloPages === 0
                            }
                            onClick={() => setCurrentPage((p) => p + 1)}
                            className="px-4 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-white disabled:opacity-40"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {seasonMode === "team" && (
                    <div className="space-y-4">
                      {paginatedTeams.map((team) => (
                        <div
                          key={team.teamId}
                          className={`bg-black border rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ${team.isBanned ? "border-red-800/50 hover:border-red-700/60" : "border-zinc-800/50 hover:border-zinc-700/50"}`}
                        >
                          <div
                            className={`px-6 py-4 border-b flex items-center justify-between flex-wrap gap-3 ${team.isBanned ? "bg-red-950/20 border-red-800/40" : "bg-zinc-900/40 border-zinc-800/50"}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-zinc-800 border border-zinc-700/50 rounded-xl flex items-center justify-center shrink-0">
                                <UsersIcon className="h-4 w-4 text-zinc-300" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-white font-roundo font-bold text-base">
                                    {team.teamName}
                                  </span>
                                  {team.isLocked ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-zinc-800/60 border border-zinc-700/40 text-zinc-300">
                                      <LockClosedIcon className="h-3 w-3" />{" "}
                                      Locked
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-zinc-800/40 border border-zinc-700/30 text-zinc-400">
                                      <LockOpenIcon className="h-3 w-3" /> Open
                                    </span>
                                  )}
                                  {team.isBanned && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-red-900/40 border border-red-800/40 text-red-300">
                                      Team Banned
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-zinc-500 mt-0.5">
                                  {team.members.length} member
                                  {team.members.length !== 1 ? "s" : ""}
                                </div>
                              </div>
                            </div>
                            {can("participant.ban") && (
                              <button
                                onClick={() => toggleTeamBan(team)}
                                disabled={banningTeamId === team.teamId}
                                className={`px-4 py-2 text-sm font-semibold border rounded-lg transition-all duration-300 disabled:opacity-50 ${team.isBanned ? "text-green-400 hover:text-green-300 bg-green-900/20 border-green-800/40 hover:border-green-700/60 hover:bg-green-900/30" : "text-red-400 hover:text-red-300 bg-red-900/20 border-red-800/40 hover:border-red-700/60 hover:bg-red-900/30"}`}
                              >
                                {banningTeamId === team.teamId
                                  ? "Processing..."
                                  : team.isBanned
                                    ? "Unban Team"
                                    : "Ban Team"}
                              </button>
                            )}
                          </div>

                          <div className="overflow-x-auto">
                            <table className="min-w-full">
                              <thead className="bg-zinc-900/20 border-b border-zinc-800/30">
                                <tr>
                                  <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                                    Username
                                  </th>
                                  <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                                    Email
                                  </th>
                                  <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                                    Status
                                  </th>
                                  <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-zinc-800/30">
                                {team.members.map((member) => (
                                  <tr
                                    key={member.userId}
                                    className="hover:bg-zinc-900/20 transition-colors duration-200"
                                  >
                                    <td className="px-5 py-4 whitespace-nowrap">
                                      <div className="text-sm font-semibold text-white">
                                        {member.username}
                                      </div>
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap">
                                      <div className="text-sm text-zinc-300 bg-zinc-900/30 px-3 py-1 rounded-lg border border-zinc-800/30 inline-block">
                                        {member.email}
                                      </div>
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap">
                                      <span
                                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-lg border ${!member.isBanned ? "bg-green-900/30 text-green-400 border-green-800/30" : "bg-red-900/30 text-red-400 border-red-800/30"}`}
                                      >
                                        {!member.isBanned ? "Active" : "Banned"}
                                      </span>
                                    </td>
                                    <td className="px-5 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                      <button
                                        onClick={() => viewParticipant(member)}
                                        className="text-white hover:text-zinc-300 px-3 py-1.5 bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600/60 hover:bg-zinc-800/70 rounded-lg transition-all duration-300 text-xs"
                                      >
                                        View Details
                                      </button>
                                      {can("participant.ban") && (
                                        <button
                                          onClick={() =>
                                            toggleParticipantBan(member)
                                          }
                                          disabled={
                                            banningUserId === member.userId
                                          }
                                          className={`px-3 py-1.5 text-xs border rounded-lg transition-all duration-300 disabled:opacity-50 ${member.isBanned ? "text-green-400 hover:text-green-300 bg-green-900/20 border-green-800/40 hover:border-green-700/60 hover:bg-green-900/30" : "text-red-400 hover:text-red-300 bg-red-900/20 border-red-800/40 hover:border-red-700/60 hover:bg-red-900/30"}`}
                                        >
                                          {banningUserId === member.userId
                                            ? "Processing..."
                                            : member.isBanned
                                              ? "Unban"
                                              : "Ban"}
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}

                      <div className="flex items-center justify-between px-2 py-2">
                        <span className="text-sm text-zinc-300">
                          Page {currentPage} of {totalTeamPages || 1}
                        </span>
                        <div className="flex gap-3">
                          <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
                            className="px-4 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-white disabled:opacity-40"
                          >
                            Previous
                          </button>
                          <button
                            disabled={
                              currentPage === totalTeamPages ||
                              totalTeamPages === 0
                            }
                            onClick={() => setCurrentPage((p) => p + 1)}
                            className="px-4 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-white disabled:opacity-40"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {can("admin.manage") && activeTab === 3 && (
            <div className="max-w-7xl mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-1 h-12 bg-linear-to-b from-white to-zinc-300 rounded-full mr-4 shadow-sm"></div>
                  <div>
                    <h2 className="font-roundo text-3xl font-bold text-white drop-shadow-sm">
                      Season Admins
                    </h2>
                    {selectedSeason && (
                      <div className="text-sm pt-2 text-zinc-400">
                        Season:{" "}
                        <span className="text-white font-semibold">
                          {selectedSeason.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {can("admin.manage") && (
                <div className="bg-black border border-zinc-800/40 rounded-2xl p-8 hover:border-zinc-700/50 transition-all duration-300 shadow-2xl">
                  <h3 className="text-xl font-roundo font-semibold text-white mb-6">
                    Assign Role
                  </h3>
                  <form
                    onSubmit={handleAddMember}
                    className="flex gap-4 items-end"
                  >
                    <div className="flex-1 max-w-md">
                      <label className="block text-sm font-medium text-zinc-400 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        value={newMember.username}
                        onChange={(e) =>
                          setNewMember((prev) => ({
                            ...prev,
                            username: e.target.value,
                          }))
                        }
                        placeholder="Enter username"
                        className="w-full px-4 py-3 bg-black border border-zinc-700/40 rounded-xl focus:outline-none focus:border-zinc-600/50 text-white placeholder-zinc-500 hover:border-zinc-600/60 transition-all duration-200"
                        disabled={addingAdmin}
                        required
                      />
                    </div>
                    <div className="w-44">
                      <label className="block text-sm font-medium text-zinc-400 mb-2">
                        Role
                      </label>
                      <select
                        value={newMember.role}
                        onChange={(e) =>
                          setNewMember((prev) => ({
                            ...prev,
                            role: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 bg-black border border-zinc-700/40 rounded-xl focus:outline-none focus:border-zinc-600/50 text-white hover:border-zinc-600/60 transition-all duration-200"
                        disabled={addingAdmin}
                      >
                        <option value="admin">admin</option>
                        <option value="challenge_manager">
                          challenge_manager
                        </option>
                        <option value="moderator">moderator</option>
                        <option value="viewer">viewer</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      disabled={addingAdmin || !newMember.username.trim()}
                      className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {addingAdmin ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                          Assigning...
                        </div>
                      ) : (
                        "Assign Role"
                      )}
                    </button>
                  </form>
                </div>
              )}

              <div className="bg-black border border-zinc-800/40 rounded-2xl p-8 hover:border-zinc-700/50 transition-all duration-300 shadow-2xl">
                {adminLoading ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-zinc-400 text-lg">Loading admins...</p>
                  </div>
                ) : !selectedSeason ? (
                  <div className="text-center py-16">
                    <p className="text-zinc-400 text-xl">
                      Please select a season first
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <h3 className="text-xl font-roundo font-semibold text-white">
                      Current Admins for {selectedSeason.name}
                    </h3>
                    {adminsData.organizer && (
                      <div className="space-y-4">
                        <h4 className="text-lg font-roundo font-medium text-zinc-300">
                          Organizer
                        </h4>
                        <div className="bg-black border border-zinc-700/40 p-6 rounded-xl">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-linear-to-br from-white to-zinc-300 rounded-full flex items-center justify-center">
                                <svg
                                  className="w-6 h-6 text-black"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              </div>
                              <div>
                                <div className="text-white font-semibold">
                                  {adminsData.organizer.username}
                                </div>
                                <div className="text-zinc-400 text-sm">
                                  {adminsData.organizer.email}
                                </div>
                              </div>
                            </div>
                            <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold bg-white text-black">
                              ORGANIZER
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="space-y-4">
                      <h4 className="text-lg font-roundo font-medium text-zinc-300">
                        Admins ({adminsData.admins?.length || 0})
                      </h4>
                      {adminsData.admins && adminsData.admins.length > 0 ? (
                        <div className="space-y-3">
                          {adminsData.admins.map((admin, index) => (
                            <div
                              key={index}
                              className="bg-black border border-zinc-700/40 p-6 rounded-xl"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="w-12 h-12 bg-linear-to-br from-zinc-700 to-zinc-800 rounded-full flex items-center justify-center">
                                    <svg
                                      className="w-6 h-6 text-white"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                  </div>
                                  <div>
                                    <div className="text-white font-semibold">
                                      {admin.username}
                                    </div>
                                    <div className="text-zinc-400 text-sm">
                                      {admin.email}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <span
                                    title={admin.role}
                                    className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold bg-zinc-800/50 text-zinc-200 border border-zinc-700/50 cursor-help"
                                  >
                                    {admin.role === "admin"
                                      ? "A"
                                      : admin.role === "challenge_manager"
                                        ? "CM"
                                        : admin.role === "moderator"
                                          ? "M"
                                          : admin.role === "viewer"
                                            ? "V"
                                            : admin.role?.toUpperCase()}
                                  </span>
                                  {can("admin.manage") && (
                                    <button
                                      onClick={() =>
                                        handleDeleteAdmin(admin.username)
                                      }
                                      disabled={
                                        deletingAdminUsername === admin.username
                                      }
                                      className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-900/20 border border-zinc-800/30 hover:border-red-800/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                      title="Remove Admin"
                                    >
                                      {deletingAdminUsername ===
                                      admin.username ? (
                                        <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                                      ) : (
                                        <TrashIcon className="h-4 w-4" />
                                      )}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 border border-zinc-800/40 rounded-xl bg-black">
                          <p className="text-zinc-400 text-lg">
                            No admins added yet
                          </p>
                          <p className="text-zinc-500 text-sm mt-2">
                            Add admins using the form above
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {can("notification.send") && activeTab === 4 && (
            <div className="max-w-7xl mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-1 h-12 bg-linear-to-b from-white to-zinc-300 rounded-full mr-4 shadow-sm"></div>
                  <div>
                    <h2 className="font-roundo text-3xl font-bold text-white drop-shadow-sm">
                      Send Notification
                    </h2>
                    {selectedSeason && (
                      <div className="text-sm pt-2 text-zinc-400">
                        Season:{" "}
                        <span className="text-white font-semibold">
                          {selectedSeason.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {!selectedSeason ? (
                <div className="bg-black border border-zinc-800/50 rounded-2xl p-16 text-center shadow-2xl">
                  <svg
                    className="h-24 w-24 text-zinc-600 mx-auto mb-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <h3 className="text-2xl font-roundo font-bold text-white mb-4">
                    Select a Season First
                  </h3>
                  <p className="text-zinc-400 text-lg max-w-md mx-auto">
                    Please select a season from the Season Details tab to send
                    notifications.
                  </p>
                </div>
              ) : (
                <div className="bg-black border border-zinc-800/50 rounded-2xl p-8 hover:border-zinc-700/50 transition-all duration-300 shadow-2xl">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-lg font-semibold text-white mb-4">
                        Notification Type
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                          { value: "ANNOUNCEMENT", label: "Announcement" },
                          { value: "HINT", label: "Hint" },
                          { value: "BAN", label: "Ban" },
                          { value: "WAVE-RELEASE", label: "Wave Release" },
                        ].map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() =>
                              setNotificationForm((prev) => ({
                                ...prev,
                                type: type.value,
                              }))
                            }
                            disabled={sendingNotification}
                            className="relative p-4 rounded-xl border transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-zinc-900/30 border-zinc-700/40 hover:border-zinc-600/60 hover:bg-zinc-800/50"
                          >
                            {notificationForm.type === type.value && (
                              <div className="absolute top-2 right-2">
                                <svg
                                  className="w-5 h-5 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            )}
                            <div className="text-sm font-semibold text-white">
                              {type.label}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-lg font-semibold text-white mb-3">
                        Message
                      </label>
                      <textarea
                        value={notificationForm.message}
                        onChange={(e) =>
                          setNotificationForm((prev) => ({
                            ...prev,
                            message: e.target.value,
                          }))
                        }
                        disabled={sendingNotification}
                        rows={8}
                        placeholder="Enter your notification message here..."
                        className="w-full px-4 py-3 bg-black border border-zinc-700/40 rounded-xl focus:outline-none focus:border-zinc-600/50 text-white placeholder-zinc-500 resize-none hover:border-zinc-600/60 transition-all duration-200 disabled:opacity-50"
                        required
                      />
                    </div>
                    {notificationForm.type === "BAN" && (
                      <div className="bg-red-900/20 border border-red-800/30 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <svg
                            className="h-5 w-5 text-red-400 shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <div>
                            <h4 className="text-sm font-semibold text-red-300">
                              Warning: Ban Notification
                            </h4>
                            <p className="text-sm text-red-200 mt-1">
                              This will send a ban notification to participants.
                              Make sure your message is clear.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {notificationForm.type === "HINT" && (
                      <div className="bg-yellow-900/20 border border-yellow-800/30 rounded-xl p-4">
                        <div className="ml-3">
                          <h4 className="text-sm font-semibold text-yellow-300">
                            Hint Notification
                          </h4>
                          <p className="text-sm text-yellow-200 mt-1">
                            This will send a hint to all participants. Consider
                            the timing and difficulty balance.
                          </p>
                        </div>
                      </div>
                    )}
                    {notificationForm.type === "WAVE-RELEASE" && (
                      <div className="bg-cyan-900/20 border border-cyan-800/30 rounded-xl p-4">
                        <div className="ml-3">
                          <h4 className="text-sm font-semibold text-cyan-300">
                            Wave Release
                          </h4>
                          <p className="text-sm text-cyan-200 mt-1">
                            Notify participants about a new wave of challenges
                            being released.
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex justify-end space-x-4 pt-4">
                      <button
                        onClick={() =>
                          setNotificationForm({
                            type: "ANNOUNCEMENT",
                            message: "",
                          })
                        }
                        disabled={sendingNotification}
                        className="px-6 py-3 text-sm font-semibold text-zinc-400 bg-zinc-800/50 border border-zinc-700/40 hover:border-zinc-600/50 hover:bg-zinc-800/70 rounded-xl transition-all duration-300 disabled:opacity-50"
                      >
                        Clear Form
                      </button>
                      <button
                        onClick={sendNotification}
                        disabled={
                          sendingNotification ||
                          !notificationForm.message.trim()
                        }
                        className="px-8 py-3 text-sm font-semibold text-white bg-zinc-700/30 border border-zinc-700/50 hover:border-zinc-600/60 hover:bg-zinc-700 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {sendingNotification ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Sending...
                          </div>
                        ) : (
                          "Send Notification"
                        )}
                      </button>
                    </div>
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

      {showDeleteSeasonModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-black border border-zinc-700/30 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center px-4 py-2 border-b border-zinc-700/30">
              <h3 className="text-xl font-roundo font-bold text-white">
                Delete Season
              </h3>
              <button
                onClick={() => {
                  setShowDeleteSeasonModal(false);
                  setDeletingSeasonSlug("");
                }}
                disabled={deleteSeasonLoading}
                className="text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-zinc-800/50 border border-zinc-800/30 hover:border-zinc-700/50 transition-colors duration-200 disabled:opacity-50"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="bg-red-900/20 border border-red-800/30 rounded-xl p-4">
                <div className="flex items-start">
                  <svg
                    className="h-6 w-6 text-red-400 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="ml-3">
                    <h4 className="text-sm font-semibold text-red-300">
                      Warning: This action cannot be undone
                    </h4>
                    <p className="text-sm text-red-200 mt-2">
                      Deleting this season will permanently remove:
                    </p>
                    <ul className="text-sm text-red-200 mt-2 list-disc list-inside space-y-1">
                      <li>All challenges and their files</li>
                      <li>All participant data and registrations</li>
                      <li>Complete leaderboard and scoring history</li>
                      <li>All season statistics and analytics</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-white mb-2">
                  Season to be deleted:
                </h4>
                <p className="text-white font-medium">{selectedSeason?.name}</p>
              </div>
            </div>
            <div className="flex justify-end space-x-4 p-4 pt-0">
              <button
                onClick={() => {
                  setShowDeleteSeasonModal(false);
                  setDeletingSeasonSlug("");
                }}
                disabled={deleteSeasonLoading}
                className="px-6 py-3 text-sm font-semibold text-zinc-400 bg-zinc-800/50 border border-zinc-700/40 hover:border-zinc-600/50 hover:bg-zinc-800/70 rounded-xl transition-all duration-300 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={deleteSeason}
                disabled={deleteSeasonLoading}
                className="px-8 py-3 text-sm font-semibold text-white bg-red-600 border border-red-700/50 hover:border-red-600/60 hover:bg-red-700 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteSeasonLoading ? "Deleting..." : "Delete Season"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showChallengeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-black border border-zinc-800/50 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-800/50">
              <h3 className="text-2xl font-roundo font-bold text-white">
                {editingChallenge ? "Edit Challenge" : "Create New Challenge"}
              </h3>
              <button
                onClick={() => setShowChallengeModal(false)}
                disabled={challengeLoading}
                className="text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-zinc-800/50 border border-zinc-800/30 hover:border-zinc-700/50 transition-colors duration-200 disabled:opacity-50"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white mb-4">
                    Challenge Configuration
                  </h4>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Challenge Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={challengeForm.name}
                      onChange={handleChallengeFormChange}
                      disabled={challengeLoading}
                      className="w-full px-4 py-3 bg-black border border-zinc-700/40 rounded-xl focus:outline-none focus:border-zinc-600/50 text-white placeholder-zinc-500 hover:border-zinc-600/60 transition-all duration-200 disabled:opacity-50"
                      placeholder="Enter challenge name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Category *
                    </label>
                    <div className="relative">
                      <select
                        name="category"
                        value={challengeForm.category}
                        onChange={handleChallengeFormChange}
                        disabled={challengeLoading}
                        className="w-full px-4 py-3 pr-12 bg-black border border-zinc-700/40 rounded-xl focus:outline-none focus:border-zinc-600/50 text-white hover:border-zinc-600/60 transition-all duration-200 disabled:opacity-50 appearance-none cursor-pointer"
                        required
                      >
                        <option value="">Select Category</option>
                        {CHALLENGE_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <svg
                          className="w-5 h-5 text-zinc-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        Difficulty Level
                      </label>
                      <div className="relative">
                        <select
                          name="difficulty"
                          value={challengeForm.difficulty}
                          onChange={handleChallengeFormChange}
                          disabled={challengeLoading}
                          className="w-full px-4 py-3 pr-12 bg-black border border-zinc-700/40 rounded-xl focus:outline-none focus:border-zinc-600/50 text-white hover:border-zinc-600/60 transition-all duration-200 disabled:opacity-50 appearance-none cursor-pointer"
                        >
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                          <svg
                            className="w-5 h-5 text-zinc-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        Points Value
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="points"
                          value={challengeForm.points}
                          onChange={handleChallengeFormChange}
                          disabled={challengeLoading}
                          className="w-full px-4 py-3 pr-20 bg-black border border-zinc-700/40 rounded-xl focus:outline-none focus:border-zinc-600/50 text-white hover:border-zinc-600/60 transition-all duration-200 disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="100"
                          min="1"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                          <div className="flex flex-col">
                            <button
                              type="button"
                              onClick={() =>
                                handleChallengeFormChange({
                                  target: {
                                    name: "points",
                                    value: parseInt(challengeForm.points) + 1,
                                  },
                                })
                              }
                              disabled={challengeLoading}
                              className="px-2 py-1 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-t-lg transition-colors duration-200 disabled:opacity-50"
                            >
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 15l7-7 7 7"
                                />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const v = parseInt(challengeForm.points);
                                handleChallengeFormChange({
                                  target: {
                                    name: "points",
                                    value: v > 1 ? v - 1 : 1,
                                  },
                                });
                              }}
                              disabled={challengeLoading}
                              className="px-2 py-1 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-b-lg transition-colors duration-200 disabled:opacity-50"
                            >
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {challengeForm.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center bg-white/90 text-black font-semibold text-xs rounded px-2 cursor-default select-none"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() =>
                              setChallengeForm((prev) => ({
                                ...prev,
                                tags: prev.tags.filter((_, i) => i !== idx),
                              }))
                            }
                            className="ml-2 text-lg text-black hover:text-lime-300 focus:outline-none"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" ||
                          e.key === "," ||
                          e.key === "Tab"
                        ) {
                          e.preventDefault();
                          const input = tagInput.trim();
                          if (input && !challengeForm.tags.includes(input)) {
                            setChallengeForm((prev) => ({
                              ...prev,
                              tags: [...prev.tags, input.replace(/\s+/g, "-")],
                            }));
                            setTagInput("");
                          }
                        }
                      }}
                      placeholder="Type tag and press Enter"
                      className="w-full px-4 py-2 text-white bg-black border border-zinc-700/40 focus:border-zinc-700 rounded-lg focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Flag Format
                    </label>
                    <input
                      type="text"
                      name="flagFormat"
                      value={challengeForm.flagFormat}
                      onChange={handleChallengeFormChange}
                      disabled={challengeLoading}
                      className="w-full px-4 py-3 bg-black border border-zinc-700/40 rounded-xl focus:outline-none focus:border-zinc-600/50 text-white placeholder-zinc-500 hover:border-zinc-600/60 transition-all duration-200 disabled:opacity-50"
                      placeholder="flag{...}"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-white mb-2">
                      Flag Answer{" "}
                      {!editingChallenge ? "*" : "(Optional for updates)"}
                    </label>
                    <input
                      type="text"
                      name="flag"
                      value={challengeForm.flag}
                      onChange={handleChallengeFormChange}
                      disabled={challengeLoading}
                      className="w-full px-4 py-3 bg-black border border-zinc-700/40 rounded-xl focus:outline-none focus:border-zinc-600/50 text-white placeholder-zinc-500 hover:border-zinc-600/60 transition-all duration-200 disabled:opacity-50"
                      placeholder="flag{example_flag}"
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-white mb-4">
                    Challenge Content
                  </h4>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Challenge Description *
                    </label>
                    <textarea
                      name="description"
                      value={challengeForm.description}
                      onChange={handleChallengeFormChange}
                      disabled={challengeLoading}
                      rows={10}
                      className="w-full px-4 py-3 bg-black border border-zinc-700/40 rounded-xl focus:outline-none focus:border-zinc-600/50 text-white placeholder-zinc-500 resize-none hover:border-zinc-600/60 transition-all duration-200 disabled:opacity-50"
                      placeholder="Provide detailed instructions and context for the challenge..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Challenge Files (Optional)
                    </label>
                    {challengeForm.file ? (
                      <div className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800/50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <DocumentArrowUpIcon className="h-6 w-6 text-white" />
                          <span className="text-sm text-white font-medium">
                            {challengeForm.file.name}
                          </span>
                        </div>
                        <button
                          onClick={removeFile}
                          disabled={challengeLoading}
                          className="text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-zinc-800/50 border border-zinc-800/30 hover:border-red-800/50 transition-colors duration-200 disabled:opacity-50"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-zinc-700/50 rounded-xl p-8 text-center hover:border-zinc-600/60 transition-colors duration-300">
                        <DocumentArrowUpIcon className="mx-auto h-16 w-16 text-zinc-600 mb-4" />
                        <label
                          htmlFor="file-upload"
                          className={`cursor-pointer ${challengeLoading ? "pointer-events-none opacity-50" : ""}`}
                        >
                          <span className="text-white hover:text-zinc-300 font-semibold text-lg">
                            Upload Challenge File
                          </span>
                          <p className="text-zinc-400 text-sm mt-2">
                            Drag and drop or click to select files
                          </p>
                          <input
                            id="file-upload"
                            type="file"
                            className="sr-only"
                            onChange={handleFileChange}
                            disabled={challengeLoading}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-2 pt-4 border-t border-zinc-800/50">
                <button
                  onClick={() => setShowChallengeModal(false)}
                  disabled={challengeLoading}
                  className="px-6 py-3 text-sm font-semibold text-zinc-400 bg-zinc-800/50 border border-zinc-700/40 hover:border-zinc-600/50 hover:bg-zinc-800/70 rounded-xl transition-all duration-300 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveChallenge}
                  disabled={
                    challengeLoading ||
                    !challengeForm.category ||
                    !challengeForm.description ||
                    (!challengeForm.flag && !editingChallenge)
                  }
                  className="px-8 py-3 text-sm font-semibold text-white bg-black border border-zinc-700/50 hover:border-zinc-600/60 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {challengeLoading
                    ? "Saving..."
                    : editingChallenge
                      ? "Update Challenge"
                      : "Create Challenge"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {revealFlagModal && revealFlagChallenge && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-black border border-zinc-800/50 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-800/50">
              <h3 className="text-xl font-roundo font-bold text-white">
                Reveal Flag
              </h3>
              <button
                onClick={closeRevealFlagModal}
                disabled={revealFlagLoading}
                className="text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-zinc-800/50 border border-zinc-800/30 hover:border-zinc-700/50 transition-colors duration-200 disabled:opacity-50"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="bg-zinc-900/40 border border-zinc-800/40 rounded-xl p-4">
                <p className="text-xs text-zinc-400 mb-1">Challenge</p>
                <p className="text-white font-semibold">
                  {revealFlagChallenge.name}
                </p>
                <span className="inline-block mt-2 text-xs bg-zinc-800 border border-zinc-700/40 text-zinc-300 px-2 py-0.5 rounded">
                  {revealFlagChallenge.category}
                </span>
              </div>
              {!revealedFlag ? (
                <>
                  <div className="bg-yellow-900/20 border border-yellow-800/30 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <svg
                        className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-sm text-yellow-200">
                        Enter your account password to authenticate and reveal
                        the flag for this challenge.
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Account Password
                    </label>
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
                      className="w-full px-4 py-3 bg-black border border-zinc-700/40 rounded-xl focus:outline-none focus:border-zinc-600/50 text-white placeholder-zinc-500 hover:border-zinc-600/60 transition-all duration-200 disabled:opacity-50"
                      autoFocus
                    />
                  </div>
                </>
              ) : (
                <div className="bg-green-900/20 border border-green-800/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <svg
                      className="h-5 w-5 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm font-semibold text-green-300">
                      Flag Revealed Successfully
                    </p>
                  </div>
                  <div className="relative">
                    <div className="bg-black border border-zinc-700/40 rounded-lg px-4 py-3 font-mono text-sm text-white break-all pr-10">
                      {showFlagValue
                        ? revealedFlag
                        : "•".repeat(Math.min(revealedFlag.length, 32))}
                    </div>
                    <button
                      onClick={() => setShowFlagValue((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors duration-200"
                    >
                      {showFlagValue ? (
                        <EyeSlashIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 pt-0">
              <button
                onClick={closeRevealFlagModal}
                disabled={revealFlagLoading}
                className="px-6 py-3 text-sm font-semibold text-zinc-400 bg-zinc-800/50 border border-zinc-700/40 hover:border-zinc-600/50 hover:bg-zinc-800/70 rounded-xl transition-all duration-300 disabled:opacity-50"
              >
                {revealedFlag ? "Close" : "Cancel"}
              </button>
              {!revealedFlag && (
                <button
                  onClick={revealFlag}
                  disabled={revealFlagLoading || !revealFlagPassword.trim()}
                  className="px-8 py-3 text-sm font-semibold text-white bg-black border border-zinc-700/50 hover:border-yellow-600/60 hover:bg-zinc-900 rounded-xl transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {revealFlagLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Verifying...
                    </div>
                  ) : (
                    "Reveal Flag"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showWebhookSuccessModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-black border border-zinc-700/30 rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
            <h3 className="text-2xl font-roundo font-bold text-white mb-4">
              Webhook Connected
            </h3>
            <p className="text-zinc-400 mb-6">
              Discord webhook successfully connected.
            </p>
            <button
              onClick={() => setShowWebhookSuccessModal(false)}
              className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showParticipantModal && selectedParticipant && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-black border border-zinc-800/50 rounded-2xl w-full max-w-4xl shadow-2xl">
            <div className="flex justify-between items-center px-4 py-3 border-b border-zinc-800/50">
              <h3 className="text-xl font-roundo font-bold text-white">
                Participant Details
              </h3>
              <button
                onClick={() => setShowParticipantModal(false)}
                className="text-zinc-400 hover:text-white p-2 rounded-lg hover:bg-zinc-800/50 border border-zinc-800/30 hover:border-zinc-700/50 transition-colors duration-200"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="ml-2">
                  <h4 className="text-lg font-roundo font-semibold text-white">
                    #{selectedParticipant.name}
                  </h4>
                  <div className="text-md text-zinc-300 bg-zinc-900/30 px-3 py-1 rounded-lg border border-zinc-800/30 inline-block mt-1">
                    {selectedParticipant.email}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-zinc-900/30 border border-zinc-800/30 p-4 rounded-xl">
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-semibold text-white">
                        Account Status
                      </dt>
                      <dd className="text-sm text-white mt-2">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-lg border ${selectedParticipant.status === "active" ? "bg-green-900/30 text-green-400 border-green-800/30" : "bg-red-900/30 text-red-400 border-red-800/30"}`}
                        >
                          {selectedParticipant.status.charAt(0).toUpperCase() +
                            selectedParticipant.status.slice(1)}
                        </span>
                      </dd>
                    </div>
                    {selectedParticipant.joinDate && (
                      <div>
                        <dt className="text-sm font-semibold text-white">
                          Registration Date
                        </dt>
                        <dd className="text-sm text-zinc-300 mt-2 bg-zinc-900/30 px-3 py-2 rounded-lg border border-zinc-800/30 font-mono">
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
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
                <div className="bg-zinc-900/30 border border-zinc-800/30 p-4 rounded-xl">
                  <h5 className="text-sm font-semibold text-white mb-3">
                    Challenge Solves ({selectedParticipant.solves?.length || 0})
                  </h5>
                  {selectedParticipant.solves &&
                  selectedParticipant.solves.length > 0 ? (
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                      {selectedParticipant.solves.map((solve, index) => (
                        <div
                          key={index}
                          className="bg-black border border-zinc-700/40 p-4 rounded-lg hover:border-zinc-600/50 transition-all duration-200"
                        >
                          <div className="text-lg font-bold text-white mb-1">
                            {solve.challengeName}
                          </div>
                          <div className="text-xs text-zinc-400 font-mono mb-1">
                            Solved:{" "}
                            {new Date(solve.solvedAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              },
                            )}
                          </div>
                          {solve.category && (
                            <div className="text-sm text-zinc-400 mb-1">
                              Category: {solve.category}
                            </div>
                          )}
                          {solve.difficulty && (
                            <div className="text-sm text-zinc-400 mb-1">
                              Difficulty: {solve.difficulty.toUpperCase()}
                            </div>
                          )}
                          {solve.points && (
                            <div className="text-sm text-zinc-400 mb-1">
                              Points: {solve.points}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-zinc-500">
                      <div className="text-2xl mb-2">🏁</div>
                      <p className="text-sm">No challenges solved yet</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-zinc-800/50">
                <button
                  onClick={() => setShowParticipantModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-zinc-400 bg-zinc-800/50 border border-zinc-700/40 hover:border-zinc-600/50 hover:bg-zinc-800/70 rounded-xl transition-all duration-300"
                >
                  Close
                </button>
                {can("participant.ban") && selectedParticipant._raw && (
                  <button
                    onClick={() => {
                      toggleParticipantBan(selectedParticipant._raw);
                    }}
                    disabled={
                      banningUserId ===
                      (selectedParticipant._raw?.userId ||
                        selectedParticipant._raw?.username)
                    }
                    className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 border disabled:opacity-50 ${selectedParticipant.status === "banned" ? "text-green-400 hover:text-green-300 bg-green-900/20 border-green-800/40 hover:border-green-700/60 hover:bg-green-900/30 shadow-lg hover:shadow-xl" : "text-red-400 hover:text-red-300 bg-red-900/20 border-red-800/40 hover:border-red-700/60 hover:bg-red-900/30 shadow-lg hover:shadow-xl"}`}
                  >
                    {banningUserId ===
                    (selectedParticipant._raw?.userId ||
                      selectedParticipant._raw?.username)
                      ? "Processing..."
                      : selectedParticipant.status === "banned"
                        ? "Unban User"
                        : "Ban User"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
