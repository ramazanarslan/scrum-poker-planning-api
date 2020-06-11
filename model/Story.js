const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StorySchema = new Schema(
  {
    session: { type: Schema.Types.ObjectId, ref: "Session" },
    name: {
      type: String,
      max: [200, "Max 200 character can be."],
      required: "Session name is required",
    },
    status: {
      type: String,
      enum: ["Active", "Voted", "Not Voted"],
      default: "Not Voted",
    },
    order: Number,
    votes: [{ type: Schema.Types.ObjectId, ref: "Vote" }],
    storyPoint: { type: Number, min: 1, required: false },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const Story = mongoose.model("Story", StorySchema);

module.exports = Story;
