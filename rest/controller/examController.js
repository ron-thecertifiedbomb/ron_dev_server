import Exam from "../../common/models/exam.schema.js";

/**
 * Fetch an exam by its title.
 * For this specific route, we search for "NEW_ASSESSMENT_PROTOCOL".
 */
export const getExamByTitle = async (req, res) => {
  try {
    const exam = await Exam.findOne({ title: "NEW_ASSESSMENT_PROTOCOL" });

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    res.json(exam);
  } catch (error) {
    console.error("Error fetching exam from MongoDB:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Create a new exam entry in MongoDB.
 */
export const createExam = async (req, res) => {
  try {
    const { title, questions } = req.body;

    if (!title || !questions || !Array.isArray(questions)) {
      return res
        .status(400)
        .json({ error: "Title and a valid questions array are required." });
    }

    const exam = await Exam.create(req.body);
    res.status(201).json(exam);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ error: "An exam with this title already exists." });
    }
    console.error("Error creating exam:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
