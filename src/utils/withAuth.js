"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { showToast } from "@/utils/toast.jsx";
import NotAuthenticatedLoader from "@/components/loaders/NotAuthenticatedLoader";

// Auth verification is dispatched once, globally, by <AuthInitializer /> in
// the root layout — this HOC only reacts to the resulting status instead of
// dispatching its own verifyUser(), which used to race AuthInitializer's
// dispatch and fire a duplicate /auth/me request on every protected page.
export const withAuth = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const router = useRouter();

    const { isAuthenticated, status } = useSelector((state) => state.auth);

    useEffect(() => {
      if (status === "failed") {
        showToast("error", "Invalid session, please login again");
      }
    }, [status]);

    useEffect(() => {
      if (status !== "loading" && status !== "idle" && !isAuthenticated) {
        router.replace("/");
      }
    }, [isAuthenticated, status, router]);

    if (status === "loading" || status === "idle") {
      return <NotAuthenticatedLoader />;
    }

    if (!isAuthenticated) {
      return <NotAuthenticatedLoader />;
    }

    return <WrappedComponent {...props} />;
  };

  AuthenticatedComponent.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return AuthenticatedComponent;
};