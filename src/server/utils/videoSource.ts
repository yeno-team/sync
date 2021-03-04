import { IRequestModule, RequestOptions } from "../modules/request/types";
import cheerio from "cheerio";
import config from '../../config';

/**
 * Dependencies for VideoSourceUtility class
 */
export type VideoSourceUtilityDependencies = {
    requestModule: IRequestModule
}

export type VideoSourceMethod = {
    hostnames: string[],
    name: string
}

export enum QualityLabel {
    "360p",
    "720p",
    "1080p"
}

/**
 * Utility functions to help with Video Sources
 */
export class VideoSourceUtility {
    private videoSourceMethods: VideoSourceMethod[] = [];
    /**
     * Sets the dependencies type as a private variable of the class
     * @param dependencies 
     */
    constructor(
        private dependencies: VideoSourceUtilityDependencies
    ) {}

    /** 
     *  Handles linking to the video source method by its hostname 
     */ 
    async getVideoSource(link: string, qualityLabel?: QualityLabel): Promise<string[]> {
        const videoMethods: VideoSourceMethod[] = [
            // YOUTUBE
            {
                hostnames: [ "www.youtube.com" ],
                name: "youtube"
            }
        ]
        
        const url = new URL(link);

        console.log(url.hostname);


        const source = videoMethods.filter(method => method.hostnames.indexOf(url.hostname) !== -1);

        /**
         * Couldn't find a matching source method for that hostname
         */
        if (source.length <= 0) {
            throw (new Error("Unknown video website"));
        }

        let videoSourceMethod = source[0].name;

        switch(videoSourceMethod) {
            case "youtube":
                return await this.getYoutubeVideoSource(link, qualityLabel);
        }
    }

    /**
     * Gets the direct link to the video for the youtube video link
     * @param link 
     */
    async getYoutubeVideoSource(link: string, qualityLabel: QualityLabel): Promise<string[]> {
        const youtubeLink = new URL(link);
        const params = new URLSearchParams(youtubeLink.search);

        const youtubeInfoLink = new URL(`https://www.youtube.com/get_video_info?html5=1&video_id=${params.get("v")}`);
        
        const options: RequestOptions = {
            url: youtubeInfoLink.toString(),
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

            if (resp.streamingData == null) {
                return Promise.reject("Could not get video link source")
            }

            const found = resp.streamingData.formats.filter(format => format.qualityLabel == qualityLabel);


            return Promise.resolve(found ? [found[0].url] : [resp.streamingData.formats[resp.streamingData.formats.length].url]);
        }

        return Promise.reject("Could not get video link source")
    }

    async getKickassAnimeVideoSource(link : string) : Promise<Array<string>> {
        const kickAssAnimeLink = new URL(link);
        
        const options : RequestOptions = {
            url : kickAssAnimeLink.toString(),
            
            // send proxies later
        }

        const html = await this.dependencies.requestModule.request<any>(options)
        const $ = cheerio.load(html)

        
        return [];
    }

    /**
     * Converts query strings to json
     * CREDIT: https://codewithmark.com/learn-to-create-youtube-video-downloader
     * @param qs Query String
     */
    private qsToJson(qs): any {
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