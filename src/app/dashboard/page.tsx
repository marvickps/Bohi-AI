// import { Button } from '@/components/ui/button'
// import { ArrowLeft } from 'lucide-react'
import React from 'react'
// import Link from "next/link";

// import { UserButton } from '@clerk/nextjs';
import CreateNoteDialog from '@/components/CreateNoteDialog';
import { db } from '@/lib/db';
import { $notes } from '@/lib/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from "drizzle-orm";
import Image from "next/image";
import Navbar from '@/components/Navbar';
// type Props = {};

const page = async () => {
  const { userId } = auth();
  const notes = await db
    .select()
    .from($notes)
    .where(eq($notes.userId, userId!));
    
  return (
    <><Navbar />
      <div className="bg-purple-50 min-h-screen">
      
        <div className="max-w-7xl mx-auto p-10">

          <div className="grid sm:grid-cols-3 mt-16 md:grid-cols-5 grid-cols-1 gap-3">
                <CreateNoteDialog/>
                {notes
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((note) => {
                  return (
                    
                    <a href={`/notebook/${note.id}`} key={note.id}>
                      <div className="relative h-[260px] w-full overflow-hidden rounded-2xl border border-stone-300 transition hover:-translate-y-1 hover:shadow-xl group">
                        <div className="relative h-[30%] w-full overflow-hidden bg-purple-600">
                          {note.imageUrl && (
                            <Image
                              className="h-full w-full object-cover object-center"
                              alt={note.name}
                              src={note.imageUrl}
                              fill
                            />
                          )}
                        </div>
                        <div className="mt-1 w-full border-t-4 border-purple-600" />
                        <div className="flex h-[65%] flex-col items-center justify-center p-6">
                          <h2 className=" text-center text-xl font-semibold text-purple-600">{note.name}</h2>
                          <p className="text-center text-sm text-gray-500">
                            {new Date(note.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tl from-purple-600 via-fuchsia-500 to-purple-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <h2 className="text-center text-xl font-semibold text-white">{note.name}</h2>
                        </div>
                      </div>

                      

                    </a>
                  );
                })}
            </div>
          {/* <div className="text-center mt-4">
            <h2 className="text-xl text-gray-500">You have no notes yet.</h2>
          </div> */}


        </div>
      </div>
    </>
  )
}

export default page