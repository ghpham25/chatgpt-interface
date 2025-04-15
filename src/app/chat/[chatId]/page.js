"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function Samplethread() {
  const { chatId } = useParams();
  const [chat, setChat] = useState(null);
  const [image, setImage] = useState(null);
  const [userPrompt, setUserPrompt] = useState("");
  const [highlightMap, setHighlightMap] = useState({});
  const [highlightButton, setHighlightButton] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesRef = useRef(null);
  const promptRef = useRef(null);
  const promptSelectionRef = useRef(null);

  const onSubmit = async (event) => {
    event.preventDefault();
    const resolvedPrompt = promptRef.current.innerText;

    const response = await fetch("/api/chats/" + chatId, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_prompt: resolvedPrompt,
        image_path: image.image_path,
        chat: chat,
      }),
    });

    if (!response.ok) {
      console.error("Failed to send user prompt.");
      return;
    }

    const chatData = await response.json();
    setChat(chatData);
    setUserPrompt("");
    if (promptRef.current) promptRef.current.innerHTML = "";
  };

  useEffect(() => {
    if (!chatId) return;

    const fetchChat = async () => {
      try {
        const chatRes = await fetch("/api/chats/" + chatId);
        if (!chatRes.ok) throw new Error("Chat fetch failed.");
        const data = await chatRes.json();
        setChat(data);

        const imageRes = await fetch("/api/images/" + data.image_id);
        if (!imageRes.ok) throw new Error("Image fetch failed.");
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

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim()) {
        const text = selection.toString();
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const messageId =
          range.startContainer.parentElement.closest("[data-msgid]")?.dataset
            ?.msgid;

        if (messageId) {
          setHighlightButton({
            text,
            messageId,
            x: rect.x + window.scrollX,
            y: rect.y + window.scrollY,
          });
        }
      } else {
        setHighlightButton(null);
      }
    };

    const handleSelectionChange = () => {
      const sel = window.getSelection();
      if (!sel.rangeCount) return;
      const range = sel.getRangeAt(0);
      if (
        promptRef.current &&
        promptRef.current.contains(range.startContainer)
      ) {
        promptSelectionRef.current = range;
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  const insertHighlight = () => {
    if (!highlightButton || !promptSelectionRef.current) return;

    const id = `highlight_${Object.keys(highlightMap).length + 1}`;
    const newMap = {
      ...highlightMap,
      [id]: {
        text: highlightButton.text,
        messageId: highlightButton.messageId,
      },
    };
    setHighlightMap(newMap);

    const span = document.createElement("span");
    span.innerText = highlightButton.text;
    span.style.backgroundColor = "#fef3c7";
    span.style.padding = "2px 4px";
    span.style.borderRadius = "4px";
    span.style.cursor = "pointer";
    span.style.margin = "0 2px";
    span.style.display = "inline-block";
    span.setAttribute("contenteditable", "false");
    span.onclick = () => {
      const el = document.getElementById(highlightButton.messageId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    const space = document.createTextNode(" ");

    const range = promptSelectionRef.current.cloneRange();
    range.insertNode(space);
    range.insertNode(span);
    range.collapse(false);

    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    setHighlightButton(null);
    promptRef.current.focus();
  };

  if (loading) return <div>Loading chat...</div>;
  if (!chat) return <div>Chat not found.</div>;

  return (
    <div className="flex flex-col h-screen mx-auto w-full relative">
      <div className="sticky top-0 bg-white z-10 border-b px-2 py-2">
        <h1 className="text-2xl font-bold">{chat.title}</h1>
      </div>

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
            id={msg._id}
            data-msgid={msg._id}
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

      <form
        onSubmit={onSubmit}
        className="sticky bottom-0 bg-white border-t px-6 py-4"
      >
        <div className="flex items-center space-x-2 w-full">
          <div
            ref={promptRef}
            contentEditable
            suppressContentEditableWarning={true}
            onInput={(e) => {
              setUserPrompt(e.currentTarget.innerText);
            }}
            className="flex-1 p-3 border rounded-md bg-gray-50 text-left min-h-[48px] max-h-40 overflow-y-auto whitespace-pre-wrap"
          ></div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Send
          </button>
        </div>
      </form>

      {highlightButton && (
        <button
          style={{
            position: "absolute",
            top: highlightButton.y + 24,
            left: highlightButton.x,
            zIndex: 50,
          }}
          className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded shadow"
          onClick={insertHighlight}
        >
          ➕ Insert Highlight
        </button>
      )}
    </div>
  );
}
