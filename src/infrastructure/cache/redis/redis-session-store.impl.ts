import _ from "lodash";
import type { RedisClientType } from "redis";
import type { SessionStore } from "~/application/ports/services/session-store.port";

export class RedisSessionStoreImpl implements SessionStore {
  private readonly KEY_PREFIX = "auth:session:user";

  constructor(
    private readonly redisClient: RedisClientType,
    private readonly defaultTTL: number // seconds
  ) {}

  private getKey(userId: string): string {
    return `${this.KEY_PREFIX}:${userId}`;
  }

  async set(userId: string, sessionId: string, ttl?: number): Promise<void> {
    const key = this.getKey(userId);
    const expiresIn = ttl ?? this.defaultTTL;

    await this.redisClient.set(key, _.trim(sessionId), {
      EX: expiresIn,
    });
  }

  async get(userId: string): Promise<string | null> {
    return this.redisClient.get(this.getKey(userId));
  }

  async delete(userId: string): Promise<void> {
    await this.redisClient.del(this.getKey(userId));
  }

  async isValid(userId: string, sessionId: string): Promise<boolean> {
    const storedSessionId = await this.get(userId);
    if (!storedSessionId) return false;
    return storedSessionId === _.trim(sessionId);
  }

  async touch(userId: string, ttl?: number): Promise<void> {
    const key = this.getKey(userId);
    const expiresIn = ttl ?? this.defaultTTL;
    await this.redisClient.expire(key, expiresIn);
  }
}