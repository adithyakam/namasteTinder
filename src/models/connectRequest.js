const { type } = require("express/lib/response");
const moongoose = require("mongoose");

const conRqtSchema = new moongoose.Schema(
  {
    fromUserId: {
      type: moongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: moongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignore", "intrested", "accepted", "rejected"],
        message: `{VALUE} is incorrect`,
      },
    },
  },
  {
    timestamps: true,
  }
);

conRqtSchema.index({ fromUserId: 1, toUserId: 1 });

conRqtSchema.pre("save", async function (next) {
  try {
    const connrqt = this;

    if (connrqt.fromUserId.equals(connrqt.toUserId)) {
      throw new Error("cant sent connect request to self");
    }
    next();
  } catch (error) {
    throw new Error("error in saving try in sometime");
  }
});

const conRqtModel = new moongoose.model("requests", conRqtSchema);

module.exports = conRqtModel;
