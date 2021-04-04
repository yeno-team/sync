import { IRequestModule, RequestOptions } from "src/server/modules/request/types";
import { IVideoSource } from "../../types";
import config from 'src/config';

export type YoutubeSourceDependencies = {
    requestModule: IRequestModule,
}

export class YoutubeSource implements IVideoSource {
    hostname: string = "www.youtube.com";

    constructor(private dependencies: YoutubeSourceDependencies) {}

    execute(url: string): Promise<string[]> {
        return new Promise(async (resolve, reject) => {
            const response = await this.getYoutubeLinkInfo(url);

            if (response && response.length >= 3) {
                try {
                    if (response[2].playerResponse["streamingData"] == null) {
                        return reject("YoutubeSource: No support for encrypted videos");
                    }

                    const formats = response[2].playerResponse.streamingData.formats;

                    const urls = formats.map((format) => format.url);
        
                    if (urls[0] == null) {
                        return reject("YoutubeSource: No support for encrypted videos");
                    }
        
                    return resolve(urls);
                } catch (e) {
                    return reject("YoutubeSource: Unexpected error occured, " + e.toString());
                }
            }
        });
    }

    private async getYoutubeLinkInfo(link: string): Promise<any> {
        const youtubeLink = new URL(link);
        const params = new URLSearchParams(youtubeLink.search);

        const youtubeInfoLink = new URL(`https://www.youtube.com/watch?v=${params.get("v")}&pbj=1`);
        
        const options: RequestOptions = {
            url: youtubeInfoLink.toString(),
            method: "POST",
            proxy: {
                host: config.proxy.host,
                port: Number(config.proxy.port),
                auth: config.proxy.auth
            }
        }

        const response = await this.dependencies.requestModule.request<any>(options);
        
        return response;
    }


}