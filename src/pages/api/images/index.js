import { upload, runMiddleware } from "@/lib/middleware/multer";
import path from "path";
import fs from "fs";
import connectToDB from "@/hooks/mongodb";
import mongoose from "mongoose";
export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // run multer
    await runMiddleware(req, res, upload.single("image"));

    await connectToDB(); // Ensure the connection is established
    const db = mongoose.connection.useDb("curator_test");
    const uniqueName = `${Date.now()}-${req.file.originalname}`;
    const filepath = path.join(uploadDir, uniqueName);
    fs.writeFileSync(filepath, req.file.buffer);

    const imagePath = `/uploads/${uniqueName}`;

    const result = await db.collection("Images").insertOne({
      uploaded_by: req.body.user_id || null,
      image_path: imagePath,
      uploaded_at: new Date(),
    });

    return res
      .status(200)
      .json({ image_id: result.insertedId, image_path: imagePath });
  } catch (err) {
    console.error("Image upload error:", err);
    res.status(500).json({ error: "Image upload failed." });
  }
}
