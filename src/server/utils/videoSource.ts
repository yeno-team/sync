import { IRequestModule, RequestOptions } from "../modules/request/types";
import httpsProxyAgent from 'https-proxy-agent'
import config from '../../config';

/**
 * Dependencies for ControllerUtility class
 */
export type VideoSourcetilityDependencies = {
    requestModule: IRequestModule
}

/**
 * Utility functions to help with randomness
 */
export class VideoSourceUtility {
    /**
     * Sets the dependencies type as a private variable of the class
     * @param dependencies 
     */
    constructor(
        private dependencies: VideoSourcetilityDependencies
    ) {}

    /**
     * Gets the direct link to the video for the youtube video link
     * @param link 
     */
    async getYoutubeLinkVideoSource(link: string, qualityLabel: string): Promise<string> {
        const youtubeLink = new URL(link);
        const params = new URLSearchParams(youtubeLink.search);

        const youtubeInfoLink = new URL(`https://www.youtube.com/get_video_info?html5=1&video_id=${params.get("v")}`);
        
        const options: RequestOptions = {
            url: youtubeInfoLink.toString(),
            httpsAgent: httpsProxyAgent({host:"45.95.99.20", port: "7580"}),
            proxy: {
                host: config.proxy.host,
                port: Number(config.proxy.port),
                auth: config.proxy.auth
            }
        }

        const response = await this.dependencies.requestModule.request<any>(options);
        
        if (response) {
            const info = this.qsToJson(response);
            const resp = JSON.parse(info.player_response);
            const found = resp.streamingData.formats.filter(format => format.qualityLabel == qualityLabel);


            return Promise.resolve(found ? found[0].url : resp.streamingData.formats[resp.streamingData.formats.length].url);
        }

        return Promise.reject("Could not get video link source")
    }

    /**
     * Converts query strings to json
     * CREDIT: https://codewithmark.com/learn-to-create-youtube-video-downloader
     * @param qs Query String
     */
    qsToJson(qs): any {
        var res = {};
        var pars = qs.split('&');
        var kv, k, v;
        for (const i in pars) {
            kv = pars[i].split('=');
            k = kv[0];
            v = kv[1];
            res[k] = decodeURIComponent(v);
        }
        return res;
    }
}