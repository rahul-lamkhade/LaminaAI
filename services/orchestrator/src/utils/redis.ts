// utils/redis.ts
import Redis from 'ioredis';

const redis = new Redis({
  host: 'redis', // same name as docker service
  port: 6379,
}); // defaults to localhost:6379

export default redis;
