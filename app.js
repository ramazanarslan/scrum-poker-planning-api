const dotenv = require("dotenv").config();

const express = require("express");
const app = express();

const port = process.env.PORT || 2222;

const logger = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  autoIndex: false,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;

// connection to mongodb
mongoose.connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);

app.use(bodyParser.json());
app.use(cors()); //TODO: security

const routes = require("./routes");

app.use(logger("dev"));
// Routing
app.use("/", routes);

// 404
app.use(function (req, res, next) {
  return res.status(404).send({ message: "Route" + req.url + " Not found." });
});

// 500 - Any server error
app.use(function (err, req, res, next) {
  console.log("KML: err", err);
  return res
    .status(500)
    .send({ errors: err.stack ? JSON.stringify(err.stack) : "API BOZUK" });
});

app.listen(port, () => console.log(`http://localhost:${port}`));
