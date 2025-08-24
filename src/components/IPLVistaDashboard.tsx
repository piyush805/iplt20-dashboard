"use client";

import { useAppStore } from "@/store/useAppStore";
import MatchCard from "@/components/ui/MatchCard";
import Link from "next/link";

export default function IPLVistaDashboard() {
  const { livePayload, error } = useAppStore();

  return (
    <div className="space-y-12">
      {/* Live Matches Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-live rounded-full animate-pulse-glow"></div>
            <h2 className="text-3xl font-bold text-foreground">Live Matches</h2>
            {livePayload?.match?.status === "LIVE" && (
              <span className="bg-live text-white text-sm px-3 py-1 rounded-full animate-pulse-glow font-medium">
                LIVE
              </span>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6 shadow-card">
            <p className="text-red-800 flex items-center gap-2">
              <span className="text-xl">⚠</span>
              {error}
            </p>
          </div>
        )}

        {livePayload?.match ? (
          <div className="max-w-4xl">
            <MatchCard
              match={livePayload.match}
              liveScore={livePayload.live}
              className={
                livePayload.match.status === "LIVE"
                  ? "match-card-live ring-2 ring-live/30"
                  : ""
              }
            />
          </div>
        ) : (
          <div className="bg-gradient-card rounded-xl p-12 text-center border border-border shadow-card">
            <div className="text-6xl mb-6">🏏</div>
            <h3 className="text-2xl font-bold text-foreground mb-3">
              No Live Match
            </h3>
            <p className="text-muted-foreground text-lg mb-6">
              Check back during match hours for live cricket action
            </p>
            <Link
              href="/schedule"
              className="bg-gradient-primary text-white px-6 py-3 rounded-xl hover:shadow-elegant transition-all duration-300 inline-flex items-center gap-2"
            >
              📅 View Match Schedule
            </Link>
          </div>
        )}
      </section>

      {/* Upcoming Matches Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-upcoming rounded-full"></div>
            <h2 className="text-3xl font-bold text-foreground">
              Upcoming Matches
            </h2>
          </div>
          <Link
            href="/schedule"
            className="text-primary hover:text-primary-glow font-medium flex items-center gap-2 transition-colors duration-300"
          >
            View All Matches →
          </Link>
        </div>

        {livePayload?.next ? (
          <div className="max-w-4xl">
            <MatchCard
              match={livePayload.next}
              className="opacity-90 hover:opacity-100 transition-opacity duration-300"
            />
          </div>
        ) : (
          <div className="bg-gradient-card rounded-xl p-8 text-center border border-border shadow-card">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Upcoming Matches
            </h3>
            <p className="text-muted-foreground">
              All matches for today have been completed
            </p>
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section className="bg-gradient-card rounded-xl p-8 border border-border shadow-card">
        <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
          Explore IPL Vista
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/schedule"
            className="group bg-white dark:bg-card rounded-xl p-6 shadow-card hover:shadow-elegant transition-all duration-300 border border-border"
          >
            <div className="text-center">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                📅
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">
                Match Schedule
              </h4>
              <p className="text-muted-foreground text-sm">
                Complete IPL T20 match schedule with live scores and results
              </p>
            </div>
          </Link>

          <Link
            href="/points-table"
            className="group bg-white dark:bg-card rounded-xl p-6 shadow-card hover:shadow-elegant transition-all duration-300 border border-border"
          >
            <div className="text-center">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                🏆
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">
                Points Table
              </h4>
              <p className="text-muted-foreground text-sm">
                Current standings and team performance in IPL T20 2024
              </p>
            </div>
          </Link>

          <Link
            href="/teams"
            className="group bg-white dark:bg-card rounded-xl p-6 shadow-card hover:shadow-elegant transition-all duration-300 border border-border"
          >
            <div className="text-center">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                👥
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">
                IPL Teams
              </h4>
              <p className="text-muted-foreground text-sm">
                Meet the 10 franchises competing in IPL T20 2024
              </p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
