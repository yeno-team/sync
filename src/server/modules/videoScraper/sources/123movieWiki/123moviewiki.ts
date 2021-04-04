import { IRequestModule, RequestOptions } from "src/server/modules/request/types";
import { IVideoSource } from "../../types";

export type _123MovieWikiSourceDependencies = {
    requestModule: IRequestModule
}

export class _123MovieWikiSource implements IVideoSource {
    hostname: string = "123movies.wiki";

    constructor(private dependencies: _123MovieWikiSourceDependencies) {}

    execute(url: string): Promise<string[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const baseLink = new URL(url).toString();
                const baseHTML = await this.getPage(baseLink);
                const GetLink = await this.get123MovieGetLink(baseHTML);
                const GetLinkHTML = await this.getPage(GetLink);
                const playerLink = await this.getPlayerLink(GetLinkHTML);
                const sources = await this.getGoogleMp4File(playerLink);

                resolve([sources]);
            } catch (e) {
                reject(e);
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

    private async get(url: string): Promise<any> {
        const options : RequestOptions = {
            url
        };

        const html = await this.dependencies.requestModule.request<any>(options);

        return html;
    }

    private async get123MovieGetLink(html: string, mirror: boolean = false): Promise<string> {
        const getLinkRegex = /getlink\((.*)\)/gm;

        /**
         * matches[0-1] = sw
         * matches[2] = gomo
         */
        let matches = [];
        let m;
        
        while((m = getLinkRegex.exec(html)) !== null) {
            matches.push(m[1]);
        }


        /**
         * args
         * 0: id
         * 1: link type, gomo, sw
         * 2: video type, movie, tv
         * 3: season
         * 4: episode
         */
        const ProcessArgs = (array) => array.split(",").map(a => a.trim()).map(a => {let t = /'(.*)'|\d+/gm.exec(a);return t[1] == null ? t[0] : t[1]})
                
        let args;

        if (mirror) {
            args = ProcessArgs(matches[2])
        } else {
            args = ProcessArgs(matches[0]);
        }

        let json = await this.get(`https://123movies.wiki/ajax/get-link.php?id=${args[0]}&type=${args[2]}&link=${args[1]}${args[2] == 'tv' ? `&season=${args[3]}&episode=${args[4]}` : ''}`)

        if (json.src == null) {
            throw new Error("123MovieWiki: Unexpected Failure to grab video source")
        }

        const unescapedIframeString = unescape(json.src);

        const iframeSrcRegex = /src="(.*)"\sw/gm;

        const srcMatches = iframeSrcRegex.exec(unescapedIframeString);

        if (srcMatches[1]) {
            return srcMatches[1];
        } else {
            throw new Error("123MovieWiki: Could not get streaming world link");
        }
    }


    private async getPlayerLink(html: string): Promise<string> {
        const errorPageRegex = /report.php/gm;
        const vidplayerRegex = /<iframe src="(.*)" a/gm;

        const isErrorPage = errorPageRegex.test(html);

        if (isErrorPage) {
            // go to gomo
            throw new Error("123MovieWiki: Source could not be grabbed");
        } else {
            const matches = vidplayerRegex.exec(html);

            const vidplayerlink = "https:" + matches[1];

            return vidplayerlink;
        }
    }

    private async getGoogleMp4File(url: string): Promise<string> {
        const urlParsed = new URL(url);
        const urlParamSearch = new URLSearchParams(urlParsed.search);

        const id = urlParamSearch.get("id");

        if (id) {
            const vidnextUrl = "https://vidnext.net/download?id=" + id;

            const vidnextUrlHTML = await this.getPage(vidnextUrl);
            const mp4Regex = /"(.*).mp4"/gm;

            let matches = mp4Regex.exec(vidnextUrlHTML);

            return matches[0].split('"')[1];
        } else {
            throw new Error("123MovieWiki: Source could not be grabbed");
        }
    }
 }