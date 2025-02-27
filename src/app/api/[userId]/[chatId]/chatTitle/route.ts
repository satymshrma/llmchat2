//get chatId from params

//send the chat title back from the server

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/utils/models/User";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string; chatId: string } }
) {
  try {
    await dbConnect();

    const user = await UserModel.findById(params.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const chat = user.Chats.id(params.chatId);
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json({ title: chat.title }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
