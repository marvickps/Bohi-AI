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
import DeleteButton from "@/components/DeleteButton";
import EditableNoteName from "@/components/EditableNoteName";

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
      <div className="w-1/5 grid-cols-2">
        <NotesBar notes={userNotes} currentNoteId={parseInt(noteId)} />
        <div className=" border-r-2 mt-4 py-6 rounded-lg border-stone-200 bg-white p-4 shadow-xl">
            <div className="text-xs font-semibold text-gray-700 pb-2">
            <div className="mb-4"> 
            <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
              Shift + =
            </kbd>{"  "}
            for AI completion.
            
            </div>
            <div className="mb-4"> 
            <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
              Shift + _
            </kbd>{"  "}
            for AI Code compiling.
            </div>
            
            <div className="mb-4"> 
            <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
              Shift + *
            </kbd>{"  "}
            for AI summarization.
            </div>
            <div className=""> 
            <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
              Shift + |
            </kbd>{"  "}
            for asking question to AI.
            </div>

          </div>

          

        </div>
      </div>
     
      

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
          <EditableNoteName noteId={note.id} noteName={note.name} />
          <div className="ml-auto">
            <DeleteButton noteId={note.id} /> 
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
