const express = require("express");
const { isAuthenticated } = require("../middlewares/auth");
const conRqtModel = require("../models/connectRequest");
const userRouter = express.Router();

userRouter.get("/user/requests/recieved", isAuthenticated, async (req, res) => {
  try {
    const user = req.user;

    const data = await conRqtModel
      .find({
        toUserId: user._id,
        status: "intrested",
      })
      .populate("fromUserId", ["firstName", "lastName"]);

    res.json({ message: "Successfully got data", data });
  } catch (error) {
    res.status(500).json({ message: "Error fetching data" + error.message });
  }
});

userRouter.get("/user/connections", isAuthenticated, async (req, res) => {
  try {
    const user = req.user;

    const data = await conRqtModel
      .find({
        $or: [
          { toUserId: user._id, status: "accepted" },
          {
            fromUserId: user._id,
            status: "accepted",
          },
        ],
      })
      .populate("fromUserId", ["firstName", "lastName"])
      .populate("toUserId", ["firstName", "lastName"]);

    const newData = data.map((row) => {
      if (row.fromUserId._id.toString() === user._id) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    });

    res.json({ message: "Successfully got data", newData });
  } catch (error) {
    res.status(500).json({ message: "Error fetching data" + error.message });
  }
});

module.exports = userRouter;
