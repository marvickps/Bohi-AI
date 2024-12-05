
import React from "react";
import Link from "next/link";
import { Notebook } from 'lucide-react';

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
    <div className="border-r-2 rounded-lg border-stone-200 bg-white p-4 shadow-xl">
      <h2 className="font-semibold border-b text-lg mb-4">Your Notes</h2>
      <ul className="">
        {notes.map((note) => (
          <li key={note.id} className="mb-1">
            <Link href={`/notebook/${note.id}`}>
              <div
                className={`w-full ${
                  note.id === currentNoteId
                    ? "bg-stone-100 rounded-sm p-1 px-3 text-purple-600 font-bold line-clamp-1 hover:bg-purple-600 hover:text-white"
                    : "p-1 px-2 text-sm rounded-sm font-semibold text-slate-500 line-clamp-1 hover:text-sm hover:bg-stone-100"
                }`}
                title={note.name}
              >
                <Notebook className="inline-block w-5 h-5 mr-2" />
                {note.name}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotesBar;
