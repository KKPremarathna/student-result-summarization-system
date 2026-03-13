const mongoose = require("mongoose");

const IncourseResultSchema = new mongoose.Schema(
  {
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    studentENo: { type: String, required: true, trim: true, uppercase: true },

    // Mark arrays — lengths must match the subject's assessment counts
    assignments: { type: [Number], default: [] },
    quizzes:     { type: [Number], default: [] },
    labs:        { type: [Number], default: [] },
    mid:         { type: Number, default: null },

    // Calculated server-side before saving
    incourseTotal: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// One record per student per subject
IncourseResultSchema.index({ subject: 1, studentENo: 1 }, { unique: true });

module.exports = mongoose.model("IncourseResult", IncourseResultSchema);
