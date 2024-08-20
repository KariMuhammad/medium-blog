import mongoose, { Schema } from "mongoose";
import User from "./User.js";

const blogSchema = new mongoose.Schema(
  {
    blog_id: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    banner: {
      type: String,
      // required: true,
    },
    description: {
      type: String,
      maxlength: 200,
      // required: true
    },
    content: {
      type: [],
      // required: true
    },
    tags: {
      type: [String],
      // required: true
    },
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    activity: {
      total_likes: {
        type: Number,
        default: 0,
      },
      total_comments: {
        type: Number,
        default: 0,
      },
      total_reads: {
        type: Number,
        default: 0,
      },
      total_parent_comments: {
        type: Number,
        default: 0,
      },
    },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: "comments",
    },
    draft: {
      type: String,
      enum: ["true", "false"],
      default: "false",
    },
  },
  {
    timestamps: {
      createdAt: "publishedAt",
    },
  }
);

// blogSchema.pre("save", async function (next) {
//   const authorId = this.author;

//   await User.findByIdAndUpdate(authorId, {
//     $inc: { "account_info.total_posts": this.draft === "true" ? 0 : 1 },
//   }).then(() => next());

//   next();
// });

export default mongoose.model("blogs", blogSchema);
