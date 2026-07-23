import { NextResponse } from "next/server";
import { getNowPlaying } from "@/lib/movies";

export async function GET() {
  try {
    const results = await getNowPlaying();
    return NextResponse.json({ results });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "TMDB request failed" },
      { status: 502 }
    );
  }
}
