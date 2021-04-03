import { IVideoScraper, IVideoSource } from "./types";
import sources from './sources';

export class VideoScraperModule implements IVideoScraper {
    getVideoSource(url: string): Promise<string[]> {
        return new Promise(async (resolve, reject) => {
            try {
                for (const source in sources) {
                    const sourceModule: IVideoSource = sources[source];
                    
                    const videoUrl = new URL(url);
                    
                    if (videoUrl.hostname === sourceModule.hostname) {
                        return resolve(await sourceModule.execute(url));
                    }
                }

                return reject("Unsupported website was requested!");
            } catch(e) {
                return reject(e);
            }
        })
        
    }
}