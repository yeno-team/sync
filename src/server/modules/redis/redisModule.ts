import redis from 'redis';
import { Logger } from '../logger/logger';
import { promisifyAll } from 'bluebird';
import { IPromisifedRedisClient } from './types';

export type RedisModuleDependencies = {
    logger: Logger
}

export class RedisModule {
    private _client: IPromisifedRedisClient;

    constructor(private dependencies: RedisModuleDependencies, clientConfig: redis.ClientOpts) {
        this._client = promisifyAll(redis.createClient(clientConfig));

        this._client.on('error', err => {
            this.dependencies.logger.error(err);
        });

        this._client.on('connect', () => {
            this.dependencies.logger.log("Redis Client Connected");
            this._client.flushall();
        });
    }

    public getClient = () => this._client;
}