const router = require("express").Router();
const swaggerRouter = require("../config/swaggerSetup");
const controller = require("../controller");
router.use("/", swaggerRouter); //API DOCUMENTATION

/**
 * @swagger
 *
 * /sessions:
 *  post:
 *    tags:
 *    - name: Session
 *    summary: Create Session
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              numOfVoters:
 *                type: integer
 *              stories:
 *                type: string
 *    responses:
 *      '200':
 *        description: success
 */
router.post("/sessions", controller.createSession);

/**
 * @swagger
 *
 * /sessions/{sessionId}:
 *  get:
 *    tags:
 *    - name: Session
 *    summary: Get Session
 *    parameters:
 *     - in: path
 *       name: sessionId
 *       required: true
 *       schema:
 *         type: string
 *    responses:
 *      '200':
 *        description: success
 */
router.get("/sessions/:sessionId", controller.getSession);

/**
 * @swagger
 *
 * /sessions/{sessionId}/deactivate:
 *  get:
 *    tags:
 *    - name: Session
 *    summary: Deactivate Session
 *    parameters:
 *     - in: path
 *       name: sessionId
 *       required: true
 *       schema:
 *         type: string
 *    responses:
 *      '200':
 *        description: success
 */
router.get("/sessions/:sessionId/deactivate", controller.deactivateSession);

/**
 * @swagger
 *
 * /sessions/{sessionId}/remove-voter:
 *  post:
 *    tags:
 *    - name: Session
 *    summary: Remove Voter
 *    parameters:
 *     - in: path
 *       name: sessionId
 *       required: true
 *       schema:
 *         type: string
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              voterId:
 *                type: string
 *    responses:
 *      '200':
 *        description: success
 */
router.post(
  "/sessions/:sessionId/remove-voter",
  controller.removeVoterFromSession
);

/**
 * @swagger
 *
 * /story/{storyid}/finish:
 *  post:
 *    tags:
 *    - name: Story
 *    summary: Finalize Story
 *    parameters:
 *     - in: path
 *       name: storyid
 *       required: true
 *       schema:
 *         type: string
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              storyPoint:
 *                type: integer
 *    responses:
 *      '200':
 *        description: success
 */
router.post("/story/:storyid/finish", controller.finalizeStory);

/**
 * @swagger
 *
 * /story/{storyid}/add-vote:
 *  post:
 *    tags:
 *    - name: Story
 *    summary: Add Vote to Story
 *    parameters:
 *     - in: path
 *       name: storyid
 *       required: true
 *       schema:
 *         type: string
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              point:
 *                type: string
 *              isScrumMaster:
 *                type: string
 *    responses:
 *      '200':
 *        description: success
 */
router.post("/story/:storyid/add-vote", controller.addVote);

module.exports = router;
