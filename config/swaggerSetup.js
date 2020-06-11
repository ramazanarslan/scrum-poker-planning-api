const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const moment = require("moment");
const lastUpdateTime =
  "Last Update Time: `" + `${moment().format("DD MMMM YYYY hh:mm")}` + "`";
const options = {
  definition: {
    openapi: "3.0.0", // Specification (optional, defaults to swagger: '2.0')

    info: {
      title: "API Docs", // Title (required)
      version: "1.0.0", // Version (required),
      description: lastUpdateTime,
    },
  },
  apis: ["routes/*.js", "routes/*/*.js", "routes/*/*/*.js"],
};
const swaggerSpec = swaggerJSDoc(options);
const router = require("express").Router();

router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
module.exports = router;
