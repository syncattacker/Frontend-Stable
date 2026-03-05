"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/authSlice";
import { showToast } from "@/utils/toast";
import API from "@/utils/axios";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const dispatch = useDispatch();
  const [socketInstance, setSocketInstance] = useState(null);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [notifications, setNotifications] = useState([]);
  const logoutTriggeredRef = useRef(false);

  const hardLogout = async (reason = "Session expired") => {
    if (logoutTriggeredRef.current) return;
    logoutTriggeredRef.current = true;

    console.warn("🔐 Hard logout:", reason);

    try {
      await API.post(
        `${import.meta.env.NEXT_AUTH_LOGOUT_API}`,
        {},
        { withCredentials: true },
      );
    } catch (err) {
      console.warn("Logout API failed (ignored):", err.message);
    }

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    dispatch(logout());
    showToast("error", reason);

    window.location.href = "/";
  };

  useEffect(() => {
    if (isAuthenticated && !socketRef.current) {
      logoutTriggeredRef.current = false;

      const socket = io(`${import.meta.env.NEXT_PUBLIC_BACKEND_URL}`, {
        withCredentials: true,
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        timeout: 10000,
      });

      socketRef.current = socket;
      setSocketInstance(socket);

      socket.on("connect", () => {
        console.log("✅ WebSocket connected:", socket.id);
      });

      socket.on("disconnect", (reason) => {
        console.warn("❌ WebSocket disconnected:", reason);
        if (reason === "io server disconnect") {
          hardLogout("Session invalidated.");
        }
      });

      socket.on("connect_error", (err) => {
        console.error("⚠️ Socket connection error:", err.message);
        if (
          err.message === "Session invalid" ||
          err.message === "Unauthorized" ||
          err.message === "Unauthorized socket connection" ||
          err.message === "Invalid token" ||
          err.message === "No cookies provided"
        ) {
          hardLogout("Session expired. Please login again.");
        }
      });

      socket.on("forceLogout", () => {
        hardLogout("You were logged out from another device.");
      });

      socket.on("newNotification", (notification) => {
        setNotifications((prev) => [notification, ...prev]);
      });
    }
    if (!isAuthenticated && socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isAuthenticated, dispatch]);

  return (
    <SocketContext.Provider
      value={{
        socket: socketInstance,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
