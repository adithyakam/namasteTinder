const express = require("express");
const { isAuthenticated, isAdmin } = require("./middlewares/auth");
const { connectToDB } = require("./database/database");
const { UserModel } = require("./models/user");
const app = express();
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
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
      console.log(token, "1");
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

app.post("/user", async (req, res) => {
  const email = req.body.emailId;
  try {
    let user = await UserModel.findOne({ emailId: email });

    if (!user) res.status("404").send("No user found");
    res.send(user);
  } catch (error) {
    res.status(400).send(error + "Something went wrong");
  }
});

app.get("/profile", isAuthenticated, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(400).send("Please login again, session expireds");
  }
});

connectToDB()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(`${err} conncecting to db`);
  });

app.listen(3000, () => {
  console.log("Server is succesfully running on port 3000");
});
