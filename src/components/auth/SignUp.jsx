"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  IconCheck as Check,
  IconChevronRight as ChevronRight,
  IconChevronLeft as ChevronLeft,
  IconAlertTriangle as AlertTriangle,
  IconMail as Mail,
  IconLock as Lock,
  IconUser as User,
  IconCircleCheck as CheckCircle,
  IconEye as Eye,
  IconEyeOff as EyeOff,
  IconX as X,
} from "@tabler/icons-react";
import Select from "react-select";
import countryList from "react-select-country-list";
import forge from "node-forge";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "./Loader";
import API from "@/utils/axios";

const T = {
  bg: "#0A0A0A",
  surface: "rgba(12, 12, 12, 0.97)",
  cream: "#F0EDE6",
  muted: "#888880",
  border: "rgba(255,255,255,0.12)",
  borderFocus: "rgba(232,228,217,0.30)",
  error: "#f87171",
  success: "#86efac",
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
          className="text-[11px] tracking-wide font-outfit flex items-center gap-1"
          style={{ color: T.error }}
        >
          <AlertTriangle size={11} strokeWidth={1.5} className="shrink-0" />
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

const Input = ({ icon: Icon, right, ...props }) => (
  <div className="relative">
    {Icon && (
      <div
        className="absolute inset-y-0 left-4 flex items-center pointer-events-none"
        style={{ color: T.muted }}
      >
        <Icon size={15} strokeWidth={1.5} />
      </div>
    )}
    <input
      {...props}
      className={`w-full py-3.5 text-[13px] font-outfit outline-none transition-all duration-200
        [&:-webkit-autofill]:!bg-transparent
        [&:-webkit-autofill]:![background-color:rgba(255,255,255,0.04)]
        [&:-webkit-autofill]:[transition:background-color_9999s_ease_0s]
        [&:-webkit-autofill]:![-webkit-text-fill-color:#F0EDE6]
        [&:-webkit-autofill:hover]:![background-color:rgba(255,255,255,0.04)]
        [&:-webkit-autofill:focus]:![background-color:rgba(255,255,255,0.04)]
        ${Icon ? "pl-11" : "pl-4"} ${right ? "pr-11" : "pr-4"}`}
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

const STEPS = [
  { s: 1, icon: Mail, label: "Email" },
  { s: 2, icon: Lock, label: "Password" },
  { s: 3, icon: User, label: "Profile" },
  { s: 4, icon: CheckCircle, label: "Verify" },
  { s: 5, icon: CheckCircle, label: "Complete", isStatus: true },
];

const slideVariants = {
  enter: (d) => ({ x: d > 0 ? 36 : -36, opacity: 0 }),
  center: { zIndex: 1, x: 0, opacity: 1 },
  exit: (d) => ({ zIndex: 0, x: d < 0 ? 36 : -36, opacity: 0 }),
};

const STEP_COPY = {
  1: { heading: "Create\nAccount", sub: "Complete all steps\nto get started." },
  2: { heading: "Secure\nPassword", sub: "Use a strong mix\nof characters." },
  3: { heading: "Your\nProfile", sub: "Tell us a bit more\nabout yourself." },
  4: { heading: "Almost\nDone!", sub: "Check your inbox\nto verify." },
  5: { heading: "Complete", sub: "" },
};

export default function SignUp({
  isOpen,
  verificationToken,
  onClose,
  onSignInClick,
}) {
  useEffect(() => {
    console.log("BACKEND URL:", process.env.NEXT_PUBLIC_BACKEND_URL);
  }, []);

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [countryError, setCountryError] = useState("");
  const [termsError, setTermsError] = useState("");
  const [backendError, setBackendError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [usernameChecking, setUsernameChecking] = useState(false);

  const countries = countryList().getData();
  const router = useRouter();

  const goToStep = (n) => {
    setDirection(n > step ? 1 : -1);
    setStep(n);
  };

  const handleTokenVerification = async (token) => {
    setIsLoading(true);
    try {
      const response = await API.post(
        `${process.env.NEXT_PUBLIC_AUTH_EMAIL_VERIFY}/${token}`,
      );
      if (response.data.success && response.status === 200) {
        setVerificationStatus("success");
        setVerificationMessage(
          "You are a verified user of gopwnit. Kindly sign in and start hacking.",
        );
      }
    } catch (error) {
      setVerificationStatus("error");
      let msg = "Verification failed";
      if (error.response?.data)
        msg = error.response.data.message || "Invalid or expired token";
      setVerificationMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const checkUsernameAvailability = async (uname) => {
    setUsernameChecking(true);
    try {
      const response = await API.get(
        `${process.env.NEXT_PUBLIC_AUTH_USERNAME_CHECK}`,
        { params: { username: uname } },
      );
      setUsernameAvailable(!!response.data?.isAvailable);
    } catch {
      setUsernameAvailable(false);
    } finally {
      setUsernameChecking(false);
    }
  };

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!username.trim()) {
      setUsernameAvailable(null);
      return;
    }
    const t = setTimeout(
      () => checkUsernameAvailability(username.toLowerCase()),
      200,
    );
    return () => clearTimeout(t);
  }, [username]);

  useEffect(() => {
    if (verificationToken && isOpen) {
      goToStep(5);
      handleTokenVerification(verificationToken);
    }
  }, [verificationToken, isOpen]);

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email");
      return false;
    }
    setEmailError("");
    return true;
  };
  const validatePassword = () => {
    if (!password.trim()) {
      setPasswordError("Password is required");
      return false;
    }
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      setPasswordError("Must contain an uppercase letter");
      return false;
    }
    if (!/[a-z]/.test(password)) {
      setPasswordError("Must contain a lowercase letter");
      return false;
    }
    if (!/[0-9]/.test(password)) {
      setPasswordError("Must contain a number");
      return false;
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      setPasswordError("Must contain a special character");
      return false;
    }
    setPasswordError("");
    return true;
  };
  const validateUsername = () => {
    if (!username.trim()) {
      setUsernameError("Username is required");
      return false;
    }
    if (!/^(?!\.)(?!.*\.$)[a-zA-Z0-9_.]{3,20}$/.test(username)) {
      setUsernameError("Letters, numbers, dots, and underscores only");
      return false;
    }
    setUsernameError("");
    return true;
  };
  const validateFullName = () => {
    if (!fullName.trim()) {
      setFullNameError("Full name is required");
      return false;
    }
    if (fullName.length < 2) {
      setFullNameError("Must be at least 2 characters");
      return false;
    }
    if (!/^[A-Za-z\s'-]+$/.test(fullName)) {
      setFullNameError("Letters, spaces, hyphens, apostrophes only");
      return false;
    }
    setFullNameError("");
    return true;
  };
  const validateCountry = () => {
    if (!country) {
      setCountryError("Please select a country");
      return false;
    }
    setCountryError("");
    return true;
  };
  const validateTerms = () => {
    if (!termsAccepted) {
      setTermsError("You must accept the terms to continue");
      return false;
    }
    setTermsError("");
    return true;
  };

  const resetForm = () => {
    goToStep(1);
    setTimeout(() => {
      setEmail("");
      setPassword("");
      setUsername("");
      setFullName("");
      setCountry(null);
      setTermsAccepted(false);
      setEmailError("");
      setPasswordError("");
      setUsernameError("");
      setFullNameError("");
      setCountryError("");
      setTermsError("");
      setBackendError("");
      setShowPassword(false);
      setIsLoading(false);
    }, 0);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleNext = () => {
    if (step === 1 && validateEmail()) goToStep(2);
    else if (step === 2 && validatePassword()) goToStep(3);
    else if (step === 3) {
      const ok =
        validateTerms() &
        validateUsername() &
        validateFullName() &
        validateCountry();
      if (ok) handleSubmit();
    }
  };

  const encryptPassword = (pw, publicKey) => {
    const rsa = forge.pki.publicKeyFromPem(publicKey);
    const encrypted = rsa.encrypt(pw, "RSA-OAEP", {
      md: forge.md.sha256.create(),
    });
    return forge.util.encode64(encrypted);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const details = {
      email,
      encryptedPassword: encryptPassword(password, process.env.NEXT_PUBLIC_KEY),
      username: username.toLowerCase(),
      fullName,
      country: country.label,
    };
    try {
      const response = await API.post(
        `${process.env.NEXT_PUBLIC_AUTH_SIGNUP_API}`,
        details,
        { withCredentials: true },
      );
      if (response.data.success && response.status === 201) {
        setBackendError("");
        goToStep(4);
      }
    } catch (error) {
      let msg = "An error occurred during registration.";
      if (error.response?.data?.message) msg = error.response.data.message;
      setBackendError(msg);
      goToStep(4);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    router.push("/resend");
    handleClose();
  };

  const passwordStrength = () => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[a-z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  };

  if (!isOpen) return null;

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "rgba(255,255,255,0.02)",
      borderColor: countryError
        ? T.error
        : state.isFocused
          ? T.borderFocus
          : T.border,
      borderRadius: 0,
      padding: "4px 4px",
      boxShadow: "none",
      cursor: "pointer",
      "&:hover": { borderColor: countryError ? T.error : T.borderFocus },
      transition: "all 0.2s ease",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "rgba(12,12,12,0.98)",
      border: `1px solid ${T.border}`,
      borderRadius: 0,
      boxShadow: "0 16px 40px rgba(0,0,0,0.7)",
      overflow: "hidden",
      zIndex: 9999,
    }),
    menuList: (base) => ({ ...base, padding: "4px", maxHeight: "160px" }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "rgba(240,237,230,0.1)"
        : state.isFocused
          ? "rgba(255,255,255,0.04)"
          : "transparent",
      color: state.isSelected ? T.cream : "#aaa",
      borderRadius: 0,
      cursor: "pointer",
      fontSize: "13px",
      fontFamily: "'Outfit', sans-serif",
      padding: "9px 12px",
      "&:active": { backgroundColor: "rgba(240,237,230,0.08)" },
    }),
    singleValue: (base) => ({
      ...base,
      color: T.cream,
      fontFamily: "'Outfit', sans-serif",
      fontSize: "13px",
    }),
    input: (base) => ({
      ...base,
      color: T.cream,
      margin: 0,
      padding: 0,
      fontFamily: "'Outfit', sans-serif",
      fontSize: "13px",
    }),
    placeholder: (base) => ({
      ...base,
      color: T.muted,
      fontFamily: "'Outfit', sans-serif",
      fontSize: "13px",
    }),
    indicatorSeparator: () => ({ display: "none" }),
    dropdownIndicator: (base) => ({
      ...base,
      color: T.muted,
      "&:hover": { color: T.cream },
    }),
  };

  /* Step dot component */
  const StepDot = ({ item }) => {
    const Icon = item.icon;
    const active = step >= item.s;
    const done = step > item.s;
    return (
      <div
        className="flex items-center justify-center w-7 h-7 shrink-0 transition-all duration-500"
        style={{
          border: `1px solid ${active ? T.cream : T.border}`,
          background: active ? T.cream : "transparent",
          color: active ? T.bg : T.muted,
        }}
      >
        {item.isStatus && step >= 5 ? (
          verificationStatus === "success" ? (
            <Check size={12} strokeWidth={2} />
          ) : verificationStatus === "error" ? (
            <X size={12} strokeWidth={2} />
          ) : (
            <Icon size={12} strokeWidth={1.5} />
          )
        ) : done ? (
          <Check size={12} strokeWidth={2} />
        ) : (
          <Icon size={12} strokeWidth={1.5} />
        )}
      </div>
    );
  };

  const copy = STEP_COPY[step] || STEP_COPY[1];

  /* Progress track: dots are 28px (w-7). First dot center = 14px from left edge of steps area.
     Steps area starts at px-8 = 32px from modal edge, so relative left offset = 14px.
     Last dot center = right edge - 14px. We use justify-between so each dot sits at equal intervals. */
  const progressPct = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-[90] px-4 py-4"
      style={{ fontFamily: "'Outfit', sans-serif" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(6px)" }}
        onClick={handleClose}
      />

      {/* Modal */}
      <motion.div
        className="relative w-full overflow-hidden"
        style={{
          maxWidth: "820px",
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
        {isLoading && <Loader />}

        {/* ── TOP STRIP ── */}
        <div
          style={{
            background: T.surface,
            borderBottom: `1px solid ${T.border}`,
          }}
        >
          {/* Row 1: "New Account" label + close button */}
          <div className="flex items-center justify-between px-8 pt-4 pb-4">
            <span
              className="text-[10px] font-bold tracking-[0.22em] uppercase font-outfit"
              style={{ color: T.muted }}
            >
              New Account
            </span>
            <button
              onClick={handleClose}
              className="flex items-center justify-center w-7 h-7 transition-all duration-150 hover:bg-white/[0.04]"
              style={{ border: `1px solid ${T.border}`, color: T.muted }}
            >
              <X size={12} strokeWidth={1.5} />
            </button>
          </div>

          {/* Row 2: step dots with connecting line */}
          <div className="relative px-8 pb-5">
            {/* Full track line — sits at vertical center of the dots (dot h=28px → center at 14px) */}
            <div
              className="absolute"
              style={{
                top: "14px",
                left: "calc(2rem + 14px)" /* px-8 (32px) + half dot width (14px) */,
                right: "calc(2rem + 16px)",
                height: "1px",
                background: T.border,
                zIndex: 0,
              }}
            />
            {/* Filled track */}
            <div
              className="absolute transition-all duration-500 ease-out"
              style={{
                top: "14px",
                left: "calc(2rem + 14px)",
                width: `calc((100% - 4rem - 28px) * ${progressPct / 100})`,
                height: "1px",
                background: T.cream,
                zIndex: 1,
              }}
            />

            {/* Dots row — justify-between so they sit at exact equal intervals */}
            <div
              className="flex items-center justify-between relative"
              style={{ zIndex: 2 }}
            >
              {STEPS.map((item) => (
                <div key={item.s} className="flex flex-col items-center gap-2">
                  {/* Dot gets surface bg so it "cuts" the line behind it cleanly */}
                  <div style={{ background: T.surface }}>
                    <StepDot item={item} />
                  </div>
                  <span
                    className="text-[9px] font-bold tracking-[0.16em] uppercase font-outfit transition-all duration-300"
                    style={{ color: step >= item.s ? T.cream : T.muted }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── BODY: two-column ── */}
        <div className="flex" style={{ minHeight: "340px" }}>
          {/* Left panel: animated title + sign-in link */}
          <div
            className="flex flex-col justify-between px-8 py-8 shrink-0"
            style={{ width: "260px", borderRight: `1px solid ${T.border}` }}
          >
            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`title-${step}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h2
                    className="font-black uppercase leading-none font-outfit mb-3"
                    style={{
                      fontSize: "clamp(1.6rem, 2.8vw, 2rem)",
                      color: T.cream,
                      letterSpacing: "-0.01em",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {copy.heading}
                  </h2>
                  <p
                    className="text-[12px] leading-relaxed font-outfit"
                    style={{ color: T.muted, whiteSpace: "pre-line" }}
                  >
                    {copy.sub}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-6">
              <p className="text-[11px] font-outfit" style={{ color: T.muted }}>
                Already have an account?
              </p>
              <button
                onClick={onSignInClick}
                className="text-[10px] font-bold tracking-[0.14em] uppercase font-outfit mt-1 transition-opacity opacity-80 hover:opacity-100 duration-150"
                style={{
                  color: T.cream,
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                Sign In
              </button>
            </div>
          </div>

          {/* Right panel: form content */}
          <div className="flex-1 px-8 py-8 flex flex-col">
            <AnimatePresence mode="wait" custom={direction}>
              {/* ─ Step 1: Email ─ */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  className="flex flex-col flex-1"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    type: "tween",
                    ease: "easeInOut",
                    duration: 0.28,
                  }}
                >
                  <div className="flex flex-col gap-5 flex-1">
                    <Field label="Email Address" error={emailError}>
                      <Input
                        icon={Mail}
                        type="email"
                        value={email}
                        placeholder="Enter your email"
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailError("");
                        }}
                        onBlur={validateEmail}
                      />
                    </Field>
                  </div>

                  <div
                    className="pt-5 mt-6"
                    style={{ borderTop: `1px solid ${T.border}` }}
                  >
                    <button
                      onClick={handleNext}
                      className="w-full py-3.5 flex items-center justify-center gap-2.5 font-black uppercase tracking-[0.18em] text-[11px] font-outfit transition-all duration-200 group"
                      style={{ background: T.cream, color: T.bg }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#FFFFFF";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = T.cream;
                      }}
                    >
                      Continue
                      <ChevronRight
                        size={13}
                        strokeWidth={2.5}
                        className="group-hover:translate-x-0.5 transition-transform duration-150"
                      />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ─ Step 2: Password ─ */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  className="flex flex-col flex-1"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    type: "tween",
                    ease: "easeInOut",
                    duration: 0.28,
                  }}
                >
                  <div className="flex flex-col gap-5 flex-1">
                    <Field label="Password" error={passwordError}>
                      <Input
                        icon={Lock}
                        type={showPassword ? "text" : "password"}
                        value={password}
                        placeholder="Create a password"
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setPasswordError("");
                        }}
                        onBlur={validatePassword}
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

                    <div
                      className="p-4"
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        border: `1px solid ${T.border}`,
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="text-[10px] font-bold tracking-[0.18em] uppercase font-outfit"
                          style={{ color: T.muted }}
                        >
                          Strength
                        </span>
                        <span
                          className="text-[10px] font-bold tracking-[0.15em] uppercase font-outfit"
                          style={{
                            color:
                              passwordStrength() === 0
                                ? T.muted
                                : passwordStrength() <= 2
                                  ? T.error
                                  : passwordStrength() === 3
                                    ? "#fbbf24"
                                    : T.success,
                          }}
                        >
                          {passwordStrength() === 0 && "—"}
                          {passwordStrength() > 0 &&
                            passwordStrength() <= 2 &&
                            "Weak"}
                          {passwordStrength() === 3 && "Fair"}
                          {passwordStrength() >= 4 && "Strong"}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => {
                          const str = passwordStrength();
                          let bg = "rgba(255,255,255,0.08)";
                          if (level <= str)
                            bg =
                              str <= 2
                                ? T.error
                                : str === 3
                                  ? "#fbbf24"
                                  : T.success;
                          return (
                            <div
                              key={level}
                              className="flex-1 h-px transition-all duration-500"
                              style={{ background: bg }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div
                    className="flex gap-3 pt-5 mt-6"
                    style={{ borderTop: `1px solid ${T.border}` }}
                  >
                    <button
                      onClick={() => goToStep(1)}
                      className="flex items-center justify-center gap-2 px-5 py-3.5 font-bold uppercase tracking-[0.15em] text-[11px] font-outfit transition-all duration-200 group"
                      style={{
                        border: `1px solid ${T.border}`,
                        color: T.muted,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = T.borderFocus;
                        e.currentTarget.style.color = T.cream;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = T.border;
                        e.currentTarget.style.color = T.muted;
                      }}
                    >
                      <ChevronLeft
                        size={13}
                        strokeWidth={2.5}
                        className="group-hover:-translate-x-0.5 transition-transform duration-150"
                      />
                      Back
                    </button>
                    <button
                      onClick={handleNext}
                      className="flex-1 py-3.5 flex items-center justify-center gap-2.5 font-black uppercase tracking-[0.18em] text-[11px] font-outfit transition-all duration-200 group"
                      style={{ background: T.cream, color: T.bg }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#FFFFFF";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = T.cream;
                      }}
                    >
                      Continue
                      <ChevronRight
                        size={13}
                        strokeWidth={2.5}
                        className="group-hover:translate-x-0.5 transition-transform duration-150"
                      />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ─ Step 3: Profile ─ */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  className="flex flex-col flex-1"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    type: "tween",
                    ease: "easeInOut",
                    duration: 0.28,
                  }}
                >
                  <div className="flex flex-col gap-5 flex-1">
                    {/* Username + Full Name side by side */}
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Username" error={usernameError}>
                        <Input
                          icon={User}
                          type="text"
                          value={username}
                          placeholder="your_handle"
                          onChange={(e) => {
                            setUsername(e.target.value.toLowerCase());
                            setUsernameError("");
                          }}
                          onBlur={validateUsername}
                          right={
                            <div
                              className="pointer-events-none"
                              style={{ color: T.muted }}
                            >
                              {usernameChecking ? (
                                <span
                                  className="animate-spin block w-3.5 h-3.5 border border-t-transparent"
                                  style={{
                                    borderColor: `${T.muted} transparent transparent transparent`,
                                  }}
                                />
                              ) : usernameAvailable === true ? (
                                <Check
                                  size={13}
                                  strokeWidth={2}
                                  style={{ color: T.success }}
                                />
                              ) : usernameAvailable === false ? (
                                <X
                                  size={13}
                                  strokeWidth={2}
                                  style={{ color: T.error }}
                                />
                              ) : null}
                            </div>
                          }
                        />
                        {!usernameError && (
                          <p
                            className="text-[11px] font-outfit"
                            style={{ color: T.muted }}
                          >
                            Letters, numbers, dots, underscores.
                          </p>
                        )}
                      </Field>

                      <Field label="Full Name" error={fullNameError}>
                        <Input
                          type="text"
                          value={fullName}
                          placeholder="John Doe"
                          onChange={(e) => {
                            setFullName(e.target.value);
                            setFullNameError("");
                          }}
                          onBlur={validateFullName}
                        />
                      </Field>
                    </div>

                    {/* Country full-width */}
                    <Field label="Country" error={countryError}>
                      <Select
                        value={country}
                        onChange={(selected) => {
                          setCountry(selected);
                          setCountryError("");
                        }}
                        onBlur={validateCountry}
                        options={countries}
                        placeholder="Select your country"
                        className="country-select-premium"
                        classNamePrefix="country-select"
                        menuPlacement="auto"
                        styles={selectStyles}
                      />
                    </Field>
                  </div>

                  {/* Terms + buttons */}
                  <div
                    className="pt-5 mt-4"
                    style={{ borderTop: `1px solid ${T.border}` }}
                  >
                    <div className="flex items-start mb-5">
                      <div
                        onClick={() => {
                          setTermsAccepted(!termsAccepted);
                          setTermsError("");
                        }}
                        className="w-4 h-4 flex items-center justify-center cursor-pointer transition-all duration-200 shrink-0 mt-0.5"
                        style={{
                          border: `1px solid ${termsAccepted ? T.cream : T.border}`,
                          background: termsAccepted ? T.cream : "transparent",
                          color: termsAccepted ? T.bg : "transparent",
                        }}
                      >
                        <Check size={10} strokeWidth={3} />
                      </div>
                      <div className="ml-3">
                        <label
                          className="text-[12px] font-outfit cursor-pointer select-none"
                          style={{ color: T.muted }}
                          onClick={() => setTermsAccepted(!termsAccepted)}
                        >
                          I accept the{" "}
                          <span
                            className="transition-opacity opacity-80 hover:opacity-100 duration-150"
                            style={{ color: T.cream, cursor: "pointer" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open("/terms", "_blank");
                            }}
                          >
                            Terms of Use
                          </span>{" "}
                          and{" "}
                          <span
                            className="transition-opacity opacity-80 hover:opacity-100 duration-150"
                            style={{ color: T.cream, cursor: "pointer" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open("/privacy", "_blank");
                            }}
                          >
                            Privacy Policy
                          </span>
                        </label>
                        <AnimatePresence>
                          {termsError && (
                            <motion.p
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              transition={{ duration: 0.18 }}
                              className="text-[11px] tracking-wide font-outfit flex items-center gap-1 mt-1"
                              style={{ color: T.error }}
                            >
                              <AlertTriangle
                                size={11}
                                strokeWidth={1.5}
                                className="shrink-0"
                              />
                              {termsError}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => goToStep(2)}
                        className="flex items-center justify-center gap-2 px-5 py-3.5 font-bold uppercase tracking-[0.15em] text-[11px] font-outfit transition-all duration-200 group"
                        style={{
                          border: `1px solid ${T.border}`,
                          color: T.muted,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = T.borderFocus;
                          e.currentTarget.style.color = T.cream;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = T.border;
                          e.currentTarget.style.color = T.muted;
                        }}
                      >
                        <ChevronLeft
                          size={13}
                          strokeWidth={2.5}
                          className="group-hover:-translate-x-0.5 transition-transform duration-150"
                        />
                        Back
                      </button>
                      <button
                        onClick={handleNext}
                        className="flex-1 py-3.5 flex items-center justify-center font-black uppercase tracking-[0.18em] text-[11px] font-outfit transition-all duration-200"
                        style={{ background: T.cream, color: T.bg }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#FFFFFF";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = T.cream;
                        }}
                      >
                        Create Account
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ─ Step 4: Verify success ─ */}
              {step === 4 && !backendError && (
                <motion.div
                  key="step4-success"
                  className="flex flex-col items-center justify-center text-center flex-1"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    type: "tween",
                    ease: "easeInOut",
                    duration: 0.28,
                  }}
                >
                  <div
                    className="flex items-center justify-center w-14 h-14 mb-6"
                    style={{ border: `1px solid ${T.border}`, color: T.cream }}
                  >
                    <Mail size={24} strokeWidth={1.5} />
                  </div>
                  <p
                    className="text-[10px] font-bold tracking-[0.22em] uppercase font-outfit mb-2"
                    style={{ color: T.muted }}
                  >
                    Verify your email
                  </p>
                  <h3
                    className="font-black uppercase tracking-tight leading-none mb-4 font-outfit"
                    style={{
                      fontSize: "clamp(1.4rem, 3vw, 1.7rem)",
                      color: T.cream,
                    }}
                  >
                    Check your inbox
                  </h3>
                  <p
                    className="text-[13px] leading-relaxed font-outfit mb-8 max-w-xs"
                    style={{ color: T.muted }}
                  >
                    A verification link was sent to{" "}
                    <span style={{ color: T.cream }}>{email}</span>. Click it to
                    complete registration.
                  </p>
                  <div
                    className="w-full flex flex-col gap-3"
                    style={{
                      borderTop: `1px solid ${T.border}`,
                      paddingTop: "20px",
                    }}
                  >
                    <button
                      onClick={handleClose}
                      className="w-full py-3.5 font-black uppercase tracking-[0.18em] text-[11px] font-outfit transition-all duration-200"
                      style={{ background: T.cream, color: T.bg }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#FFFFFF";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = T.cream;
                      }}
                    >
                      Got it, thanks!
                    </button>
                    <p
                      className="text-[12px] font-outfit"
                      style={{ color: T.muted }}
                    >
                      Didn&apos;t receive it?{" "}
                      <button
                        onClick={handleResend}
                        className="uppercase tracking-[0.12em] text-[10px] transition-opacity opacity-80 hover:opacity-100 duration-150 ml-1 font-outfit"
                        style={{ color: T.cream }}
                      >
                        Resend
                      </button>
                    </p>
                  </div>
                </motion.div>
              )}

              {/* ─ Step 4: Error ─ */}
              {step === 4 && backendError && (
                <motion.div
                  key="step4-error"
                  className="flex flex-col items-center justify-center text-center flex-1"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    type: "tween",
                    ease: "easeInOut",
                    duration: 0.28,
                  }}
                >
                  <p
                    className="text-[10px] font-bold tracking-[0.22em] uppercase font-outfit mb-2"
                    style={{ color: T.muted }}
                  >
                    Registration failed
                  </p>
                  <div className="flex items-center justify-center gap-2 mb-5">
                    <h3
                      className="font-black capitalize tracking-tight leading-tight font-outfit"
                      style={{
                        fontSize: "clamp(1.4rem, 3vw, 1.5rem)",
                        color: T.cream,
                      }}
                    >
                      {backendError}
                    </h3>
                  </div>
                  <div
                    className="w-full"
                    style={{
                      borderTop: `1px solid ${T.border}`,
                      paddingTop: "20px",
                    }}
                  >
                    <button
                      onClick={resetForm}
                      className="w-full py-3.5 flex items-center justify-center gap-2.5 font-bold uppercase tracking-[0.18em] text-[11px] font-outfit transition-all duration-200 group"
                      style={{
                        border: `1px solid ${T.border}`,
                        color: T.muted,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = T.borderFocus;
                        e.currentTarget.style.color = T.cream;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = T.border;
                        e.currentTarget.style.color = T.muted;
                      }}
                    >
                      <ChevronLeft
                        size={13}
                        strokeWidth={2.5}
                        className="group-hover:-translate-x-0.5 transition-transform duration-150"
                      />
                      Try Again
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ─ Step 5: Complete / Verification ─ */}
              {step === 5 && (
                <motion.div
                  key="step5"
                  className="flex flex-col items-center justify-center text-center flex-1"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    type: "tween",
                    ease: "easeInOut",
                    duration: 0.28,
                  }}
                >
                  <div
                    className="flex items-center justify-center w-14 h-14 mb-6"
                    style={{
                      border: `1px solid ${verificationStatus === "success" ? T.cream : T.error}`,
                      color:
                        verificationStatus === "success" ? T.cream : T.error,
                    }}
                  >
                    {verificationStatus === "success" ? (
                      <CheckCircle size={24} strokeWidth={1.5} />
                    ) : (
                      <AlertTriangle size={24} strokeWidth={1.5} />
                    )}
                  </div>
                  <p
                    className="text-[10px] font-bold tracking-[0.22em] uppercase font-outfit mb-2"
                    style={{ color: T.muted }}
                  >
                    {verificationStatus === "success"
                      ? "Verified"
                      : "Verification failed"}
                  </p>
                  <h3
                    className="font-black uppercase tracking-tight leading-none mb-5 font-outfit"
                    style={{
                      fontSize: "clamp(1.4rem, 3vw, 1.7rem)",
                      color: T.cream,
                    }}
                  >
                    {verificationStatus === "success"
                      ? "You're in."
                      : "Token Invalid"}
                  </h3>
                  <div
                    className="w-full p-4 mb-6 text-left"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: `1px solid ${T.border}`,
                    }}
                  >
                    <p
                      className="text-[13px] font-outfit leading-relaxed"
                      style={{ color: T.muted }}
                    >
                      {verificationMessage}
                    </p>
                  </div>
                  <div
                    className="w-full"
                    style={{
                      borderTop: `1px solid ${T.border}`,
                      paddingTop: "20px",
                    }}
                  >
                    {verificationStatus === "success" ? (
                      <button
                        onClick={onSignInClick}
                        className="w-full py-3.5 flex items-center justify-center gap-2.5 font-black uppercase tracking-[0.18em] text-[11px] font-outfit transition-all duration-200 group"
                        style={{ background: T.cream, color: T.bg }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#FFFFFF";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = T.cream;
                        }}
                      >
                        Sign In to Continue
                        <ChevronRight
                          size={13}
                          strokeWidth={2.5}
                          className="group-hover:translate-x-0.5 transition-transform duration-150"
                        />
                      </button>
                    ) : (
                      <button
                        onClick={handleClose}
                        className="w-full py-3.5 font-bold uppercase tracking-[0.18em] text-[11px] font-outfit transition-all duration-200"
                        style={{
                          border: `1px solid ${T.border}`,
                          color: T.muted,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = T.borderFocus;
                          e.currentTarget.style.color = T.cream;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = T.border;
                          e.currentTarget.style.color = T.muted;
                        }}
                      >
                        Close Window
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
