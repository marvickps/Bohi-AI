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
import HardBreak from "@tiptap/extension-hard-break";
import MarkdownIt from "markdown-it";
import { writeDocx, DocxSerializer, defaultNodes, defaultMarks } from "prosemirror-docx";
import { saveAs } from "file-saver";
import { Download } from 'lucide-react';


type Props = {note: NoteType};

const TipTapEditor = ({note}: Props) => {
    
    const [editorState, setEditorState] = React.useState(
        note.editorState || `<h1>${note.name}</h1>`
      );

    
    const lastCompletion = React.useRef("");
    const lastGeneration = React.useRef("");


    
	const completionMutation = useMutation({
		mutationFn: (prompt: string) => axios.post('/api/completion', { prompt }),
		onSuccess: (data) => {
            lastCompletion.current = data.data.completion.response.candidates[0].content.parts[0].text;

        },
        
	});

    const generationMutation = useMutation({
		mutationFn: (prompt: string) => axios.post('/api/completion', { prompt }),
		onSuccess: (data) => {
            lastGeneration.current = data.data.completion.response.candidates[0].content.parts[0].text;

        },
        
	});


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
   

    const customText = Text.extend({
		addKeyboardShortcuts() {
			return {
				'Shift-+': () => {
					const { state } = this.editor; 
                    const { from } = state.selection; 
					const currentText = state.doc.textBetween(0, from).split(' ').slice(-30).join(' ');

                    
                    // const fullText = state.doc.textBetween(0, from); // Get the entire document text
                    // const textFromCursor = state.doc.textBetween(from, state.doc.content.size); // Text from cursor position

                    // console.log(fullText);

					const prompt = `You are a helpful artificial intelligence that possesses expert knowledge, utility, intelligence, and eloquence. You also behave politely and have good manners. I am writing a text and need your help to complete it. Keep the tone consistent with the rest of the text, and make sure the response is brief and pleasant. Continue with my idea on the following: ${currentText}`;
                    
					completionMutation.mutate(prompt);

					return true;
				},
                'Shift-_': () => {
                    const { state } = this.editor; 
                    const { from } = state.selection;
					
					const currentText = state.doc.textBetween(0, from).split('\n').join(' ');

					const prompt2 = `You are a compiler who can compile any code, based on this code show the output of the code, if code has some error show does like a compiler would, if the input data is not shown and the assume some input cases, and make sure the response is only the output of the code. here the code:  ${currentText}`;
                    completionMutation.mutate(prompt2);
					return true;
				},
                'Shift-|': () => {
                    let floatingDiv = document.getElementById('qa-form');
                    let inputField: HTMLInputElement | null;

                    // Save current editor selection
                    const savedSelection = this.editor.state.selection;

                    if (!floatingDiv) {
                        // Dynamically create the floating div for the Q&A form
                        floatingDiv = document.createElement('div');
                        floatingDiv.id = 'qa-form';
                        floatingDiv.className =
                            'fixed top-1/4 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg w-96 z-50';
                        floatingDiv.innerHTML = `
                            <div class="flex items-center bg-gray-100 rounded-lg px-4 py-2 space-x-3 w-full max-w-md">
                                <input
                                    id="qa-input"
                                    type="text"
                                    placeholder="Enter your question..."
                                    class="flex-grow bg-transparent text-purple-800 font-bold placeholder-gray-400 outline-none"
                                />
                                <button
                                    class="flex items-center justify-center bg-purple-600 text-white rounded-full w-8 h-8 hover:bg-purple-500 transition"
                                >
                                    +
                                </button>
                                </div>
                        `;
                        document.body.appendChild(floatingDiv);

                        
                        inputField = document.getElementById('qa-input') as HTMLInputElement | null;
                        const submitButton = floatingDiv.querySelector('button');
                        if (submitButton) {
                            submitButton.addEventListener('click', () => {
                                if (inputField) {
                                    this.currentText = inputField.value; // Set currentText
                                    if (this.currentText) {
                                        const prompt3 = `You are an AI answering user questions accurately, remember to not give summary at last, try to make it as long as possible. Question: ${this.currentText}`;
                                        generationMutation.mutate(prompt3);
                                        inputField.value = ''; // Clear input field
                                        floatingDiv!.style.display = 'none'; // Hide the form

                                        this.editor.commands.focus(); // Focus back on the editor
                                        this.editor.view.dispatch(
                                            this.editor.state.tr.setSelection(savedSelection)
                                        );
                                    }
                                }
                            });
                        }
                    } else {
                        floatingDiv.style.display = floatingDiv.style.display === 'none' ? 'block' : 'none';
                    }
                    
                    inputField = document.getElementById('qa-input') as HTMLInputElement | null;
                    if (floatingDiv.style.display !== 'none' && inputField) {
                        inputField.focus(); 
                    }

                    return true;
                },
                'Shift-*': () => {
                    let floatingDiv = document.getElementById('qa-form');
                    let textAreaField: HTMLTextAreaElement | null;

                    // Save current editor selection
                    const savedSelection = this.editor.state.selection;

                    if (!floatingDiv) {
                        // Dynamically create the floating div for the Q&A form
                        floatingDiv = document.createElement('div');
                        floatingDiv.id = 'qa-form';
                        floatingDiv.className =
                            'fixed top-1/4 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg w-[28rem]';
                        floatingDiv.innerHTML = `
                            <div class="flex flex-col space-y-3 bg-gray-100 rounded-lg px-4 py-2 w-full max-w-2xl">
                                <textarea
                                    id="qa-textarea"
                                    placeholder="Enter your question or text to summarize..."
                                    rows="5"
                                    class="flex-grow bg-transparent text-purple-800 font-bold placeholder-gray-400 outline-none p-2"
                                ></textarea>
                                <button
                                    class="flex items-center justify-center bg-purple-600 text-white rounded-lg py-2 hover:bg-purple-500 transition"
                                >
                                    summarize
                                </button>
                            </div>
                        `;
                        document.body.appendChild(floatingDiv);

                        textAreaField = document.getElementById('qa-textarea') as HTMLTextAreaElement | null;
                        const submitButton = floatingDiv.querySelector('button');
                        if (submitButton) {
                            submitButton.addEventListener('click', () => {
                                if (textAreaField) {
                                    this.currentText = textAreaField.value; 
                                    if (this.currentText) {
                                        const prompt3 = `You are an AI summarizing user text accurately, summarize the input and give the summary in one paragraph. Input: ${this.currentText}`;
                                        completionMutation.mutate(prompt3);
                                        textAreaField.value = '';
                                        floatingDiv!.style.display = 'none'; 

                                        this.editor.commands.focus(); 
                                        this.editor.view.dispatch(
                                            this.editor.state.tr.setSelection(savedSelection)
                                        );
                                    }
                                }
                            });
                        }
                    } else {
                        floatingDiv.style.display = floatingDiv.style.display === 'none' ? 'block' : 'none';
                    }

                    textAreaField = document.getElementById('qa-textarea') as HTMLTextAreaElement | null;
                    if (floatingDiv.style.display !== 'none' && textAreaField) {
                        textAreaField.focus();
                    }

                    return true;
                },
                    };
                },
            
            });

    const editor = useEditor({
        autofocus: true,
        extensions: [StarterKit, HardBreak.configure({ keepMarks: true }), customText],
        content: editorState,
        onUpdate:({editor})=>{
            setEditorState(editor.getHTML());
        },
    });

    const nodeSerializer = {
        ...defaultNodes,
        hardBreak: defaultNodes.hard_break,
        codeBlock: defaultNodes.code_block,
        orderedList: defaultNodes.ordered_list,
        listItem: defaultNodes.list_item,
        bulletList: defaultNodes.bullet_list,
        horizontalRule: defaultNodes.horizontal_rule,
        
    };

    const docxSerializer = new DocxSerializer(nodeSerializer, defaultMarks);

    // Export to Docx
    const handleExportToDocx = React.useCallback(
        async (noteName: string) => {
          if (!editor) return;
      
          const opts = {
            getImageBuffer: (src: string) => Buffer.from("Real buffer here"), // Customize as needed
          };
      
          const wordDocument = docxSerializer.serialize(editor.state.doc, opts);
      
          // Sanitize the note name and ensure it's a string
          const fileName = noteName && typeof noteName === "string" ? `${noteName}.docx` : "document.docx";
      
          await writeDocx(wordDocument, (buffer) => {
            saveAs(new Blob([buffer]), fileName);
          });
        },
        [editor]
      );
      
    
    const md = new MarkdownIt();
    
    React.useEffect(() => {
        if (!editor || !lastGeneration.current) return;
        
        const addMarkdownContent = () => {
          const htmlContent = md.render(lastGeneration.current); // Convert Markdown to HTML
          editor.chain().focus().insertContent(htmlContent).run(); // Insert as HTML
        };
      
        addMarkdownContent();
      }, [lastGeneration.current, editor]);


      
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
        <div className="flex items-center mb-6">
            <div className="flex-1">

            {editor && <TipTapMenuBar editor={editor} />}
            </div>

            <div className="flex justify-end items-center gap-4">
                
                <Button disabled variant={"outline"}>
                {saveNote.isPending ? "Saving..." : "Saved"}
                </Button>
                
                

                <Download className=" hover:text-purple-800" onClick={() => handleExportToDocx(note.name || "Untitled Note")} />
                
            </div>
            
            
            
                

        </div>
            
            <div className="prose prose-base w-full mt-4"style={{ maxWidth: '100%' }}>
                <EditorContent editor={editor} />
            </div>
            
        </>
    );
};

export default TipTapEditor;