// generate chat completion

import { NextRequest, NextResponse } from "next/server";
import { chatCompletion, ChatCompletionProps } from "@/lib/ollamaConnect";

export async function POST(req: NextRequest) {
  try {
    const body: ChatCompletionProps = await req.json();
    const prompt = body.prompt;
    const model = body.model;
    const responseStream: ReadableStream<string> = await chatCompletion({
      model: model,
      messages: body.messages,
      prompt: prompt,
      stream: true,
    });
    return new NextResponse(responseStream, {
      headers: {
        "Content-Type": "text/event-stream", // Important for streaming
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
