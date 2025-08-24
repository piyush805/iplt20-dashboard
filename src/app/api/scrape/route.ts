// src/app/api/scrape/route.ts
import { NextRequest, NextResponse } from "next/server";
import { LiveRepository } from "@/server/repos/live.repo";
import { PointsRepository } from "@/server/repos/points.repo";
import { ScheduleRepository } from "@/server/repos/schedule.repo";
import { MemoryCache } from "@/lib/cache";

// Create singleton cache and repository instances
const cache = new MemoryCache();
const liveRepo = new LiveRepository(cache);
const pointsRepo = new PointsRepository(cache);
const scheduleRepo = new ScheduleRepository(cache);

export async function POST(request: NextRequest) {
  try {
    // Check for admin key
    const adminKey = request.headers.get("X-ADMIN-SCRAPE-KEY");
    if (!adminKey || adminKey !== process.env.ADMIN_SCRAPE_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Manual scrape triggered");

    const results = {
      live: false,
      points: false,
      schedule: false,
    };

    const errors: string[] = [];

    // Force refresh all data sources
    try {
      await liveRepo.forceRefresh();
      results.live = true;
      console.log("Live data refreshed successfully");
    } catch (error) {
      const errorMsg = `Live scrape failed: ${
        error instanceof Error ? error.message : error
      }`;
      console.error(errorMsg);
      errors.push(errorMsg);
    }

    try {
      await pointsRepo.forceRefresh();
      results.points = true;
      console.log("Points table refreshed successfully");
    } catch (error) {
      const errorMsg = `Points scrape failed: ${
        error instanceof Error ? error.message : error
      }`;
      console.error(errorMsg);
      errors.push(errorMsg);
    }

    try {
      await scheduleRepo.forceRefresh();
      results.schedule = true;
      console.log("Schedule refreshed successfully");
    } catch (error) {
      const errorMsg = `Schedule scrape failed: ${
        error instanceof Error ? error.message : error
      }`;
      console.error(errorMsg);
      errors.push(errorMsg);
    }

    // Get cache status for debugging
    const cacheStatus = {
      live: await liveRepo.getCacheStatus(),
      points: await pointsRepo.getCacheStatus(),
      schedule: await scheduleRepo.getCacheStatus(),
    };

    return NextResponse.json({
      ok: true,
      updated: results,
      errors: errors.length > 0 ? errors : undefined,
      cacheStatus,
      timestamp: new Date().toISOString(),
      message: `Scraping completed. Updated: ${
        Object.values(results).filter(Boolean).length
      }/3 sources`,
    });
  } catch (error) {
    console.error("Error in /api/scrape:", error);
    return NextResponse.json(
      {
        error: "Failed to trigger scrape",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Also add GET endpoint for cache status
export async function GET(request: NextRequest) {
  try {
    // Optional: Check for admin key for GET requests too
    const adminKey = request.headers.get("X-ADMIN-SCRAPE-KEY");
    if (adminKey && adminKey !== process.env.ADMIN_SCRAPE_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cacheStatus = {
      live: await liveRepo.getCacheStatus(),
      points: await pointsRepo.getCacheStatus(),
      schedule: await scheduleRepo.getCacheStatus(),
    };

    return NextResponse.json({
      ok: true,
      cacheStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error getting cache status:", error);
    return NextResponse.json(
      { error: "Failed to get cache status" },
      { status: 500 }
    );
  }
}
