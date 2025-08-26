// src/server/repos/schedule.repo.ts
import { Cache } from "@/lib/cache";
import { ScheduleResponse, Schemas } from "@/types";
import {
  scrapeScheduleWithCheerio,
  ScrapeResult,
} from "@/server/scraper/iplt20.cheerio";
import fs from "fs/promises";
import path from "path";

export class ScheduleRepository {
  private cache: Cache;
  private cacheKey = "schedule-data";

  constructor(cache: Cache) {
    this.cache = cache;
  }

  // Schedule changes infrequently, so longer TTL
  private getTTL(): number {
    return 21600; // 6 hours
  }

  // Get cached data or scrape fresh data
  async getCachedOrScrape(): Promise<ScheduleResponse> {
    try {
      // Try to get from cache first
      const cached = await this.cache.get<ScrapeResult<ScheduleResponse>>(
        this.cacheKey
      );

      if (cached) {
        console.log(
          `Schedule cache hit: ${cached.source} data from ${cached.fetchedAt}`
        );
        return cached.data;
      }

      console.log("Schedule cache miss, scraping...");
      return await this.scrapeAndCache();
    } catch (error) {
      console.error("Error in getCachedOrScrape:", error);

      // Try to get stale cache as fallback
      const staleCache = await this.cache.get<ScrapeResult<ScheduleResponse>>(
        this.cacheKey + ":stale"
      );
      if (staleCache) {
        console.log("Using stale schedule cache as fallback");
        return staleCache.data;
      }

      // Final fallback to fixtures
      return await this.getFallbackData();
    }
  }

  // Scrape fresh data and cache it
  async scrapeAndCache(): Promise<ScheduleResponse> {
    try {
      let scrapeResult: ScrapeResult<ScheduleResponse>;

      // Try scraping with Cheerio
      if (process.env.SCRAPER_MODE !== "playwright") {
        try {
          scrapeResult = await scrapeScheduleWithCheerio();
        } catch (scrapeError) {
          console.error("Schedule Cheerio scraping failed:", scrapeError);
          throw scrapeError;
        }
      } else {
        // TODO: Implement Playwright scraper
        throw new Error("Playwright scraper not implemented yet");
      }

      // Validate the scraped data
      const validated = Schemas.ScheduleResponse.parse(scrapeResult.data);
      scrapeResult.data = validated;

      // Cache the result with appropriate TTL
      const ttl = this.getTTL();
      await this.cache.set(this.cacheKey, scrapeResult, ttl);

      // Also cache as stale backup (longer TTL)
      await this.cache.set(this.cacheKey + ":stale", scrapeResult, ttl * 4);

      console.log(`Schedule scraped and cached with TTL: ${ttl}s`);
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
        3600
      ); // 1 hour TTL for fallback

      return fallback;
    }
  }

  // Force refresh (bypass cache)
  async forceRefresh(): Promise<ScheduleResponse> {
    console.log("Force refreshing schedule...");
    await this.cache.del(this.cacheKey);
    return await this.scrapeAndCache();
  }

  // Get fallback data from fixtures
  private async getFallbackData(): Promise<ScheduleResponse> {
    try {
      const fixturePath = path.join(
        process.cwd(),
        "src/fixtures/schedule.json"
      );
      const raw = await fs.readFile(fixturePath, "utf8");
      const data = JSON.parse(raw);
      return Schemas.ScheduleResponse.parse(data);
    } catch (error) {
      console.error("Error loading schedule fallback data:", error);

      // Return minimal fallback
      return {
        season: "IPL 2025",
        matches: [],
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
      const cached = await this.cache.get<ScrapeResult<ScheduleResponse>>(
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
