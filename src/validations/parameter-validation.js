import mongoose from "mongoose";
import { param } from "express-validator";
import { validateRequest } from "../utils/index.js";

class ParameterValidation {
  /**
   * @description Check if route parameter is valid or not
   * @param {*} model
   * @returns
   */
  isValidId = (model) => [
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
  isExistId = (model) => [
    ...this.isValidId(),
    param("id").custom(async (value, { req }) => {
      const document = await model.findById(value);
      if (!document)
        throw Error(
          `there is no document in ${model.collection.collectionName} with this id ${value}`
        );

      return true;
    }),

    validateRequest,
  ];
}

export default new ParameterValidation();
