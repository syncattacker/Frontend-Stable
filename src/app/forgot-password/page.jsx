"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconCircleCheck as CheckCircle,
  IconAlertCircle as AlertCircle,
  IconLoader2 as Loader2,
  IconArrowRight as ArrowRight,
} from "@tabler/icons-react";
import photo from "@/img/purple.svg";
import Footer from "@/components/footer/Footer";
import Image from "next/image";
import API from "../../utils/axios";
import { showToast } from "@/utils/toast.jsx";

const T = {
  bg: "#111113",
  cream: "#F0EDE6",
  muted: "#666662",
  mutedLight: "#888884",
  border: "rgba(255,255,255,0.10)",
  borderFocus: "rgba(240,237,230,0.50)",
  error: "#f87171",
  success: "#86efac",
};

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");
  const router = useRouter();

  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleEmailChange = (e) => {
    const v = e.target.value;
    setEmail(v);
    if (v) setIsValid(validateEmail(v));
    else setIsValid(true);
    if (status) {
      setStatus(null);
      setStatusMsg("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !validateEmail(email)) {
      setIsValid(false);
      return;
    }
    setIsLoading(true);
    setStatus(null);
    try {
      const res = await API.post("/auth/forgot-password", { email });
      const msg = res.data.message || "Password reset link sent successfully!";
      showToast("success", msg);
      setStatus("success");
      setStatusMsg(msg);
      setEmail("");
    } catch (err) {
      const msg =
        err.response?.data?.message || "An error occurred. Please try again.";
      showToast("error", msg);
      setStatus("error");
      setStatusMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
        style={{ background: T.bg, fontFamily: "'Outfit', sans-serif" }}
      >
        {/* Minimal grid bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 35%, #111113 100%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-[420px] flex flex-col overflow-hidden"
          style={{
            background: T.bg,
            border: `1px solid ${T.border}`,
            boxShadow: "0 40px 80px rgba(0,0,0,0.9)",
          }}
        >
          {/* ── Breadcrumb row ─────────────────────────────────────── */}
          <div
            className="flex items-center gap-3 px-7 py-4"
            style={{ borderBottom: `1px solid ${T.border}` }}
          >
            <div className="h-px w-6" style={{ background: T.border }} />
            <span
              className="text-[10px] font-bold tracking-[0.28em] uppercase font-outfit"
              style={{ color: T.muted }}
            >
              Gopwnit / Auth
            </span>
            <div className="h-px flex-1" style={{ background: T.border }} />
          </div>

          <div className="px-7 pt-8 pb-7">
            {/* ── Display heading ──────────────────────────────────── */}
            <motion.div
              className="mb-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.05,
                duration: 0.26,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <h1
                className="font-black uppercase leading-[0.88] font-outfit mb-3"
                style={{
                  fontSize: "clamp(2.6rem, 10vw, 3.4rem)",
                  color: T.cream,
                  fontFamily: "'Bebas Neue', sans-serif"
                }}
              >
                Forgot Password
              </h1>
              <p
                className="text-[11px] font-bold tracking-[0.22em] uppercase font-outfit"
                style={{ color: T.muted }}
              >
                Reset link sent to your inbox
              </p>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              className="flex flex-col gap-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.1,
                duration: 0.28,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* Email — underline style */}
              <div className="flex flex-col gap-3">
                <label
                  className="text-[11px] font-bold tracking-[0.22em] uppercase font-outfit"
                  style={{ color: T.muted }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  disabled={isLoading}
                  placeholder="your@email.com"
                  className="w-full bg-transparent py-3 px-1 text-[15px] font-outfit outline-none transition-all duration-200"
                  style={{
                    color: T.cream,
                    borderBottom: `1px solid ${!isValid && email ? T.error : T.border}`,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderBottomColor =
                      !isValid && email ? T.error : T.borderFocus;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderBottomColor =
                      !isValid && email ? T.error : T.border;
                  }}
                />
                <AnimatePresence>
                  {!isValid && email && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="text-[11px] font-outfit -mt-1"
                      style={{ color: T.error }}
                    >
                      Please enter a valid email address
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Status banner */}
              <AnimatePresence>
                {status && (
                  <motion.div
                    key={status}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-start gap-3 p-4 -mt-2"
                    style={{
                      border: `1px solid ${status === "success" ? "rgba(134,239,172,0.2)" : "rgba(248,113,113,0.2)"}`,
                      background:
                        status === "success"
                          ? "rgba(134,239,172,0.04)"
                          : "rgba(248,113,113,0.04)",
                    }}
                  >
                    {status === "success" ? (
                      <CheckCircle
                        size={14}
                        strokeWidth={1.5}
                        style={{
                          color: T.success,
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      />
                    ) : (
                      <AlertCircle
                        size={14}
                        strokeWidth={1.5}
                        style={{ color: T.error, flexShrink: 0, marginTop: 1 }}
                      />
                    )}
                    <span
                      className="text-[12px] leading-relaxed font-outfit"
                      style={{
                        color: status === "success" ? T.success : T.error,
                      }}
                    >
                      {statusMsg}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={isLoading || !email || !isValid}
                className="w-full py-4 flex items-center justify-center gap-3 font-black uppercase tracking-[0.18em] text-[12px] font-outfit transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed group"
                style={{ background: T.cream, color: T.bg }}
                onMouseEnter={(e) => {
                  if (!isLoading && email && isValid)
                    e.currentTarget.style.background = "#FFFFFF";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = T.cream;
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2
                      size={14}
                      strokeWidth={2}
                      className="animate-spin"
                    />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight
                      size={14}
                      strokeWidth={2}
                      className="group-hover:translate-x-0.5 transition-transform duration-150"
                    />
                  </>
                )}
              </button>
            </motion.form>
          </div>

          {/* ── Bottom links row — matches screenshot ────────────────── */}
          <div
            className="flex items-center justify-center gap-4 px-7 py-4"
            style={{ borderTop: `1px solid ${T.border}` }}
          >
            <button
              type="button"
              onClick={() => router.push("/?openLogin=true")}
              className="text-[12px] font-outfit transition-opacity opacity-40 hover:opacity-90 duration-150"
              style={{ color: T.cream }}
            >
              Sign In
            </button>
            <span style={{ color: T.border }}>·</span>
            <button
              type="button"
              onClick={() => router.push("/support")}
              className="text-[12px] font-outfit transition-opacity opacity-40 hover:opacity-90 duration-150"
              style={{ color: T.cream }}
            >
              Support
            </button>
          </div>
        </motion.div>
      </div>

      <Footer />
    </>
  );
};

export default ForgotPassword;
