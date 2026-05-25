import React from "react";

const EnergyBadge = ({ status, className = "", label }) => {
  const config = {
    live: {
      text: label || "Live",
      color: "text-[#3fb950]",
      bg: "bg-[#3fb950]/10",
      border: "border-[#3fb950]/35",
      dot: "bg-[#3fb950]",
      pulse: true,
    },
    upcoming: {
      text: label || "Upcoming",
      color: "text-[#a890fe]",
      bg: "bg-[#5d3fd3]/15",
      border: "border-[#7c52ff]/30",
      dot: "bg-[#7c52ff]",
      pulse: false,
    },
    expired: {
      text: label || "Expired",
      color: "text-zinc-400",
      bg: "bg-zinc-700/20",
      border: "border-zinc-600/30",
      dot: "bg-zinc-500",
      pulse: false,
    },
    open: {
      text: label || "Open",
      color: "text-[#a890fe]",
      bg: "bg-[#3f2b96]/20",
      border: "border-[#7c52ff]/30",
      dot: "bg-[#7c52ff]",
      pulse: false,
    },
    closed: {
      text: label || "Closed",
      color: "text-zinc-400",
      bg: "bg-zinc-800/40",
      border: "border-zinc-700/30",
      dot: "bg-zinc-600",
      pulse: false,
    },
  };

  const cfg = config[status?.toLowerCase()] || {
    text: label || String(status || ""),
    color: "text-zinc-400",
    bg: "bg-zinc-700/20",
    border: "border-zinc-600/30",
    dot: "bg-zinc-500",
    pulse: false,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider border backdrop-blur-sm ${cfg.color} ${cfg.bg} ${cfg.border} ${className}`}
    >
      <span className="relative flex items-center justify-center w-1.5 h-1.5">
        <span className={`relative z-10 w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
        {cfg.pulse && (
          <>
            <span
              className={`absolute w-4 h-4 rounded-full ${cfg.dot} opacity-20`}
              style={{
                animation: "pulseDot 2s cubic-bezier(0.4,0,0.6,1) infinite",
              }}
            />
            <span
              className={`absolute w-3 h-3 rounded-full ${cfg.dot} opacity-30`}
              style={{
                animation:
                  "pulseDot 2s cubic-bezier(0.4,0,0.6,1) 0.5s infinite",
              }}
            />
          </>
        )}
      </span>
      {cfg.text}
    </span>
  );
};

export default EnergyBadge;