
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Note = {
  id: number;
  name: string;
};

type NotesBarProps = {
  notes: Note[];
  currentNoteId: number;
};

const NotesBar: React.FC<NotesBarProps> = ({ notes, currentNoteId }) => {
  return (
    <div className="w-1/5 border-r-2 rounded-lg border-stone-200 bg-white p-4 shadow-xl">
      <h2 className="font-semibold text-lg mb-4">Your Notes</h2>
      <ul className="">
        {notes.map((note) => (
          <li key={note.id} className="mb-2 ">
            <Link href={`/notebook/${note.id}`}>
              {/* <Button
                variant={note.id === currentNoteId ? "solid" : "outline"}
                className={`w-full ${note.id === currentNoteId ? "bg-purple-600 text-white" : ""}`}
              >
                {note.name}
              </Button> */}
              <div className={`w-full ${note.id === currentNoteId ? "bg-stone-100 border rounded-lg border-solid border-purple-400 p-2 px-2 text-purple-600 font-bold" : "text-xs"}`}>{note.name}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotesBar;
