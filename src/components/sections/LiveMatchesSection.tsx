import MatchCard from "@/components/ui/MatchCard";
import ActionButton from "@/components/ui/ActionButton";
import { APP_TEXT } from "@/constants/text";
import { LiveMatchesSectionProps } from "@/types";

export default function LiveMatchesSection({
  livePayload,
  error,
}: LiveMatchesSectionProps) {
  return (
    <section className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-live rounded-full animate-pulse-glow"></div>
          <h2 className="text-3xl font-bold text-foreground">
            {APP_TEXT.liveMatches.title}
          </h2>
          {livePayload?.match?.status === "LIVE" && (
            <span className="bg-live text-white text-sm px-3 py-1 rounded-full animate-pulse-glow font-medium">
              {APP_TEXT.liveMatches.liveBadge}
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6 shadow-card">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {livePayload?.match ? (
        <div className="max-w-4xl mx-auto">
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
          <h3 className="text-2xl font-bold text-foreground mb-3">
            {APP_TEXT.liveMatches.noMatchTitle}
          </h3>
          <p className="text-muted-foreground text-lg mb-6">
            {APP_TEXT.liveMatches.noMatchDescription}
          </p>
          <ActionButton href="/schedule" variant="primary" size="md">
            {APP_TEXT.liveMatches.viewScheduleButton}
          </ActionButton>
        </div>
      )}
    </section>
  );
}
