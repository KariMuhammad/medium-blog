import config from "../../config.js";

class ErrorHandler {
  constructor(environment) {
    this.environment = environment;
  }

  handle() {
    return (error, req, res, next) => {
      let errors = {};
      if (this.environment === "development") {
        errors = this.handleDev(error);
      }

      if (this.environment === "production") {
        errors = this.handleProd(error);
      }

      return res.status(errors.statusCode).json({
        errors: errors,
      });
    };
  }

  //   Error Handler in Development
  handleDev(error) {
    return {
      message: error.message,
      statusCode: error.statusCode,
      stack: error.stack,
    };
  }

  //   Error Handler in Production
  handleProd(error) {
    return {
      message: error.message,
      statusCode: error.statusCode,
    };
  }

  //   Unhandled Rejection Error Handler
  unhandledRejection() {
    process.on("unhandledRejection", (err) => {
      console.log("UNHANDLED REJECTION! Shutting down...");
      console.log(err.name, err.message);
      process.exit(1);
    });
  }

  //   Uncaught Exception Error Handler
  uncaughtException() {
    process.on("uncaughtException", (err) => {
      console.log("UNCAUGHT EXCEPTION! Shutting down...");
      console.log(err.name, err.message);
      process.exit(1);
    });
  }
}

export default new ErrorHandler(config.env);
