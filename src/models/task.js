const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const taskSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    // assigned_to: [
    //   {
    //     type: ObjectId,
    //     ref: "user",
    //     required: true,
    //   },
    // ],
    assigned_by: { type: ObjectId, ref: "user", required: true },
    due_date: { type: Date, required: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model("task", taskSchema);
