"use client";

import { useEffect } from "react";
import { initClientIntelligence } from "@/lib/client-intelligence";

export default function ClientIntelligenceInitializer() {
  useEffect(() => {
    initClientIntelligence();
  }, []);

  return null;
}
