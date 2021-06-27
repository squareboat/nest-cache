import { CacheDriver } from './interfaces';
import { CacheMetadata } from './metadata';
import { CacheService } from './service';

export class Cache {
  static store(store?: string): CacheDriver {
    const options = CacheMetadata.getData();
    return CacheService.stores[store || options.default];
  }
}

export function CacheStore(store?: string): CacheDriver {
  const options = CacheMetadata.getData();
  return CacheService.stores[store || options.default];
}
