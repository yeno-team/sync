import { Router } from "express";
import { Logger } from "../../modules/logger/logger";
import { ControllerUtility } from "src/server/utils/controllers/controllers";
import { IController } from "src/types/api/IController";
import { RoomService } from "./roomService";

/**
 * The dependencies for RoomController class
 */
export type RoomControllerDependencies = {
    controllerUtility: ControllerUtility,
    logger: Logger,
    roomService: RoomService
}

export class RoomController implements IController {
    private _router: Router;

    /**
     * Sets dependencies as a private variable of the class
     * @param dependencies Dependencies
     */
    constructor(
        private dependencies: RoomControllerDependencies
    ) {}
    
    public async handler(app: Router): Promise<void> {
        try {
            this._router = Router();

            app.use("/room", this._router);

            this.dependencies.controllerUtility.setUpController({
                router: this._router,
                dirname: __dirname,
                parentDependencies: this.dependencies,
            });
        } catch (e) {
            this.dependencies.logger.error(e);
        }
    }
}