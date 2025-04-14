/**
GET /api/chats/:id → Get full chat
PATCH /api/chats/:id → Add message/response
DELETE /api/chats/:id → Delete chat + image
 */
import connectToDB from "@/hooks/mongodb";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import path from "path";
import fs from "fs";
import OpenAI from "openai";

export default async function handler(req, res) {
  const chatId = req.query.chatId;
  //Get chat by Id
  if (req.method == "GET") {
    try {
      await connectToDB();
      const db = mongoose.connection.useDb("curator_test");

      const chat = await db.collection("ChatSession").findOne({
        _id: new ObjectId(chatId),
      });
      if (!chat) {
        return res.status(404).json({ error: "Chat not found" });
      }
      res.status(200).json(chat);
    } catch (error) {
      console.error("Error fetching chat:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method == "PATCH") {
    try {
      await connectToDB();
      const db = mongoose.connection.useDb("curator_test");

      const chat = await db.collection("ChatSession").findOne({
        _id: new ObjectId(chatId),
      });

      if (!chat) {
        return res.status(404).json({ error: "Chat not found" });
      }

      const { user_prompt, image_path } = req.body;
      const imagePath = path.join(process.cwd(), "public", image_path); // full path to actual image file
      const base64image = fs.readFileSync(imagePath, "base64");

      if (!user_prompt) {
        return res.status(400).json({ error: "User prompt is required" });
      }

      const messagesForGPT = chat.messages.map((message) => ({
        role: message.sender === "user" ? "user" : "assistant",
        content: [
          {
            type: message.sender === "user" ? "input_text" : "output_text",
            text: message.text,
          },
        ],
      }));

      messagesForGPT.push({
        role: "user",
        content: [
          {
            type: "input_text",
            text: user_prompt,
          },
        ],
      });

      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const chatGPTInput = [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: "You are a helpful assistant for arts curator. Based on the image and the chat history between you and curator, assist the curator as best as you can.",
            },
          ],
        },
        {
          role: "user",

          content: [
            {
              type: "input_image",
              image_url: `data:image/jpeg;base64,${base64image}`,
              detail: "low",
            },
          ],
        },
        ...messagesForGPT,
      ];

      const response = await openai.responses.create({
        model: "gpt-4o-mini",
        input: chatGPTInput,
      });

      if (!response || !response.output_text) {
        return res
          .status(500)
          .json({ error: "Failed to generate chatGPT response." });
      }

      const updatedMessages = [
        ...chat.messages,
        {
          _id: new ObjectId(),
          sender: "user",
          text: user_prompt,
          timestamp: new Date(),
        },
        {
          _id: new ObjectId(),
          sender: "bot",
          text: response.output_text,
          timestamp: new Date(),
        },
      ];

      await db.collection("ChatSession").updateOne(
        { id: new ObjectId(chatId) },
        {
          $set: { messages: updatedMessages, ended_at: new Date() },
        }
      );

      res.status(200).json({
        ...chat,
        messages: updatedMessages,
      });
    } catch (error) {
      console.error("Error updating chat:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
