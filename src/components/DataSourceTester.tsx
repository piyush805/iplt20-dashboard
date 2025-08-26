"use client";

import { useState } from "react";

interface ScraperTestResult {
  timestamp: string;
  schedule: {
    success: boolean;
    source: string;
    data: any;
    matchesFound: number;
  };
  points: {
    success: boolean;
    source: string;
    data: any;
    teamsFound: number;
  };
  live: {
    success: boolean;
    source: string;
    data: any;
    hasLiveMatch: boolean;
  };
}

export default function DataSourceTester() {
  const [testResult, setTestResult] = useState<ScraperTestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testAllScrapers = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🧪 Testing all scrapers...");
      const response = await fetch("/api/test-scrapers");

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setTestResult(result);
      console.log("✅ Scraper test results:", result);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg);
      console.error("❌ Scraper test failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          🧪 IPL Scraper Tester
        </h1>
        <p className="text-muted-foreground mb-6">
          Test all three scrapers: Schedule, Points Table, and Live Matches
        </p>

        <button
          onClick={testAllScrapers}
          disabled={loading}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 text-lg font-medium"
        >
          {loading ? "🔄 Testing..." : "🚀 Test All Scrapers"}
        </button>

        {error && (
          <div className="mt-4 text-red-600 font-medium bg-red-50 p-3 rounded-lg max-w-2xl mx-auto">
            ❌ Error: {error}
          </div>
        )}
      </div>

      {/* Test Results */}
      {testResult && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Test Results</h2>
            <p className="text-muted-foreground">
              Timestamp: {new Date(testResult.timestamp).toLocaleString()}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Schedule Results */}
            <div
              className={`bg-card p-6 rounded-lg border ${
                testResult.schedule.success
                  ? "border-green-200"
                  : "border-red-200"
              }`}
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                📅 Schedule Scraper
                {testResult.schedule.success ? "✅" : "❌"}
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Source:</strong> {testResult.schedule.source}
                </p>
                <p>
                  <strong>Matches Found:</strong>{" "}
                  {testResult.schedule.matchesFound}
                </p>
                <p>
                  <strong>Status:</strong>
                  <span
                    className={
                      testResult.schedule.success
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {testResult.schedule.success ? "Success" : "Failed"}
                  </span>
                </p>
                {testResult.schedule.matchesFound > 0 && (
                  <div className="mt-3 p-3 bg-muted rounded">
                    <strong>Sample Match:</strong>
                    <p className="text-xs mt-1">
                      {testResult.schedule.data.matches[0]?.matchNumber ||
                        "N/A"}{" "}
                      -
                      {testResult.schedule.data.matches[0]?.teams?.join(
                        " vs "
                      ) || "N/A"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Points Results */}
            <div
              className={`bg-card p-6 rounded-lg border ${
                testResult.points.success
                  ? "border-green-200"
                  : "border-red-200"
              }`}
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                🏆 Points Table Scraper
                {testResult.points.success ? "✅" : "❌"}
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Source:</strong> {testResult.points.source}
                </p>
                <p>
                  <strong>Teams Found:</strong> {testResult.points.teamsFound}
                </p>
                <p>
                  <strong>Status:</strong>
                  <span
                    className={
                      testResult.points.success
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {testResult.points.success ? "Success" : "Failed"}
                  </span>
                </p>
                {testResult.points.teamsFound > 0 && (
                  <div className="mt-3 p-3 bg-muted rounded">
                    <strong>Sample Team:</strong>
                    <p className="text-xs mt-1">
                      {testResult.points.data.rows[0]?.team || "N/A"} -
                      {testResult.points.data.rows[0]?.points || "N/A"} pts
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Live Results */}
            <div
              className={`bg-card p-6 rounded-lg border ${
                testResult.live.success ? "border-green-200" : "border-red-200"
              }`}
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                🔴 Live Match Scraper
                {testResult.live.success ? "✅" : "❌"}
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Source:</strong> {testResult.live.source}
                </p>
                <p>
                  <strong>Live Match:</strong>{" "}
                  {testResult.live.hasLiveMatch ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Status:</strong>
                  <span
                    className={
                      testResult.live.success
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {testResult.live.success ? "Success" : "Failed"}
                  </span>
                </p>
                {testResult.live.hasLiveMatch && (
                  <div className="mt-3 p-3 bg-muted rounded">
                    <strong>Live Match:</strong>
                    <p className="text-xs mt-1">
                      {testResult.live.data.match?.teams?.join(" vs ") || "N/A"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Raw Data (for debugging) */}
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">
              Raw Data (for debugging)
            </h3>
            <details className="text-sm">
              <summary className="cursor-pointer hover:text-blue-600">
                Click to expand
              </summary>
              <pre className="mt-2 p-3 bg-background rounded overflow-auto max-h-96">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-muted p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">What This Tests:</h3>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>
            <strong>Schedule Scraper:</strong> Extracts match fixtures, teams,
            venues, dates
          </li>
          <li>
            <strong>Points Table Scraper:</strong> Extracts team standings,
            stats, recent form
          </li>
          <li>
            <strong>Live Match Scraper:</strong> Extracts current live match
            data (if any)
          </li>
          <li>
            <strong>Data Validation:</strong> Ensures scraped data matches
            expected schema
          </li>
        </ul>

        <h3 className="text-lg font-semibold mb-3 mt-4">Expected Results:</h3>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>Since IPL is over, live scraper should return "no live match"</li>
          <li>
            Schedule and points scrapers should extract data from fixtures
          </li>
          <li>All scrapers should return valid data structures</li>
        </ul>
      </div>
    </div>
  );
}
