import { body } from "express-validator";

import {
  generateUsernameByEmail,
  validateRequest,
} from "../../../utils/index.js";

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/; // Password must contain at least one number, one lowercase, one uppercase letter, and at least 6 characters

import User from "../../../Schema/User.js";
import ApiError from "../../../services/ApiError.js";

class Validator {
  sign_up() {
    return [
      body("fullname")
        .isString()
        .notEmpty()
        .withMessage("Fullname is required")
        .trim()
        .escape()
        .isLength({ min: 3, max: 50 })
        .withMessage("Fullname must be between 3 to 50 characters"),

      body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is invalid")
        // Check if email is already in use
        .custom(async (email, { req }) => {
          const user = await User.findOne({ personal_info: { email } });

          if (user)
            return next(
              ApiError.badRequest(
                "Email is already in use, please use another email"
              )
            );

          req.user = user;
          return true;
        })
        // username is the first part of email before @
        .custom(async (email, { req }) => {
          // Email different (different tls, different domain), but same split("@")[0]
          const username = email.split("@")[0];
          req.body.username = username;

          if (!(await User.findOne({ personal_info: { username } })))
            req.body.username = generateUsernameByEmail(email);

          return true;
        }),

      body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters")
        .custom(async (password, { req }) => {
          if (!passwordRegex.test(password))
            return next(
              ApiError.badRequest(
                "Password must contain at least one number, one lowercase, one uppercase letter, and at least 6 characters"
              )
            );

          return true;
        }),

      validateRequest,
    ];
  }

  sign_in() {
    return [
      body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is invalid"),

      body("password").notEmpty().withMessage("Password is required"),

      validateRequest,
    ];
  }

  signWithGoogle() {
    return [
      body("access_token").notEmpty().withMessage("Choose account to sign"),
    ];
  }

  changePassword() {
    return [
      body("current-password")
        .notEmpty()
        .withMessage("Current password is required")
        .isLength({ min: 6 })
        .withMessage("Password is invalid"),

      body("new-password")
        .notEmpty()
        .withMessage("New password is required")
        .isLength({ min: 6 })
        .withMessage("Password is invalid")
        .custom((password, { req }) => {
          if (!passwordRegex.test(password))
            throw ApiError.badRequest(
              "Password must contain at least one number, one lowercase, one uppercase letter, and at least 6 characters"
            );

          return true;
        }),

      validateRequest,
    ];
  }

  updateImage() {
    return [
      body("url").notEmpty().withMessage("Image URL is not exist!"),
      validateRequest,
    ];
  }
  updateProfile() {
    return [
      body("username")
        .optional()
        .custom(async (value, { req }) => {
          const user = await User.findOne({ "personal_info.username": value });

          if (!user) return true;

          if (user.id === req.user.id.toString()) {
            delete req.body["username"];
            return true;
          }

          if (user) throw ApiError.badRequest("Username is already be taken!");

          return true;
        }),

      body("bio")
        .optional()
        .isString()
        .isLength({ min: 20, max: 200 })
        .withMessage("min: 20, max: 200"),

      body("github")
        .optional({ values: "falsy" })
        .isURL()
        .withMessage("Should be a real (url)"),
      body("facebook")
        .optional({ values: "falsy" })
        .isURL()
        .withMessage("Should be a real (url)"),
      body("instagream")
        .optional({ values: "falsy" })
        .isURL()
        .withMessage("Should be a real (url)"),
      body("website")
        .optional({ values: "falsy" })
        .isURL()
        .withMessage("Should be a real (url)"),
      body("youtube")
        .optional({ values: "falsy" })
        .isURL()
        .withMessage("Should be a real (url)"),
      body("twitter")
        .optional({ values: "falsy" })
        .isURL()
        .withMessage("Should be a real (url)"),

      validateRequest,
    ];
  }
}

export default new Validator();
