import mongoose from "mongoose";
import { param } from "express-validator";
import { validateRequest } from "../utils/index.js";
import Blog from "../Schema/Blog.js";

class ParameterValidation {
  /**
   * @description Check if route parameter is valid or not
   * @param {*} model
   * @returns
   */
  isValidId = (model, id = "_id") => [
    param("id")
      .notEmpty()
      .withMessage(`'id' is not exist!`)
      .isMongoId()
      .withMessage("'id' is not valid mongoId")
      .custom((value) => {
        if (!mongoose.Types.ObjectId.isValid(value))
          throw Error("'id' parameter is not valid objectId");

        return true;
      }),

    validateRequest,
  ];

  /**
   * @description Check if this ID is exist in specific Model or not (check early)
   * @param {*} model
   * @returns
   */
  isExistId = (model, id = "_id") => [
    ...this.isValidId(),
    param("id").custom(async (value, { req }) => {
      console.log("value", value);
      console.log("id", id);
      const document = await model.find({ [id]: value });
      if (!document)
        throw Error(
          `there is no document in ${model.collection.collectionName} with this id ${value}`
        );

      return true;
    }),

    validateRequest,
  ];

  isValidBlogSlug = () => [
    param("id").custom(async (value, { req }) => {
      const blog = await Blog.findOne({ blog_id: value });
      if (!blog) throw Error("Blog not found");
      return true;
    }),

    validateRequest,
  ];
}

export default new ParameterValidation();
