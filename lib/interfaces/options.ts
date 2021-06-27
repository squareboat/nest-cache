import { CacheOptionsFactory, ModuleMetadata, Type } from '@nestjs/common';

export interface RedisDriverOption {
  driver: 'redis';
  host: string;
  password: string;
  port: number;
  database: number;
  prefix: string;
}

export interface CacheOptions {
  isGlobal?: boolean;
  default: string;
  stores: {
    [key: string]: RedisDriverOption;
  };
}

export interface CacheAsyncOptionsFactory {
  createCacheOptions(): Promise<CacheOptions> | CacheOptions;
}

export interface CacheAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  isGlobal: boolean;
  useExisting?: Type<CacheOptions>;
  useClass?: Type<CacheOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<CacheOptions> | CacheOptions;
  inject?: any[];
}
