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
  const countries = countryList().getData();
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [usernameChecking, setUsernameChecking] = useState(false);

  // New Theme Color
  const themeColor = "#a855f7"; // Purple-500
  const router = useRouter();

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
      let errorMessage = "Verification failed";
      if (error.response && error.response.data) {
        errorMessage =
          error.response.data.message || "Invalid or expired token";
      }
      setVerificationMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const checkUsernameAvailability = async (username) => {
    setUsernameChecking(true);
    try {
      const response = await API.get(
        `${process.env.NEXT_PUBLIC_AUTH_USERNAME_CHECK}`,
        {
          params: { username },
        },
      );

      if (response.data?.isAvailable) {
        setUsernameAvailable(true);
      } else {
        setUsernameAvailable(false);
      }
    } catch (error) {
      console.error("Username check error:", error);
      setUsernameAvailable(false);
    } finally {
      setUsernameChecking(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!username.trim()) {
      setUsernameAvailable(null);
      return;
    }

    const delayDebounce = setTimeout(() => {
      checkUsernameAvailability(username.toLowerCase());
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [username]);

  useEffect(() => {
    if (verificationToken && isOpen) {
      setStep(5);
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
      setPasswordError("Password must contain at least one uppercase letter");
      return false;
    }
    if (!/[a-z]/.test(password)) {
      setPasswordError("Password must contain at least one lowercase letter");
      return false;
    }
    if (!/[0-9]/.test(password)) {
      setPasswordError("Password must contain at least one number");
      return false;
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      setPasswordError("Password must contain at least one special character");
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
      setUsernameError(
        "Username can only contain letters, numbers, dots, and underscores",
      );
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
      setFullNameError("Full name must be at least 2 characters");
      return false;
    }
    if (!/^[A-Za-z\s'-]+$/.test(fullName)) {
      setFullNameError(
        "Full name can only contain letters, spaces, hyphens, and apostrophes",
      );
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

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1 === 0 ? 1 : step - 1);
  };

  const resetForm = () => {
    setStep(1);
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
    if (step === 1) {
      if (validateEmail()) nextStep();
    } else if (step === 2) {
      if (validatePassword()) nextStep();
    } else if (step === 3) {
      const isValid =
        validateTerms() &&
        validateUsername() &&
        validateFullName() &&
        validateCountry();
      if (isValid) handleSubmit();
    }
  };

  const encryptPassword = (password, publicKey) => {
    const rsa = forge.pki.publicKeyFromPem(publicKey);
    const encrypted = rsa.encrypt(password, "RSA-OAEP", {
      md: forge.md.sha256.create(),
    });
    return forge.util.encode64(encrypted);
  };

  const handleSubmit = async () => {
    const isValid =
      validateUsername() &
      validateFullName() &
      validateCountry() &
      validateTerms();
    if (!isValid) return;

    setIsLoading(true);
    const publicKey = process.env.NEXT_PUBLIC_KEY;
    const details = {
      email,
      encryptedPassword: encryptPassword(password, publicKey),
      username: username.toLowerCase(),
      fullName,
      country: country.label,
    };

    try {
      const response = await API.post(
        `${process.env.NEXT_PUBLIC_AUTH_SIGNUP_API}`,
        details,
        {
          withCredentials: true,
        },
      );
      if (response.data.success && response.status === 201) {
        setBackendError("");
        nextStep();
      }
    } catch (error) {
      let errorMessage = "An error occurred during registration.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }
      setBackendError(errorMessage);
      nextStep();
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
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="font-outfit fixed inset-0 flex items-center justify-center bg-black/60 backdrop-filter backdrop-blur-md z-9999 py-4 px-4 overflow-hidden"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-[#030305]/95 backdrop-blur-2xl shadow-2xl w-full max-w-xl rounded-2xl border border-white/10 overflow-hidden flex flex-col max-h-[90vh]"
            style={{
              boxShadow: `0 25px 50px -12px rgba(168, 85, 247, 0.15), 0 0 40px rgba(168, 85, 247, 0.1)`,
            }}
          >
            {isLoading && <Loader />}

            {/* Glowing Accents */}
            <div className="absolute top-0 left-1/4 right-1/4 h-px bg-linear-to-r from-transparent via-purple-500 to-transparent opacity-50 blur-[2px]"></div>
            <div className="absolute top-0 left-1/3 right-1/3 h-px bg-purple-400 opacity-80"></div>

            {/* Subtle Ambient Glow */}
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[100px] pointer-events-none"></div>

            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full p-2 transition-all duration-300 z-100"
            >
              <X size={18} />
            </button>

            <div className="p-6 border-b border-white/5 shrink-0 relative z-10">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-purple-200">
                Create Account
              </h2>
            </div>

            <div className="px-6 pt-6 shrink-0 relative z-10">
              <div className="flex justify-between mb-8 relative">
                <div
                  className="absolute top-4 left-4 right-4 h-1 bg-white/5 rounded-full"
                  style={{ zIndex: 1 }}
                ></div>
                <div
                  className="absolute top-4 left-4 h-1 rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${((step - 1) / (5 - 1)) * 100}%`,
                    zIndex: 2,
                    backgroundColor: themeColor,
                    boxShadow: `0 0 10px ${themeColor}80`,
                  }}
                ></div>

                {[
                  { s: 1, icon: Mail, label: "Email" },
                  { s: 2, icon: Lock, label: "Password" },
                  { s: 3, icon: User, label: "Profile" },
                  { s: 4, icon: CheckCircle, label: "Verify", isStatus: false },
                  {
                    s: 5,
                    icon: CheckCircle,
                    label: "Complete",
                    isStatus: true,
                  },
                ].map((item) => (
                  <div
                    key={item.s}
                    className="flex flex-col items-center relative z-10 bg-[#030305]/80 backdrop-blur-sm rounded-full"
                  >
                    <div
                      className={`flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-500 ${
                        step >= item.s
                          ? "border-purple-500 text-white bg-purple-500"
                          : "border-white/10 text-zinc-500 bg-[#08080c]"
                      }`}
                      style={
                        step === item.s
                          ? {
                              boxShadow: `0 0 15px ${themeColor}60, inset 0 0 10px ${themeColor}40`,
                            }
                          : {}
                      }
                    >
                      {item.isStatus && step >= 5 ? (
                        verificationStatus === "success" ? (
                          <Check size={14} />
                        ) : verificationStatus === "error" ? (
                          <X size={14} />
                        ) : (
                          <CheckCircle size={14} />
                        )
                      ) : step > item.s ? (
                        <Check
                          size={14}
                          className="animate-in zoom-in duration-300"
                        />
                      ) : (
                        <item.icon size={14} />
                      )}
                    </div>
                    <span
                      className={`absolute top-full text-[10px] mt-2 font-medium transition-all duration-300 ${
                        step >= item.s ? "text-purple-300" : "text-zinc-500"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Area - Scrollable */}
            <div className="px-6 pb-6 overflow-y-auto custom-scrollbar flex-1 relative z-10 mt-6 min-h-100">
              <AnimatePresence mode="wait" custom={1}>
                {step === 1 && (
                  <motion.div
                    key="step1"
                    className="flex flex-col h-full pt-2"
                    custom={1}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      type: "tween",
                      ease: "easeInOut",
                      duration: 0.3,
                    }}
                  >
                    <div className="flex-1">
                      <h3 className="text-xl font-medium text-white mb-1">
                        What's your email?
                      </h3>
                      <p className="text-zinc-400 text-sm mb-6">
                        We'll use this to identify your account
                      </p>

                      <div className="mb-4 relative">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError("");
                          }}
                          onBlur={validateEmail}
                          placeholder="Your email address"
                          className={`w-full p-4 bg-white/5 rounded-xl border ${
                            emailError
                              ? "border-red-500/50"
                              : "border-white/10 focus:border-purple-500/50"
                          } text-white focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all duration-300`}
                        />
                        <AnimatePresence>
                          {emailError && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="absolute -bottom-6 text-red-400 text-xs ml-1 flex items-center"
                            >
                              <AlertTriangle
                                size={12}
                                className="mr-1 shrink-0"
                              />{" "}
                              <span className="truncate">{emailError}</span>
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
                      <button
                        onClick={handleNext}
                        className="w-full py-3.5 bg-linear-to-r from-purple-600 to-fuchsia-600 rounded-xl text-white font-medium hover:from-purple-500 hover:to-fuchsia-500 transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-[1.02] shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] group"
                      >
                        <span>Continue</span>
                        <ChevronRight
                          size={18}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </button>

                      <div className="text-center mt-6 text-zinc-400 text-sm">
                        Already have an account?{" "}
                        <button
                          onClick={onSignInClick}
                          className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                        >
                          Sign In
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    className="flex flex-col h-full pt-2"
                    custom={1}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      type: "tween",
                      ease: "easeInOut",
                      duration: 0.3,
                    }}
                  >
                    <div className="flex-1">
                      <h3 className="text-xl font-medium text-white mb-1">
                        Create a password
                      </h3>
                      <p className="text-zinc-400 text-sm mb-6">
                        Make sure it's secure and easy to remember
                      </p>

                      <div className="mb-4">
                        <div className="relative w-full">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              setPasswordError("");
                            }}
                            onBlur={validatePassword}
                            placeholder="Your password"
                            className={`w-full p-4 pr-12 bg-white/5 rounded-xl border ${
                              passwordError
                                ? "border-red-500/50"
                                : "border-white/10 focus:border-purple-500/50"
                            } text-white focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all duration-300`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors duration-300"
                          >
                            {showPassword ? (
                              <Eye size={18} />
                            ) : (
                              <EyeOff size={18} />
                            )}
                          </button>
                        </div>

                        <AnimatePresence>
                          {passwordError && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-red-400 text-xs ml-1 flex items-center mt-2"
                            >
                              <AlertTriangle
                                size={12}
                                className="mr-1 shrink-0"
                              />{" "}
                              <span className="truncate">{passwordError}</span>
                            </motion.p>
                          )}
                        </AnimatePresence>

                        <div className="mt-4 bg-white/2 p-4 rounded-xl border border-white/5">
                          <div className="flex space-x-1.5 h-1.5">
                            {[1, 2, 3, 4, 5].map((level) => {
                              const str = passwordStrength();
                              let color = "bg-white/10";
                              if (level <= str) {
                                if (str <= 2)
                                  color =
                                    "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]";
                                else if (str <= 3)
                                  color =
                                    "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]";
                                else
                                  color =
                                    "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]";
                              }
                              return (
                                <div
                                  key={level}
                                  className={`flex-1 rounded-full transition-all duration-500 ${color}`}
                                />
                              );
                            })}
                          </div>
                          <p className="text-xs text-zinc-400 mt-2 text-right">
                            {passwordStrength() === 0 && "Strong password"}
                            {passwordStrength() > 0 &&
                              passwordStrength() <= 2 && (
                                <span className="text-red-400">Weak</span>
                              )}
                            {passwordStrength() === 3 && (
                              <span className="text-amber-400">Fair</span>
                            )}
                            {passwordStrength() >= 4 && (
                              <span className="text-green-400">Strong</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3 mt-8 pt-6 border-t border-white/5 relative z-10">
                      <button
                        onClick={prevStep}
                        className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-white font-medium transition-all flex items-center justify-center space-x-2 group"
                      >
                        <ChevronLeft
                          size={18}
                          className="group-hover:-translate-x-1 transition-transform"
                        />
                        <span>Back</span>
                      </button>

                      <button
                        onClick={handleNext}
                        className="flex-2 py-3.5 bg-linear-to-r from-purple-600 to-fuchsia-600 rounded-xl text-white font-medium hover:from-purple-500 hover:to-fuchsia-500 transition-all duration-300 flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transform hover:scale-[1.02] group"
                      >
                        <span>Continue</span>
                        <ChevronRight
                          size={18}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    className="flex flex-col h-full pt-2"
                    custom={1}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      type: "tween",
                      ease: "easeInOut",
                      duration: 0.3,
                    }}
                  >
                    <div className="flex-1 overflow-visible">
                      <h3 className="text-xl font-medium text-white mb-1">
                        Complete your profile
                      </h3>
                      <p className="text-zinc-400 text-sm mb-6">
                        Just a few more details to get started
                      </p>

                      <div className="space-y-4">
                        <div className="relative">
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => {
                              setUsername(e.target.value.toLowerCase());
                              setUsernameError("");
                            }}
                            onBlur={validateUsername}
                            placeholder="Username"
                            className={`w-full p-4 bg-white/5 rounded-xl border ${
                              usernameError || usernameAvailable === false
                                ? "border-red-500/50"
                                : "border-white/10 focus:border-purple-500/50"
                            } text-white focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all duration-300`}
                          />
                          <div className="absolute top-4.5 right-4 flex items-center pointer-events-none">
                            {usernameChecking ? (
                              <span className="animate-spin h-4 w-4 border-2 border-purple-500 border-t-transparent rounded-full" />
                            ) : usernameAvailable === true ? (
                              <Check size={18} className="text-purple-400" />
                            ) : usernameAvailable === false ? (
                              <X size={18} className="text-red-400" />
                            ) : null}
                          </div>

                          {usernameError ? (
                            <p className="mt-1.5 text-red-400 text-xs ml-1 flex items-center">
                              <AlertTriangle
                                size={12}
                                className="mr-1 shrink-0"
                              />{" "}
                              <span className="truncate">{usernameError}</span>
                            </p>
                          ) : (
                            <p className="mt-1.5 text-zinc-500 text-xs ml-1">
                              Letters, numbers, dots, and underscores only.
                            </p>
                          )}
                        </div>

                        <div>
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => {
                              setFullName(e.target.value);
                              setFullNameError("");
                            }}
                            onBlur={validateFullName}
                            placeholder="Full Name"
                            className={`w-full p-4 bg-white/5 rounded-xl border ${
                              fullNameError
                                ? "border-red-500/50"
                                : "border-white/10 focus:border-purple-500/50"
                            } text-white focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all duration-300`}
                          />
                          <AnimatePresence>
                            {fullNameError && (
                              <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-red-400 text-xs ml-1 flex items-center mt-2"
                              >
                                <AlertTriangle
                                  size={12}
                                  className="mr-1 shrink-0"
                                />{" "}
                                <span className="truncate">
                                  {fullNameError}
                                </span>
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>

                        <div className="relative z-100">
                          <Select
                            value={country}
                            onChange={(selected) => {
                              setCountry(selected);
                              setCountryError("");
                            }}
                            onBlur={validateCountry}
                            options={countries}
                            placeholder="Select Country"
                            className="country-select-premium"
                            classNamePrefix="country-select"
                            menuPlacement="auto"
                            styles={{
                              control: (base, state) => ({
                                ...base,
                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                                borderColor: countryError
                                  ? "rgba(239, 68, 68, 0.5)"
                                  : state.isFocused
                                    ? "rgba(168, 85, 247, 0.5)"
                                    : "rgba(255, 255, 255, 0.1)",
                                padding: "6px",
                                boxShadow: state.isFocused
                                  ? "0 0 0 4px rgba(168, 85, 247, 0.1)"
                                  : "none",
                                borderRadius: "0.75rem",
                                cursor: "pointer",
                                "&:hover": {
                                  borderColor: countryError
                                    ? "rgba(239, 68, 68, 0.8)"
                                    : "rgba(168, 85, 247, 0.4)",
                                },
                                transition: "all 0.3s ease",
                              }),
                              menu: (base) => ({
                                ...base,
                                backgroundColor: "rgba(8, 8, 12, 0.95)",
                                backdropFilter: "blur(16px)",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                borderRadius: "0.75rem",
                                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
                                overflow: "hidden",
                                zIndex: 9999,
                              }),
                              menuList: (base) => ({
                                ...base,
                                padding: "4px",
                                maxHeight: "150px",
                              }),
                              option: (base, state) => ({
                                ...base,
                                backgroundColor: state.isSelected
                                  ? "rgba(168, 85, 247, 0.2)"
                                  : state.isFocused
                                    ? "rgba(255, 255, 255, 0.05)"
                                    : "transparent",
                                color: state.isSelected ? "#d8b4fe" : "white",
                                borderRadius: "0.5rem",
                                cursor: "pointer",
                                padding: "10px 12px",
                                "&:active": {
                                  backgroundColor: "rgba(168, 85, 247, 0.3)",
                                },
                              }),
                              singleValue: (base) => ({
                                ...base,
                                color: "white",
                              }),
                              input: (base) => ({
                                ...base,
                                color: "white",
                                margin: "0",
                                padding: "0",
                              }),
                              placeholder: (base) => ({
                                ...base,
                                color: "#9CA3AF",
                              }),
                              indicatorSeparator: () => ({
                                display: "none",
                              }),
                              dropdownIndicator: (base) => ({
                                ...base,
                                color: "#a1a1aa",
                                "&:hover": { color: "white" },
                              }),
                            }}
                          />
                          <AnimatePresence>
                            {countryError && (
                              <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-red-400 text-xs ml-1 flex items-center mt-2"
                              >
                                <AlertTriangle
                                  size={12}
                                  className="mr-1 shrink-0"
                                />{" "}
                                <span className="truncate">{countryError}</span>
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 mt-6 pt-4 border-t border-white/5 relative z-50">
                      <div className="flex items-start mb-6">
                        <div className="flex items-center h-5 mt-0.5">
                          <div
                            onClick={() => {
                              setTermsAccepted(!termsAccepted);
                              setTermsError("");
                            }}
                            className={`w-5 h-5 rounded flex items-center justify-center cursor-pointer border transition-colors duration-200 ${
                              termsAccepted
                                ? "bg-purple-600 border-purple-500 text-white"
                                : "bg-white/5 border-white/20 text-transparent"
                            }`}
                          >
                            <Check size={14} strokeWidth={3} />
                          </div>
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            className="text-zinc-400 cursor-pointer select-none"
                            onClick={() => setTermsAccepted(!termsAccepted)}
                          >
                            I accept the{" "}
                            <span
                              className="text-purple-400 hover:text-purple-300 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open("/terms", "_blank");
                              }}
                            >
                              Terms of Use
                            </span>{" "}
                            and{" "}
                            <span
                              className="text-purple-400 hover:text-purple-300 transition-colors"
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
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-red-400 text-xs flex items-center mt-2"
                              >
                                <AlertTriangle
                                  size={12}
                                  className="mr-1 shrink-0"
                                />{" "}
                                <span className="truncate">{termsError}</span>
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          onClick={prevStep}
                          className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-white font-medium transition-all flex items-center justify-center space-x-2 group"
                        >
                          <ChevronLeft
                            size={18}
                            className="group-hover:-translate-x-1 transition-transform"
                          />
                          <span>Back</span>
                        </button>

                        <button
                          onClick={handleNext}
                          className="flex-2 py-3.5 bg-linear-to-r from-purple-600 to-fuchsia-600 rounded-xl text-white font-medium hover:from-purple-500 hover:to-fuchsia-500 transition-all duration-300 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transform hover:scale-[1.02]"
                        >
                          <span>Create Account</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 4 && !backendError && (
                  <motion.div
                    key="step4-success"
                    className="flex flex-col items-center justify-center text-center py-8 h-full"
                    custom={1}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      type: "tween",
                      ease: "easeInOut",
                      duration: 0.3,
                    }}
                  >
                    <div className="w-20 h-20 rounded-3xl bg-linear-to-br from-purple-500/20 to-fuchsia-500/20 border border-purple-500/30 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(168,85,247,0.2)]">
                      <Mail size={36} className="text-purple-400" />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3">
                      Check your inbox!
                    </h3>

                    <p className="text-zinc-400 text-[15px] mb-8 max-w-sm leading-relaxed">
                      We've sent a verification email to{" "}
                      <span className="text-purple-300 font-semibold bg-purple-500/10 px-2 py-0.5 rounded ml-1 mr-1">
                        {email}
                      </span>
                      . Click the link inside to complete your registration.
                    </p>

                    <div className="w-full space-y-4 mt-auto">
                      <button
                        onClick={handleClose}
                        className="w-full py-3.5 bg-linear-to-r from-purple-600 to-fuchsia-600 rounded-xl text-white font-medium hover:from-purple-500 hover:to-fuchsia-500 transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.3)] transform hover:scale-[1.02]"
                      >
                        Got it, thanks!
                      </button>

                      <p className="text-sm text-zinc-500 pt-4">
                        Didn't receive it?{" "}
                        <button
                          onClick={handleResend}
                          className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                        >
                          Resend email
                        </button>
                      </p>
                    </div>
                  </motion.div>
                )}

                {step === 4 && backendError && (
                  <motion.div
                    key="step4-error"
                    className="flex flex-col items-center justify-center text-center py-8 h-full"
                    custom={1}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      type: "tween",
                      ease: "easeInOut",
                      duration: 0.3,
                    }}
                  >
                    <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(239,68,68,0.15)]">
                      <AlertTriangle size={36} className="text-red-400" />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-6">
                      Registration Failed
                    </h3>

                    <div className="w-full p-4 rounded-xl bg-red-500/5 border border-red-500/20 mb-8 text-left">
                      <p className="text-red-200 text-sm">{backendError}</p>
                    </div>

                    <div className="w-full mt-auto">
                      <button
                        onClick={resetForm}
                        className="w-full py-3.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-white font-medium transition-all flex items-center justify-center space-x-2 group"
                      >
                        <ChevronLeft
                          size={18}
                          className="group-hover:-translate-x-1 transition-transform"
                        />
                        <span>Try Again</span>
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 5 && (
                  <motion.div
                    key="step5"
                    className="flex flex-col items-center justify-center text-center py-8 h-full"
                    custom={1}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      type: "tween",
                      ease: "easeInOut",
                      duration: 0.3,
                    }}
                  >
                    <div
                      className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-8 ${
                        verificationStatus === "success"
                          ? "bg-purple-500/20 border border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.2)]"
                          : "bg-red-500/10 border border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.15)]"
                      }`}
                    >
                      {verificationStatus === "success" ? (
                        <CheckCircle size={36} className="text-purple-400" />
                      ) : (
                        <AlertTriangle size={36} className="text-red-400" />
                      )}
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-4">
                      {verificationStatus === "success"
                        ? "Verification Successful!"
                        : "Verification Failed"}
                    </h3>

                    <p className="text-zinc-400 text-[15px] mb-10 max-w-sm leading-relaxed p-4 bg-white/5 rounded-xl border border-white/5">
                      {verificationMessage}
                    </p>

                    <div className="w-full mt-auto">
                      {verificationStatus === "success" ? (
                        <button
                          onClick={onSignInClick}
                          className="w-full py-3.5 bg-linear-to-r from-purple-600 to-fuchsia-600 rounded-xl text-white font-medium hover:from-purple-500 hover:to-fuchsia-500 transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.3)] transform hover:scale-[1.02]"
                        >
                          Sign In to Continue
                        </button>
                      ) : (
                        <button
                          onClick={handleClose}
                          className="w-full py-3.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-white font-medium transition-all"
                        >
                          Close Window
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
