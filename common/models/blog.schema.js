import mongoose from "mongoose";

// Flexible content block
const ContentBlockSchema = new mongoose.Schema(
  {
    type: { type: String, required: true }, // "h2", "p", "image", etc.
    text: { type: String }, // optional
    props: { type: mongoose.Schema.Types.Mixed }, // for anything else (images, urls, etc.)
  },
  { _id: false }
);

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: [ContentBlockSchema], required: true }, // Your editor JSON
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Blog", BlogSchema);
