const express = require("express");
const errController = require("./controllers/errController");
const ConnectDB = require("./config/DB");
const dotenv = require("dotenv");
const bodyParser = require("body-parser")

const app = express();
const downRouter = require("./routes/downRouter");
const cors = require("cors");

dotenv.config({ path: "./config.env" });

app.use(
  cors({
    origin: "*",
  })
);

ConnectDB();

app.use(express.json());
app.use("/api/v1/video", downRouter);
app.use(errController);

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.listen(3000, () => {
  console.log("start server at port 3000");
});
