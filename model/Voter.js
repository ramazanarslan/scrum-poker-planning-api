const mongoose = require("mongoose");
const VoterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      max: [200, "Max 200 character can be."],
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const Voter = mongoose.model("Voter", VoterSchema);

module.exports = Voter;
