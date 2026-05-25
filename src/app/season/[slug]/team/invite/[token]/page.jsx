"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import API from "@/utils/axios";
import { showToast } from "@/utils/Toast";

function Spinner() {
  return (
    <svg
      className="spinner"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="10"
        cy="10"
        r="8"
        stroke="#3f3f46"
        strokeWidth="1.5"
      />
      <path
        d="M10 2a8 8 0 0 1 8 8"
        stroke="#fafaf9"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function InviteAccept() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const slug = params?.slug;
  const token = params?.token;
  const referralCode = searchParams?.get("code");

  const { isAuthenticated, status } = useSelector((state) => state.auth);
  const [phase, setPhase] = useState("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "loading") return;

    if (!isAuthenticated) {
      const redirect =
        window.location.pathname + window.location.search;
      localStorage.setItem("postLoginRedirect", redirect);
      router.replace("/");
      return;
    }

    const acceptInvite = async () => {
      setPhase("joining");
      try {
        const res = await API.post(`/api/v1/seasons/${slug}/team/join`, {
          token,
          referralCode,
        });

        if (res?.success || res?.data?.success) {
          const msg =
            res?.data?.message || res?.message || "Joined team successfully";
          showToast("success", msg);
          setPhase("done");
          const redirect =
            res?.data?.redirect || `/seasons/${slug}/team-setup`;
          setTimeout(() => router.replace(redirect), 800);
          return;
        }

        const msg =
          res?.data?.message || res?.message || "Failed to accept invite";
        showToast("error", msg);
        setPhase("error");
        setMessage(msg);
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Unable to accept invite";
        showToast("error", msg);
        setPhase("error");
        setMessage(msg);
        setTimeout(
          () => router.replace(`/seasons/${slug}/team-setup`),
          1200
        );
      }
    };

    acceptInvite();
  }, [isAuthenticated, status, slug, token, referralCode, router]);

  const isLoading =
    phase === "idle" || phase === "joining" || status === "loading";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #09090b;
          font-family: 'Sora', sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .page {
          min-height: 100dvh;
          background: #09090b;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        /* subtle grid */
        .page::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
          background-size: 64px 64px;
          pointer-events: none;
        }

        /* vignette */
        .page::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, #09090b 100%);
          pointer-events: none;
        }

        .card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          gap: 32px;
          animation: fadeUp .4s ease both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* wordmark */
        .wordmark {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .wordmark-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #fafaf9;
        }

        .wordmark-text {
          font-size: 13px;
          font-weight: 500;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: #fafaf9;
        }

        /* divider */
        .divider {
          height: 1px;
          background: #27272a;
        }

        /* status block */
        .status-block {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .label {
          font-size: 11px;
          font-weight: 400;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: #52525b;
        }

        .heading {
          font-size: 28px;
          font-weight: 300;
          color: #fafaf9;
          line-height: 1.2;
          letter-spacing: -.01em;
        }

        .sub {
          font-size: 13px;
          font-weight: 300;
          color: #71717a;
          line-height: 1.6;
        }

        .sub.error-text {
          color: #a1a1aa;
        }

        /* progress row */
        .progress-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .track {
          flex: 1;
          height: 1px;
          background: #27272a;
          border-radius: 99px;
          overflow: hidden;
        }

        .bar {
          height: 100%;
          background: #fafaf9;
          border-radius: 99px;
          width: 0%;
          animation: fill 1.8s cubic-bezier(.4,0,.2,1) infinite;
        }

        @keyframes fill {
          0%   { width: 0%;   opacity: 1; }
          70%  { width: 85%;  opacity: 1; }
          100% { width: 85%;  opacity: 0; }
        }

        .bar.done {
          width: 100%;
          animation: none;
          opacity: 1;
          background: #fafaf9;
        }

        .bar.error {
          width: 40%;
          animation: none;
          opacity: 1;
          background: #52525b;
        }

        /* spinner */
        .spinner {
          animation: spin .9s linear infinite;
          flex-shrink: 0;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* done check */
        .check-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
          color: #fafaf9;
        }

        /* error x */
        .x-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
          color: #71717a;
        }

        /* footer */
        .footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .footer-label {
          font-size: 11px;
          font-weight: 400;
          letter-spacing: .06em;
          text-transform: uppercase;
          color: #3f3f46;
        }

        .footer-tag {
          font-size: 11px;
          font-weight: 400;
          letter-spacing: .06em;
          text-transform: uppercase;
          color: #3f3f46;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .footer-tag::before {
          content: '';
          display: block;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #3f3f46;
        }
      `}</style>

      <div className="page">
        <div className="card">

          {/* wordmark */}
          <div className="wordmark">
            <div className="wordmark-dot" />
            <span className="wordmark-text">Invite</span>
          </div>

          <div className="divider" />

          {/* status */}
          <div className="status-block">
            <span className="label">
              {isLoading ? "Processing" : phase === "done" ? "Success" : "Notice"}
            </span>

            <div className="heading">
              {isLoading
                ? "Joining your team"
                : phase === "done"
                ? "You're in"
                : "Something went wrong"}
            </div>

            <p className={`sub${phase === "error" ? " error-text" : ""}`}>
              {isLoading
                ? "Verifying your invite token and adding you to the team."
                : phase === "done"
                ? "Redirecting you to team setup now."
                : message || "We couldn't accept your invite. Redirecting shortly."}
            </p>
          </div>

          {/* progress */}
          <div className="progress-row">
            {isLoading ? (
              <Spinner />
            ) : phase === "done" ? (
              <svg className="check-icon" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                <path d="M6.5 10l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg className="x-icon" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                <path d="M7.5 7.5l5 5M12.5 7.5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}

            <div className="track">
              <div className={`bar${phase === "done" ? " done" : phase === "error" ? " error" : ""}`} />
            </div>
          </div>

          <div className="divider" />

          {/* footer */}
          <div className="footer">
            <span className="footer-label">Season / {slug ?? "—"}</span>
            <span className="footer-tag">
              {isLoading ? "Verifying" : phase === "done" ? "Verified" : "Failed"}
            </span>
          </div>

        </div>
      </div>
    </>
  );
}