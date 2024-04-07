const { Redis } = require("ioredis");
const Logger = require("./logger");

module.exports = {
  connectToRedis: async () => {
    try {
      Logger.log("Trying to connect to Redis...", process.env.REDIS_URL);
      const redis = new Redis(process.env.REDIS_URL);

      await redis.ping();

      Logger.log("Connected to Redis");

      return redis;
    } catch (e) {
      Logger.error("Error while connecting to Redis:");
      Logger.error(e);
      process.exit(1);
    }
  },
};
