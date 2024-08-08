import ApiError from "../../../services/ApiError.js";
import authServices from "../../../services/AuthServices.js";

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
