"use client";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import API from "@/utils/axios";
import { motion } from "framer-motion";
import logo from "@/img/purple.svg";
import {
  User,
  Mail,
  Shield,
  Crown,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Globe,
  Calendar,
  Target,
  Play,
  Check,
  Edit,
  Lock,
  X,
  Delete,
  Activity,
  TrendingUp,
  Zap,
  Copy,
  Share2,
  FileText,
  Trash2,
  PenLine,
  Loader2,
  ExternalLink,
} from "lucide-react";
import {
  RiInstagramLine as FaInstagram,
  RiLinkedinLine as FaLinkedin,
  RiGithubLine as FaGithub,
} from "@remixicon/react";
import { showToast } from "@/utils/Toast.jsx";
import { useRouter } from "next/navigation";
import { logout } from "@/store/authSlice";
import Image from "next/image";
import tick from "../../../public/tick.svg";

const UserProfile = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socialLinks, setSocialLinks] = useState({
    linkedIn: "",
    github: "",
    instagram: "",
  });
  const [deletingBlogSlug, setDeletingBlogSlug] = useState(null);

  const [isEditingSocials, setIsEditingSocials] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [courseFilter, setCourseFilter] = useState("all");
  const [showEditUsernameModal, setShowEditUsernameModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [userTimezone, setUserTimezone] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "Weak",
    color: "red-500",
  });
  const [toastMessage, setToastMessage] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [confirmationPhrase, setConfirmationPhrase] = useState("");
  const [userBlogs, setUserBlogs] = useState([]);

  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTimezone(timezone);
  }, []);

  const formatDateKey = (date, timezone) => {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await API.get("/api/v1/users/unified-profile");
        if (response.data.success) {
          setProfileData(response.data.profile);
          setNewUsername(response.data.profile.user.username);
          setSocialLinks({
            linkedIn: response.data.profile.user.linkedIn || "",
            github: response.data.profile.user.github || "",
            instagram: response.data.profile.user.instagram || "",
          });
        } else {
          setError("Failed to load profile");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const getTimezoneFromCookie = () => {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "timezone") {
        return decodeURIComponent(value);
      }
    }
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  };

  const convertToUserTimezone = (dateString, timezone) => {
    if (!timezone) return new Date(dateString);

    try {
      const date = new Date(dateString);
      return new Date(date.toLocaleString("en-US", { timeZone: timezone }));
    } catch (error) {
      console.warn("Invalid timezone, using browser default:", error);
      return new Date(dateString);
    }
  };

  const handleCopyProfileLink = async () => {
    if (typeof window === "undefined") return;

    const profileUrl = `${window.location.origin}/pwn/${profileData?.user?.username}`;
    let copied = false;

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(profileUrl);
        copied = true;
      } catch (err) {
        console.warn("Clipboard API blocked, falling back", err);
      }
    }

    if (!copied) {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = profileUrl;
        textArea.setAttribute("readonly", "");
        textArea.style.cssText = "position:absolute; left:-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        copied = true;
      } catch (err) {
        console.error("Fallback copy failed", err);
      }
    }

    if (copied) {
      setIsCopied(true);
      showToast("success", "Profile link copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } else {
      showToast("error", "Failed to copy link.");
    }
  };

  const handleSocialLinkChange = (e) => {
    const { name, value } = e.target;
    setSocialLinks({ ...socialLinks, [name]: value });
  };

  const handleUpdateSocials = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        linkedIn: socialLinks.linkedIn,
        github: socialLinks.github,
        instagram: socialLinks.instagram,
      };

      const response = await API.patch("/auth/update-social-links", payload);
      showToast(
        "success",
        response.data.message || "Social links updated successfully!",
      );
      setIsEditingSocials(false);

      const updatedResponse = await API.get("/api/v1/users/unified-profile");
      if (updatedResponse.data.success) {
        setProfileData(updatedResponse.data.profile);
      }
    } catch (err) {
      showToast(
        "error",
        err.response?.data?.message || "Failed to update social links",
      );
    }
  };

  const generateActivityData = () => {
    const activityMap = {};

    if (profileData?.userActivity?.length > 0) {
      for (const activity of profileData.userActivity) {
        const year = activity._id.year;
        const month = activity._id.month.padStart(2, "0");
        const day = activity._id.day.padStart(2, "0");
        const dateKey = `${year}-${month}-${day}`;
        activityMap[dateKey] =
          (activityMap[dateKey] || 0) + activity.contributions;
      }
    }

    const today = new Date(); // use local date directly
    const tz = userTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

    const data = [];

    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const dateKey = formatDateKey(date, tz);
      const contributions = activityMap[dateKey] || 0;

      let level = 0;
      if (contributions > 0) {
        if (contributions <= 2) level = 1;
        else if (contributions <= 5) level = 2;
        else if (contributions <= 10) level = 3;
        else level = 4;
      }

      data.push({
        date: dateKey,
        count: contributions,
        level,
      });
    }

    return data;
  };

  const getActivityColor = (level) => {
    const colors = {
      0: "bg-[#3f2b96]/20",
      1: "bg-[#5d3fd3]/40",
      2: "bg-[#5d3fd3]/60",
      3: "bg-[#7c52ff]/80",
      4: "bg-[#a890fe]",
    };
    return colors[level] || "bg-[#3f2b96]/20";
  };

  // Add this function before renderPersonalDetails
  const renderSocialsSection = () => {
    const SocialLinkRow = ({ platform, link, icon: Icon }) => (
      <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50">
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-[#a890fe]" />
          <span className="text-gray-300 capitalize">{platform}</span>
        </div>
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-400 hover:text-[#a890fe] transition-colors"
          >
            {link.length > 30 ? `${link.substring(0, 30)}...` : link}
          </a>
        ) : (
          <span className="text-sm text-zinc-500">Not provided</span>
        )}
      </div>
    );

    const SocialInputRow = ({ platform, value, onChange, icon: Icon }) => (
      <div className="flex items-center gap-3 border-b border-zinc-700 pb-3">
        <Icon className="w-5 h-5 text-[#a890fe]" />
        <label
          htmlFor={platform}
          className="block text-sm font-medium text-zinc-400 capitalize w-24"
        >
          {platform}
        </label>
        <input
          type="url"
          id={platform}
          name={platform}
          value={value}
          onChange={onChange}
          className="block w-full border-b border-zinc-700/50 py-2 px-4 text-white focus:outline-none focus:border-[#7c52ff]/80 bg-transparent"
          placeholder={`https://www.${platform}.com/your-profile`}
        />
      </div>
    );

    return getSectionCard(
      "Socials",
      <div className="space-y-6">
        {/* Share Profile Section */}
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">
            SHARE YOUR PROFILE
          </h3>
          <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50">
            <div className="flex items-center gap-3">
              <Share2 className="w-5 h-5 text-[#a890fe]" />
              <p className="text-sm text-zinc-400 truncate">
                {`${window.location.origin}/pwn/${profileData?.user?.username}`}
              </p>
            </div>
            <button
              onClick={handleCopyProfileLink}
              className="flex items-center gap-2 px-3 py-1 text-xs bg-[#0c081e] hover:bg-[#3f2b96]/20 border border-[#3f2b96]/40 text-white rounded-md font-semibold transition-colors"
            >
              {isCopied ? (
                <>
                  <Check className="w-3 h-3" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Social Links Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">SOCIAL LINKS</h3>
            {!isEditingSocials && (
              <button
                onClick={() => setIsEditingSocials(true)}
                className="flex items-center gap-2 text-sm text-[#a890fe] hover:text-[#c4afff] font-semibold"
              >
                <Edit className="w-4 h-4" /> Edit
              </button>
            )}
          </div>

          {isEditingSocials ? (
            <form onSubmit={handleUpdateSocials} className="space-y-4">
              <SocialInputRow
                platform="linkedIn"
                value={socialLinks.linkedIn}
                onChange={handleSocialLinkChange}
                icon={FaLinkedin}
              />

              <SocialInputRow
                platform="github"
                value={socialLinks.github}
                onChange={handleSocialLinkChange}
                icon={FaGithub}
              />
              <SocialInputRow
                platform="instagram"
                value={socialLinks.instagram}
                onChange={handleSocialLinkChange}
                icon={FaInstagram}
              />
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingSocials(false);
                    setSocialLinks({
                      linkedIn: profileData?.user?.linkedIn || "",
                      github: profileData?.user?.github || "",
                      instagram: profileData?.user?.instagram || "",
                    });
                  }}
                  className="px-4 py-2 bg-[#0c081e] hover:bg-[#3f2b96]/20 border border-[#3f2b96]/40 text-white rounded-md transition-colors duration-200"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-[#5d3fd3] hover:bg-linear-to-r from-[#5d3fd3] to-[#7c52ff] text-white rounded-xl font-semibold transition-colors duration-200"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <SocialLinkRow
                platform="linkedIn"
                link={profileData?.user?.linkedIn}
                icon={FaLinkedin}
              />
              <SocialLinkRow
                platform="github"
                link={profileData?.user?.github}
                icon={FaGithub}
              />
              <SocialLinkRow
                platform="instagram"
                link={profileData?.user?.instagram}
                icon={FaInstagram}
              />
            </div>
          )}
        </div>
      </div>,
    );
  };

  const ActivityGraph = () => {
    const [selectedDay, setSelectedDay] = useState(null);
    const activityData = generateActivityData();

    const weeks = [];
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    for (let i = 0; i < activityData.length; i += 7) {
      weeks.push(activityData.slice(i, i + 7));
    }

    const getMonthGroups = () => {
      const groups = [];
      let currentMonth = null;
      let currentWeeks = [];
      let currentMonthIndex = null;

      for (let i = 0; i < weeks.length; i++) {
        const week = weeks[i];
        const weekMonth = new Date(week[0].date).getMonth();

        if (currentMonth === null) {
          currentMonth = weekMonth;
          currentMonthIndex = i;
        }

        if (weekMonth !== currentMonth) {
          groups.push({
            month: currentMonth,
            monthIndex: currentMonthIndex,
            weeks: currentWeeks,
          });
          currentMonth = weekMonth;
          currentMonthIndex = i;
          currentWeeks = [];
        }
        currentWeeks.push(week);
      }

      if (currentWeeks.length > 0) {
        groups.push({
          month: currentMonth,
          monthIndex: currentMonthIndex,
          weeks: currentWeeks,
        });
      }

      return groups;
    };

    const monthGroups = getMonthGroups();

    const handleDayClick = (day) => {
      setSelectedDay(day);
    };

    return (
      <div className="relative backdrop-blur-xl bg-[#0c081e]/80 border border-[#3f2b96]/30 rounded-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <div className="absolute inset-0 bg-linear-to-br from-[#5d3fd3]/5 to-transparent rounded-2xl"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-[#7c52ff]/10 rounded-xl border border-[#7c52ff]/20">
                <Activity className="w-6 h-6 text-[#a890fe]" />
              </div>
              Activity Overview
            </h3>
            <div className="flex items-center gap-6">
              <div className="bg-[#080517] border border-[#3f2b96]/40 rounded-xl px-2 py-1 min-w-[180px] h-[60px] flex items-center justify-center">
                {selectedDay ? (
                  <div className="text-center">
                    <div className="text-sm font-medium text-white">
                      {selectedDay.count} contributions
                    </div>
                    <div className="text-xs text-zinc-400">
                      {new Date(selectedDay.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        timeZone: userTimezone || undefined,
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-zinc-500">
                    Click on a day to see details
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 text-sm text-zinc-400">
                <span className="font-medium">Less</span>
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`w-3 h-3 rounded-sm ${getActivityColor(
                        level,
                      )}`}
                    />
                  ))}
                </div>
                <span className="font-medium">More</span>
              </div>
            </div>
          </div>

          <div className="w-full overflow-x-auto p-1">
            <div className="flex gap-1 whitespace-nowrap">
              <div className="flex flex-col gap-1 mx-2 pt-5">
                {daysOfWeek.map((day) => (
                  <div
                    key={day}
                    className="w-7 h-3 text-sm text-zinc-400 font-medium flex items-center justify-end px-1"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 overflow-visible">
                {monthGroups.map((group, groupIdx) => (
                  <div
                    key={group.month + "-" + group.monthIndex}
                    className="flex flex-col items-center"
                  >
                    <div className="mb-1 h-5 flex items-center justify-center w-full">
                      <span className="text-sm text-zinc-400 px-1 rounded z-20">
                        {monthNames[group.month]}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {group.weeks.map((week, weekIndex) => (
                        <div
                          key={weekIndex}
                          className="flex flex-col gap-1 relative z-10"
                        >
                          {week.map((day, dayIndex) => (
                            <button
                              key={`${group.month}-${group.monthIndex}-${weekIndex}-${dayIndex}`}
                              onClick={() => handleDayClick(day)}
                              className={`w-3 h-3 ${getActivityColor(
                                day.level,
                              )} transition-all cursor-pointer rounded-sm focus:outline-none focus:ring-1 focus:ring-[#7c52ff] focus:ring-offset-1 focus:ring-offset-[#0c081e] hover:brightness-125 ${
                                selectedDay?.date === day.date
                                  ? "ring-1 ring-[#7c52ff] ring-offset-1 ring-offset-[#0c081e]"
                                  : ""
                              }`}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const StatCard = ({ icon: Icon, label, value }) => (
    <div className="group relative backdrop-blur-xl bg-[#0c081e]/80 border border-[#3f2b96]/30 rounded-2xl p-6 hover:border-[#7c52ff]/50 transition-all duration-300 shadow-xl">
      <div className="absolute inset-0 bg-linear-to-br from-[#5d3fd3]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-zinc-400 text-sm font-medium mb-1">{label}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
          </div>
          <div className="p-3 rounded-xl bg-[#3f2b96]/20 border border-[#7c52ff]/20 group-hover:scale-110 transition-transform">
            <Icon className="w-6 h-6 text-[#a890fe]" />
          </div>
        </div>
      </div>
    </div>
  );

  // Calculate activity statistics
  const totalActivity =
    profileData?.userActivity?.reduce(
      (sum, activity) => sum + (activity.contributions || 0),
      0,
    ) || 0;

  const activeDays =
    new Set(
      profileData?.userActivity?.map((item) => {
        const { year, month, day } = item._id || {};
        return `${year}-${month}-${day}`;
      }),
    ).size || 0;

  const calculateStreak = () => {
    if (!profileData?.userActivity?.length) return 0;

    const sortedActivities = [...profileData.userActivity].sort((a, b) => {
      const dateA = new Date(`${a._id.year}-${a._id.month}-${a._id.day}`);
      const dateB = new Date(`${b._id.year}-${b._id.month}-${b._id.day}`);
      return dateB - dateA;
    });

    let streak = 0;
    let currentDate = userTimezone
      ? convertToUserTimezone(new Date().toISOString(), userTimezone)
      : new Date();

    for (const activity of sortedActivities) {
      const activityDate = new Date(
        `${activity._id.year}-${activity._id.month}-${activity._id.day}`,
      );
      const daysDiff = Math.floor(
        (currentDate - activityDate) / (1000 * 60 * 60 * 24),
      );

      if (daysDiff === streak) {
        streak++;
      } else if (daysDiff > streak) {
        break;
      }
    }

    return streak;
  };

  // Other helper functions remain the same...
  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown";
    const date = new Date(timestamp);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const formatJoinDate = (timestamp) => {
    if (!timestamp) return "Unknown";
    const date = new Date(timestamp);
    const options = { year: "2-digit", month: "long" };
    return date.toLocaleDateString("en-US", options);
  };

  const getDifficultyBadge = (difficulty) => {
    let bgColor, textColor;
    switch (difficulty) {
      case "Easy":
        bgColor = "bg-linear-to-br from-green-400 to-green-600";
        textColor = "text-white text-lg font-bold tracking-wide";
        break;
      case "Medium":
        bgColor = "bg-linear-to-br from-amber-500 to-amber-700";
        textColor = "text-white text-lg font-bold tracking-wide";
        break;
      case "Hard":
        bgColor = "bg-linear-to-br from-rose-500 to-red-700";
        textColor = "text-white text-2xl font-bold tracking-wide";
        break;
      default:
        bgColor = "bg-gray-700";
        textColor = "text-gray-300 text-lg font-bold tracking-wide";
    }
    return { bgColor, textColor };
  };

  const getCountryFlag = (country) => {
    const flags = {
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
    };
    return flags[country] || "🌍";
  };

  const getSectionCard = (title, children) => (
    <div className="rounded-2xl overflow-hidden border border-[#3f2b96]/30 bg-[#0c081e]/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300 hover:border-[#5d3fd3]/50">
      <div className="px-6 py-4 border-b border-[#3f2b96]/30 flex items-center gap-3">
        <div className="w-1 h-5 bg-linear-to-b from-[#5d3fd3] to-[#7c52ff] rounded-full"></div>
        <h2 className="text-base font-semibold text-white tracking-wide">
          {title}
        </h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );

  const renderCourseCard = (course, isCompleted) => (
    <div
      key={course.slug}
      className={`flex items-center p-4 rounded-lg border transition-all duration-300 ${
        isCompleted
          ? "bg-green-900/10 border-green-700/30 hover:border-green-500/50"
          : "bg-zinc-800/50 border-zinc-700/30 hover:border-[#7c52ff]/30"
      }`}
    >
      <div className="w-16 h-16 bg-zinc-700 rounded-lg flex items-center justify-center mr-4 relative">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover rounded-lg"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
        <div className="w-full h-full items-center justify-center hidden">
          <Play className="h-8 w-8 text-[#a890fe]" />
        </div>
        {isCompleted && (
          <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
            <Check className="h-4 w-4 text-black" />
          </div>
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-gray-100 mb-1">{course.title}</h3>
        <p className="text-sm text-gray-400 mb-2">
          Enrolled: {formatDate(course.enrolledAt)}
        </p>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              isCompleted
                ? "bg-[#3fb950]/20 text-[#3fb950]"
                : "bg-amber-500/20 text-amber-400"
            }`}
          >
            {isCompleted ? "Completed" : "In Progress"}
          </span>
        </div>
      </div>
      <div className="flex gap-3 items-center">
        <button
          className={`font-semibold py-2 px-4 rounded-2xl transition-all duration-300 flex items-center justify-center text-xs hover:scale-105 ${
            isCompleted
              ? "bg-linear-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-black"
              : "bg-linear-to-r from-lime-500 to-lime-400 hover:from-lime-400 hover:to-lime-300 text-black"
          }`}
          onClick={() => router.push(`/learning/${course.slug}`)}
        >
          {isCompleted ? "REVIEW" : "CONTINUE"}
        </button>
      </div>
    </div>
  );

  const getFilteredCourses = () => {
    if (!profileData?.enrolledCourses) return [];

    switch (courseFilter) {
      case "completed":
        return profileData.enrolledCourses.filter(
          (course) => course.isCompleted,
        );
      case "incomplete":
        return profileData.enrolledCourses.filter(
          (course) => !course.isCompleted,
        );
      default:
        return profileData.enrolledCourses;
    }
  };

  // Update tabs to include activity
  const tabs = [
    { id: "personal", label: "Personal Details" },
    { id: "ctf", label: "CTF Details" },
    { id: "courses", label: "Course Details" },
    { id: "activity", label: "Activity" },
    { id: "socials", label: "Socials" },
    { id: "myblogs", label: "My Blogs" },
  ];

  const handleDeleteUserBlog = async (slug) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this article? This cannot be undone.",
      )
    )
      return;
    setDeletingBlogSlug(slug);
    try {
      await API.delete(`/api/v1/resource/${slug}`, {
        withCredentials: true,
      });
      setUserBlogs((prev) => prev.filter((b) => b.slug !== slug));
      showToast("success", "Article deleted successfully.");
    } catch (err) {
      console.error("Failed to delete blog:", err);
      showToast("error", "Failed to delete article.");
    } finally {
      setDeletingBlogSlug(null);
    }
  };

  const renderMyBlogs = () => {
    const userBlogs = profileData?.articles || [];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-bold text-lg flex items-center gap-3">
            <FileText className="w-5 h-5 text-[#a890fe]" />
            My Articles
          </h2>

          <button
            onClick={() => router.push("/creator")}
            className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-[#5d3fd3] to-[#7c52ff] text-white text-xs font-bold uppercase tracking-widest rounded-xl"
          >
            <PenLine className="w-3.5 h-3.5" />
            New Article
          </button>
        </div>

        {userBlogs.length === 0 ? (
          <div className="text-center py-16 text-zinc-500">
            No articles yet.
          </div>
        ) : (
          <div className="grid gap-4">
            {userBlogs.map((blog) => (
              <div
                key={blog.slug}
                className="flex items-start gap-5 p-5 rounded-2xl bg-[#0c081e]/80 border border-[#3f2b96]/30"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-white text-sm">
                        {blog.title}
                      </h3>

                      <p className="text-xs text-zinc-500 mt-1">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </p>

                      <span
                        className={`mt-2 inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                          blog.status === "approved"
                            ? "text-green-400 bg-green-500/10 border-green-500/20"
                            : blog.status === "rejected"
                              ? "text-red-400 bg-red-500/10 border-red-500/20"
                              : "text-amber-400 bg-amber-500/10 border-amber-500/20"
                        }`}
                      >
                        {blog.status}
                      </span>

                      <p className="text-xs text-zinc-400 mt-2">
                        {blog.views} views
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`/blog/${blog.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-[#080517] border border-[#3f2b96]/30 text-zinc-400"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => router.push(`/creator/${blog.slug}`)}
                        className="p-2 rounded-lg bg-[#080517] border border-[#3f2b96]/30 text-[#a890fe]"
                      >
                        <PenLine className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteUserBlog(blog.slug)}
                        disabled={deletingBlogSlug === blog.slug}
                        className="p-2 rounded-lg bg-[#080517] border border-red-500/20 text-red-400"
                      >
                        {deletingBlogSlug === blog.slug ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const requiredPhrase = `gopwnit/delete/${profileData?.user?.username || ""}`;

  // Password and username update handlers remain the same...
  const handleDeleteAccount = async () => {
    try {
      const response = await API.delete("/auth/delete", {
        data: {
          reason: deleteReason.trim() || null,
          confirmation: confirmationPhrase,
        },
      });

      if (response.status === 200) {
        alert("Account deleted successfully");
        window.location.href = "/";
      } else {
        alert("Failed to delete account. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert(
        error.response?.data?.message ||
          "An error occurred while deleting the account.",
      );
    }
  };

  const handleEditUsername = async (e) => {
    e.preventDefault();
    setIsUpdatingUsername(true);
    setUsernameError("");

    if (!newUsername.trim()) {
      setUsernameError("Username cannot be empty");
      setIsUpdatingUsername(false);
      return;
    }

    try {
      const response = await API.patch(
        "/auth/update-username",
        { newUsername: newUsername },
        { withCredentials: true },
      );

      showToast(
        "success",
        response.data.message || "Username updated successfully!",
      );
      setShowEditUsernameModal(false);

      // Refetch profile data
      const updatedResponse = await API.get("/api/v1/users/unified-profile");
      if (updatedResponse.data.success) {
        setProfileData(updatedResponse.data.profile);
      }
    } catch (err) {
      setUsernameError(
        err.response?.data?.message || "Failed to update username",
      );
    } finally {
      setIsUpdatingUsername(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
    if (name === "newPassword") calculatePasswordStrength(value);
  };

  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (!password) {
      setPasswordStrength({ score: 0, label: "Weak", color: "red-500" });
      return;
    }
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    let label, color;
    if (score <= 2) {
      label = "Weak";
      color = "red-500";
    } else if (score <= 4) {
      label = "Medium";
      color = "yellow-500";
    } else {
      label = "Strong";
      color = "green-500";
    }
    setPasswordStrength({ score, label, color });
  };

  const validatePasswordForm = () => {
    let isValid = true;
    const newErrors = {
      currentPassword: "",
      newPassword: "",
    };

    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = "Current password is required";
      isValid = false;
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(passwordForm.newPassword)) {
      newErrors.newPassword =
        "Must be 8+ chars, include uppercase, number & special character";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();
    if (validatePasswordForm()) {
      try {
        const response = await API.patch(
          "/auth/update-password",
          {
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword,
          },
          { withCredentials: true },
        );

        setToastMessage({
          type: "success",
          text: response.data.message || "Password updated successfully!",
        });

        setPasswordForm({
          currentPassword: "",
          newPassword: "",
        });

        setShowChangePasswordModal(false);
        dispatch(logout());
        router.push("/");
      } catch (err) {
        setToastMessage({
          type: "error",
          text: err.response?.data?.message || "Failed to update password",
        });
      }
    }
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Add activity tab render function
  const renderActivityDetails = () => (
    <div className="space-y-8">
      <ActivityGraph />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Activity}
          label="Total Activity"
          value={totalActivity}
        />
        <StatCard icon={Calendar} label="Active Days" value={activeDays} />
        <StatCard
          icon={Zap}
          label="Avg. Daily"
          value={activeDays > 0 ? Math.round(totalActivity / activeDays) : 0}
        />
        <StatCard icon={TrendingUp} label="Streak" value={calculateStreak()} />
      </div>

      {/* Recent Activity */}
      <div className="relative backdrop-blur-xl bg-[#0c081e]/80 border border-[#3f2b96]/30 rounded-2xl p-8 shadow-2xl">
        <div className="absolute inset-0 bg-linear-to-br from-lime-400/5 to-transparent rounded-2xl"></div>
        <div className="relative">
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <div className="p-2 bg-[#7c52ff]/10 rounded-xl border border-[#7c52ff]/20">
              <Activity className="w-6 h-6 text-[#a890fe]" />
            </div>
            Recent Activity
          </h3>
          <div className="space-y-4">
            {profileData?.recentActivity?.length > 0 ? (
              profileData.recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="group relative backdrop-blur-sm bg-[#080517]/60 border border-[#3f2b96]/20 rounded-xl p-6 hover:border-[#7c52ff]/30 transition-all"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-lime-400/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-[#7c52ff]/10 rounded-lg border border-[#7c52ff]/20">
                          <CheckCircle className="w-5 h-5 text-[#a890fe]" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">
                            {activity.type}
                          </h4>
                          <p className="text-zinc-400 text-sm">
                            {activity.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-zinc-400 text-sm">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-zinc-400 text-lg">No recent activity</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPersonalDetails = () => (
    <div className="space-y-6">
      {getSectionCard(
        "Account Information",
        <div className="space-y-4">
          <div className="flex items-start border-b border-zinc-700 pb-4">
            <div className="p-2 rounded-full">
              <User className="h-6 w-6 text-[#a890fe]" />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-sm font-medium text-gray-400">USERNAME</h3>
              <div className="flex items-center mt-1 gap-2">
                <p className="text-base font-medium text-gray-100">
                  {profileData?.user?.username || "Unknown"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-start border-b border-zinc-700 pb-4">
            <div className="p-2 rounded-full">
              <Mail className="h-6 w-6 text-[#a890fe]" />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-sm font-medium text-gray-400">EMAIL</h3>
              <div className="flex items-center mt-1">
                <p className="text-base font-medium text-gray-100">
                  {profileData?.user?.email || "Unknown"}
                </p>
                {profileData?.user?.isVerified && (
                  <span className="ml-2 text-xs px-3 py-1 bg-green-900/50 text-[#c4afff] rounded-full">
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-start border-b border-zinc-700 pb-4">
            <div className="p-2 rounded-full">
              <User className="h-6 w-6 text-[#a890fe]" />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-sm font-medium text-gray-400">FULL NAME</h3>
              <p className="text-base font-medium text-gray-100 mt-1">
                {profileData?.user?.fullName || "Not provided"}
              </p>
            </div>
          </div>

          <div className="flex items-start border-b border-zinc-700 pb-4">
            <div className="p-2 rounded-full">
              <Globe className="h-6 w-6 text-[#a890fe]" />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-sm font-medium text-gray-400">COUNTRY</h3>
              <div className="flex items-center mt-1">
                <p className="text-base font-medium text-gray-100">
                  {profileData?.user?.country || "Not specified"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-start">
            <div className="p-2 rounded-full">
              <Calendar className="h-6 w-6 text-[#a890fe]" />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-sm font-medium text-gray-400">
                MEMBER SINCE
              </h3>
              <p className="text-base font-medium text-gray-100 mt-1">
                {formatJoinDate(profileData?.user?.createdAt)}
              </p>
            </div>
          </div>
        </div>,
      )}

      {getSectionCard(
        "User Status",
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-[#a890fe] mr-3" />
              <span className="text-gray-300">Account Status</span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                profileData?.user?.isBanned
                  ? "bg-red-500/20 text-red-400"
                  : "bg-[#3fb950]/20 text-[#3fb950]"
              }`}
            >
              {profileData?.user?.isBanned ? "Banned" : "Active"}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-[#a890fe] mr-3" />
              <span className="text-gray-300">Email Verification</span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                profileData?.user?.isVerified
                  ? "bg-[#3fb950]/20 text-[#3fb950]"
                  : "bg-amber-500/20 text-amber-400"
              }`}
            >
              {profileData?.user?.isVerified ? "Verified" : "Pending"}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50">
            <div className="flex items-center">
              <Crown className="h-5 w-5 text-[#a890fe] mr-3" />
              <span className="text-gray-300">Plan</span>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#04020a] text-zinc-300">
              FREE
            </span>
          </div>
        </div>,
      )}
      {getSectionCard(
        "Account Settings",
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50">
            <div className="flex items-center">
              <span className="pl-3 text-gray-300">
                Change Your Account Username
              </span>
            </div>
            <button
              onClick={() => {
                setNewUsername(profileData?.user?.username || "");
                setShowEditUsernameModal(true);
              }}
              className="flex items-center gap-2 px-4 text-sm py-2 bg-[#5d3fd3] hover:bg-linear-to-r from-[#5d3fd3] to-[#7c52ff] text-white rounded-xl font-semibold transition-colors"
            >
              Change Username
            </button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50">
            <div className="flex items-center">
              <span className="pl-3 text-gray-300">
                Change Your Account Password
              </span>
            </div>
            <button
              onClick={() => setShowChangePasswordModal(true)}
              className="flex items-center gap-2 px-4 text-sm py-2 bg-[#5d3fd3] hover:bg-linear-to-r from-[#5d3fd3] to-[#7c52ff] text-white rounded-xl font-semibold transition-colors"
            >
              Change Password
            </button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50">
            <div className="flex items-center">
              <span className="pl-3 text-gray-300">
                Delete Your GoPwnIt Account
              </span>
            </div>
            <button
              onClick={() => setShowDeleteAccountModal(true)}
              className="flex items-center gap-2 px-4 text-sm py-2 bg-[#5d3fd3] hover:bg-linear-to-r from-[#5d3fd3] to-[#7c52ff] text-white rounded-xl font-semibold transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>,
      )}
    </div>
  );

  const renderCTFDetails = () => {
    const totalCategorySolved = Object.values(
      profileData?.ctf?.categoriesCompleted || {},
    ).reduce((sum, count) => sum + count, 0);
    const totalDifficultySolved = Object.values(
      profileData?.ctf?.difficultyBreakdown || {},
    ).reduce((sum, count) => sum + count, 0);

    return (
      <div className="space-y-6">
        {getSectionCard(
          "CTF Performance",
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-zinc-800/50 border border-zinc-700/30 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-400 mb-1 uppercase">Rank</p>
                <p className="text-2xl font-bold text-white">
                  #
                  {profileData?.ctf?.rank === "Unranked"
                    ? "NuB"
                    : profileData?.ctf?.rank}
                </p>
              </div>

              <div className="bg-zinc-800/50 border border-zinc-700/30 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-400 mb-1 uppercase">Points</p>
                <p className="text-2xl font-bold text-white">
                  {profileData?.ctf?.totalPoints?.toLocaleString() || "0"}
                </p>
              </div>

              <div className="bg-zinc-800/50 border border-zinc-700/30 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-400 mb-1 uppercase">Solved</p>
                <p className="text-2xl font-bold text-white">
                  {profileData?.ctf?.totalSolved || "0"}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium text-zinc-400 mb-3">
                DIFFICULTY BREAKDOWN
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(
                  profileData?.ctf?.difficultyBreakdown || {},
                ).map(([difficulty, count]) => {
                  const { bgColor, textColor } = getDifficultyBadge(difficulty);
                  const percentage =
                    totalDifficultySolved > 0
                      ? Math.round((count / totalDifficultySolved) * 100)
                      : 0;

                  return (
                    <div key={difficulty} className="text-center">
                      <div
                        className={`${bgColor} ${textColor} rounded-lg p-3 mb-2`}
                      >
                        <div className="text-sm font-medium">{percentage}%</div>
                        <div className="text-xs opacity-90">{count}</div>
                      </div>
                      <div className="text-xs text-gray-400">{difficulty}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>,
        )}

        {getSectionCard(
          "Challenge Categories",
          <div className="space-y-3">
            {Object.entries(profileData?.ctf?.categoriesCompleted || {})
              .filter(([category, count]) => count > 0)
              .map(([category, count]) => (
                <div key={category}>
                  <div className="flex justify-between text-xs text-zinc-400 mb-1">
                    <span>{category.toUpperCase()}</span>
                    <span>{count} challenges</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-800/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#5d3fd3] rounded-full"
                      style={{
                        width: `${
                          totalCategorySolved > 0
                            ? (count / totalCategorySolved) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            {Object.keys(profileData?.ctf?.categoriesCompleted || {}).filter(
              (category) =>
                (profileData?.ctf?.categoriesCompleted[category] || 0) > 0,
            ).length === 0 && (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No challenges solved yet</p>
                <p className="text-sm text-gray-500 mt-1">
                  Start solving challenges to see your progress!
                </p>
              </div>
            )}
          </div>,
        )}

        {profileData?.ctf?.solved?.length > 0 &&
          getSectionCard(
            "Recent Challenges",
            <div className="space-y-3">
              {profileData.ctf.solved.map((challenge, index) => {
                const { bgColor } = getDifficultyBadge(challenge.difficulty);
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-zinc-700/20 rounded-md"
                  >
                    <div className="flex items-center">
                      <span
                        className={`inline-block w-3 h-3 rounded-full mr-3 ${bgColor}`}
                      ></span>
                      <div>
                        <p className="text-sm font-medium text-gray-100">
                          {challenge.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {challenge.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-[#a890fe]">
                        {challenge.points} pts
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDate(challenge.solvedAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>,
          )}
      </div>
    );
  };

  const renderCourseDetails = () => {
    const filteredCourses = getFilteredCourses();
    const completedCourses =
      profileData?.enrolledCourses?.filter((course) => course.isCompleted) ||
      [];
    const incompleteCourses =
      profileData?.enrolledCourses?.filter((course) => !course.isCompleted) ||
      [];

    return (
      <div className="space-y-6">
        {getSectionCard(
          "Course Statistics",
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-zinc-800/50 border border-zinc-700/30 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-white">
                {profileData?.enrolledCourses?.length || 0}
              </p>
              <p className="text-xs text-gray-400">Total Courses</p>
            </div>

            <div className="bg-zinc-800/50 border border-zinc-700/30 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-[#3fb950]">
                {completedCourses.length}
              </p>
              <p className="text-xs text-gray-400">Completed</p>
            </div>

            <div className="bg-zinc-800/50 border border-zinc-700/30 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-amber-400">
                {incompleteCourses.length}
              </p>
              <p className="text-xs text-gray-400">In Progress</p>
            </div>

            <div className="bg-zinc-800/50 border border-zinc-700/30 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-[#a890fe]">
                {profileData?.enrolledCourses?.length > 0
                  ? Math.round(
                      (completedCourses.length /
                        profileData.enrolledCourses.length) *
                        100,
                    )
                  : 0}
                %
              </p>
              <p className="text-xs text-gray-400">Completion Rate</p>
            </div>
          </div>,
        )}

        {getSectionCard(
          "Course List",
          <div className="space-y-4">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setCourseFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  courseFilter === "all"
                    ? "bg-linear-to-r from-[#5d3fd3] to-[#7c52ff] text-black"
                    : "bg-zinc-800/50 text-gray-400 hover:text-gray-300"
                }`}
              >
                All ({profileData?.enrolledCourses?.length || 0})
              </button>
              <button
                onClick={() => setCourseFilter("completed")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  courseFilter === "completed"
                    ? "bg-green-500 text-white"
                    : "bg-zinc-800/50 text-gray-400 hover:text-gray-300"
                }`}
              >
                Completed ({completedCourses.length})
              </button>
              <button
                onClick={() => setCourseFilter("incomplete")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  courseFilter === "incomplete"
                    ? "bg-yellow-500 text-black"
                    : "bg-zinc-800/50 text-gray-400 hover:text-gray-300"
                }`}
              >
                In Progress ({incompleteCourses.length})
              </button>
            </div>

            {filteredCourses.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">
                  {profileData?.enrolledCourses?.length === 0
                    ? "No courses enrolled yet"
                    : `No ${
                        courseFilter === "completed"
                          ? "completed"
                          : "incomplete"
                      } courses`}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {profileData?.enrolledCourses?.length === 0
                    ? "Start learning by enrolling in your first course!"
                    : "Keep learning to see courses here!"}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredCourses.map((course) =>
                  renderCourseCard(course, course.isCompleted),
                )}
              </div>
            )}
          </div>,
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020202] text-white font-roundo flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#7c52ff] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-zinc-400 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#020202] text-white font-roundo flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto" />
          <p className="text-lg font-semibold">Error loading profile</p>
          <p className="text-sm text-zinc-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-linear-to-r from-[#5d3fd3] to-[#7c52ff] text-white px-5 py-2 rounded-xl text-sm font-semibold hover:shadow-[0_0_15px_rgba(124,82,255,0.4)] transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-[#020202] text-white font-roundo flex items-center justify-center">
        <p className="text-zinc-400">No profile data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white font-roundo">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-[#1a0f3c] via-[#080517] to-[#04020a]"></div>
        <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-[#5d3fd3]/10 blur-[150px]"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-[#3f2b96]/10 blur-[150px]"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(92, 63, 211, 0.07) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(92, 63, 211, 0.07) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src={logo}
            alt="watermark"
            height={900}
            className="opacity-[0.3] select-none"
          />
        </div>
      </div>
      <motion.main className="relative z-10 min-h-screen pt-8">
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          <div className="bg-[#0c081e]/80 backdrop-blur-xl border border-[#3f2b96]/30 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#5d3fd3] to-[#7c52ff] flex items-center justify-center text-2xl font-bold text-white shadow-[0_0_20px_rgba(124,82,255,0.4)]">
                    {(profileData?.user?.username || "U")[0].toUpperCase()}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold text-white">
                        {profileData?.user?.username || "Unknown User"}
                      </h2>
                      <span className="text-xl">
                        {getCountryFlag(profileData?.user?.country)}
                      </span>
                      {profileData?.user?.isVerified && (
                        <Image
                          src={tick}
                          alt="Verified"
                          width={20}
                          height={20}
                        />
                      )}
                    </div>
                    <p className="text-sm text-zinc-400">
                      Member since{" "}
                      {formatJoinDate(profileData?.user?.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {[
                    {
                      label: "Rank",
                      value: `#${profileData?.ctf?.rank === "Unranked" ? "NuB" : profileData?.ctf?.rank}`,
                    },
                    {
                      label: "Score",
                      value: `${profileData?.ctf?.totalPoints?.toLocaleString() || "0"} pts`,
                    },
                    {
                      label: "Solved",
                      value: profileData?.ctf?.totalSolved || "0",
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="bg-[#080517] border border-[#3f2b96]/40 rounded-xl p-3 text-center min-w-[90px]"
                    >
                      <p className="text-[10px] font-semibold text-[#a890fe] uppercase tracking-widest mb-1">
                        {s.label}
                      </p>
                      <p className="text-base font-bold text-white">
                        {s.value}
                      </p>
                    </div>
                  ))}
                  <div className="bg-[#080517] border border-[#3f2b96]/40 rounded-xl p-3 text-center min-w-[90px]">
                    <p className="text-[10px] font-semibold text-[#a890fe] uppercase tracking-widest mb-1">
                      Plan
                    </p>
                    <p className="text-base font-bold text-white">FREE</p>
                    <button className="text-[10px] text-[#a890fe] mt-0.5 flex items-center gap-1 mx-auto">
                      <Crown className="w-3 h-3" />
                      GO VIP
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-[#3f2b96]/30">
            <nav className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-4 border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? "border-[#7c52ff] text-[#a890fe]"
                      : "border-transparent text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="tab-content space-y-4">
            {activeTab === "personal" && renderPersonalDetails()}
            {activeTab === "ctf" && renderCTFDetails()}
            {activeTab === "courses" && renderCourseDetails()}
            {activeTab === "activity" && renderActivityDetails()}
            {activeTab === "socials" && renderSocialsSection()}
            {activeTab === "myblogs" && renderMyBlogs()}
          </div>
        </div>
        {showEditUsernameModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/60">
            <div className="bg-[#0c081e] rounded-2xl shadow-xl max-w-md w-full border border-[#3f2b96]/40">
              <div className="flex justify-between items-center p-5 border-b border-[#3f2b96]/30">
                <h3 className="text-base font-semibold text-white">
                  Edit Username
                </h3>
                <button
                  onClick={() => setShowEditUsernameModal(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleEditUsername} className="p-6 space-y-6">
                <div>
                  <label
                    htmlFor="newUsername"
                    className="block text-sm font-medium text-zinc-400 mb-1"
                  >
                    New Username
                  </label>
                  <input
                    type="text"
                    id="newUsername"
                    name="newUsername"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="block w-full border-b border-zinc-700/50 py-2 px-4 text-white focus:outline-none focus:border-[#7c52ff]/80 bg-transparent"
                  />
                  {usernameError && (
                    <p className="mt-1 text-sm text-red-500">{usernameError}</p>
                  )}
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowEditUsernameModal(false)}
                    className="px-4 py-2 bg-[#0c081e] hover:bg-[#3f2b96]/20 border border-[#3f2b96]/40 text-white rounded-md transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingUsername}
                    className="px-4 py-2 bg-[#5d3fd3] hover:bg-linear-to-r from-[#5d3fd3] to-[#7c52ff] text-white rounded-md transition-colors duration-200 flex items-center"
                  >
                    {isUpdatingUsername ? "Saving..." : "Update Username"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showChangePasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/60">
            <div className="bg-[#0c081e] rounded-2xl shadow-xl max-w-md w-full border border-[#3f2b96]/40">
              <div className="flex justify-between items-center p-5 border-b border-[#3f2b96]/30">
                <h3 className="text-base font-semibold text-white">
                  Change Password
                </h3>
                <button
                  onClick={() => setShowChangePasswordModal(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form
                onSubmit={handleSubmitPasswordChange}
                className="p-6 space-y-6"
              >
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium text-zinc-400 mb-1"
                  >
                    Current Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="currentPassword"
                    id="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    className="block w-full border-b border-zinc-700/50 py-2 px-4 text-white focus:outline-none focus:border-[#7c52ff]/80 bg-transparent"
                  />
                  {errors.currentPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.currentPassword}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-zinc-400 mb-1"
                  >
                    New Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    id="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className="block w-full border-b border-zinc-700/50 py-2 px-4 text-white focus:outline-none focus:border-[#7c52ff]/80 bg-transparent"
                  />
                  {errors.newPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.newPassword}
                    </p>
                  )}
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-zinc-400">
                        Password Strength
                      </span>
                      <span
                        className={`text-sm text-${passwordStrength.color}`}
                      >
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-zinc-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-${passwordStrength.color} rounded-full`}
                        style={{
                          width: `${(passwordStrength.score / 6) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showPasswordToggle"
                    checked={showPassword}
                    onChange={togglePasswordVisibility}
                    className="h-4 w-4 text-lime-600 focus:ring-[#7c52ff] rounded bg-zinc-800"
                  />
                  <label
                    htmlFor="showPasswordToggle"
                    className="ml-2 block text-sm text-zinc-400"
                  >
                    Show passwords
                  </label>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowChangePasswordModal(false)}
                    className="px-4 py-2 bg-[#0c081e] hover:bg-[#3f2b96]/20 border border-[#3f2b96]/40 text-white rounded-md transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#5d3fd3] hover:bg-linear-to-r from-[#5d3fd3] to-[#7c52ff] text-white rounded-md transition-colors duration-200 flex items-center"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showDeleteAccountModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-zinc-800 rounded-lg shadow-xl max-w-md w-full border border-zinc-700/50 transform transition-all animate-fade-in">
              <div className="flex justify-between items-center p-4 border-b border-zinc-700/50">
                <h3 className="text-xl font-medium text-red-400">
                  Delete Account
                </h3>
                <button
                  onClick={() => setShowDeleteAccountModal(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                    <span className="text-red-400 font-medium">Warning</span>
                  </div>
                  <p className="text-red-300 text-sm mt-2">
                    This action cannot be undone. This will permanently delete
                    your account and all associated data.
                  </p>
                </div>

                <div>
                  <p className="text-white text-lg mb-2">
                    Are you sure you want to delete your account?
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="deleteReason"
                    className="block text-sm font-medium text-zinc-400 mb-2"
                  >
                    Why are you deleting your account? (Optional)
                  </label>
                  <textarea
                    id="deleteReason"
                    value={deleteReason}
                    onChange={(e) => setDeleteReason(e.target.value)}
                    className="block w-full border border-[#3f2b96]/40 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-red-400 bg-[#04020a] resize-none"
                    rows={3}
                    placeholder="Help us improve by sharing your feedback..."
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmationPhrase"
                    className="block text-sm font-medium text-zinc-400 mb-2"
                  >
                    To confirm deletion, type{" "}
                    <span className="text-red-400 font-mono">
                      {requiredPhrase}
                    </span>{" "}
                    in the box below
                  </label>
                  <input
                    type="text"
                    id="confirmationPhrase"
                    value={confirmationPhrase}
                    onChange={(e) => setConfirmationPhrase(e.target.value)}
                    className="block w-full border border-[#3f2b96]/40 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-red-500 bg-[#04020a] font-mono"
                    placeholder="Enter the given text"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDeleteAccountModal(false)}
                    className="px-4 py-2 bg-[#0c081e] hover:bg-[#3f2b96]/20 border border-[#3f2b96]/40 text-white rounded-md transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={confirmationPhrase !== requiredPhrase}
                    className={`px-4 py-2 rounded-md transition-colors duration-200 flex items-center ${
                      confirmationPhrase === requiredPhrase
                        ? "bg-red-600 hover:bg-red-500 text-white"
                        : "bg-zinc-600 text-zinc-400 cursor-not-allowed"
                    }`}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
            <div
              className={`p-4 rounded-lg shadow-xl flex items-center ${
                toastMessage.type === "success"
                  ? "bg-[#5d3fd3] text-lime-200"
                  : "bg-red-900 text-red-200"
              }`}
            >
              {toastMessage.type === "success" ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <AlertTriangle className="h-5 w-5 mr-2" />
              )}
              <span>{toastMessage.text}</span>
            </div>
          </div>
        )}
      </motion.main>
    </div>
  );
};

export default UserProfile;
