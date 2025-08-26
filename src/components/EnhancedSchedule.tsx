"use client";

import { useState, useMemo } from "react";
import { MatchStatus, Match, TeamId } from "@/types";
import ScheduleFilters from "@/components/schedule/ScheduleFilters";
import ScheduleGroups from "@/components/schedule/ScheduleGroups";
import { APP_TEXT } from "@/constants/text";
import { EnhancedScheduleProps } from "@/types";

export default function EnhancedSchedule({
  initialData,
}: EnhancedScheduleProps) {
  const [statusFilter, setStatusFilter] = useState<MatchStatus | "ALL">("ALL");
  const [teamFilter, setTeamFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter and search matches
  const filteredMatches = useMemo(() => {
    if (!initialData?.matches) return [];

    let filtered = initialData.matches;

    // Filter by status
    if (statusFilter !== "ALL") {
      filtered = filtered.filter(
        (match: Match) => match.status === statusFilter
      );
    }

    // Filter by team
    if (teamFilter !== "ALL") {
      filtered = filtered.filter((match: Match) =>
        match.teams.includes(teamFilter as TeamId)
      );
    }

    // Search by venue or match number
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (match: Match) =>
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

    filteredMatches.forEach((match: Match) => {
      groups[match.status].push(match);
    });

    return groups;
  }, [filteredMatches]);

  const getStatusCount = (status: MatchStatus) => {
    return (
      initialData?.matches?.filter((m: Match) => m.status === status).length ||
      0
    );
  };

  if (!initialData?.matches) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{APP_TEXT.common.loading}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ScheduleFilters
        statusFilter={statusFilter}
        teamFilter={teamFilter}
        searchQuery={searchQuery}
        onStatusFilterChange={setStatusFilter}
        onTeamFilterChange={setTeamFilter}
        onSearchQueryChange={setSearchQuery}
        getStatusCount={getStatusCount}
      />

      {filteredMatches.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{APP_TEXT.schedule.noResults}</p>
        </div>
      ) : (
        <ScheduleGroups groupedMatches={groupedMatches} />
      )}
    </div>
  );
}
