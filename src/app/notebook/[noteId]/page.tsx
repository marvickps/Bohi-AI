// pages/notebook/[noteId].tsx
import React from "react";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { $notes } from "@/lib/db/schema";
import Link from "next/link";
import { clerk } from "@/lib/clerk-server";

import { Button } from "@/components/ui/button";
import TipTapEditor from "@/components/TipTapEditor";
import NotesBar from "@/components/notesBar";

type Props = {
  params: {
    noteId: string;
  };
};

const NotebookPage = async ({ params: { noteId } }: Props) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/dashboard");
  }

  const user = await clerk.users.getUser(userId);

  // Fetch all notes for the current user
  const userNotes = await db.select().from($notes).where(eq($notes.userId, userId));

  // Fetch the specific note for the editor
  const notes = await db.select().from($notes)
    .where(and(eq($notes.id, parseInt(noteId)), eq($notes.userId, userId)));
  
  if (notes.length !== 1) {
    return redirect("/dashboard");
  }
  
  const note = notes[0];

  return (
    <div className="min-h-screen bg-purple-200 p-6 flex">
     
      <NotesBar notes={userNotes} currentNoteId={parseInt(noteId)} />

      <div className="w-4/5 pl-6">
        <div className="border shadow-xl bg-white border-stone-200 rounded-lg p-4 flex items-center">
          <Link href="/dashboard">
            <Button className="bg-purple-600" size="sm">
              Back
            </Button>
          </Link>
          <div className="w-3"></div>
          <span className="font-semibold">
            {user.firstName} {user.lastName}
          </span>
          <span className="inline-block mx-1">/</span>
          <span className="text-stone-500 font-semibold">{note.name}</span>
          <div className="ml-auto">
            {/* <DeleteButton noteId={note.id} /> */}
          </div>
        </div>

        <div className="h-4"></div>
        <div className="border-stone-200 bg-white shadow-xl border rounded-lg px-16 py-8 w-full">
          <TipTapEditor note={note} />
        </div>
      </div>
    </div>
  );
};

export default NotebookPage;
