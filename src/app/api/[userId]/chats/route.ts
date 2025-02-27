import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel, { User, Chat } from "@/utils/models/User";
import { Types } from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  //   if (req.method !== "GET") {
  //     return res.status(405).json({ message: "Method Not Allowed" });
  //   }

  try {
    await dbConnect();

    const userId = await params.userId; // Dummy user ID

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
          Chats: [
            {
              _id: new Types.ObjectId(),
              title: "dummy title 1",
              messages: [],
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              _id: new Types.ObjectId(),
              title: "dummy title 2",
              messages: [],
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              _id: new Types.ObjectId(),
              title:
                "dummy title 3 loooong title lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              messages: [],
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        });
      }
    } else {
      user = await UserModel.findOne({ _id: userId });
    }

    // Extract chat titles
    const chatTitlesandId = user
      ? user.Chats.map((chat: Chat) => ({ _id: chat._id, title: chat.title }))
      : ["dummy title 1", "dummy title 2", "dummy title 3 loooong title"];

    const defaultChatTitles = [
      { id: new Types.ObjectId(), title: "dummy title 1" },
      { id: new Types.ObjectId(), title: "dummy title 2" },
      {
        id: new Types.ObjectId(),
        title:
          "dummy title 3 loooong title lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
    ];

    return NextResponse.json(defaultChatTitles, { status: 200 });
  } catch (error) {
    console.error("Error fetching chat titles:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
