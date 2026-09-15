import Redis from "ioredis"

const redis = new Redis(process.env.REDIS_URL)

redis.on("connect",()=>{
    console.log("connected to redis")
})

export default redis