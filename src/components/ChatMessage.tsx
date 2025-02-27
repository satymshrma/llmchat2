import React from "react";

interface ChatMessageProps {
  message: string;
  isUser: "user" | "system" | "assistant";
}

const ChatMessage = ({ message, isUser }: ChatMessageProps) => {
  return (
    <div
      className={`rounded p-4 ${
        isUser
          ? `bg-white text-black items-start`
          : `bg-blue-600 text-white items-end`
      }`}
    >
      <p>{message}</p>
    </div>
  );
};

export default ChatMessage;
