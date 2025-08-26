"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { LiveResponse } from "@/types";

interface ClientStoreInitializerProps {
  initialLiveData?: LiveResponse | null;
}

export default function ClientStoreInitializer({
  initialLiveData,
}: ClientStoreInitializerProps) {
  const { setLivePayload } = useAppStore();

  useEffect(() => {
    // Initialize store with server-side data
    if (initialLiveData) {
      setLivePayload(initialLiveData);
    }
  }, [initialLiveData, setLivePayload]);

  // This component doesn't render anything
  return null;
}
