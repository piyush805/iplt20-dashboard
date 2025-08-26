// Test script for IPL scrapers
const {
  scrapeScheduleWithCheerio,
  scrapePointsWithCheerio,
} = require("./src/server/scraper/iplt20.cheerio.ts");

async function testScrapers() {
  console.log("🧪 Testing IPL Scrapers...\n");

  try {
    // Test Schedule Scraper
    console.log("📅 Testing Schedule Scraper...");
    const scheduleResult = await scrapeScheduleWithCheerio();
    console.log("✅ Schedule scraping successful!");
    console.log(`📊 Found ${scheduleResult.data.matches.length} matches`);
    console.log(`🔍 Source: ${scheduleResult.source}`);
    console.log(`⏰ Fetched at: ${scheduleResult.fetchedAt}`);

    if (scheduleResult.data.matches.length > 0) {
      console.log("\n📋 Sample match:");
      const sampleMatch = scheduleResult.data.matches[0];
      console.log(`   Match: ${sampleMatch.matchNumber}`);
      console.log(`   Teams: ${sampleMatch.teams.join(" vs ")}`);
      console.log(
        `   Venue: ${sampleMatch.venue.name}, ${
          sampleMatch.venue.city || "N/A"
        }`
      );
      console.log(`   Status: ${sampleMatch.status}`);
    }

    console.log("\n" + "=".repeat(50) + "\n");

    // Test Points Table Scraper
    console.log("🏆 Testing Points Table Scraper...");
    const pointsResult = await scrapePointsWithCheerio();
    console.log("✅ Points table scraping successful!");
    console.log(`📊 Found ${pointsResult.data.rows.length} teams`);
    console.log(`🔍 Source: ${pointsResult.source}`);
    console.log(`⏰ Fetched at: ${pointsResult.fetchedAt}`);

    if (pointsResult.data.rows.length > 0) {
      console.log("\n📋 Sample team:");
      const sampleTeam = pointsResult.data.rows[0];
      console.log(`   Team: ${sampleTeam.team}`);
      console.log(`   Position: ${sampleTeam.position || "N/A"}`);
      console.log(
        `   Played: ${sampleTeam.played}, Won: ${sampleTeam.won}, Lost: ${sampleTeam.lost}`
      );
      console.log(`   Points: ${sampleTeam.points}`);
      console.log(`   NRR: ${sampleTeam.nrr}`);
    }
  } catch (error) {
    console.error("❌ Scraper test failed:", error);
  }
}

// Run the test
testScrapers();
