import { useEffect, useState } from "react";
import { getEmoteImageUrlFromId } from "../api/emote/emoteService";
import config from '../config';

const useEmotes = () => {
    const [emotes, setEmotes] = useState();

    useEffect(() => {
        setEmotes(config.emotes.map(emote => {
            return {
                url: getEmoteImageUrlFromId(emote.id),
                code: emote.code
            }
        }));
    }, []);

    return { emotes }
}

export default useEmotes;