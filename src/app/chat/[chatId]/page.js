//UI for the display of chatId

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function Samplethread() {
  const { chatId } = useParams();

  const [chat, setChat] = useState(null); //stores the whole chat object
  const [image, setImage] = useState(null); //stores the whole image object
  const [loading, setLoading] = useState(true); //loading state
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
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">{chat.title}</h1>

      {image && (
        <img
          src={image.image_path}
          alt="Uploaded Artwork"
          className="w-full max-w-md rounded-lg shadow"
        />
      )}

      <div className="mt-6 space-y-3">
        {chat.messages.map((msg) => (
          <div
            key={msg._id}
            className={`p-3 rounded-md ${
              msg.sender === "user"
                ? "bg-blue-100 text-left"
                : "bg-gray-100 text-left"
            }`}
          >
            <p className="text-sm font-semibold text-gray-600">
              {msg.sender === "user" ? "You" : "CuratorBot"}
            </p>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
