import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { CACHE_OPTIONS } from './constants';
import {
  CacheAsyncOptions,
  CacheAsyncOptionsFactory,
  CacheOptions,
} from './interfaces';
import { CacheMetadata } from './metadata';
import { CacheService } from './service';

@Module({})
export class CacheModule {
  /**
   * Register options
   * @param options
   */
  static register(options: CacheOptions): DynamicModule {
    return {
      global: options.isGlobal || false,
      module: CacheModule,
      providers: [
        CacheService,
        CacheMetadata,
        { provide: CACHE_OPTIONS, useValue: options },
      ],
    };
  }

  /**
   * Register Async Options
   */
  static registerAsync(options: CacheAsyncOptions): DynamicModule {
    return {
      global: options.isGlobal || false,
      module: CacheModule,
      imports: options.imports || [],
      providers: [
        this.createStorageOptionsProvider(options),
        ...(options.useClass ? [{ provide: options.useClass, useClass: options.useClass }] : []),
        CacheService,
        CacheMetadata,
      ],
    };
  }

  private static createStorageOptionsProvider(
    options: CacheAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: CACHE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    const inject = [
      (options.useClass || options.useExisting) as Type<CacheAsyncOptionsFactory>,
    ];

    return {
      provide: CACHE_OPTIONS,
      useFactory: async (optionsFactory: CacheAsyncOptionsFactory) =>
        await optionsFactory.createCacheOptions(),
      inject,
    };
  }
}
