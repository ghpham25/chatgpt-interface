"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

export default function Samplethread() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("image"); // This is now an Object URL!
  const title = searchParams.get("title");
  const prompt = searchParams.get("initprompt");

  const [messages, setMessages] = useState([]);
  const [newPrompt, setNewPrompt] = useState("");

  useEffect(() => {
    if (title || prompt) {
      setMessages((prev) => {
        // Prevent duplicate messages
        const hasImage = prev.some((msg) => msg.content === imageUrl);
        const hasPrompt = prev.some((msg) => msg.content === prompt);

        const newMessages = [...prev];
        if (imageUrl && !hasImage)
          newMessages.push({ role: "user", content: imageUrl });
        if (prompt && !hasPrompt)
          newMessages.push({ role: "user", content: prompt });

        // Add system message only once
        if (!prev.some((msg) => msg.role === "system")) {
          newMessages.push({
            role: "system",
            content: "This is a hardcoded response.",
          });
        }
        return newMessages;
      });
    }
  }, [title, prompt, imageUrl]);

  const handlePromptSubmit = () => {
    if (newPrompt.trim()) {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: newPrompt },
        { role: "system", content: "This is another hardcoded response." },
      ]);
      setNewPrompt(""); // Clear the input field
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Chat History */}
      <div className="chat-history flex-1 overflow-y-auto p-4">
        {title && <h1 className="text-xl font-bold">{title}</h1>}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message mt-4 flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`message-content p-2 rounded-lg ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              <strong className="font-semibold">
                {message.role === "user" ? "You" : "System"}:
              </strong>
              {message.content === imageUrl ? (
                <img
                  src={message.content}
                  alt="User Image"
                  className="max-w-full h-auto mt-2"
                />
              ) : (
                <p className="mt-2">{message.content}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="chat-input flex items-center sticky bottom-4 p-4 bg-white shadow-lg">
        <div className="relative w-full">
          <Textarea
            value={newPrompt}
            onChange={(e) => setNewPrompt(e.target.value)}
            placeholder="Type your prompt here..."
            className="w-full p-3 pr-16 border border-gray-300 rounded-lg resize-none"
          />
          <button
            onClick={handlePromptSubmit}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
