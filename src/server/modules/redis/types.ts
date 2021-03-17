import { RedisClient } from "redis";

const client = new RedisClient({});



export interface IPromisifedRedisClient extends RedisClient {
    getAsync(key: string): Promise<string>;
    setAsync(key: string, value: string): Promise<number>;
    hvalsAsync(key: string): Promise<string[]>;
    hsetAsync(key: string, field: string, value: string): Promise<number>;
    hdelAsync(key: string, field: string): Promise<number>;
    hgetAsync(key: string, field: string): Promise<string>;
}