// src/app/api/points/route.ts
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { scrapePointsWithCheerio } from "@/server/scraper/iplt20.cheerio";
import { Schemas } from "@/types";

export async function GET() {
  try {
    console.log("Fetching live points table data...");

    // Get live data from scraper
    const result = await scrapePointsWithCheerio();

    if (result.source === "json-feed") {
      console.log("Live points table data fetched successfully");
      return NextResponse.json(result.data);
    } else {
      console.log("Scraper failed, falling back to dummy data");
      throw new Error("Scraper returned dummy data");
    }
  } catch (error) {
    console.error("Error fetching live points data:", error);

    // Fallback to dummy data if scraper fails
    try {
      const fixturePath = path.join(process.cwd(), "src/fixtures/points.json");
      const raw = await fs.readFile(fixturePath, "utf8");
      const data = JSON.parse(raw);

      console.log("Serving fallback dummy data");
      const validated = Schemas.PointsTable.parse(data);
      return NextResponse.json(validated);
    } catch (fallbackError) {
      console.error("Fallback data also failed:", fallbackError);
      return NextResponse.json(
        {
          error:
            "Failed to fetch points data from both live and fallback sources",
        },
        { status: 500 }
      );
    }
  }
}
