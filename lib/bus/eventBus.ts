import { DomainEvent } from './events';
type Handler = (e: DomainEvent) => Promise<void>;
class MemoryBus {
  private handlers = new Map<string, Handler[]>();
  subscribe(type: string, h: Handler) {
    if (!this.handlers.has(type)) this.handlers.set(type, []);
    this.handlers.get(type)!.push(h);
  }
  async publish(event: DomainEvent) {
    const list = this.handlers.get(event.type) || [];
    for (const h of list) await h(event);
    // also publish wildcard
    const wild = this.handlers.get('*') || [];
    for (const h of wild) await h(event);
  }
}
export const eventBus = new MemoryBus();

// Production swap: if UPSTASH env set, use RedisBus
// See lib/bus/redisBus.ts for implementation
