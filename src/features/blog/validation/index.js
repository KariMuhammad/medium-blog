import { body } from "express-validator";
import { validateRequest } from "../../../utils/index.js";

class Validation {
  create() {
    return [
      body("title")
        .notEmpty()
        .withMessage("Blog title is required!")
        .isLength({ min: 5, max: 70 })
        .withMessage(
          "Blog title must be at least 5 characters long, at most 70!"
        ),

      // if draft it true, then all valdation below is not required
      // because draft is not published yet!

      body("content")
        .if(body("draft").equals("false"))
        .notEmpty()
        .withMessage("Blog content is required!")
        .isArray()
        .withMessage("Content must be an array of strings!")
        .isLength({ min: 3 })
        .withMessage("Content must be at least 3 strings long!"),
      body("description")
        .if(body("draft").equals("false"))
        .notEmpty()
        .withMessage("Description is required!")
        .isLength({ min: 5, max: 200 })
        .withMessage(
          "Description must be at least 5 characters long, at most 200!"
        ),

      body("tags")
        .if(body("draft").equals("false"))
        .notEmpty()
        .withMessage("Tags are required!")
        .isArray()
        .withMessage("Tags must be an array of strings!")
        .custom((value) => {
          if (value.length >= 1 && value.length <= 10) return true;
          throw new Error("Tags must be at least 1 string long, at most 10!");
        }),

      body("banner")
        .if(body("draft").equals("false"))
        .notEmpty()
        .withMessage("Banner is required!")
        .isURL()
        .withMessage("Banner must be a valid URL!"),

      validateRequest,
    ];
  }
}

export default new Validation();
