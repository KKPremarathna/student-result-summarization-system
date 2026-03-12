const mongoose = require("mongoose");

const FinalResultSchema = new mongoose.Schema(
  {
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true
    },
    incourseResult: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IncourseResult",
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    studentENo:    { type: String, required: true, trim: true, uppercase: true },
    incourseTotal: { type: Number, required: true },
    endExamMark:   { type: Number, required: true, min: 0, max: 100 },
    finalMark:     { type: Number, required: true },
    grade:         { type: String, required: true }
  },
  { timestamps: true }
);

// One final result per student per subject
FinalResultSchema.index({ subject: 1, studentENo: 1 }, { unique: true });

module.exports = mongoose.model("FinalResult", FinalResultSchema);
