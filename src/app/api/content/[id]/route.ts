export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { z } from "zod";
import { ContentActionError, deleteContentItem, updateContentStatus } from "@/lib/supabase/content-actions";

const UpdateContentSchema = z.object({
  status: z.enum(["Draft", "Ready", "Published"]),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

function getErrorResponse(error: unknown) {
  if (error instanceof z.ZodError) {
    return NextResponse.json({ error: error.issues[0]?.message ?? "Dữ liệu cập nhật chưa hợp lệ." }, { status: 400 });
  }

  if (error instanceof ContentActionError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  if (error instanceof Error && error.message) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ error: "Không thao tác được với content." }, { status: 500 });
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const payload = UpdateContentSchema.parse(body);
    const item = await updateContentStatus(id, payload.status);

    return NextResponse.json({ item });
  } catch (error) {
    return getErrorResponse(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await deleteContentItem(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return getErrorResponse(error);
  }
}
