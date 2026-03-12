const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/requireRole");

const {
  addResult,
  getResults,
  getResultById,
  updateResult,
  deleteResult
} = require("../controllers/incourseController");

// Must be logged in
router.use(authMiddleware);

// Lecturer-only for all routes
router.use(requireRole("lecturer"));

router.post("/", addResult);
router.get("/", getResults);
router.get("/:id", getResultById);
router.put("/:id", updateResult);
router.delete("/:id", deleteResult);

module.exports = router;
