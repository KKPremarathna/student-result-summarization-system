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
  deleteResult
} = require("../controllers/incourseController");

// Must be logged in
router.use(authMiddleware);

// Lecturer-only for all routes
router.use(requireRole("lecturer"));

// Save (upsert — creates or updates)
router.post("/save", saveResult);

// Search helpers (must be BEFORE /:id)
router.get("/by-eno", getResultByENo);
router.get("/enos", getStudentENos);

// Standard CRUD
router.get("/", getResults);
router.get("/:id", getResultById);
router.put("/:id", updateResult);
router.delete("/:id", deleteResult);

module.exports = router;
