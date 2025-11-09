import mongoose from "mongoose";

// Optional: for projects, experience, or skills
const experienceSchema = new mongoose.Schema(
  {
    role: String,
    company: String,
    period: String,
    description: String,
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    degree: String,
    school: String,
    period: String,
  },
  { _id: false }
);

const contactSchema = new mongoose.Schema(
  {
    email: String,
    phone: String,
    address: String,
    github: String,
    linkedin: String,
    portfolio: String,
    website: String,
  },
  { _id: false }
);

const meSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    profilePhoto: { type: String, required: true },
    summary: { type: String, default: "" },
    aboutMe: { type: String, default: "" },
    contact: contactSchema,
    headlineTags: [String],
    skills: [String],
    experience: [experienceSchema],
    education: [educationSchema],
    hobbies: [String],
  },
  {
    timestamps: true,
    collection: "profiles",
  }
);

const Me = mongoose.model("Me", meSchema);

export default Me;
