//GET /api/chats → List user's chat sessions (title + archived)
//POST /api/chats → Create new chat session (image + prompt + title)

import connectToDB from "@/hooks/mongodb";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config();

export default async function handler(req, res) {
  if (req.method == "POST") {
    try {
      await connectToDB();
      const db = mongoose.connection.useDb("curator_test");
      const { title, image_id, image_path, initial_prompt, user_id } = req.body;
      // console.log(req.body);
      // console.log(image_id, title, initial_prompt, user_id);
      const imagePath = path.join(process.cwd(), "public", image_path); // full path to actual image file
      const base64image = fs.readFileSync(imagePath, "base64");
      if (!image_id || !title || !initial_prompt) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const now = new Date();
      const userMessage = {
        _id: new ObjectId(),
        sender: "user",
        text: initial_prompt,
        timestamp: now,
      };

      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const response = await openai.responses.create({
        model: "gpt-4o-mini",
        input: [
          {
            role: "user",
            content: [
              { type: "input_text", text: initial_prompt },
              {
                type: "input_image",
                image_url: `data:image/jpeg;base64,${base64image}`,
                detail: "low",
              },
            ],
          },
        ],
      });

      if (!response || !response.output_text) {
        return res
          .status(500)
          .json({ error: "Failed to generate chatGPT response." });
      }

      console.log(response.output_text);
      // const botMessage = {
      //   _id: new ObjectId(),
      //   sender: "bot",
      //   text: "This is a placeholder response. In the future, this will be generated by GPT based on the uploaded image and prompt.",
      //   timestamp: new Date(now.getTime() + 1000),
      // };

      const botMessage = {
        _id: new ObjectId(),
        sender: "bot",
        text: response.output_text,
        timestamp: new Date(now.getTime() + 1000),
      };

      const result = await db.collection("ChatSession").insertOne({
        user_id: user_id || null,
        image_id: new ObjectId(image_id),
        title,
        is_archived: false,
        started_at: now,
        ended_at: new Date(now.getTime() + 2000),
        messages: [userMessage, botMessage],
      });

      return res.status(200).json({ chat_id: result.insertedId });
    } catch (err) {
      console.error("Chat session creation error:", err);
      return res.status(500).json({ error: "Failed to create chat session." });
    }
  } else if (req.method == "GET") {
    //get all the chat sessions, return the list of titles and corresponding chatIds
    try {
      await connectToDB();
      const db = mongoose.connection.useDb("curator_test");
      const { user_id } = req.query;

      if (!user_id) {
        return res.status(400).json({ error: "Missing user_id" });
      }

      const chatSessions = await db
        .collection("ChatSession")
        .find({ user_id: user_id })
        .toArray();

      if (!chatSessions || chatSessions.length === 0) {
        return res.status(404).json({ error: "No chat sessions found." });
      }

      const chatList = chatSessions.map((session) => ({
        chatId: session._id,
        title: session.title,
        is_archived: session.is_archived,
        started_at: session.started_at,
      }));

      return res.status(200).json(chatList);
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
      return res.status(500).json({ error: "Failed to fetch chat sessions." });
    }
  }
}
