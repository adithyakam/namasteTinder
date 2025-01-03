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

      // Validate status
      const allowedStatus = ["ignored", "intrested", "accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid status provided" });
      }

      // Validate toUserId
      if (!mongoose.Types.ObjectId.isValid(toUserId)) {
        return res.status(400).json({ message: "Invalid toUserId provided" });
      }

      // Check for duplicate connection requests
      const existingConnection = await conRqtModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnection) {
        return res
          .status(400)
          .json({ message: "Connection request already exists" });
      }

      // Create and save a new connection request
      const connectionRequest = new conRqtModel({
        fromUserId,
        toUserId,
        status,
      });

      const savedRequest = await connectionRequest.save();

      // Respond with success
      res.status(201).json({
        message: "Connection request sent successfully",
        data: savedRequest,
      });
    } catch (err) {
      console.error("Error in /request/send:", err); // Log the error for debugging
      res
        .status(500)
        .json({ message: "An error occurred. Please try again later." });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  isAuthenticated,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const allowedStatus = ["rejected", "accepted", "ignored"];
      const { status, requestId } = req.params;

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid status provided." });
      }

      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res.status(400).json({ message: "Invalid requestId format." });
      }

      const connectionRqt = await conRqtModel.findOneAndUpdate(
        {
          _id: requestId,
          toUserId: loggedInUser._id,
          status: "intrested",
        },
        { status: status },
        { new: true }
      );

      if (connectionRqt === null) {
        return res.status(400).json({ message: "Not found request" });
      }

      res.json({ message: `Connection request ${status}.`, connectionRqt });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
);

module.exports = requestRouter;
