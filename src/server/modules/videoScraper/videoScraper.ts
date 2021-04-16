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
                
                if (!this.validURL(url)) {
                    return reject("Invalid URL was requested!");
                }

                let videoUrl;

                try {
                    videoUrl = new URL(url);
                } catch (e) {
                    return reject(e.message);
                }
                
                if (videoUrl.hostname === sourceModule.hostname) {
                    return resolve(sourceModule.execute(url));
                }
            }

            return reject("Unsupported website was requested!");
        });
    }

    private validURL(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
          '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return !!pattern.test(str);
      }
}