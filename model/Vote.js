const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VoteSchema = new Schema(
  {
    point: {
      type: String,
      enum: ["1", "2", "3", "5", "8", "13", "21", "34", "55", "89", "134", "?"],
      default: "?",
    },
    isScrumMaster: { type: Boolean, default: false },

    voter: { type: Schema.Types.ObjectId, ref: "Voter" },
  },

  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const Vote = mongoose.model("Vote", VoteSchema);

module.exports = Vote;
