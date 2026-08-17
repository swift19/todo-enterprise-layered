// Production Bus for Vercel serverless - uses Upstash Redis
import { Redis } from '@upstash/redis';
import { DomainEvent } from './events';
export class RedisBus {
  private redis = Redis.fromEnv();
  async publish(event: DomainEvent) {
    await this.redis.publish('domain-events', JSON.stringify(event));
  }
  // Subscribe via separate worker / QStash - see docs
}
