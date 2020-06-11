const Session = require("../model/Session");
const Story = require("../model/Story");
const Vote = require("../model/Vote");
const Voter = require("../model/Voter");
exports.createSession = async (req, res, next) => {
  try {
    const { name, numOfVoters, stories } = req.body;
    if (typeof stories !== "string" || stories.length === 0) {
      throw new Error("stories is required");
    }

    if (typeof name !== "string" || name.length === 0 || name.length > 200) {
      throw new Error("name is required and max 200 char should be.");
    }

    if (!Number.isInteger(numOfVoters) || numOfVoters <= 0) {
      throw new Error("Number of  voters should be more than 0");
    }

    const session = await Session.create({ name, numOfVoters });

    const storyArray = stories.split("\n");
    let createdStories = [];
    for (let index = 0; index < storyArray.length; index++) {
      const element = storyArray[index];
      if (element.trim()) {
        const story = await Story.create({
          status: index === 0 ? "Active" : "Not Voted",
          session: session._id,
          name: element.trim(),
          order: index,
        });
        createdStories.push(story._doc);
      }
    }

    return res.json({ session: session._doc, stories: createdStories });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

function isValidObjId(_id) {
  try {
    const mongoose = require("mongoose");
    const {
      Types: { ObjectId },
    } = mongoose;
    if (ObjectId.isValid(_id) && new ObjectId(_id).toString() === _id) {
      return true;
    } else return false;
  } catch (error) {
    return false;
  }
}
exports.removeVoterFromSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { voterId } = req.body;
    console.log("KML: exports.removeVoterFromSession -> voterId", voterId);
    if (!isValidObjId(sessionId)) {
      throw new Error("Invalid sesssion id ");
    }
    const session = await Session.findById(sessionId);
    console.log(
      "KML: exports.removeVoterFromSession -> session.attendedVoters",
      session.attendedVoters
    );
    session.attendedVoters = session.attendedVoters.filter(
      (e) => String(e._id) !== voterId
    );
    console.log(
      "KML: exports.removeVoterFromSession -> session.attendedVoters",
      session.attendedVoters
    );
    await session.save();
    return res.json();
  } catch (error) {
    return res.status(400).json(error.message);
  }
};
exports.deactivateSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    if (!isValidObjId(sessionId)) {
      throw new Error("Invalid sesssion id ");
    }
    await Session.findByIdAndUpdate(sessionId, { isActive: false });

    return res.json();
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

exports.getSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { voterId, isScrumMaster } = req.query;

    if (!isValidObjId(sessionId)) {
      throw new Error("Invalid sesssion id ");
    }

    const session = await Session.findById(sessionId).populate(
      "attendedVoters"
    );
    if (session && !session.isActive) {
      throw new Error("Session ended");
    }

    if (
      session.attendedVoters &&
      session.attendedVoters.length === session.numOfVoters &&
      voterId === "initial"
    ) {
      throw new Error("Room is full :), all voters are in the room.");
    }

    const stories = await Story.find({ session: session._id })
      .populate("votes")
      .lean();

    let voter = null;
    if (voterId === "initial") {
      voter = await Voter.create({
        name: isScrumMaster
          ? "Scrum Master"
          : "Voter " + String(session.attendedVoters.length + 1),
      });
      session.attendedVoters.push(voter._id);
      await session.save();
    } else voter = await Voter.findById(voterId);

    let activeStory = stories.find((s) => s.status === "Active");
    let votes = [];

    const isAllVoterAreVoted =
      session.attendedVoters &&
      activeStory &&
      session.attendedVoters.length === activeStory.votes.length;

    if (activeStory) {
      if (Array.isArray(session.attendedVoters)) {
        session.attendedVoters.map((el) => {
          const point = activeStory.votes.find(
            (v) => String(v.voter) === String(el._id)
          )
            ? activeStory.votes.find((v) => String(v.voter) === String(el._id))
                .point
            : null;

          const updatedAt = activeStory.votes.find(
            (v) => String(v.voter) === String(el._id)
          )
            ? activeStory.votes.find((v) => String(v.voter) === String(el._id))
                .updatedAt
            : "";
          votes.push({
            name: el.name,
            point:
              point && isAllVoterAreVoted
                ? point
                : point && !isAllVoterAreVoted
                ? "Voted"
                : "Not Voted",
            updatedAt: updatedAt,
          });
        });
      }
    }

    return res.json({
      session: session._doc,
      stories,
      voter,
      votes,
      isAllVoterAreVoted,
    });
  } catch (error) {
    console.log("KML: exports.getSession -> error", error);
    return res.status(400).json(error.message);
  }
};
exports.finalizeStory = async (req, res, next) => {
  try {
    const { storyid } = req.params;
    const { storyPoint } = req.body;

    if (!isValidObjId(storyid)) {
      throw new Error("Invalid sesssion id ");
    }

    if (!storyPoint || !Number.isInteger(storyPoint)) {
      throw new Error("Invalid storyPoint ");
    }
    const finalized = await Story.findByIdAndUpdate(storyid, {
      storyPoint,
      status: "Voted",
    });
    console.log("KML: exports.finalizeStory -> finalized", finalized.order);

    const nextStory = await Story.findOne({
      order: finalized.order + 1,
      session: finalized.session,
    });
    console.log("KML: exports.finalizeStory -> nextStory", nextStory);
    if (nextStory) {
      nextStory.status = "Active";
      await nextStory.save();
      return res.json({ sessionStatus: "next" });
    } else {
      return res.json({ sessionStatus: "end" });
    }
  } catch (error) {
    console.log("KML: exports.finalizeStory -> error", error);
    return res.status(400).json(error.message);
  }
};

exports.addVote = async (req, res, next) => {
  try {
    const { storyid } = req.params;
    const { voterId } = req.query;

    if (!isValidObjId(storyid)) {
      throw new Error("Invalid storyid id ");
    }

    const { point, isScrumMaster } = req.body;
    console.log("KML: exports.addVote -> isScrumMaster", isScrumMaster);

    const pockers = [
      "1",
      "2",
      "3",
      "5",
      "8",
      "13",
      "21",
      "34",
      "55",
      "89",
      "134",
      "?",
    ];

    if (!pockers.includes(point)) {
      throw new Error("Invalid pocker number");
    }

    const story = await Story.findOne({ _id: storyid });
    if (story) {
      const vote = await Vote.create({
        point,
        isScrumMaster: isScrumMaster || undefined,
        voter: isValidObjId(voterId) ? voterId : undefined,
      });
      console.log("KML: exports.addVote -> vote", vote);

      story.votes.push(vote._id);
      await story.save();
    }

    return res.json();
  } catch (error) {
    return res.status(400).json(error.message);
  }
};
