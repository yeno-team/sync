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

    /**
     * Get emote data from its code
     * @param {string} code - emotes code
     * @returns 
     */
    const getEmote = (code) => {
        const emote = emotes.filter(emote => emote.code == code);

        return emote && emote[0];
    }

    return { emotes, getEmote}
}

export default useEmotes;