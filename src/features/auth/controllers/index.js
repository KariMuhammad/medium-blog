import { getAuth } from "firebase-admin/auth";
import authServices from "../../../services/AuthServices.js";
import User from "../../../Schema/User.js";
import ApiError from "../../../services/ApiError.js";
import { generateUsernameByEmail } from "../../../utils/index.js";

class AuthController {
  register() {
    return async (req, res, next) => {
      try {
        const { fullname, email, password, username } = req.body;
        const user = await authServices.register(
          fullname,
          email,
          password,
          username
        );
        const token = authServices.generateToken(user);

        return res.status(200).json({
          user,
          token,
        });
      } catch (error) {
        return next(error);
      }
    };
  }
  login() {
    return async (req, res, next) => {
      try {
        const user = await authServices.login(
          req.body.email,
          req.body.password
        );

        const token = authServices.generateToken(user);

        return res.status(200).json({
          user,
          token,
        });
      } catch (error) {
        return next(error);
      }
    };
  }

  signWithGoogle() {
    return async (req, res, next) => {
      /**
       * @description access_token is coming from the client side using google firebase auth
       */
      const { access_token } = req.body;

      /**
       * @description get user info from google firebase auth
       */
      const { email, name, picture } = await getAuth().verifyIdToken(
        access_token
      );

      /**
       * @description check if user exists in the database
       */
      let user = await User.findOne({
        "personal_info.email": email,
      });

      if (user) {
        // If user exists and has no google_auth, you are not allowed to login with google (you should login with email and password)
        if (!user.google_auth) {
          return next(
            ApiError.forbidden(
              "User logged with email and password, and you trying to login with google"
            )
          );
          // else If user exists and has google_auth you are good to go (generate token and send it to the client)
        }
      } else {
        const username = generateUsernameByEmail(email);

        user = new User({
          personal_info: {
            profile_img: picture,
            fullname: name,
            email: email,
            username: username,
          },
          google_auth: true,
        });
        try {
          user = await user.save();
        } catch (error) {
          return next(ApiError.internal(error.message));
        }
      }

      const token = authServices.generateToken(user);
      return res.status(200).json({
        user,
        token,
      });
    };
  }

  profile() {
    return async (req, res, next) => {
      const { user } = req;

      return res.status(200).json({
        user,
      });
    };
  }
}

export default new AuthController();
