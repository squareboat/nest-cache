import { Injectable, OnModuleInit } from "@nestjs/common";
import { RedisDriver } from "./drivers/redis";
import { CacheDriver } from "./interfaces";
import { CacheMetadata } from "./metadata";

@Injectable()
export class CacheService implements OnModuleInit {
  static stores: Record<string, CacheDriver>;

  onModuleInit() {
    const { stores } = CacheMetadata.getData();
    CacheService.stores = {};
    for (const store in stores) {
      CacheService.stores[store] = new RedisDriver(stores[store]);
    }
  }
}
