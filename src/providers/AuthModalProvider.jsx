"use client";

import { createContext, useContext, useState } from "react";
import SignUp from "@/components/auth/SignUp";
import Login from "@/components/auth/Login";

const AuthModalContext = createContext(null);

export function AuthModalProvider({ children }) {
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const openSignUp = () => {
    setLoginOpen(false);
    setSignUpOpen(true);
  };

  const openLogin = () => {
    setSignUpOpen(false);
    setLoginOpen(true);
  };

  return (
    <AuthModalContext.Provider value={{ openSignUp, openLogin }}>
      {children}
      <SignUp
        isOpen={signUpOpen}
        onClose={() => setSignUpOpen(false)}
        onSignInClick={openLogin}
        verificationToken={null}
      />
      <Login
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSignUpClick={openSignUp}
      />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) {
    throw new Error("useAuthModal must be used within AuthModalProvider");
  }
  return ctx;
}
