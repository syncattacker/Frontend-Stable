"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconEye,
  IconEyeOff,
  IconCircleCheck,
  IconAlertTriangle,
  IconLoader2,
  IconAlertCircle,
  IconArrowRight,
  IconLock,
  IconShieldCheck,
} from "@tabler/icons-react";
import Image from "next/image";
import photo from "@/img/purple.svg";
import Footer from "@/components/footer/Footer";
import API from "@/utils/axios";
import { showToast } from "@/utils/Toast";

const T = {
  bg:          "#111113",
  cream:       "#F0EDE6",
  muted:       "#666662",
  mutedLight:  "#888884",
  border:      "rgba(255,255,255,0.10)",
  borderFocus: "rgba(240,237,230,0.50)",
  error:       "#f87171",
  success:     "#86efac",
};

/* ─── Password strength helpers (LOGIC UNCHANGED) ───────────────────── */
const getStrength = (pw) => {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[a-z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
};

const strengthMeta = [
  { label: "Enter password", color: "transparent"  },
  { label: "Very weak",      color: "#ef4444"       },
  { label: "Weak",           color: "#f97316"       },
  { label: "Fair",           color: "#eab308"       },
  { label: "Strong",         color: T.success       },
  { label: "Very strong",    color: T.cream         },
];

/* ─── Shared grid background ─────────────────────────────────────────── */
const GridBg = () => (
  <>
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
        backgroundSize: "72px 72px",
      }}
    />
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 35%, #111113 100%)" }}
    />
  </>
);

/* ─── Underline Input ────────────────────────────────────────────────── */
const UnderlineInput = ({ label, error, right, ...props }) => (
  <div className="flex flex-col gap-3">
    <label className="text-[11px] font-bold tracking-[0.22em] uppercase font-outfit" style={{ color: T.muted }}>
      {label}
    </label>
    <div className="relative">
      <input
        {...props}
        className="w-full bg-transparent py-3 px-1 pr-8 text-[15px] font-outfit outline-none transition-all duration-200"
        style={{ color: T.cream, borderBottom: `1px solid ${T.border}` }}
        onFocus={e  => { e.target.style.borderBottomColor = T.borderFocus; props.onFocus?.(e); }}
        onBlur={e   => { e.target.style.borderBottomColor = T.border;      props.onBlur?.(e);  }}
      />
      {right && <div className="absolute bottom-2.5 right-0">{right}</div>}
    </div>
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="text-[11px] font-outfit -mt-1" style={{ color: T.error }}
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

/* ─── Card shell — shared between all screens ───────────────────────── */
const Card = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    className="relative w-full max-w-[420px] flex flex-col overflow-hidden"
    style={{ background: T.bg, border: `1px solid ${T.border}`, boxShadow: "0 40px 80px rgba(0,0,0,0.9)" }}
  >
    {/* Breadcrumb row */}
    <div className="flex items-center gap-3 px-7 py-4" style={{ borderBottom: `1px solid ${T.border}` }}>
      <div className="h-px w-6" style={{ background: T.border }} />
      <span className="text-[10px] font-bold tracking-[0.28em] uppercase font-outfit" style={{ color: T.muted }}>
        Gopwnit / Auth
      </span>
      <div className="h-px flex-1" style={{ background: T.border }} />
    </div>
    {children}
  </motion.div>
);

/* ─── Page shell ─────────────────────────────────────────────────────── */
const Page = ({ children }) => (
  <>
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{ background: T.bg, fontFamily: "'Outfit', sans-serif" }}
    >
      <GridBg />
      {children}
    </div>
    <Footer />
  </>
);

/* ─── Success Screen ─────────────────────────────────────────────────── */
const SuccessScreen = ({ message }) => (
  <Page>
    <Card>
      <div className="px-7 pt-8 pb-7 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center w-14 h-14 mb-8"
          style={{ border: `1px solid rgba(134,239,172,0.3)`, color: T.success }}
        >
          <IconCircleCheck size={28} strokeWidth={1.5} />
        </motion.div>
        <h2
          className="font-black uppercase tracking-tight leading-none font-outfit mb-3"
          style={{ fontSize: "clamp(2rem, 8vw, 2.6rem)", color: T.cream }}
        >
          All Done!
        </h2>
        <p className="text-[13px] font-outfit leading-relaxed mb-2" style={{ color: T.muted }}>{message}</p>
        <p className="text-[11px] font-outfit tracking-[0.1em] uppercase mt-4" style={{ color: T.muted, opacity: 0.4 }}>
          Redirecting to login...
        </p>
      </div>
      <div className="flex items-center justify-center px-7 py-4" style={{ borderTop: `1px solid ${T.border}` }}>
        <p className="text-[12px] font-outfit" style={{ color: T.muted, opacity: 0.5 }}>gopwnit.com</p>
      </div>
    </Card>
  </Page>
);

/* ─── Error Screen ───────────────────────────────────────────────────── */
const ErrorScreen = ({ message, onRetry }) => (
  <Page>
    <Card>
      <div className="px-7 pt-8 pb-7 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center w-14 h-14 mb-8"
          style={{ border: `1px solid rgba(248,113,113,0.3)`, color: T.error }}
        >
          <IconAlertTriangle size={28} strokeWidth={1.5} />
        </motion.div>
        <h2
          className="font-black uppercase leading-none mb-3"
          style={{ fontSize: "clamp(2rem, 8vw, 2.6rem)", color: T.cream, fontFamily: "'Bebas Neue', sans-serif" }}
        >
          Reset Failed
        </h2>
        <p className="text-[13px] font-outfit leading-relaxed mb-8" style={{ color: T.muted }}>{message}</p>
        <button
          onClick={onRetry}
          className="w-full py-4 font-black uppercase tracking-[0.18em] text-[12px] font-outfit transition-all duration-200 group"
          style={{ background: "transparent", border: `1px solid ${T.border}`, color: T.muted, fontFamily: "'Bebas Neue', sans-serif" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderFocus; e.currentTarget.style.color = T.cream; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = T.border;      e.currentTarget.style.color = T.muted; }}
        >
          Request New Link
        </button>
      </div>
      <div className="flex items-center justify-center gap-4 px-7 py-4" style={{ borderTop: `1px solid ${T.border}` }}>
        <p className="text-[12px] font-outfit opacity-40" style={{ color: T.cream }}>gopwnit.com</p>
      </div>
    </Card>
  </Page>
);

/* ─── Main Component ─────────────────────────────────────────────────── */
export default function ResetPassword() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const [token,               setToken]               = useState("");
  const [password,            setPassword]            = useState("");
  const [confirmPassword,     setConfirmPassword]     = useState("");
  const [showPassword,        setShowPassword]        = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError,       setPasswordError]       = useState("");
  const [confirmPasswordError,setConfirmPasswordError]= useState("");
  const [isLoading,           setIsLoading]           = useState(false);
  const [resetStatus,         setResetStatus]         = useState(null);
  const [message,             setMessage]             = useState("");

  const strength = getStrength(password);
  const meta     = strengthMeta[strength];

  /* ── ALL LOGIC UNCHANGED ─────────────────────────────────────────── */
  useEffect(() => {
    const t = searchParams.get("reset-token");
    if (t) { setToken(t); }
    else   { setResetStatus("error"); setMessage("Invalid or missing reset token"); }
  }, [searchParams]);

  const validatePassword = () => {
    if (!password.trim())               { setPasswordError("Password is required");            return false; }
    if (password.length < 8)            { setPasswordError("Must be at least 8 characters");   return false; }
    if (!/[A-Z]/.test(password))        { setPasswordError("Must include an uppercase letter"); return false; }
    if (!/[a-z]/.test(password))        { setPasswordError("Must include a lowercase letter"); return false; }
    if (!/[0-9]/.test(password))        { setPasswordError("Must include a number");           return false; }
    if (!/[^A-Za-z0-9]/.test(password)) { setPasswordError("Must include a special character");return false; }
    setPasswordError(""); return true;
  };

  const validateConfirmPassword = () => {
    if (!confirmPassword.trim())      { setConfirmPasswordError("Please confirm your password"); return false; }
    if (password !== confirmPassword) { setConfirmPasswordError("Passwords do not match");       return false; }
    setConfirmPasswordError(""); return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword() | !validateConfirmPassword()) return;
    setIsLoading(true);
    try {
      const res = await API.post("/auth/reset-password", { token, password, confirmPassword });
      const msg = res.data.message || "Password reset successfully!";
      showToast("success", msg);
      setResetStatus("success");
      setMessage(msg);
      setTimeout(() => router.push("/"), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong.";
      showToast("error", msg);
      setResetStatus("error");
      setMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled     = isLoading || !password || !confirmPassword || strength < 5;
  const passwordsMatch = !confirmPasswordError && confirmPassword && password === confirmPassword;

  if (resetStatus === "success") return <SuccessScreen message={message} />;
  if (resetStatus === "error")   return <ErrorScreen message={message} onRetry={() => router.push("/forgot-password")} />;

  return (
    <Page>
      <Card>
        <div className="px-7 pt-8 pb-7">

          {/* ── Display heading ──────────────────────────────────── */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1
              className="font-black uppercase leading-[0.88] tracking-[-0.03em] font-outfit mb-3"
              style={{ fontSize: "clamp(2.4rem, 9vw, 3.2rem)", color: T.cream }}
            >
              Reset Password
            </h1>
            <p className="text-[11px] font-bold tracking-[0.22em] uppercase font-outfit" style={{ color: T.muted }}>
              Create a strong new password
            </p>
          </motion.div>

          {/* ── Form ─────────────────────────────────────────────── */}
          <motion.form
            onSubmit={handleSubmit}
            className="flex flex-col gap-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* New Password */}
            <div className="flex flex-col gap-3">
              <UnderlineInput
                label="New Password"
                error={passwordError}
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="••••••••••••"
                onChange={e => { setPassword(e.target.value); setPasswordError(""); }}
                onBlur={validatePassword}
                right={
                  <button type="button" onClick={() => setShowPassword(v => !v)}
                    className="transition-opacity opacity-30 hover:opacity-80" style={{ color: T.cream }}>
                    {showPassword ? <IconEye size={15} strokeWidth={1.5} /> : <IconEyeOff size={15} strokeWidth={1.5} />}
                  </button>
                }
              />

              {/* Strength meter */}
              <AnimatePresence>
                {password && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-1.5"
                  >
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(lvl => (
                        <div
                          key={lvl}
                          className="h-px flex-1 transition-all duration-500"
                          style={{ background: lvl <= strength ? meta.color : T.border }}
                        />
                      ))}
                    </div>
                    <p
                      className="text-[10px] font-bold uppercase tracking-[0.18em] font-outfit text-right"
                      style={{ color: strength > 0 ? meta.color : T.muted }}
                    >
                      {meta.label}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <UnderlineInput
                label="Confirm Password"
                error={confirmPasswordError}
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                placeholder="••••••••••••"
                onChange={e => { setConfirmPassword(e.target.value); setConfirmPasswordError(""); }}
                onBlur={validateConfirmPassword}
                right={
                  <button type="button" onClick={() => setShowConfirmPassword(v => !v)}
                    className="transition-opacity opacity-30 hover:opacity-80" style={{ color: T.cream }}>
                    {showConfirmPassword ? <IconEye size={15} strokeWidth={1.5} /> : <IconEyeOff size={15} strokeWidth={1.5} />}
                  </button>
                }
              />
              <AnimatePresence mode="wait">
                {passwordsMatch && (
                  <motion.p
                    key="ok"
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-[11px] font-outfit flex items-center gap-1.5"
                    style={{ color: T.success }}
                  >
                    <IconCircleCheck size={12} strokeWidth={2} />
                    Passwords match
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isDisabled}
              className="w-full py-4 flex items-center justify-center gap-3 font-black uppercase tracking-[0.18em] text-[12px] font-outfit transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed group"
              style={{ background: T.cream, color: T.bg }}
              onMouseEnter={e => { if (!isDisabled) e.currentTarget.style.background = "#FFFFFF"; }}
              onMouseLeave={e => { e.currentTarget.style.background = T.cream; }}
            >
              {isLoading ? (
                <><IconLoader2 size={14} strokeWidth={2} className="animate-spin" /> Resetting...</>
              ) : (
                <>Reset Password <IconArrowRight size={14} strokeWidth={2} className="group-hover:translate-x-0.5 transition-transform duration-150" /></>
              )}
            </button>
          </motion.form>

        </div>

        {/* ── Bottom links ─────────────────────────────────────────── */}
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

      </Card>
    </Page>
  );
}