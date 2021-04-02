import { IVideoScraper } from "./types";

export class VideoScraperModule implements IVideoScraper {
    getVideoSource(): Promise<string[]> {
        throw new Error("Method not implemented.");
    }
}