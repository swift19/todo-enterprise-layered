// Cache Adapter - Swappable: Memory for dev, Upstash Redis for prod
let memory = new Map<string, { v: any; exp: number }>();
export const cacheAdapter = {
  async get(key: string) {
    if (process.env.UPSTASH_REDIS_REST_URL) {
      const { Redis } = await import('@upstash/redis');
      const redis = Redis.fromEnv();
      return redis.get(key);
    }
    const entry = memory.get(key);
    if (!entry) return null;
    if (Date.now() > entry.exp) { memory.delete(key); return null; }
    return entry.v;
  },
  async set(key: string, val: any, ttlSec = 60) {
    if (process.env.UPSTASH_REDIS_REST_URL) {
      const { Redis } = await import('@upstash/redis');
      const redis = Redis.fromEnv();
      return redis.set(key, val, { ex: ttlSec });
    }
    memory.set(key, { v: val, exp: Date.now() + ttlSec * 1000 });
  },
  async invalidate(pattern: string) {
    for (const k of memory.keys()) if (k.includes(pattern)) memory.delete(k);
  }
};
