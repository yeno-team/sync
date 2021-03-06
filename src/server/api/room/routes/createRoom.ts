import { IExecuteable } from "src/types/IExecuteable";
import { RouteDependencies } from "src/types/api/RouteDependencies";
import { RoomControllerDependencies } from "../roomController";
import rateLimit from 'express-rate-limit';

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
      const createRateLimit = rateLimit({
         windowMs: 60 * 60 * 1000, // 1 hour window
         max: 100, // start blocking after 5 requests
         message:
            "Too many rooms created from this IP, please try again after an hour"
      })

      this.dependencies.router.post('/create', createRateLimit, async (req, res) => {
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

         const addedRoom = await this.parentDependencies.roomService.addRoom({
             code: "",
             name: options.name,
             description : options.description,
             max_users: options.max_users,
             users: [],
             room_password: options.room_password,
             is_private: options.is_private,
             video_src: ""
         });

         if (!addedRoom) {
            res.status(500).json({message: "Could not create room"});
         }

         res.json(addedRoom);
      });
   }
}