import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel, { User, Chat, Message } from "@/utils/models/User";
import { Types } from "mongoose";

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const body = await req.json();
    const userId = await params.userId;
    await dbConnect();

    let user: User | null;
    if (userId === "default") {
      user = await UserModel.findOne({ email: "default@example.com" });

      if (!user) {
        // Create a dummy user if it doesn't exist
        user = await UserModel.create({
          _id: new Types.ObjectId(),
          name: "Default User",
          email: "default@example.com",
          password: "password", // TODO: hashing check
          createdAt: new Date(),
          updatedAt: new Date(),
          Chats: [] as Chat[],
        });
      }
    } else {
      user = await UserModel.findOne({ _id: userId });
    }

    const message: string = body.message;

    // Fetch the title (using async/await with stream handling)
    const response = await fetch(
      `${req.headers.get("origin")}/api/generate/title`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: message, model: "qwen2.5:0.5b" }),
      }
    );

    if (!response.ok) {
      throw new Error(`Title generation failed with status ${response.status}`);
    }

    // Create a new chat with an initial empty title
    const newChat: Chat = {
      _id: new Types.ObjectId(),
      title: "", // Start with an empty title
      messages: [
        {
          _id: new Types.ObjectId(),
          role: "user",
          content: message,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as Message,
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Chat;

    // Important: Push the chat to the user *before* processing the stream
    user?.Chats.push(newChat);
    await user?.save();

    // Process the stream to build the title
    const reader = response.body?.getReader();
    let title = "";

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode and append the chunk to the title
        title += new TextDecoder().decode(value);

        // You might want to update the chat title in your database here if you need real-time updates
        // For example:
        newChat.title = title;
        await user?.save();
      }
    }

    // Final update of the chat title (if not done in the loop)
    newChat.title = title;
    await user?.save();

    return NextResponse.json(
      {
        chatId: newChat._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
