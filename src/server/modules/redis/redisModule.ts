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
        /**
         * Promisified all methods in the client after creating it.
         * This creates the async versions of the methods in the client.
         * However, this isn't type safe as the methods are added dynamically.
         * To fix this, I created an interface that extends the redis client,
         * manually defining the async methods inside the interface allows usage.
         */
        this._client = promisifyAll(redis.createClient(clientConfig));

        this._client.on('error', err => {
            this.dependencies.logger.error(err);
        });

        this._client.on('connect', () => {
            this.dependencies.logger.log("Redis Client Connected");

            /**
             * Flushing all when it connects, ensures a clean redis instance.
             */
            this._client.flushall();
        });
    }

    /**
     * getter for the redis client
     * @returns client A Promisified Redis Client
     */
    public getClient = () => this._client;
}