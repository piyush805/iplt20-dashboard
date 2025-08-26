// src/server/repos/points.repo.ts
import { Cache } from "@/lib/cache";
import { PointsTable, Schemas } from "@/types";
import {
  scrapePointsWithCheerio,
  ScrapeResult,
} from "@/server/scraper/iplt20.cheerio";
import fs from "fs/promises";
import path from "path";

export class PointsRepository {
  private cache: Cache;
  private cacheKey = "points-table-data";

  constructor(cache: Cache) {
    this.cache = cache;
  }

  // Get TTL based on time of day and match schedule
  private getTTL(): number {
    const now = new Date();
    const hour = now.getHours();

    // During match windows (2 PM - 11 PM IST), refresh more frequently
    if (hour >= 14 && hour <= 23) {
      return 60; // 1 minute during match times
    }

    // Off-season or non-match hours
    return 900; // 15 minutes otherwise
  }

  // Get cached data or scrape fresh data
  async getCachedOrScrape(): Promise<PointsTable> {
    try {
      // Try to get from cache first
      const cached = await this.cache.get<ScrapeResult<PointsTable>>(
        this.cacheKey
      );

      if (cached) {
        console.log(
          `Points table cache hit: ${cached.source} data from ${cached.fetchedAt}`
        );
        return cached.data;
      }

      console.log("Points table cache miss, scraping...");
      return await this.scrapeAndCache();
    } catch (error) {
      console.error("Error in getCachedOrScrape:", error);

      // Try to get stale cache as fallback
      const staleCache = await this.cache.get<ScrapeResult<PointsTable>>(
        this.cacheKey + ":stale"
      );
      if (staleCache) {
        console.log("Using stale points table cache as fallback");
        return staleCache.data;
      }

      // Final fallback to fixtures
      return await this.getFallbackData();
    }
  }

  // Scrape fresh data and cache it
  async scrapeAndCache(): Promise<PointsTable> {
    try {
      let scrapeResult: ScrapeResult<PointsTable>;

      // Try scraping with Cheerio
      if (process.env.SCRAPER_MODE !== "playwright") {
        try {
          scrapeResult = await scrapePointsWithCheerio();
        } catch (scrapeError) {
          console.error("Points table Cheerio scraping failed:", scrapeError);
          throw scrapeError;
        }
      } else {
        // TODO: Implement Playwright scraper
        throw new Error("Playwright scraper not implemented yet");
      }

      // Validate the scraped data
      const validated = Schemas.PointsTable.parse(scrapeResult.data);
      scrapeResult.data = validated;

      // Cache the result with appropriate TTL
      const ttl = this.getTTL();
      await this.cache.set(this.cacheKey, scrapeResult, ttl);

      // Also cache as stale backup (longer TTL)
      await this.cache.set(this.cacheKey + ":stale", scrapeResult, ttl * 20);

      console.log(`Points table scraped and cached with TTL: ${ttl}s`);
      return validated;
    } catch (error) {
      console.error("Error in scrapeAndCache:", error);

      // If scraping fails, try to return cached data or fallback
      const fallback = await this.getFallbackData();

      // Cache the fallback briefly to avoid repeated failures
      await this.cache.set(
        this.cacheKey,
        {
          data: fallback,
          fetchedAt: new Date().toISOString(),
          source: "dummy",
        },
        300
      ); // 5 minute TTL for fallback

      return fallback;
    }
  }

  // Force refresh (bypass cache)
  async forceRefresh(): Promise<PointsTable> {
    console.log("Force refreshing points table...");
    await this.cache.del(this.cacheKey);
    return await this.scrapeAndCache();
  }

  // Get fallback data from fixtures
  private async getFallbackData(): Promise<PointsTable> {
    try {
      const fixturePath = path.join(process.cwd(), "src/fixtures/points.json");
      const raw = await fs.readFile(fixturePath, "utf8");
      const data = JSON.parse(raw);
      return Schemas.PointsTable.parse(data);
    } catch (error) {
      console.error("Error loading points table fallback data:", error);

      // Return minimal fallback
      return {
        season: "IPL 2025",
        updatedAt: new Date().toISOString(),
        rows: [],
      };
    }
  }

  // Get cache status for debugging
  async getCacheStatus(): Promise<{
    cached: boolean;
    age?: number;
    source?: string;
    nextRefresh?: number;
  }> {
    try {
      const cached = await this.cache.get<ScrapeResult<PointsTable>>(
        this.cacheKey
      );

      if (!cached) {
        return { cached: false };
      }

      const age = Math.floor(
        (Date.now() - new Date(cached.fetchedAt).getTime()) / 1000
      );
      const ttl = this.getTTL();
      const nextRefresh = Math.max(0, ttl - age);

      return {
        cached: true,
        age,
        source: cached.source,
        nextRefresh,
      };
    } catch {
      return { cached: false };
    }
  }
}
