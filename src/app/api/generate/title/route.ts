//generate title

import { NextRequest, NextResponse } from "next/server";
import { generate, GenerateProps } from "@/lib/ollamaConnect";

export async function POST(req: NextRequest) {
  try {
    const body: GenerateProps = await req.json();
    const prompt = body.prompt;
    const model = body.model;
    const responseStream: ReadableStream<string> = await generate({
      model: model,
      prompt: prompt,
      stream: true,
      system:
        "Generate a chat title for the following first message from a user:",
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
