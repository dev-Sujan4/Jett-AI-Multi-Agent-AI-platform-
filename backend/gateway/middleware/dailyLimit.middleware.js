import redis from "../../shared/redis/redis.js";

const MAX_REQUESTS = 4;
const WINDOW_SECONDS = 24 * 60 * 60; // 24 hours

const dailyLimit = async (req, res, next) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorised",
      });
    }

    const key = `agent-limit:${userId}`;

    const count = await redis.incr(key);

    // Start the 24-hour window only when the key is first created
    if (count === 1) {
      await redis.expire(key, WINDOW_SECONDS);
    }

    if (count > MAX_REQUESTS) {
      return res.status(429).json({
        message: "Daily request limit exceeded. Maximum 4 requests allowed.",
      });
    }

    next();
  } catch (error) {
    console.error("Daily limit error:", error);

    return res.status(500).json({
      message: "Rate limit error",
    });
  }
};

export default dailyLimit;

