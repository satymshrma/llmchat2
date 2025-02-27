import React, { use, useEffect, useState } from "react";
import ChatBox from "./ChatBox";

interface chatWindowProps {
  chatId: string;
  userId: string;
}

const ChatWindow = ({ chatId, userId }: chatWindowProps) => {
  //TODO: Fetch chat messages from backend API

  const [chatTitle, setChatTitle] = useState<string>("");

  useEffect(() => {
    // Fetch chat title from backend API
    const fetchChatTitle = async () => {
      try {
        // Fetch chat title from backend API
        const response = await fetch(`/api/${userId}/${chatId}`);
        const data = await response.json();
        setChatTitle(data.title);
      } catch (error) {
        console.error("Error fetching chat title:", error);
      }
    };
    fetchChatTitle();
  }, []);

  return (
    <div>
      {/* Chat with Dropdown, custom endpoint, & Settings icon for Temp, custom system message etc. TODO: Later*/}

      {/* chat title */}
      <div>
        <h1>{chatTitle}</h1>
      </div>

      {/* Chatbox - Only active if chat selected. Otherwise searchbox is up.*/}
      {chatId && (
        <div>
          <ChatBox chatId={chatId} />
        </div>
      )}

      {/* Chat input field with buttons for sending message, and other buttons for voice input, etc in the future.*/}
    </div>
  );
};

export default ChatWindow;
