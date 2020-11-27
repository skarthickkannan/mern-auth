const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const UserRouter = require("./routes/UserRouter");
const PostRouter = require("./routes/PostRouter");

const config = require("./config/key");

app.use(cors());
mongoose
  .connect(config.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Mongodb Connected");
  });

app.use(express.json());

app.use("/api/v1/user", UserRouter);
app.use("/api/v1/post", PostRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("Server started at " + port);
});
