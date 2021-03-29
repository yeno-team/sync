import { IExecuteable } from "src/types/IExecuteable";
import { RouteDependencies } from "src/types/api/RouteDependencies";
import { RoomControllerDependencies } from "../roomController";
import { RoomRedisModule } from "src/server/modules/room/redisModule";

/**
 * Room List Route
 */
export default class RoomListRoute implements IExecuteable {
   /**
    * Sets Dependencies and Parent Dependencies as private members of the class
    * @param dependencies Dependencies
    * @param parentDependencies Parent Dependencies
    */
   constructor(
      private dependencies: RouteDependencies,
      private parentDependencies: RoomControllerDependencies
   ) { }
   
   /**
    * Sends list of rooms currently available
    */
   public execute() {
      this.dependencies.router.get('/list', async (req, res) => {
         res.send(await (await this.parentDependencies.roomService.getRoomList()).map((room) => {delete room.room_password; return room}));
      });
   }
}