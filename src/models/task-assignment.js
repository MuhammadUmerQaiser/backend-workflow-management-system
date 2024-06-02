const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const taskAssignmentSchema = mongoose.Schema(
  {
    assigned_to: {
      type: ObjectId,
      ref: "user",
      required: true,
    },
    transfer: [
      {
        assignee: { type: ObjectId, ref: "user", default: null },
        assigned_by: { type: ObjectId, ref: "user", default: null },
        is_task_response: { type: Boolean, default: true },
        transferred_at: { type: Date, default: Date.now },
      },
    ],
    task: { type: ObjectId, ref: "task", required: true },
    assignment_reference: { type: ObjectId, ref: "user", default: null },
    is_task_response: { type: Boolean, default: true },
    close_assignment_request: {
      type: String,
      enum: ["none", "pending", "accepted", "rejected"],
      default: "none",
    },
    task_rejection_reason: {
      type: String,
      default: null,
    },
    close_request_generation: { type: ObjectId, ref: "user", default: null },
  },
  { timestamps: true }
);
module.exports = mongoose.model("task-assignment", taskAssignmentSchema);
