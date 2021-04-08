import { IVideoScraper, IVideoSource } from "./types";

export type VideoScraperModuleDependencies = {
    sources: {[s: string]: IVideoSource}
}

export class VideoScraperModule implements IVideoScraper {
    constructor(private dependencies: VideoScraperModuleDependencies) {}

    getVideoSource(url: string): Promise<string[]> {
        return new Promise(async (resolve, reject) => {
            for (const source in this.dependencies.sources) {
                const sourceModule: IVideoSource = this.dependencies.sources[source];
                
                const videoUrl = new URL(url);
                
                if (videoUrl.hostname === sourceModule.hostname) {
                    return resolve(await sourceModule.execute(url));
                }
            }

            return reject("Unsupported website was requested!");
        });
    }
}