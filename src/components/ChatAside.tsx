import React, { useEffect, useState } from "react";

import { Chat } from "@/utils/models/User";

const chatHistoryStyle = "outline-gray-500 outline-1 p-4";

interface ChatAsideProps {
  userId: string;
  setCurrentChatId: (chatId: string) => void;
}

const ChatAside = ({ userId, setCurrentChatId }: ChatAsideProps) => {
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  useEffect(() => {
    console.log("ChatAside mounted");
    //get chat history from backend API (that'd get it from mongodb. maybe i should just get it from mongodb directly here?
    async function fetchChats() {
      try {
        const response = await fetch(`/api/${userId}/chats`);
        if (response.ok) {
          const data = await response.json();
          setChatHistory(data);
        } else {
          setErrorMessage("Failed to fetch chats"); //TODO: show error on a toast or something?
        }
      } catch (error) {
        setErrorMessage("Error fetching chats: " + error);
      }
    }

    fetchChats();
  }, [userId]);
  return (
    <aside className={chatHistoryStyle}>
      {/* chat history */}
      {!Boolean(errorMessage) && (
        <ul>
          {chatHistory.map((chat) => (
            <li key={chat.id}>
              <button
                onClick={() => {
                  setCurrentChatId(chat.id);
                  setSelectedChatId(chat.id);
                }}
                className={`rounded p-4 w-full mb-2 ${
                  selectedChatId === chat.id ? "bg-gray-700" : "bg-gray-950"
                }`}
              >
                <h3 className="truncate text-left whitespace-nowrap overflow-hidden">
                  {chat.title}
                </h3>
              </button>
            </li>
          ))}
        </ul>
      )}
      {Boolean(errorMessage) && (
        <p className="outline-red-500 outline-1 bg-red-950 text-red-300 p-4 rounded">
          {errorMessage}
        </p>
      )}
    </aside>
  );
};

export default ChatAside;
