"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { verifyUser } from "@/store/authSlice";
import { showToast } from "@/utils/toast";
import NotAuthenticatedLoader from "@/components/loaders/NotAuthenticatedLoader";

export const withAuth = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { isAuthenticated, status } = useSelector((state) => state.auth);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        if (!isAuthenticated && status === "idle") {
          try {
            await dispatch(verifyUser()).unwrap();
          } catch (error) {
            showToast("error", "Invalid Session, please try logging in");
            router.replace("/");
          }
        }
        setIsChecking(false);
      };

      checkAuth();
    }, [dispatch, isAuthenticated, status]);

    useEffect(() => {
      if (!isChecking && !isAuthenticated && status === "failed") {
        router.replace("/");
      }
    }, [isChecking, isAuthenticated, status]);

    if (isChecking || status === "loading") {
      return <NotAuthenticatedLoader />;
    }

    if (!isAuthenticated) {
      return <NotAuthenticatedLoader />;
    }

    return <WrappedComponent {...props} />;
  };

  AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AuthenticatedComponent;
};