import mongoose, { Schema } from "mongoose";
import { ecnryptPassword } from "../utils/index.js";
import bcrypt from "bcrypt";

let profile_imgs_name_list = [
  "Garfield",
  "Tinkerbell",
  "Annie",
  "Loki",
  "Cleo",
  "Angel",
  "Bob",
  "Mia",
  "Coco",
  "Gracie",
  "Bear",
  "Bella",
  "Abby",
  "Harley",
  "Cali",
  "Leo",
  "Luna",
  "Jack",
  "Felix",
  "Kiki",
];
let profile_imgs_collections_list = [
  "notionists-neutral",
  "adventurer-neutral",
  "fun-emoji",
];

const userSchema = new mongoose.Schema(
  {
    personal_info: {
      fullname: {
        type: String,
        lowercase: true,
        required: true,
        minlength: [3, "fullname must be 3 letters long"],
      },
      email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
      },
      password: {
        value: String,
        changed_at: Date,
      },
      username: {
        type: String,
        minlength: [3, "Username must be 3 letters long"],
        unique: true,
      },
      bio: {
        type: String,
        maxlength: [200, "Bio should not be more than 200"],
        default: "",
      },
      profile_img: {
        type: String,
        default: () => {
          return `https://api.dicebear.com/6.x/${
            profile_imgs_collections_list[
              Math.floor(Math.random() * profile_imgs_collections_list.length)
            ]
          }/svg?seed=${
            profile_imgs_name_list[
              Math.floor(Math.random() * profile_imgs_name_list.length)
            ]
          }`;
        },
      },
    },
    social_links: {
      youtube: {
        type: String,
        default: "",
      },
      instagram: {
        type: String,
        default: "",
      },
      facebook: {
        type: String,
        default: "",
      },
      twitter: {
        type: String,
        default: "",
      },
      github: {
        type: String,
        default: "",
      },
      website: {
        type: String,
        default: "",
      },
    },
    account_info: {
      total_posts: {
        type: Number,
        default: 0,
      },
      total_reads: {
        type: Number,
        default: 0,
      },
    },
    google_auth: {
      type: Boolean,
      default: false,
    },
    blogs: {
      type: [Schema.Types.ObjectId],
      ref: "blogs",
      default: [],
    },
  },
  {
    timestamps: {
      createdAt: "joinedAt",
    },
  }
);

// userSchema.methods.setUsername = function () {
// }

userSchema
  .virtual("password_value")
  .get(function () {
    return this.personal_info.password.value;
  })
  .set(function (password) {
    this.personal_info.password.changed_at = Date.now();
    this.personal_info.password.value = password;
  });

userSchema.virtual("passwordChangedAt").get(function () {
  return this.personal_info.password.changed_at;
});

// Ensure virtual fields are serialized
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

// MIDDLEWARES
/**
 * @description Hash password before saving
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("personal_info.password.value")) return next();

  if (this.google_auth) return next();

  try {
    this.personal_info.password.value = await ecnryptPassword(
      this.personal_info.password.value
    );
  } catch (error) {
    return next(error);
  }
});

// METHODS
/**
 * @description Compare password
 * @param {*} incomingPassword
 * @returns
 */
userSchema.methods.comparePassword = async function (incomingPassword) {
  // If user signed up with google, they don't have password, so they can't login with password
  if (!this.personal_info.password.value) return false;

  return await bcrypt.compare(
    incomingPassword,
    this.personal_info.password.value
  );
};

export default mongoose.model("users", userSchema);
