// src/server/scraper/iplt20.cheerio.ts
import { LiveResponse, PointsTable, ScheduleResponse, TeamId } from "@/types";

export type ScrapeResult<T> = {
  data: T;
  fetchedAt: string;
  source: "json-feed" | "dummy";
};

// Base scraper configuration
const SCRAPER_CONFIG = {
  baseUrl: "https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com",
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
  timeout: 10000,
  retries: 3,
  retryDelay: 2000,
};

// Helper function for HTTP requests with retry logic
async function fetchWithRetry(
  url: string,
  retries = SCRAPER_CONFIG.retries
): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Fetching ${url} (attempt ${attempt}/${retries})`);

      const response = await fetch(url, {
        headers: {
          "User-Agent": SCRAPER_CONFIG.userAgent,
          Accept: "*/*",
          "Accept-Language": "en-US,en;q=0.6",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          Pragma: "no-cache",
          Referer: "https://www.iplt20.com/",
          "Sec-Fetch-Dest": "script",
          "Sec-Fetch-Mode": "no-cors",
          "Sec-Fetch-Site": "cross-site",
          "Sec-Fetch-Storage-Access": "none",
          "Sec-GPC": "1",
        },
        signal: AbortSignal.timeout(SCRAPER_CONFIG.timeout),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.text();
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);

      if (attempt === retries) {
        throw new Error(
          `Failed to fetch ${url} after ${retries} attempts: ${error}`
        );
      }

      // Exponential backoff
      await new Promise((resolve) =>
        setTimeout(
          resolve,
          SCRAPER_CONFIG.retryDelay * Math.pow(2, attempt - 1)
        )
      );
    }
  }

  throw new Error("Unexpected error in fetchWithRetry");
}

// Team ID mapping from the JSON feed
const TEAM_MAPPING: Record<string, TeamId> = {
  "Chennai Super Kings": "CSK",
  "Mumbai Indians": "MI",
  "Royal Challengers Bangalore": "RCB",
  "Royal Challengers Bengaluru": "RCB",
  "Kolkata Knight Riders": "KKR",
  "Sunrisers Hyderabad": "SRH",
  "Punjab Kings": "PBKS",
  "Rajasthan Royals": "RR",
  "Gujarat Titans": "GT",
  "Delhi Capitals": "DC",
  "Lucknow Super Giants": "LSG",
};

function normalizeTeamName(teamName: string): TeamId {
  return TEAM_MAPPING[teamName] || "CSK"; // Default fallback
}

// Live match scraper - now using the JSON feed
export async function scrapeLiveWithCheerio(): Promise<
  ScrapeResult<LiveResponse>
> {
  try {
    console.log("Attempting to scrape live data from IPL JSON feed...");

    const url = `${
      SCRAPER_CONFIG.baseUrl
    }/ipl/feeds/203-matchschedule.js?MatchSchedule=_jqjsp&_${Date.now()}=`;
    const response = await fetchWithRetry(url);

    // The response format is MatchSchedule({...})
    const jsonMatch = response.match(/MatchSchedule\((\{[\s\S]*?\})\)/);

    if (!jsonMatch) {
      throw new Error("Could not extract JSON data from response");
    }

    const jsonData = JSON.parse(jsonMatch[1]);
    console.log(
      "Successfully parsed IPL JSON feed, looking for live matches..."
    );

    // Look for matches with "Live" status
    const liveMatches = jsonData.Matchsummary.filter(
      (match: any) =>
        match.MatchStatus === "Live" || match.MatchStatus === "In Progress"
    );

    if (liveMatches.length > 0) {
      const liveMatch = liveMatches[0];
      console.log("Found live match:", liveMatch.MatchName);

      return {
        data: {
          match: {
            id: `live-${liveMatch.MatchID}`,
            status: "LIVE" as const,
            startTimeUTC: new Date(
              liveMatch.MATCH_COMMENCE_START_DATE
            ).toISOString(),
            venue: {
              name: liveMatch.GroundName || "Live Match",
              city: liveMatch.city || undefined,
            },
            teams: [
              normalizeTeamName(liveMatch.FirstBattingTeamName),
              normalizeTeamName(liveMatch.SecondBattingTeamName),
            ] as [TeamId, TeamId],
            toss: liveMatch.TossDetails || undefined,
          },
          live: {
            matchId: `live-${liveMatch.MatchID}`,
            innings: [
              {
                battingTeam: normalizeTeamName(liveMatch.FirstBattingTeamName),
                runs: parseInt(liveMatch["1FallScore"]) || 0,
                wickets: parseInt(liveMatch["1FallWickets"]) || 0,
                overs: parseFloat(liveMatch["1FallOvers"]) || 0,
              },
              {
                battingTeam: normalizeTeamName(liveMatch.SecondBattingTeamName),
                runs: parseInt(liveMatch["2FallScore"]) || 0,
                wickets: parseInt(liveMatch["2FallWickets"]) || 0,
                overs: parseFloat(liveMatch["2FallOvers"]) || 0,
              },
            ],
            currentOver: liveMatch.MatchProgress || "Live",
            target: liveMatch.RevisedTarget || undefined,
            resultText: liveMatch.Comments || undefined,
          },
          next: null,
        },
        fetchedAt: new Date().toISOString(),
        source: "json-feed",
      };
    }

    // No live match found, return null
    console.log("No live match found, returning null");
    return {
      data: {
        match: null,
        live: null,
        next: null,
      },
      fetchedAt: new Date().toISOString(),
      source: "json-feed",
    };
  } catch (error) {
    console.error(
      "Error scraping live data from JSON feed, falling back to dummy data:",
      error
    );

    // Return dummy data on error
    return {
      data: {
        match: null,
        live: null,
        next: null,
      },
      fetchedAt: new Date().toISOString(),
      source: "dummy",
    };
  }
}

// Points table scraper - now using the JSON feed
export async function scrapePointsWithCheerio(): Promise<
  ScrapeResult<PointsTable>
> {
  try {
    console.log("Attempting to scrape points table from IPL JSON feed...");

    // Calculate points table from match results since the feed contains all match data
    console.log("Calculating points table from match results...");
    return await calculatePointsFromMatches();
  } catch (error) {
    console.error("Error scraping points table:", error);

    return {
      data: {
        season: "IPL 2025",
        updatedAt: new Date().toISOString(),
        rows: [],
      },
      fetchedAt: new Date().toISOString(),
      source: "dummy",
    };
  }
}

// Helper function to calculate points table from match results
async function calculatePointsFromMatches(): Promise<
  ScrapeResult<PointsTable>
> {
  try {
    console.log("Calculating points table from match results...");

    const url = `${
      SCRAPER_CONFIG.baseUrl
    }/ipl/feeds/203-matchschedule.js?MatchSchedule=_jqjsp&_${Date.now()}=`;
    const response = await fetchWithRetry(url);

    // The response format is MatchSchedule({...})
    const jsonMatch = response.match(/MatchSchedule\((\{[\s\S]*?\})\)/);
    if (!jsonMatch) {
      throw new Error("Could not extract JSON data from response");
    }

    const jsonData = JSON.parse(jsonMatch[1]);

    // Filter completed matches
    const completedMatches = jsonData.Matchsummary.filter(
      (match: any) => match.MatchStatus === "Post"
    );

    console.log(`Found ${completedMatches.length} completed matches`);

    // Calculate points for each team
    const teamStats: Record<string, any> = {};

    completedMatches.forEach((match: any) => {
      const team1 = match.FirstBattingTeamName;
      const team2 = match.SecondBattingTeamName;
      const winner = match.WinningTeamID;
      const team1ID = match.FirstBattingTeamID;
      const team2ID = match.SecondBattingTeamID;

      // Initialize team stats if not exists
      if (!teamStats[team1]) {
        teamStats[team1] = {
          played: 0,
          won: 0,
          lost: 0,
          tied: 0,
          nr: 0,
          points: 0,
        };
      }
      if (!teamStats[team2]) {
        teamStats[team2] = {
          played: 0,
          won: 0,
          lost: 0,
          tied: 0,
          nr: 0,
          points: 0,
        };
      }

      // Update stats
      teamStats[team1].played++;
      teamStats[team2].played++;

      // Debug logging for first few matches
      if (Object.keys(teamStats).length <= 4) {
        console.log(`Match: ${team1} vs ${team2}`);
        console.log(`Winner ID: ${winner}, Type: ${typeof winner}`);
        console.log(`Team1 ID: ${team1ID}, Type: ${typeof team1ID}`);
        console.log(`Team2 ID: ${team2ID}, Type: ${typeof team2ID}`);
      }

      // Convert IDs to strings for comparison
      const winnerStr = String(winner);
      const team1IDStr = String(team1ID);
      const team2IDStr = String(team2ID);

      if (winnerStr === team1IDStr) {
        teamStats[team1].won++;
        teamStats[team1].points += 2;
        teamStats[team2].lost++;
        if (Object.keys(teamStats).length <= 4) console.log(`${team1} won`);
      } else if (winnerStr === team2IDStr) {
        teamStats[team2].won++;
        teamStats[team2].points += 2;
        teamStats[team1].lost++;
        if (Object.keys(teamStats).length <= 4) console.log(`${team2} won`);
      } else {
        // Tie or no result
        teamStats[team1].tied++;
        teamStats[team2].tied++;
        teamStats[team1].points += 1;
        teamStats[team2].points += 1;
        if (Object.keys(teamStats).length <= 4)
          console.log(
            `❌ Match marked as tie - winner: ${winner}, team1ID: ${team1ID}, team2ID: ${team2ID}`
          );
      }
    });

    // Calculate recent form for each team (last 5 matches)
    const teamForm: Record<string, ("W" | "L" | "N")[]> = {};

    // Sort matches by date (most recent first) to get proper form order
    const sortedMatches = [...completedMatches].sort(
      (a, b) =>
        new Date(b.MatchDate).getTime() - new Date(a.MatchDate).getTime()
    );

    // Calculate form for each team
    Object.keys(teamStats).forEach((teamName) => {
      teamForm[teamName] = [];

      // Get all matches for this team
      const teamMatches = sortedMatches.filter(
        (match) =>
          match.FirstBattingTeamName === teamName ||
          match.SecondBattingTeamName === teamName
      );

      // Get last 5 matches and determine result for each
      for (let i = 0; i < Math.min(5, teamMatches.length); i++) {
        const match = teamMatches[i];
        const winner = String(match.WinningTeamID);
        const team1ID = String(match.FirstBattingTeamID);
        const team2ID = String(match.SecondBattingTeamID);

        if (winner === team1ID && match.FirstBattingTeamName === teamName) {
          teamForm[teamName].push("W");
        } else if (
          winner === team2ID &&
          match.SecondBattingTeamName === teamName
        ) {
          teamForm[teamName].push("W");
        } else if (winner === "0" || winner === "" || winner === "null") {
          teamForm[teamName].push("N"); // Treat tie/no result as "N" for form
        } else {
          teamForm[teamName].push("L");
        }
      }

      // Pad with "N" if less than 5 matches
      while (teamForm[teamName].length < 5) {
        teamForm[teamName].unshift("N");
      }
    });

    // Convert to points table format
    const pointsRows = Object.entries(teamStats).map(([teamName, stats]) => ({
      team: normalizeTeamName(teamName),
      played: stats.played,
      won: stats.won,
      lost: stats.lost,
      tied: stats.tied,
      nr: stats.nr,
      nrr: 0, // NRR calculation would be more complex
      for: { runs: 0, overs: 0 }, // Would need to calculate from match details
      against: { runs: 0, overs: 0 },
      points: stats.points,
      form: teamForm[teamName] as ("N" | "W" | "L")[],
    }));

    // Sort by points (descending)
    pointsRows.sort((a, b) => b.points - a.points);

    console.log(`Calculated points for ${pointsRows.length} teams`);

    return {
      data: {
        season: "IPL 2025",
        updatedAt: new Date().toISOString(),
        rows: pointsRows,
      },
      fetchedAt: new Date().toISOString(),
      source: "json-feed",
    };
  } catch (error) {
    console.error("Error calculating points from matches:", error);
    throw error;
  }
}

// Schedule scraper - now using the JSON feed
export async function scrapeScheduleWithCheerio(): Promise<
  ScrapeResult<ScheduleResponse>
> {
  try {
    console.log("Attempting to scrape schedule from IPL JSON feed...");

    const url = `${
      SCRAPER_CONFIG.baseUrl
    }/ipl/feeds/203-matchschedule.js?MatchSchedule=_jqjsp&_${Date.now()}=`;
    const response = await fetchWithRetry(url);

    // The response format is MatchSchedule({...})
    const jsonMatch = response.match(/MatchSchedule\((\{[\s\S]*?\})\)/);
    if (!jsonMatch) {
      throw new Error("Could not extract JSON data from response");
    }

    const jsonData = JSON.parse(jsonMatch[1]);
    console.log("Successfully parsed IPL schedule from JSON feed");

    // Convert match data to our schedule format
    const matches = jsonData.Matchsummary.map((match: any, index: number) => ({
      id: `match-${match.MatchID}`,
      status:
        match.MatchStatus === "Post"
          ? ("COMPLETED" as const)
          : match.MatchStatus === "Live"
          ? ("LIVE" as const)
          : ("SCHEDULED" as const),
      startTimeUTC: new Date(match.MATCH_COMMENCE_START_DATE).toISOString(),
      venue: {
        name: match.GroundName || "TBD",
        city: match.city || undefined,
      },
      teams: [
        normalizeTeamName(match.FirstBattingTeamName),
        normalizeTeamName(match.SecondBattingTeamName),
      ] as [TeamId, TeamId],
      matchNumber: match.MatchOrder || `Match ${index + 1}`,
      toss: match.TossDetails || undefined,
    }));

    console.log(`Successfully parsed ${matches.length} matches from JSON feed`);

    return {
      data: {
        season: "IPL 2025",
        matches:
          matches.length > 0
            ? matches
            : [
                {
                  id: "fallback-match-1",
                  status: "SCHEDULED" as const,
                  startTimeUTC: new Date(
                    Date.now() + 24 * 60 * 60 * 1000
                  ).toISOString(),
                  venue: { name: "TBD", city: undefined },
                  teams: ["CSK", "MI"] as [TeamId, TeamId],
                  matchNumber: "Match 1",
                  toss: undefined,
                },
              ],
      },
      fetchedAt: new Date().toISOString(),
      source: "json-feed",
    };
  } catch (error) {
    console.error("Error scraping schedule from JSON feed:", error);

    return {
      data: {
        season: "IPL 2025",
        matches: [],
      },
      fetchedAt: new Date().toISOString(),
      source: "dummy",
    };
  }
}
