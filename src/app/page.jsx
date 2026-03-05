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
        onOpenLogin={() => setLoginOpen(true)} // ← ye sahi hai
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
        className="fixed bottom-6 right-6 z-50 p-3 bg-linear-to-tr from-purple-900 to-[#a855f7] hover:bg-purple-700 text-white rounded-full shadow-lg transition-all duration-300 border border-white/10"
        aria-label="Scroll to Top"
      >
        <ArrowUp size={20} />
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
