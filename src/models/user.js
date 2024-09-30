const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: [3, "Must be at least 3, got {VALUE}"],
      maxLength: [30, "Max limit is 30, got {VALUE}"],
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      trim: true,
      lowerCase: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword) {
          throw new Error("Enter strong Password");
        }
      },
    },
    age: {
      type: Number,
      validate(value) {
        if (value < 18 && value > 100) {
          throw new Error("Dont have valid age");
        }
      },
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Invalid gender");
        }
      },
    },
    photoUrl: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL");
        }
      },
    },
    about: {
      type: String,
      default: "Hi",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  try {
    const token = await jwt.sign(
      {
        _id: user._id,
      },
      "DevTinder",
      { expiresIn: "1d" }
    );
    console.log(token, "2");
    return token;
  } catch (error) {
    throw new Error(error);
  }
};

userSchema.methods.checkPwd = async function (password) {
  const user = this;

  let isPwdValid = bcrypt.compare(password, user.password);
  return isPwdValid;
};

const UserModel = mongoose.model("User", userSchema);

module.exports = {
  UserModel,
};
