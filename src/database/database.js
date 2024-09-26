const mongoose = require("mongoose");

const connectToDB = async () => {
  await mongoose.connect(
    "mongodb+srv://admin:adminHobby@hobby.0xrywu2.mongodb.net/namastetinder"
  );
};

module.exports = {
  connectToDB,
};
