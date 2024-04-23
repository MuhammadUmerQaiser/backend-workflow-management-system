const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const notificationSchema = mongoose.Schema(
  {
    number: { type: String, required: true },
    date: { type: Date, default: Date.now },
    description: { type: String, required: true },
    information: [
      {
        _id: false,
        employeeId: { type: ObjectId, ref: "user", required: true },
        deskId: { type: ObjectId, ref: "desk", required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("notification", notificationSchema);
