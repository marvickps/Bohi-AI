// import { OpenAIApi, Configuration } from "openai-edge";
// import { OpenAIStream, StreamingTextResponse } from "ai";

// const config = new Configuration({
//     apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(config);

// export async function POST(req: Request) {
//     const { prompt } = await req.json();
    
//     const response = await openai.createChatCompletion({
//         model: "gpt-3.5-turbo",
//         messages: [
//           {
//             role: "system",
//             content: `You are a helpful AI embedded in a notion text editor app that is used to autocomplete sentences
//                 The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
//             AI is a well-behaved and well-mannered individual.
//             AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.`,
//           },
//           {
//             role: "user",
//             content: `
//             I am writing a piece of text in a notion text editor app.
//             Help me complete my train of thought here: ##${prompt}##
//             keep the tone of the text consistent with the rest of the text.
//             keep the response a little longer.
//             `,
//           },
//         ],
//         stream: true,
//     });
      
//     const stream = OpenAIStream(response);
//     return new StreamingTextResponse(stream);

// }

// /api/completion


import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

export async function POST(req: Request) {
  const body = await req.json();
  const { prompt } = body;
  const api = process.env.GEMINI_API;


  if (!prompt) {
    return new NextResponse('Missing prompt in request body', {
      status: 400,
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(api);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const completion = await model.generateContent(prompt);

    return new NextResponse(JSON.stringify({ completion }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
  } catch (err) {
    console.error('Error generating response:', err);

    return new NextResponse('Error generating response', {
      status: 500,
    });
  }
}

