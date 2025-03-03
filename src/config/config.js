import "dotenv/config";

const HOST = process.env.MONGO_HOST;
const PORT = process.env.MONGO_PORT;
const DB = process.env.MONGO_DB;

const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  mongoose: {
    url: process.env.MONGO_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRATION,
  },
};

export default config;
