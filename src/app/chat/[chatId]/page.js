//UI for the display of chatId

"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";

export default function Samplethread() {
  const { chatId } = useParams();
  const [chat, setChat] = useState(null); //stores the whole chat object
  const [image, setImage] = useState(null); //stores the whole image object
  const [userPrompt, setUserPrompt] = useState("");
  // const [botResponse, setBotResponse] = useState("");
  const [loading, setLoading] = useState(true); //loading state

  const messagesRef = useRef(null);

  const onSubmit = async (event) => {
    //Update the chat variable
    event.preventDefault();
    // send the userPrompt to the backend for
    const response = await fetch("/api/chats/" + chatId, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_prompt: userPrompt,
        image_path: image.image_path,
      }),
    });
    if (!response.ok) {
      console.error("Failed to send user prompt.");
      return;
    }

    const chatData = await response.json();
    setChat(chatData);
    setUserPrompt(""); // Clear the input field
  };

  useEffect(() => {
    if (!chatId) return;

    const fetchChat = async () => {
      try {
        const chatRes = await fetch("/api/chats/" + chatId);
        if (!chatRes.ok) {
          console.error("Chat fetch failed.");
          return;
        }
        const data = await chatRes.json();
        setChat(data);

        const imageRes = await fetch("/api/images/" + data.image_id);
        if (!imageRes.ok) {
          console.error("Image fetch failed.");
          return;
        }
        const imageData = await imageRes.json();
        setImage(imageData);
      } catch (error) {
        console.error("Error fetching chat or image:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
  }, [chatId]);

  if (loading) return <div>Loading chat...</div>;
  if (!chat) return <div>Chat not found.</div>;

  return (
    <div className="flex flex-col h-screen mx-auto w-full">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 border-b px-2 py-2">
        <h1 className="text-2xl font-bold">{chat.title}</h1>
      </div>

      {/* Scrollable message list */}
      <div
        className="flex-1 overflow-y-auto px-2 py-2 space-y-4"
        ref={messagesRef}
      >
        {image && (
          <img
            src={image.image_path}
            alt="Uploaded Artwork"
            className="w-full max-w-md rounded-lg shadow mb-4"
          />
        )}

        {chat.messages.map((msg) => (
          <div
            key={msg._id}
            className={`p-3 rounded-md max-w-lg ${
              msg.sender === "user"
                ? "bg-blue-100 self-start"
                : "bg-gray-100 self-end"
            }`}
          >
            <p className="text-sm font-semibold text-gray-600 mb-1">
              {msg.sender === "user" ? "You" : "CuratorBot"}
            </p>
            <p className="text-gray-800 whitespace-pre-wrap">{msg.text}</p>
          </div>
        ))}
      </div>

      {/* Input box */}
      <form
        // onSubmit={handleSubmit}
        className="sticky bottom-0 bg-white border-t px-6 py-4"
        onSubmit={onSubmit}
      >
        <div className="flex items-center space-x-2">
          <textarea
            // value={input}
            // onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            rows={2}
            className="flex-1 p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setUserPrompt(e.target.value)}
            value = {userPrompt}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
