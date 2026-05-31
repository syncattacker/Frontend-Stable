"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  IconCalendar,
  IconClock,
  IconTrophy,
  IconUsers,
  IconTarget,
  IconCircleCheck,
  IconArrowRight,
  IconAlertTriangle,
  IconArchiveOff,
  IconShieldCheck,
  IconUser,
} from "@tabler/icons-react";
import API from "@/utils/axios";
import Image from "next/image";
import logo from "@/img/white.svg";
import BoxLoader from "@/components/loaders/LogoLoader";
import { motion } from "framer-motion";
import { withAuth } from "@/utils/withAuth";

const SeasonCtfRegis = () => {
  const { slug } = useParams();
  const router = useRouter();

  const [isAdmin, setIsAdmin] = useState(false);
  const [ctfData, setCtfData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(true);
  const [formData, setFormData] = useState({
    agreeToTerms: false,
    accessCode: "",
    participationType: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [currentStep, setCurrentStep] = useState("access-code");
  const [accessCodeBoxes, setAccessCodeBoxes] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const accessCodeRefs = useRef([]);

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const handleBoxChange = (index, value) => {
    const char = value
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase()
      .slice(-1);
    const newBoxes = [...accessCodeBoxes];
    newBoxes[index] = char;
    setAccessCodeBoxes(newBoxes);
    setFormData((prev) => ({ ...prev, accessCode: newBoxes.join("") }));
    if (char && index < 5) accessCodeRefs.current[index + 1]?.focus();
    if (formErrors.accessCode)
      setFormErrors((prev) => ({ ...prev, accessCode: "" }));
  };

  const handleBoxKeyDown = (index, e) => {
    if (e.key === "Backspace" && !accessCodeBoxes[index] && index > 0) {
      accessCodeRefs.current[index - 1]?.focus();
    }
  };

  const handleBoxPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase()
      .slice(0, 6);
    const newBoxes = [...accessCodeBoxes];
    pasted.split("").forEach((char, i) => {
      if (i < 6) newBoxes[i] = char;
    });
    setAccessCodeBoxes(newBoxes);
    setFormData((prev) => ({ ...prev, accessCode: newBoxes.join("") }));
    accessCodeRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  useEffect(() => {
    const fetchCtfDetails = async () => {
      try {
        setLoading(true);
        setCheckingRegistration(true);
        setError(null);
        const response = await API.get(`/api/v1/seasons/${slug}`);

        let data = null;
        if (response.success && response.data) data = response.data;
        else if (response.data?.success) data = response.data.data;
        else if (response.name || response.slug) data = response;
        else if (response.data?.name) data = response.data;

        if (data?.name) {
          setCtfData(data);
          setIsRegistered(data.isRegistered || false);
          setIsAdmin(data.isAdmin || false);
        } else {
          setError("CTF not found or invalid response format");
        }
      } catch (err) {
        if (err.response?.status === 404) setError("CTF not found");
        else if (err.response?.status === 500)
          setError("Server error. Please try again later.");
        else if (!err.response)
          setError("Network error. Please check your connection.");
        else setError("Failed to load CTF details");
      } finally {
        setLoading(false);
        setCheckingRegistration(false);
      }
    };

    if (slug) fetchCtfDetails();
    else {
      setError("No CTF slug provided");
      setLoading(false);
      setCheckingRegistration(false);
    }
  }, [slug]);
  const formatDateWithTimezone = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      const formattedDate = date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: timezone,
      });
      const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: timezone,
        timeZoneName: "short",
      });
      return `${formattedDate} at ${formattedTime}`;
    } catch {
      return "Invalid date";
    }
  };

  const getEventStatus = (startDate, endDate) => {
    if (!startDate || !endDate) return "unknown";
    try {
      const now = new Date(),
        start = new Date(startDate),
        end = new Date(endDate);
      if (now < start) return "upcoming";
      if (now > end) return "ended";
      return "live";
    } catch {
      return "unknown";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "text-[#fefce8]";
      case "live":
        return "text-[#fefce8]";
      case "ended":
        return "text-zinc-500";
      default:
        return "text-zinc-500";
    }
  };

  const validateForm = () => {
    const errors = {};
    if (currentStep === "access-code") {
      if (!formData.agreeToTerms)
        errors.agreeToTerms = "You must agree to the terms and conditions";
      if (!formData.accessCode) errors.accessCode = "Access code is required";
      else if (formData.accessCode.length !== 6)
        errors.accessCode = "Access code must be exactly 6 characters";
      else if (!/^[A-Z0-9]{6}$/i.test(formData.accessCode))
        errors.accessCode = "Access code must contain only letters and numbers";
    } else if (currentStep === "participation-type") {
      if (!formData.participationType)
        errors.participationType = "Please select a participation type";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "accessCode") {
      const alphanumericValue = value
        .replace(/[^a-zA-Z0-9]/g, "")
        .toUpperCase()
        .slice(0, 6);
      setFormData((prev) => ({ ...prev, [name]: alphanumericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleGoToChallenges = () =>
    router.push(`/dashboard/seasons/${slug}/challenges`);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (isRegistered) {
      router.push(`/dashboard/seasons/${slug}/challenges`);
      return;
    }
    if (!validateForm()) return;

    setRegistering(true);
    setFormErrors({});

    const payload =
      currentStep === "access-code"
        ? { referralCode: formData.accessCode }
        : {
            referralCode: formData.accessCode,
            participationType: formData.participationType,
          };

    try {
      const response = await API.post(
        `/api/v1/seasons/${slug}/register`,
        payload,
      );
      let success = false;
      if (response.success) success = true;
      else if (response.data?.success) success = true;
      else if (response.status === 200 || response.status === 201)
        success = true;

      if (success) {
        if (response.data?.step === "choose-participation") {
          setCurrentStep("participation-type");
          setFormErrors({});
        } else {
          setIsRegistered(true);
          setCtfData((prev) => ({
            ...prev,
            totalPlayers: (prev.totalPlayers || 0) + 1,
          }));
          setTimeout(() => {
            if (formData.participationType === "team")
              router.push(`/dashboard/seasons/${slug}/team-setup`);
            else router.push(`/dashboard/seasons/${slug}/challenges`);
          }, 1500);
        }
      } else {
        setFormErrors({
          general:
            response.data?.message || "Registration failed. Please try again.",
        });
      }
    } catch (error) {
      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.message;
        if (errorMessage === "Already registered") {
          setIsRegistered(true);
          setCtfData((prev) => ({
            ...prev,
            totalPlayers: (prev.totalPlayers || 0) + 1,
          }));
          if (formData.participationType === "team")
            router.push(`/dashboard/seasons/${slug}/team-setup`);
          else router.push(`/dashboard/seasons/${slug}/challenges`);
        } else if (errorMessage?.toLowerCase().includes("access code")) {
          setFormErrors({ accessCode: errorMessage });
        } else {
          setFormErrors({
            general: errorMessage || "Invalid registration request",
          });
        }
      } else if (error.response?.status === 403) {
        setFormErrors({ general: "Registration is not allowed at this time" });
      } else if (error.response?.data?.message) {
        const errorMessage = error.response.data.message;
        if (errorMessage.toLowerCase().includes("access code"))
          setFormErrors({ accessCode: errorMessage });
        else setFormErrors({ general: errorMessage });
      } else {
        setFormErrors({ general: "Registration failed. Please try again." });
      }
    } finally {
      setRegistering(false);
    }
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <BoxLoader />
          <p className="text-[#a1a1aa] font-bold uppercase tracking-[0.3em] text-xs mt-6">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error || !ctfData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-[#fefce8] text-2xl mb-2 font-roundo font-bold">
            {error || "CTF Not Found"}
          </div>
          <p className="text-[#a1a1aa] mb-8 font-medium uppercase tracking-widest text-xs">
            Please check the URL or try again later.
          </p>
          <button
            onClick={() => window.history.back()}
            className="border border-[#FEFCE833] text-[#fefce8] px-8 py-3 text-xs font-bold uppercase tracking-widest hover:border-[#fefce8] transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  const status = getEventStatus(ctfData.startDateTime, ctfData.endDateTime);
  const canRegister =
    ctfData.isRegistrationOpen !== false && status !== "ended";

  const rules =
    ctfData.type === "solo"
      ? [
          "Individual participation only — no team collaboration allowed",
          "All challenges must be solved ethically and within the platform",
          "Sharing solutions or hints with other participants is prohibited",
          "Any attempt to attack the infrastructure will result in disqualification",
          "Participants must respect the time limits for each challenge",
          "Winners will be determined based on points and submission time",
        ]
      : ctfData.type === "team"
        ? [
            "Team participation required — collaborate only with your registered team members",
            "All challenges must be solved ethically and within the platform",
            "Sharing solutions or hints with other teams is prohibited",
            "Any attempt to attack the infrastructure will result in disqualification",
            "Teams must respect the time limits for each challenge",
            "Winning teams are determined based on points and submission time",
          ]
        : [
            "All challenges must be solved ethically and within the platform",
            "Sharing solutions or hints with other participants is prohibited",
            "Any attempt to attack the infrastructure will result in disqualification",
            "Participants must respect the time limits for each challenge",
            "Winners will be determined based on points and submission time",
          ];
  return (
    <div
      className="min-h-screen bg-black text-[#fefce8]"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      <motion.div className="relative z-10 min-h-screen flex flex-col">
        <div
          className="relative h-[55vh] flex items-end justify-start bg-cover bg-center bg-no-repeat overflow-hidden"
          style={{
            backgroundImage: `url(${
              ctfData.backgroundImage ||
              "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
            })`,
          }}
        >
          {/* Strong darkening overlay */}
          <div className="absolute inset-0 bg-black/80" />
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />

          <div className="relative z-10 max-w-7xl w-full mx-auto px-6 sm:px-8 pb-12">
            {/* Status pill */}
            <div className="flex items-center gap-2 mb-4">
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  status === "live"
                    ? "bg-[#fefce8] animate-pulse"
                    : status === "upcoming"
                      ? "bg-zinc-400"
                      : "bg-zinc-700"
                }`}
              />
              <span
                className={`text-[10px] font-bold tracking-[0.25em] uppercase ${getStatusColor(status)}`}
              >
                {status === "live"
                  ? "Live Now"
                  : status === "upcoming"
                    ? "Upcoming"
                    : status === "ended"
                      ? "Ended"
                      : "Unknown"}
              </span>
            </div>

            <h1
              className="text-6xl sm:text-7xl md:text-9xl text-[#fefce8] mb-3 leading-none"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                letterSpacing: "-0.03em",
              }}
            >
              {ctfData.name || "CTF Season"}
            </h1>

            <p className="text-zinc-400 text-sm sm:text-base font-medium tracking-widest uppercase">
              {ctfData.theme || "Cybersecurity Challenge"}
            </p>
          </div>
        </div>
        {/* ── Content ── */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="grid lg:grid-cols-3 gap-10 lg:gap-14">
            {/* ── Left ── */}
            <div className="lg:col-span-2 space-y-2">
              {/* Season Details */}
              <div className="border border-[#FEFCE833] bg-zinc-950/50 p-8 sm:p-8">
                <h2 className="text-3xl text-[#fefce8] mb-6 font-roundo">
                  Season Details
                </h2>
                <div className="grid sm:grid-cols-2 gap-8">
                  {[
                    {
                      icon: IconCalendar,
                      label: "Start Date",
                      value: formatDateWithTimezone(ctfData.startDateTime),
                    },
                    {
                      icon: IconClock,
                      label: "End Date",
                      value: formatDateWithTimezone(ctfData.endDateTime),
                    },
                    {
                      icon: IconTarget,
                      label: "Challenges",
                      value: `${ctfData.totalChallenges || 0} Available`,
                    },
                    {
                      icon: IconUsers,
                      label: "Participants",
                      value: `${ctfData.totalPlayers || 0} Registered`,
                    },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-4">
                      <div className="mt-0.5 border border-[#FEFCE833] p-2.5 text-zinc-500 shrink-0">
                        <Icon size={18} stroke={1.5} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[#a1a1aa] uppercase tracking-[0.2em] mb-1">
                          {label}
                        </p>
                        <p className="text-sm text-yellow-50 font-medium leading-snug">
                          {value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-[#FEFCE833]">
                  <p className="text-xs text-[#a1a1aa]">
                    <span className="text-[#a1a1aa] font-semibold mr-2">
                      Timezone:
                    </span>
                    {timezone} — All times reflect your local environment.
                  </p>
                </div>
              </div>

              {/* Description */}
              {ctfData.description && (
                <div className="border border-[#FEFCE833] bg-zinc-950/50 p-8 sm:p-8">
                  <h2 className="text-3xl text-[#fefce8] mb-4 font-roundo">
                    About
                  </h2>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {ctfData.description}
                  </p>
                </div>
              )}

              {/* Rules */}
              <div className="border border-[#FEFCE833] bg-zinc-950/50 p-8 sm:p-8">
                <h2 className="text-3xl text-[#fefce8] mb-6 font-roundo">
                  Rules & Guidelines
                </h2>
                <div className="space-y-5">
                  {rules.map((rule, index) => (
                    <div key={index} className="flex items-start gap-4 group">
                      <div className="mt-0.5 shrink-0 text-zinc-700 group-hover:text-zinc-400 transition-colors">
                        <IconCircleCheck size={16} stroke={1.5} />
                      </div>
                      <p className="text-sm text-zinc-500 group-hover:text-zinc-300 transition-colors leading-relaxed">
                        {rule}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right: Registration Card ── */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-8">
                <div className="border border-[#FEFCE833] bg-zinc-950/80 p-8 sm:p-10">
                  {checkingRegistration ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border border-[#FEFCE833] border-t-white mx-auto mb-6" />
                      <p className="text-[#a1a1aa] font-bold uppercase tracking-[0.25em] text-xs">
                        Verifying...
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Card Header */}
                      <div className="mb-8 pb-8 border-b border-[#FEFCE833]">
                        <div className="mb-4 flex items-center justify-center">
                          <Image
                            src={logo}
                            alt="gopwnit"
                            width={100}
                            height={32}
                            className="w-auto transition-all duration-300"
                            style={{ width: "auto" }}
                            priority
                          />
                        </div>
                        <h3 className="text-3xl text-[#fefce8] mb-2 text-center font-roundo font-semibold">
                          {isRegistered || isAdmin
                            ? "Access Granted"
                            : "Enter Arena"}
                        </h3>
                        <p className="text-xs text-[#a1a1aa] leading-relaxed text-center">
                          {isRegistered
                            ? "Your clearance is active. The challenges await."
                            : isAdmin
                              ? "Administrative override active."
                              : "Initialize your registration sequence to engage."}
                        </p>
                      </div>

                      {/* Stats */}
                      <div className="space-y-0 mb-8">
                        {[
                          {
                            label: "Registration",
                            value: canRegister ? "Online" : "Offline",
                            valueClass: canRegister
                              ? "text-[#fefce8]"
                              : "text-[#a1a1aa]",
                          },
                          {
                            label: "Organizer",
                            value: (
                              ctfData.organizer || "System Core"
                            ).toUpperCase(),
                            valueClass: "text-[#a1a1aa]",
                          },
                          {
                            label: "Active Hackers",
                            value: ctfData.totalPlayers || 0,
                            valueClass: "text-[#fefce8]",
                          },
                        ].map(({ label, value, valueClass }) => (
                          <div
                            key={label}
                            className="flex justify-between items-center py-3 border-b border-[#FEFCE833] last:border-0"
                          >
                            <span className="text-[10px] font-bold text-[#a1a1aa] uppercase tracking-[0.2em]">
                              {label}
                            </span>
                            <span
                              className={`text-xs font-bold uppercase tracking-wider ${valueClass}`}
                            >
                              {value}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* ── Admin ── */}
                      {isAdmin ? (
                        <div className="space-y-3">
                          <p className="text-[10px] text-[#a1a1aa] uppercase tracking-[0.2em] text-center pb-4">
                            Admin Override Active
                          </p>
                          <button
                            onClick={handleGoToChallenges}
                            className="group w-full border border-[#FEFCE833] hover:border-[#fefce8] bg-transparent text-[#fefce8] font-bold uppercase tracking-[0.2em] py-4 px-6 text-xs transition-colors flex items-center justify-center gap-2"
                          >
                            Go to Challenges
                            <IconArrowRight
                              size={16}
                              stroke={1.5}
                              className="group-hover:translate-x-1 transition-transform"
                            />
                          </button>
                        </div>
                      ) : isRegistered ? (
                        /* ── Already Registered ── */
                        <div className="space-y-3">
                          {status === "ended" ? (
                            <>
                              <p className="text-[10px] text-[#a1a1aa] uppercase tracking-[0.2em] text-center pb-4">
                                Season Ended
                              </p>
                              <button
                                onClick={() =>
                                  router.push(
                                    `/dashboard/seasons/${slug}/leaderboard`,
                                  )
                                }
                                className="group w-full border border-[#FEFCE833] hover:border-[#fefce8] text-[#fefce8] font-bold uppercase tracking-[0.2em] py-4 px-6 text-xs transition-colors flex items-center justify-center gap-2"
                              >
                                <IconTrophy size={16} stroke={1.5} />
                                View Leaderboard
                              </button>
                            </>
                          ) : (
                            <>
                              <p className="text-[10px] text-[#a1a1aa] uppercase tracking-[0.2em] text-center pb-2">
                                System Ready
                              </p>
                              <button
                                onClick={handleGoToChallenges}
                                className="group w-full bg-[#fefce8] text-black font-bold uppercase tracking-[0.2em] py-4 px-6 text-xs hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                              >
                                Start Challenges
                                <IconArrowRight
                                  size={16}
                                  stroke={2}
                                  className="group-hover:translate-x-1 transition-transform"
                                />
                              </button>
                              <button
                                onClick={() =>
                                  router.push(
                                    `/dashboard/seasons/${slug}/team-setup`,
                                  )
                                }
                                className="group w-full border border-[#FEFCE833] hover:border-[#FEFCE838] text-zinc-500 hover:text-[#fefce8] font-bold uppercase tracking-[0.2em] py-3 px-6 text-xs transition-colors flex items-center justify-center gap-2"
                              >
                                <IconUsers size={14} stroke={1.5} />
                                Manage Team
                              </button>
                            </>
                          )}
                        </div>
                      ) : !isAdmin && canRegister ? (
                        /* ── Registration Form ── */
                        <form onSubmit={handleRegister} className="space-y-6">
                          {formErrors.general && (
                            <div className="border border-red-900/50 bg-red-950/20 p-3">
                              <p className="text-red-500 text-[10px] font-bold uppercase tracking-[0.2em] text-center">
                                {formErrors.general}
                              </p>
                            </div>
                          )}

                          {/* ── Step: Participation Type ── */}
                          {currentStep === "participation-type" && (
                            <div className="space-y-4">
                              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em]">
                                Participation Mode
                              </p>
                              <div className="flex flex-col gap-2">
                                {[
                                  ...(ctfData.type === "solo" ||
                                  ctfData.type === "both" ||
                                  !ctfData.type
                                    ? [
                                        {
                                          value: "solo",
                                          title: "Solo",
                                          desc: "Compete alone",
                                          icon: (
                                            <IconUser size={18} stroke={1.5} />
                                          ),
                                        },
                                      ]
                                    : []),
                                  ...(ctfData.type === "team" ||
                                  ctfData.type === "both" ||
                                  !ctfData.type
                                    ? [
                                        {
                                          value: "team",
                                          title: "Team",
                                          desc: "Collaborate & conquer",
                                          icon: (
                                            <IconUsers size={18} stroke={1.5} />
                                          ),
                                        },
                                      ]
                                    : []),
                                ].map((m) => (
                                  <button
                                    key={m.value}
                                    type="button"
                                    onClick={() => {
                                      setFormData((prev) => ({
                                        ...prev,
                                        participationType: m.value,
                                      }));
                                      if (formErrors.participationType)
                                        setFormErrors((prev) => ({
                                          ...prev,
                                          participationType: "",
                                        }));
                                    }}
                                    className={`flex items-center justify-between w-full px-4 py-3.5 border transition-colors text-left ${
                                      formData.participationType === m.value
                                        ? "border-[#fefce8] bg-[#fefce8]/5 text-[#fefce8]"
                                        : "border-[#FEFCE833] text-zinc-500 hover:border-[#FEFCE838]"
                                    }`}
                                  >
                                    <div>
                                      <p className="text-xs font-bold uppercase tracking-widest">
                                        {m.title}
                                      </p>
                                      <p className="text-[10px] text-[#a1a1aa] mt-0.5">
                                        {m.desc}
                                      </p>
                                    </div>
                                    <span
                                      className={
                                        formData.participationType === m.value
                                          ? "text-[#fefce8]"
                                          : "text-zinc-700"
                                      }
                                    >
                                      {m.icon}
                                    </span>
                                  </button>
                                ))}
                              </div>
                              {formErrors.participationType && (
                                <p className="text-[10px] text-red-500 font-bold tracking-wide flex items-center gap-1">
                                  <IconAlertTriangle size={12} stroke={2} />
                                  {formErrors.participationType}
                                </p>
                              )}
                            </div>
                          )}

                          {/* ── Step: Access Code ── */}
                          {currentStep === "access-code" && (
                            <>
                              <div className="space-y-3">
                                <label className="block text-[10px] font-bold text-[#a1a1aa] uppercase tracking-[0.2em]">
                                  Access Code
                                </label>
                                <div className="flex gap-2">
                                  {accessCodeBoxes.map((box, index) => (
                                    <input
                                      key={index}
                                      ref={(el) =>
                                        (accessCodeRefs.current[index] = el)
                                      }
                                      type="text"
                                      inputMode="text"
                                      maxLength={1}
                                      value={box}
                                      onChange={(e) =>
                                        handleBoxChange(index, e.target.value)
                                      }
                                      onKeyDown={(e) =>
                                        handleBoxKeyDown(index, e)
                                      }
                                      onPaste={handleBoxPaste}
                                      className={`w-full aspect-square text-center text-base font-bold font-mono uppercase bg-zinc-950 outline-none transition-colors caret-transparent border ${
                                        formErrors.accessCode
                                          ? "border-red-800 text-red-400"
                                          : box
                                            ? "border-zinc-400 text-[#fefce8]"
                                            : "border-[#FEFCE833] text-zinc-400 focus:border-zinc-500"
                                      }`}
                                    />
                                  ))}
                                </div>
                                {formErrors.accessCode && (
                                  <p className="text-[10px] text-red-500 font-bold tracking-wide flex items-center gap-1">
                                    <IconAlertTriangle size={12} stroke={2} />
                                    {formErrors.accessCode}
                                  </p>
                                )}
                              </div>

                              <label className="flex items-start gap-3 cursor-pointer group">
                                <div className="relative mt-0.5 shrink-0">
                                  <input
                                    type="checkbox"
                                    name="agreeToTerms"
                                    checked={formData.agreeToTerms}
                                    onChange={handleInputChange}
                                    className="peer w-4 h-4 opacity-0 absolute cursor-pointer"
                                  />
                                  <div className="w-4 h-4 border border-[#FEFCE833] bg-black transition-colors group-hover:border-zinc-500 peer-checked:bg-[#fefce8] peer-checked:border-[#fefce8] flex items-center justify-center">
                                    <motion.div
                                      initial={false}
                                      animate={
                                        formData.agreeToTerms
                                          ? { scale: 1, opacity: 1 }
                                          : { scale: 0, opacity: 0 }
                                      }
                                    >
                                      <IconCircleCheck
                                        size={12}
                                        stroke={2.5}
                                        className="text-black"
                                      />
                                    </motion.div>
                                  </div>
                                </div>
                                <span className="text-[10px] text-[#a1a1aa] leading-relaxed font-medium uppercase tracking-wide group-hover:text-zinc-400 transition-colors">
                                  I agree to the{" "}
                                  <a
                                    href="#"
                                    className="text-zinc-300 hover:text-[#fefce8] transition-colors underline underline-offset-2"
                                  >
                                    Engagement Protocols
                                  </a>{" "}
                                  and{" "}
                                  <a
                                    href="#"
                                    className="text-zinc-300 hover:text-[#fefce8] transition-colors underline underline-offset-2"
                                  >
                                    Data Privacy Directives
                                  </a>
                                  .
                                </span>
                              </label>
                              {formErrors.agreeToTerms && (
                                <p className="text-[10px] text-red-500 font-bold tracking-wide flex items-center gap-1">
                                  <IconAlertTriangle size={12} stroke={2} />
                                  {formErrors.agreeToTerms}
                                </p>
                              )}
                            </>
                          )}

                          <button
                            type="submit"
                            disabled={registering}
                            className="group w-full bg-[#fefce8] hover:bg-zinc-100 text-black font-bold uppercase tracking-[0.2em] py-4 px-6 text-xs transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            {registering ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border border-black/20 border-t-black" />
                                <span>Authorizing...</span>
                              </>
                            ) : (
                              <>
                                <span>
                                  {currentStep === "access-code"
                                    ? "Initialize Access"
                                    : "Register Now"}
                                </span>
                                <IconArrowRight
                                  size={16}
                                  stroke={2}
                                  className="group-hover:translate-x-1 transition-transform"
                                />
                              </>
                            )}
                          </button>
                        </form>
                      ) : (
                        /* ── Closed / Ended ── */
                        <div className="space-y-3">
                          <p className="text-[10px] text-zinc-700 uppercase tracking-[0.2em] text-center pb-4">
                            {status === "ended"
                              ? "Simulation Terminated"
                              : "Registration Offline"}
                          </p>
                          {status === "ended" ? (
                            <button
                              onClick={() =>
                                router.push(
                                  `/dashboard/seasons/${slug}/leaderboard`,
                                )
                              }
                              className="group w-full border border-[#FEFCE833] hover:border-[#FEFCE838] text-yellow-50 hover:text-[#fefce8] font-bold uppercase tracking-[0.2em] py-4 px-6 text-xs transition-colors flex items-center justify-center gap-2"
                            >
                              <IconTrophy size={16} stroke={1.5} />
                              View Leaderboard
                            </button>
                          ) : (
                            <button
                              disabled
                              className="w-full border border-[#FEFCE833] text-zinc-700 font-bold uppercase tracking-[0.2em] py-4 px-6 text-xs cursor-not-allowed"
                            >
                              Access Denied
                            </button>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="mt-auto w-full border-t border-[#FEFCE833]">
          <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
            <p className="text-zinc-700 text-[10px] font-bold uppercase tracking-[0.3em]">
              &copy; 2025 Gopwnit Systems
            </p>
            <p className="text-zinc-700 text-[10px] font-bold uppercase tracking-[0.3em]">
              All Clearance Levels Enforced
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default withAuth(SeasonCtfRegis);
