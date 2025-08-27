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

    // Fetch points table from group standings endpoint
    console.log("Fetching points table from group standings...");
    return await fetchPointsFromStandings();
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

// Helper function to fetch points table from group standings endpoint
async function fetchPointsFromStandings(): Promise<ScrapeResult<PointsTable>> {
  try {
    console.log("Fetching points table from group standings endpoint...");

    const url = `${
      SCRAPER_CONFIG.baseUrl
    }/ipl/feeds/stats/203-groupstandings.js?ongroupstandings=_jqjsp&_${Date.now()}=`;
    const response = await fetchWithRetry(url);
    console.log("Raw response length:", response.length);
    console.log("Response starts with:", response.substring(0, 100));

    // The response format is ongroupstandings({...})
    const jsonMatch = response.match(/ongroupstandings\((\{[\s\S]*?\})\)/);
    if (!jsonMatch) {
      console.error(
        "Regex failed. Response preview:",
        response.substring(0, 500)
      );
      throw new Error(
        "Could not extract JSON data from group standings response"
      );
    }

    const jsonData = JSON.parse(jsonMatch[1]);
    console.log("Group standings data structure:", Object.keys(jsonData));

    if (!jsonData.points || !Array.isArray(jsonData.points)) {
      throw new Error("No points data found in group standings response");
    }

    const standings = jsonData.points;
    console.log(`Found ${standings.length} teams in standings`);

    const pointsRows = standings.map((team: any) => {
      // Parse "ForTeams": "2447/246.4" format
      const forTeams = team.ForTeams?.split("/") || ["0", "0"];
      const againstTeam = team.AgainstTeam?.split("/") || ["0", "0"];

      // Parse "Performance": "W,W,W,L,W" format
      const performance = team.Performance?.split(",").map((p: string) => {
        if (p === "W") return "W";
        if (p === "L") return "L";
        return "N"; // Default to N for any other values
      }) || ["N", "N", "N", "N", "N"];

      return {
        team: team.TeamCode as TeamId,
        played: parseInt(team.Matches) || 0,
        won: parseInt(team.Wins) || 0,
        lost: parseInt(team.Loss) || 0,
        tied: parseInt(team.Tied) || 0,
        nr: parseInt(team.NoResult) || 0,
        nrr: parseFloat(team.NetRunRate) || 0,
        for: {
          runs: parseInt(forTeams[0]) || 0,
          overs: parseFloat(forTeams[1]) || 0,
        },
        against: {
          runs: parseInt(againstTeam[0]) || 0,
          overs: parseFloat(againstTeam[1]) || 0,
        },
        points: parseInt(team.Points) || 0,
        form: performance.slice(0, 5) as ("N" | "W" | "L")[],
      };
    });

    // Sort by points (highest first)
    pointsRows.sort((a: any, b: any) => b.points - a.points);

    console.log(`Processed ${pointsRows.length} teams from standings`);

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
    console.error("Error fetching points from standings:", error);
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
