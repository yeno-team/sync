import { IExecuteable } from "src/types/IExecuteable";
import { RouteDependencies } from "src/types/api/RouteDependencies";
import { StatusControllerDependencies } from "../statusController";

/**
 * Status Route
 */
export default class StatusRoute implements IExecuteable {
   /**
    * Sets Dependencies and Parent Dependencies as private members of the class
    * @param dependencies Dependencies
    * @param parentDependencies Parent Dependencies
    */
   constructor(
      private dependencies: RouteDependencies,
      private parentDependencies: StatusControllerDependencies
   ) { }
   
   /**
    * Sends the status of the api as a Status Code when requesting /api/status/
    */
   public execute() {
      this.dependencies.router.get('/', (req, res) => {
         res.sendStatus(200);
      });

      this.dependencies.router.post('/hi' , async (req , res) => {
         const { link } = req.body;
         const response = await this.parentDependencies.videoSourceUtility.getKickassAnimeVideoSource(link)
         res.status(200).json(response)
      })
   }
}