"use client";

import React, { useEffect, useState } from "react";

export default function NotAuthenticatedLoader() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);

  const steps = ["Checking session", "Verifying credentials", "Access denied"];

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Animate progress bar: fill to ~85% then stop (simulating a failed check)
  useEffect(() => {
    let frame;
    let current = 0;
    const targets = [30, 65, 85]; // pause points
    let stepIndex = 0;

    const tick = () => {
      const target = targets[stepIndex] ?? 85;
      if (current < target) {
        current += 0.6;
        setProgress(current);
        frame = requestAnimationFrame(tick);
      } else {
        // pause, then move to next step
        if (stepIndex < targets.length - 1) {
          setTimeout(() => {
            stepIndex++;
            setStep(stepIndex);
            frame = requestAnimationFrame(tick);
          }, 500);
        }
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0C0C0A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

        @keyframes cardRise {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes fromLeft {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0);     }
        }
        @keyframes fromRight {
          from { opacity: 0; transform: translateX(10px); }
          to   { opacity: 1; transform: translateX(0);    }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes dotBlink {
          0%, 100% { opacity: 0.2; }
          50%       { opacity: 1;   }
        }
        @keyframes scanPulse {
          0%, 100% { opacity: 0.4; transform: scaleY(1);   }
          50%       { opacity: 0.9; transform: scaleY(1.1); }
        }
        @keyframes lockShake {
          0%,100% { transform: rotate(0deg);   }
          20%      { transform: rotate(-4deg);  }
          40%      { transform: rotate(4deg);   }
          60%      { transform: rotate(-3deg);  }
          80%      { transform: rotate(3deg);   }
        }

        .na-card  { animation: cardRise  0.45s cubic-bezier(0.16,1,0.3,1) forwards; }
        .na-left  { animation: fromLeft  0.5s  cubic-bezier(0.16,1,0.3,1) 0.1s forwards; opacity: 0; }
        .na-right { animation: fromRight 0.5s  cubic-bezier(0.16,1,0.3,1) 0.15s forwards; opacity: 0; }

        .na-btn {
          transition: background 0.15s, border-color 0.15s;
          cursor: pointer;
        }
        .na-btn:hover {
          background: rgba(232,229,223,0.05) !important;
          border-color: rgba(232,229,223,0.3) !important;
        }
        .na-btn:active { transform: scale(0.985); }
        .na-arrow { transition: transform 0.15s; }
        .na-btn:hover .na-arrow { transform: translateX(3px); }

        .na-dot {
          width: 4px; height: 4px; border-radius: 50%;
          background: #9E9B94;
          animation: dotBlink 1.2s ease-in-out infinite;
        }
        .na-dot:nth-child(2) { animation-delay: 0.2s; }
        .na-dot:nth-child(3) { animation-delay: 0.4s; }

        .na-shimmer-bar {
          background: linear-gradient(
            90deg,
            rgba(254,252,232,0.06) 0%,
            rgba(254,252,232,0.22) 40%,
            rgba(254,252,232,0.06) 80%
          );
          background-size: 200% 100%;
          animation: shimmer 1.6s linear infinite;
        }

        .na-lock-shake { animation: lockShake 0.5s ease 1.2s 1; }

        .na-step-done   { color: #6B6860; }
        .na-step-active { color: #B0ADA6; }
        .na-step-denied { color: #C97070; }

        @media (max-width: 520px) {
          .na-card  { flex-direction: column !important; }
          .na-left  { border-right: none !important; border-bottom: 0.5px solid rgba(255,255,255,0.06) !important; padding: 32px !important; }
          .na-right { padding: 32px !important; }
        }
      `}</style>

      <div
        className="na-card"
        style={{
          width: "100%",
          maxWidth: 580,
          opacity: 0,
          display: "flex",
          flexDirection: "row",
          background: "rgba(255,255,255,0.018)",
          border: "0.5px solid rgba(255,255,255,0.08)",
          borderRadius: 20,
          overflow: "hidden",
        }}
      >
        {/* LEFT — lock icon */}
        <div
          className="na-left"
          style={{
            width: "38%",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
            padding: "48px 36px",
            background: "rgba(255,255,255,0.022)",
            borderRight: "0.5px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Lock icon — shakes when denied */}
          <svg
            className="na-lock-shake"
            width="34" height="38"
            viewBox="0 0 34 38"
            fill="none"
          >
            <rect
              x="1.8" y="17"
              width="30.4" height="20"
              rx="4.5"
              stroke="#E8E5DF"
              strokeWidth="1.2"
            />
            <path
              d="M9.5 17V12.5a7.5 7.5 0 0 1 15 0V17"
              stroke="#E8E5DF"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>

          {/* Step checklist */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
            {steps.map((s, i) => (
              <div
                key={s}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 11,
                  fontFamily: "'Outfit', sans-serif",
                  letterSpacing: "0.04em",
                  transition: "color 0.4s",
                }}
                className={
                  i < step
                    ? "na-step-done"
                    : i === step
                    ? "na-step-active"
                    : "na-step-done"
                }
              >
                {/* Icon per step */}
                {i < step ? (
                  // done — checkmark
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#6B6860" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : i === step && step < 2 ? (
                  // active — spinner dots
                  <div style={{ display: "flex", gap: 2 }}>
                    <span className="na-dot" />
                    <span className="na-dot" />
                    <span className="na-dot" />
                  </div>
                ) : i === 2 && step === 2 ? (
                  // denied — X
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 2l6 6M8 2l-6 6" stroke="#C97070" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <div style={{ width: 10, height: 10, borderRadius: "50%", border: "1px solid #3A3835" }} />
                )}
                <span style={{ color: i === 2 && step === 2 ? "#C97070" : undefined }}>
                  {s}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — content */}
        <div
          className="na-right"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 20,
            padding: "44px 40px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#7A7770",
              }}
            >
              Access Denied
            </span>

            <h2
              style={{
                margin: 0,
                fontSize: 42,
                fontWeight: 700,
                color: "#F0EDE8",
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              Authentication<br />Required
            </h2>

            <p
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 300,
                color: "#8A8880",
                lineHeight: 1.75,
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              Your session has expired or you're not currently authenticated.
              Please sign in to continue.
            </p>
          </div>

          {/* ── Progress bar ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div
              style={{
                height: 2,
                borderRadius: 99,
                background: "rgba(255,255,255,0.1)",
                overflow: "hidden",
              }}
            >
              <div
                className={progress < 85 ? "na-shimmer-bar" : ""}
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  borderRadius: 99,
                  background: progress >= 85
                    ? "rgba(180,80,80,0.85)"
                    : "rgba(254,252,232,0.55)",
                  transition: "width 0.1s linear, background 0.5s ease",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: "'Outfit', sans-serif",
                fontSize: 11,
                fontWeight: 400,
                color: "#7A7770",
                letterSpacing: "0.03em",
              }}
            >
              <span>
                {step === 0 && "Checking session..."}
                {step === 1 && "Verifying credentials..."}
                {step === 2 && "Access denied"}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>

          <div style={{ height: "0.5px", background: "rgba(255,255,255,0.06)" }} />

          <button
            className="na-btn"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              width: "100%",
              padding: "13px 20px",
              background: "transparent",
              border: "0.5px solid rgba(232,229,223,0.16)",
              borderRadius: 10,
              color: "#E8E5DF",
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: "0.04em",
              fontFamily: "'Outfit', sans-serif",
            }}
            onClick={() => location.reload()}
          >
            Retry
            <svg
              className="na-arrow"
              width="14" height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M2 7h10M8 3l4 4-4 4"
                stroke="#E8E5DF"
                strokeWidth="1.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 