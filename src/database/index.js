import mongoose from "mongoose";
import config from "../../config.js";

export default () =>
  mongoose
    .connect(config.atlas_uri, {
      autoIndex: true,
    })
    .then((v) => {
      console.log("Connected to MongoDB");
    })
    .catch((er) => {
      console.log("Error connecting to MongoDB");
    });
