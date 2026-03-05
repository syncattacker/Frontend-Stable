"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader2, Link } from "lucide-react";
import photo from "@/img/f2.svg";
import Footer from "@/components/footer/Footer";
import Image from "next/image";
import API from "../../utils/axios";
import { showToast } from "@/utils/toast";

/* ─── Design Tokens (matches Login palette) ─────────────────────────── */
const T = {
  brand: "#a855f7",
  brandDim: "rgba(168, 85, 247, 0.15)",
  brandBorder: "rgba(168, 85, 247, 0.3)",
  bg: "#020205",
  glass: "rgba(8, 8, 12, 0.7)",
  border: "rgba(255, 255, 255, 0.05)",
  muted: "#94a3b8",
};

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null); // "success" | "error" | null
  const [statusMsg, setStatusMsg] = useState("");
  const router = useRouter();

  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleEmailChange = (e) => {
    const v = e.target.value;
    setEmail(v);
    if (v) setIsValid(validateEmail(v));
    else setIsValid(true);
    if (status) { setStatus(null); setStatusMsg(""); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !validateEmail(email)) { setIsValid(false); return; }

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
      const msg = err.response?.data?.message || "An error occurred. Please try again.";
      showToast("error", msg);
      setStatus("error");
      setStatusMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* ── Full-page canvas ─────────────────────────────────── */}
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4 font-outfit relative overflow-hidden"
        style={{ background: T.bg }}
      >
        {/* Ambient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full"
            style={{
              background:
                "radial-gradient(ellipse, rgba(93,63,211,0.18) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          <div
            className="absolute bottom-[-10%] right-[-5%] w-100 h-100 rounded-full"
            style={{
              background:
                "radial-gradient(ellipse, rgba(168,85,247,0.1) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(168,85,247,1) 1px,transparent 1px),linear-gradient(90deg,rgba(168,85,247,1) 1px,transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
          className="relative w-full max-w-[440px] overflow-hidden rounded-[2.5rem] border shadow-2xl"
          style={{ background: T.glass, borderColor: T.brandBorder }}
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-purple-500 to-transparent opacity-60" />

          <div className="p-10 pt-14">
            {/* Logo */}
            <motion.div
              className="flex flex-col items-center mb-10"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Image src={photo} alt="gopwnit" className="h-14 object-contain mb-6" />
              <h1 className="text-4xl font-black tracking-tighter text-white mb-2">
                Forgot Password
              </h1>
              <p className="text-sm text-center" style={{ color: T.muted }}>
                Enter your email and we'll send a reset link.
              </p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email field */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center text-zinc-500 group-focus-within:text-purple-400 transition-colors pointer-events-none">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    id="forgot-email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="your@email.com"
                    disabled={isLoading}
                    className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:bg-white/[0.08] transition-all ${!isValid && email
                        ? "border-red-500/60 bg-red-500/5"
                        : "border-white/5 focus:border-purple-500/50"
                      }`}
                  />
                </div>
                {!isValid && email && (
                  <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1">
                    Please enter a valid email address
                  </p>
                )}
              </div>

              {/* Status banner */}
              <AnimatePresence>
                {status && (
                  <motion.div
                    key={status}
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`flex items-start gap-3 p-4 rounded-2xl border text-sm ${status === "success"
                        ? "bg-green-500/10 border-green-500/25 text-green-400"
                        : "bg-red-500/10 border-red-500/25 text-red-400"
                      }`}
                  >
                    {status === "success" ? (
                      <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                    )}
                    <span>{statusMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading || !email || !isValid}
                className="w-full relative group overflow-hidden rounded-2xl py-4 mt-2 font-black uppercase tracking-widest text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: T.brand }}
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </span>
              </button>
            </form>

            {/* Back to login */}
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => router.push("/?openLogin=true")}
                className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-widest transition-all"
                style={{ color: T.brand }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#c084fc")}
                onMouseLeave={(e) => (e.currentTarget.style.color = T.brand)}
              >
                <ArrowLeft size={14} />
                Back to Login
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </>
  );
};

export default ForgotPassword;
