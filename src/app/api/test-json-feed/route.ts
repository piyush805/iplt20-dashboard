import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Testing JSON feed directly...");

    const url = `https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/feeds/203-matchschedule.js?MatchSchedule=_jqjsp&_${Date.now()}=`;

    console.log("Fetching from:", url);

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
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
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const text = await response.text();
    console.log("Response length:", text.length);
    console.log("First 500 chars:", text.substring(0, 500));

    // Try to extract JSON - the format is MatchSchedule({...})
    const jsonMatch = text.match(/MatchSchedule\((\{[\s\S]*?\})\)/);

    if (!jsonMatch) {
      console.log("No JSON match found");
      return NextResponse.json({
        success: false,
        error: "No JSON match found",
        responseLength: text.length,
        sample: text.substring(0, 1000),
      });
    }

    console.log("JSON match found, length:", jsonMatch[1].length);

    const jsonData = JSON.parse(jsonMatch[1]);
    console.log("JSON parsed successfully");
    console.log("Matchsummary length:", jsonData.Matchsummary?.length || 0);

    if (jsonData.Matchsummary && jsonData.Matchsummary.length > 0) {
      const firstMatch = jsonData.Matchsummary[0];
      console.log("First match:", {
        id: firstMatch.MatchID,
        name: firstMatch.MatchName,
        status: firstMatch.MatchStatus,
        teams: [
          firstMatch.FirstBattingTeamName,
          firstMatch.SecondBattingTeamName,
        ],
        date: firstMatch.MATCH_COMMENCE_START_DATE,
      });
    }

    return NextResponse.json({
      success: true,
      responseLength: text.length,
      jsonLength: jsonMatch[1].length,
      matchCount: jsonData.Matchsummary?.length || 0,
      sampleMatch: jsonData.Matchsummary?.[0] || null,
    });
  } catch (error) {
    console.error("Error testing JSON feed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
