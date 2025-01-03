const express = require("express");
const { isAuthenticated } = require("../middlewares/auth");
const conRqtModel = require("../models/connectRequest");
const { UserModel } = require("../models/user");
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

userRouter.get("/user/requests/recieved", isAuthenticated, async (req, res) => {
  try {
    const user = req.user;

    const data = await conRqtModel
      .find({
        toUserId: user._id,
        status: "intrested",
      })
      .populate("fromUserId", USER_SAFE_DATA);

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
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

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

userRouter.get("/feed", isAuthenticated, async (req, res) => {
  try {
    const user = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequest = await conRqtModel
      .find({
        $or: [{ fromUserId: user._id }, { toUserId: user._id }],
      })
      .select(["fromUserId", "toUserId"]);

    const hideUsers = new Set();

    connectionRequest.map((ele) => {
      hideUsers.add(ele.fromUserId.toString());
      hideUsers.add(ele.toUserId.toString());
    });

    const users = await UserModel.find({
      $and: [
        { _id: { $nin: Array.from(hideUsers) } },
        { _id: { $ne: user._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.send({ data: users });
  } catch (error) {
    throw new Error("Something went wrong" + error.message);
  }
});

module.exports = userRouter;
