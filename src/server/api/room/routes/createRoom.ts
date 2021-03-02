import { IExecuteable } from "src/types/IExecuteable";
import { RouteDependencies } from "src/types/api/RouteDependencies";
import { RoomControllerDependencies } from "../roomController";

/**
 * Room Add Route
 */
export default class RoomCreateRoute implements IExecuteable {
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
    * Attempt to create a new room
    */
   public execute() {
      this.dependencies.router.post('/create', (req, res) => {
         const options = {
            name: req.body.name,
            description : req.body.description,
            is_private: String(req.body.is_private) == 'true',
            room_password: req.body.room_password,
            max_users: Number(req.body.max_users)
         }

         /**
          * Temporary Validation
          * May change how validation works in future
          */
         if (
            typeof options.is_private != 'boolean' ||
            typeof options.description != 'string' || 
            typeof options.max_users != 'number' ||
            typeof options.name != 'string' ||
            typeof options.room_password != 'string'
         ) {
            return res.status(500).json({message: "Invalid Body Arguments"})
         }
         // ----------------

         const addedRoom = this.parentDependencies.roomService.addRoom({
             code: "",
             name: options.name,
             description : options.description,
             max_users: options.max_users,
             users: [],
             room_password: options.room_password,
             is_private: options.is_private
         });

         if (!addedRoom) {
            res.status(500).json({message: "Could not create room"});
         }

         res.json(addedRoom);
      });
   }
}