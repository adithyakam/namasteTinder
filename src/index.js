const express = require("express");

const app = express();

app.use(
  "/test",
  (req, res, next) => {
    console.log("1");
    // res.send("1");
    next();
  },
  (req, res) => {
    console.log("2");
    next();
    // res.send("2");
  }
);

app.listen(3000, () => {
  console.log("Server is succesfully running on port 3000");
});
