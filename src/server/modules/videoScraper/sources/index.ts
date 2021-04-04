import RequestModule from "../../request";
import GogoAnimeHubSourceModule from "./gogoanimehub";
import YoutubeSourceModule from "./youtube";
import _123MovieWikiSourceModule from './123movieWiki';

const YoutubeSource = new YoutubeSourceModule({requestModule: RequestModule});
const GogoAnimeHubSource= new GogoAnimeHubSourceModule({requestModule: RequestModule})
const _123MovieWikiSource = new _123MovieWikiSourceModule({requestModule: RequestModule});

export default {
    YoutubeSource,
    GogoAnimeHubSource,
    _123MovieWikiSource
}