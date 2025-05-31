/**
 GET /api/saved → Get all saved descriptions. query = {user_id}
 POST /api/saved → Save a new description
 */

import connectToDB from "@/hooks/mongodb";
import mongoose from "mongoose";

export default async function handler(req, res) {
  if (req.method == "POST") {
    try {
      const { user_id, image_id, description, session_id } = req.body;
      console.log(user_id, image_id, description, session_id);
      if (!user_id || !image_id || !description || !session_id) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      await connectToDB();
      const db = mongoose.connection.useDb("curator_test");
      const existingDescription = await db
        .collection("SavedDescription")
        .findOne({
          user_id: user_id,
          image_id: image_id,
        });

      if (existingDescription) {
        return res.status(400).json({
          error:
            "Description already exists. Please go to Saved Description to edit from there",
        });
      }

      const result = await db.collection("SavedDescription").insertOne({
        user_id: user_id,
        image_id: image_id,
        chat_session_id: session_id,
        text: description,
        created_at: new Date(),
        versions: [],
      });
      console.log("Inserted result:", result);

      if (!result) {
        return res.status(500).json({ error: "Failed to save description" });
      }
      res.status(200).json({
        message: "Description saved successfully",
        description_id: result.insertedId,
      });
    } catch (e) {
      console.error("Error saving description:", e);
      res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "GET") {
    try {
      const { user_id } = req.query;
      // console.log("user_id", user_id);
      await connectToDB();
      const db = mongoose.connection.useDb("curator_test");
      const descriptions = await db
        .collection("SavedDescription")
        .find({ user_id: user_id })
        .toArray();
      res.status(200).json(descriptions);
    } catch (e) {
      res.status(500).json({ error: "Error fetching descriptions" });
    }
  }
}
