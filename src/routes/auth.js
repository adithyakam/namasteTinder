const { isAuthenticated, isAdmin } = require("../middlewares/auth");
const { UserModel } = require("../models/user");

const express = require("express");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  let {
    firstName,
    lastName,
    gender,
    age,
    emailId,
    password,
    photoUrl,
    skills,
  } = req.body;

  try {
    const encryptedPwd = await bcrypt.hash(password, 10);
    const user = new UserModel({
      firstName,
      lastName,
      gender,
      age,
      emailId,
      photoUrl,
      skills,
      password: encryptedPwd,
    });
    await user.save();

    res.send("user added successfully");
  } catch (error) {
    res.status(400).send(error + "Something went wrong while creating user");
  }
});
authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;

  try {
    const user = await UserModel.findOne({ emailId });

    if (!user) {
      return res.status(400).send("Invalid credentials");
    }

    // Assuming checkPwd compares the input password with the stored hash
    const isPwdValid = await user.checkPwd(password);

    if (isPwdValid) {
      // Assuming getJWT is a method on the user instance that generates a token
      const token = await user.getJWT();
      res.cookie("token", token, { maxAge: 3600 * 1000, httpOnly: true });
      return res.send("Login Successful");
    } else {
      return res.status(400).send("Invalid credentials");
    }
  } catch (err) {
    return res
      .status(500)
      .send("An error occurred during login: " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send();
});

module.exports = authRouter;
