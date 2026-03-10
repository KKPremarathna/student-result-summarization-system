const mongoose = require("mongoose");

const AssessmentSchema = new mongoose.Schema(
  {
    assignmentCount: { type: Number, default: 0, min: 0 },
    labCount: { type: Number, default: 0, min: 0 },
    quizCount: { type: Number, default: 0, min: 0 },

    assignmentWeight: { type: Number, default: 0, min: 0, max: 100 },
    labWeight: { type: Number, default: 0, min: 0, max: 100 },
    quizWeight: { type: Number, default: 0, min: 0, max: 100 },
    midWeight: { type: Number, default: 0, min: 0, max: 100 },
    endExamWeight: { type: Number, default: 0, min: 0, max: 100 }
  },
  { _id: false }
);

const SubjectSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    courseCode: { type: String, required: true, trim: true, uppercase: true },
    courseName: { type: String, required: true, trim: true },
    batch: { type: String, required: true, trim: true },
    credit: { type: Number, required: true, min: 0 },

    assessments: { type: AssessmentSchema, default: () => ({}) }
  },
  { timestamps: true }
);

// unique per lecturer + course + batch
SubjectSchema.index({ createdBy: 1, courseCode: 1, batch: 1 }, { unique: true });

module.exports = mongoose.model("Subject", SubjectSchema);