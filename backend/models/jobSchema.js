const mongoose = require("mongoose");
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: [String], required: true, default: [] }, //eg: ["Cleaning", "Plumbing"]
  location: { type: String, required: true },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  datePosted: { type: Date, default: Date.now },
  applicationDeadline: { type: Date, required: true },
  salary: { type: Number, required: true },
  applicants: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    default: [],
  },
  status: { type: String, enum: ["open", "closed"], default: "open" },
  experienceLevel: {
    type: String,
    enum: ["entry", "mid", "senior"],
    default: "entry",
  },
  jobType: {
    type: String,
    enum: ["full-time", "part-time", "contract", "temporary", "internship"],
    default: "full-time",
  },
  numberOfApplicantsRequired: { type: Number, default: 1 },
  totalNumberOfApplicants: { type: Number, default: 0 },
  selectedApplicants: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    default: [],
  },
});
jobSchema.index({ title: "text" });
module.exports = mongoose.model("Job", jobSchema);
