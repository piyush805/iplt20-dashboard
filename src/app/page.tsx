import IPLVistaDashboard from "@/components/IPLVistaDashboard";
import ClientStoreInitializer from "@/components/ClientStoreInitializer";
import liveData from "@/fixtures/live.json";
import { LiveResponse, MatchStatus, TeamId } from "@/types";

// Main Page of the app "/"
export default function HomePage() {
  // Transform the JSON data to match the expected types
  const transformLiveData = (): LiveResponse => {
    return {
      match: liveData.match
        ? {
            ...liveData.match,
            status: liveData.match.status as MatchStatus,
            teams: liveData.match.teams as [TeamId, TeamId],
            venue: {
              name: liveData.match.venue.name,
              city: liveData.match.venue.city,
            },
            toss: liveData.match.toss || undefined,
          }
        : null,
      live: liveData.live
        ? {
            ...liveData.live,
            innings: liveData.live.innings.map((inning) => ({
              ...inning,
              battingTeam: inning.battingTeam as TeamId,
            })),
          }
        : null,
      next: liveData.next
        ? {
            ...liveData.next,
            status: liveData.next.status as MatchStatus,
            teams: liveData.next.teams as [TeamId, TeamId],
            venue: {
              name: liveData.next.venue.name,
              city: liveData.next.venue.city,
            },
            toss: liveData.next.toss || undefined,
          }
        : null,
    };
  };

  return (
    <>
      {/* setup app state */}
      <ClientStoreInitializer initialLiveData={transformLiveData()} />
      <IPLVistaDashboard />
    </>
  );
}
