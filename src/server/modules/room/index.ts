import redisModule from "../redis";
import { RoomRedisModule } from "./redisModule";


const RoomModule = new RoomRedisModule({ redis: redisModule });

export default RoomModule;