import React from "react";
import OpenAIChat from "../components/OpenAIChat";

const ChatBotPage = () => {
  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <h1 className="mb-4 text-2xl font-bold">Health Assistant Chatbot</h1>
      <OpenAIChat />
    </div>
  );
};

export default ChatBotPage;
  