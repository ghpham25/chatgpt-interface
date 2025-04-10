/**
 * GET /api/images/:id → Get image metadata
 */

import connectToDB from "@/hooks/mongodb";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const imageId = req.query.imageId;

  if (req.method == "GET") {
    try {
      await connectToDB();
      const db = mongoose.connection.useDb("curator_test");

      const image = await db
        .collection("Images")
        .findOne({ _id: new ObjectId(imageId) });

      if (!image) {
        return res.status(404).json({ error: "Image not found" });
      }
      res.status(200).json(image);
    } catch (error) {
      console.error("Error fetching image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
