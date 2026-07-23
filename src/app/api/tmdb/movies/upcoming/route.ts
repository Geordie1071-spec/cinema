import { NextResponse } from "next/server";
import { getUpcoming } from "@/lib/movies";

export async function GET() {
  try {
    const results = await getUpcoming();
    return NextResponse.json({ results });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "TMDB request failed" },
      { status: 502 }
    );
  }
}
