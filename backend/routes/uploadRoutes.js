import express from "express";
import upload from "../middleware/multer.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Convert buffer → base64
    const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(fileStr, {
      folder: "products",
    });

    res.json({
      message: "Upload success",
      imageUrl: result.secure_url,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Upload failed" });
  }
});

export default router;