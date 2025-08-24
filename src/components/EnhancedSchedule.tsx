"use client";

import { useState, useMemo } from "react";
import { ScheduleResponse, Match, MatchStatus } from "@/server/types";
import MatchCard from "@/components/ui/MatchCard";

interface EnhancedScheduleProps {
  initialData: ScheduleResponse | null;
}

type FilterStatus = "ALL" | MatchStatus;

export default function EnhancedSchedule({
  initialData,
}: EnhancedScheduleProps) {
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("ALL");
  const [teamFilter, setTeamFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Static list of teams for filtering
  const allTeams = [
    { id: "CSK", name: "Chennai Super Kings" },
    { id: "MI", name: "Mumbai Indians" },
    { id: "RCB", name: "Royal Challengers Bangalore" },
    { id: "KKR", name: "Kolkata Knight Riders" },
    { id: "SRH", name: "Sunrisers Hyderabad" },
    { id: "PBKS", name: "Punjab Kings" },
    { id: "RR", name: "Rajasthan Royals" },
    { id: "GT", name: "Gujarat Titans" },
    { id: "DC", name: "Delhi Capitals" },
    { id: "LSG", name: "Lucknow Super Giants" },
  ];

  // Filter and search matches
  const filteredMatches = useMemo(() => {
    if (!initialData?.matches) return [];

    let filtered = initialData.matches;

    // Filter by status
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((match) => match.status === statusFilter);
    }

    // Filter by team
    if (teamFilter !== "ALL") {
      filtered = filtered.filter((match) =>
        match.teams.includes(teamFilter as never)
      );
    }

    // Search by venue or match number
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (match) =>
          match.venue.name.toLowerCase().includes(query) ||
          (match.venue.city &&
            match.venue.city.toLowerCase().includes(query)) ||
          (match.matchNumber &&
            match.matchNumber.toLowerCase().includes(query)) ||
          match.teams.some((team) => team.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [initialData?.matches, statusFilter, teamFilter, searchQuery]);

  // Group matches by status for better organization
  const groupedMatches = useMemo(() => {
    const groups: Record<MatchStatus, Match[]> = {
      LIVE: [],
      SCHEDULED: [],
      COMPLETED: [],
    };

    filteredMatches.forEach((match) => {
      groups[match.status].push(match);
    });

    return groups;
  }, [filteredMatches]);

  const getStatusCount = (status: MatchStatus) => {
    return initialData?.matches?.filter((m) => m.status === status).length || 0;
  };

  const getStatusColor = (status: FilterStatus) => {
    switch (status) {
      case "LIVE":
        return "bg-red-500 text-white";
      case "SCHEDULED":
        return "bg-blue-500 text-white";
      case "COMPLETED":
        return "bg-green-500 text-white";
      default:
        return "bg-muted text-white";
    }
  };

  if (!initialData) {
    return (
      <div className="bg-card rounded-xl shadow-lg p-8 text-center border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Schedule Unavailable
        </h3>
        <p className="text-muted-foreground">
          Unable to load schedule data at this time
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filters and Search */}
      <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
        <h2 className="text-xl font-bold text-foreground mb-6">
          Filter & Search Matches
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Match Status
            </label>
            <div className="flex flex-wrap gap-2">
              {(
                ["ALL", "LIVE", "SCHEDULED", "COMPLETED"] as FilterStatus[]
              ).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all duration-200 ${
                    statusFilter === status
                      ? getStatusColor(status)
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {status}
                  {status !== "ALL" && (
                    <span className="ml-1 opacity-75">
                      ({getStatusCount(status as MatchStatus)})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Team Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Filter by Team
            </label>
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
            >
              <option value="ALL">All Teams</option>
              {allTeams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Search Matches
            </label>
            <input
              type="text"
              placeholder="Search by venue, city, or team..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground"
            />
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-4 p-3 bg-muted/20 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Showing <strong>{filteredMatches.length}</strong> of{" "}
            <strong>{initialData.matches.length}</strong> matches
            {statusFilter !== "ALL" && ` • Status: ${statusFilter}`}
            {teamFilter !== "ALL" && ` • Team: ${teamFilter}`}
            {searchQuery && ` • Search: "${searchQuery}"`}
          </p>
        </div>
      </div>

      {/* Match Groups */}
      {filteredMatches.length > 0 ? (
        <div className="space-y-8">
          {/* Live Matches */}
          {groupedMatches.LIVE.length > 0 && (
            <section>
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                🔴 Live Matches
                <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full animate-pulse">
                  {groupedMatches.LIVE.length}
                </span>
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {groupedMatches.LIVE.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </section>
          )}

          {/* Scheduled Matches */}
          {groupedMatches.SCHEDULED.length > 0 && (
            <section>
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                Upcoming Matches
                <span className="bg-blue-500 text-white text-sm px-2 py-1 rounded-full">
                  {groupedMatches.SCHEDULED.length}
                </span>
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {groupedMatches.SCHEDULED.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </section>
          )}

          {/* Completed Matches */}
          {groupedMatches.COMPLETED.length > 0 && (
            <section>
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                ✅ Completed Matches
                <span className="bg-green-500 text-white text-sm px-2 py-1 rounded-full">
                  {groupedMatches.COMPLETED.length}
                </span>
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {groupedMatches.COMPLETED.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    className="opacity-75 hover:opacity-100 transition-opacity"
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="bg-card rounded-xl shadow-lg p-8 text-center border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No Matches Found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or search criteria
          </p>
          <button
            onClick={() => {
              setStatusFilter("ALL");
              setTeamFilter("ALL");
              setSearchQuery("");
            }}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Schedule Statistics */}
      <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
        <h3 className="text-xl font-bold text-foreground mb-4">
          📊 Tournament Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-muted/20 rounded-lg">
            <div className="text-2xl font-bold text-foreground">
              {initialData.matches.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Matches</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {getStatusCount("LIVE")}
            </div>
            <div className="text-sm text-red-600">Live Now</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {getStatusCount("SCHEDULED")}
            </div>
            <div className="text-sm text-blue-600">Upcoming</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {getStatusCount("COMPLETED")}
            </div>
            <div className="text-sm text-green-600">Completed</div>
          </div>
        </div>
      </div>
    </div>
  );
}
