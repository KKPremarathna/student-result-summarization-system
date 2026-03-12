const Subject = require("../models/Subject");
const IncourseResult = require("../models/IncourseResult");

/* ── helpers ─────────────────────────────────────────────── */

function avg(arr) {
  if (!arr || arr.length === 0) return 0;
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

function calcIncourseTotal(marks, assessments) {
  const assignmentPart = avg(marks.assignments) * ((assessments.assignmentWeight || 0) / 100);
  const quizPart       = avg(marks.quizzes)     * ((assessments.quizWeight || 0) / 100);
  const labPart        = avg(marks.labs)         * ((assessments.labWeight || 0) / 100);
  const midPart        = (marks.mid || 0)        * ((assessments.midWeight || 0) / 100);

  return Math.round((assignmentPart + quizPart + labPart + midPart) * 100) / 100;
}

function validateMarks(marks, assessments) {
  // Array lengths must not exceed subject config (but can be less for partial entry)
  if ((marks.assignments || []).length > (assessments.assignmentCount || 0)) {
    return `Too many assignment marks: max ${assessments.assignmentCount || 0}, got ${(marks.assignments || []).length}`;
  }
  if ((marks.quizzes || []).length > (assessments.quizCount || 0)) {
    return `Too many quiz marks: max ${assessments.quizCount || 0}, got ${(marks.quizzes || []).length}`;
  }
  if ((marks.labs || []).length > (assessments.labCount || 0)) {
    return `Too many lab marks: max ${assessments.labCount || 0}, got ${(marks.labs || []).length}`;
  }

  // All marks must be 0–100
  const all = [
    ...(marks.assignments || []),
    ...(marks.quizzes || []),
    ...(marks.labs || [])
  ];
  if (marks.mid !== null && marks.mid !== undefined) all.push(marks.mid);

  for (const m of all) {
    if (typeof m !== "number" || m < 0 || m > 100) {
      return "All marks must be numbers between 0 and 100";
    }
  }

  return null;
}

/* ── controllers ─────────────────────────────────────────── */

// POST /api/incourse
exports.addResult = async (req, res) => {
  try {
    const { subject: subjectId, studentENo, assignments, quizzes, labs, mid } = req.body;

    if (!subjectId || !studentENo) {
      return res.status(400).json({ message: "subject and studentENo are required" });
    }

    // Verify subject exists and belongs to this lecturer
    const subject = await Subject.findOne({ _id: subjectId, createdBy: req.user._id });
    if (!subject) {
      return res.status(404).json({ message: "Subject not found or not yours" });
    }

    const marks = {
      assignments: assignments || [],
      quizzes: quizzes || [],
      labs: labs || [],
      mid: mid ?? null
    };

    // Validate mark counts and ranges
    const err = validateMarks(marks, subject.assessments);
    if (err) return res.status(400).json({ message: err });

    // Calculate incourse total
    const incourseTotal = calcIncourseTotal(marks, subject.assessments);

    const result = await IncourseResult.create({
      subject: subjectId,
      createdBy: req.user._id,
      studentENo,
      ...marks,
      incourseTotal
    });

    return res.status(201).json(result);
  } catch (e) {
    if (e.code === 11000) {
      return res.status(409).json({ message: "Result already exists for this student in this subject" });
    }
    return res.status(500).json({ message: e.message });
  }
};

// GET /api/incourse?subject=<subjectId>
exports.getResults = async (req, res) => {
  try {
    const { subject: subjectId } = req.query;
    if (!subjectId) {
      return res.status(400).json({ message: "subject query param is required" });
    }

    // Verify subject belongs to this lecturer
    const subject = await Subject.findOne({ _id: subjectId, createdBy: req.user._id });
    if (!subject) {
      return res.status(404).json({ message: "Subject not found or not yours" });
    }

    const results = await IncourseResult.find({ subject: subjectId, createdBy: req.user._id })
      .sort({ studentENo: 1 });

    return res.json({ subject, results });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// GET /api/incourse/:id
exports.getResultById = async (req, res) => {
  try {
    const result = await IncourseResult.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    }).populate("subject", "courseCode courseName batch assessments");

    if (!result) return res.status(404).json({ message: "Result not found" });
    return res.json(result);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// PUT /api/incourse/:id
exports.updateResult = async (req, res) => {
  try {
    const existing = await IncourseResult.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });
    if (!existing) return res.status(404).json({ message: "Result not found" });

    // Get the subject for validation
    const subject = await Subject.findById(existing.subject);
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    const marks = {
      assignments: req.body.assignments ?? existing.assignments,
      quizzes: req.body.quizzes ?? existing.quizzes,
      labs: req.body.labs ?? existing.labs,
      mid: req.body.mid ?? existing.mid
    };

    // Validate
    const err = validateMarks(marks, subject.assessments);
    if (err) return res.status(400).json({ message: err });

    // Recalculate total
    const incourseTotal = calcIncourseTotal(marks, subject.assessments);

    const updated = await IncourseResult.findByIdAndUpdate(
      req.params.id,
      { ...marks, incourseTotal },
      { new: true, runValidators: true }
    );

    return res.json(updated);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// DELETE /api/incourse/:id
exports.deleteResult = async (req, res) => {
  try {
    const deleted = await IncourseResult.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    });
    if (!deleted) return res.status(404).json({ message: "Result not found" });
    return res.json({ message: "Deleted", id: req.params.id });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
