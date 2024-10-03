const { isAuthenticated } = require("../middlewares/auth");
const { UserModel } = require("../models/user");
const express = require("express");

const { validateUserData } = require("../database/utils/validators");

const profileRouter = express.Router();

profileRouter.post("/user", async (req, res) => {
  const email = req.body.emailId;
  try {
    let user = await UserModel.findOne({ emailId: email });

    if (!user) res.status("404").send("No user found");
    res.send(user);
  } catch (error) {
    res.status(400).send(error + "Something went wrong");
  }
});

profileRouter.get("/profile/view", isAuthenticated, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(400).send("Please login again, session expireds");
  }
});

profileRouter.patch("/profile/edit", isAuthenticated, async (req, res) => {
  try {
    if (!validateUserData(req)) {
      throw new Error("Invalid edit option");
    }

    const user = req.user;

    Object.keys(req.body).forEach((key) => (user[key] = req.body[key]));
    await user.save();
    res.json({
      message: `${user.firstName} your profile updated succesfully`,
      data: user,
    });
  } catch (error) {
    res.status(400).send("Invalid profile" + error);
  }
});

module.exports = profileRouter;
