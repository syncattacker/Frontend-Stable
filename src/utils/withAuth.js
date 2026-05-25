"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { verifyUser } from "@/store/authSlice";
import { showToast } from "@/utils/Toast.jsx";
import NotAuthenticatedLoader from "@/components/loaders/NotAuthenticatedLoader";

export const withAuth = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const router = useRouter();
    const dispatch = useDispatch();

    const { isAuthenticated, status } = useSelector((state) => state.auth);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          if (status === "idle") {
            await dispatch(verifyUser()).unwrap();
          }
        } catch (error) {
          showToast("error", "Invalid session, please login again");
          router.replace("/");
        }
      };

      checkAuth();
    }, [dispatch, status, router]);

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