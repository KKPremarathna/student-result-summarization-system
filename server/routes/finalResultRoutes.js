const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/requireRole");

const {
  getIncourseList,
  saveResult,
  getResults,
  getResultByENo,
  getSummary,
  downloadPdf,
  updateResult,
  deleteResult
} = require("../controllers/finalResultController");

// Must be logged in
router.use(authMiddleware);

// Lecturer-only for all routes
router.use(requireRole("lecturer"));

// Named routes (must be BEFORE /:id)
router.get("/incourse-list", getIncourseList);
router.post("/save", saveResult);
router.get("/summary", getSummary);
router.get("/download-pdf", downloadPdf);
router.get("/by-eno", getResultByENo);

// Standard CRUD
router.get("/", getResults);
router.put("/:id", updateResult);
router.delete("/:id", deleteResult);

module.exports = router;
