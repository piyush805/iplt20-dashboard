"use client";

import { useAppStore } from "@/store/useAppStore";

import HeroSection from "@/components/sections/HeroSection";
import LiveMatchesSection from "@/components/sections/LiveMatchesSection";
import UpcomingMatchesSection from "@/components/sections/UpcomingMatchesSection";

export default function IPLVistaDashboard() {
  const { livePayload, error } = useAppStore();

  return (
    <div className="space-y-12 pt-8 pb-12">
      <HeroSection />
      <LiveMatchesSection livePayload={livePayload} error={error} />
      <UpcomingMatchesSection livePayload={livePayload} />
    </div>
  );
}
