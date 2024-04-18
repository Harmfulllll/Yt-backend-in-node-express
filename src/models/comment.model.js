const mongoose = require("mongoose");
const aggregate = require("mongoose-aggregate-paginate-v2");

const commentSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
commentSchema.plugin(aggregate);

module.exports = mongoose.model("Comment", commentSchema);
