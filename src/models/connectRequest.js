const { type } = require("express/lib/response");
const moongoose = require("mongoose");

const conRqtSchema = new moongoose.Schema(
  {
    fromUserId: {
      type: moongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: moongoose.Schema.Types.ObjectId,
      required: true,
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

conRqtSchema.pre("save", function () {
  const connrqt = this;

  if (connrqt.fromUserId.equals(connrqt.toUserId)) {
    throw new Error("cant sent connect request to self");
  }
  next();
});

const conRqtModel = new moongoose.model("requests", conRqtSchema);

module.exports = conRqtModel;
