"use client";
import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Button } from "./ui/button";
import TipTapMenuBar from "@/components/TipTapMenuBar";
import { useDebounce } from "@/lib/useDebounce";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { NoteType } from "@/lib/db/schema";
import {Text} from '@tiptap/extension-text';

// import {useCompletion} from 'ai/react'


type Props = {note: NoteType};

const TipTapEditor = ({note}: Props) => {
    
    const [editorState, setEditorState] = React.useState(
        note.editorState || ``
      );

    
    const lastCompletion = React.useRef("");
    
	const completionMutation = useMutation({
		mutationFn: (prompt: string) => axios.post('/api/completion', { prompt }),
		onSuccess: (data) => {
            lastCompletion.current = data.data.completion.response.candidates[0].content.parts[0].text;
            // console.log('Completion Text:', completionText);
        },
        
	});
    //   const { complete, completion } = useCompletion({
    //     api: "/api/completion",
    //   });

    const saveNote = useMutation({
    mutationFn: async () => {
        const response = await axios.post("/api/saveNote", {
        noteId: note.id,
        editorState,
        name: note.name,
        });
        return response.data;
    },
    });
    // const customText = Text.extend(
    //     {
    //         addKeyboardShortcuts(){
    //             return{
    //                 "Shift-/": () => {
    //                     // const prompt = this.editor.getText().split(" ").slice(-30).join(" ");
    //                     const prompt = this.editor.getText();

    //                     complete(prompt);
    //                     return true;
    //                 },
    //             }
    //         }
    //     }
    // )

    const customText = Text.extend({
		addKeyboardShortcuts() {
			return {
				'Shift-+': () => {
					
					const currentText = this.editor.getText().split(' ').slice(-30).join(' ');
					const prompt = `You are a helpful artificial intelligence that possesses expert knowledge, utility, intelligence, and eloquence. You also behave politely and have good manners. I am writing a text and need your help to complete it. Keep the tone consistent with the rest of the text, and make sure the response is brief and pleasant. Continue with my idea on the following: ${currentText}`;

					
					completionMutation.mutate(prompt);

					return true;
				},
			};
		},
	});
    const editor = useEditor({
        autofocus: true,
        extensions: [StarterKit, customText],
        content: editorState,
        onUpdate:({editor})=>{
            setEditorState(editor.getHTML());
        },
    });

    
    
    React.useEffect(() => {
		if (!editor || !lastCompletion.current) return;

		
		const words = lastCompletion.current.split(' ');

		const addWords = async () => {
			// eslint-disable-next-line prefer-const
			for (let word of words) {
				editor.commands.insertContent(word + ' ');
				await new Promise((resolve) => setTimeout(resolve, 100)); 
			}
		};

		addWords();
	}, [lastCompletion.current, editor]);


	const debounceEditorState = useDebounce(editorState, 500);

	React.useEffect(() => {
		//++ guardar el estado del editor debounced
		if (debounceEditorState === '') return;

		saveNote.mutate(undefined, {
			onSuccess: (data) => {
				console.log('success update!', data);
			},
			onError: (err) => {
				console.error(err);
			},
		});
	}, [debounceEditorState]);

    return(
        <>
        <div className="flex">
            {editor && <TipTapMenuBar editor={editor} />}
            <Button disabled variant={"outline"}>
            {saveNote.isPending ? "Saving..." : "Saved"}
            </Button>
        </div>
            <div className="prose prose-base w-full mt-4"style={{ maxWidth: '100%' }}>
                <EditorContent editor={editor} />
            </div>
            
        </>
    );
};

export default TipTapEditor