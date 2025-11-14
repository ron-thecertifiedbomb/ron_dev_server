import Blog from "../../common/models/blog.schema.js";
import {
  generateBlog,
  getAllBlogs,
  getBlogById,
} from "../../common/services/blog.js";

export const saveBlogController = async (req, res) => {
  try {
    const { title, content, useGenerator, topic } = req.body;


    let finalContent = content || [];
    let finalTitle = title;

    if (useGenerator) {
      if (!topic) {
        return res
          .status(400)
          .json({ error: "Topic is required for generated content" });
      }
      const generated = generateBlog(topic);
      finalContent = generated.content; 
      finalTitle = generated.title; 
    }

    if (!finalTitle) {
      return res.status(400).json({ error: "Title is required" });
    }

    // Save blog to database
    const blog = await Blog.create({
      title: finalTitle,
      content: finalContent,
      createdBy: req.user?.id || null, // optional
    });

    return res.status(201).json(blog);
  } catch (err) {
    console.error("Blog save error:", err);
    return res.status(500).json({ error: "Failed to save blog" });
  }
};



export const getBlogsController = async (req, res) => {
  try {
    const blogs = await getAllBlogs();
    res.status(200).json(blogs);
  } catch (err) {
    console.error("Fetch blogs error:", err.message);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
};


export const getBlogByIdController = async (req, res) => {
  try {
    const blog = await getBlogById(req.params.id);
    res.status(200).json(blog);
  } catch (err) {
    console.error("Fetch blog by ID error:", err.message);
    res.status(404).json({ error: err.message });
  }
};