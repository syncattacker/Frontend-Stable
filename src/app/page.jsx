"use client";

import React, { lazy, Suspense } from "react";
import { ArrowUp } from "lucide-react";
import { useInView } from "react-intersection-observer";

import Landing from "@/components/home/Landing";

const AboutUs = lazy(() => import("@/components/home/AboutUs"));
const CTAStrip = lazy(() => import("@/components/home/CTAStrip"));
const Footer = lazy(() => import("@/components/footer/Footer"));

const Home = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "300px 0px",
  });

  return (
    <div className="bg-black min-h-screen w-full relative">
      <Landing />

      <div ref={ref}>
        {inView && (
          <Suspense fallback={null}>
            <AboutUs />
            <CTAStrip />
            <Footer />
          </Suspense>
        )}
      </div>

      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] backdrop-blur-xl text-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.25)] transition-all duration-300 hover:bg-white/[0.1] hover:text-white hover:scale-105 active:scale-95"
        aria-label="Scroll to Top"
      >
        <ArrowUp size={18} strokeWidth={2.2} />
      </button>
    </div>
  );
};

export default Home;
