import React, { useEffect, useState } from "react";

const NotAuthenticatedLoader = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen font-outfit flex items-center justify-center bg-black px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse delay-1000" />

      <div
        className={`relative transition-all duration-700 ease-out transform ${
          mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
        } w-full max-w-2xl`}
      >
        <div className="relative bg-linear-to-br from-zinc-900/90 via-black/95 to-zinc-950/90 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />

          <div className="flex flex-col sm:flex-row gap-8 p-10">
            <div
              className={`flex flex-col items-center justify-center bg-linear-to-br from-zinc-800/50 to-zinc-900/50 p-8 rounded-2xl w-full sm:w-[40%] relative overflow-hidden transition-all duration-700 ease-out ${
                mounted
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-10 opacity-0"
              }`}
            >
              <div className="relative mb-4">
                <div className="w-20 h-20 border-[7px] border-transparent border-t-purple-400 border-r-blue-400 rounded-full animate-spin" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-white/10 rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-purple-500/20 rounded-full blur-xl animate-pulse" />
              </div>
            </div>

            <div
              className={`flex flex-col justify-center gap-4 w-full sm:w-[60%] transition-all duration-700 delay-150 ease-out ${
                mounted
                  ? "translate-x-0 opacity-100"
                  : "translate-x-10 opacity-0"
              }`}
            >
              <div className="space-y-2">
                <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-2">
                  <span className="text-[11px] font-semibold text-white/50 tracking-[0.15em] uppercase">
                    Access Denied
                  </span>
                </div>

                <h2 className="text-3xl font-bold tracking-tight leading-tight">
                  <span className="bg-linear-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                    Authentication Required
                  </span>
                </h2>

                <p className="text-sm text-white/40 leading-relaxed">
                  Your session has expired or you're not currently
                  authenticated. Please sign in to access this secure area.
                </p>
              </div>

              <button className="group relative mt-2 px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 rounded-xl font-medium text-sm text-white overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:scale-[1.02] active:scale-[0.98]">
                <div className="absolute inset-0 bg-linear-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center justify-center gap-2">
                  Sign In
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </div>
    </div>
  );
};

export default NotAuthenticatedLoader;
