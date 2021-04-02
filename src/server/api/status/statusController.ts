import { Router } from "express";
import { Logger } from "../../modules/logger/logger";
import { ControllerUtility } from "src/server/utils/controllers/controllers";
import { IController } from "src/types/api/IController";
import { VideoSourceUtility } from "src/server/utils/videoSource/videoSource";

/**
 * The dependencies for StatusController class
 */
export type StatusControllerDependencies = {
    controllerUtility: ControllerUtility,
    logger: Logger,
    videoSourceUtility: VideoSourceUtility
}

export class StatusController implements IController {
    private _router: Router;

    /**
     * Sets dependencies as a private variable of the class
     * @param dependencies Dependencies
     */
    constructor(
        private dependencies: StatusControllerDependencies
    ) {}
    
    public async handler(app: Router): Promise<void> {
        try {
            this._router = Router();

            app.use("/status", this._router);

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
