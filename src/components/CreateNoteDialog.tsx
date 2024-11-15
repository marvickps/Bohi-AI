'use client'
import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "./ui/dialog";
import { CloudUpload, Loader2, Plus } from 'lucide-react';    
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from 'react';



const CreateNoteDialog = () => {
    const router = useRouter();
    const [image, setImage] = useState<string | null>(null);
    const [input, setInput] = React.useState('');

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const createNotebook = useMutation({
        mutationFn: async () => {
          try {
            const response = await axios.post('/api/createNoteBook', {
              name: input,
              image,
            });
    
            return response.data;
          } catch (err) {
            console.error(err);
          }
        },
      });
      
    
    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
      const uploadedImage = e.target.files?.[0];
  
      if (uploadedImage) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result as string);
        };
  
        reader.readAsDataURL(uploadedImage);
      }
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (input == ''){
            window.alert('Please enter a name for yout notebook');
            return;
        }
        createNotebook.mutate(undefined, {
            onSuccess: ({note_id}) =>{
                console.log("created new note:", { note_id });
                router.push(`/notebook/${note_id}`);
            },
            onError: (error) => {
                console.error(error);
                window.alert("Failed to create new notebook");
            }
        })
        
    };
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
      <DialogTrigger onClick={() => setIsDialogOpen(true)}>
        <div className="border-dashed border-2 flex hover:border-0 border-purple-600 text-purple-600 hover:text-white h-full rounded-lg items-center justify-center sm:flex-col hover:shadow-xl hover:bg-gradient-to-tl from-purple-600 via-fuchsia-500 to-purple-600   transition hover:-translate-y-1 flex-row p-4">
          <Plus className="w-6 h-6 "  strokeWidth={3} />
          <h2 className="font-semibold sm:mt-2">
            New Note Book
          </h2>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Note Book</DialogTitle>
          <DialogDescription>
            You can create a new note by clicking the button below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
            <input
							type="file"
							accept="image/*"
							onChange={handleImageUpload}
							id="fileInput"
							className="hidden"
						/>
            <label
            htmlFor="fileInput"
            className="cursor-pointer text-sm flex items-center gap-2">
            <CloudUpload />
             Select Image
            </label>
            <div className="py-4">
                  <img src={image || '/img/image-void.png'} className="w-1/2" alt="Uploaded" />
              </div>

            <Input value={input}
            onChange={(e)=>setInput(e.target.value)}
            placeholder='Name..'/>
            <div className='h-4'></div>
            <div className='flex items-center gap-3'>

                <Button type='submit' name='submit' className='bg-purple-600' disabled={createNotebook.isPending}>
                  {createNotebook.isPending && (<Loader2 className="w-4 h-4 mr-2 animate-spin" />)}
              
              Create</Button>


              <Button variant="outline" onClick={(e) => {e.preventDefault(); setIsDialogOpen(false); }}>Cancel</Button>

            </div>
        </form>
    
      </DialogContent>
    </Dialog>
  )
}

export default CreateNoteDialog