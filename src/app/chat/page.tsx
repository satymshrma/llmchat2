"use client";

import ChatAside from "@/components/ChatAside";
import ChatInput from "@/components/ChatInput";
import ChatWindow from "@/components/ChatWindow";
import React, { useState } from "react";

const placeholderStyle = "border-2 border-gray-300";

const Chat = () => {
  const [currentChatId, setCurrentChatId] = useState<string>("");
  return (
    <div className="flex h-screen w-screen">
      {/* Aside with all the chats & newchat button*/}

      <div className="flex flex-col justify-between w-1/3 border-r-2 border-gray-700">
        <ChatAside userId="default" setCurrentChatId={setCurrentChatId} />
        <button
          className="bg-white text-black rounded p-2 px-2 font-bold m-2"
          onClick={() => setCurrentChatId("")}
        >
          New Chat
        </button>
      </div>

      <div className="basis-2/3">
        {/* Chat window */}
        <ChatWindow chatId={currentChatId} userId="default" />
        {/* Chat Input */}
        <ChatInput
          userId="default"
          chatId={currentChatId}
          setChatId={setCurrentChatId}
        />
      </div>
    </div>
  );
};

export default Chat;
