"use client";

import { motion } from "framer-motion";

const GlowButton = ({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  className = "",
  size = "md",
  fullWidth = false,
  icon: Icon = null,
}) => {
  const variantStyles = {
    primary: `
      bg-gradient-to-r from-[#A3FF12] via-[#B7FF4A] to-[#7CFF00]
      text-black font-bold
      shadow-[0_0_20px_rgba(163,255,18,0.35)]
      hover:shadow-[0_0_36px_rgba(163,255,18,0.55)]
      hover:brightness-110
    `,
    secondary: `
      bg-[rgba(255,255,255,0.05)]
      border border-[rgba(255,255,255,0.12)]
      text-gray-200
      hover:border-[rgba(163,255,18,0.4)]
      hover:text-[#A3FF12]
      hover:shadow-[0_0_16px_rgba(163,255,18,0.12)]
    `,
    danger: `
      bg-gradient-to-r from-red-600/80 to-red-700/60
      border border-red-500/30
      text-red-100
      hover:border-red-400/60
      hover:shadow-[0_0_20px_rgba(239,68,68,0.25)]
    `,
    ghost: `
      bg-transparent
      text-gray-400
      hover:text-[#A3FF12]
      hover:bg-[rgba(163,255,18,0.05)]
    `,
  };

  const sizeStyles = {
    sm: "px-4 py-1.5 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-sm",
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? {} : { scale: 0.97 }}
      whileHover={disabled ? {} : { scale: 1.01 }}
      transition={{ duration: 0.12, ease: [0.22, 1, 0.36, 1] }}
      className={`
        relative rounded-xl font-medium tracking-wide
        transition-all duration-[220ms]
        flex items-center justify-center gap-2
        overflow-hidden
        ${fullWidth ? "w-full" : ""}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
    >
      {variant === "primary" && !disabled && (
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
            backgroundSize: "200% 100%",
            animation: "liquidShimmer 2.4s linear infinite",
          }}
        />
      )}

      {Icon && <Icon size={15} className="relative z-10 flex-shrink-0" />}

      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export default GlowButton;