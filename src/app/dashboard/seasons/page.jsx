"use client";

import React, { useState, useEffect } from "react";
import {
  IconSearch,
  IconAdjustmentsHorizontal,
  IconRadio,
  IconClock,
  IconArchiveOff,
} from "@tabler/icons-react";
import Image from "next/image";
import watermark from "@/img/white.svg";
import SeasonCard from "@/components/season/SeasonCard";
import API from "@/utils/axios";
import BoxLoader from "@/components/loaders/BoxLoader";
import { withAuth } from "@/utils/withAuth";

const T = {
  bg: "#0A0A0A",
  cream: "#fefce8" /* yellow-50 */,
  muted: "#a1a1aa",
  mutedLight: "#a1a1aa",
  border: "rgba(254,252,232,0.2)",
  borderHover: "rgba(254,252,232,0.22)",
};

const FILTER_META = {
  all: { label: "All", Icon: IconAdjustmentsHorizontal },
  live: { label: "Live", Icon: IconRadio },
  upcoming: { label: "Upcoming", Icon: IconClock },
  expired: { label: "Expired", Icon: IconArchiveOff },
};

const SeasonDash = () => {
  const [ctfData, setCtfData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        setLoading(true);
        const response = await API.get("/api/v1/seasons");
        if (response.data?.success && response.data?.season) {
          const transformedData = response.data.season.map((season, index) => {
            const now = new Date();
            const startDate = new Date(season.startDateTime);
            const endDate = new Date(season.endDateTime);
            let status;
            if (now < startDate) status = "upcoming";
            else if (now >= startDate && now <= endDate) status = "live";
            else status = "expired";
            return {
              id: index + 1,
              name: season.name,
              description: season.description,
              bgImage: season.backgroundImage,
              endDate: season.endDateTime,
              startDate: season.startDateTime,
              status,
              slug: season.slug,
              theme: season.theme,
              isRegistrationOpen: season.isRegistrationOpen,
              organizer: season.organizer,
            };
          });
          setCtfData(transformedData);
        } else {
          setCtfData([]);
        }
      } catch (err) {
        console.error("Error fetching seasons:", err);
        setError("Failed to load CTF seasons");
      } finally {
        setLoading(false);
      }
    };
    fetchSeasons();
  }, []);

  const filteredCTFs = ctfData.filter((ctf) => {
    const matchesFilter = filter === "all" || ctf.status === filter;
    const matchesSearch = [
      ctf.name,
      ctf.description,
      ctf.theme,
      ctf.organizer,
    ].some(
      (field) =>
        field && field.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    return matchesFilter && matchesSearch;
  });

  const getFilterCount = (status) =>
    status === "all"
      ? ctfData.length
      : ctfData.filter((c) => c.status === status).length;

  if (loading) {
    return (
      <div
        className="w-full min-h-screen flex items-center justify-center"
        style={{ background: T.bg }}
      >
        <BoxLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="w-full min-h-screen flex items-center justify-center px-4"
        style={{ background: T.bg, fontFamily: "'Outfit', sans-serif" }}
      >
        <div
          className="w-full max-w-sm p-10 flex flex-col items-center text-center"
          style={{ border: `1px solid ${T.border}` }}
        >
          <div
            className="flex items-center justify-center w-12 h-12 mb-6"
            style={{
              border: `1px solid rgba(254,252,232,0.15)`,
              color: T.cream,
            }}
          >
            <IconArchiveOff size={22} strokeWidth={1.5} />
          </div>
          <h2
            className="font-black uppercase tracking-tight text-lg mb-2 font-outfit"
            style={{ color: T.cream }}
          >
            Something Went Wrong
          </h2>
          <p
            className="text-[13px] mb-8 font-outfit leading-relaxed"
            style={{ color: T.muted }}
          >
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3.5 font-black uppercase tracking-[0.18em] text-[11px] font-outfit transition-all duration-200"
            style={{ background: T.cream, color: T.bg }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#FFFFFF";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = T.cream;
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full min-h-screen overflow-x-hidden"
      style={{
        background: T.bg,
        color: T.cream,
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      <div
        className="fixed inset-y-0 left-55 right-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(254,252,232,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(254,252,232,0.025) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />
      <div
        className="fixed inset-y-0 left-55 right-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 0%, transparent 40%, #0A0A0A 100%)",
        }}
      />
      <div
        className="fixed inset-y-0 left-55 right-0 pointer-events-none z-0 flex items-center justify-center"
        aria-hidden
      >
        <Image
          src={watermark}
          alt=""
          fill
          className="object-contain opacity-[0.02]"
          priority
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pb-10">
        <header className="pt-10 sm:pt-10 pb-10 sm:pb-14">
          <h1
            className="font-black uppercase leading-[0.9] mb-6"
            style={{
              fontSize: "clamp(3.5rem, 10vw, 8rem)",
              color: T.cream,
              fontFamily: "'Bebas Neue', sans-serif",
            }}
          >
            CTF
            <br />
            Seasons
          </h1>

          <p
            className="text-[15px] leading-relaxed max-w-md font-outfit"
            style={{ color: T.muted }}
          >
            Master cybersecurity through immersive seasonal challenges.
            Real-world penetration testing, unique themes, global competition.
          </p>
        </header>
        <div
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-12 pb-10"
          style={{ borderBottom: `1px solid ${T.border}` }}
        >
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <div
              className="absolute inset-y-0 left-4 flex items-center pointer-events-none"
              style={{ color: T.muted }}
            >
              <IconSearch size={14} strokeWidth={1.5} />
            </div>
            <input
              type="text"
              placeholder="Search seasons, themes, organizers…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 pl-10 pr-4 text-[13px] font-outfit outline-none transition-all duration-200"
              style={{
                background: "rgba(254,252,232,0.03)",
                border: `1px solid ${T.border}`,
                color: T.cream,
              }}
              onFocus={(e) => {
                e.target.style.borderColor = T.borderHover;
                e.target.style.background = "rgba(254,252,232,0.05)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = T.border;
                e.target.style.background = "rgba(254,252,232,0.03)";
              }}
            />
          </div>

          {/* Filter tabs */}
          <div
            className="flex items-center overflow-x-auto scrollbar-none"
            style={{ gap: "1px", background: T.border }}
          >
            {Object.entries(FILTER_META).map(([key, { label, Icon }]) => {
              const active = filter === key;
              const count = getFilterCount(key);
              return (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className="flex items-center gap-2 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.15em] font-outfit whitespace-nowrap transition-all duration-150 shrink-0"
                  style={{
                    background: active ? T.cream : T.bg,
                    color: active ? T.bg : T.muted,
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = T.cream;
                      e.currentTarget.style.background =
                        "rgba(254,252,232,0.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = T.muted;
                      e.currentTarget.style.background = T.bg;
                    }
                  }}
                >
                  <Icon size={13} strokeWidth={active ? 2 : 1.5} />
                  {label}
                  <span
                    className="text-[12px] font-bold font-roundo tabular-nums"
                    style={{ opacity: active ? 0.8 : 0.75 }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredCTFs.map((ctf) => (
            <SeasonCard key={ctf.slug || ctf.id} ctf={ctf} />
          ))}
        </section>

        {filteredCTFs.length === 0 && (
          <div
            className="flex flex-col items-center text-center pb-12 px-4"
            style={{ borderBottom: `1px solid ${T.border}` }}
          >
            <h3
              className="font-black uppercase tracking-tight font-outfit mb-2"
              style={{ fontSize: "1.2rem", color: T.cream }}
            >
              No Seasons Found
            </h3>
            <p
              className="text-[13px] max-w-[320px] leading-relaxed mb-8 font-outfit"
              style={{ color: T.muted }}
            >
              {searchTerm
                ? `No results for "${searchTerm}". Try a different term.`
                : "Nothing matches this filter. Try another option."}
            </p>
            <button
              onClick={() => {
                setFilter("all");
                setSearchTerm("");
              }}
              className="px-8 py-3.5 font-black uppercase tracking-[0.18em] text-[11px] font-outfit transition-all duration-200"
              style={{ background: T.cream, color: T.bg }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#FFFFFF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = T.cream;
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default withAuth(SeasonDash);
