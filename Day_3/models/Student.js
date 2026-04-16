const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  course: String,
  isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model("Student", studentSchema);