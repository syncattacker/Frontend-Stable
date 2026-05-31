"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { verifyUser } from "@/store/authSlice";

export default function AuthInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(verifyUser());
  }, [dispatch]);

  return null;
}