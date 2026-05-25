"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconChevronDown,
  IconCheck,
  IconCalendar,
  IconClock,
  IconMapPin,
  IconTypography,
  IconUsers,
  IconTrophy,
} from "@tabler/icons-react";
import { showToast } from "@/utils/Toast.jsx";
import { useRouter } from "next/navigation";
import API from "@/utils/axios";
import { withAuth } from "@/utils/withAuth";

const T = {
  bg: "#0A0A0A",
  cream: "#fefce8",
  muted: "#a1a1aa",
  border: "rgba(254,252,232,0.12)",
  borderHover: "rgba(254,252,232,0.22)",
  card: "#111111",
  inputBg: "#0f0f0f",
};

/* ── Divider line ── */
const HR = () => (
  <div className="w-full" style={{ height: "1px", background: T.border }} />
);

/* ── CustomCalendar ── */
const CustomCalendar = ({ value, onChange, minDate }) => {
  const [viewDate, setViewDate] = useState(
    value ? new Date(value + "T00:00:00") : new Date()
  );

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
  for (let day = 1; day <= daysInMonth; day++) days.push(day);

  const handleDateClick = (day) => {
    if (!day) return;
    const selectedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day, 12, 0, 0, 0);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (minDate && selectedDate < minDate) return;
    if (selectedDate < today) return;
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const dayStr = String(selectedDate.getDate()).padStart(2, "0");
    onChange(`${year}-${month}-${dayStr}`);
  };

  const navigateMonth = (dir) => {
    const d = new Date(viewDate);
    d.setMonth(d.getMonth() + dir);
    setViewDate(d);
  };

  const isDateDisabled = (day) => {
    if (!day) return false;
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day, 12, 0, 0, 0);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (date < today) return true;
    if (minDate) {
      const mn = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate(), 12, 0, 0, 0);
      if (date < mn) return true;
    }
    return false;
  };

  const isSelected = (day) => {
    if (!day || !value) return false;
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day, 12, 0, 0, 0);
    const sel = new Date(value + "T12:00:00");
    return date.getFullYear() === sel.getFullYear() &&
      date.getMonth() === sel.getMonth() &&
      date.getDate() === sel.getDate();
  };

  return (
    <div
      className="w-[290px] p-4 shadow-2xl"
      style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: "2px" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => navigateMonth(-1)}
          className="w-7 h-7 flex items-center justify-center transition-all"
          style={{ border: `1px solid ${T.border}`, borderRadius: "2px", color: T.muted }}
          onMouseEnter={e => e.currentTarget.style.borderColor = T.borderHover}
          onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
        >
          <IconChevronLeft size={13} />
        </button>
        <span
          className="text-xs uppercase tracking-[0.2em]"
          style={{ color: T.cream, fontFamily: "Roundo, sans-serif" }}
        >
          {months[viewDate.getMonth()]} {viewDate.getFullYear()}
        </span>
        <button
          type="button"
          onClick={() => navigateMonth(1)}
          className="w-7 h-7 flex items-center justify-center transition-all"
          style={{ border: `1px solid ${T.border}`, borderRadius: "2px", color: T.muted }}
          onMouseEnter={e => e.currentTarget.style.borderColor = T.borderHover}
          onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
        >
          <IconChevronRight size={13} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {["S","M","T","W","T","F","S"].map((d, i) => (
          <div
            key={i}
            className="text-center text-[9px] uppercase tracking-widest py-1"
            style={{ color: T.muted, fontFamily: "Outfit, sans-serif" }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((day, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleDateClick(day)}
            disabled={isDateDisabled(day)}
            className="h-8 w-full text-[11px] transition-all duration-150"
            style={{
              fontFamily: "Outfit, sans-serif",
              borderRadius: "2px",
              background: isSelected(day) ? T.cream : "transparent",
              color: !day ? "transparent"
                : isSelected(day) ? T.bg
                : isDateDisabled(day) ? "rgba(161,161,170,0.2)"
                : T.muted,
              cursor: !day || isDateDisabled(day) ? "default" : "pointer",
            }}
            onMouseEnter={e => {
              if (day && !isDateDisabled(day) && !isSelected(day))
                e.currentTarget.style.color = T.cream;
            }}
            onMouseLeave={e => {
              if (day && !isDateDisabled(day) && !isSelected(day))
                e.currentTarget.style.color = T.muted;
            }}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
};

const CustomClock = ({ value, onChange, onClose }) => {
  const [hours, setHours] = useState(value ? parseInt(value.split(":")[0]) : 9);
  const [minutes, setMinutes] = useState(value ? parseInt(value.split(":")[1]) : 0);

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(":");
      setHours(parseInt(h));
      setMinutes(parseInt(m));
    }
  }, [value]);

  const handleHourChange = (v) => {
    if (v > 23) v = 0; if (v < 0) v = 23;
    setHours(v);
    onChange(`${v.toString().padStart(2,"0")}:${minutes.toString().padStart(2,"0")}`);
  };

  const handleMinuteChange = (v) => {
    if (v > 59) v = 0; if (v < 0) v = 59;
    setMinutes(v);
    onChange(`${hours.toString().padStart(2,"0")}:${v.toString().padStart(2,"0")}`);
  };

  const quickTimes = ["09:00","12:00","15:00","18:00","21:00","00:00"];

  const spinBtn = (label, icon, onClick) => (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="w-7 h-7 flex items-center justify-center transition-all"
      style={{ border: `1px solid ${T.border}`, borderRadius: "2px", color: T.muted }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.color = T.cream; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; }}
    >
      {icon}
    </button>
  );

  return (
    <div
      className="w-[260px] p-5 shadow-2xl"
      style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: "2px" }}
    >
      {/* Display */}
      <div className="text-center mb-5">
        <span
          className="text-4xl tracking-widest"
          style={{ color: T.cream, fontFamily: "Bebas Neue, sans-serif" }}
        >
          {hours.toString().padStart(2,"0")}
          <span style={{ color: T.muted }}>:</span>
          {minutes.toString().padStart(2,"0")}
        </span>
      </div>

      {/* Spinners */}
      <div className="flex items-center justify-center gap-6 mb-5">
        {/* Hours */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: T.muted, fontFamily: "Outfit, sans-serif" }}>HH</span>
          {spinBtn("Hour up", <IconChevronUp size={12} />, () => handleHourChange(hours + 1))}
          <div
            className="w-12 h-8 flex items-center justify-center"
            style={{ border: `1px solid ${T.border}`, borderRadius: "2px" }}
          >
            <span className="text-sm font-mono" style={{ color: T.cream }}>{hours.toString().padStart(2,"0")}</span>
          </div>
          {spinBtn("Hour down", <IconChevronDown size={12} />, () => handleHourChange(hours - 1))}
        </div>

        <span className="text-2xl mt-1" style={{ color: T.muted, fontFamily: "Bebas Neue, sans-serif" }}>:</span>

        {/* Minutes */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: T.muted, fontFamily: "Outfit, sans-serif" }}>MM</span>
          {spinBtn("Minute up", <IconChevronUp size={12} />, () => handleMinuteChange(minutes + 1))}
          <div
            className="w-12 h-8 flex items-center justify-center"
            style={{ border: `1px solid ${T.border}`, borderRadius: "2px" }}
          >
            <span className="text-sm font-mono" style={{ color: T.cream }}>{minutes.toString().padStart(2,"0")}</span>
          </div>
          {spinBtn("Minute down", <IconChevronDown size={12} />, () => handleMinuteChange(minutes - 1))}
        </div>
      </div>

      {/* Quick times */}
      <div className="flex flex-wrap gap-1.5 justify-center mb-5">
        {quickTimes.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              const [h, m] = t.split(":");
              setHours(parseInt(h)); setMinutes(parseInt(m));
              onChange(t);
            }}
            className="px-2.5 py-1 text-[9px] uppercase tracking-widest transition-all"
            style={{
              fontFamily: "Outfit, sans-serif",
              borderRadius: "2px",
              border: `1px solid ${value === t ? T.borderHover : T.border}`,
              color: value === t ? T.cream : T.muted,
              background: "transparent",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2 text-[10px] uppercase tracking-widest transition-all"
          style={{
            fontFamily: "Outfit, sans-serif",
            borderRadius: "2px",
            border: `1px solid ${T.border}`,
            color: T.muted,
          }}
          onMouseEnter={e => e.currentTarget.style.color = T.cream}
          onMouseLeave={e => e.currentTarget.style.color = T.muted}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            onChange(`${hours.toString().padStart(2,"0")}:${minutes.toString().padStart(2,"0")}`);
            onClose();
          }}
          className="flex-1 py-2 text-[10px] uppercase tracking-widest transition-all"
          style={{
            fontFamily: "Outfit, sans-serif",
            borderRadius: "2px",
            background: T.cream,
            color: T.bg,
          }}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

  const inputStyle = {
    background: T.inputBg,
    border: `1px solid ${T.border}`,
    borderRadius: "2px",
    color: T.cream,
    fontFamily: "Outfit, sans-serif",
    outline: "none",
    transition: "border-color 0.2s",
  };

    const Label = ({ children }) => (
    <span
      className="block text-[9px] uppercase tracking-[0.2em] mb-2 ml-0.5"
      style={{ color: T.muted, fontFamily: "Outfit, sans-serif" }}
    >
      {children}
    </span>
  );

  const SectionCard = ({ title, children }) => (
    <div
      className="p-6"
      style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: "2px" }}
    >
      <p
        className="text-[9px] uppercase tracking-[0.25em] mb-5"
        style={{ color: T.muted, fontFamily: "Outfit, sans-serif" }}
      >
        {title}
      </p>
      {children}
    </div>
  );

function HostForm() {
  const [formData, setFormData] = useState({
    eventName: "", eventDescription: "", venue: "", ctfType: "",
    numberOfParticipants: "", startDate: "", endDate: "",
    startTime: "09:00", endTime: "18:00",
  });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [descriptionCharCount, setDescriptionCharCount] = useState(0);

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (startDateRef.current && !startDateRef.current.contains(e.target)) setShowStartDatePicker(false);
      if (endDateRef.current && !endDateRef.current.contains(e.target)) setShowEndDatePicker(false);
      if (startTimeRef.current && !startTimeRef.current.contains(e.target)) setShowStartTimePicker(false);
      if (endTimeRef.current && !endTimeRef.current.contains(e.target)) setShowEndTimePicker(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "eventDescription") {
      if (value.length > 400) return;
      setDescriptionCharCount(value.length);
    }
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleDateTimeChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.eventName.trim()) newErrors.eventName = "Event name is required.";
      if (!formData.eventDescription.trim()) {
        newErrors.eventDescription = "Event description is required.";
      } else {
        const cc = formData.eventDescription.length;
        if (cc < 10) newErrors.eventDescription = `Min 10 characters. Current: ${cc}.`;
        else if (cc > 400) newErrors.eventDescription = `Max 400 characters. Current: ${cc}.`;
      }
      if (!formData.venue.trim()) newErrors.venue = "Venue is required.";
      if (!formData.ctfType) newErrors.ctfType = "CTF type is required.";
      if (!formData.numberOfParticipants || formData.numberOfParticipants <= 0) newErrors.numberOfParticipants = "Required.";
      if (!formData.startDate) newErrors.startDate = "Required.";
      if (!formData.endDate) newErrors.endDate = "Required.";
      if (!formData.startTime) newErrors.startTime = "Required.";
      if (!formData.endTime) newErrors.endTime = "Required.";
      if (formData.startDate && formData.endDate) {
        const s = new Date(formData.startDate), en = new Date(formData.endDate);
        if (en < s) { newErrors.endDate = "End date must be after start date."; }
        else if (s.toDateString() === en.toDateString()) {
          const [sh, sm] = formData.startTime.split(":").map(Number);
          const [eh, em] = formData.endTime.split(":").map(Number);
          if (eh * 60 + em <= sh * 60 + sm) newErrors.endTime = "End time must be after start time.";
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => { if (validateStep()) setStep(p => p + 1); };
  const handleBack = () => setStep(p => p - 1);

  const submitFormData = async () => {
    try {
      setIsSubmitting(true);
      await API.post("/api/v1/create/seasons/request", {
        name: formData.eventName, description: formData.eventDescription,
        venue: formData.venue, type: formData.ctfType.toLowerCase(),
        numberOfParticipants: parseInt(formData.numberOfParticipants),
        startDate: formData.startDate, endDate: formData.endDate,
        startTime: formData.startTime, endTime: formData.endTime,
      });
      showToast("success", "Event request submitted successfully!", 3000);
      setShowConfirmDialog(false);
      router.push("/dashboard/seasons");
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to submit event request. Please try again.", 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) setShowConfirmDialog(true);
    else showToast("error", "Please fill in all required fields", 3000);
  };

  const formatDate = (ds) => {
    if (!ds) return "";
    return new Date(ds).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" });
  };

  const progressSteps = [
    { label: "Event Details", icon: IconCalendar },
    { label: "Summary", icon: IconCheck },
  ];

  const slideVariants = {
    initial: (dir) => ({ x: dir > 0 ? 260 : -260, opacity: 0 }),
    animate: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
    exit: (dir) => ({ x: dir < 0 ? 260 : -260, opacity: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }),
  };

  return (
    <div className="flex flex-col items-center w-full" style={{ background: T.bg, minHeight: "100vh", color: T.cream, fontFamily: "Outfit, sans-serif" }}>

      {/* ── Top bar ── */}
      <div
        className="w-full p-4 sticky top-0 z-50"
        style={{ background: T.bg, borderBottom: `1px solid ${T.border}` }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push("/dashboard/seasons")}
            className="flex items-center gap-2 text-[10px] uppercase tracking-widest transition-all"
            style={{ color: T.muted, fontFamily: "Outfit, sans-serif" }}
            onMouseEnter={e => e.currentTarget.style.color = T.cream}
            onMouseLeave={e => e.currentTarget.style.color = T.muted}
          >
            <IconChevronLeft size={14} />
            Dashboard
          </button>

          <div className="flex items-center gap-1">
            {progressSteps.map((s, i) => {
              const Icon = s.icon;
              const isActive = step === i + 1;
              const isDone = step > i + 1;
              return (
                <div key={i} className="flex items-center gap-1">
                  <div
                    className="flex items-center gap-2 px-4 py-1.5 text-[9px] uppercase tracking-widest transition-all"
                    style={{
                      fontFamily: "Outfit, sans-serif",
                      borderRadius: "2px",
                      border: `1px solid ${isActive ? T.borderHover : T.border}`,
                      color: isActive ? T.cream : T.muted,
                    }}
                  >
                    <Icon size={12} />
                    {s.label}
                  </div>
                  {i < progressSteps.length - 1 && (
                    <div className="w-4" style={{ height: "1px", background: T.border }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 w-full">
        <div className="w-full max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div key={step} custom={step} variants={slideVariants} initial="initial" animate="animate" exit="exit">

              {/* ───── Step 1 ───── */}
              {step === 1 && (
                <div>
                  {/* Heading */}
                  <div className="mb-10">
                    <p className="text-[10px] uppercase tracking-[0.3em] mb-3" style={{ color: T.muted }}>
                      Arena Configuration · Step 01
                    </p>
                    <h1
                      className="text-6xl sm:text-7xl uppercase leading-none"
                      style={{ fontFamily: "Bebas Neue, sans-serif", color: T.cream, letterSpacing: "-0.03em" }}
                    >
                      Host Your Event
                    </h1>
                    <div className="w-10 mt-4" style={{ height: "1px", background: T.border }} />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* ── Left column ── */}
                    <div className="flex flex-col gap-4">

                      {/* General info */}
                      <SectionCard title="General Info">
                        <div className="flex flex-col gap-4">
                          {/* Event name */}
                          <div>
                            <Label>Event Identity</Label>
                            <div className="relative">
                              <IconTypography size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: T.muted }} />
                              <input
                                type="text"
                                name="eventName"
                                placeholder="Enter event name..."
                                value={formData.eventName}
                                onChange={handleChange}
                                className="w-full pl-9 pr-4 py-2.5 text-sm placeholder-zinc-700"
                                style={inputStyle}
                                onFocus={e => e.target.style.borderColor = T.borderHover}
                                onBlur={e => e.target.style.borderColor = T.border}
                              />
                            </div>
                            {errors.eventName && <p className="text-red-400 text-[10px] mt-1 ml-0.5" style={{ fontFamily: "Outfit, sans-serif" }}>{errors.eventName}</p>}
                          </div>

                          {/* Venue */}
                          <div>
                            <Label>Location / Platform</Label>
                            <div className="relative">
                              <IconMapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: T.muted }} />
                              <input
                                type="text"
                                name="venue"
                                placeholder="Physical or virtual venue..."
                                value={formData.venue}
                                onChange={handleChange}
                                className="w-full pl-9 pr-4 py-2.5 text-sm placeholder-zinc-700"
                                style={inputStyle}
                                onFocus={e => e.target.style.borderColor = T.borderHover}
                                onBlur={e => e.target.style.borderColor = T.border}
                              />
                            </div>
                            {errors.venue && <p className="text-red-400 text-[10px] mt-1 ml-0.5">{errors.venue}</p>}
                          </div>
                        </div>
                      </SectionCard>

                      {/* Timeline */}
                      <SectionCard title="Timeline">
                        <div className="grid grid-cols-2 gap-4">
                          {/* Start */}
                          <div className="flex flex-col gap-2">
                            <Label>From</Label>
                            <div className="relative" ref={startDateRef}>
                              <button
                                type="button"
                                onClick={() => setShowStartDatePicker(!showStartDatePicker)}
                                className="w-full pl-9 pr-3 py-2.5 text-left text-xs flex items-center transition-all"
                                style={{ ...inputStyle, color: formData.startDate ? T.cream : T.muted }}
                              >
                                <IconCalendar size={14} className="absolute left-3" style={{ color: T.muted }} />
                                {formData.startDate ? formatDate(formData.startDate) : "Start Date"}
                              </button>
                              {showStartDatePicker && (
                                <div className="absolute bottom-full right-0 mb-2 z-[60]">
                                  <CustomCalendar value={formData.startDate} onChange={(d) => { handleDateTimeChange("startDate", d); setShowStartDatePicker(false); }} />
                                </div>
                              )}
                              {errors.startDate && <p className="text-red-400 text-[10px] mt-1">{errors.startDate}</p>}
                            </div>

                            <div className="relative" ref={startTimeRef}>
                              <button
                                type="button"
                                onClick={() => setShowStartTimePicker(!showStartTimePicker)}
                                className="w-full pl-9 pr-3 py-2.5 text-left text-xs flex items-center transition-all"
                                style={{ ...inputStyle, color: T.cream, fontFamily: "monospace" }}
                              >
                                <IconClock size={14} className="absolute left-3" style={{ color: T.muted }} />
                                {formData.startTime}
                              </button>
                              {showStartTimePicker && (
                                <div className="absolute bottom-full right-0 mb-2 z-[60]">
                                  <CustomClock value={formData.startTime} onChange={(t) => handleDateTimeChange("startTime", t)} onClose={() => setShowStartTimePicker(false)} />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* End */}
                          <div className="flex flex-col gap-2">
                            <Label>To</Label>
                            <div className="relative" ref={endDateRef}>
                              <button
                                type="button"
                                onClick={() => setShowEndDatePicker(!showEndDatePicker)}
                                className="w-full pl-9 pr-3 py-2.5 text-left text-xs flex items-center transition-all"
                                style={{ ...inputStyle, color: formData.endDate ? T.cream : T.muted }}
                              >
                                <IconCalendar size={14} className="absolute left-3" style={{ color: T.muted }} />
                                {formData.endDate ? formatDate(formData.endDate) : "End Date"}
                              </button>
                              {showEndDatePicker && (
                                <div className="absolute bottom-full right-0 mb-2 z-[60]">
                                  <CustomCalendar value={formData.endDate} onChange={(d) => { handleDateTimeChange("endDate", d); setShowEndDatePicker(false); }} minDate={formData.startDate ? new Date(formData.startDate) : new Date()} />
                                </div>
                              )}
                              {errors.endDate && <p className="text-red-400 text-[10px] mt-1">{errors.endDate}</p>}
                            </div>

                            <div className="relative" ref={endTimeRef}>
                              <button
                                type="button"
                                onClick={() => setShowEndTimePicker(!showEndTimePicker)}
                                className="w-full pl-9 pr-3 py-2.5 text-left text-xs flex items-center transition-all"
                                style={{ ...inputStyle, color: T.cream, fontFamily: "monospace" }}
                              >
                                <IconClock size={14} className="absolute left-3" style={{ color: T.muted }} />
                                {formData.endTime}
                              </button>
                              {showEndTimePicker && (
                                <div className="absolute bottom-full right-0 mb-2 z-[60]">
                                  <CustomClock value={formData.endTime} onChange={(t) => handleDateTimeChange("endTime", t)} onClose={() => setShowEndTimePicker(false)} />
                                </div>
                              )}
                              {errors.endTime && <p className="text-red-400 text-[10px] mt-1">{errors.endTime}</p>}
                            </div>
                          </div>
                        </div>
                      </SectionCard>
                    </div>

                    {/* ── Right column ── */}
                    <div className="flex flex-col gap-4">

                      {/* Event parameters */}
                      <SectionCard title="Event Parameters">
                        <div className="grid grid-cols-2 gap-4">
                          {/* CTF type */}
                          <div>
                            <Label>CTF Style</Label>
                            <div className="relative">
                              <IconTrophy size={14} className="absolute left-3 top-1/2 -translate-y-1/2 z-10" style={{ color: T.muted }} />
                              <select
                                name="ctfType"
                                value={formData.ctfType}
                                onChange={handleChange}
                                className="w-full appearance-none pl-9 pr-8 py-2.5 text-sm cursor-pointer"
                                style={{ ...inputStyle, color: formData.ctfType ? T.cream : T.muted }}
                              >
                                <option value="" disabled style={{ background: T.card }}>Select Style</option>
                                <option value="solo" style={{ background: T.card }}>Solo Mission</option>
                                <option value="team" style={{ background: T.card }}>Team Battle</option>
                              </select>
                              <IconChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: T.muted }} />
                            </div>
                            {errors.ctfType && <p className="text-red-400 text-[10px] mt-1">{errors.ctfType}</p>}
                          </div>

                          {/* Participants */}
                          <div>
                            <Label>Capacity</Label>
                            <div
                              className="flex items-center overflow-hidden"
                              style={{ ...inputStyle, padding: 0 }}
                            >
                              <button
                                type="button"
                                aria-label="Decrease"
                                onClick={() => setFormData(p => ({ ...p, numberOfParticipants: Math.max(1, (parseInt(p.numberOfParticipants) || 0) - 1) }))}
                                className="w-9 h-9 flex items-center justify-center shrink-0 transition-all"
                                style={{ color: T.muted }}
                                onMouseEnter={e => e.currentTarget.style.color = T.cream}
                                onMouseLeave={e => e.currentTarget.style.color = T.muted}
                              >
                                <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2}><line x1="5" y1="12" x2="19" y2="12" /></svg>
                              </button>
                              <div className="w-px h-4 shrink-0" style={{ background: T.border }} />
                              <IconUsers size={13} className="ml-2 shrink-0" style={{ color: T.muted }} />
                              <input
                                type="number"
                                name="numberOfParticipants"
                                placeholder="—"
                                value={formData.numberOfParticipants}
                                onChange={handleChange}
                                onKeyDown={e => ["e","E","+","-"].includes(e.key) && e.preventDefault()}
                                className="w-full px-2 py-2.5 text-sm text-center bg-transparent outline-none placeholder-zinc-700 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                style={{ color: T.cream, fontFamily: "Outfit, sans-serif" }}
                              />
                              <div className="w-px h-4 shrink-0" style={{ background: T.border }} />
                              <button
                                type="button"
                                aria-label="Increase"
                                onClick={() => setFormData(p => ({ ...p, numberOfParticipants: Math.min(9999, (parseInt(p.numberOfParticipants) || 0) + 1) }))}
                                className="w-9 h-9 flex items-center justify-center shrink-0 transition-all"
                                style={{ color: T.muted }}
                                onMouseEnter={e => e.currentTarget.style.color = T.cream}
                                onMouseLeave={e => e.currentTarget.style.color = T.muted}
                              >
                                <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                              </button>
                            </div>
                            {errors.numberOfParticipants && <p className="text-red-400 text-[10px] mt-1">{errors.numberOfParticipants}</p>}
                          </div>
                        </div>
                      </SectionCard>

                      {/* Description */}
                      <div
                        className="flex-1 flex flex-col p-6"
                        style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: "2px" }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <p className="text-[9px] uppercase tracking-[0.25em]" style={{ color: T.muted, fontFamily: "Outfit, sans-serif" }}>
                            Mission Description
                          </p>
                          <span
                            className="text-[9px] uppercase tracking-widest px-2 py-0.5"
                            style={{
                              fontFamily: "Outfit, sans-serif",
                              borderRadius: "2px",
                              border: `1px solid ${descriptionCharCount > 350 ? "rgba(239,68,68,0.4)" : T.border}`,
                              color: descriptionCharCount > 350 ? "#f87171" : T.muted,
                            }}
                          >
                            {descriptionCharCount} / 400
                          </span>
                        </div>
                        <textarea
                          name="eventDescription"
                          placeholder="Describe challenges, rules, and mission objectives..."
                          value={formData.eventDescription}
                          onChange={handleChange}
                          className="flex-1 min-h-[160px] w-full p-3 text-sm resize-none bg-transparent outline-none placeholder-zinc-700"
                          style={{
                            color: T.cream,
                            fontFamily: "Outfit, sans-serif",
                            border: `1px solid ${T.border}`,
                            borderRadius: "2px",
                          }}
                          onFocus={e => e.target.style.borderColor = T.borderHover}
                          onBlur={e => e.target.style.borderColor = T.border}
                        />
                        {errors.eventDescription && <p className="text-red-400 text-[10px] mt-1">{errors.eventDescription}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* ───── Step 2: Summary ───── */}
              {step === 2 && (
                <div>
                  <div className="mb-10">
                    <p className="text-[10px] uppercase tracking-[0.3em] mb-3" style={{ color: T.muted }}>
                      Review · Step 02
                    </p>
                    <h1
                      className="text-6xl sm:text-7xl uppercase leading-none"
                      style={{ fontFamily: "Bebas Neue, sans-serif", color: T.cream, letterSpacing: "-0.03em" }}
                    >
                      Review Your Mission
                    </h1>
                    <div className="w-10 mt-4" style={{ height: "1px", background: T.border }} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
                    {/* Left summary card */}
                    <div
                      className="p-6 flex flex-col gap-4"
                      style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: "2px" }}
                    >
                      {[
                        { label: "Name", value: formData.eventName },
                        { label: "Venue", value: formData.venue },
                        { label: "Type", value: formData.ctfType, capitalize: true },
                      ].map(({ label, value, capitalize }) => (
                        <div key={label}>
                          <p className="text-[9px] uppercase tracking-[0.2em] mb-1" style={{ color: T.muted, fontFamily: "Outfit, sans-serif" }}>{label}</p>
                          <p className="text-sm" style={{ color: T.cream, fontFamily: "Outfit, sans-serif", textTransform: capitalize ? "capitalize" : "none" }}>{value}</p>
                          <div className="mt-3" style={{ height: "1px", background: T.border }} />
                        </div>
                      ))}
                    </div>

                    {/* Right summary card */}
                    <div
                      className="p-6 flex flex-col gap-4"
                      style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: "2px" }}
                    >
                      {[
                        { label: "Starts", value: `${formData.startDate} @ ${formData.startTime}`, mono: true },
                        { label: "Ends", value: `${formData.endDate} @ ${formData.endTime}`, mono: true },
                        { label: "Participants", value: formData.numberOfParticipants },
                      ].map(({ label, value, mono }) => (
                        <div key={label}>
                          <p className="text-[9px] uppercase tracking-[0.2em] mb-1" style={{ color: T.muted, fontFamily: "Outfit, sans-serif" }}>{label}</p>
                          <p className="text-sm" style={{ color: T.cream, fontFamily: mono ? "monospace" : "Outfit, sans-serif" }}>{value}</p>
                          <div className="mt-3" style={{ height: "1px", background: T.border }} />
                        </div>
                      ))}
                    </div>

                    {/* Description */}
                    <div
                      className="md:col-span-2 p-6"
                      style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: "2px" }}
                    >
                      <p className="text-[9px] uppercase tracking-[0.2em] mb-3" style={{ color: T.muted, fontFamily: "Outfit, sans-serif" }}>Description</p>
                      <p className="text-sm leading-relaxed italic" style={{ color: T.muted, fontFamily: "Outfit, sans-serif" }}>"{formData.eventDescription}"</p>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {/* ── Action Buttons ── */}
          <div className="mt-10 flex justify-between items-center">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-[10px] uppercase tracking-widest transition-all"
                style={{ color: T.muted, fontFamily: "Outfit, sans-serif" }}
                onMouseEnter={e => e.currentTarget.style.color = T.cream}
                onMouseLeave={e => e.currentTarget.style.color = T.muted}
              >
                <IconChevronLeft size={13} />
                Back
              </button>
            ) : <div />}

            <button
              onClick={step === progressSteps.length ? handleSubmit : handleNext}
              className="flex items-center gap-2 px-7 py-2.5 text-[10px] uppercase tracking-widest transition-all"
              style={{
                fontFamily: "Outfit, sans-serif",
                background: T.cream,
                color: T.bg,
                borderRadius: "2px",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              {step === progressSteps.length ? "Initiate Hosting" : "Next Phase"}
              <IconChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Confirm Dialog ── */}
      {showConfirmDialog && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 px-4"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-full max-w-sm p-8"
            style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: "2px" }}
          >
            <div className="text-center">
              {/* Icon */}
              <div
                className="w-10 h-10 flex items-center justify-center mx-auto mb-5"
                style={{ border: `1px solid ${T.border}`, borderRadius: "2px" }}
              >
                <IconCheck size={18} style={{ color: T.cream }} />
              </div>

              <h3
                className="text-2xl uppercase mb-2"
                style={{ fontFamily: "Bebas Neue, sans-serif", color: T.cream }}
              >
                Confirm Submission
              </h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: T.muted, fontFamily: "Outfit, sans-serif" }}>
                You'll receive email updates once your event is approved. Ready to submit?
              </p>

              {/* Warning */}
              <div
                className="p-3 mb-6 text-left"
                style={{ border: "1px solid rgba(251,146,60,0.25)", borderRadius: "2px", background: "rgba(251,146,60,0.05)" }}
              >
                <p className="text-xs leading-relaxed" style={{ color: "#fb923c", fontFamily: "Outfit, sans-serif" }}>
                  Please review carefully — details cannot be modified after submission.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 text-[10px] uppercase tracking-widest transition-all disabled:opacity-40"
                  style={{
                    fontFamily: "Outfit, sans-serif",
                    border: `1px solid ${T.border}`,
                    borderRadius: "2px",
                    color: T.muted,
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = T.cream}
                  onMouseLeave={e => e.currentTarget.style.color = T.muted}
                >
                  Cancel
                </button>
                <button
                  onClick={submitFormData}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 text-[10px] uppercase tracking-widest transition-all disabled:opacity-40 flex items-center justify-center"
                  style={{
                    fontFamily: "Outfit, sans-serif",
                    background: T.cream,
                    color: T.bg,
                    borderRadius: "2px",
                  }}
                >
                  {isSubmitting ? (
                    <div className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
                  ) : "Confirm"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default withAuth(HostForm);