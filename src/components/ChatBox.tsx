import { Message } from "@/utils/models/User";
import React, { useState, useEffect } from "react";
import ChatMessage from "./ChatMessage";

interface ChatBoxProps {
  chatId: string;
}

const ChatBox = ({ chatId }: ChatBoxProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    // Fetch chat messages from backend API
    async function fetchMessages() {
      try {
        const response = await fetch(`/api/chat/${chatId}/messages`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        } else {
          setErrorMessage("Failed to fetch messages");
        }
      } catch (error) {
        setErrorMessage("Error fetching messages: " + error);
      }
    }
  }, [messages, chatId]);
  return (
    <div className="flex flex-col h-full">
      <ul>
        {/* Chat messages */}
        {messages.map((message) => (
          <li key={message.id}>
            <ChatMessage message={message.content} isUser={message.sender} />
          </li>
        ))}
      </ul>
      {Boolean(errorMessage) && (
        <p className="outline-red-500 outline-1 bg-red-950 text-red-300 p-4 rounded">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default ChatBox;
