import bcrypt from "bcrypt";

import { validationResult } from "express-validator";
import ApiError from "../services/ApiError.js";

/**
 * @description Validate the request for errors
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * @returns
 */
export function validateRequest(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const extractedErrors = [];

    errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));
    console.log("ERRORS", extractedErrors);

    return next(ApiError.badRequest(extractedErrors));
  }

  return next();
}

/**
 * @description Generate a username from the email
 * @param {*} email
 * @returns {String} username
 */
export function generateUsernameByEmail(email) {
  return email.split("@")[0].concat(Date.now().toString()); //register same time with different tld domain!
}

/**
 * @description Encrypt the password
 * @param {String} password
 * @returns {String} encrypted password
 */
export function ecnryptPassword(password) {
  return bcrypt.hash(password, 12);
}

/**
 * @description Parse the number to integer (base 10)
 * @param {*} number
 * @returns
 */
export function int(number) {
  return parseInt(number, 10);
}
