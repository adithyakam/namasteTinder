const express = require("express");

const app = express();

app.use("/hi", (req, res) => {
  res.send("response from server");
});

app.listen(3000, () => {
  console.log("Server is succesfully running on port 3000");
});
