const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/requireRole");

const {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  getMyCourseCodes,
  getMyBatches
} = require("../controllers/subjectController");

//must be logged in
router.use(authMiddleware);

// lecturer-only for ALL routes (only show to lecturer)
router.use(requireRole("lecturer"));

// Dropdown helpers (must be BEFORE /:id routes)
router.get("/my-course-codes", getMyCourseCodes);
router.get("/my-batches", getMyBatches);

router.post("/", createSubject);
router.get("/", getSubjects);
router.get("/:id", getSubjectById);
router.put("/:id", updateSubject);
router.delete("/:id", deleteSubject);

module.exports = router;