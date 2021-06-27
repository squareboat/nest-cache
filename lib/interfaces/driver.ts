export interface CacheDriver {
  /**
   * Return the value stored corresponding to the key
   * @param key
   */
  get(key: string): Promise<any>;

  /**
   * Store the value with the passed key
   * @param key
   * @param value
   * @param ttlInSec
   */
  set(
    key: string,
    value: Record<string, any> | string,
    ttlInSec?: number
  ): Promise<void>;

  /**
   * Check for existence of a particular key
   * @param key
   */
  has(key: string): Promise<boolean>;

  remember(key: string, cb: Function, ttlInSec: number): Promise<void>;

  rememberForever(key: string, cb: Function): Promise<void>;

  forget(key: string): Promise<void>;
}
