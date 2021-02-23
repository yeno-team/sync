import { IExecuteable } from "src/types/IExecuteable";
import { RouteDependencies } from "src/types/api/RouteDependencies";
import { RoomControllerDependencies } from "../roomController";

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
      this.dependencies.router.post('/add', (req, res) => {
         const addedRoom = this.parentDependencies.roomService.addRoom({
             code: "123",
             name: req.body.name,
             max_users: req.body.max_users,
             users: [],
             room_password: req.body.room_password,
             is_private: req.body.is_private
         });

         if (!addedRoom) {
            res.status(500).json({message: "Could not create room"});
         }

         res.json(addedRoom);
      });
   }
}