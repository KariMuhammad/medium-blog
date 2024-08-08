import express from "express";

import config from "../config.js";

import setup_db from "./database/index.js";

import auth from "./features/auth/index.js";
import morgan from "morgan";

class Server {
  constructor() {
    this.app = express();
  }

  setup_db() {
    setup_db();
  }

  setup_standard_middleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static("public"));
    if (config.env === "development") this.app.use(morgan("dev"));
  }

  setup_server() {
    this.app.listen(config.port, () => {
      console.log(`Server is listening now on PORT ${config.port}`);
    });
  }

  mountRoutes() {
    this.app.use("/auth", auth.router);
  }

  start() {
    this.setup_db();
    this.setup_server();
    this.setup_standard_middleware();
    this.mountRoutes();

    return this;
  }

  getApp() {
    return this.app;
  }
}

export default new Server();
