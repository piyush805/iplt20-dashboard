import MatchCard from "@/components/ui/MatchCard";
import { APP_TEXT } from "@/constants/text";
import { UpcomingMatchesSectionProps } from "@/types";

export default function UpcomingMatchesSection({
  livePayload,
}: UpcomingMatchesSectionProps) {
  return (
    <section className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-upcoming rounded-full"></div>
          <h2 className="text-3xl font-bold text-foreground">
            {APP_TEXT.upcomingMatches.title}
          </h2>
        </div>
        <a
          href="/schedule"
          className="text-primary hover:text-primary-glow font-medium flex items-center gap-2 transition-colors duration-300"
        >
          {APP_TEXT.upcomingMatches.viewAllButton}
        </a>
      </div>

      {livePayload?.next ? (
        <div className="max-w-4xl mx-auto">
          <MatchCard
            match={livePayload.next}
            className="opacity-90 hover:opacity-100 transition-opacity duration-300"
          />
        </div>
      ) : (
        <div className="bg-gradient-card rounded-xl p-8 text-center border border-border shadow-card">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {APP_TEXT.upcomingMatches.noMatchesTitle}
          </h3>
          <p className="text-muted-foreground">
            {APP_TEXT.upcomingMatches.noMatchesDescription}
          </p>
        </div>
      )}
    </section>
  );
}
