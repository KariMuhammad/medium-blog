import bcrypt from "bcrypt";
import aws from "aws-sdk";
import { validationResult } from "express-validator";
import ApiError from "../services/ApiError.js";
import { nanoid } from "nanoid";
import config from "../../config.js";

/**
 * @description Validate the request for errors
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 * @returns
 */
export function validateRequest(req, res, next) {
  const errors = validationResult(req);

  // console.log(req.body);

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

/**
 * @description setup aws s3
 */
export function setupS3() {
  const s3 = new aws.S3({
    region: config.aws_region,
    accessKeyId: config.aws_access_key_id,
    secretAccessKey: config.aws_secret_access_key,
  });

  return s3;
}

/**
 * @description generate a upload url (aws s3)
 */
export async function generateUploadUrl() {
  const s3 = setupS3();

  const generateUniqueKey = () => {
    return `${nanoid()}-${new Date().getTime()}.jpeg`;
  };

  const params = {
    Bucket: "medium-blog-bucket",
    Key: generateUniqueKey(),
    ContentType: "image/jpeg",
    Expires: 60 * 5, // 5 minutes
  };

  return await s3.getSignedUrlPromise("putObject", params);
}
