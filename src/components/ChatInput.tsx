import React, { useState } from "react";

interface ChatInputProps {
  chatId: string;
  setChatId: (chatId: string) => void;
  userId: string;
}

const ChatInput = ({ chatId, userId, setChatId }: ChatInputProps) => {
  const [sendStatus, setSendStatus] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSendClick = async () => {
    try {
      //no message body to process, returned.
      if (message === "") return;
      setSendStatus(true);

      //when its a new chat

      if (chatId === "") {
        const response = await fetch(`/api/${userId}/createChat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          );
        }

        const data = await response.json();
        setChatId(data.chatId);
        // Optionally update other chat related states or lists
        setMessage(""); // Clear the message input
      }
    } catch (e) {
      setErrorMessage("Error sending message - " + e);
    } finally {
      setSendStatus(false);
    }
  };

  return (
    <div className="">
      <div className="flex items-center justify-center">
        <input
          type="text"
          className="p-2 w-full m-3 bg-gray-800 text-white rounded-lg"
          disabled={sendStatus}
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        {/* TODO: disabled if no connection or sending */}
        <button
          className={`p-2 px-2 m-2 rounded text-black ${
            sendStatus ? `bg-gray-400` : `bg-white`
          }`}
          onClick={handleSendClick}
        >
          Send
        </button>
      </div>
      {errorMessage && (
        <p className="text-xs m-2 font-mono text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};

export default ChatInput;
