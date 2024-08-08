import "dotenv/config"; // execute dotenv.config()
import server from "./src/app.js";
import ErrorHandler from "./src/services/ErrorHandler.js";

const app = server.start().app;

// Error Handling
app.use(ErrorHandler.handle());

// Unhandled Rejection Error Handler
ErrorHandler.unhandledRejection();

// Uncaught Exception Error Handler
ErrorHandler.uncaughtException();
