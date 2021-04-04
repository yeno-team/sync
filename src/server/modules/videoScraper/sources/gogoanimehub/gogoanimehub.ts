import cheerio from "cheerio";
import { IRequestModule, RequestOptions } from "src/server/modules/request/types";
import { IVideoSource } from "../../types";



export type GogoAnimeHubSourceDependencies = {
    requestModule: IRequestModule
}

export class GogoAnimeHubSource implements IVideoSource {
    hostname: string = "www9.gogoanimehub.tv";

    constructor(private dependencies: GogoAnimeHubSourceDependencies) {}

    execute(url: string): Promise<string[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const baseLink = new URL(url).toString();

                const baseHTML = await this.getPage(baseLink);
                const streamingLink = await this.getIframeSrc(baseHTML);
                const streamingLinkHTML = await this.getPage(streamingLink);
                const playLink = await this.getPlayLink(streamingLinkHTML);
                const sources = await this.getSourceUrls(playLink);

                return resolve([sources]);
            } catch(e) {
                return reject(e);
            }
        });
    }

    private async getPage(url: string): Promise<string> {
        const options : RequestOptions = {
            url
        };

        const html = await this.dependencies.requestModule.request<string>(options);

        return html;
    }

    private async getIframeSrc(html: string): Promise<string> {
        let $ = cheerio.load(html);

        const streamingLink = $('iframe').attr('src');

        if (!streamingLink) {
            throw (new Error("GoGoAnimeHub: Could not get video streaming link"));
        }

        return "https:" + streamingLink;
    }

    /**
    * Find the play link inside the main player's page source
    */
    private async getPlayLink(html: string): Promise<string> {
        let $ = cheerio.load(html);

        const gogoPlayLink = "https:" + $('.linkserver')[1].attribs["data-video"];

        if (!gogoPlayLink) {
            throw (new Error("GoGoAnimeHub: Could not get play link"));
        }

        return gogoPlayLink;
    }

    /**
    * Look for all the matches to the video source regex
    */
    private async getSourceUrls (url: string): Promise<string> {
        const sourceRegex = /"(.*).mp4.*"/gm;
        const urlParsed = new URL(url);
        const urlParamSearch = new URLSearchParams(urlParsed.search);

        const id = urlParamSearch.get("id");

        if (id) {
            const gogoPlayUrl = "https://gogo-play.net/download?id=" + id;

            const gogoPlayHTML = await this.getPage(gogoPlayUrl);

            const matches: string[] = sourceRegex.exec(gogoPlayHTML);

            return matches[0].split('"')[1];
        } else {
            throw new Error("GogoAnimeHub: Source could not be grabbed");
        }
        
    }
}