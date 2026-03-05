"use client";

import { useState } from "react";
import { IconChevronRight as ChevronRight, IconX as X, IconEye as Eye, IconEyeOff as EyeOff, IconCircleCheck as CheckCircle, IconAlertCircle as AlertCircle, IconLoader2 as Loader2, IconLock as Lock, IconUser as User } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/store/authSlice";
import API from "@/utils/axios";
import forge from "node-forge";
import { useRouter } from "next/navigation";

/* ─── Premium Design Tokens ─────────────────────────────────────────── */
const TOKENS = {
  brand: "#a855f7", // Royal Orchid
  brandHover: "#c084fc",
  bgDeep: "#020205",
  glassBg: "rgba(8, 8, 12, 0.7)",
  border: "rgba(255, 255, 255, 0.05)",
  borderFocus: "rgba(168, 85, 247, 0.3)",
  textPrimary: "#FFFFFF",
  textMuted: "#94a3b8",
  error: "#ef4444",
  success: "#22c55e",
};

const GlassNotification = ({ notification, onClose }) => {
  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return <CheckCircle className="text-green-400" size={24} />;
      case "error":
        return <AlertCircle className="text-red-400" size={24} />;
      case "loading":
        return <Loader2 className="text-purple-400 animate-spin" size={24} />;
      default:
        return <AlertCircle className="text-yellow-400" size={24} />;
    }
  };

  const getBorderColor = () => {
    switch (notification.type) {
      case "success":
        return "border-green-500/30";
      case "error":
        return "border-red-500/30";
      case "loading":
        return "border-purple-500/30";
      default:
        return "border-yellow-500/30";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[100] w-full max-w-md px-4"
    >
      <div className={`bg-black/60 backdrop-blur-2xl border ${getBorderColor()} p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-start space-x-4`}>
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="flex-1">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider">{notification.title}</h4>
          {notification.message && <p className="text-zinc-400 text-xs mt-1 leading-relaxed">{notification.message}</p>}
        </div>
        {notification.type !== "loading" && (
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors"><X size={16} /></button>
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

export default function Login({ isOpen, onClose, onSignUpClick }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const { notification, showSuccess, showError, showLoading, hideNotification } = useNotification();

  const encryptPassword = (password, publicKey) => {
    const rsa = forge.pki.publicKeyFromPem(publicKey);
    const encrypted = rsa.encrypt(password, "RSA-OAEP", { md: forge.md.sha256.create() });
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
      await API.post(`${import.meta.env.NEXT_AUTH_LOGIN_API}`, {
        username,
        encryptedPassword: encryptPassword(password, import.meta.env.NEXT_PUBLIC_KEY),
        timezone,
      }, { withCredentials: true });

      dispatch(loginSuccess({ user: { username }, isAuthenticated: true }));
      hideNotification();
      showSuccess("Welcome Back", "Authentication successful.");

      setTimeout(() => {
        onClose();
        router.push("/seasons");
        setIsLoggingIn(false);
      }, 1500);
    } catch (error) {
      hideNotification();
      showError("Access Denied", error.response?.data?.message || "Invalid credentials.");
      setIsLoggingIn(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        {notification && <GlassNotification notification={notification} onClose={hideNotification} />}
      </AnimatePresence>

      <motion.div
        className="fixed inset-0 flex items-center justify-center z-[90] px-4 font-outfit"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

        <motion.div
          className="relative w-full max-w-[440px] overflow-hidden rounded-[2.5rem] border shadow-2xl"
          style={{ background: TOKENS.glassBg, borderColor: TOKENS.borderFocus }}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-8 text-zinc-500 hover:text-white transition-all z-10"
          >
            <X size={24} />
          </button>

          <div className="p-10 pt-14">
            <header className="mb-10">
              <h2 className="text-4xl font-black uppercase tracking-tighter text-white font-outfit mb-2">Login</h2>
              <p className="text-zinc-400 font-medium">Step back into the arena.</p>
            </header>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Username Input */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Username</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center text-zinc-500 group-focus-within:text-purple-400 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setUsernameError(""); }}
                    placeholder="Enter username"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.08] transition-all"
                  />
                </div>
                {usernameError && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1">{usernameError}</p>}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Password</label>
                  <button
                    type="button"
                    onClick={() => { onClose(); router.push("/forgot-password"); }}
                    className="text-[10px] font-black uppercase tracking-wider text-purple-400 hover:text-purple-300 transition-all"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center text-zinc-500 group-focus-within:text-purple-400 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setPasswordError(""); }}
                    placeholder="Enter password"
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.08] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-4 flex items-center text-zinc-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordError && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1">{passwordError}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full relative group overflow-hidden rounded-2xl py-4 mt-4 font-black uppercase tracking-widest text-white transition-all disabled:opacity-50"
                style={{ background: TOKENS.brand }}
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Authenticating
                    </>
                  ) : (
                    <>
                      Login <ChevronRight size={18} />
                    </>
                  )}
                </span>
              </button>
            </form>

            <footer className="mt-10 text-center">
              <p className="text-zinc-500 text-sm font-medium">
                Don't have an account?{" "}
                <button
                  onClick={onSignUpClick}
                  className="text-purple-400 font-black hover:text-purple-300 transition-all ml-1 uppercase text-xs"
                >
                  Create One
                </button>
              </p>
            </footer>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
