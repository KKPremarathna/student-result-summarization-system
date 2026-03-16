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
  deleteResult,
  getStudentFinalResults,
  getSubjectAnalytics,
  downloadStudentReportPdf
} = require("../controllers/finalResultController");

// Must be logged in
router.use(authMiddleware);

// Named routes (must be BEFORE /:id)
router.get("/incourse-list", requireRole("lecturer"), getIncourseList);
router.post("/save", requireRole("lecturer"), saveResult);
router.get("/summary", requireRole("lecturer"), getSummary);
router.get("/download-pdf", requireRole("lecturer"), downloadPdf);
router.get("/by-eno", requireRole("lecturer"), getResultByENo);

// Standard CRUD
router.get("/", requireRole("lecturer"), getResults);
router.put("/:id", requireRole("lecturer"), updateResult);
router.delete("/:id", requireRole("lecturer"), deleteResult);

// Student-specific routes
router.get("/student/all", requireRole("student"), getStudentFinalResults);
router.get("/student/analytics", requireRole("student"), getSubjectAnalytics);
router.get("/student/download-pdf", requireRole("student"), downloadStudentReportPdf);

module.exports = router;
