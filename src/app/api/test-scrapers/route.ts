// src/app/api/test-scrapers/route.ts
import { NextResponse } from "next/server";
import {
  scrapeScheduleWithCheerio,
  scrapePointsWithCheerio,
  scrapeLiveWithCheerio,
} from "@/server/scraper/iplt20.cheerio";

export async function GET() {
  try {
    console.log("Testing all scrapers...");

    // Test all three scrapers
    const [scheduleResult, pointsResult, liveResult] = await Promise.all([
      scrapeScheduleWithCheerio(),
      scrapePointsWithCheerio(),
      scrapeLiveWithCheerio(),
    ]);

    const testResults = {
      timestamp: new Date().toISOString(),
      schedule: {
        success: scheduleResult.source === "json-feed",
        source: scheduleResult.source,
        data: scheduleResult.data,
        matchesFound: scheduleResult.data.matches?.length || 0,
      },
      points: {
        success: pointsResult.source === "json-feed",
        source: pointsResult.source,
        data: pointsResult.data,
        teamsFound: pointsResult.data.rows?.length || 0,
      },
      live: {
        success: liveResult.source === "json-feed",
        source: liveResult.source,
        data: liveResult.data,
        hasLiveMatch: !!liveResult.data.match,
      },
    };

    console.log("Scraper test completed:", {
      schedule: testResults.schedule.matchesFound + " matches",
      points: testResults.points.teamsFound + " teams",
      live: testResults.live.hasLiveMatch
        ? "Live match found"
        : "No live match",
    });

    return NextResponse.json(testResults);
  } catch (error) {
    console.error("Scraper test failed:", error);
    return NextResponse.json(
      {
        error: "Scraper test failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
