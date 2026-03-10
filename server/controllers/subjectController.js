const Subject = require("../models/Subject");

function calcTotalWeight(a = {}) {
  return (
    (a.assignmentWeight || 0) +
    (a.labWeight || 0) +
    (a.quizWeight || 0) +
    (a.midWeight || 0) +
    (a.endExamWeight || 0)
  );
}

function validateSubjectBody(body) {
  const required = ["courseCode", "courseName", "batch", "credit"];
  for (const f of required) {
    if (body[f] === undefined || body[f] === null || body[f] === "") {
      return `${f} is required`;
    }
  }

  if (typeof body.credit !== "number" || body.credit < 0) {
    return "credit must be a non-negative number";
  }

  const a = body.assessments || {};
  const total = calcTotalWeight(a);
  if (total > 100) return "Total percentage cannot exceed 100";

  const weightFields = ["assignmentWeight", "labWeight", "quizWeight", "midWeight", "endExamWeight"];
  for (const w of weightFields) {
    if (a[w] !== undefined) {
      if (typeof a[w] !== "number" || a[w] < 0 || a[w] > 100) {
        return `${w} must be between 0 and 100`;
      }
    }
  }

  const countFields = ["assignmentCount", "labCount", "quizCount"];
  for (const c of countFields) {
    if (a[c] !== undefined) {
      if (!Number.isInteger(a[c]) || a[c] < 0) {
        return `${c} must be an integer >= 0`;
      }
    }
  }

  return null;
}

// POST /api/subjects (lecturer only - enforced in routes)
exports.createSubject = async (req, res) => {
  try {
    const err = validateSubjectBody(req.body);
    if (err) return res.status(400).json({ message: err });

    const subject = await Subject.create({
      ...req.body,
      createdBy: req.user._id
    });

    return res.status(201).json(subject);
  } catch (e) {
    if (e.code === 11000) {
      return res.status(409).json({ message: "You already added this course for the same batch." });
    }
    return res.status(500).json({ message: e.message });
  }
};

// GET /api/subjects (lecturer only - enforced in routes)
exports.getSubjects = async (req, res) => {
  try {
    const filter = { createdBy: req.user._id };
    if (req.query.batch) filter.batch = req.query.batch;

    const subjects = await Subject.find(filter).sort({ createdAt: -1 });
    return res.json(subjects);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// GET /api/subjects/:id (lecturer only - enforced in routes)
exports.getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    return res.json(subject);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// PUT /api/subjects/:id (lecturer only - enforced in routes)
exports.updateSubject = async (req, res) => {
  try {
    const existing = await Subject.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!existing) return res.status(404).json({ message: "Subject not found" });

    const merged = {
      createdBy: existing.createdBy,

      courseCode: req.body.courseCode ?? existing.courseCode,
      courseName: req.body.courseName ?? existing.courseName,
      batch: req.body.batch ?? existing.batch,
      credit: req.body.credit ?? existing.credit,

      assessments: {
        ...(existing.assessments?.toObject ? existing.assessments.toObject() : existing.assessments),
        ...(req.body.assessments || {})
      }
    };

    const err = validateSubjectBody(merged);
    if (err) return res.status(400).json({ message: err });

    const updated = await Subject.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      merged,
      { new: true, runValidators: true }
    );

    return res.json(updated);
  } catch (e) {
    if (e.code === 11000) {
      return res.status(409).json({ message: "You already added this course for the same batch." });
    }
    return res.status(500).json({ message: e.message });
  }
};

// DELETE /api/subjects/:id (lecturer only - enforced in routes)
exports.deleteSubject = async (req, res) => {
  try {
    const deleted = await Subject.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    if (!deleted) return res.status(404).json({ message: "Subject not found" });
    return res.json({ message: "Deleted", id: req.params.id });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};