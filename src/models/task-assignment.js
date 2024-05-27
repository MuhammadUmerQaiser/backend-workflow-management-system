const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const taskAssignmentSchema = mongoose.Schema(
  {
    assigned_to: {
      type: ObjectId,
      ref: "user",
      required: true,
    },
    task: { type: ObjectId, ref: "task", required: true },
    assignment_reference: { type: ObjectId, ref: "user", default: null },
    is_task_response: { type: Boolean, default: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model("task-assignment", taskAssignmentSchema);
