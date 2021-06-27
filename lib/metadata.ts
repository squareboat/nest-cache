import { Inject, Injectable } from '@nestjs/common';
import { CACHE_OPTIONS } from './constants';
import { CacheOptions } from './interfaces';

@Injectable()
export class CacheMetadata {
  private static data: CacheOptions;

  constructor(@Inject(CACHE_OPTIONS) data: CacheOptions) {
    CacheMetadata.data = data;
  }

  static getData(): CacheOptions {
    return CacheMetadata.data;
  }
}
