const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/requireRole");

const {
  saveResult,
  getResults,
  getResultByENo,
  getStudentENos,
  getResultById,
  updateResult,
  deleteResult,
  getStudentCourses,
  getStudentResult
} = require("../controllers/incourseController");

// Must be logged in
router.use(authMiddleware);

// Save (upsert — creates or updates)
router.post("/save", requireRole("lecturer"), saveResult);

// Search helpers (must be BEFORE /:id)
router.get("/by-eno", requireRole("lecturer"), getResultByENo);
router.get("/enos", requireRole("lecturer"), getStudentENos);

// Standard CRUD
router.get("/", requireRole("lecturer"), getResults);
router.get("/:id", requireRole("lecturer"), getResultById);
router.put("/:id", requireRole("lecturer"), updateResult);
router.delete("/:id", requireRole("lecturer"), deleteResult);

// Student-specific routes
router.get("/student/courses", requireRole("student"), getStudentCourses);
router.get("/student/my-result", requireRole("student"), getStudentResult);

module.exports = router;
