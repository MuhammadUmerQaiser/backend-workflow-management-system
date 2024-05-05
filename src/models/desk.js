const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const deskSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    // job_description: { type: String, required: true },
    // employee: [
    //   {
    //     type: ObjectId,
    //     ref: "user",
    //     required: true,
    //   },
    // ],
    working_group: [
      {
        type: ObjectId,
        ref: "working-group",
        required: true,
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("desk", deskSchema);
