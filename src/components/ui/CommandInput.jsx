"use client";

import { useState, useRef } from "react";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CommandInput = ({
  value,
  onChange,
  placeholder = "Search challenges...",
  className = "",
}) => {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  return (
    <div className={`relative w-full ${className}`}>
      <AnimatePresence>
        {focused && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.35) 100%)",
            }}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="absolute -inset-1 rounded-2xl pointer-events-none"
        animate={
          focused
            ? {
                boxShadow:
                  "0 0 0 1px rgba(163,255,18,0.35), 0 0 40px rgba(163,255,18,0.12)",
                opacity: 1,
              }
            : {
                boxShadow: "0 0 0 1px rgba(255,255,255,0.05)",
                opacity: 1,
              }
        }
        transition={{ duration: 0.22 }}
      />

      <div className="relative z-10">
        <motion.div
          className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
          animate={focused ? { color: "#A3FF12" } : { color: "#6b7280" }}
          transition={{ duration: 0.2 }}
        >
          <Search size={17} />
        </motion.div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-label="Search challenges"
          className="w-full pl-11 pr-5 py-3.5 bg-[rgba(255,255,255,0.03)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] rounded-xl text-sm text-white placeholder:text-zinc-500 outline-none transition-none font-[inherit]"
          style={{ caretColor: "#A3FF12" }}
        />
      </div>
    </div>
  );
};

export default CommandInput;