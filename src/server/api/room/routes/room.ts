import { IExecuteable } from "src/types/IExecuteable";
import { RouteDependencies } from "src/types/api/RouteDependencies";
import { RoomControllerDependencies } from "../roomController";

/**
 * Room Route
 */
export default class RoomRoute implements IExecuteable {
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
        this.dependencies.router.get('/', async (req, res) => {
            res.sendStatus(200);
        })

        this.dependencies.router.get('/:roomCode', async(req, res) => {
            if (!req.params.roomCode) {
                return res.sendStatus(400);
            }

            const roomFound = await this.parentDependencies.roomService.getRoom(req.params.roomCode);
            if (roomFound) {
                res.json({
                    code: roomFound.code,
                    is_private: roomFound.is_private,
                    max_users: roomFound.max_users,
                    users: roomFound.users,
                    name : roomFound.name,
                    description : roomFound.description,
                    video_src: roomFound.video_src
                })
            }
            else{
                res.status(404).json({message: "Not Found"})   
            }
        });
    }
}