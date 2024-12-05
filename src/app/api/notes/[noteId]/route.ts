import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";

export async function PATCH(req: Request, { params }: { params: { noteId: string } }) {
  try {
    const { noteId } = params;
    const { name } = await req.json();

    if (!noteId || !name || typeof name !== "string") {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const updated = await db
      .update($notes)
      .set({ name })
      .where(eq($notes.id, parseInt(noteId)));

    if (updated.rowCount === 0) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error updating note:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
