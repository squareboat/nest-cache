## NestJS Cache

Sometimes, the data retrieval or computed tasks performed by your applications can be heavy, CPU intensive or time taking. In those cases, you may want to save it in a fast-read store so that you don't need to run the computation again and again. When the data is cached, it can be retrieved quickly on subsequent requests for the same data.

This package provides a multi-store cache provider for your NestJS application.

__Supported Queues__

- Redis
- Memcache (Coming Soon)
- RocksDB (Coming Soon)
- KeyDB (Coming Soon)

__Few Hightlights__

- ✅ Easy to setup and configure
- ✅ Handle multiple stores with ease
- ✅ Expressive API methods

## Installation
```py
# npm
npm i @squareboat/nest-cache

# yarn
yarn add @squareboat/nest-cache
```

For NestJS v6.7.x, please do

```py
# npm
npm i @squareboat/nest-cache^0.0.1

# yarn
yarn add @squareboat/nest-cache^0.0.1
```

## Configuration
Now that the installation is done, you need to configure the package as mentioned below.

### Synchronous Registration
You can register the cache module like below
```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { CacheModule } from '@libs/cache';

@Module({
  imports: [
    CacheModule.register({
        default: 'redis',
        stores: {
            redis: {
                driver: 'redis',
                host: process.env.REDIS_HOST,
                password: process.env.REDIS_PASSWORD,
                port: process.env.REDIS_PORT || 6379,
                database: process.env.REDIS_DB || 0,
                prefix: 'nestjs_boilerplate',
            },
        }
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

### Asynchronous Registration (Recommended)
You need to create a file, `config/cache.ts`

```typescript
// config/cache.ts

import { registerAs } from '@nestjs/config';
import { basePath } from '@libs/core';
import { CacheOptions } from '@libs/cache';

export default registerAs(
  'cache',
  () =>
    ({
      default: 'redis',
      stores: {
        redis: {
          driver: 'redis',
          host: process.env.REDIS_HOST || '127.0.0.1',
          password: process.env.REDIS_PASSWORD || undefined,
          port: process.env.REDIS_PORT || 6379,
          database: process.env.REDIS_DB || 0,
          prefix: 'nestjs_boilerplate',
        },
      },
    } as CacheOptions),
);
```

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from '@config/index';
import { CacheModule } from '@libs/cache';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: config,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (config: ConfigService) 
        => config.get('cache'),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

## Usage

To access the store, you can use the `CacheStore` method or `Cache` class.

```typescript
// method
import { CacheStore } from '@squareboat/nest-cache';
const store = CacheStore('redis');

// class
import { Cache } from '@squareboat/nest-cache';
const store = Cache.store('redis')
```
If no store name is passed, then default store is returned.

Now, you can set data in the store using `.set()` method.
```typescript
// saved forever in the store
await CacheStore().set('reset_password_token', 'abcd123456');

// saved for 2 mins or 120 seconds in the store
await CacheStore().set('reset_password_token', 'abcdef12345678', 120);
```

To fetch the data from store, you can use `.get()` method.

```typescript
await CacheStore().set('reset_password_token'); 
// will return 'abcd123456'
```

To check if key exists in the store, you can use `.has()` method

```typescript
await CacheStore().has('reset_password_token');
// will return `true` if found, else `false`
```

To remove a key from the store, use `.forget()` method

```typescript
await CacheStore().forget('reset_password_token');
```

There will be cases where you may want to process something and then save it to store. 

Thankfully, this package provides two methods, `.remember()` and `.rememberForever()` method which you can use to handle this case automatically.

```typescript
const cb = () => {
  return 'some_random_generated_token';
}

await CacheStore().rememberForever('reset_password_token', cb);

await CacheStore().remember('reset_password_token', cb, 120);
```

Notice the callback `cb` passed to the `rememberForever` method, it will be processed and the value returned by the callback will be serialized and saved to the store automatically.

The only difference between the `rememberForever` and `remember` method is the expiry time (3rd argument) of the key in the store.

## Contributing

To know about contributing to this package, read the guidelines [here](./CONTRIBUTING.md)


## About Us

We are a bunch of dreamers, designers, and futurists. We are high on collaboration, low on ego, and take our happy hours seriously. We'd love to hear more about your product. Let's talk and turn your great ideas into something even greater! We have something in store for everyone. [☎️ 📧 Connect with us!](https://squareboat.com/contact)

## License

The MIT License. Please see License File for more information. Copyright © 2020 SquareBoat.

Made with ❤️ by [Squareboat](https://squareboat.com)
