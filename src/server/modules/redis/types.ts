import { RedisClient } from "redis";

/**
 * Exposes the async methods provided from promisifying the methods of RedisClient
 * By extending RedisClient, the base methods are usable from implementation.
 */
export interface IPromisifedRedisClient extends RedisClient {
    getAsync(key: string): Promise<string>;
    setAsync(key: string, value: string): Promise<number>;
    hvalsAsync(key: string): Promise<string[]>;
    hsetAsync(key: string, field: string, value: string): Promise<number>;
    hdelAsync(key: string, field: string): Promise<number>;
    hgetAsync(key: string, field: string): Promise<string>;
}