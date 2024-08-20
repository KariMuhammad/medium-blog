import User from "../Schema/User.js";
import ApiError from "../services/ApiError.js";
import AuthServices from "../services/AuthServices.js";
import { int } from "../utils/index.js";

/**
 * @description Middleware to check if Authorization header is present
 * @returns {Function} Middleware function
 */
function checkAuthHeader() {
  return async (req, res, next) => {
    // Check if Authorization header is present
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer")
    )
      return next(ApiError.unauthorized("Unauthorized, Please Login"));

    const token = req.headers.authorization.split(" ")[1];

    if (!token)
      return next(ApiError.unauthorized("Unauthorized, Please Login"));

    next();
  };
}

/**
 * @description Middleware to check if user is authenticated
 * @returns {Function} Middleware function
 */
export function guard() {
  return async (req, res, next) => {
    checkAuthHeader()(req, res, async (error) => {
      if (error) return next(error);

      // Present? Extract from Token (user id, iat)
      const { authorization } = req.headers;
      try {
        const token = authorization.split(" ")[1];
        const payload = AuthServices.verifyToken(token);

        if (!payload)
          return next(ApiError.unauthorized("Unauthorized, Please Login"));

        // Check if user exists
        const user = await User.findById(payload.id);
        if (!user) return next(ApiError.notFound("Account is not exists!"));

        // user exists? check password changed at
        // if password changed at date is greater than iat of token (created_at)
        // that means user changed password after token is created!
        const passwordChangedAt = int(
          Date.parse(user.passwordChangedAt) / 1000
        );
        if (passwordChangedAt > payload.iat)
          return next(ApiError.unauthorized("Please Login again!"));

        // All is OK
        req.user = user;
      } catch (error) {
        return next(ApiError.internal(error.message));
      }

      next();
    });
  };
}

/**
 * @description middleware alike guard but does not throw error if not authenticated
 * @returns {Function} Middleware function
 */
export function isGuarded() {
  return async (req, res, next) => {
    checkAuthHeader()(req, res, async (error) => {
      if (error) return next();

      // Present? Extract from Token (user id, iat)
      const { authorization } = req.headers;
      try {
        const token = authorization.split(" ")[1];
        const payload = AuthServices.verifyToken(token);

        if (!payload) return next();

        // Check if user exists
        const user = await User.findById(payload.id);
        if (!user) return next();

        // user exists? check password changed at
        // if password changed at date is greater than iat of token (created_at)
        // that means user changed password after token is created!
        if (!user.google_auth) {
          const passwordChangedAt = int(
            Date.parse(user.passwordChangedAt) / 1000
          );
          if (passwordChangedAt > payload.iat) return next();
        }

        // All is OK
        req.user = user;
        return next();
      } catch (error) {
        return next();
      }
    });
  };
}

/**
 * @description Middleware to check if user is authenticated + user is admin
 * @returns {Function} Middleware function
 */
export function guardAdmin() {
  return (req, res, next) => {
    guard()(req, res, (error) => {
      if (error) return next(error);

      // Check if user is admin
      if (!req.user.role === "admin")
        return next(ApiError.forbidden("Forbidden, Admin only!"));

      next();
    });
  };
}

/**
 * @description Middleware to Allow only guest users
 * @returns {Function} Middleware function
 */
export function guest() {
  return (req, res, next) => {
    checkAuthHeader()(req, res, (error) => {
      if (error) return next();

      next(ApiError.forbidden("Forbidden, Already Logged in (maybe)!"));
    });
  };
}

/**
 * @description Middleware to allow specific roles
 * @param {Array} roles - Array of roles
 * @returns {Function} Middleware function
 */
export function allowRoles(roles) {
  return (req, res, next) => {
    guard()(req, res, (error) => {
      if (error) return next(error);

      // Check if user role is in roles array
      if (!roles.includes(req.user.role))
        return next(ApiError.forbidden("Forbidden, Access Denied!"));

      next();
    });
  };
}
