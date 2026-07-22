import { NextResponse } from "next/server";
import { tmdbFetch } from "@/lib/tmdb-server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) {
    return NextResponse.json({ error: "Invalid movie id" }, { status: 400 });
  }
  try {
    const data = await tmdbFetch(
      `/movie/${id}/images?include_image_language=en,null`
    );
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "TMDB request failed" },
      { status: 502 }
    );
  }
}
