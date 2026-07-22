import { NextResponse } from "next/server";
import { tmdbFetch } from "@/lib/tmdb-server";

export async function GET() {
  try {
    const data = await tmdbFetch("/genre/movie/list?language=en-US");
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "TMDB request failed" },
      { status: 502 }
    );
  }
}
