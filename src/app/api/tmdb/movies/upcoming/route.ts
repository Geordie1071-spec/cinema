import { NextResponse } from "next/server";
import { tmdbFetch } from "@/lib/tmdb-server";

export async function GET() {
  try {
    const data = await tmdbFetch("/movie/upcoming?language=en-US&page=1");
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "TMDB request failed" },
      { status: 502 }
    );
  }
}
