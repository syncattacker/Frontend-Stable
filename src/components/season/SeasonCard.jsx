"use client";

import React from "react";
import {
  IconUser,
  IconArrowRight,
  IconCalendar,
  IconFlame,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";

const T = {
  bg:          "#0A0A0A",
  surface:     "#0f0f0f",
  cream:       "#fefce8",
  muted:       "#c4c4c0",
  mutedDim:    "#a1a1aa",
  border:      "rgba(254,252,232,0.13)",
  borderHover: "rgba(254,252,232,0.28)",
};

const SeasonCard = ({ ctf }) => {
  const router = useRouter();

  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  };

  const getStartDate = () => ctf.startDateTime || ctf.startDate;
  const getEndDate   = () => ctf.endDateTime   || ctf.endDate;

  const truncateDescription = (text) => {
    if (!text) return "";
    const words = text.trim().split(/\s+/);
    return words.length <= 15 ? text : words.slice(0, 15).join(" ") + "...";
  };

  const getButtonConfig = () => {
    if (ctf.status === "expired")  return { text: "View Results",         variant: "secondary", disabled: false };
    if (ctf.status === "upcoming") return ctf.isRegistrationOpen
      ? { text: "Register Now",        variant: "primary",   disabled: false }
      : { text: "Registration Closed", variant: "disabled",  disabled: true  };
    if (ctf.status === "live")     return ctf.isRegistrationOpen
      ? { text: "Join Challenge",  variant: "primary",   disabled: false }
      : { text: "Explore Season",  variant: "secondary", disabled: false };
    return { text: "View Details", variant: "secondary", disabled: false };
  };

  const buttonConfig = getButtonConfig();
  const isLive       = ctf.status === "live";
  const isUpcoming   = ctf.status === "upcoming";

  return (
    <div
      className="relative group flex flex-col overflow-hidden transition-all duration-300"
      style={{
        background: T.surface,
        border:     `1px solid ${T.border}`,
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHover; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; }}
    >
      {ctf.bgImage && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700 opacity-[0.07] group-hover:opacity-[0.13]"
          style={{ backgroundImage: `url(${ctf.bgImage})` }}
        />
      )}

      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(160deg, rgba(15,15,15,0.6) 0%, rgba(15,15,15,0.97) 100%)" }}
      />

      <div
        className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300"
        style={{
          background: isLive
            ? `linear-gradient(90deg, transparent, ${T.cream}, transparent)`
            : `linear-gradient(90deg, transparent, rgba(254,252,232,0.15), transparent)`,
          opacity: isLive ? 0.7 : 0.4,
        }}
      />

      <div
        className="relative z-10 flex items-center justify-between px-5 py-3"
        style={{ borderBottom: `1px solid ${T.border}` }}
      >
        {/* Status */}
        <div className="flex items-center gap-2">
          {isLive && (
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: T.cream }} />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: T.cream }} />
            </span>
          )}
          {isLive && (
            <IconFlame size={11} strokeWidth={1.5} style={{ color: T.cream }} />
          )}
          <span
            className="text-[9px] font-black uppercase tracking-[0.22em] font-outfit"
            style={{ color: isLive ? T.cream : T.mutedDim }}
          >
            {ctf.status}
          </span>
        </div>

        <div className="flex items-center gap-1.5" style={{ color: T.mutedDim }}>
          <IconUser size={10} strokeWidth={1.5} />
          <span className="text-[10px] font-outfit tracking-wide">{ctf.organizer || "Unknown"}</span>
        </div>
      </div>

      <div className="relative z-10 flex flex-col flex-1 px-5 py-4 gap-3">
        <div>
          <h3
            className="font-black uppercase tracking-tight leading-tight font-outfit mb-1"
            style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)", color: T.cream }}
          >
            {ctf.name}
          </h3>
          {ctf.theme && (
            <p
              className="text-[10px] font-bold uppercase tracking-[0.18em] font-outfit"
              style={{ color: T.mutedDim }}
            >
              {ctf.theme}
            </p>
          )}
        </div>
        <p
          className="text-[12px] leading-relaxed font-outfit flex-1"
          style={{ color: T.muted }}
        >
          {truncateDescription(ctf.description)}
        </p>

        {ctf.status !== "expired" && (
          <div>
            <span
              className="text-[9px] font-black uppercase tracking-[0.18em] font-outfit px-2.5 py-1"
              style={{
                border:     `1px solid ${ctf.isRegistrationOpen ? "rgba(254,252,232,0.18)" : T.border}`,
                color:       ctf.isRegistrationOpen ? T.cream : T.mutedDim,
                background:  ctf.isRegistrationOpen ? "rgba(254,252,232,0.04)" : "transparent",
              }}
            >
              {ctf.isRegistrationOpen ? "Registration Open" : "Registration Closed"}
            </span>
          </div>
        )}

        {buttonConfig.variant === "primary" && (
          <button
            disabled={buttonConfig.disabled}
            onClick={() => { if (!buttonConfig.disabled) router.push(`/dashboard/seasons/${ctf.slug}`); }}
            className="w-full py-3 flex items-center justify-center gap-2 font-black uppercase tracking-[0.15em] text-[10px] font-outfit transition-all duration-200 group/btn"
            style={{ background: T.cream, color: T.bg }}
            onMouseEnter={e => { e.currentTarget.style.background = "#FFFFFF"; }}
            onMouseLeave={e => { e.currentTarget.style.background = T.cream; }}
          >
            {buttonConfig.text}
            <IconArrowRight size={12} strokeWidth={2.5} className="group-hover/btn:translate-x-0.5 transition-transform duration-150" />
          </button>
        )}

        {buttonConfig.variant === "secondary" && (
          <button
            disabled={buttonConfig.disabled}
            onClick={() => { if (!buttonConfig.disabled) router.push(`/dashboard/seasons/${ctf.slug}`); }}
            className="w-full py-3 flex items-center justify-center gap-2 font-black uppercase tracking-[0.15em] text-[10px] font-outfit transition-all duration-200 group/btn"
            style={{ background: "transparent", border: `1px solid ${T.border}`, color: T.muted }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.color = T.cream; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border;      e.currentTarget.style.color = T.muted; }}
          >
            {buttonConfig.text}
            <IconArrowRight size={12} strokeWidth={2.5} className="group-hover/btn:translate-x-0.5 transition-transform duration-150" />
          </button>
        )}

        {buttonConfig.variant === "disabled" && (
          <button
            disabled
            className="w-full py-3 flex items-center justify-center font-black uppercase tracking-[0.15em] text-[10px] font-outfit cursor-not-allowed opacity-25"
            style={{ border: `1px solid ${T.border}`, color: T.mutedDim }}
          >
            {buttonConfig.text}
          </button>
        )}

      </div>

      <div
        className="relative z-10 flex items-center justify-between px-5 py-3"
        style={{ borderTop: `1px solid ${T.border}` }}
      >
        <div className="flex items-center gap-1.5">
          <IconCalendar size={10} strokeWidth={1.5} style={{ color: T.mutedDim }} />
          <span className="text-[10px] font-outfit" style={{ color: T.mutedDim }}>
            <span className="uppercase tracking-[0.15em] mr-1 text-[9px] opacity-60">Starts</span>
            {formatDate(getStartDate())}
          </span>
        </div>
        <div className="w-px h-3" style={{ background: T.border }} />
        <div className="flex items-center gap-1.5">
          <IconCalendar size={10} strokeWidth={1.5} style={{ color: T.mutedDim }} />
          <span className="text-[10px] font-outfit" style={{ color: T.mutedDim }}>
            <span className="uppercase tracking-[0.15em] mr-1 text-[9px] opacity-60">Ends</span>
            {formatDate(getEndDate())}
          </span>
        </div>
      </div>

    </div>
  );
};

export default SeasonCard;