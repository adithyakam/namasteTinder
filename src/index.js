const express = require("express");
const { isAuthenticated, isAdmin } = require("./middlewares/auth");
const { connectToDB } = require("./database/database");
const { UserModel } = require("./models/user");
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const user = new UserModel(req.body);
    await user.save();

    res.send("user added successfully");
  } catch (error) {
    res.status(400).send(error + "Something went wrong while creating user");
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

app.get("/feed", async (req, res) => {
  try {
    let users = await UserModel.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send(error + "Something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    let user = await UserModel.findByIdAndDelete(userId);
    res.send("User deleted Succeesfully");
  } catch (error) {
    res.status(400).send(error + "Something went wrong");
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  if (data.skills.length > 10) {
    throw new Error("Skills cant be more than 10");
  }

  const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];

  try {
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error("Updates not allowed");
    }

    let user = await UserModel.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    res.send("User updated successfully");
  } catch (error) {
    res.status(400).send(error + " Something went wrong");
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
