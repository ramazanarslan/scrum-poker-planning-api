const mongoose = require("mongoose");
const SessionSchema = new mongoose.Schema(
  {
    isActive: { type: Boolean, default: true },
    name: {
      type: String,
      max: [200, "Max 200 character can be."],
      required: "Session name is required",
    },
    numOfVoters: {
      type: Number,
      min: [1, "Min 1 voter should be. "],
      required: "Please enter number of voters",
    },
    attendedVoters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Voter" }],
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const Session = mongoose.model("Session", SessionSchema);

module.exports = Session;
