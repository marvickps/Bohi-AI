import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";


export default function Home() {
  return (
    <div className="bg-gradient-to-r min-h-screen from-white to-purple-300">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <h1 className="font-semibold  text-center">
        

          <span className="block text-7xl mb-2">AI NoteTaking app.</span> 
          <span className="text-purple-600 text-7xl font-bold block">Bohi-AI</span>
        
        </h1>
        <div className="mt-4"></div>
        <h2 className="font-semibold text-3xl text-center text-slate-700">3rd Semester MCA Project.
        </h2>
        <div className="mt-8"></div>

        <div className="flex justify-center">
        <Link href="/dashboard">
          <Button className="bg-purple-600">
            Get Started
            <ArrowRight className="ml-2 w-5 h-5" strokeWidth={3}/>
          </Button>
        </Link>
        </div>
      </div>
    </div>
  );
}
