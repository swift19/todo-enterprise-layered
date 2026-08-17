import { Redis } from "@upstash/redis";

const redis = process.env.UPSTASH_REDIS_REST_URL ? Redis.fromEnv() : null;

type Handler = (payload: any) => void;
const memoryHandlers = new Map<string, Handler[]>();

export const bus = {
  async publish(event: string, payload: any) {
    // 1. In-memory (for local dev)
    memoryHandlers.get(event)?.forEach((h) => h(payload));

    // 2. Upstash (for Vercel)
    if (redis) {
      await redis.publish(event, payload);
    }
  },
  subscribe(event: string, handler: Handler) {
    const list = memoryHandlers.get(event) || [];
    list.push(handler);
    memoryHandlers.set(event, list);
  },
};
