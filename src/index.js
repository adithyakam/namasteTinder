const express = require("express");
const { isAuthenticated, isAdmin } = require("./middlewares/auth");
const { connectToDB } = require("./database/database");

const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const authRouter = require("../src/routes/auth");
const profileRouter = require("../src/routes/profile");
const requestsRouter = require("../src/routes/requests");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);

connectToDB()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(`${err} conncecting to db`);
  });

app.listen(3000, () => {
  console.log("Server is succesfully running on port 3000");
});
