import Link from 'next/link'
import { NotebookText } from 'lucide-react';
import { UserButton } from '@clerk/nextjs'

export default function Navbar() {
  return (
    <nav className="text-purple-600 h-12 absolute top-0 left-0 right-0">
      <div className="h-full flex justify-between items-center px-4 mx-6">
        <div className="flex-1">
          <Link href="/" className="text-xl font-bold hover:text-fuchsia-500 transition-colors">
            Bohi-Ai
          </Link>
        </div>

        <div className="flex font-semibold items-center justify-center text-center">
          <NotebookText  />
          <h1 className="text-lg ml-2">My Notes</h1>
        </div>

        <div className="flex-1 flex justify-end">
          
        <div className="border-2 rounded-full border-purple-600 flex items-center justify-center hover:border-4 hover:border-fuchsia-400">
          <UserButton />
        </div>

          
        </div>
      </div>
    </nav>
  )
}