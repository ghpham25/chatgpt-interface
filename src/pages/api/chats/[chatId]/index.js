/**
GET /api/chats/:id → Get full chat
PATCH /api/chats/:id → Add message/response
DELETE /api/chats/:id → Delete chat + image
 */
import connectToDB from "@/hooks/mongodb";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

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
  }
}
