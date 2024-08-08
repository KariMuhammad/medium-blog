import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import config from "../../config.js";
import User from "../Schema/User.js";
import ApiError from "./ApiError.js";

class AuthServices {
  constructor(userModel = User) {
    this.userModel = userModel;
  }

  async register(fullname, email, password, username) {
    try {
      const user = await this.userModel.create({
        personal_info: {
          fullname,
          email,
          username,
        },
        password_value: password, // This is a virtual field
      });

      return user;
    } catch (error) {
      throw ApiError.internal(error.message);
    }
  }

  async login(email, password) {
    const user = await this.userModel.findOne({ "personal_info.email": email });

    if (!user) {
      throw ApiError.badRequest("Credentials are invalid (email)");
    }

    if (!(await user.comparePassword(password))) {
      throw ApiError.badRequest("Credentials are invalid (password)");
    }

    return user;
  }

  generateToken(user) {
    return jwt.sign({ id: user._id }, config.secret_key, {
      expiresIn: "2d",
    });
  }

  verifyToken(token) {
    return jwt.verify(token, config.secret_key);
  }

  getTokenFromHeader(authorization) {
    return authorization.split(" ")[1];
  }
}

export default new AuthServices(User);
