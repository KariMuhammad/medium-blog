import express from "express";

import firebase from "firebase-admin";

import morgan from "morgan";

import cors from "cors";

import config from "../config.js";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const serviceAccount = require("../medium-clone-d469e-firebase-adminsdk-7bii4-126b1954cb.json");

import setup_db from "./database/index.js";

import auth from "./features/auth/index.js";
import { generateUploadUrl } from "./utils/index.js";

class Server {
  constructor() {
    this.app = express();
  }

  setup_db() {
    setup_db();
  }

  setup_google_auth() {
    firebase.initializeApp({
      credential: firebase.credential.cert(serviceAccount),
    });
  }

  setup_aws_s3_route() {
    this.app.get("/get-s3-url", async (req, res) => {
      try {
        const url = await generateUploadUrl();
        return res.status(200).json({ url });
      } catch (error) {
        console.log("Error", error);
        return res.status(500).json({ error: error.message });
      }
    });
  }

  setup_standard_middleware() {
    this.app.use(cors());
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
    this.setup_aws_s3_route();
    this.app.use("/auth", auth.router);
  }

  start() {
    this.setup_db();
    this.setup_server();
    this.setup_google_auth();
    this.setup_standard_middleware();
    this.mountRoutes();

    return this;
  }

  getApp() {
    return this.app;
  }
}

export default new Server();
