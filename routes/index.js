const router = require("express").Router();
const swaggerRouter = require("../config/swaggerSetup");
const controller = require("../controller");
router.use("/api-docs", swaggerRouter); //API DOCUMENTATION

router.post("/sessions", controller.createSession);

router.get("/sessions/:sessionId", controller.getSession);
router.get("/sessions/:sessionId/deactivate", controller.deactivateSession);

router.post(
  "/sessions/:sessionId/remove-voter",
  controller.removeVoterFromSession
);

router.post("/story/:storyid/finish", controller.finalizeStory);
router.post("/story/:storyid/add-vote", controller.addVote);

module.exports = router;
