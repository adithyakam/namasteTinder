const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user");
const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new Error("Session expired");
    }

    const decodeToken = await jwt.verify(token, "DevTinder");
    const { _id } = decodeToken;
    const user = await UserModel.findById(_id);
    console.log(_id, user);

    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error:" + err);
  }
};

module.exports = {
  isAuthenticated,
};
