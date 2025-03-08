import "dotenv/config";


const auth = process.env.MONGO_USER ? `${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@` : "";

const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3001,
  mongoose: {
    url: `mongodb://${auth}${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRATION,
  },
  mail: {
    sender: process.env.MAIL_SENDER,
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    username: process.env.MAIL_USERNAME,
    password: process.env.MAIL_PASSWORD,
  },
  redis:{
    url: `redis://${process.env.REDIS_HOST || "localhost"}:${process.env.REDIS_PORT || 6379}`,
  }
};

export default config;
