export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { ContentActionError, duplicateContentItem } from "@/lib/supabase/content-actions";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function getErrorResponse(error: unknown) {
  if (error instanceof ContentActionError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  if (error instanceof Error && error.message) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ error: "Không nhân bản được content." }, { status: 500 });
}

export async function POST(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const item = await duplicateContentItem(id);

    return NextResponse.json({ item });
  } catch (error) {
    return getErrorResponse(error);
  }
}
