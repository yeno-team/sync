// import { IRequestModule, RequestOptions } from "../../modules/request/types";
// import cheerio from "cheerio";
// import config from '../../../config';
// import { url } from "inspector";

// /**
//  * Dependencies for VideoSourceUtility class
//  */
// export type VideoSourceUtilityDependencies = {
//     requestModule: IRequestModule
// }

// export type VideoSourceMethod = {
//     hostnames: string[],
//     name: string
// }

// export enum QualityLabel {
//     "360p",
//     "720p",
//     "1080p"
// }

// /**
//  * Utility functions to help with Video Sources
//  */
// export class VideoSourceUtility {
//     private videoSourceMethods: VideoSourceMethod[] = [];
//     /**
//      * Sets the dependencies type as a private variable of the class
//      * @param dependencies 
//      */
//     constructor(
//         private dependencies: VideoSourceUtilityDependencies
//     ) {}

//     /** 
//      *  Handles linking to the video source method by its hostname 
//      */ 
//     async getVideoSource(link: string, qualityLabel?: QualityLabel): Promise<string[]> {
//         const videoMethods: VideoSourceMethod[] = [
//             // YOUTUBE
//             {
//                 hostnames: [ "www.youtube.com" ],
//                 name: "youtube"
//             },
//             // GOGOANIMEHUB
//             {
//                 hostnames: ["www9.gogoanimehub.tv"],
//                 name: "gogoanimehub"
//             }
//         ]
        
//         const url = new URL(link);

//         console.log(url.hostname);


//         const source = videoMethods.filter(method => method.hostnames.indexOf(url.hostname) !== -1);

//         /**
//          * Couldn't find a matching source method for that hostname
//          */
//         if (source.length <= 0) {
//             throw (new Error("Unknown video website"));
//         }

//         let videoSourceMethod = source[0].name;

//         switch(videoSourceMethod) {
//             case "youtube":
//                 return await this.getYoutubeVideoSource(link, qualityLabel);
//             case "gogoanimehub":
//                 return await this.getGoGoAnimeHubVideoSource(link);
//         }
//     }

//     /**
//      * Gets the direct link to the video for the youtube video link
//      * @param link 
//      */
//     async getYoutubeVideoSource(link: string, qualityLabel: QualityLabel): Promise<string[]> {
        
        
       

//         return Promise.reject("Could not get video link source")
//     }

//     async getGoGoAnimeHubVideoSource(link : string) : Promise<Array<string>> {
//         const websiteLink = new URL(link);
        
//         const options : RequestOptions = {
//             url : websiteLink.toString()
//         }

//         const html = await this.dependencies.requestModule.request<any>(options)
        
//         const streamingLinkHtml = await this.dependencies.requestModule.request<any>(streamingLinkReqOpts)

//         $ = cheerio.load(streamingLinkHtml);

//         /**
//          * Find the play link inside the main player's page source
//          */

//         const gogoPlayLink = "https:" + $('.linkserver')[1].attribs["data-video"];

//         if (!gogoPlayLink) {
//             return Promise.reject("GoGoAnimeHub: Could not get play link")
//         }

//         const gogoPlayReqOpts : RequestOptions = {
//             url : new URL(gogoPlayLink).toString(),
//         }
        
//         const gogoPlayHtml = await this.dependencies.requestModule.request<any>(gogoPlayReqOpts);
        
//         const sourceRegex = /file: '(.*)',l/gm;

//         /**
//          * Look for all the matches to the video source regex
//          */
//         const matches = [];
//         let match;
        
//         while((match = sourceRegex.exec(gogoPlayHtml)) !== null) {
//             matches.push(match[1]);
//         }

//         return [...matches];
//     }
// }