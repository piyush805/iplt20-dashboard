// src/app/api/schedule/route.ts
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { Schemas } from "@/types";

export async function GET() {
  try {
    const fixturePath = path.join(process.cwd(), "src/fixtures/schedule.json");
    const raw = await fs.readFile(fixturePath, "utf8");
    const data = JSON.parse(raw);

    // Validate with Zod schema
    const validated = Schemas.ScheduleResponse.parse(data);

    return NextResponse.json(validated);
  } catch (error) {
    console.error("Error in /api/schedule:", error);
    return NextResponse.json(
      { error: "Failed to fetch schedule data" },
      { status: 500 }
    );
  }
}
