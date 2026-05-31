"use client";

import React, { lazy, Suspense } from "react";
import { ArrowUp } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { useState } from "react";
import SignUp from "@/components/auth/SignUp";
import Login from "@/components/auth/Login";
import Navbar from "@/components/navbar/Navbar";

import Landing from "@/components/home/Landing";

const AboutUs = lazy(() => import("@/components/home/AboutUs"));
const CTAStrip = lazy(() => import("@/components/home/CTAStrip"));
const Footer = lazy(() => import("@/components/footer/Footer"));

const Home = ({ onOpenSignUp, onOpenLogin }) => {
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "300px 0px",
  });

  return (
    <div className="bg-black min-h-screen w-full relative">
      <Navbar onOpenSignUp={() => setSignUpOpen(true)} />

      <Landing
        onOpenSignUp={() => setSignUpOpen(true)}
        onOpenLogin={() => setLoginOpen(true)}
      />

      <div ref={ref}>
        {inView && (
          <Suspense fallback={null}>
            <AboutUs />
            <CTAStrip onOpenSignUp={onOpenSignUp} />
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
      <SignUp
        isOpen={signUpOpen}
        onClose={() => setSignUpOpen(false)}
        onSignInClick={() => {
          setSignUpOpen(false);
          setLoginOpen(true);
        }}
        verificationToken={null}
      />
      <Login
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSignUpClick={() => {
          setLoginOpen(false);
          setSignUpOpen(true);
        }}
      />
    </div>
  );
};

export default Home;
