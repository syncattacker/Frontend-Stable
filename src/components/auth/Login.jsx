"use client";

import { useState } from "react";
import {
  IconChevronRight as ChevronRight,
  IconX as X,
  IconEye as Eye,
  IconEyeOff as EyeOff,
  IconCircleCheck as CheckCircle,
  IconAlertCircle as AlertCircle,
  IconLoader2 as Loader2,
  IconLock as Lock,
  IconUser as User,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/store/authSlice";
import API from "@/utils/axios";
import forge from "node-forge";
import { useRouter } from "next/navigation";

const T = {
  bg: "#0A0A0A",
  surface: "rgba(12, 12, 12, 0.97)",
  cream: "#F0EDE6 ",
  muted: "#888880",
  border: "rgba(255,255,255,0.12)",
  borderFocus: "rgba(232,228,217,0.30)",
  error: "#f87171",
  success: "#86efac",
};

const Notification = ({ notification, onClose }) => {
  if (!notification) return null;

  const config = {
    success: { icon: CheckCircle, color: T.success },
    error: { icon: AlertCircle, color: T.error },
    loading: { icon: Loader2, color: T.muted },
  };
  const { icon: Icon, color } = config[notification.type] ?? config.error;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4"
    >
      <div
        className="flex items-start gap-3.5 px-5 py-4"
        style={{
          background: T.surface,
          border: `1px solid ${T.border}`,
          backdropFilter: "blur(20px)",
          boxShadow: "0 24px 48px rgba(0,0,0,0.6)",
        }}
      >
        <Icon
          size={15}
          strokeWidth={1.5}
          style={{ color, flexShrink: 0, marginTop: 2 }}
          className={notification.type === "loading" ? "animate-spin" : ""}
        />
        <div className="flex-1 min-w-0">
          <p
            className="text-[11px] font-bold tracking-[0.15em] uppercase font-outfit"
            style={{ color: T.cream }}
          >
            {notification.title}
          </p>
          {notification.message && (
            <p
              className="text-[11px] mt-1 leading-relaxed font-outfit"
              style={{ color: T.muted }}
            >
              {notification.message}
            </p>
          )}
        </div>
        {notification.type !== "loading" && (
          <button
            onClick={onClose}
            className="transition-opacity opacity-30 hover:opacity-80 mt-0.5"
            style={{ color: T.cream }}
          >
            <X size={12} strokeWidth={1.5} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

const useNotification = () => {
  const [notification, setNotification] = useState(null);
  const showNotification = (type, title, message, duration = 4000) => {
    setNotification({ type, title, message, duration });
    if (type !== "loading") setTimeout(() => setNotification(null), duration);
  };
  return {
    notification,
    hideNotification: () => setNotification(null),
    showSuccess: (t, m, d) => showNotification("success", t, m, d),
    showError: (t, m, d) => showNotification("error", t, m, d),
    showLoading: (t, m, d) => showNotification("loading", t, m, d),
  };
};

const Field = ({ label, error, children, action }) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <label
        className="text-[10px] font-bold tracking-[0.2em] uppercase font-outfit"
        style={{ color: T.muted }}
      >
        {label}
      </label>
      {action}
    </div>
    {children}
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
          className="text-[11px] tracking-wide font-outfit"
          style={{ color: T.error }}
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

/* ─── Input — zero border-radius, matches Landing style ─────────────── */
const Input = ({ icon: Icon, right, ...props }) => (
  <div className="relative">
    <div
      className="absolute inset-y-0 left-4 flex items-center pointer-events-none"
      style={{ color: T.muted }}
    >
      <Icon size={15} strokeWidth={1.5} />
    </div>
    <input
      {...props}
      className="w-full py-3.5 pl-11 pr-11 text-[13px] font-outfit outline-none transition-all duration-200
    [&:-webkit-autofill]:!bg-transparent
    [&:-webkit-autofill]:![background-color:rgba(255,255,255,0.04)]
    [&:-webkit-autofill]:[transition:background-color_9999s_ease_0s]
    [&:-webkit-autofill]:![-webkit-text-fill-color:#F0EDE6]
    [&:-webkit-autofill:hover]:![background-color:rgba(255,255,255,0.04)]
    [&:-webkit-autofill:focus]:![background-color:rgba(255,255,255,0.04)]"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${T.border}`,
        color: T.cream,
      }}
      onFocus={(e) => {
        e.target.style.background = "rgba(255,255,255,0.04)";
        e.target.style.borderColor = T.borderFocus;
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        e.target.style.background = "rgba(255,255,255,0.02)";
        e.target.style.borderColor = T.border;
        props.onBlur?.(e);
      }}
    />
    {right && (
      <div className="absolute inset-y-0 right-4 flex items-center">
        {right}
      </div>
    )}
  </div>
);

export default function Login({ isOpen, onClose, onSignUpClick }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const {
    notification,
    showSuccess,
    showError,
    showLoading,
    hideNotification,
  } = useNotification();

  const encryptPassword = (password, publicKey) => {
    const rsa = forge.pki.publicKeyFromPem(publicKey);
    const encrypted = rsa.encrypt(password, "RSA-OAEP", {
      md: forge.md.sha256.create(),
    });
    return forge.util.encode64(encrypted);
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!username.trim()) return setUsernameError("Username required");
    if (!password.trim()) return setPasswordError("Password required");

    setIsLoggingIn(true);
    showLoading("Authenticating", "Accessing secure servers...");

    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const res = await API.post(
        `${process.env.NEXT_PUBLIC_AUTH_LOGIN_API}`,
        {
          username,
          encryptedPassword: encryptPassword(
            password,
            process.env.NEXT_PUBLIC_KEY,
          ),
          timezone,
        },
        { withCredentials: true },
      );

      dispatch(loginSuccess({ user: { username }, isAuthenticated: true }));
      hideNotification();
      showSuccess("Success", res.data.message);

      setTimeout(() => {
        onClose();
        router.push("/dashboard/seasons");
        setIsLoggingIn(false);
      }, 1500);
    } catch (error) {
      hideNotification();
      showError("Authentication Failed", error.response?.data?.message);
      setIsLoggingIn(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        {notification && (
          <Notification
            notification={notification}
            onClose={hideNotification}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="fixed inset-0 flex items-center justify-center z-[90] px-4"
        style={{ fontFamily: "'Outfit', sans-serif" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0"
          style={{
            background: "rgba(0,0,0,0.82)",
            backdropFilter: "blur(6px)",
          }}
          onClick={onClose}
        />

        <motion.div
          className="relative w-full max-w-[400px] overflow-hidden"
          style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
            backdropFilter: "blur(40px)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.8)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 flex items-center justify-center w-7 h-7 z-10 transition-all duration-150 hover:bg-white/[0.04]"
            style={{ border: `1px solid ${T.border}`, color: T.muted }}
          >
            <X size={12} strokeWidth={1.5} />
          </button>

          <div className="px-8 pt-10 pb-8">
            <div className="flex items-center gap-3 mb-6">
              <span
                className="text-[10px] font-bold tracking-[0.22em] uppercase font-outfit"
                style={{ color: T.muted }}
              >
                Secure Access
              </span>
              <div className="h-px flex-1" style={{ background: T.border }} />
              <div className="w-7" /> {/* spacer matching close button width */}
            </div>

            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.05,
                duration: 0.26,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <h2
                className="font-black uppercase tracking-tight leading-none mb-2 font-outfit"
                style={{
                  fontSize: "clamp(1.75rem, 4vw, 2.1rem)",
                  color: T.cream,
                }}
              >
                Welcome Back
              </h2>
              <p
                className="text-[13px] leading-relaxed font-outfit"
                style={{ color: T.muted }}
              >
                Sign in to your account to continue.
              </p>
            </motion.div>

            <motion.form
              onSubmit={handleLogin}
              className="flex flex-col gap-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.1,
                duration: 0.28,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* Username */}
              <Field label="Username" error={usernameError}>
                <Input
                  icon={User}
                  type="text"
                  value={username}
                  placeholder="Enter your username"
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setUsernameError("");
                  }}
                />
              </Field>

              {/* Password */}
              <Field
                label="Password"
                error={passwordError}
                action={
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      router.push("/forgot-password");
                    }}
                    className="text-[10px] font-bold tracking-[0.15em] uppercase font-outfit transition-opacity opacity-35 hover:opacity-75 duration-150"
                    style={{ color: T.cream }}
                  >
                    Forgot?
                  </button>
                }
              >
                <Input
                  icon={Lock}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="Enter your password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                  right={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="transition-opacity opacity-30 hover:opacity-70 duration-150"
                      style={{ color: T.cream }}
                    >
                      {showPassword ? (
                        <EyeOff size={13} strokeWidth={1.5} />
                      ) : (
                        <Eye size={13} strokeWidth={1.5} />
                      )}
                    </button>
                  }
                />
              </Field>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3.5 flex items-center justify-center gap-2.5 font-black uppercase tracking-[0.18em] text-[11px] font-outfit transition-all duration-200 group disabled:opacity-40"
                  style={{ background: T.cream, color: T.bg }}
                  onMouseEnter={(e) => {
                    if (!isLoggingIn)
                      e.currentTarget.style.background = "#FFFFFF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = T.cream;
                  }}
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2
                        size={13}
                        strokeWidth={2}
                        className="animate-spin"
                      />
                      Authenticating
                    </>
                  ) : (
                    <>
                      Sign In
                      <ChevronRight
                        size={13}
                        strokeWidth={2.5}
                        className="group-hover:translate-x-0.5 transition-transform duration-150"
                      />
                    </>
                  )}
                </button>
              </div>
            </motion.form>

            <motion.div
              className="mt-7 pt-6 text-center"
              style={{ borderTop: `1px solid ${T.border}` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.18, duration: 0.22 }}
            >
              <p className="text-[12px] font-outfit" style={{ color: T.muted }}>
                Don&apos;t have an account?{" "}
                <button
                  onClick={onSignUpClick}
                  className=" uppercase tracking-[0.12em] text-[10px] transition-opacity opacity-80 hover:opacity-100 duration-150 ml-1 font-outfit"
                  style={{ color: T.cream }}
                >
                  Register
                </button>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
