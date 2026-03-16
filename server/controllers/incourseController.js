const Subject = require("../models/Subject");
const IncourseResult = require("../models/IncourseResult");
const { normalizeRegNo, extractRegNoFromEmail, generateRegNoRegex } = require("../utils/regUtils");

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
  if ((marks.assignments || []).length > (assessments.assignmentCount || 0)) {
    return `Too many assignment marks: max ${assessments.assignmentCount || 0}, got ${(marks.assignments || []).length}`;
  }
  if ((marks.quizzes || []).length > (assessments.quizCount || 0)) {
    return `Too many quiz marks: max ${assessments.quizCount || 0}, got ${(marks.quizzes || []).length}`;
  }
  if ((marks.labs || []).length > (assessments.labCount || 0)) {
    return `Too many lab marks: max ${assessments.labCount || 0}, got ${(marks.labs || []).length}`;
  }

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

// POST /api/incourse/save (upsert)
exports.saveResult = async (req, res) => {
  try {
    let { subject: subjectId, studentENo, assignments, quizzes, labs, mid } = req.body;
    studentENo = normalizeRegNo(studentENo);

    if (!subjectId || !studentENo) {
      return res.status(400).json({ message: "subject and studentENo are required" });
    }

    const subject = await Subject.findOne({ _id: subjectId, createdBy: req.user._id });
    if (!subject) {
      return res.status(404).json({ message: "Subject not found or not yours" });
    }

    const existing = await IncourseResult.findOne({ subject: subjectId, studentENo: studentENo });

    const marks = {
      assignments: assignments || (existing ? existing.assignments : []),
      quizzes: quizzes || (existing ? existing.quizzes : []),
      labs: labs || (existing ? existing.labs : []),
      mid: mid ?? (existing ? existing.mid : null)
    };

    const err = validateMarks(marks, subject.assessments);
    if (err) return res.status(400).json({ message: err });

    const incourseTotal = calcIncourseTotal(marks, subject.assessments);

    if (existing) {
      const updated = await IncourseResult.findByIdAndUpdate(
        existing._id,
        { ...marks, incourseTotal },
        { new: true, runValidators: true }
      );
      return res.json({ message: "Updated", result: updated });
    } else {
      const result = await IncourseResult.create({
        subject: subjectId,
        createdBy: req.user._id,
        studentENo: studentENo,
        ...marks,
        incourseTotal
      });
      return res.status(201).json({ message: "Created", result });
    }
  } catch (e) {
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

// GET /api/incourse/by-eno?subject=<subjectId>&studentENo=2022E050
exports.getResultByENo = async (req, res) => {
  try {
    const { subject: subjectId, studentENo } = req.query;
    if (!subjectId || !studentENo) {
      return res.status(400).json({ message: "subject and studentENo are required" });
    }

    const subject = await Subject.findOne({ _id: subjectId, createdBy: req.user._id });
    if (!subject) {
      return res.status(404).json({ message: "Subject not found or not yours" });
    }

    const normENo = normalizeRegNo(studentENo);
    const result = await IncourseResult.findOne({
      subject: subjectId,
      studentENo: normENo,
      createdBy: req.user._id
    });

    if (!result) return res.status(404).json({ message: "No result found for this student" });
    return res.json({ subject, result });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// GET /api/incourse/enos?subject=<subjectId>
exports.getStudentENos = async (req, res) => {
  try {
    const { subject: subjectId } = req.query;
    if (!subjectId) {
      return res.status(400).json({ message: "subject query param is required" });
    }

    const enos = await IncourseResult.distinct("studentENo", {
      subject: subjectId,
      createdBy: req.user._id
    });

    return res.json(enos);
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

    const subject = await Subject.findById(existing.subject);
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    const marks = {
      assignments: req.body.assignments ?? existing.assignments,
      quizzes: req.body.quizzes ?? existing.quizzes,
      labs: req.body.labs ?? existing.labs,
      mid: req.body.mid ?? existing.mid
    };

    const err = validateMarks(marks, subject.assessments);
    if (err) return res.status(400).json({ message: err });

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

// GET /api/incourse/student/courses
exports.getStudentCourses = async (req, res) => {
  try {
    let studentENo = normalizeRegNo(req.user.studentENo);
    
    // Fallback to email if studentENo is not set
    if (!studentENo) {
        studentENo = extractRegNoFromEmail(req.user.email);
    }

    if (!studentENo) {
      return res.status(400).json({ message: "Could not identify your registration number from profile or email" });
    }

    const regNoRegex = generateRegNoRegex(studentENo);

    // Find all results for this student and populate subject details
    const results = await IncourseResult.find({ studentENo: regNoRegex })
      .populate("subject", "courseCode courseName batch assessments");

    return res.json(results);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// GET /api/incourse/student/my-result?courseCode=CS301
exports.getStudentResult = async (req, res) => {
  try {
    const { courseCode } = req.query;
    let studentENo = normalizeRegNo(req.user.studentENo);

    // Fallback to email if studentENo is not set
    if (!studentENo) {
        studentENo = extractRegNoFromEmail(req.user.email);
    }

    if (!courseCode || !studentENo) {
      return res.status(400).json({ message: "courseCode and identifiable registration number are required" });
    }

    const regNoRegex = generateRegNoRegex(studentENo);

    // Find the student's result for the given course code
    const results = await IncourseResult.find({ studentENo: regNoRegex })
      .populate({
        path: "subject",
        match: { courseCode: courseCode.toUpperCase() },
        select: "courseCode courseName batch assessments"
      });

    // Filter out results where subject didn't match the courseCode
    const result = results.find(r => r.subject !== null);

    if (!result) {
      return res.status(404).json({ message: "No result found for this course" });
    }

    return res.json(result);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
