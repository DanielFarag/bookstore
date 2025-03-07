import { connect } from "mongoose";
import config from "../../config/config.js";

export default () =>
  connect(config.mongoose.url)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
