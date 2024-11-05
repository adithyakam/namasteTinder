const express = require("express");
const { UserModel } = require("../models/user");
const { isAuthenticated } = require("../middlewares/auth");
const conRqtModel = require("../models/connectRequest");
const { default: mongoose } = require("mongoose");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  isAuthenticated,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const { toUserId, status } = req.params;

      const allowedStatus = ["ignore", "intrested", "accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        new Error("Status not Allowed");
      }

      const validToUser = await mongoose.Types.ObjectId.isValid(toUserId);

      if (!validToUser) {
        return res.status(404).json({ message: "User not valid" });
      }

      const containsDuplicate = await conRqtModel.findOne({
        $or: [
          { fromUserId, toUserId },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });

      if (containsDuplicate) {
        return res.status(400).send({
          message: "Connection already present ",
        });
      }

      const conrqt = new conRqtModel({
        fromUserId: fromUserId,
        toUserId: toUserId,
        status: status,
      });

      const data = await conrqt.save();

      res.json({
        message: "Connection Request Sent succesfully",
        data,
      });
    } catch (err) {
      res.status(400).send("Error" + err.message);
    }
  }
);

module.exports = requestRouter;
