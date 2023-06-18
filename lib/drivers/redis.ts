import IORedis from "ioredis";
import { CacheDriver, RedisDriverOption } from "../interfaces";

export class RedisDriver implements CacheDriver {
  private client: IORedis;

  constructor(private options: RedisDriverOption) {
    this.client = new IORedis({
      host: options.host,
      port: options.port,
      password: options.password,
      db: options.database,
    });
  }

  async get(key: string): Promise<any> {
    const value = await this.client.get(`${this.options.prefix}:::${key}`);
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }

  async set(
    key: string,
    value: string | Record<string, any>,
    ttlInSec?: number
  ): Promise<void> {
    const redisKey = `${this.options.prefix}:::${key}`;
    if (ttlInSec) {
      await this.client.set(redisKey, JSON.stringify(value), "EX", ttlInSec);
    }

    await this.client.set(redisKey, JSON.stringify(value));
  }

  async has(key: string): Promise<boolean> {
    const num = await this.client.exists(`${this.options.prefix}:::${key}`);
    return !!num;
  }

  async remember<T>(key: string, cb: Function, ttlInSec: number): Promise<T> {
    const exists = await this.has(key);
    if (exists) return this.get(key);

    const response = await cb();
    await this.set(key, response, ttlInSec);
    return response;
  }

  async rememberForever<T>(key: string, cb: Function): Promise<T> {
    const exists = await this.has(key);
    if (exists) return this.get(key);

    const response = await cb();
    await this.set(key, response);
    return response;
  }

  async forget(key: string): Promise<void> {
    await this.client.del(this.storeKey(key));
  }

  private storeKey(key: string): string {
    return `${this.options.prefix}:::${key}`;
  }
}
