import { Logger } from '../logger/logger';
import { RedisModule } from './redisModule';
import config from '../../../config';

const redisModule = new RedisModule({logger: new Logger()}, {
    host: config.redis.host,
    port: parseInt(config.redis.port),
    password: config.redis.password
});

export default redisModule;