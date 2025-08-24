// src/app/api/points/route.ts
import { NextResponse } from "next/server";
import { PointsRepository } from "@/server/repos/points.repo";
import { MemoryCache } from "@/lib/cache";

// Create a singleton cache instance
const cache = new MemoryCache();
const pointsRepo = new PointsRepository(cache);

export async function GET() {
  try {
    // Check if we should use dummy data (default to true for development)
    if (process.env.USE_DUMMY !== "0") {
      // Import and return fixture data
      const fs = await import("fs/promises");
      const path = await import("path");
      const fixturePath = path.join(process.cwd(), "src/fixtures/points.json");
      const raw = await fs.readFile(fixturePath, "utf8");
      const data = JSON.parse(raw);

      return NextResponse.json(data);
    }

    // Use repository to get cached or scraped data
    const pointsData = await pointsRepo.getCachedOrScrape();

    return NextResponse.json(pointsData);
  } catch (error) {
    console.error("Error in /api/points:", error);

    // Try to return fallback data on error
    try {
      const fs = await import("fs/promises");
      const path = await import("path");
      const fixturePath = path.join(process.cwd(), "src/fixtures/points.json");
      const raw = await fs.readFile(fixturePath, "utf8");
      const fallbackData = JSON.parse(raw);

      return NextResponse.json(fallbackData);
    } catch {
      return NextResponse.json(
        { error: "Failed to fetch points data" },
        { status: 500 }
      );
    }
  }
}
