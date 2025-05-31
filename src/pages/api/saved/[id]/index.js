/**
GET /api/saved/:id → View a saved description
PATCH /api/saved/:id → Edit + version
DELETE /api/saved/:id → Delete saved description
*/

// pages/api/saved/[id].js
import connectToDB from "@/hooks/mongodb";
import mongoose from "mongoose";

export default async function handler(req, res) {
  const { id } = req.query;
  if (req.method === "GET") {
    try {
      await connectToDB();
      const db = mongoose.connection.useDb("curator_test");
      const description = await db
        .collection("SavedDescription")
        .findOne({ _id: new mongoose.Types.ObjectId(id) });

      if (!description) {
        return res.status(404).json({ error: "Description not found" });
      }

      res.status(200).json(description);
    } catch (e) {
      res.status(500).json({ error: "Error fetching description" });
    }
  }
}
