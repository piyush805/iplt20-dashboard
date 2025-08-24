// src/server/repos/live.repo.ts
import { Cache } from "@/lib/cache";
import { LiveResponse } from "@/server/types";
import {
  scrapeLiveWithCheerio,
  ScrapeResult,
} from "@/server/scraper/iplt20.cheerio";
import fs from "fs/promises";
import path from "path";

export class LiveRepository {
  private cache: Cache;
  private cacheKey = "live-match-data";

  constructor(cache: Cache) {
    this.cache = cache;
  }

  // Get TTL based on match status
  private getTTL(liveData: LiveResponse): number {
    if (liveData.match?.status === "LIVE") {
      return 15; // 15 seconds for live matches
    }
    if (liveData.match?.status === "SCHEDULED") {
      return 300; // 5 minutes for scheduled matches
    }
    return 900; // 15 minutes for completed/no matches
  }

  // Get cached data or scrape fresh data
  async getCachedOrScrape(): Promise<LiveResponse> {
    try {
      // Try to get from cache first
      const cached = await this.cache.get<ScrapeResult<LiveResponse>>(
        this.cacheKey
      );

      if (cached) {
        console.log(
          `Live data cache hit: ${cached.source} data from ${cached.fetchedAt}`
        );
        return cached.data;
      }

      console.log("Live data cache miss, scraping...");
      return await this.scrapeAndCache();
    } catch (error) {
      console.error("Error in getCachedOrScrape:", error);

      // Try to get stale cache as fallback
      const staleCache = await this.cache.get<ScrapeResult<LiveResponse>>(
        this.cacheKey + ":stale"
      );
      if (staleCache) {
        console.log("Using stale cache as fallback");
        return staleCache.data;
      }

      // Final fallback to fixtures
      return await this.getFallbackData();
    }
  }

  // Scrape fresh data and cache it
  async scrapeAndCache(): Promise<LiveResponse> {
    try {
      let scrapeResult: ScrapeResult<LiveResponse>;

      // Try scraping with Cheerio
      if (process.env.SCRAPER_MODE !== "playwright") {
        try {
          scrapeResult = await scrapeLiveWithCheerio();
        } catch (scrapeError) {
          console.error("Cheerio scraping failed:", scrapeError);
          // TODO: Implement Playwright fallback if enabled
          throw scrapeError;
        }
      } else {
        // TODO: Implement Playwright scraper
        throw new Error("Playwright scraper not implemented yet");
      }

      // Validate the scraped data
      const validated = LiveResponse.parse(scrapeResult.data);
      scrapeResult.data = validated;

      // Cache the result with appropriate TTL
      const ttl = this.getTTL(validated);
      await this.cache.set(this.cacheKey, scrapeResult, ttl);

      // Also cache as stale backup (longer TTL)
      await this.cache.set(this.cacheKey + ":stale", scrapeResult, ttl * 10);

      console.log(`Live data scraped and cached with TTL: ${ttl}s`);
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
        60
      ); // 1 minute TTL for fallback

      return fallback;
    }
  }

  // Force refresh (bypass cache)
  async forceRefresh(): Promise<LiveResponse> {
    console.log("Force refreshing live data...");
    await this.cache.del(this.cacheKey);
    return await this.scrapeAndCache();
  }

  // Get fallback data from fixtures
  private async getFallbackData(): Promise<LiveResponse> {
    try {
      const fixturePath = path.join(process.cwd(), "src/fixtures/live.json");
      const raw = await fs.readFile(fixturePath, "utf8");
      const data = JSON.parse(raw);
      return LiveResponse.parse(data);
    } catch (error) {
      console.error("Error loading fallback data:", error);

      // Return minimal fallback
      return {
        match: null,
        live: null,
        next: null,
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
      const cached = await this.cache.get<ScrapeResult<LiveResponse>>(
        this.cacheKey
      );

      if (!cached) {
        return { cached: false };
      }

      const age = Math.floor(
        (Date.now() - new Date(cached.fetchedAt).getTime()) / 1000
      );
      const ttl = this.getTTL(cached.data);
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
