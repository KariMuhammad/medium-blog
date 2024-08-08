class ApiError extends Error {
  constructor(message, statusCode = 500) {
    super();
    this.message = message;
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message) {
    return new ApiError(message, 400);
  }

  static unauthorized(message) {
    return new ApiError(message, 401);
  }

  static forbidden(message) {
    return new ApiError(message, 403);
  }

  static notFound(message) {
    return new ApiError(message, 404);
  }

  static conflict(message) {
    return new ApiError(message, 409);
  }

  static internal(message) {
    return new ApiError(message, 500);
  }
}

export default ApiError;
