const express = require("express");
const { isAuthenticated, isAdmin } = require("./middlewares/auth");
const { connectToDB } = require("./database/database");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const authRouter = require("../src/routes/auth");
const profileRouter = require("../src/routes/profile");
const requestsRouter = require("../src/routes/requests");
const userRouter = require("../src/routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);
app.use("/", userRouter);

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
